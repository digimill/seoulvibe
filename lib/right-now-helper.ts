import mapping from "@/data/rightNowHelper.json";

export const RIGHT_NOW_LOCATIONS = ["Hongdae", "Seongsu", "Bukchon", "Gangnam", "Myeongdong", "Airport", "Other"] as const;
export const RIGHT_NOW_SITUATIONS = ["Too crowded", "Hungry", "Tired", "Waiting in line", "It's raining", "Just arrived", "No plan"] as const;
export const RIGHT_NOW_TIMES = ["Afternoon", "Evening", "Late night"] as const;

export type RightNowLocation = (typeof RIGHT_NOW_LOCATIONS)[number];
export type RightNowSituation = (typeof RIGHT_NOW_SITUATIONS)[number];
export type RightNowTime = (typeof RIGHT_NOW_TIMES)[number];

export type RightNowRecommendation = {
  action: string;
  move: string;
  avoid: string;
};

type TimeMap = Partial<Record<RightNowTime, RightNowRecommendation>>;
type SituationMap = Partial<Record<RightNowSituation, TimeMap>> & {
  __fallback?: TimeMap;
};
type RightNowMap = Partial<Record<RightNowLocation, SituationMap>>;

const helperMap = mapping as RightNowMap;

function pickTimeSlot(timeMap?: TimeMap): RightNowRecommendation | null {
  if (!timeMap) return null;
  return timeMap.Evening ?? timeMap.Afternoon ?? timeMap["Late night"] ?? null;
}

export function resolveRightNowRecommendation(
  location: RightNowLocation,
  situation: RightNowSituation,
  time: RightNowTime = "Evening",
): RightNowRecommendation {
  const locationMap = helperMap[location];
  const exact = locationMap?.[situation]?.[time];
  if (exact) return exact;

  const situationFallback = pickTimeSlot(locationMap?.[situation]);
  if (situationFallback) return situationFallback;

  const locationFallback = locationMap?.__fallback?.[time] ?? pickTimeSlot(locationMap?.__fallback);
  if (locationFallback) return locationFallback;

  const otherMap = helperMap.Other;
  const otherExact = otherMap?.[situation]?.[time];
  if (otherExact) return otherExact;

  const otherSituationFallback = pickTimeSlot(otherMap?.[situation]);
  if (otherSituationFallback) return otherSituationFallback;

  const otherLocationFallback = otherMap?.__fallback?.[time] ?? pickTimeSlot(otherMap?.__fallback);
  if (otherLocationFallback) return otherLocationFallback;

  return {
    action: "Pick one simple move and do it now.",
    move: "Stay within 10 minutes on foot.",
    avoid: "Avoid standing still and searching too long.",
  };
}

