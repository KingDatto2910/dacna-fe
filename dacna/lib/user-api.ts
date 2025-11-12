// dacna/lib/user-api.ts

import { AuthUser } from "@/hooks/use-auth";

const API_URL = "http://localhost:5000";

/**
 * Định nghĩa kiểu dữ liệu cho User từ API
 */
export interface ApiUser {
  id: number;
  email: string;
  name: string;
  role: "customer" | "admin" | "staff";
  verified: boolean;
  createdAt: string;
}

/**
 * User profile với các trường mở rộng
 */
export interface UserProfile {
  id: number;
  username: string;
  email: string;
  phone?: string;
  roles: string;
  verified: boolean;
  full_name?: string;
  address_street?: string;
  address_district?: string;
  address_ward?: string;
  address_city?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Dữ liệu cập nhật profile
 */
export interface UpdateProfileData {
  username?: string;
  phone?: string;
  full_name?: string;
  address_street?: string;
  address_district?: string;
  address_ward?: string;
  address_city?: string;
  avatar_url?: string;
}

/**
 * Hàm fetch API cơ sở (có token)
 */
async function fetchApiWithToken<T>(
  path: string,
  token: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok || !data.ok) {
      throw new Error(data.message || data.error || "API request failed");
    }

    return data.data;
  } catch (err: any) {
    console.error(`API Error (Token) at ${path}:`, err);
    throw new Error(err.message || "API Network Error");
  }
}

/**
 * Lấy thông tin user hiện tại
 */
export async function apiGetCurrentUser(token: string): Promise<ApiUser> {
  return fetchApiWithToken<ApiUser>(`/auth/me`, token, {
    method: "GET",
  });
}

/**
 * Lấy thông tin profile đầy đủ của user hiện tại
 */
export async function getUserProfile(token: string): Promise<UserProfile> {
  const res = await fetch(`${API_URL}/api/users/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to fetch user profile");
  }

  return res.json();
}

/**
 * Cập nhật thông tin profile của user hiện tại
 */
export async function updateUserProfile(
  token: string,
  data: UpdateProfileData
): Promise<{ message: string }> {
  const res = await fetch(`${API_URL}/api/users/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to update user profile");
  }

  return res.json();
}
