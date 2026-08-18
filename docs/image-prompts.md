# Image prompt pack

Thirty-one paste-ready prompts, one per slot in [`photography.md`](photography.md).
Written model-agnostic — they work in Higgsfield, Midjourney, DALL·E, Flux,
Seedream or anything else photoreal — and each one is self-contained, so they can
be run in any order, by anyone, without reading the rest of this file.

**These generate demo assets.** Same status as the sample reviews and the
placeholder rating: fine for a fictional shop and a portfolio build, not fine to
launch a real barbershop on. A shop's lookbook is a claim about its own work, and
a generated fade is not the shop's work. Replace before launch.

---

## The house style

Every prompt below already ends with this block. It is repeated in full each
time so the prompts stay copy-pasteable in isolation — if you are scripting
them, factor it out.

> Cinematic editorial photograph. Dark charcoal barbershop interior, single warm
> key light from one side, deep falloff into black. Muted palette: near-black,
> warm bone white, one burnt-orange accent. 35mm film grain, shallow depth of
> field, natural skin texture with visible pores, documentary realism. Not
> glossy, no direct flash, no teal-and-orange grade, no plastic skin. No text, no
> logos, no watermarks, no brand names.

**Aspect ratios.** Given per prompt. If a model does not offer the exact ratio,
take the nearest — every image is displayed through `object-fit: cover`, so a
close ratio crops cleanly. Generate at the highest resolution the model allows
(2K or 4K); the build downsamples, it cannot invent detail.

**The two before/after pairs are the only ones that need care.** `w-01`/`w-13`
and their before frames must be the same person from the same camera position.
Generate the *after* frame first, then feed it back as a reference/image input
with the before prompt — text alone will not hold the identity, and the
comparison slider wipes one over the other so any drift is visible.

---

## 1. Barber portraits

Run these five in one sitting. If the model supports a reference image, generate
`marcus-reyes` first and pass it as a style reference to the other four so the
set matches.

### `/public/team/marcus-reyes.jpg` — aspect 4:5
> Waist-up editorial portrait of a Latino master barber in his early forties,
> standing at his barber chair in a dark moody barbershop. Turned thirty degrees
> away from camera, looking down the length of the room rather than at the lens.
> Short dark hair, close-trimmed beard, black work apron over a dark shirt,
> sleeves rolled. Hair clippers held loosely in one hand at his side, relaxed,
> not raised. Behind him a large mirror catches the warm-lit room in soft focus.
> Settled, unhurried, mid-thought — a man who owns the room.
> Cinematic editorial photograph. Dark charcoal barbershop interior, single warm
> key light from one side, deep falloff into black. Muted palette: near-black,
> warm bone white, one burnt-orange accent. 35mm film grain, shallow depth of
> field, natural skin texture with visible pores, documentary realism. Not
> glossy, no direct flash, no teal-and-orange grade, no plastic skin. No text, no
> logos, no watermarks, no brand names.

### `/public/team/desmond-whitfield.jpg` — aspect 4:5
> Chest-up editorial portrait of a Black barber in his late thirties, holding
> hair clippers raised near shoulder height as if he has just stepped back to
> check a line. Short fade, neat beard, dark apron. Hard warm key light from
> camera-left defining the edge of his jaw against a near-black wall.
> Concentrating, not smiling. Barbershop mirrors and a chair soft and dark
> behind him.
> Cinematic editorial photograph. Dark charcoal barbershop interior, single warm
> key light from one side, deep falloff into black. Muted palette: near-black,
> warm bone white, one burnt-orange accent. 35mm film grain, shallow depth of
> field, natural skin texture with visible pores, documentary realism. Not
> glossy, no direct flash, no teal-and-orange grade, no plastic skin. No text, no
> logos, no watermarks, no brand names.

### `/public/team/nina-castellanos.jpg` — aspect 4:5
> A Latina barber in her early thirties cutting hair, photographed from behind
> and to the side of the barber chair. She is sharp and in focus, shears in hand
> working through a section of a client's long hair, eyes on the section. The
> client's head is soft and anonymous in the foreground, face not visible. Dark
> apron, hair tied back. Cool daylight from a window mixing with the warm room
> light. The scissors must be clearly readable as the subject of the frame.
> Cinematic editorial photograph. Dark charcoal barbershop interior, single warm
> key light from one side, deep falloff into black. Muted palette: near-black,
> warm bone white, one burnt-orange accent. 35mm film grain, shallow depth of
> field, natural skin texture with visible pores, documentary realism. Not
> glossy, no direct flash, no teal-and-orange grade, no plastic skin. No text, no
> logos, no watermarks, no brand names.

### `/public/team/yusuf-amari.jpg` — aspect 4:5
> Chest-up editorial portrait of a North African barber in his mid thirties
> stropping a straight razor. Hands in frame and sharp: a leather strop hanging
> from the barber chair, the open razor caught mid-pull along it. Dark shirt,
> apron, short hair, trimmed beard. Warm low light, deep shadow behind, the
> stillest and most classical frame in the set — the calmest corner of the shop.
> Cinematic editorial photograph. Dark charcoal barbershop interior, single warm
> key light from one side, deep falloff into black. Muted palette: near-black,
> warm bone white, one burnt-orange accent. 35mm film grain, shallow depth of
> field, natural skin texture with visible pores, documentary realism. Not
> glossy, no direct flash, no teal-and-orange grade, no plastic skin. No text, no
> logos, no watermarks, no brand names.

### `/public/team/june-park.jpg` — aspect 4:5
> Waist-up editorial portrait of a Korean-American barber in her late twenties
> standing at the front window of a barbershop, the window behind her shoulder so
> daylight wraps her and the street beyond is blown out and soft. Relaxed,
> approachable, a comb held in one hand. Dark apron over a light shirt. The
> brightest and most open frame in the portrait set.
> Cinematic editorial photograph. Dark charcoal barbershop interior, single warm
> key light from one side, deep falloff into black. Muted palette: near-black,
> warm bone white, one burnt-orange accent. 35mm film grain, shallow depth of
> field, natural skin texture with visible pores, documentary realism. Not
> glossy, no direct flash, no teal-and-orange grade, no plastic skin. No text, no
> logos, no watermarks, no brand names.

---

## 2. Hero

### `/public/shop/hero.jpg` — aspect 3:4 or 2:3, vertical
> A barber mid-fade, photographed from behind and slightly above the client's
> shoulder. Clippers pressed against the nape, the guard line clearly visible in
> the hair, the barber's other hand steadying the head. The client is anonymous —
> only the back of a head and a black cape, no face. Behind them the barbershop
> falls away into darkness with one or two warm practical lights carrying the
> depth. Keep the upper third of the frame quiet and uncluttered. Compose the
> action slightly right of centre.
> Cinematic editorial photograph. Dark charcoal barbershop interior, single warm
> key light from one side, deep falloff into black. Muted palette: near-black,
> warm bone white, one burnt-orange accent. 35mm film grain, shallow depth of
> field, natural skin texture with visible pores, documentary realism. Not
> glossy, no direct flash, no teal-and-orange grade, no plastic skin. No text, no
> logos, no watermarks, no brand names.

---

## 3. Shop atmosphere

### `/public/shop/chairs.jpg` — aspect 4:3
> Interior of an empty barbershop at the end of the day, shot low from one end of
> the room so the row of barber chairs recedes into the distance and the facing
> mirrors on both walls repeat the room into itself. No people. Lights on, warm.
> The front window a bright rectangle at the far end of the frame. Wide
> establishing shot, symmetrical, deep perspective.
> Cinematic editorial photograph. Dark charcoal barbershop interior, single warm
> key light from one side, deep falloff into black. Muted palette: near-black,
> warm bone white, one burnt-orange accent. 35mm film grain, shallow depth of
> field, natural skin texture, documentary realism. Not glossy, no direct flash,
> no teal-and-orange grade. No text, no logos, no watermarks, no brand names.

### `/public/shop/tools.jpg` — aspect 1:1
> Flat lay shot directly overhead: chrome hair clippers, three combs and a pair
> of barber shears laid out on a folded white towel, filling the frame. Arranged
> deliberately and spaced like a surgeon's tray, nothing overlapping. Each chrome
> surface picking up a single hard specular highlight. Dark wooden counter
> visible at the edges. No hands, no people.
> Cinematic editorial photograph. Dark charcoal barbershop interior, single warm
> key light from one side, deep falloff into black. Muted palette: near-black,
> warm bone white, one burnt-orange accent. 35mm film grain, shallow depth of
> field, documentary realism. Not glossy, no direct flash, no teal-and-orange
> grade. No text, no logos, no watermarks, no brand names.

### `/public/shop/floor.jpg` — aspect 4:5
> Looking straight down at the tiled floor beneath a barber chair at the end of
> the day. The chrome base and footrest of the chair enter the frame at the top.
> Cut hair scattered across the tile in loose drifts — dark and grey clippings.
> Unglamorous, honest, the evidence of a full day's work. No people.
> Cinematic editorial photograph. Dark charcoal barbershop interior, single warm
> key light from one side, deep falloff into black. Muted palette: near-black,
> warm bone white, one burnt-orange accent. 35mm film grain, shallow depth of
> field, documentary realism. Not glossy, no direct flash, no teal-and-orange
> grade. No text, no logos, no watermarks, no brand names.

### `/public/shop/records.jpg` — aspect 4:5
> A turntable and a shelf of vinyl records beside a worn leather waiting bench in
> a barbershop. Three-quarter angle, close enough to see the record spines edge
> on, the tonearm down and playing. A single warm lamp lighting the scene from
> the side, the rest of the room dark. Lived-in, personal, no people.
> Cinematic editorial photograph. Dark charcoal barbershop interior, single warm
> key light from one side, deep falloff into black. Muted palette: near-black,
> warm bone white, one burnt-orange accent. 35mm film grain, shallow depth of
> field, documentary realism. Not glossy, no direct flash, no teal-and-orange
> grade. No text, no logos, no watermarks, no brand names.

### `/public/shop/window.jpg` — aspect 4:3
> Shot from inside a barbershop looking out through the large front window onto a
> city street in late afternoon golden-hour light. The interior is in near
> silhouette; the street beyond is bright and slightly blown out. A pedestrian
> passes, blurred by a slow shutter. Shallow depth of field focused on the glass.
> Warm, quiet, the shop placed in its neighbourhood.
> Cinematic editorial photograph. Dark charcoal barbershop interior, single warm
> key light from one side, deep falloff into black. Muted palette: near-black,
> warm bone white, one burnt-orange accent. 35mm film grain, shallow depth of
> field, documentary realism. Not glossy, no direct flash, no teal-and-orange
> grade. No text, no logos, no watermarks, no brand names.

### `/public/shop/fade-detail.jpg` — aspect 4:5
> Extreme close-up macro detail of a men's skin fade haircut, filling the entire
> frame with roughly four inches of the side of a head: bare shaved skin at the
> bottom of the frame graduating smoothly upward through the blend into full
> length at the top. No face, no ear, no background — texture only. Hard light
> raking almost parallel to the skin so the tonal gradient reads as a continuous
> gradient with no visible line or step in it.
> Cinematic editorial photograph. Single warm key light from one side, deep
> falloff into black. Muted palette: near-black, warm bone white. 35mm film
> grain, shallow depth of field, natural skin texture with visible pores,
> documentary realism. Not glossy, no direct flash, no teal-and-orange grade, no
> plastic skin. No text, no logos, no watermarks, no brand names.

### `/public/shop/chapel-street.jpg` — aspect 4:3
> Exterior of a small independent barbershop on a city street at blue hour,
> roughly twenty minutes after sunset — the sky still holds deep blue colour but
> the shop's interior lights are already stronger. Photographed straight on from
> across the street. The window glows warm, the door is clearly visible, and
> enough of the neighbouring brick storefronts are in frame to place it on a real
> street. Wet pavement reflecting the light. No readable signage text.
> Cinematic editorial photograph. Single warm key light source, deep falloff into
> black. Muted palette: near-black, warm bone white, one burnt-orange accent.
> 35mm film grain, documentary realism. Not glossy, no direct flash, no
> teal-and-orange grade. No text, no logos, no watermarks, no brand names.

### `/public/shop/whitney-avenue.jpg` — aspect 4:3
> Exterior of a small independent barbershop on a suburban avenue in flat morning
> light. A fabric awning is extended over the window, and a small parking lot with
> a couple of cars is visible behind and beside the building. Photographed straight
> on from across the street at the same distance and framing as a dusk shot of a
> sister shop, so the two read as one business. No readable signage text.
> Cinematic editorial photograph. Natural morning light, muted palette:
> near-black, warm bone white, one burnt-orange accent. 35mm film grain,
> documentary realism. Not glossy, no direct flash, no teal-and-orange grade. No
> text, no logos, no watermarks, no brand names.

---

## 4. The Book — lookbook

Same dark wall, same light, same discipline across all sixteen. Faces are
optional and usually better omitted; the haircut is the subject.

### `/public/work/w-01.jpg` — aspect 2:3 — zero skin fade, hard part
> Photographed from directly behind a barber chair, camera at the height of the
> client's crown and tilted down. A men's zero skin fade: bare shaved skin at the
> neck running upward in a flawless invisible gradient into short length on top,
> with a single crisp razored hard part cut into the side and clearly visible
> from this angle. Dark charcoal wall behind. Hard side light raking across the
> head so the gradient reads. No face visible.
> Cinematic editorial photograph. Single warm key light from one side, deep
> falloff into black. Muted palette: near-black, warm bone white. 35mm film
> grain, shallow depth of field, natural skin texture with visible pores,
> documentary realism. Not glossy, no direct flash, no teal-and-orange grade, no
> plastic skin. No text, no logos, no watermarks, no brand names.

### `/public/work/w-01-before.jpg` — aspect 2:3 — **use w-01 as reference image**
> The same man, same barber chair, same camera position and same lighting as the
> reference image, photographed before his haircut. His hair is grown out roughly
> five weeks: the fade has lost its gradient, the neckline is soft and uneven, the
> hard part has completely grown over. Identical framing, distance and exposure to
> the reference. No face visible.

### `/public/work/w-02.jpg` — aspect 4:5 — sponge-set coils, mid taper
> Straight side-on profile of a Black man's haircut, head filling the frame
> vertically, face turned away and mostly out of frame. Tightly defined
> sponge-set coil texture on top contrasting against a clean, smoothly blended
> mid taper on the side. Soft key light on the coil texture, harder rim light
> along the taper so both textures read distinctly.
> Cinematic editorial photograph. Single warm key light from one side, deep
> falloff into black. Muted palette: near-black, warm bone white. 35mm film
> grain, shallow depth of field, natural skin texture, documentary realism. Not
> glossy, no direct flash, no teal-and-orange grade. No text, no logos, no
> watermarks, no brand names.

### `/public/work/w-03.jpg` — aspect 4:3 — grown-out fringe
> Close front three-quarter view of a scissor-cut fringe falling past the brow on
> straight-to-wavy hair, dried and completely unstyled — no product, no blow-dry.
> The cut sits correctly on its own. Soft window light from camera-left. Eyes
> lowered or cropped; the fringe is the subject.
> Cinematic editorial photograph. Single warm key light from one side, deep
> falloff into black. Muted palette: near-black, warm bone white. 35mm film
> grain, shallow depth of field, natural skin texture, documentary realism. Not
> glossy, no direct flash, no teal-and-orange grade. No text, no logos, no
> watermarks, no brand names.

### `/public/work/w-04.jpg` — aspect 1:1 — square beard line
> Three-quarter view of a man's full dark beard squared precisely to the jawline,
> cropped from nose to collarbone so the jaw geometry fills the frame. The cheek
> line is visibly razored — a hard clean edge, not a soft trim. Side light from
> the direction that reveals that edge most clearly.
> Cinematic editorial photograph. Single warm key light from one side, deep
> falloff into black. Muted palette: near-black, warm bone white. 35mm film
> grain, shallow depth of field, natural skin texture with visible pores,
> documentary realism. Not glossy, no direct flash, no teal-and-orange grade, no
> plastic skin. No text, no logos, no watermarks, no brand names.

### `/public/work/w-05.jpg` — aspect 4:5 — 360 waves, low fade
> Camera directly above and slightly behind a Black man's head, looking down at
> the crown, so a 360 wave hair pattern radiates outward across the entire frame
> above a clean low fade. Hard low raking light almost parallel to the scalp so
> every wave ridge casts its own shadow and the pattern reads sharply. No face.
> Cinematic editorial photograph. Single warm key light from one side, deep
> falloff into black. Muted palette: near-black, warm bone white. 35mm film
> grain, shallow depth of field, natural skin texture, documentary realism. Not
> glossy, no direct flash, no teal-and-orange grade. No text, no logos, no
> watermarks, no brand names.

### `/public/work/w-06.jpg` — aspect 2:3 — curtain cut, soft layers
> Head-and-shoulders view of a long layered curtain haircut on wavy hair, parted
> in the centre and falling naturally either side of the face. Photographed
> beside a bright window so daylight wraps the hair and the background blows out
> soft and pale. The lightest, airiest frame in an otherwise dark set.
> Cinematic editorial photograph. Natural window light, shallow depth of field,
> 35mm film grain, natural skin texture, documentary realism. Muted palette. Not
> glossy, no direct flash, no teal-and-orange grade, no plastic skin. No text, no
> logos, no watermarks, no brand names.

### `/public/work/w-07.jpg` — aspect 1:1 — drop fade
> Straight side-on profile of a men's drop fade, framed so the arc of the fade
> line — dropping down and curving behind the ear rather than running level —
> sits across the middle of the square frame. Point-cut textured length on top.
> Hard side light. Face mostly out of frame.
> Cinematic editorial photograph. Single warm key light from one side, deep
> falloff into black. Muted palette: near-black, warm bone white. 35mm film
> grain, shallow depth of field, natural skin texture, documentary realism. Not
> glossy, no direct flash, no teal-and-orange grade. No text, no logos, no
> watermarks, no brand names.

### `/public/work/w-08.jpg` — aspect 4:5 — classic side part
> Three-quarter front head-and-shoulders view of a classic scissor-cut side part
> with a soft taper at the sides, combed neatly and dressed with tonic so the
> hair carries a visible low sheen. The part is a sharp clean line. Warmer,
> softer light than the other frames — the most formal and old-fashioned image in
> the set, as though cut in 1962 and photographed today.
> Cinematic editorial photograph. Single warm key light from one side, deep
> falloff into black. Muted palette: near-black, warm bone white. 35mm film
> grain, shallow depth of field, natural skin texture with visible pores,
> documentary realism. Not glossy, no direct flash, no teal-and-orange grade, no
> plastic skin. No text, no logos, no watermarks, no brand names.

### `/public/work/w-09.jpg` — aspect 16:9 — freehand razor lines
> Extreme close-up horizontal detail of the temple area of a men's skin fade,
> filling the whole frame with just the temple — no face, no ear, no background.
> Two clean freehand razor lines are cut through the fade as sharp-edged channels
> down to skin, not scratches. Light raking almost parallel to the skin, exposed
> for the shadow inside each line so the depth of the cut reads.
> Cinematic editorial photograph. Single warm key light, deep falloff into black.
> Muted palette: near-black, warm bone white. 35mm film grain, macro detail,
> natural skin texture with visible pores, documentary realism. Not glossy, no
> direct flash, no teal-and-orange grade, no plastic skin. No text, no logos, no
> watermarks, no brand names.

### `/public/work/w-10.jpg` — aspect 4:3 — hot towel, straight razor finish
> A steaming white hot towel being lifted away from a freshly straight-razor
> shaved jaw, photographed against the darkest wall in the barbershop. The steam
> is back-lit so it separates and glows against the black. The jaw is clean and
> slightly flushed. Fast shutter, steam frozen mid-rise. The most cinematic frame
> in the set.
> Cinematic editorial photograph. Single warm back light, deep falloff into
> black. Muted palette: near-black, warm bone white. 35mm film grain, shallow
> depth of field, natural skin texture with visible pores, documentary realism.
> Not glossy, no direct flash, no teal-and-orange grade, no plastic skin. No
> text, no logos, no watermarks, no brand names.

### `/public/work/w-11.jpg` — aspect 4:5 — burst fade
> Side-on and slightly behind view of a men's burst fade, framed so the
> semicircle of the fade radiating around the ear is the centre of the image and
> the longer length falling away at the back is clearly visible. Hard raking side
> light. No face.
> Cinematic editorial photograph. Single warm key light from one side, deep
> falloff into black. Muted palette: near-black, warm bone white. 35mm film
> grain, shallow depth of field, natural skin texture, documentary realism. Not
> glossy, no direct flash, no teal-and-orange grade. No text, no logos, no
> watermarks, no brand names.

### `/public/work/w-12.jpg` — aspect 1:1 — blunt bob
> Photographed from directly behind, camera level with the ends of the hair: a
> blunt jaw-length bob cut with scissors over comb on dark straight hair. The
> bottom edge is perfectly level and hard — the whole purpose of the frame is to
> prove that line. Even, near-shadowless light on the hair itself against a dark
> background.
> Cinematic editorial photograph. Soft even key light, dark background. Muted
> palette: near-black, warm bone white. 35mm film grain, shallow depth of field,
> documentary realism. Not glossy, no direct flash, no teal-and-orange grade. No
> text, no logos, no watermarks, no brand names.

### `/public/work/w-13.jpg` — aspect 2:3 — twist out over a taper
> Photographed from behind and above: a Black man's defined twist-out curl
> pattern occupying the top two-thirds of the frame, resolving into a clean taper
> that fades to skin at the nape in the bottom third. Side light for curl
> separation and definition. No face.
> Cinematic editorial photograph. Single warm key light from one side, deep
> falloff into black. Muted palette: near-black, warm bone white. 35mm film
> grain, shallow depth of field, natural skin texture, documentary realism. Not
> glossy, no direct flash, no teal-and-orange grade. No text, no logos, no
> watermarks, no brand names.

### `/public/work/w-13-before.jpg` — aspect 2:3 — **use w-13 as reference image**
> The same man, same camera position and same lighting as the reference image,
> photographed before his haircut. The taper at the nape is grown out and uneven,
> the curl pattern on top is undefined and flattened. Identical framing, distance
> and exposure to the reference. No face visible.

### `/public/work/w-14.jpg` — aspect 1:1 — blended grey
> Very tight close-up of the temple and sideburn of a man in his fifties, where
> greying hair has been colour-blended into his natural dark hair so softly that
> there is no visible line or transition point anywhere. Even, soft, diffused
> light — hard light would invent an edge that is not there. Natural, undetectable.
> Cinematic editorial photograph. Soft even key light, dark background. Muted
> palette: near-black, warm bone white. 35mm film grain, macro detail, natural
> skin texture with visible pores, documentary realism. Not glossy, no direct
> flash, no teal-and-orange grade, no plastic skin. No text, no logos, no
> watermarks, no brand names.

### `/public/work/w-15.jpg` — aspect 4:5 — textured crop
> Front-on head-and-shoulders view of a short textured crop haircut with a blunt
> fringe sitting straight across the forehead, visible point-cut texture through
> the fringe, over a clean mid fade at the sides. Modern and current. Soft
> directional key light.
> Cinematic editorial photograph. Single warm key light from one side, deep
> falloff into black. Muted palette: near-black, warm bone white. 35mm film
> grain, shallow depth of field, natural skin texture with visible pores,
> documentary realism. Not glossy, no direct flash, no teal-and-orange grade, no
> plastic skin. No text, no logos, no watermarks, no brand names.

### `/public/work/w-16.jpg` — aspect 4:3 — a child's first haircut
> A young child of about four having their first haircut in a barbershop, sitting
> on a booster seat in the barber chair with a cape on. Photographed from the
> side at the child's own eye level. The barber's hands are in frame working with
> scissors. The child is calm and unbothered, looking off to the side. Warmer and
> a little wider than the other frames so the room shows around them.
> Cinematic editorial photograph. Warm key light, softer contrast than the rest of
> the set. Muted palette: near-black, warm bone white, one burnt-orange accent.
> 35mm film grain, shallow depth of field, natural skin texture, documentary
> realism. Not glossy, no direct flash, no teal-and-orange grade, no plastic skin.
> No text, no logos, no watermarks, no brand names.

---

## Running them

Nothing here is wired until the files exist — a path pointing at a missing image
would 404 rather than fall back to the generated plate. Once the files are in
`/public` under the names above:

```bash
node scripts/wire-images.mjs        # report what is present and what is missing
node scripts/wire-images.mjs --write  # patch the data files for what exists
npm run build
```

The script only touches a field when the file is actually on disk, so a partial
set is safe — every slot without an image keeps its generated plate.
