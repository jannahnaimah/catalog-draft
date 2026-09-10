import { useCallback, useEffect, useRef, useState } from 'react';

import { ApiError } from '../data/client';
import { getProduct } from '../data/productsApi';
import type { Product } from '../data/types';
import { listViewStatus, type ViewStatus } from '../domain/viewState';

export function useProductDetail(productId: number) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const load = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setIsInitialLoading(true);
    setError(null);
    setProduct(null);

    try {
      const nextProduct = await getProduct(productId);
      if (requestId !== requestIdRef.current) {
        return;
      }
      setProduct(nextProduct);
    } catch (err) {
      if (requestId !== requestIdRef.current) {
        return;
      }
      const message =
        err instanceof ApiError
          ? err.message
          : 'Something went wrong. Please try again.';
      setError(message);
    } finally {
      if (requestId === requestIdRef.current) {
        setIsInitialLoading(false);
      }
    }
  }, [productId]);

  useEffect(() => {
    void load();
  }, [load]);

  const status: ViewStatus = listViewStatus({
    isInitialLoading,
    error,
    itemCount: product ? 1 : 0,
  });

  return {
    product,
    status,
    error,
    retry: load,
  };
}
