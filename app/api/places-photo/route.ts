import { NextRequest } from "next/server";

export const runtime = "nodejs";

const SEARCH_URL = "https://places.googleapis.com/v1/places:searchText";
const PLACE_PHOTO_CACHE = new Map<string, string>();

function clampWidth(value: string | null): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 1200;
  return Math.min(1600, Math.max(480, Math.floor(parsed)));
}

async function resolvePhotoName(query: string, languageCode: string, apiKey: string): Promise<string | null> {
  const cacheKey = `${languageCode}:${query}`;
  const cached = PLACE_PHOTO_CACHE.get(cacheKey);
  if (cached) return cached;

  const searchResponse = await fetch(SEARCH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "places.displayName,places.photos.name",
    },
    body: JSON.stringify({
      textQuery: query,
      languageCode,
      pageSize: 1,
    }),
  });

  if (!searchResponse.ok) return null;
  const data = (await searchResponse.json()) as {
    places?: Array<{ photos?: Array<{ name?: string }> }>;
  };

  const photoName = data.places?.[0]?.photos?.[0]?.name;
  if (!photoName) return null;

  PLACE_PHOTO_CACHE.set(cacheKey, photoName);
  return photoName;
}

export async function GET(request: NextRequest) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY?.trim();
  if (!apiKey) {
    return new Response("Missing GOOGLE_MAPS_API_KEY", { status: 503 });
  }

  const query = request.nextUrl.searchParams.get("query")?.trim();
  if (!query) {
    return new Response("Missing query", { status: 400 });
  }

  const languageCode = request.nextUrl.searchParams.get("lang")?.trim() || "ko";
  const maxWidth = clampWidth(request.nextUrl.searchParams.get("maxWidthPx"));
  const photoName = await resolvePhotoName(query, languageCode, apiKey);
  if (!photoName) {
    return new Response("No photo found", { status: 404 });
  }

  const mediaUrl = `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=${maxWidth}&key=${apiKey}`;
  const imageResponse = await fetch(mediaUrl);
  if (!imageResponse.ok || !imageResponse.body) {
    return new Response("Photo fetch failed", { status: 502 });
  }

  return new Response(imageResponse.body, {
    headers: {
      "Content-Type": imageResponse.headers.get("content-type") ?? "image/jpeg",
      "Cache-Control": "public, max-age=604800, s-maxage=2592000, stale-while-revalidate=86400",
    },
  });
}
