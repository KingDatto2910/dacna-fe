import ProductCard from "@/components/product-card";
import { getAllProducts } from "@/lib/data";

/**
 * The Products component displays a list of all products.
 * (Dense Grid Design - 5 Cột)
 */
function Products() {
  const allProducts = getAllProducts();

  return (
    <section className="w-full py-12">
      <div className="container mx-auto px-4 py-4 md:py-6 md:px-8">
        <h1 className="text-3xl font-bold mb-8">All Products</h1>

        {/*
          (lg:grid-cols-5)
        */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {allProducts.map((product) => (
            // Sử dụng ProductCard đã được thu nhỏ
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Products;
