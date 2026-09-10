export type ViewStatus = 'loading' | 'error' | 'empty' | 'success';

export function listViewStatus({
  isInitialLoading,
  error,
  itemCount,
}: {
  isInitialLoading: boolean;
  error: string | null;
  itemCount: number;
}): ViewStatus {
  if (isInitialLoading) {
    return 'loading';
  }
  if (error) {
    return 'error';
  }
  if (itemCount === 0) {
    return 'empty';
  }
  return 'success';
}

export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

export function formatRating(rating: number): string {
  return rating.toFixed(2);
}
