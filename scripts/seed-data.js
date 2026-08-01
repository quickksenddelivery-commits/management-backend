/**
 * Seed data mirroring the frontend mock (management/src/data/mock.ts + sponsors.ts).
 * IDs match the frontend so the app can swap mock data for the API with no churn.
 */

/* ── Unsplash URL helpers (identical to frontend lib/images usage) ── */
const U = (id, w, h, crop = 'center') =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&q=85&auto=format&fit=crop&crop=${crop}`;
const P = (id) => U(id, 600, 800, 'faces,center'); // portrait 3:4
const C = (id) => U(id, 1200, 420, 'top'); // cover 3:1
const E = (id) => U(id, 800, 450, 'center'); // poster 16:9

const celebrities = [
  {
    // Real photo — MrBeast 2023.jpg, CC-BY-4.0, © Steven Khan, via Wikimedia Commons
    // https://commons.wikimedia.org/wiki/File:MrBeast_2023.jpg
    id: 'celeb-1', name: 'MrBeast', category: 'influencer',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/MrBeast_2023.jpg/960px-MrBeast_2023.jpg',
    coverImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/MrBeast_2023.jpg/1280px-MrBeast_2023.jpg',
    verified: true, followers: 250000000, nationality: 'American',
    bio: "The world's biggest YouTuber, known for elaborate high-stakes challenges, viral philanthropy, and building one of the largest content empires on the internet.",
  },
  {
    // No freely-licensed press photo found for this creator — kept as a generic
    // placeholder portrait until a real, rights-cleared image is provided.
    id: 'celeb-2', name: 'Rob Malloy', category: 'influencer',
    image: P('1502764613149-7f1d229e230f'), coverImage: C('1517841905240-472988babdf9'),
    verified: true, followers: 5000000, nationality: 'American',
    bio: 'Digital creator and lifestyle influencer known for engaging vlogs, brand collaborations, and a rapidly growing fanbase across social platforms.',
  },
  {
    // Real photo — Kevin Costner 2016.jpg, public domain (NASA/Bill Ingalls), via Wikimedia Commons
    // https://commons.wikimedia.org/wiki/File:Kevin_Costner_2016.jpg
    id: 'celeb-3', name: 'Kevin Costner', category: 'actor',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Kevin_Costner_2016.jpg/960px-Kevin_Costner_2016.jpg',
    coverImage: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Kevin_Costner_2016.jpg/1280px-Kevin_Costner_2016.jpg',
    verified: true, followers: 3500000, nationality: 'American',
    bio: 'Academy Award-winning American actor and filmmaker, celebrated for iconic roles across film and television, from sweeping westerns to modern television drama.',
  },
];

const events = [
  {
    id: 'event-1', title: 'MrBeast Live: Beast Games Experience', subtitle: 'Fan Challenge Spectacular', celebrityId: 'celeb-1',
    date: '2026-10-03T19:00:00', doorsOpen: '2026-10-03T17:00:00',
    venue: 'SoFi Stadium', city: 'Los Angeles', country: 'United States',
    image: E('1571019613454-1cb2f99b2d8b'), category: 'influencer',
    description: "MrBeast brings his biggest challenges to the stage for one night only. Expect giant prize giveaways, live stunts, and surprise guest creators in a show built for the whole family.",
    isFeatured: true, isOnline: false, status: 'upcoming',
    tags: ['Influencer', 'Los Angeles', 'Family', 'Live Event'],
    ticketTiers: [
      { id: 'tier-1-1', name: 'General', price: 95, currency: 'USD', available: 10000, total: 15000, tier: 'general', perks: ['Standard admission'] },
      { id: 'tier-1-2', name: 'VIP', price: 300, currency: 'USD', available: 500, total: 800, tier: 'vip', perks: ['Priority seating', 'Exclusive merch pack', 'Early entry'] },
      { id: 'tier-1-3', name: 'Meet & Greet', price: 900, currency: 'USD', available: 30, total: 50, tier: 'meetgreet', perks: ['Personal meet with MrBeast', 'Photo op', 'Signed merch'] },
    ],
  },
  {
    id: 'event-2', title: 'Rob Malloy: Creator Meetup Tour', subtitle: 'Live in Chicago', celebrityId: 'celeb-2',
    date: '2026-09-12T18:00:00', doorsOpen: '2026-09-12T17:00:00',
    venue: 'House of Blues Chicago', city: 'Chicago', country: 'United States',
    image: E('1506863530036-1efeddceb993'), category: 'influencer',
    description: "Rob Malloy brings his popular creator meetup tour to Chicago — a night of live Q&A, fan games, and behind-the-scenes stories from his biggest videos.",
    isFeatured: false, isOnline: false, status: 'upcoming',
    tags: ['Influencer', 'Chicago', 'Meetup'],
    ticketTiers: [
      { id: 'tier-2-1', name: 'General', price: 40, currency: 'USD', available: 800, total: 1200, tier: 'general', perks: ['Standard admission'] },
      { id: 'tier-2-2', name: 'VIP Meet & Greet', price: 150, currency: 'USD', available: 60, total: 100, tier: 'meetgreet', perks: ['Meet & greet', 'Photo op', 'Exclusive merch'] },
    ],
  },
  {
    id: 'event-3', title: 'An Evening with Kevin Costner', subtitle: 'Live Q&A & Film Retrospective', celebrityId: 'celeb-3',
    date: '2026-11-08T19:30:00', doorsOpen: '2026-11-08T18:30:00',
    venue: 'Dolby Theatre', city: 'Los Angeles', country: 'United States',
    image: E('1531891437562-4301cf35b7e4'), category: 'actor',
    description: "Join Kevin Costner for an intimate evening of career retrospectives, behind-the-scenes stories, and a live audience Q&A spanning his most celebrated film and television roles.",
    isFeatured: true, isOnline: false, status: 'upcoming', ageRestriction: '16+',
    tags: ['Actor', 'Los Angeles', 'Q&A'],
    ticketTiers: [
      { id: 'tier-3-1', name: 'Standard', price: 75, currency: 'USD', available: 1200, total: 1800, tier: 'general', perks: ['Standard seating'] },
      { id: 'tier-3-2', name: 'Premium', price: 220, currency: 'USD', available: 150, total: 250, tier: 'vip', perks: ['Front section seating', 'Pre-show reception'] },
      { id: 'tier-3-3', name: 'Meet & Greet', price: 500, currency: 'USD', available: 25, total: 40, tier: 'meetgreet', perks: ['Personal meet with Kevin', 'Photo op', 'Signed memorabilia'] },
    ],
  },
];

const sponsorshipPackages = [
  {
    id: 'pkg-title', tier: 'title', name: 'Title Sponsor', tagline: 'Own the event. Your name in lights.',
    price: 50000, currency: 'USD', slotsTotal: 1, slotsAvailable: 1,
    benefits: [
      'Naming rights — "Event presented by [Your Brand]"',
      'Top-billing logo on all stages, screens & LED walls',
      '20 VVIP passes + private hospitality suite',
      'Full backstage & meet-and-greet access',
      'Dedicated social media campaign (5M+ reach)',
      'Press release & media mentions',
      'Category exclusivity (no competing brands)',
      'On-stage brand moment / shout-out',
    ],
  },
  {
    id: 'pkg-platinum', tier: 'platinum', name: 'Platinum', tagline: 'Premium visibility across the experience.',
    price: 25000, currency: 'USD', slotsTotal: 4, slotsAvailable: 3, popular: true,
    benefits: [
      'Main-stage branding & screen placement', '10 VIP passes',
      'Branded activation booth (prime location)', 'Logo on event page, tickets & emails',
      'Social media features (3 posts)', 'Inclusion in event press kit',
    ],
  },
  {
    id: 'pkg-gold', tier: 'gold', name: 'Gold', tagline: 'Strong presence, great value.',
    price: 10000, currency: 'USD', slotsTotal: 8, slotsAvailable: 6,
    benefits: ['Logo on event page & on-site materials', '4 VIP passes', 'Activation booth space', 'One social media mention'],
  },
  {
    id: 'pkg-silver', tier: 'silver', name: 'Silver', tagline: 'Get your brand in front of the crowd.',
    price: 5000, currency: 'USD', slotsTotal: 15, slotsAvailable: 11,
    benefits: ['Logo on event website', '2 VIP passes', 'Newsletter mention'],
  },
  {
    id: 'pkg-community', tier: 'community', name: 'Community Partner', tagline: 'Support the movement.',
    price: 1500, currency: 'USD', slotsTotal: 30, slotsAvailable: 22,
    benefits: ['Logo on event website', 'Listed as an official supporter', 'Social media thank-you'],
  },
];

const sponsors = [
  { id: 'spo-1', name: 'Pulse Telecom', industry: 'Telecommunications', tier: 'title', color: '#A78BFA', eventId: 'event-1' },
  { id: 'spo-2', name: 'Zenith Capital', industry: 'Banking & Finance', tier: 'platinum', color: '#F59E0B', eventId: 'event-1' },
  { id: 'spo-3', name: 'Cascade', industry: 'Beverages', tier: 'gold', color: '#34D399', eventId: 'event-2' },
  { id: 'spo-4', name: 'NovaTel', industry: 'Telecommunications', tier: 'platinum', color: '#60A5FA', eventId: null },
  { id: 'spo-5', name: 'AeroLux', industry: 'Aviation', tier: 'gold', color: '#22D3EE', eventId: null },
  { id: 'spo-6', name: 'Vibe', industry: 'Streaming & Media', tier: 'platinum', color: '#FB7185', eventId: null },
  { id: 'spo-7', name: 'Lumina', industry: 'Technology', tier: 'silver', color: '#FBBF24', eventId: null },
  { id: 'spo-8', name: 'GoldCrest', industry: 'Luxury Goods', tier: 'community', color: '#F472B6', eventId: null },
];

module.exports = { celebrities, events, sponsorshipPackages, sponsors };
