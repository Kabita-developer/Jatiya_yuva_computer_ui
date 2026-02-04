## Packages
(none needed)

## Notes
Uses existing installed recharts + framer-motion for premium dashboard visuals.
Mock data lives in client/src/mockdata.ts (no localStorage, no DB for UI tables/forms).
Dashboard page fetches GET /api/dashboard via TanStack Query + Zod validation from @shared/routes.
All pages set document title + meta description for basic SEO.
Uses shadcn sidebar primitives at @/components/ui/sidebar with collapse/expand.
