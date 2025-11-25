import {pool} from "../db.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

dotenv.config();

/** Register new user account and send OTP verification email */
export async function register(req, res) {
    try {
        const {name, email, password} = req.body;
        if (!name || !email || !password)
            return res.status(400).json({ok: false, message: "Thiếu thông tin"});

        const [existing] = await pool.execute(
            "SELECT * FROM users WHERE email = :email",
            {email}
        );
        if (existing.length)
            return res.status(400).json({ok: false, message: "Email đã tồn tại"});

        const bcrypt = (await import("bcrypt")).default;
        const hashed = await bcrypt.hash(password, 10);

        await pool.execute(
            "INSERT INTO users (username, email, pw, auth_provider, roles, verified) VALUES (:name, :email, :hashed, 'local', 'customer', 0)",
            {name, email, hashed}
        );

        // Generate 6-digit OTP valid for 5 minutes
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        await pool.execute(
            "INSERT INTO otp_codes (email, otp_code, purpose, expires_at, is_used, attempts, locked_until) VALUES (:email, :otp, 'register', :expiresAt, 0, 0, NULL)",
            {email, otp, expiresAt}
        );

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: `"DACNA Support" <${process.env.MAIL_USER}>`,
            to: email,
            subject: "Mã xác thực đăng ký tài khoản",
            text: `Mã OTP của bạn là: ${otp} (hiệu lực trong 5 phút)`,
        });

        return res.json({
            ok: true,
            message:
                "Đăng ký thành công. Vui lòng kiểm tra email để xác minh tài khoản.",
        });
    } catch (err) {
        console.error("Lỗi register:", err);
        res.status(500).json({ok: false, message: "Lỗi máy chủ khi đăng ký"});
    }
}

/** Generate random 6-digit OTP code */
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

/** Send OTP via email using nodemailer */
async function sendOTP(email, otp) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"DACNA Support" <${process.env.MAIL_USER}>`,
        to: email,
        subject: "Mã OTP xác thực tài khoản",
        text: `Mã OTP của bạn là: ${otp}\nHiệu lực trong 5 phút.`,
    };

    await transporter.sendMail(mailOptions);
}

/** Request new OTP (register or password reset) with rate limiting */
async function requestOtpGeneric(req, res, purpose) {
    try {
        const {email} = req.body;
        if (!email)
            return res.status(400).json({ok: false, message: "Thiếu email"});

        // Rate limit: prevent spam (1 OTP per minute)
        const [recent] = await pool.execute(
            "SELECT * FROM otp_codes WHERE email = :email AND purpose = :purpose ORDER BY id DESC LIMIT 1",
            {email, purpose}
        );

        if (recent[0] && new Date() - new Date(recent[0].created_at) < 60 * 1000)
            return res.status(429).json({
                ok: false,
                message: "Vui lòng chờ 1 phút trước khi yêu cầu mã OTP mới.",
            });

        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        await pool.execute(
            "INSERT INTO otp_codes (email, otp_code, purpose, expires_at, is_used, attempts, locked_until) VALUES (:email, :otp, :purpose, :expiresAt, 0, 0, NULL)",
            {email, otp, purpose, expiresAt}
        );

        await sendOTP(email, otp);
        res.json({ok: true, message: "OTP đã được gửi qua email."});
    } catch (err) {
        console.error("Lỗi gửi OTP:", err);
        res.status(500).json({ok: false, message: "Lỗi máy chủ khi gửi OTP"});
    }
}

export async function requestRegisterOTP(req, res) {
    await requestOtpGeneric(req, res, "register");
}

export async function requestResetOTP(req, res) {
    await requestOtpGeneric(req, res, "reset");
}

/** Verify OTP code with rate limiting (3 attempts before 2-minute lockout) */
async function verifyOtpGeneric(req, res, purpose) {
    try {
        const {email, otp, newPassword} = req.body;
        if (!email || !otp)
            return res.status(400).json({ok: false, message: "Thiếu thông tin"});

        const [rows] = await pool.execute(
            "SELECT * FROM otp_codes WHERE email = :email AND purpose = :purpose ORDER BY id DESC LIMIT 1",
            {email, purpose}
        );
        const record = rows[0];
        if (!record)
            return res.status(400).json({
                ok: false,
                message: "Không tìm thấy OTP, vui lòng yêu cầu lại.",
            });

        // Check if temporarily locked due to too many failed attempts
        if (record.locked_until && new Date(record.locked_until) > new Date()) {
            const diff = Math.ceil(
                (new Date(record.locked_until) - new Date()) / 1000
            );
            return res.status(429).json({
                ok: false,
                message: `Bạn nhập sai quá nhiều. Thử lại sau ${diff} giây.`,
            });
        }

        if (new Date(record.expires_at) < new Date())
            return res.status(400).json({ok: false, message: "OTP đã hết hạn"});

        if (record.is_used)
            return res
                .status(400)
                .json({ok: false, message: "OTP đã được sử dụng"});

        // Handle incorrect OTP with attempt tracking
        if (record.otp_code !== otp) {
            const attempts = record.attempts + 1;
            let lockedUntil = null;
            if (attempts >= 3) lockedUntil = new Date(Date.now() + 2 * 60 * 1000);

            await pool.execute(
                "UPDATE otp_codes SET attempts = :attempts, locked_until = :lockedUntil WHERE id = :id",
                {attempts, lockedUntil, id: record.id}
            );

            return res.status(400).json({
                ok: false,
                message:
                    attempts >= 3
                        ? "Bạn đã nhập sai quá 3 lần, OTP bị khóa 2 phút."
                        : `OTP sai (${attempts}/3 lần).`,
            });
        }

        // OTP verified successfully
        await pool.execute(
            "UPDATE otp_codes SET is_used = 1, attempts = 0, locked_until = NULL WHERE id = :id",
            {id: record.id}
        );

        // Handle password reset
        if (purpose === "reset") {
            if (!newPassword)
                return res
                    .status(400)
                    .json({ok: false, message: "Thiếu mật khẩu mới"});

            const bcrypt = (await import("bcrypt")).default;
            const hashed = await bcrypt.hash(newPassword, 10);
            await pool.execute("UPDATE users SET pw = :hashed WHERE email = :email", {
                hashed,
                email,
            });

            return res.json({ok: true, message: "Đặt lại mật khẩu thành công"});
        }

        // Handle registration verification
        if (purpose === "register") {
            await pool.execute("UPDATE users SET verified = 1 WHERE email = :email", {
                email,
            });
            return res.json({ok: true, message: "Xác minh tài khoản thành công"});
        }
    } catch (err) {
        console.error("Lỗi verify OTP:", err);
        res
            .status(500)
            .json({ok: false, message: "Lỗi máy chủ khi xác minh OTP"});
    }
}

export async function verifyRegisterOTP(req, res) {
    await verifyOtpGeneric(req, res, "register");
}

export async function verifyResetOTP(req, res) {
    await verifyOtpGeneric(req, res, "reset");
}

/** Authenticate user and return JWT token */
export async function login(req, res) {
    try {
        const {email, password} = req.body;
        if (!email || !password)
            return res
                .status(400)
                .json({ok: false, message: "Thiếu thông tin đăng nhập"});

        const [rows] = await pool.execute(
            "SELECT * FROM users WHERE email = :email",
            {email}
        );
        const user = rows[0];


        if (!user)
            return res
                .status(401)
                .json({ok: false, message: "Account does not exist"});

        const bcrypt = (await import("bcrypt")).default;
        const isMatch = await bcrypt.compare(password, user.pw);

        if (!isMatch)
            return res.status(401).json({ok: false, message: "Incorrect password"});

        if (!user.verified)
            return res.status(403).json({
                ok: false,
                message: "Tài khoản chưa xác minh email. Vui lòng kiểm tra hộp thư.",
            });

        // Generate JWT with 1-day expiry
        const payload = {
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.roles,
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET || "dacna_secret", {
            expiresIn: "1d",
        });

        res.json({
            ok: true,
            message: "Đăng nhập thành công",
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.username,
                role: user.roles,
            },
        });
    } catch (err) {
        console.error("Lỗi login:", err);
        res.status(500).json({ok: false, message: "Lỗi máy chủ khi đăng nhập"});
    }
}

/** Get current authenticated user's information */
export async function getCurrentUser(req, res) {
    try {
        // req.user populated by authMiddleware
        if (!req.user)
            return res.status(401).json({ok: false, message: "Unauthorized"});

        const [rows] = await pool.execute(
            "SELECT id, username, email, roles, verified, created_at FROM users WHERE id = :id",
            {id: req.user.id}
        );

        if (!rows.length)
            return res.status(404).json({ok: false, message: "User not found"});

        const user = rows[0];
        res.json({
            ok: true,
            data: {
                id: user.id,
                email: user.email,
                name: user.username,
                role: user.roles,
                verified: user.verified === 1,
                createdAt: user.created_at,
            },
        });
    } catch (err) {
        console.error("Lỗi getCurrentUser:", err);
        res.status(500).json({ok: false, message: "Lỗi máy chủ"});
    }
}

/** DEBUG: Get all users (remove this in production) */
export async function debugGetAllUsers(req, res) {
    try {
        const [rows] = await pool.execute(
            "SELECT id, username, email, roles, verified, created_at FROM users ORDER BY id DESC"
        );
        res.json({
            ok: true,
            database: process.env.MYSQL_DB || "dacna",
            totalUsers: rows.length,
            users: rows,
        });
    } catch (err) {
        console.error("Debug error:", err);
        res.status(500).json({ok: false, message: err.message});
    }
}
