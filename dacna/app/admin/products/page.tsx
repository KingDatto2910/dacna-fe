"use client";

import { useState, useEffect, Fragment } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { updateProductStock, deleteProduct, createProduct, updateProduct } from "@/lib/admin-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, RefreshCw, Pencil, Trash2, Plus } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const API_BASE = "http://localhost:5000";

/**
 * Admin Products Management Page
 * 
 * PERMISSIONS:
 * - ADMIN: Full access (create, edit, delete products, manage stock)
 * - STAFF: Full access (create, edit, delete products, manage stock)
 * - Customer: Cannot access (protected by layout)
 * 
 * FEATURES:
 * - View all products with search functionality
 * - Create new products with images and specifications
 * - Edit existing products
 * - Delete products
 * - Manage product stock levels
 * - Both admin and staff have full access to this page
 */

interface Product {
  id: string;
  sku: string;
  name: string;
  price: number;
  salePrice?: number;
  category: string;
  stock: { level: string };
  rating: number;
}

export default function AdminProductsPage() {
  const { isAdmin, isAdminOrStaff } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Array<{ id: number; name: string; subCategories: Array<{ id: number; name: string }> }>>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedEditId, setExpandedEditId] = useState<string | null>(null);
  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [stockProductId, setStockProductId] = useState<string | null>(null);
  const [stockProductLevel, setStockProductLevel] = useState<string>("");
  const [stockQtyInput, setStockQtyInput] = useState<string>("");
  const [form, setForm] = useState({
    sku: "",
    name: "",
    price: "",
    sale_price: "",
    category_id: "",
    sub_category_id: "",
    stock_qty: "",
    description: "",
    imagesText: "",
  });

  const loadProducts = async () => {
    try {
      setLoading(true);
      const query = search ? `?q=${encodeURIComponent(search)}` : "";
      const res = await fetch(`${API_BASE}/api/products${query}`);
      const json = await res.json();
      setProducts(json.data || []);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/categories`);
      const j = await res.json();
      const cats = (j.data || []).map((c: any) => ({ id: c.id, name: c.name, subCategories: c.subCategories || [] }));
      setCategories(cats);
    } catch (e) {
      console.error("Failed to load categories", e);
    }
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const handleSearch = () => loadProducts();

  const resetForm = () => {
    setForm({
      sku: "",
      name: "",
      price: "",
      sale_price: "",
      category_id: "",
      sub_category_id: "",
      stock_qty: "",
      description: "",
      imagesText: "",
    });
    setEditingId(null);
    setExpandedEditId(null);
  };

  const openCreate = () => {
    resetForm();
    setShowCreateForm(true);
  };

  const openEdit = async (id: string) => {
    try {
      setEditingId(id);
      setExpandedEditId(id);
      const res = await fetch(`${API_BASE}/api/products/${id}`);
      if (!res.ok) throw new Error("Failed to fetch product details");
      const j = await res.json();
      const p = j?.data || {};
      setForm({
        sku: p.sku || "",
        name: p.name || "",
        price: (p.price ?? "").toString(),
        sale_price: (p.salePrice ?? "").toString(),
        category_id: (p.category_id ?? "").toString(),
        sub_category_id: (p.sub_category_id ?? "").toString(),
        stock_qty: "", // not provided by detail mapping
        description: p.description || "",
        imagesText: Array.isArray(p.images) ? p.images.join("\n") : "",
      });
    } catch (e) {
      console.error(e);
      alert("Failed to load product detail");
      setEditingId(null);
      setExpandedEditId(null);
    }
  };

  const submitForm = async () => {
    try {
      const payload: any = {
        sku: form.sku.trim(),
        name: form.name.trim(),
        price: Number(form.price || 0),
        category_id: Number(form.category_id || 0),
      };
      if (form.sale_price) payload.sale_price = Number(form.sale_price);
      if (form.sub_category_id) payload.sub_category_id = Number(form.sub_category_id);
      if (form.stock_qty) payload.stock_qty = Number(form.stock_qty);
      if (form.description) payload.description = form.description;
      if (form.imagesText) payload.images = form.imagesText.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);

      if (!payload.sku || !payload.name || !payload.price || !payload.category_id) {
        alert("Please fill SKU, Name, Price, Category");
        return;
      }

      if (editingId) await updateProduct(parseInt(editingId), payload);
      else await createProduct(payload);

      if (!editingId) setShowCreateForm(false);
      resetForm();
      loadProducts();
    } catch (e: any) {
      console.error(e);
      alert(e?.message || "Failed to submit product");
    }
  };

  const openStockModal = (product: Product) => {
    setStockProductId(product.id);
    setStockProductLevel(product.stock.level);
    setStockQtyInput("");
    setStockModalOpen(true);
  };

  const saveStockUpdate = async () => {
    if (!stockProductId) return;
    const qtyNum = parseInt(stockQtyInput, 10);
    if (isNaN(qtyNum) || qtyNum < 0) {
      alert("Enter a valid non-negative number");
      return;
    }
    try {
      await updateProductStock(parseInt(stockProductId), qtyNum);
      setStockModalOpen(false);
      setStockProductId(null);
      loadProducts();
    } catch (e) {
      console.error(e);
      alert("Failed to update stock");
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await deleteProduct(parseInt(productId));
      loadProducts();
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("Failed to delete product");
    }
  };

  const getStockBadge = (level: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      "in-stock": "default",
      "low-stock": "secondary",
      "out-of-stock": "destructive",
    };
    return <Badge variant={variants[level] || "default"}>{level}</Badge>;
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Products Management</h1>
          <div className="flex gap-2">
            {isAdminOrStaff && (
              <Button onClick={openCreate} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            )}
            <Button onClick={loadProducts} variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

      {/* Search */}
      <div className="flex gap-2">
        <Input
          placeholder="Search products by name, SKU, model..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flex-1"
        />
        <Button onClick={handleSearch} size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="text-center py-8">Loading products...</div>
      ) : (
        <div className="border rounded-lg">
          {isAdminOrStaff && showCreateForm && !editingId && (
            <div className="p-4 border-b space-y-3 bg-muted/30">
              <div className="text-sm font-semibold">
                Create Product
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground">SKU</label>
                  <Input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Name</label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Price</label>
                  <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Sale Price</label>
                  <Input type="number" value={form.sale_price} onChange={(e) => setForm({ ...form, sale_price: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Category</label>
                  <select
                    className="w-full border rounded-md px-2 py-1 bg-background"
                    value={form.category_id}
                    onChange={(e) => setForm({ ...form, category_id: e.target.value, sub_category_id: "" })}
                  >
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Subcategory</label>
                  <select
                    className="w-full border rounded-md px-2 py-1 bg-background"
                    value={form.sub_category_id}
                    onChange={(e) => setForm({ ...form, sub_category_id: e.target.value })}
                    disabled={!form.category_id}
                  >
                    <option value="">{form.category_id ? 'Select subcategory' : 'Select category first'}</option>
                    {categories.find(c => c.id.toString() === form.category_id)?.subCategories.map(sc => (
                      <option key={sc.id} value={sc.id}>{sc.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Stock Qty</label>
                  <Input type="number" value={form.stock_qty} onChange={(e) => setForm({ ...form, stock_qty: e.target.value })} />
                </div>
                <div className="md:col-span-3">
                  <label className="text-xs text-muted-foreground">Description</label>
                  <textarea className="w-full border rounded-md p-2 bg-background" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="md:col-span-3">
                  <label className="text-xs text-muted-foreground">Image URLs (one per line)</label>
                  <textarea className="w-full border rounded-md p-2 bg-background" rows={3} value={form.imagesText} onChange={(e) => setForm({ ...form, imagesText: e.target.value })} />
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={submitForm}>Create</Button>
                <Button size="sm" variant="outline" onClick={() => { setShowCreateForm(false); resetForm(); }}>Cancel</Button>
              </div>
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <Fragment key={product.id}>
                    <TableRow>
                      <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>
                        {product.salePrice ? (
                          <div className="flex flex-col">
                            <span className="line-through text-sm text-muted-foreground">
                              ${Number(product.price).toFixed(2)}
                            </span>
                            <span className="font-semibold text-red-600">
                              ${Number(product.salePrice).toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <span>${Number(product.price).toFixed(2)}</span>
                        )}
                      </TableCell>
                      <TableCell>{getStockBadge(product.stock.level)}</TableCell>
                      <TableCell>⭐ {product.rating.toFixed(1)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => openStockModal(product)}
                            variant="outline"
                            size="sm"
                          >
                            Update Stock
                          </Button>
                          {isAdminOrStaff && (
                            <Button onClick={() => openEdit(product.id)} variant="outline" size="sm">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          )}
                          {isAdmin && (
                            <Button
                              onClick={() => handleDelete(product.id)}
                              variant="destructive"
                              size="sm"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                    {expandedEditId === product.id && editingId === product.id && (
                      <TableRow className="bg-muted/40">
                        <TableCell colSpan={7}>
                          <div className="space-y-3">
                            <div className="text-xs font-semibold">Edit Product #{editingId}</div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                              <div>
                                <label className="text-xs text-muted-foreground">SKU</label>
                                <Input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
                              </div>
                              <div>
                                <label className="text-xs text-muted-foreground">Name</label>
                                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                              </div>
                              <div>
                                <label className="text-xs text-muted-foreground">Price</label>
                                <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                              </div>
                              <div>
                                <label className="text-xs text-muted-foreground">Sale Price</label>
                                <Input type="number" value={form.sale_price} onChange={(e) => setForm({ ...form, sale_price: e.target.value })} />
                              </div>
                              <div>
                                <label className="text-xs text-muted-foreground">Category</label>
                                <select
                                  className="w-full border rounded-md px-2 py-1 bg-background"
                                  value={form.category_id}
                                  onChange={(e) => setForm({ ...form, category_id: e.target.value, sub_category_id: "" })}
                                >
                                  <option value="">Select category</option>
                                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                              </div>
                              <div>
                                <label className="text-xs text-muted-foreground">Subcategory</label>
                                <select
                                  className="w-full border rounded-md px-2 py-1 bg-background"
                                  value={form.sub_category_id}
                                  onChange={(e) => setForm({ ...form, sub_category_id: e.target.value })}
                                  disabled={!form.category_id}
                                >
                                  <option value="">{form.category_id ? 'Select subcategory' : 'Select category first'}</option>
                                  {categories.find(c => c.id.toString() === form.category_id)?.subCategories.map(sc => (
                                    <option key={sc.id} value={sc.id}>{sc.name}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="md:col-span-3">
                                <label className="text-xs text-muted-foreground">Description</label>
                                <textarea className="w-full border rounded-md p-2 bg-background" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                              </div>
                              <div className="md:col-span-3">
                                <label className="text-xs text-muted-foreground">Image URLs (one per line)</label>
                                <textarea className="w-full border rounded-md p-2 bg-background" rows={3} value={form.imagesText} onChange={(e) => setForm({ ...form, imagesText: e.target.value })} />
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" onClick={submitForm}>Save Changes</Button>
                              <Button size="sm" variant="outline" onClick={resetForm}>Cancel</Button>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
      </div>

      {/* Stock Update Modal */}
      <AlertDialog open={stockModalOpen} onOpenChange={(o) => !o && setStockModalOpen(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Stock Quantity</AlertDialogTitle>
            <AlertDialogDescription>
              {stockProductId ? (
                <span>
                  Product ID: {stockProductId}. Current status: {stockProductLevel}. Set a new stock quantity. Use 0 to mark out-of-stock.
                </span>
              ) : (
                "Select a product to update stock"
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">New Quantity</label>
            <Input
              type="number"
              min={0}
              value={stockQtyInput}
              onChange={(e) => setStockQtyInput(e.target.value)}
              placeholder="e.g. 25"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setStockModalOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={saveStockUpdate} disabled={!stockQtyInput.trim()}>Save</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
