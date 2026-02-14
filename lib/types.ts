export type ContentStatus = "draft" | "candidate" | "approved" | "published";

export type ContentImage = {
  src: string;
  alt: string;
};

export type ContentMeta = {
  status?: ContentStatus;
  updated_at?: string;
  source?: string;
  image?: ContentImage;
  hook?: string;
  friend_note?: string;
  real_spots?: Array<string | { name: string; map_url?: string }>;
};

export type LineToUseDetail = {
  ko: string;
  pronunciation_en: string;
  pronunciation_local: string;
  meaning: string;
};

export type Area = ContentMeta & {
  id: string;
  name: string;
  summary: string;
  vibe: string;
  best_time: string;
  how_to_get: string;
  must_do: string;
  hidden_tip: string;
  do_not: string;
  budget: string;
  crowd: string;
  tags: string[];
  photo_spot?: string;
  food_pairing?: string;
  rain_option?: string;
  night_option?: string;
  one_line_route?: string;
};

export type Theme = ContentMeta & {
  id: string;
  title: string;
  summary: string;
  ideal_for: string;
  flow: string;
  highlight: string;
  budget: string;
  tags: string[];
  route_stops?: string[];
  food_break?: string;
  rain_swap?: string;
  creator_note?: string;
};

export type Tip = ContentMeta & {
  id: string;
  title: string;
  summary: string;
  what_to_know: string;
  why_it_matters: string;
  avoid_this: string;
  quick_fix: string;
  tags: string[];
  real_scene?: string;
  local_move?: string;
  line_to_use?: string | LineToUseDetail;
  quick_checklist?: string[];
};

export type Korea101 = ContentMeta & {
  id: string;
  title: string;
  summary: string;
  comic_scene: string;
  core_idea: string;
  fun_fact: string;
  real_life_tip: string;
  line_to_use: string;
  quick_checklist?: string[];
  tags: string[];
};

export type LocaleContent = {
  hero?: ContentImage;
  areas: Area[];
  themes: Theme[];
  tips: Tip[];
  korea101: Korea101[];
};
