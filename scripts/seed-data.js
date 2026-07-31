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
    id: 'celeb-1', name: 'Zara Monroe', category: 'musician',
    image: P('1531746020798-e6953c6e8e04'), coverImage: C('1540747913346-19e32dc3e97e'),
    verified: true, followers: 4200000, nationality: 'American', genre: 'Pop / R&B',
    bio: 'Global pop powerhouse from Los Angeles, California. Known for chart-topping hits and electric live performances that blend contemporary pop with soulful R&B. Three-time winner of the American Music Awards.',
  },
  {
    id: 'celeb-2', name: 'King Dallas', category: 'dj',
    image: P('1507003211169-0a1dd7228f2d'), coverImage: C('1571330735066-03aaa9429d89'),
    verified: true, followers: 1800000, nationality: 'British', genre: 'House / Electronic',
    bio: "London's premier DJ and music producer. Known for selling out major festivals across the UK and Europe with his signature progressive house sound. Residencies in London, Ibiza, and Berlin.",
  },
  {
    id: 'celeb-3', name: 'Marcus Bailey', category: 'comedian',
    image: P('1539571696357-5a69c17a67c6'), coverImage: C('1585699324551-f6c309eedeca'),
    verified: true, followers: 950000, nationality: 'American',
    bio: 'Award-winning American stand-up comedian and content creator. His relatable humor about everyday life has earned him a massive fanbase. Best Comedy Act winner at the National Comedy Awards 2025.',
  },
  {
    id: 'celeb-4', name: 'Isabelle Laurent', category: 'actor',
    image: P('1506794778202-cad84cf45f1d'), coverImage: C('1478760329108-5c3ed9d495a0'),
    verified: true, followers: 2300000, nationality: 'French',
    bio: 'French-born international film star. Having appeared in major Hollywood and European productions, Isabelle brings world-class talent to every red carpet appearance and live fan experience.',
  },
  {
    id: 'celeb-5', name: 'Chase Everett', category: 'musician',
    image: P('1500648767791-00dcc994a43e'), coverImage: C('1501386761578-eac5c94b800a'),
    verified: true, followers: 3100000, nationality: 'American', genre: 'Pop / Soul',
    bio: "Pop sensation taking the world by storm. Chase's smooth vocals and high-energy performances have earned him fans from coast to coast. His debut album went platinum in 6 countries.",
  },
  {
    id: 'celeb-6', name: 'Nova Chen', category: 'dj',
    image: P('1542178243-bc20204b769f'), coverImage: C('1429962714451-bb934ecdc4ec'),
    verified: true, followers: 2750000, nationality: 'Canadian', genre: 'Global House / Dance',
    bio: "International DJ with residencies in Las Vegas, Ibiza and Toronto. Nova's sets blend house, techno and global club music into an unforgettable experience. Ranked #8 in DJ Mag's Top 100.",
  },
];

const events = [
  {
    id: 'event-1', title: 'The Crown Experience', subtitle: 'Live in Los Angeles', celebrityId: 'celeb-1',
    date: '2026-08-15T20:00:00', doorsOpen: '2026-08-15T18:00:00',
    venue: 'Crypto.com Arena', city: 'Los Angeles', country: 'United States',
    image: E('1540575467063-178a50c2df87'), category: 'musician',
    description: "Zara Monroe returns to Los Angeles for the most anticipated concert of the year. The Crown Experience is a full theatrical production featuring her entire catalog, special guests, and a visual spectacle you won't forget. With a 360-degree stage setup and a $2M LED production, this will redefine what a pop concert can be.",
    isFeatured: true, isOnline: false, status: 'upcoming', ageRestriction: '18+', dresscode: 'Smart Casual',
    tags: ['Pop', 'Los Angeles', 'Live Concert', 'Premium'],
    ticketTiers: [
      { id: 'tier-1-1', name: 'General', price: 120, currency: 'USD', available: 3200, total: 5000, tier: 'general', perks: ['Standard admission', 'Access to general area'] },
      { id: 'tier-1-2', name: 'VIP', price: 350, currency: 'USD', available: 480, total: 800, tier: 'vip', perks: ['VIP section', 'Complimentary drinks ×2', 'Dedicated VIP entrance', 'VIP lounge'] },
      { id: 'tier-1-3', name: 'VVIP Table', price: 900, currency: 'USD', available: 45, total: 100, tier: 'vvip', perks: ['Private table (4 seats)', 'Bottle service', 'Premium view', 'Backstage tour', 'Exclusive merch pack'] },
      { id: 'tier-1-4', name: 'Meet & Greet', price: 2000, currency: 'USD', available: 8, total: 20, tier: 'meetgreet', perks: ['Personal meet with Zara', 'Signed merch bundle', 'Photo session', 'VVIP table included', 'Soundcheck access'] },
    ],
  },
  {
    id: 'event-2', title: 'Electric Nights Vol. 3', subtitle: 'King Dallas × London', celebrityId: 'celeb-2',
    date: '2026-09-06T22:00:00', doorsOpen: '2026-09-06T20:00:00',
    venue: 'Printworks London', city: 'London', country: 'United Kingdom',
    image: E('1516450360452-9312f5e86fc7'), category: 'dj',
    description: "King Dallas's legendary Electric Nights series returns for volume 3. Two floors, 10 hours, the best in house, techno and global beats. The UK's unmissable event of the year.",
    isFeatured: true, isOnline: false, status: 'upcoming', ageRestriction: '21+', dresscode: 'Upscale',
    tags: ['House', 'London', 'Electronic', 'Club Night'],
    ticketTiers: [
      { id: 'tier-2-1', name: 'Early Bird', price: 20, currency: 'GBP', available: 200, total: 500, tier: 'general', perks: ['Standard admission', 'Early bird price'] },
      { id: 'tier-2-2', name: 'General', price: 35, currency: 'GBP', available: 1800, total: 2000, tier: 'general', perks: ['Standard admission', 'Full night access'] },
      { id: 'tier-2-3', name: 'VIP Table', price: 250, currency: 'GBP', available: 30, total: 60, tier: 'vip', perks: ['Private table (6 seats)', 'Bottle service', 'Dedicated host', 'Best view'] },
    ],
  },
  {
    id: 'event-3', title: 'Laugh All Night', subtitle: 'Marcus Bailey Comedy Special', celebrityId: 'celeb-3',
    date: '2026-07-25T19:00:00', doorsOpen: '2026-07-25T17:30:00',
    venue: 'Beacon Theatre', city: 'New York', country: 'United States',
    image: E('1585699324551-f6c309eedeca'), category: 'comedian',
    description: "Two hours of non-stop laughter with America's funniest man. Marcus Bailey's brand-new material promises fresh jokes, celebrity roasts, and surprise guest comedians.",
    isFeatured: false, isOnline: false, status: 'upcoming',
    tags: ['Comedy', 'Stand-up', 'New York'],
    ticketTiers: [
      { id: 'tier-3-1', name: 'Standard', price: 45, currency: 'USD', available: 600, total: 800, tier: 'general', perks: ['Standard seating', 'Show admission'] },
      { id: 'tier-3-2', name: 'Premium', price: 110, currency: 'USD', available: 150, total: 200, tier: 'vip', perks: ['Front row seating', 'Pre-show cocktails', 'Photo opportunity'] },
    ],
  },
  {
    id: 'event-4', title: 'Chase Everett Live at the O2', subtitle: 'UK Arena Debut', celebrityId: 'celeb-5',
    date: '2026-10-11T19:30:00', doorsOpen: '2026-10-11T18:00:00',
    venue: 'The O2 Arena', city: 'London', country: 'United Kingdom',
    image: E('1468359601543-843bfaef291a'), category: 'musician',
    description: "Chase Everett makes his UK arena debut at the iconic O2. Joining him will be special guests for a once-in-a-lifetime showcase of pop music on the world stage.",
    isFeatured: true, isOnline: false, status: 'upcoming', ageRestriction: '16+',
    tags: ['Pop', 'London', 'Arena', 'UK Tour'],
    ticketTiers: [
      { id: 'tier-4-1', name: 'Floor', price: 75, currency: 'GBP', available: 3000, total: 5000, tier: 'general', perks: ['Floor standing'] },
      { id: 'tier-4-2', name: 'Seated', price: 65, currency: 'GBP', available: 4200, total: 6000, tier: 'general', perks: ['Reserved seat'] },
      { id: 'tier-4-3', name: 'VIP Box', price: 280, currency: 'GBP', available: 45, total: 80, tier: 'vip', perks: ['Private box (8 people)', 'Dedicated server', 'Premium bar'] },
      { id: 'tier-4-4', name: 'Meet & Greet', price: 450, currency: 'GBP', available: 15, total: 30, tier: 'meetgreet', perks: ['Personal meet with Chase', 'Signed vinyl', 'Backstage access', 'Floor ticket'] },
    ],
  },
  {
    id: 'event-5', title: 'Toronto Soundwave', subtitle: 'Nova Chen Homecoming', celebrityId: 'celeb-6',
    date: '2026-08-30T21:00:00', doorsOpen: '2026-08-30T19:00:00',
    venue: 'Budweiser Stage', city: 'Toronto', country: 'Canada',
    image: E('1470225620780-dba8ba36b745'), category: 'dj',
    description: "Nova Chen returns home to Toronto for a massive open-air festival. Canada's biggest outdoor music event featuring world-class production and 8+ hours of music.",
    isFeatured: false, isOnline: false, status: 'upcoming',
    tags: ['House', 'Toronto', 'Festival', 'Outdoor'],
    ticketTiers: [
      { id: 'tier-5-1', name: 'General', price: 45, currency: 'CAD', available: 5000, total: 8000, tier: 'general', perks: ['Grounds admission', 'All stages'] },
      { id: 'tier-5-2', name: 'VIP', price: 150, currency: 'CAD', available: 400, total: 600, tier: 'vip', perks: ['VIP zone', 'Exclusive bar', 'VIP entrance'] },
    ],
  },
  {
    id: 'event-6', title: 'Zara Monroe Live in Miami', subtitle: 'American Tour 2026', celebrityId: 'celeb-1',
    date: '2026-08-22T20:00:00', doorsOpen: '2026-08-22T18:30:00',
    venue: 'Miami Beach Convention Center', city: 'Miami', country: 'United States',
    image: E('1493225457124-a3eb161ffa5f'), category: 'musician',
    description: "Zara Monroe brings her American Tour to Miami after selling out Los Angeles. A bigger, more spectacular show with new production elements.",
    isFeatured: false, isOnline: false, status: 'upcoming',
    tags: ['Pop', 'Miami', 'American Tour'],
    ticketTiers: [
      { id: 'tier-6-1', name: 'General', price: 60, currency: 'USD', available: 8000, total: 12000, tier: 'general', perks: ['General admission'] },
      { id: 'tier-6-2', name: 'VIP', price: 200, currency: 'USD', available: 500, total: 800, tier: 'vip', perks: ['VIP section', 'Welcome drink', 'VIP entrance'] },
    ],
  },
  {
    id: 'event-7', title: 'Full Moon Festival', subtitle: 'Nova Chen × Sydney', celebrityId: 'celeb-6',
    date: '2026-09-20T20:00:00', doorsOpen: '2026-09-20T18:00:00',
    venue: 'Sydney Showground', city: 'Sydney', country: 'Australia',
    image: E('1429962714451-bb934ecdc4ec'), category: 'dj',
    description: "An unforgettable night under the full moon at Sydney Showground. Nova Chen headline set with incredible support acts and world-class production.",
    isFeatured: false, isOnline: false, status: 'sold_out',
    tags: ['House', 'Sydney', 'Festival'],
    ticketTiers: [
      { id: 'tier-7-1', name: 'General', price: 60, currency: 'AUD', available: 0, total: 3000, tier: 'general', perks: ['General admission'] },
      { id: 'tier-7-2', name: 'VIP', price: 220, currency: 'AUD', available: 0, total: 400, tier: 'vip', perks: ['VIP access', 'Bottle service'] },
    ],
  },
  {
    id: 'event-8', title: 'New York Comedy Festival', subtitle: 'Marcus Bailey & Friends', celebrityId: 'celeb-3',
    date: '2026-12-28T18:00:00', doorsOpen: '2026-12-28T16:30:00',
    venue: 'Radio City Music Hall', city: 'New York', country: 'United States',
    image: E('1517604931442-7e0c8ed2963c'), category: 'comedian',
    description: "The biggest comedy festival on the East Coast. Marcus Bailey headlines alongside 8 top comedians for a 4-hour comedy marathon with a New Year countdown finale.",
    isFeatured: false, isOnline: false, status: 'upcoming',
    tags: ['Comedy', 'Festival', 'New York', 'New Year'],
    ticketTiers: [
      { id: 'tier-8-1', name: 'Standard', price: 80, currency: 'USD', available: 1500, total: 2000, tier: 'general', perks: ['Standard admission', 'Festival wristband'] },
      { id: 'tier-8-2', name: 'VIP', price: 220, currency: 'USD', available: 200, total: 300, tier: 'vip', perks: ['VIP seating', 'Open bar (2hrs)', 'Meet & greet', 'VIP pack'] },
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
