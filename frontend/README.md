# Frontend — React Task Management Application

Practical 8: **Performance Optimization and Lazy Loading in React**

## Features
- Route-based code splitting with `React.lazy()` and `<Suspense>`
- Custom `<PageLoader />` fallback UI during chunk loading
- Dark / Light mode UI with glowing gradients and glassmorphism styling
- User registration, JWT login, and task management integration

## Scripts
- `npm run dev` - Start Vite development server
- `npm run build` - Build production bundle with code-split chunks

## Bundle Metrics (Practical 8)
- Initial bundle size: `235.35 kB` (gzip: `75.55 kB`)
- Lazy loaded chunks: `Projects` (4.30 kB), `Login` (2.61 kB), `Contact` (1.13 kB)
