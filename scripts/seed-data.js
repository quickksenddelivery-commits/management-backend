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
    _id: 'celeb-1', name: 'Zara Musa', category: 'musician',
    image: P('1531746020798-e6953c6e8e04'), coverImage: C('1540747913346-19e32dc3e97e'),
    verified: true, followers: 4200000, nationality: 'Nigerian', genre: 'Afrobeats / R&B',
    bio: 'Afrobeats powerhouse from Lagos, Nigeria. Known for chart-topping hits and electric live performances that blend traditional African rhythms with contemporary beats. Three-time winner of the African Music Awards.',
  },
  {
    _id: 'celeb-2', name: 'King Dami', category: 'dj',
    image: P('1507003211169-0a1dd7228f2d'), coverImage: C('1571330735066-03aaa9429d89'),
    verified: true, followers: 1800000, nationality: 'South African', genre: 'Amapiano / House',
    bio: "South Africa's premier DJ and music producer. Known for selling out major festivals across Africa and Europe with his signature Amapiano fusion sound. Residencies in Johannesburg, Dubai, and Amsterdam.",
  },
  {
    _id: 'celeb-3', name: 'Tolu B', category: 'comedian',
    image: P('1539571696357-5a69c17a67c6'), coverImage: C('1585699324551-f6c309eedeca'),
    verified: true, followers: 950000, nationality: 'Nigerian',
    bio: 'Award-winning Nigerian stand-up comedian and content creator. His relatable humor about everyday African life has earned him a massive fanbase. Best Comedy Act winner at the Nigerian Entertainment Awards 2025.',
  },
  {
    _id: 'celeb-4', name: 'Amara Diallo', category: 'actor',
    image: P('1506794778202-cad84cf45f1d'), coverImage: C('1478760329108-5c3ed9d495a0'),
    verified: true, followers: 2300000, nationality: 'Senegalese',
    bio: 'Senegalese-born international film star. Having appeared in major Hollywood and Nollywood productions, Amara brings world-class talent to every red carpet appearance and live fan experience.',
  },
  {
    _id: 'celeb-5', name: 'Chike Eze', category: 'musician',
    image: P('1500648767791-00dcc994a43e'), coverImage: C('1501386761578-eac5c94b800a'),
    verified: true, followers: 3100000, nationality: 'Nigerian', genre: 'Afrobeats / Soul',
    bio: "Afrobeats sensation taking the world by storm. Chike's smooth vocals and high-energy performances have earned him fans from Lagos to London. His debut album went platinum in 6 countries.",
  },
  {
    _id: 'celeb-6', name: 'DJ Spice', category: 'dj',
    image: P('1542178243-bc20204b769f'), coverImage: C('1429962714451-bb934ecdc4ec'),
    verified: true, followers: 2750000, nationality: 'Kenyan', genre: 'Afrohouse / Global Club',
    bio: "International DJ with residencies in Ibiza, Dubai and Nairobi. DJ Spice's sets blend Afrohouse, Amapiano and global club music into an unforgettable experience. Ranked #8 in DJ Mag's Top 100.",
  },
];

const events = [
  {
    _id: 'event-1', title: 'The Crown Experience', subtitle: 'Live in Lagos', celebrityId: 'celeb-1',
    date: '2026-08-15T20:00:00', doorsOpen: '2026-08-15T18:00:00',
    venue: 'Eko Atlantic Arena', city: 'Lagos', country: 'Nigeria',
    image: E('1540575467063-178a50c2df87'), category: 'musician',
    description: "Zara Musa returns to Lagos for the most anticipated concert of the year. The Crown Experience is a full theatrical production featuring her entire catalog, special guests, and a visual spectacle you won't forget. With a 360-degree stage setup and a $2M LED production, this will redefine what a Nigerian concert can be.",
    isFeatured: true, isOnline: false, status: 'upcoming', ageRestriction: '18+', dresscode: 'Smart Casual',
    tags: ['Afrobeats', 'Lagos', 'Live Concert', 'Premium'],
    ticketTiers: [
      { _id: 'tier-1-1', name: 'General', price: 15000, currency: 'NGN', available: 3200, total: 5000, tier: 'general', perks: ['Standard admission', 'Access to general area'] },
      { _id: 'tier-1-2', name: 'VIP', price: 45000, currency: 'NGN', available: 480, total: 800, tier: 'vip', perks: ['VIP section', 'Complimentary drinks ×2', 'Dedicated VIP entrance', 'VIP lounge'] },
      { _id: 'tier-1-3', name: 'VVIP Table', price: 120000, currency: 'NGN', available: 45, total: 100, tier: 'vvip', perks: ['Private table (4 seats)', 'Bottle service', 'Premium view', 'Backstage tour', 'Exclusive merch pack'] },
      { _id: 'tier-1-4', name: 'Meet & Greet', price: 250000, currency: 'NGN', available: 8, total: 20, tier: 'meetgreet', perks: ['Personal meet with Zara', 'Signed merch bundle', 'Photo session', 'VVIP table included', 'Soundcheck access'] },
    ],
  },
  {
    _id: 'event-2', title: 'Electric Nights Vol. 3', subtitle: 'King Dami × Johannesburg', celebrityId: 'celeb-2',
    date: '2026-09-06T22:00:00', doorsOpen: '2026-09-06T20:00:00',
    venue: 'Time Square Dome', city: 'Johannesburg', country: 'South Africa',
    image: E('1516450360452-9312f5e86fc7'), category: 'dj',
    description: "King Dami's legendary Electric Nights series returns for volume 3. Two floors, 10 hours, the best in Amapiano, Afrohouse and global beats. South Africa's unmissable event of the year.",
    isFeatured: true, isOnline: false, status: 'upcoming', ageRestriction: '21+', dresscode: 'Upscale',
    tags: ['Amapiano', 'House', 'Johannesburg', 'Club Night'],
    ticketTiers: [
      { _id: 'tier-2-1', name: 'Early Bird', price: 350, currency: 'ZAR', available: 200, total: 500, tier: 'general', perks: ['Standard admission', 'Early bird price'] },
      { _id: 'tier-2-2', name: 'General', price: 550, currency: 'ZAR', available: 1800, total: 2000, tier: 'general', perks: ['Standard admission', 'Full night access'] },
      { _id: 'tier-2-3', name: 'VIP Table', price: 3500, currency: 'ZAR', available: 30, total: 60, tier: 'vip', perks: ['Private table (6 seats)', 'Bottle service', 'Dedicated host', 'Best view'] },
    ],
  },
  {
    _id: 'event-3', title: 'Laugh All Night', subtitle: 'Tolu B Comedy Special', celebrityId: 'celeb-3',
    date: '2026-07-25T19:00:00', doorsOpen: '2026-07-25T17:30:00',
    venue: 'Transcorp Hilton', city: 'Abuja', country: 'Nigeria',
    image: E('1585699324551-f6c309eedeca'), category: 'comedian',
    description: "Two hours of non-stop laughter with Nigeria's funniest man. Tolu B's brand-new material promises fresh jokes, celebrity roasts, and surprise guest comedians.",
    isFeatured: false, isOnline: false, status: 'upcoming',
    tags: ['Comedy', 'Stand-up', 'Abuja'],
    ticketTiers: [
      { _id: 'tier-3-1', name: 'Standard', price: 10000, currency: 'NGN', available: 600, total: 800, tier: 'general', perks: ['Standard seating', 'Show admission'] },
      { _id: 'tier-3-2', name: 'Premium', price: 25000, currency: 'NGN', available: 150, total: 200, tier: 'vip', perks: ['Front row seating', 'Pre-show cocktails', 'Photo opportunity'] },
    ],
  },
  {
    _id: 'event-4', title: 'Afrobeats London', subtitle: 'Chike Eze Live at the O2', celebrityId: 'celeb-5',
    date: '2026-10-11T19:30:00', doorsOpen: '2026-10-11T18:00:00',
    venue: 'The O2 Arena', city: 'London', country: 'United Kingdom',
    image: E('1468359601543-843bfaef291a'), category: 'musician',
    description: "Chike Eze makes his UK arena debut at the iconic O2. Joining him will be special guests from across Africa for a once-in-a-lifetime showcase of African music on the world stage.",
    isFeatured: true, isOnline: false, status: 'upcoming', ageRestriction: '16+',
    tags: ['Afrobeats', 'London', 'Arena', 'UK Tour'],
    ticketTiers: [
      { _id: 'tier-4-1', name: 'Floor', price: 75, currency: 'GBP', available: 3000, total: 5000, tier: 'general', perks: ['Floor standing'] },
      { _id: 'tier-4-2', name: 'Seated', price: 65, currency: 'GBP', available: 4200, total: 6000, tier: 'general', perks: ['Reserved seat'] },
      { _id: 'tier-4-3', name: 'VIP Box', price: 280, currency: 'GBP', available: 45, total: 80, tier: 'vip', perks: ['Private box (8 people)', 'Dedicated server', 'Premium bar'] },
      { _id: 'tier-4-4', name: 'Meet & Greet', price: 450, currency: 'GBP', available: 15, total: 30, tier: 'meetgreet', perks: ['Personal meet with Chike', 'Signed vinyl', 'Backstage access', 'Floor ticket'] },
    ],
  },
  {
    _id: 'event-5', title: 'Nairobi Soundwave', subtitle: 'DJ Spice Kenya Homecoming', celebrityId: 'celeb-6',
    date: '2026-08-30T21:00:00', doorsOpen: '2026-08-30T19:00:00',
    venue: 'Uhuru Gardens Grounds', city: 'Nairobi', country: 'Kenya',
    image: E('1470225620780-dba8ba36b745'), category: 'dj',
    description: "DJ Spice returns home to Nairobi for a massive open-air festival. Kenya's biggest outdoor music event featuring world-class production and 8+ hours of music.",
    isFeatured: false, isOnline: false, status: 'upcoming',
    tags: ['Afrohouse', 'Nairobi', 'Festival', 'Outdoor'],
    ticketTiers: [
      { _id: 'tier-5-1', name: 'General', price: 3500, currency: 'KES', available: 5000, total: 8000, tier: 'general', perks: ['Grounds admission', 'All stages'] },
      { _id: 'tier-5-2', name: 'VIP', price: 12000, currency: 'KES', available: 400, total: 600, tier: 'vip', perks: ['VIP zone', 'Exclusive bar', 'VIP entrance'] },
    ],
  },
  {
    _id: 'event-6', title: 'Zara Musa Live in Accra', subtitle: 'African Tour 2026', celebrityId: 'celeb-1',
    date: '2026-08-22T20:00:00', doorsOpen: '2026-08-22T18:30:00',
    venue: 'Accra Sports Stadium', city: 'Accra', country: 'Ghana',
    image: E('1493225457124-a3eb161ffa5f'), category: 'musician',
    description: "Zara Musa brings her African Tour to Accra after selling out Lagos. A bigger, more spectacular show with new production elements.",
    isFeatured: false, isOnline: false, status: 'upcoming',
    tags: ['Afrobeats', 'Accra', 'African Tour'],
    ticketTiers: [
      { _id: 'tier-6-1', name: 'General', price: 200, currency: 'GHS', available: 8000, total: 12000, tier: 'general', perks: ['General admission'] },
      { _id: 'tier-6-2', name: 'VIP', price: 800, currency: 'GHS', available: 500, total: 800, tier: 'vip', perks: ['VIP section', 'Welcome drink', 'VIP entrance'] },
    ],
  },
  {
    _id: 'event-7', title: 'Full Moon Festival', subtitle: 'DJ Spice × Cape Town', celebrityId: 'celeb-6',
    date: '2026-09-20T20:00:00', doorsOpen: '2026-09-20T18:00:00',
    venue: 'Cape Town Stadium', city: 'Cape Town', country: 'South Africa',
    image: E('1429962714451-bb934ecdc4ec'), category: 'dj',
    description: "An unforgettable night under the full moon at Cape Town Stadium. DJ Spice headline set with incredible support acts and world-class production.",
    isFeatured: false, isOnline: false, status: 'sold_out',
    tags: ['Afrohouse', 'Cape Town', 'Stadium'],
    ticketTiers: [
      { _id: 'tier-7-1', name: 'General', price: 450, currency: 'ZAR', available: 0, total: 3000, tier: 'general', perks: ['General admission'] },
      { _id: 'tier-7-2', name: 'VIP', price: 1800, currency: 'ZAR', available: 0, total: 400, tier: 'vip', perks: ['VIP access', 'Bottle service'] },
    ],
  },
  {
    _id: 'event-8', title: 'Lagos Comedy Festival', subtitle: 'Tolu B & Friends', celebrityId: 'celeb-3',
    date: '2026-12-28T18:00:00', doorsOpen: '2026-12-28T16:30:00',
    venue: 'Landmark Events Centre', city: 'Lagos', country: 'Nigeria',
    image: E('1517604931442-7e0c8ed2963c'), category: 'comedian',
    description: "The biggest comedy festival in West Africa. Tolu B headlines alongside 8 top African comedians for a 4-hour comedy marathon with a New Year countdown finale.",
    isFeatured: false, isOnline: false, status: 'upcoming',
    tags: ['Comedy', 'Festival', 'Lagos', 'New Year'],
    ticketTiers: [
      { _id: 'tier-8-1', name: 'Standard', price: 20000, currency: 'NGN', available: 1500, total: 2000, tier: 'general', perks: ['Standard admission', 'Festival wristband'] },
      { _id: 'tier-8-2', name: 'VIP', price: 60000, currency: 'NGN', available: 200, total: 300, tier: 'vip', perks: ['VIP seating', 'Open bar (2hrs)', 'Meet & greet', 'VIP pack'] },
    ],
  },
];

const sponsorshipPackages = [
  {
    _id: 'pkg-title', tier: 'title', name: 'Title Sponsor', tagline: 'Own the event. Your name in lights.',
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
    _id: 'pkg-platinum', tier: 'platinum', name: 'Platinum', tagline: 'Premium visibility across the experience.',
    price: 25000, currency: 'USD', slotsTotal: 4, slotsAvailable: 3, popular: true,
    benefits: [
      'Main-stage branding & screen placement', '10 VIP passes',
      'Branded activation booth (prime location)', 'Logo on event page, tickets & emails',
      'Social media features (3 posts)', 'Inclusion in event press kit',
    ],
  },
  {
    _id: 'pkg-gold', tier: 'gold', name: 'Gold', tagline: 'Strong presence, great value.',
    price: 10000, currency: 'USD', slotsTotal: 8, slotsAvailable: 6,
    benefits: ['Logo on event page & on-site materials', '4 VIP passes', 'Activation booth space', 'One social media mention'],
  },
  {
    _id: 'pkg-silver', tier: 'silver', name: 'Silver', tagline: 'Get your brand in front of the crowd.',
    price: 5000, currency: 'USD', slotsTotal: 15, slotsAvailable: 11,
    benefits: ['Logo on event website', '2 VIP passes', 'Newsletter mention'],
  },
  {
    _id: 'pkg-community', tier: 'community', name: 'Community Partner', tagline: 'Support the movement.',
    price: 1500, currency: 'USD', slotsTotal: 30, slotsAvailable: 22,
    benefits: ['Logo on event website', 'Listed as an official supporter', 'Social media thank-you'],
  },
];

const sponsors = [
  { _id: 'spo-1', name: 'Pulse Telecom', industry: 'Telecommunications', tier: 'title', color: '#A78BFA', eventId: 'event-1' },
  { _id: 'spo-2', name: 'Zenith Capital', industry: 'Banking & Finance', tier: 'platinum', color: '#F59E0B', eventId: 'event-1' },
  { _id: 'spo-3', name: 'Savanna', industry: 'Beverages', tier: 'gold', color: '#34D399', eventId: 'event-2' },
  { _id: 'spo-4', name: 'NovaTel', industry: 'Telecommunications', tier: 'platinum', color: '#60A5FA', eventId: null },
  { _id: 'spo-5', name: 'AeroLux', industry: 'Aviation', tier: 'gold', color: '#22D3EE', eventId: null },
  { _id: 'spo-6', name: 'Vibe', industry: 'Streaming & Media', tier: 'platinum', color: '#FB7185', eventId: null },
  { _id: 'spo-7', name: 'Lumina', industry: 'Technology', tier: 'silver', color: '#FBBF24', eventId: null },
  { _id: 'spo-8', name: 'GoldCrest', industry: 'Luxury Goods', tier: 'community', color: '#F472B6', eventId: null },
];

module.exports = { celebrities, events, sponsorshipPackages, sponsors };
