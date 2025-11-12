/**
 * Định nghĩa cấu trúc cho một Người dùng (User)
 */
export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const users: User[] = [
  {
    id: "1",
    email: "dat@gmail.com",
    password: "123",
    firstName: "Dat",
    lastName: "Chau",
  },
  {
    id: "2",
    email: "khoa@wibu.com",
    password: "123",
    firstName: "Khoa",
    lastName: "Nguyen",
  },
];

/**
 * Hàm xác thực người dùng đơn giản.
 *
 * @param {string} email
 * @param {string} password
 * @returns {User | undefined}
 */
export function verifyUser(email: string, password: string): User | undefined {
  const user = users.find((u) => u.email === email);
  if (user && user.password === password) {
    return user;
  }
  return undefined;
}
