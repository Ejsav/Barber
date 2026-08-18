/* ============================================================================
 * FAQ
 * ----------------------------------------------------------------------------
 * Every question here is a real reason someone closes the tab instead of
 * booking: they don't know if they need an appointment, they don't know what
 * to book, they don't know where to park, they're nervous about bringing a
 * child. Answer those and the objection stops being one.
 *
 * Questions that exist only to carry keywords do not belong here. If a
 * question would not be asked at the counter, cut it.
 *
 * These feed both the on-page accordion and the FAQPage structured data, so
 * the answers must be genuinely accurate for the client — Google treats them
 * as factual claims about the business.
 * ========================================================================== */

export type FaqCategory = 'booking' | 'visit' | 'services' | 'payment';

export const faqCategories: { id: FaqCategory; label: string }[] = [
  { id: 'booking', label: 'Booking' },
  { id: 'services', label: 'Cuts & services' },
  { id: 'visit', label: 'Visiting' },
  { id: 'payment', label: 'Paying' },
];

export interface FaqItem {
  id: string;
  question: string;
  /** Paragraphs. Keep it to one or two — this is not a policy document. */
  answer: string[];
  category: FaqCategory;
  /** Surfaces on the homepage/visit page short list. */
  featured?: boolean;
}

export const faqs: FaqItem[] = [
  {
    id: 'walk-ins',
    question: 'Do you take walk-ins?',
    answer: [
      'Yes, whenever a chair is free. Appointments are always served first, so a walk-in on a Saturday afternoon usually means a wait and a weekday morning usually means none at all.',
      'If you want a specific barber at a specific time, book it. That is the only way to be certain.',
    ],
    category: 'booking',
    featured: true,
  },
  {
    id: 'what-to-book',
    question: 'I don’t know what to book. What do I pick?',
    answer: [
      'Book The Cut. It covers a consultation, a scissor-and-clipper cut, wash and finish, and it is the appointment most people need.',
      'If your barber sees something else fits better once you are in the chair — a fade, more scissor work, beard included — they will say so and adjust it there. You will not be charged for the wrong thing because you guessed.',
    ],
    category: 'booking',
    featured: true,
  },
  {
    id: 'choose-barber',
    question: 'How do I choose a barber?',
    answer: [
      'Read the roster. Each barber lists what they actually specialise in — skin fades, textured and coily hair, scissor work on longer hair, straight razor, kids — and their recent work sits on their page.',
      'If you would rather not choose, book any chair. Everyone here can cut a good head of hair; the specialisms are about who is fastest at what you specifically want.',
    ],
    category: 'booking',
    featured: true,
  },
  {
    id: 'late',
    question: 'What happens if I’m late?',
    answer: [
      'Up to about ten minutes, we will still cut you — it just comes out of your appointment, because the person after you booked their time too.',
      'Past that we will usually have to rebook you. Call the shop rather than guessing; if the day is quiet we will make it work.',
    ],
    category: 'booking',
    featured: true,
  },
  {
    id: 'kids',
    question: 'Do you cut kids’ hair?',
    answer: [
      'Yes. The Junior Cut covers twelve and under, and several of the barbers take them happily — June takes the most of them and has the patience to prove it.',
      'First haircuts are welcome. Mention it at booking so enough time is set aside.',
    ],
    category: 'services',
    featured: true,
  },
  {
    id: 'hair-types',
    question: 'Can you cut my hair type?',
    answer: [
      'Almost certainly. Between the roster there is dedicated experience in coily and textured hair, long and curly hair cut entirely with scissors, fine hair, and greying hair that needs blending rather than dyeing.',
      'If you have had a bad experience elsewhere, say so when you book. It tells the barber where to be careful.',
    ],
    category: 'services',
  },
  {
    id: 'how-long',
    question: 'How long does an appointment take?',
    answer: [
      'Most cuts are booked at 45 minutes, a line-up at 20, and the full cut-and-shave at 80. Every service on the menu lists its own time.',
      'Nobody is rushed out of the chair to hit the number.',
    ],
    category: 'services',
  },
  {
    id: 'parking',
    question: 'Where should I park?',
    answer: [
      'Metered street parking runs along Chapel and Orange. Temple Street Garage is a four-minute walk and validates after 6pm.',
      'At the Whitney Avenue shop there is a free lot behind the building, entrance off Waite Street.',
    ],
    category: 'visit',
    featured: true,
  },
  {
    id: 'first-visit',
    question: 'What happens on a first visit?',
    answer: [
      'You will get a consultation before anything is picked up — how you wear it, how much time you actually spend on it in the morning, what you did not like about the last cut.',
      'Bring a photo if you have one. It is far more useful than a name for a haircut, because the same name means five different things.',
    ],
    category: 'visit',
  },
  {
    id: 'cards',
    question: 'Do you accept cards?',
    answer: [
      'Cards, contactless and cash. Tips can go on the card.',
    ],
    category: 'payment',
    featured: true,
  },
  {
    id: 'gift-cards',
    question: 'Do you sell gift cards?',
    answer: [
      'Yes, at the counter, in any amount. They do not expire and can be used against any service.',
    ],
    category: 'payment',
  },
  {
    id: 'cancel',
    question: 'How do I cancel or move an appointment?',
    answer: [
      'Use the link in your booking confirmation, or call the shop. Any notice is better than none — a chair we know about at lunchtime is a chair someone else can have.',
    ],
    category: 'booking',
  },
];

export const featuredFaqs = faqs.filter((f) => f.featured);

export const faqsInCategory = (category: FaqCategory) =>
  faqs.filter((f) => f.category === category);
