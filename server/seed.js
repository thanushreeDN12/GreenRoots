import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/users.js';
import Program from './models/programs.js';
import Photo from './models/photo.js';
import Donation from './models/donation.js';
import Testimonial from './models/testimonial.js';
import City from './models/city.js';
import Species from './models/species.js';
import { defaultCities, defaultSpecies } from './utils/autoSeed.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/greenroots";

const indianNames = [
  "Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Ayaan", "Krishna", "Ishaan",
  "Ananya", "Diya", "Aadya", "Pihu", "Prisha", "Avni", "Kavya", "Riya", "Neha", "Priya",
  "Rohan", "Rahul", "Sneha", "Maya", "Sanjay", "Vikram", "Anita", "Suresh", "Ramesh", "Pooja",
  "Amit", "Sunita", "Rajesh", "Meera", "Karan", "Anjali", "Gaurav", "Nisha", "Manoj", "Kiran",
  "Deepak", "Poonam", "Varun", "Swati", "Tarun", "Divya", "Harish", "Aarti", "Nitin", "Geeta",
  "Rakesh", "Preeti", "Alok", "Sonali", "Vishal", "Komal", "Ravi", "Jyoti", "Ajay", "Shikha",
  "Vikas", "Rashmi", "Ashok", "Kavita", "Pramod", "Sarita", "Gopal", "Rekha", "Dinesh", "Suman",
  "Anand", "Seema", "Kamal", "Lata", "Ranjan", "Pushpa", "Satish", "Asha", "Navin", "Usha"
];

const treeSpeciesList = [
  "Neem", "Banyan", "Peepal", "Gulmohar", "Amaltas", "Ashoka", "Mango", "Jamun", "Teak", "Sal"
];

const cities = [
  { name: "Bengaluru", lat: 12.9716, lng: 77.5946 },
  { name: "Mumbai", lat: 19.0760, lng: 72.8777 },
  { name: "Delhi", lat: 28.7041, lng: 77.1025 },
  { name: "Pune", lat: 18.5204, lng: 73.8567 },
  { name: "Chennai", lat: 13.0827, lng: 80.2707 },
  { name: "Hyderabad", lat: 17.3850, lng: 78.4867 },
  { name: "Jaipur", lat: 26.9124, lng: 75.7873 },
  { name: "Kolkata", lat: 22.5726, lng: 88.3639 }
];

const dedications = [
  "In loving memory of my grandfather",
  "For my daughter's 1st birthday",
  "To Mother Earth, for everything she gives",
  "Dedicated to the frontline environmental workers",
  "For our 10th wedding anniversary",
  "In honor of my mother's garden",
  "For a cooler, greener future",
  "To the next generation",
  "For my son's graduation",
  "In memory of a beloved friend"
];

const programsData = [
  { title: "Restore the Western Ghats", description: "Replanting native species in degraded forest patches of the Western Ghats.", targetAmount: 500000, raisedAmount: 320500 },
  { title: "Urban Mangrove Revival", description: "Protecting and expanding mangrove cover along Mumbai's coastline to prevent flooding.", targetAmount: 200000, raisedAmount: 85000 },
  { title: "School Green Corridor Project", description: "Creating micro-forests in 50 public schools across Pune and Bengaluru.", targetAmount: 150000, raisedAmount: 140200 },
  { title: "Delhi Smog-Buster Plantation", description: "Planting fast-growing broad-leaf trees to capture particulate matter in NCR.", targetAmount: 400000, raisedAmount: 210000 },
  { title: "Cauvery Calling Afforestation", description: "Supporting farmers to transition to tree-based agriculture along the Cauvery river.", targetAmount: 1000000, raisedAmount: 650000 },
  { title: "Rajasthan Desert Greening", description: "Halting desertification through drought-resistant shrub and tree planting.", targetAmount: 300000, raisedAmount: 45000 },
  { title: "Chennai Coastal Shelterbelt", description: "Building a natural barrier against cyclones using Casuarina and local coastal species.", targetAmount: 250000, raisedAmount: 180000 }
];

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const seedDatabase = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected. Clearing old seed data...");

    // Clear collections
    await User.deleteMany({ email: { $regex: /@seed\.com$/ } });
    await Program.deleteMany({ title: { $in: programsData.map(p => p.title) } });
    await Photo.deleteMany({ userEmail: { $regex: /@seed\.com$/ } });
    await Donation.deleteMany({});
    await Testimonial.deleteMany({});
    await City.deleteMany({});
    await Species.deleteMany({});

    console.log("Cleared old seed data.");

    // Seed Cities & Species in MongoDB
    await City.insertMany(defaultCities);
    console.log(`Seeded ${defaultCities.length} cities into MongoDB.`);
    await Species.insertMany(defaultSpecies);
    console.log(`Seeded ${defaultSpecies.length} species into MongoDB.`);

    // 1. Seed Users (60 users)
    const usersToCreate = [];
    const passwordHash = await bcrypt.hash('seedpassword123', 10);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    for (let i = 0; i < 60; i++) {
      const name = indianNames[i % indianNames.length];
      usersToCreate.push({
        username: `${name}${randomInt(10, 999)}`,
        email: `${name.toLowerCase()}${randomInt(10, 999)}@seed.com`,
        password: passwordHash,
      });
    }
    const createdUsers = await User.insertMany(usersToCreate);
    console.log(`Created ${createdUsers.length} dummy users.`);

    // 2. Seed Programs
    const createdPrograms = await Program.insertMany(programsData);
    console.log(`Created ${createdPrograms.length} programs.`);

    // 3. Seed Donations
    const donationsToCreate = [];
    for (let i = 0; i < 150; i++) {
      const user = randomElement(createdUsers);
      const program = randomElement(createdPrograms);
      donationsToCreate.push({
        user: user._id,
        program: program._id,
        amount: randomInt(100, 5000),
        date: randomDate(sixMonthsAgo, new Date())
      });
    }
    await Donation.insertMany(donationsToCreate);
    console.log(`Created ${donationsToCreate.length} donations.`);

    // 4. Seed Tree Logs (Photos) - ~500 entries
    const photosToCreate = [];
    const now = new Date();
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(now.getDate() - 14);

    for (let i = 0; i < 500; i++) {
      // Power law-ish distribution: 20% of users do 80% of planting
      const isPowerUser = Math.random() < 0.8; 
      const user = isPowerUser ? createdUsers[i % 12] : randomElement(createdUsers);
      
      const city = randomElement(cities);
      // Add jitter to lat/lng so they don't overlap perfectly
      const lat = city.lat + (Math.random() - 0.5) * 0.1;
      const lng = city.lng + (Math.random() - 0.5) * 0.1;
      
      // More recent dates for recent activity feed
      const date = Math.random() < 0.6 ? randomDate(twoWeeksAgo, now) : randomDate(sixMonthsAgo, twoWeeksAgo);

      // Emotional impact additions
      const hasDedication = Math.random() < 0.25; // 25% of trees have a dedication
      const numCheers = Math.random() < 0.6 ? randomInt(0, 10) : randomInt(15, 80); // some have huge cheers
      
      const program = randomElement(createdPrograms); // weighted assignment could be just random for now or skewed

      photosToCreate.push({
        userEmail: user.email,
        description: `Planted a beautiful ${randomElement(treeSpeciesList)} today!`,
        treeSpecies: randomElement(treeSpeciesList),
        location: {
          type: "Point",
          coordinates: [lng, lat]
        },
        uploadDate: date,
        verified: true,
        dedication: hasDedication ? randomElement(dedications) : "",
        cheers: numCheers,
        programId: program._id,
        photoUrl: `https://picsum.photos/seed/${i}/800/600`, // Placeholder image for impact gallery
        imageId: new mongoose.Types.ObjectId() // Fake ID for dummy data
      });
    }
    const createdPhotos = await Photo.insertMany(photosToCreate);
    console.log(`Created ${createdPhotos.length} tree logs with dedications & cheers.`);

    // 5. Seed Testimonials
    const powerUsers = createdUsers.slice(0, 5); // top few users
    const testimonials = [
      { user: powerUsers[0]._id, name: powerUsers[0].username, text: "I've planted over 20 trees with GreenRoots and finally feel like I'm doing something real about the Bengaluru heat." },
      { user: powerUsers[1]._id, name: powerUsers[1].username, text: "It's amazing to see my little contribution grow. The mapping feature makes it feel so tangible." },
      { user: powerUsers[2]._id, name: powerUsers[2].username, text: "Taking my kids out to plant saplings on weekends has become our favorite family activity. GreenRoots makes it easy." },
      { user: powerUsers[3]._id, name: powerUsers[3].username, text: "The transparency is what sold me. I know exactly where my money goes and which trees I helped fund." },
      { user: powerUsers[4]._id, name: powerUsers[4].username, text: "From a single neem tree to a whole community effort in Pune, the journey has been incredible." }
    ];
    await Testimonial.insertMany(testimonials);
    console.log("Created 5 testimonials.");

    console.log("Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedDatabase();
