# Seoul Vibe Content Strategy

## Positioning

- Not an official guidebook.
- Voice: friend-to-friend, real-world, low-friction advice.
- Promise: "What you actually feel and do in Seoul, not brochure language."

## Tone Rules

- Write like a trusted friend who already tried the route.
- Use concrete scenes (queue length, timing, crowd mood, rain backup).
- Use short, confident sentences; avoid generic adjectives.
- Include one "watch out" and one "easy fix" in every item.
- Keep recommendations practical: time blocks, station exits, fallback plan.

## Source Mix (weekly)

- 40% community pulse: Reddit, Instagram comments, YouTube comments.
- 30% field notes: direct walk-through notes and on-site photos.
- 20% utility checks: opening hours, route viability, transfer times.
- 10% official baseline: only for factual validation.

## Sourcing Workflow

1. Capture 30 raw signals per week.
2. Cluster signals into repeat traveler problems.
3. Create 10 candidate items with hook + friend_note + practical fix.
4. Publish 5 items after factual sanity check.
5. Refresh top performers every 2 weeks.

## Item Quality Checklist

- Hook that sounds like a person, not a brochure.
- Friend note with real pacing advice.
- At least one failure-prevention tip.
- A rain or crowd fallback.
- Map-ready movement instruction.

## Data Authoring Rules

In `data/{lang}/content.json`, each item should include:

- `hook`
- `friend_note`
- operational fields (`best_time`, `how_to_get`, etc.)
- optional rich fields (`photo_spot`, `food_pairing`, `real_scene`, `quick_checklist`, ...)
- `status = published` only when ready to expose.

## Cadence

- Monday: source collection + cluster.
- Tuesday: draft hooks and friend notes.
- Wednesday: factual checks and route sanity.
- Thursday: publish and distribute.
- Friday: performance review and rewrite top 3 weak items.
