"use client";
import Categories from "@/components/categories";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import Breadcrumbs from "@/components/breadcrumbs";

function CategoriesPage() {
  return (
    <>
      <Navbar />

      <div className="container mx-auto px-4 py-12 flex-1">
        <Breadcrumbs />

        <Categories />
      </div>

      <Footer />
    </>
  );
}

export default CategoriesPage;
