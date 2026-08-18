# Shot list

Thirty-one image slots. Every one currently renders a generated halftone plate,
so the site is complete without them — photographs replace the plates one at a
time, in any order, with no layout change and no code change beyond setting a
path in `src/data/`.

Drop files at the paths below and the wiring is mechanical.

---

## Direction that applies to everything

**The room is dark.** Near-black walls, warm off-white light, one ember accent.
Shoot into shadow rather than filling it — the site's entire palette is ink,
bone and a single burnt orange, and photographs that arrive bright and evenly
lit will fight it.

**Light from one side.** A window, a single lamp, the strip above a mirror.
Raking light across a fade is what makes the gradient legible; flat frontal
light flattens the exact thing the work is being judged on.

**Shoot the craft, not the pose.** Hands mid-cut, clippers against a nape, hair
on the cape. Nobody folding their arms and smiling at the camera.

**Real clients, real cuts, signed releases.** No stock, no borrowed feed
content. A shop's lookbook is a claim about its own work.

**Avoid:** direct flash, blown highlights, heavy vignette filters, colour grades
that push teal or magenta, anything that reads as a phone portrait mode with the
edges chewed off.

**Files:** JPEG or WebP, sRGB, quality 80+, longest edge 2400px minimum. Next
generates every responsive size from the original, so send the largest you have
and do not pre-crop to the aspect ratios below — they are how the slot displays,
not how the file must be cut. Keep the subject away from the extreme edges so
the crops have room to work.

---

## 1. Barber portraits — 5 slots

**Aspect 4:5 portrait · 1600×2000 minimum · `src/data/barbers.ts` → `portrait`**

Shoot all five in one session, same lens, same light, same wall. The roster page
lays them out as a spread, and five portraits that do not match as a set is the
single most visible way this page can look cheap. Each barber at their own
station, working, three-quarter turn rather than square to camera.

### `/public/team/marcus-reyes.jpg`
Marcus Reyes, owner and master barber, standing at his chair. Waist-up, turned
about thirty degrees off camera, looking down the length of the shop rather than
into the lens. Clippers in one hand, held loosely, not brandished. The mirror
behind him catches the room in soft focus. He should read as the person who owns
the room — settled, unhurried, mid-thought.

### `/public/team/desmond-whitfield.jpg`
Desmond Whitfield, senior barber, holding clippers. Closer crop than Marcus —
chest-up — with the clippers raised near shoulder height as if he has just
stepped back to check a line. Light from the left, hard enough to define the
edge of his jaw against the dark wall. Slight smile or none; he should look like
he is concentrating.

### `/public/team/nina-castellanos.jpg`
Nina Castellanos, scissor specialist, mid-cut. The only portrait with a client
in it: shot from behind and to the side of the chair, Nina in focus with her
shears working through a section of long hair, the client's head soft and
anonymous in the foreground. Window light. This frame has to say "scissors" at a
glance, because that is what people book her for.

### `/public/team/yusuf-amari.jpg`
Yusuf Amari, barber, stropping a straight razor. Chest-up, hands in frame and
sharp — the strop hanging from the chair, the razor caught mid-pull. Warm low
light, deep shadow behind. The most still and most classical of the five; it
should feel like the calmest corner of the shop.

### `/public/team/june-park.jpg`
June Park, barber, at the front window of the shop. The brightest portrait of the
set — she stands with the window behind her shoulder so daylight wraps her, the
street soft and blown out beyond. Waist-up, relaxed, comb or clippers in hand.
She takes most of the shop's junior appointments, so this frame should feel open
and easy rather than severe.

---

## 2. Hero — 1 slot (image or video)

**Full-bleed on mobile, tall right-hand plate on desktop · 2400×3000 minimum ·
`src/data/media.ts` → `heroMedia.image`**

### `/public/shop/hero.jpg`
The first thing every visitor sees, and the LCP element on the homepage.

A barber mid-fade, shot from behind and slightly above the client's shoulder:
clippers against the nape, the guard line visible, the barber's hand steadying
the head. The client is anonymous — we see the back of a head and a cape, no
face. Behind them the shop falls away into darkness with one or two warm lights
carrying the depth.

Composition must survive two very different crops: full-bleed behind the
headline on a phone (so keep the top third quiet — text sits over it) and a tall
vertical plate on the right of a desktop screen (so the action belongs slightly
right of centre). Shoot it vertical and loose.

**Optional video instead** — `/public/shop/hero.mp4` plus
`/public/shop/hero-poster.jpg`. Eight to twelve seconds, silent, seamless loop,
H.264 under 3MB, locked-off camera with only the clippers and hands moving. The
site only fetches it on a wide viewport, on a connection that has not asked to
save data, and never under reduced-motion — the poster carries it otherwise, so
the poster still has to be a good photograph on its own.

---

## 3. Shop atmosphere — 7 slots

**`src/data/media.ts` · varied aspect**

These sell the room rather than the haircut. They run in the "This is your shop"
section and on the visit page, and they are the difference between a shop that
looks like a business and one that looks like somewhere you would want to sit
for forty-five minutes.

### `/public/shop/chairs.jpg`
**Landscape 4:3 · 2000×1500**
The row of chairs down the length of the shop, mirrors facing mirrors. Shoot
low, from one end, so the chairs recede and the facing mirrors repeat the room
into itself. Empty — no barbers, no clients. Late in the day, lights on, the
front window a bright rectangle at the far end. This is the establishing shot.

### `/public/shop/tools.jpg`
**Square 1:1 · 1600×1600**
Chrome clippers, combs and shears laid out on a folded towel. Directly overhead,
tight, filling the frame. The towel gives it a soft ground; the chrome should
pick up one hard specular highlight each. Arrange it like a surgeon's tray —
deliberate, spaced, nothing overlapping carelessly. No hands.

### `/public/shop/floor.jpg`
**Portrait 4:5 · 1600×2000**
Cut hair on the floor beneath a chair at the end of the day. Looking straight
down at the base of the chair, the footrest in frame at the top, clippings
scattered across the tile. Unglamorous on purpose — this is the frame that says
the shop is used, and it is the one that stops the set feeling staged.

### `/public/shop/records.jpg`
**Portrait 4:5 · 1600×2000**
Record player and shelf of LPs beside the waiting bench. Three-quarter angle,
close enough to read a couple of spines, the tonearm down and playing. Warm lamp
light. Whatever the shop's actual equivalent is — the speaker, the espresso
machine, the wall of Polaroids — shoot that instead. The point is the one object
that tells you what the room is like when nobody is cutting.

### `/public/shop/window.jpg`
**Landscape 4:3 · 2000×1500**
Front window looking out onto the street in late afternoon light. Shot from
inside, so the room is in silhouette and the street beyond is bright — the
signage reversed on the glass, a passer-by blurred. Golden hour, shallow depth
of field. This is the frame that places the shop in its neighbourhood.

### `/public/shop/fade-detail.jpg`
**Portrait 4:5 · 1600×2000 · `manifestoMedia`**
Close detail of a fade blending from skin into length, shot in raking light.
Extremely tight — the frame is filled by maybe four inches of head, from bare
skin at the bottom through the blend to length at the top. Side light almost
parallel to the skin so the gradient reads as a gradient. No face, no ear if
possible. This is the shop's whole argument in one frame, so it is worth
reshooting until the blend is genuinely invisible.

### `/public/shop/chapel-street.jpg`
**Landscape 4:3 · 2000×1500 · `visitMedia` and the Chapel Street location**
The shopfront at dusk, sign lit. From across the street, straight on or very
slightly angled, at the moment the sky still has colour in it but the interior
lights are already stronger — blue hour, roughly twenty minutes after sunset.
The window glowing warm, the door visible, enough of the neighbouring buildings
to make the address findable on foot. One frame, used in three places, so it is
worth waiting for the right ten minutes.

---

## 4. Second location — 1 slot

**Landscape 4:3 · 2000×1500 · `src/data/locations.ts` → `whitney-avenue.media.image`**

*Skip this and delete the Whitney Avenue entry if the business has one address.*

### `/public/shop/whitney-avenue.jpg`
The second shopfront in the morning, awning out, the parking lot behind. The
counterpoint to the dusk shot above: flat morning light, awning down, the lot
visible so the "free parking behind" claim on the page is something you can see.
Same distance and framing discipline as the Chapel Street frame so the two read
as one business.

---

## 5. The Book — 16 slots (+2 before shots)

**`src/data/work.ts` → `image`, and `beforeImage` where noted**

The portfolio. Every frame is credited to the barber who cut it and carries a
BOOK THIS LOOK control wired to that barber and that service, so attribution has
to be accurate.

Shoot these against the same dark wall, consistently, in batches — a lookbook
where every frame has a different background reads as a camera roll. Faces are
optional and usually better avoided; the cut is the subject.

★ = surfaces on the homepage rail, so these six carry the most weight.

### `/public/work/w-01.jpg` ★
**Tall 2:3 · 1600×2400 · fade · Marcus Reyes**
Zero skin fade with a razored hard part, shot from behind at the nape. Directly
behind the chair, camera at the height of the client's crown, tilted down. The
fade should run from bare skin at the neck up into the length cleanly, and the
hard part should be a single crisp line cut into the side, visible from this
angle. Hard side light to make the gradient read.

### `/public/work/w-01-before.jpg`
**Same framing exactly · the same client before the cut, roughly five weeks
grown out.** Shoot this first, from the identical position, with the identical
light — the before/after component wipes one over the other, so any change in
distance, angle or exposure between the two frames destroys the effect.

### `/public/work/w-02.jpg` ★
**Portrait 4:5 · 1600×2000 · textured · Desmond Whitfield**
Profile of a sponge-set coil pattern above a clean mid taper. Straight side-on,
tight enough that the head fills the frame vertically. The interest is the
contrast between the defined coil texture on top and the smooth taper below —
light it so both read, which usually means a soft key on the texture and a
harder rim along the taper.

### `/public/work/w-03.jpg` ★
**Landscape 4:3 · 2000×1500 · longer · Nina Castellanos**
Scissor-cut fringe falling past the brow, dried and unstyled. Front three-quarter,
close, the fringe the clear subject. Deliberately unstyled — no product, no
blow-dry — because the point of the frame is that the cut sits properly on its
own. Window light, soft.

### `/public/work/w-04.jpg` ★
**Square 1:1 · 1600×1600 · beard · Marcus Reyes**
Three-quarter view of a full beard squared to the jaw with a razored cheek line.
Crop from nose to collarbone so the jaw geometry is the whole frame. The cheek
line has to be visibly cut rather than merely trimmed — light it from the side
that shows the edge.

### `/public/work/w-05.jpg`
**Portrait 4:5 · 1600×2000 · textured · Desmond Whitfield**
Overhead detail of a 360 wave pattern above a low fade. Camera directly above and
slightly behind, looking down at the crown, so the wave pattern radiates across
the whole frame. Needs hard, low, raking light — waves are pure texture and
disappear under anything soft.

### `/public/work/w-06.jpg` ★
**Tall 2:3 · 1600×2400 · longer · Nina Castellanos**
Long layered curtain cut on wavy hair, shot in window light. Full head and
shoulders, turned slightly, hair falling naturally either side of a centre part.
The brightest frame in the lookbook — shoot it beside the front window and let
the background blow out. It is the counterweight to all the dark fade frames.

### `/public/work/w-07.jpg`
**Square 1:1 · 1600×1600 · fade · Marcus Reyes**
Side profile of a drop fade curving behind the ear with a point-cut top. Straight
side-on. The whole subject is the curve — the way the fade line drops behind the
ear rather than running level — so frame so that arc sits across the middle of
the square.

### `/public/work/w-08.jpg` ★
**Portrait 4:5 · 1600×2000 · classic · Yusuf Amari**
Classic scissor side part with a soft taper, combed and dressed with tonic.
Three-quarter front, head and shoulders. The most formal frame in the set — the
part should be sharp, the hair should have visible sheen from the tonic, and the
whole thing should look like it was cut in 1962 and photographed today. Warmer
light than the fade frames.

### `/public/work/w-09.jpg`
**Wide 16:9 · 2400×1350 · design · Desmond Whitfield**
Detail of two freehand razor lines cut through a skin fade at the temple.
Extremely tight and horizontal — the frame is the temple and nothing else. The
lines must read as clean-edged channels, not scratches, so light almost parallel
to the skin and expose for the shadow inside the line.

### `/public/work/w-10.jpg`
**Landscape 4:3 · 2000×1500 · beard · Yusuf Amari**
Hot towel lifted from a shaved jaw, steam visible against a dark background. The
most cinematic frame in the set. Shoot against the darkest wall in the shop,
back-light the steam so it separates, and catch the moment the towel comes away
— the jaw clean and slightly flushed. Fast shutter; steam does not wait.

### `/public/work/w-11.jpg`
**Portrait 4:5 · 1600×2000 · fade · Marcus Reyes**
Burst fade radiating around the ear into a longer back. Side-on and slightly
behind, so the semicircle of the burst around the ear is the centre of the frame
and the length at the back is visible falling away. Raking light again.

### `/public/work/w-12.jpg`
**Square 1:1 · 1600×1600 · longer · Nina Castellanos**
Blunt jaw-length bob cut with scissors over comb, shot from behind. Directly
behind, camera level with the ends. The subject is the line — the bottom edge
should be perfectly level and hard, and the frame exists to prove it. Even,
shadowless light on the hair itself.

### `/public/work/w-13.jpg`
**Tall 2:3 · 1600×2400 · textured · Desmond Whitfield**
Twist-out curl definition over a clean taper at the nape. From behind and above,
the defined curl pattern occupying the top two-thirds and the taper resolving to
skin at the bottom. Side light for the curl separation.

### `/public/work/w-13-before.jpg`
**Same framing exactly · the same client before, with an uneven grown-out
taper.** As with w-01 — shoot before and after from an identical position under
identical light, or the comparison slider will read as two different photographs
rather than one transformation.

### `/public/work/w-14.jpg`
**Square 1:1 · 1600×1600 · classic · Yusuf Amari**
Temple detail showing softened grey blended into natural dark hair. Very tight on
the temple and sideburn. The whole point is that you cannot see where the
blending starts or stops, so this frame needs even, soft light — hard light will
invent a line that is not there. The hardest frame on the list to shoot well.

### `/public/work/w-15.jpg` ★
**Portrait 4:5 · 1600×2000 · classic · June Park**
Short textured crop with a blunt fringe over a mid fade. Front-on, head and
shoulders, the fringe sitting straight across the forehead with visible texture
through it. Clean and modern; the most "current" frame in the lookbook.

### `/public/work/w-16.jpg`
**Landscape 4:3 · 2000×1500 · classic · June Park**
A child's first haircut — cape on, booster seat in the chair. Shot from the side
at the child's eye level, the barber's hands in frame, the child's face visible
and unbothered. Warm and slightly wider than the rest so the room shows. **Get
written parental consent before this one is published.** It is the frame that
sells the shop to every parent who visits the site, and it is the one frame with
a real permissions requirement attached.

---

## Wiring it up

Nothing here is wired until the files exist — a path pointing at a missing image
would 404 rather than fall back to the plate.

Once files are in `/public`, set the field and the plate is replaced
automatically at the same crop:

```ts
// data/barbers.ts
portrait: '/public/team/marcus-reyes.jpg'  →  portrait: '/team/marcus-reyes.jpg'

// data/work.ts
image: '/work/w-01.jpg',
beforeImage: '/work/w-01-before.jpg',

// data/media.ts
heroMedia.image  ·  shopMedia[n].image  ·  manifestoMedia.image  ·  visitMedia.image

// data/locations.ts
locations[n].media.image
```

Paths are relative to `/public`, so `/public/work/w-01.jpg` is written as
`/work/w-01.jpg`.

The `alt` strings already in the data are the briefs above in short form, so they
double as real alt text once the photograph exists — revise them only if the
final shot differs from what was specified.
