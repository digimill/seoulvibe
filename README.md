# Seoul Vibe

## How to run

```bash
npm install
npm run dev
```

Build check:

```bash
npm run build
```

## Google Places Spot Photos (Optional)

To show live Google place photos on curated spot cards, set:

```bash
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
GOOGLE_SPOT_IMAGE_LIMIT=6
```

The app uses `/api/places-photo` server route:
- Text Search (`places:searchText`) to find a place photo
- Place Photo media fetch to return image bytes

If the key is missing, cards fall back to existing local images.

Usage-minimizing defaults:
- Home page uses local spot images only.
- `/[lang]/spots` uses Google photos only for the first `GOOGLE_SPOT_IMAGE_LIMIT` cards.

## Dynamic Content + Image Flow

Content is loaded at runtime from:

- `/Users/heonjaejung/seoulvibe/data/en/content.json`
- `/Users/heonjaejung/seoulvibe/data/ko/content.json`
- `/Users/heonjaejung/seoulvibe/data/zh-cn/content.json`
- `/Users/heonjaejung/seoulvibe/data/ja/content.json`
- `/Users/heonjaejung/seoulvibe/data/zh-tw/content.json`
- `/Users/heonjaejung/seoulvibe/data/zh-hk/content.json`

Each item supports this metadata:

- `status`: `draft` | `candidate` | `approved` | `published`
- `updated_at`: `YYYY-MM-DD`
- `source`: optional source URL or memo
- `image`: `{ "src": "/images/...", "alt": "..." }`

Only `published` content (or content without `status`) is shown on the site.

To update images dynamically:

1. Upload image files into `/Users/heonjaejung/seoulvibe/public/images/...`
2. Update `image.src` and `image.alt` in `data/{lang}/content.json`
3. Refresh the page (no code change required)
