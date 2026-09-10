import { useCallback, useEffect, useRef, useState } from 'react';

import { ApiError } from '../data/client';
import {
  getProducts,
  hasMorePages,
  PAGE_SIZE,
  searchProducts,
} from '../data/productsApi';
import type { Product } from '../data/types';
import { listViewStatus, type ViewStatus } from '../domain/viewState';

export function useProductList(query: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const productsRef = useRef<Product[]>([]);
  const totalRef = useRef(0);
  const loadingMoreRef = useRef(false);
  const requestIdRef = useRef(0);

  productsRef.current = products;
  totalRef.current = total;

  const load = useCallback(
    async (mode: 'initial' | 'refresh' | 'more') => {
      if (mode === 'more') {
        if (
          loadingMoreRef.current ||
          !hasMorePages(productsRef.current.length, totalRef.current)
        ) {
          return;
        }
        loadingMoreRef.current = true;
        setIsLoadingMore(true);
      } else if (mode === 'refresh') {
        setIsRefreshing(true);
      } else {
        setIsInitialLoading(true);
        setProducts([]);
        setTotal(0);
      }

      const requestId = ++requestIdRef.current;
      const skip = mode === 'more' ? productsRef.current.length : 0;
      const trimmed = query.trim();

      try {
        const page = trimmed
          ? await searchProducts({ q: trimmed, skip, limit: PAGE_SIZE })
          : await getProducts({ skip, limit: PAGE_SIZE });

        if (requestId !== requestIdRef.current) {
          return;
        }

        setError(null);
        setTotal(page.total);
        setProducts((current) =>
          mode === 'more' ? [...current, ...page.products] : page.products,
        );
      } catch (err) {
        if (requestId !== requestIdRef.current) {
          return;
        }
        const message =
          err instanceof ApiError
            ? err.message
            : 'Something went wrong. Please try again.';
        setError(message);
        if (mode !== 'more') {
          setProducts([]);
          setTotal(0);
        }
      } finally {
        if (requestId === requestIdRef.current) {
          setIsInitialLoading(false);
          setIsRefreshing(false);
          setIsLoadingMore(false);
          loadingMoreRef.current = false;
        }
      }
    },
    [query],
  );

  useEffect(() => {
    void load('initial');
  }, [load]);

  const status: ViewStatus = listViewStatus({
    isInitialLoading,
    error,
    itemCount: products.length,
  });

  return {
    products,
    total,
    status,
    error,
    isRefreshing,
    isLoadingMore,
    hasMore: hasMorePages(products.length, total),
    refresh: () => load('refresh'),
    retry: () => load('initial'),
    loadMore: () => load('more'),
  };
}
