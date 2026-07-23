# Mackintosh Collection Wireframes

Interactive wireframes for the NTS (National Trust for Scotland) Charles Rennie
Mackintosh online collection, for stakeholder review. Extracted from a larger
combined wireframe project so it can be hosted standalone without other
clients' work included.

## Pages

- Burns/Mackintosh Picker (`/explore-collections`)
- Collection Home — MVP and Not MVP variants (`/collection-home-mvp`, `/collection-home`)
- Timeline (`/timeline`)
- Map Explorer (`/map`)
- Collection Item (`/crm-item`)
- Collection Search (`/crm-search`)
- Feature Status (`/feature-status`) — cross-page MVP / post-MVP inventory
- Site Map (`/sitemap`)

## Development

```bash
npm install
npm run dev
```

Runs on [http://localhost:5175](http://localhost:5175).

```bash
npm run build   # production build
npm run lint    # biome check
npm run typecheck
```

## Stack

Next.js (App Router) + React + TypeScript + Tailwind CSS v4 + Biome.
