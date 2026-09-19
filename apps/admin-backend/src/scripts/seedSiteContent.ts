import 'dotenv/config';
import mongoose from 'mongoose';
import { SiteContent } from '../models/SiteContent';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tours-travels';

// Mirrors apps/happyworld/data/content.ts as of the introduction of the site-content CMS,
// minus each destination's `packages` array (that's placeholder data for lib/packages.ts's
// synthetic package generator, not admin-managed marketing copy — see the plan for why).
const siteContentSeed = {
  brand: {
    name: 'Happy World',
    mark: 'HW',
    location: 'Kathmandu · Nepal',
  },
  nav: [
    { label: 'Home', href: '/' },
    { label: 'Trips ', href: '#way' },
    { label: 'About Us ', href: '/about' },
    { label: 'Contact Us', href: '/contact' },
  ],
  tripsMenu: [
    {
      key: 'nepal-tours',
      label: 'Nepal Tours',
      description: 'Heritage, culture and valley life.',
      href: '/tour-types/nepal-tours',
      image: '/content-images/NepalTour.png',
      destinations: [
        {
          label: 'Kathmandu',
          href: '#way',
          blurb: "The valley's beating heart — UNESCO temple squares, incense-filled lanes and centuries of Newari craft, all within a short walk of each other.",
        },
        {
          label: 'Pokhara',
          href: '#way',
          blurb: 'A lakeside town under the Annapurna range, where the mountains meet still water and the pace finally slows.',
        },
        {
          label: 'Chitwan',
          href: '#way',
          blurb: 'Subtropical lowland forest along the Rapti River, home to rhinos, gharial crocodiles and a different rhythm of travel.',
        },
        {
          label: 'Lumbini',
          href: '#way',
          blurb: 'The birthplace of the Buddha — a quiet monastic zone that draws pilgrims from across Asia.',
        },
        {
          label: 'Janakpur',
          href: '#way',
          blurb: 'A city of painted courtyards and terracotta shrines, spiritual home of the Mithila people.',
        },
        {
          label: 'Ilam',
          href: '#way',
          blurb: "Rolling tea estates and hill villages in Nepal's far east, with Kanchenjunga on a clear horizon.",
        },
      ],
    },
    {
      key: 'trekking',
      label: 'Trekking',
      description: 'Trails through the high quiet.',
      href: '/tour-types/trekking',
      image: 'https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=2200',
      destinations: [
        {
          label: 'Pokhara',
          href: '#way',
          blurb: 'The trailhead for the Annapurna range — base camps, rhododendron forest and some of the most photographed peaks in the Himalaya.',
        },
        {
          label: 'Kathmandu',
          href: '#way',
          blurb: "Gateway to the quieter trails north of the valley, including Langtang's glaciers and yak pastures.",
        },
        {
          label: 'Ilam',
          href: '#way',
          blurb: 'Ridge walks through tea country and pine forest, a gentler alternative to the high Himalaya.',
        },
      ],
    },
    {
      key: 'kailash',
      label: 'Kailash',
      description: 'The pilgrim roads to Mount Kailash.',
      href: '/tour-types/kailash',
      image: '/content-images/Kailash.png',
      destinations: [
        {
          label: 'Kathmandu',
          href: '#way',
          blurb: 'Starting point for the overland yatra to Mount Kailash — permits, acclimatisation and the road to the plateau all begin here.',
        },
      ],
    },
  ],
  heroSlides: [
    {
      eyebrow: 'PILGRIMAGE · Kasilash',
      title: 'A landscape\nwith a pulse.',
      description: 'Follow ancient paths, warm teahouses and the quiet rituals that have held these valleys together for centuries.',
      image: '/content-images/Kailash.png',
      place: '',
    },
    {
      eyebrow: 'TREKKING',
      title: 'Walk slowly.\nSee more.',
      description: 'Journeys with enough space for the mountains to speak — and for you to hear yourself in them.',
      image: 'https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=2200',
      place: 'LARKE PASS · 5,106 M',
    },
    {
      eyebrow: 'HERITAGE · KATHMANDU VALLEY',
      title: 'Come for the\nmountains. Stay for\nthe stories.',
      description: 'A deeper Nepal, shaped by living temples, patient craft and the people who call these places home.',
      image: '/content-images/NepalTour.png',
      place: 'PATAN · 1,400 M',
    },
  ],
  introduction: {
    kicker: 'THE LONG WAY HOME',
    title: 'Nepal is not a checklist.\nIt is a relationship.',
    body: 'We are a small, locally rooted travel company for people who want to meet a place on its own terms. Our guides know which ridge catches the last light, which family makes the best dal bhat, and when the trail asks for quiet.',
  },
  experiences: [
    {
      title: 'The high quiet',
      kind: 'TREKKING',
      detail: 'For the days when the trail is the destination.',
      image: '/content-images/image1.png',
      meta: '04 — 21 DAYS',
      href: '/tour-types/trekking',
    },
    {
      title: 'Pilgrim roads',
      kind: 'PILGRIMAGE',
      detail: 'Ancient paths, sacred pauses, a different pace.',
      image: '/content-images/image2.png',
      meta: '05 — 14 DAYS',
      href: '/tour-types/kailash',
    },
    {
      title: 'Living archives',
      kind: 'HERITAGE',
      detail: 'A close look at the Nepal that keeps creating.',
      image: '/content-images/image3.png',
      meta: '03 — 09 DAYS',
      href: '/tour-types/nepal-tours',
    },
  ],
  services: [
    { number: '01', title: 'Thoughtful itineraries', body: 'No plug-and-play routes. Every day is shaped around your curiosity, comfort and the season.' },
    { number: '02', title: 'Local knowledge', body: 'Our guides are from these valleys. Their relationships turn a visit into a welcome.' },
    { number: '03', title: 'Small footprints', body: 'We travel in small groups, stay in local homes and keep more of your spend close to the trail.' },
    { number: '04', title: 'Quiet confidence', body: 'From airport pickup to the last cup of tea, the details are handled without making a show of it.' },
  ],
  journal: {
    title: 'Notes from the trail',
    body: 'Dispatches for the curious: a little practical, a little poetic, always from the ground.',
    image: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=1600',
    articles: [
      { category: 'FIELD NOTES', title: 'How to be a good guest in the Himalaya', date: '07 MAR 2024' },
      { category: 'A TASTE OF PLACE', title: 'The particular comfort of a mountain kitchen', date: '18 JAN 2024' },
      { category: 'WAYFINDING', title: 'Five trails for finding your own pace', date: '29 OCT 2023' },
    ],
  },
  footer: {
    statement: 'The trail stays with you.',
    email: 'happyworldtt@gmail.com',
    phone: '+977 984-0177646',
    whatsapp: '9779840177646',
  },
  about: {
    hero: {
      title: 'A small team,\na whole country.',
      body: "Happy World Travel Tours is a Kathmandu-based, locally owned company built around one idea: the best trips are shaped by the people who actually live here.",
    },
    story: {
      kicker: 'HOW WE WORK',
      title: "We plan every trip the way we'd plan one for a friend.",
      paragraphs: [
        'We started this company because too many trips to Nepal were being sold from templates — the same routes, the same photo stops, the same rushed pace. We wanted to offer something closer to how we actually travel here ourselves.',
        "Every itinerary we send out is built by someone who has walked the trail, sat in the temple courtyard, or shared tea with the family you'll stay with. Nothing gets recommended that we would not do ourselves.",
      ],
      image: '/content-images/image3.png',
    },
    values: [
      { title: 'Locally rooted', body: 'Nepali-owned and Kathmandu-based, with guides drawn from the regions we travel through.' },
      { title: 'Small by design', body: 'We keep groups small and itineraries flexible, so your trip never feels like a queue.' },
      { title: 'Honest planning', body: 'Clear pricing, realistic pacing, and no route sold to you that we would not take ourselves.' },
      { title: 'There when it counts', body: 'From the first message to the last cup of tea, one team stays with your trip end to end.' },
    ],
    closing: {
      title: "Let's talk about your Nepal.",
      body: 'Tell us what you are after and we will shape a trip around it — no template required.',
    },
  },
};

async function seedSiteContent(): Promise<void> {
  await mongoose.connect(MONGODB_URI);
  const existing = await SiteContent.findOne();
  if (existing) {
    console.log('Site content already exists — skipping seed. Delete the existing document first if you want to reseed.');
    await mongoose.disconnect();
    return;
  }
  await SiteContent.create(siteContentSeed);
  console.log('Seeded site content');
  await mongoose.disconnect();
}

seedSiteContent().catch((err) => {
  console.error(err);
  process.exit(1);
});
