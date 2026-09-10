import { apiGet } from './client';
import type { PaginationParams, Product, ProductsPage } from './types';

export const PAGE_SIZE = 20;

export function hasMorePages(loadedCount: number, total: number): boolean {
  return loadedCount < total;
}

export function getProducts({
  skip,
  limit = PAGE_SIZE,
}: PaginationParams): Promise<ProductsPage> {
  return apiGet<ProductsPage>('/products', { limit, skip });
}

export function searchProducts({
  q,
  skip,
  limit = PAGE_SIZE,
}: PaginationParams & { q: string }): Promise<ProductsPage> {
  return apiGet<ProductsPage>('/products/search', { q, limit, skip });
}

export function getProduct(id: number): Promise<Product> {
  return apiGet<Product>(`/products/${id}`);
}
