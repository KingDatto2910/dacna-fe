// dacna/app/page.tsx

// (THAY ĐỔI) Đây là Server Component (Không có "use client")
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

// (THAY ĐỔI) Import API thật và Types
import { getCategories } from "@/lib/api";
import { Category } from "@/lib/types";

// (THAY ĐỔI) Import Client Component mới
import LoginForm from "./login-form";

export default async function LoginPage() {
  // (THAY ĐỔI) Gọi API ở Server
  let categories: Category[] = [];

  try {
    categories = await getCategories();
  } catch (error) {
    console.error("Failed to fetch categories for login page:", error);
  }

  return (
    <>
      {/* (SỬA LỖI) Navbar nhận 'categories' từ Server */}
      <Navbar categories={categories} />

      {/* (THAY ĐỔI) Render Client Component <LoginForm /> */}
      <LoginForm />

      <Footer />
    </>
  );
}
