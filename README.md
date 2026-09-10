# Product Catalog

A small React Native catalog app that lists, paginates, searches, and shows DummyJSON products.

## Stack

- **Expo SDK 57** + React Native 0.86 + TypeScript
- React Navigation native stack
- Native `fetch` against the [DummyJSON Products API](https://dummyjson.com/docs/products) (no API key)
- Jest + `jest-expo` for data-layer tests

Expo is used so the same React Native app can run in Expo Go, a simulator, or the browser.

## How to run

```bash
npm install
npm start
```

Then open the project in Expo Go, an Android/iOS simulator, or press `w` for web.

```bash
npm run web
npm test
```

## Architecture

The app is split into three layers:

1. **Data** (`src/data/`) — HTTP client, DummyJSON endpoints, and product types
2. **Domain / hooks** (`src/domain/`, `src/hooks/`) — pagination, view-state mapping (`loading` / `error` / `empty` / `success`), and debounce
3. **Presentation** (`src/screens/`, `src/components/`, `src/navigation/`) — screens and UI

```
UI screens  →  hooks  →  productsApi  →  DummyJSON
```

### Search choice

Search uses the **server endpoint** `GET /products/search?q=...&limit=20&skip=...`, not client-side filtering.

The list only keeps one page of products in memory. Filtering that array would miss items that have not been loaded yet. The search API covers the full catalog and still supports `skip`, so infinite scroll keeps working while searching. Input is debounced by 350ms to avoid a request on every keystroke.

## Features

- Product list with title, thumbnail, and price
- Infinite scroll via `skip` (`limit=20`)
- Product detail: description, price, rating, image gallery
- Distinct loading, error (with **Retry**), empty, and success states
- Debounced server search
- Pull-to-refresh
- Image placeholder (gray frame while loading) and a fallback if the image fails

## UX details

- The search field stays visible during loading, error, and empty results so a query can be changed without leaving the screen
- Empty search results say `No products found for “…”` instead of a generic empty catalog message
- Detail photos use paging dots; the header title updates to the product name after load

## Tests

```bash
npm test
```

`src/data/productsApi.test.ts` mocks `fetch` and checks list/search/detail URLs, HTTP/network error mapping, and `hasMorePages`.

## Not finished

Nothing required is unfinished. Native iOS builds need a Mac; on Windows use Expo Go or `npm run web`.
