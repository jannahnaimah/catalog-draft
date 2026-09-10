import { ApiError, buildUrl } from './client';
import {
  getProduct,
  getProducts,
  hasMorePages,
  PAGE_SIZE,
  searchProducts,
} from './productsApi';

function jsonResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  } as Response;
}

describe('productsApi', () => {
  const fetchMock = jest.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    global.fetch = fetchMock as typeof fetch;
  });

  it('builds paginated list URLs with skip and limit', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ products: [], total: 194, skip: 20, limit: 20 }),
    );

    await getProducts({ skip: 20, limit: PAGE_SIZE });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://dummyjson.com/products?limit=20&skip=20',
    );
  });

  it('searches the catalog endpoint instead of filtering locally', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ products: [], total: 23, skip: 0, limit: 20 }),
    );

    await searchProducts({ q: 'phone', skip: 0 });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://dummyjson.com/products/search?q=phone&limit=20&skip=0',
    );
  });

  it('loads a single product by id', async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse({
        id: 1,
        title: 'Essence Mascara Lash Princess',
        description: 'Volumizing mascara',
        price: 9.99,
        rating: 2.56,
        thumbnail: 'https://cdn.dummyjson.com/thumb.webp',
        images: ['https://cdn.dummyjson.com/1.webp'],
      }),
    );

    const product = await getProduct(1);

    expect(fetchMock).toHaveBeenCalledWith('https://dummyjson.com/products/1');
    expect(product.title).toBe('Essence Mascara Lash Princess');
  });

  it('maps HTTP failures to ApiError with status', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ message: 'not found' }, 404));

    await expect(getProduct(9999)).rejects.toMatchObject({
      name: 'ApiError',
      status: 404,
    });
  });

  it('maps network failures to a retryable ApiError', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('Network request failed'));

    await expect(getProducts({ skip: 0 })).rejects.toBeInstanceOf(ApiError);
  });

  it('reports whether another page can be loaded', () => {
    expect(hasMorePages(20, 194)).toBe(true);
    expect(hasMorePages(194, 194)).toBe(false);
    expect(hasMorePages(0, 0)).toBe(false);
  });

  it('keeps path joining stable for search URLs', () => {
    expect(buildUrl('/products/search', { q: 'phone', limit: 20, skip: 0 })).toBe(
      'https://dummyjson.com/products/search?q=phone&limit=20&skip=0',
    );
  });
});
