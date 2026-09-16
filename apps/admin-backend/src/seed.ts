import 'dotenv/config';
import mongoose from 'mongoose';
import { Package } from './models/Package';
import type { PackageInput } from './schemas/package.schema';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tours-travels';

const noMeals = { breakfast: false, lunch: false, dinner: false };
const allMeals = { breakfast: true, lunch: true, dinner: true };

const pokharaPackage: PackageInput = {
  category: 'nepal-tours',
  title: 'Pokhara Lakeside & Sarangkot Sunrise',
  coverImage: 'https://images.pexels.com/photos/2325446/pexels-photo-2325446.jpeg?auto=compress&cs=tinysrgb&w=1200',
  destinations: ['Pokhara'],
  duration: '5-7',
  bestTimeToVisit: [
    { month: 'October', rating: 'best' },
    { month: 'November', rating: 'best' },
    { month: 'March', rating: 'normal' },
    { month: 'April', rating: 'normal' },
    { month: 'July', rating: 'average' },
  ],
  description:
    'A relaxed six-day escape to Pokhara combining lakeside leisure, a sunrise hike over the Annapurna range, and cultural stops around the valley. Ideal for travellers who want mountain views without a multi-day trek.',
  itinerary: [
    {
      day: 1,
      title: 'Arrival in Pokhara',
      description: 'Arrive in Pokhara, transfer to hotel, and enjoy a relaxed evening walk along Phewa Lake.',
      images: [],
      keyActivities: ['Airport pickup', 'Lakeside stroll', 'Welcome dinner'],
      accommodation: 'Lakeside boutique hotel',
      transportation: 'Private car from Pokhara airport',
      meals: { ...noMeals, dinner: true },
    },
    {
      day: 2,
      title: 'Sarangkot Sunrise Hike',
      description: 'Early morning drive to Sarangkot to watch sunrise over the Annapurna and Machhapuchhre ranges, followed by a gentle downhill hike back to the lake.',
      images: [],
      keyActivities: ['Sunrise viewpoint', 'Downhill hike', 'Photography'],
      accommodation: 'Lakeside boutique hotel',
      transportation: 'Private jeep to Sarangkot',
      meals: allMeals,
    },
    {
      day: 3,
      title: 'Caves and Viewpoints',
      description: 'Visit Davis Falls, Gupteshwor Cave, and the World Peace Pagoda across the lake, with a boat ride included.',
      images: [],
      keyActivities: ['Davis Falls', 'Gupteshwor Cave', 'World Peace Pagoda', 'Boating'],
      accommodation: 'Lakeside boutique hotel',
      transportation: 'Private car and rowboat',
      meals: { ...noMeals, breakfast: true },
    },
    {
      day: 4,
      title: 'Begnas Lake Day Trip',
      description: 'A quieter alternative to Phewa Lake — cycle or drive out to Begnas Lake for a peaceful countryside afternoon.',
      images: [],
      keyActivities: ['Cycling', 'Begnas Lake', 'Local village walk'],
      accommodation: 'Lakeside boutique hotel',
      transportation: 'Mountain bike rental',
      meals: { ...noMeals, breakfast: true },
    },
    {
      day: 5,
      title: 'International Mountain Museum',
      description: 'Explore the International Mountain Museum and Old Pokhara Bazaar before a free afternoon for shopping and cafes.',
      images: [],
      keyActivities: ['Mountain Museum', 'Old Bazaar', 'Free time'],
      accommodation: 'Lakeside boutique hotel',
      transportation: 'On foot / private car',
      meals: { ...noMeals, breakfast: true },
    },
    {
      day: 6,
      title: 'Departure',
      description: 'Final breakfast by the lake before transfer to the airport for departure.',
      images: [],
      keyActivities: ['Farewell breakfast', 'Airport transfer'],
      accommodation: 'N/A',
      transportation: 'Private car to airport',
      meals: { ...noMeals, breakfast: true },
    },
  ],
  cost: { from: 25000, to: 40000, currency: 'NPR', unit: 'per_person' },
  status: 'published',
  highlights: [
    'Sunrise over the Annapurna range from Sarangkot',
    'Boat ride on Phewa Lake to the World Peace Pagoda',
    'Explore Davis Falls and Gupteshwor Cave',
  ],
  difficulty: 'Easy',
  groupSize: '2–12 travellers',
  maxAltitude: '1,600 m (Sarangkot)',
  costIncludes: [
    'Hotel accommodation (5 nights, lakeside)',
    'Daily breakfast',
    'Private transfers and sightseeing by car/jeep',
    'English-speaking guide',
  ],
  costExcludes: ['International/domestic airfare', 'Nepal visa fees', 'Lunches and dinners not listed', 'Personal expenses and tips'],
  guide: {
    name: 'Bikash Gurung',
    photo: 'https://res.cloudinary.com/productionappfreelance/image/upload/tours-travels/guides/bikash-gurung.jpg',
    bio: 'Pokhara-based trekking guide with 12 years of experience leading Annapurna region tours.',
  },
  testimonials: [
    {
      name: 'Emma Clarke',
      rating: 5,
      quote: 'The Sarangkot sunrise alone was worth the trip. Bikash was knowledgeable and easygoing.',
      photo: '',
    },
  ],
  faqs: [
    {
      question: 'Is this trip suitable for travellers with limited fitness?',
      answer: 'Yes, the Sarangkot hike is a gentle downhill walk and the rest of the itinerary is leisure-paced.',
    },
    {
      question: 'What is the best time of year for clear mountain views?',
      answer: 'October and November offer the clearest skies; March and April are good alternatives.',
    },
  ],
  heroVideo: '',
};

const chitwanPackage: PackageInput = {
  category: 'nepal-tours',
  title: 'Chitwan Jungle Safari Escape',
  coverImage: 'https://images.pexels.com/photos/247376/pexels-photo-247376.jpeg?auto=compress&cs=tinysrgb&w=1200',
  destinations: ['Chitwan'],
  duration: '3-4',
  bestTimeToVisit: [
    { month: 'October', rating: 'best' },
    { month: 'January', rating: 'normal' },
    { month: 'February', rating: 'normal' },
  ],
  description:
    'A compact three-day jungle safari in Chitwan National Park featuring canoe rides, wildlife tracking, and an evening Tharu cultural show.',
  itinerary: [
    {
      day: 1,
      title: 'Arrival and Village Walk',
      description: 'Arrive at Sauraha, check in to a jungle resort, and take a guided walk through a Tharu village.',
      images: [],
      keyActivities: ['Tharu village walk', 'Resort check-in', 'Cultural show'],
      accommodation: 'Jungle resort, Sauraha',
      transportation: 'Private car from Bharatpur airport',
      meals: { ...noMeals, dinner: true },
    },
    {
      day: 2,
      title: 'Canoe Ride and Jungle Safari',
      description: 'Morning canoe ride along the Rapti River followed by a full jeep safari inside Chitwan National Park to spot rhinos and birdlife.',
      images: [],
      keyActivities: ['Canoe ride', 'Jeep safari', 'Bird watching'],
      accommodation: 'Jungle resort, Sauraha',
      transportation: 'Canoe and safari jeep',
      meals: allMeals,
    },
    {
      day: 3,
      title: 'Elephant Breeding Center and Departure',
      description: 'Visit the Elephant Breeding Center in the morning, then transfer back with a stop at a riverside viewpoint before departure.',
      images: [],
      keyActivities: ['Elephant Breeding Center', 'Riverside viewpoint'],
      accommodation: 'N/A',
      transportation: 'Private car to Bharatpur airport',
      meals: { ...noMeals, breakfast: true },
    },
  ],
  cost: { from: 12000, to: 18000, currency: 'NPR', unit: 'per_person' },
  status: 'published',
  highlights: [
    'Jeep safari inside Chitwan National Park',
    'Canoe ride along the Rapti River',
    'Evening Tharu cultural stick dance show',
  ],
  difficulty: 'Easy',
  groupSize: '2–14 travellers',
  maxAltitude: '150 m (Chitwan lowlands)',
  costIncludes: [
    'Jungle resort accommodation (2 nights)',
    'All meals during the safari',
    'Canoe ride and jeep safari fees',
    'Tharu village walk and cultural show',
  ],
  costExcludes: ['International/domestic airfare', 'Nepal visa fees', 'Alcoholic beverages', 'Personal expenses and tips'],
  guide: {
    name: 'Rajan Chaudhary',
    photo: 'https://res.cloudinary.com/productionappfreelance/image/upload/tours-travels/guides/rajan-chaudhary.jpg',
    bio: 'Local Tharu naturalist guide from Sauraha with a decade of wildlife-tracking experience in Chitwan National Park.',
  },
  testimonials: [
    {
      name: 'Daniel Fischer',
      rating: 5,
      quote: 'We spotted a one-horned rhino on the very first safari. Rajan knew exactly where to look.',
      photo: '',
    },
  ],
  faqs: [
    {
      question: 'What wildlife can we realistically expect to see?',
      answer: 'One-horned rhinos are commonly sighted; Bengal tigers and gharial crocodiles are possible but not guaranteed.',
    },
    {
      question: 'Is the jungle safari safe for children?',
      answer: 'Yes, jeep safaris are family-friendly; canoe rides are recommended for children over 6.',
    },
  ],
  heroVideo: '',
};

const kathmanduLumbiniPackage: PackageInput = {
  category: 'nepal-tours',
  title: 'Kathmandu Heritage & Lumbini Pilgrimage',
  coverImage: 'https://images.pexels.com/photos/1141853/pexels-photo-1141853.jpeg?auto=compress&cs=tinysrgb&w=1200',
  destinations: ['Kathmandu', 'Lumbini'],
  duration: '8-10',
  bestTimeToVisit: [
    { month: 'September', rating: 'best' },
    { month: 'October', rating: 'best' },
    { month: 'November', rating: 'normal' },
    { month: 'March', rating: 'normal' },
  ],
  description:
    'An eight-day journey through Kathmandu Valley\'s UNESCO heritage sites followed by a peaceful pilgrimage to Lumbini, the birthplace of Lord Buddha, with monasteries and gardens along the way.',
  itinerary: [
    {
      day: 1,
      title: 'Arrival in Kathmandu',
      description: 'Arrive in Kathmandu, transfer to hotel, and relax with an orientation walk around Thamel in the evening.',
      images: [],
      keyActivities: ['Airport pickup', 'Thamel walk'],
      accommodation: 'Heritage hotel, Kathmandu',
      transportation: 'Private car from Tribhuvan International Airport',
      meals: { ...noMeals, dinner: true },
    },
    {
      day: 2,
      title: 'Kathmandu Durbar Square and Swayambhunath',
      description: 'Guided tour of Kathmandu Durbar Square followed by a visit to the Swayambhunath (Monkey Temple) stupa complex.',
      images: [],
      keyActivities: ['Durbar Square', 'Swayambhunath Stupa'],
      accommodation: 'Heritage hotel, Kathmandu',
      transportation: 'Private car with guide',
      meals: { ...noMeals, breakfast: true },
    },
    {
      day: 3,
      title: 'Bhaktapur and Patan',
      description: 'Full-day exploration of the medieval squares of Bhaktapur and Patan, including pottery square and traditional Newari architecture.',
      images: [],
      keyActivities: ['Bhaktapur Durbar Square', 'Patan Durbar Square', 'Pottery Square'],
      accommodation: 'Heritage hotel, Kathmandu',
      transportation: 'Private car with guide',
      meals: { ...noMeals, breakfast: true },
    },
    {
      day: 4,
      title: 'Pashupatinath and Boudhanath',
      description: 'Visit the sacred Pashupatinath Temple on the Bagmati River, then the vast Boudhanath Stupa, one of the largest in the world.',
      images: [],
      keyActivities: ['Pashupatinath Temple', 'Boudhanath Stupa'],
      accommodation: 'Heritage hotel, Kathmandu',
      transportation: 'Private car with guide',
      meals: { ...noMeals, breakfast: true },
    },
    {
      day: 5,
      title: 'Fly to Bhairahawa, Transfer to Lumbini',
      description: 'Morning flight to Bhairahawa followed by a short drive to Lumbini, with an evening visit to the Maya Devi Temple complex.',
      images: [],
      keyActivities: ['Domestic flight', 'Maya Devi Temple'],
      accommodation: 'Pilgrim lodge, Lumbini',
      transportation: 'Domestic flight and private car',
      meals: { ...noMeals, breakfast: true, dinner: true },
    },
    {
      day: 6,
      title: 'Lumbini Monastic Zone',
      description: 'Full day cycling or walking through the Lumbini Monastic Zone, visiting monasteries built by different Buddhist nations.',
      images: [],
      keyActivities: ['Monastic Zone', 'World Peace Pagoda, Lumbini', 'Cycling'],
      accommodation: 'Pilgrim lodge, Lumbini',
      transportation: 'Bicycle rental / walking',
      meals: allMeals,
    },
    {
      day: 7,
      title: 'Return to Kathmandu',
      description: 'Morning flight back to Kathmandu with a free afternoon for last-minute shopping in Thamel and Asan Bazaar.',
      images: [],
      keyActivities: ['Domestic flight', 'Thamel shopping', 'Asan Bazaar'],
      accommodation: 'Heritage hotel, Kathmandu',
      transportation: 'Domestic flight and private car',
      meals: { ...noMeals, breakfast: true },
    },
    {
      day: 8,
      title: 'Departure',
      description: 'Final breakfast at the hotel before transfer to the airport for international departure.',
      images: [],
      keyActivities: ['Farewell breakfast', 'Airport transfer'],
      accommodation: 'N/A',
      transportation: 'Private car to airport',
      meals: { ...noMeals, breakfast: true },
    },
  ],
  cost: { from: 550, to: 800, currency: 'USD', unit: 'per_person' },
  status: 'published',
  highlights: [
    'Guided tours of Kathmandu\'s four UNESCO Durbar Squares',
    'Sunset visit to Boudhanath Stupa',
    'Pilgrimage to the Maya Devi Temple in Lumbini, birthplace of Buddha',
  ],
  difficulty: 'Easy',
  groupSize: '2–16 travellers',
  maxAltitude: '1,400 m (Kathmandu Valley)',
  costIncludes: [
    'Hotel and pilgrim lodge accommodation (7 nights)',
    'Daily breakfast',
    'Domestic flights (Kathmandu–Bhairahawa–Kathmandu)',
    'Private car with guide for all sightseeing',
  ],
  costExcludes: ['International airfare', 'Nepal visa fees', 'Lunches and dinners not listed', 'Monastery donations and personal expenses'],
  guide: {
    name: 'Sunita Shrestha',
    photo: 'https://res.cloudinary.com/productionappfreelance/image/upload/tours-travels/guides/sunita-shrestha.jpg',
    bio: 'Kathmandu-based heritage and pilgrimage guide specializing in Newari architecture and Buddhist history.',
  },
  testimonials: [
    {
      name: 'Marco Rossi',
      rating: 5,
      quote: 'Sunita brought the Durbar Squares to life with stories you would never find in a guidebook. Lumbini was deeply moving.',
      photo: '',
    },
  ],
  faqs: [
    {
      question: 'How much walking is involved in the heritage sites?',
      answer: 'Expect 2–4 hours of walking on uneven cobblestone squares each day; comfortable walking shoes are recommended.',
    },
    {
      question: 'Is the domestic flight to Lumbini reliable?',
      answer: 'Flights to Bhairahawa run daily and are generally reliable, though morning fog can occasionally cause delays in winter.',
    },
  ],
  heroVideo: '',
};

const samplePackages = [pokharaPackage, chitwanPackage, kathmanduLumbiniPackage];

async function seed(): Promise<void> {
  await mongoose.connect(MONGODB_URI);
  await Package.deleteMany({});
  await Package.insertMany(samplePackages);
  console.log(`Seeded ${samplePackages.length} packages`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
