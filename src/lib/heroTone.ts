/* ----------------------------------------------------------------------------
 * Which pages open on the light ground.
 *
 * The header is transparent over the hero and only takes its solid chrome once
 * you scroll. Over a bone page header that transparent state is wrong twice:
 * the dark scrim that keeps the controls readable over photography smears grey
 * across a cream page, and bone nav labels on a bone ground are unreadable
 * whatever the scrim does.
 *
 * So the tone is declared once, here, and read by both sides — the page, which
 * passes it to PageHero, and the header, which skips the scrim and goes solid
 * immediately. One list, so the two can never disagree.
 * -------------------------------------------------------------------------- */

export const LIGHT_HERO_ROUTES = ['/reviews', '/weddings'] as const;

export const hasLightHero = (pathname: string) =>
  (LIGHT_HERO_ROUTES as readonly string[]).includes(pathname);

export const heroTone = (pathname: string): 'ink' | 'bone' =>
  hasLightHero(pathname) ? 'bone' : 'ink';
