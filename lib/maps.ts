export type SpotInput = string | { name: string; map_url?: string };

export type SpotLink = {
  name: string;
  href: string;
};

export function toSpotLink(spot: SpotInput): SpotLink {
  if (typeof spot === "string") {
    return {
      name: spot,
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spot + " Seoul")}`,
    };
  }

  return {
    name: spot.name,
    href:
      spot.map_url ??
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(spot.name + " Seoul")}`,
  };
}
