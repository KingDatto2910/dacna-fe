"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Fragment } from "react";
import { getProductById, getCategoryBySlug } from "@/lib/data";
import { ChevronRightIcon } from "lucide-react";

const capitalize = (s: string) => {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

/**
 * Component Breadcrumbs
 */
export default function Breadcrumbs() {
  const pathname = usePathname();

  if (pathname === "/home" || pathname === "/") {
    return null;
  }

  const segments = pathname.split("/").filter(Boolean);

  const crumbs = [{ href: "/home", label: "Home" }];

  let currentPath = "";

  segments.forEach((segment, index) => {
    if (segment === "home") return;

    currentPath += `/${segment}`;
    let label = capitalize(segment);

    try {
      if (index > 0 && segments[index - 1] === "products") {
        const product = getProductById(segment);
        if (product) {
          label = product.name;
        } else {
          label = "Product";
        }
      } else if (index > 0 && segments[index - 1] === "categories") {
        const category = getCategoryBySlug(segment);
        if (category) {
          label = category.name;
        } else {
          label = "Category";
        }
      }
    } catch (e) {}

    crumbs.push({ href: currentPath, label });
  });

  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
      <ol className="flex items-center space-x-2">
        {crumbs.map((crumb, index) => (
          <Fragment key={crumb.href}>
            <li>
              {index === crumbs.length - 1 ? (
                <span className="font-medium text-foreground">
                  {crumb.label}
                </span>
              ) : (
                <Link href={crumb.href} className="hover:text-primary">
                  {crumb.label}
                </Link>
              )}
            </li>
            {index < crumbs.length - 1 && (
              <ChevronRightIcon className="h-4 w-4" />
            )}
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
