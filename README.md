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
