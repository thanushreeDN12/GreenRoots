import bcrypt from 'bcryptjs';
import City from '../models/city.js';
import Species from '../models/species.js';
import Program from '../models/programs.js';
import User from '../models/users.js';
import Photo from '../models/photo.js';
import Donation from '../models/donation.js';
import Testimonial from '../models/testimonial.js';
import Admin from '../models/admin.js';

export const defaultCities = [
  { name: "Bengaluru", state: "Karnataka", lat: 12.9716, lng: 77.5946, description: "Silicon Valley of India with active urban catchment and lake greening initiatives.", targetTrees: 15000 },
  { name: "Mumbai", state: "Maharashtra", lat: 19.0760, lng: 72.8777, description: "Coastal metropolis featuring urban Miyawaki forests and mangrove protection.", targetTrees: 20000 },
  { name: "Delhi", state: "Delhi NCR", lat: 28.7041, lng: 77.1025, description: "Southern Ridge rewilding and air purification smog-buster drives.", targetTrees: 25000 },
  { name: "Pune", state: "Maharashtra", lat: 18.5204, lng: 73.8567, description: "School green corridors and Western Ghats foothill afforestation.", targetTrees: 12000 },
  { name: "Chennai", state: "Tamil Nadu", lat: 13.0827, lng: 80.2707, description: "Coastal shelterbelt and cyclone barrier mangrove restoration.", targetTrees: 14000 },
  { name: "Hyderabad", state: "Telangana", lat: 17.3850, lng: 78.4867, description: "Deccan plateau dryland tree planting and lake bank revegetation.", targetTrees: 10000 },
  { name: "Jaipur", state: "Rajasthan", lat: 26.9124, lng: 75.7873, description: "Aravalli green wall and Thar desert boundary protection.", targetTrees: 8000 },
  { name: "Kolkata", state: "West Bengal", lat: 22.5726, lng: 88.3639, description: "Delta catchment and riverine flora planting.", targetTrees: 11000 },
  { name: "Almora", state: "Uttarakhand", lat: 29.5892, lng: 79.6467, description: "Himalayan Banj Oak and hill spring regeneration.", targetTrees: 9000 },
  { name: "Wayanad", state: "Kerala", lat: 11.6854, lng: 76.1320, description: "Western Ghats tropical rainforest corridor preservation.", targetTrees: 16000 },
  { name: "Sundarbans", state: "West Bengal", lat: 21.9497, lng: 88.9007, description: "Tidal mangrove and Royal Bengal tiger wetland defense.", targetTrees: 30000 }
];

export const defaultSpecies = [
  { commonName: "Neem", scientificName: "Azadirachta indica", carbonRateKgPerYear: 22, nativeRegion: "Pan-India", benefits: ["Natural pesticide", "High particulate matter absorption", "Soil fertility restoration"], description: "Hardy evergreen celebrated for medicinal purity and deep carbon absorption." },
  { commonName: "Banyan", scientificName: "Ficus benghalensis", carbonRateKgPerYear: 35, nativeRegion: "Pan-India", benefits: ["Keystone ecosystem builder", "Extensive aerial root canopy", "Wildlife shelter"], description: "National tree of India capable of providing expansive shading and long-term carbon locking." },
  { commonName: "Peepal", scientificName: "Ficus religiosa", carbonRateKgPerYear: 30, nativeRegion: "Pan-India", benefits: ["Continuous oxygen generation", "Soil erosion control", "Cultural veneration"], description: "Sacred fig renowned for round-the-clock respiration and biodiversity support." },
  { commonName: "Gulmohar", scientificName: "Delonix regia", carbonRateKgPerYear: 18, nativeRegion: "Tropical India", benefits: ["Urban microclimate cooling", "Vibrant summer blooms", "Rapid canopy coverage"], description: "Broad-umbrella flowering tree widely planted in urban centers to reduce heat-island effects." },
  { commonName: "Amaltas", scientificName: "Cassia fistula", carbonRateKgPerYear: 16, nativeRegion: "Deciduous Forests", benefits: ["Golden shower blossoms", "Nitrogen fixing", "Pollinator sanctuary"], description: "Drought-resilient flowering tree supporting native honeybees and butterfly diversity." },
  { commonName: "Ashoka", scientificName: "Saraca asoca", carbonRateKgPerYear: 15, nativeRegion: "Western Ghats", benefits: ["Evergreen foliage", "Medicinal bark", "Riparian bank stabilization"], description: "Indigenous rainforest tree vital to southern and eastern riverbed ecologies." },
  { commonName: "Mango", scientificName: "Mangifera indica", carbonRateKgPerYear: 25, nativeRegion: "Pan-India", benefits: ["Fruit nourishment", "Dense carbon sink", "Farmer livelihood support"], description: "High-biomass native fruit tree popular in rural agroforestry cooperatives." },
  { commonName: "Jamun", scientificName: "Syzygium cumini", carbonRateKgPerYear: 24, nativeRegion: "River Basins & Wetlands", benefits: ["High moisture tolerance", "Edible berries", "Riverbank binding"], description: "Deep-rooting wetland tree supporting aquatic margins and seasonal bird migrations." },
  { commonName: "Teak", scientificName: "Tectona grandis", carbonRateKgPerYear: 28, nativeRegion: "Central & Southern India", benefits: ["High timber density", "Fire-resistant bark", "Durable leaf litter"], description: "Sturdy tropical hardwood that sequesters high amounts of atmospheric carbon over decades." },
  { commonName: "Sal", scientificName: "Shorea robusta", carbonRateKgPerYear: 26, nativeRegion: "Sub-Himalayan & Central Belt", benefits: ["Watershed protection", "Dense forest canopy", "Soil enrichment"], description: "Dominant species in eastern Indian forests supporting Indigenous community forest stewardship." },
  { commonName: "Sundarbans Mangrove", scientificName: "Rhizophora mucronata", carbonRateKgPerYear: 40, nativeRegion: "Coastal Estuaries", benefits: ["Blue carbon sequestration", "Cyclone storm surge buffer", "Fish nursery habitat"], description: "Pioneering stilt-rooted mangrove storing up to 4x more carbon per hectare than terrestrial forests." },
  { commonName: "Banj Oak", scientificName: "Quercus leucotrichophora", carbonRateKgPerYear: 28, nativeRegion: "Himalayas", benefits: ["Mountain spring revival", "Landslide prevention", "Soil humus enrichment"], description: "Crucial Himalayan broadleaf tree safeguarding mountain aquifers and water tables." },
  { commonName: "Khejri", scientificName: "Prosopis cineraria", carbonRateKgPerYear: 20, nativeRegion: "Thar Desert & Aravalli", benefits: ["Arid drought resilience", "Deep taproot", "Nitrogen fixation"], description: "Sacred desert tree that flourishes in extreme heat and enriches desert sandy soils." }
];

import { curated20Programs } from './fastStore.js';

export const defaultPrograms = curated20Programs;

export const defaultTestimonials = [
  { name: "Aarav Sharma", text: "I have planted over 15 native trees with GreenRoots and can track their exact GPS coordinates and growth updates right from my phone." },
  { name: "Priya Patel", text: "The transparent verification with photos and real-time mapping made this my favorite environmental initiative." },
  { name: "Rohit Verma", text: "Sponsoring trees for my parents' anniversary was effortless, and the dedication card feature was deeply touching." },
  { name: "Ananya Iyer", text: "From urban Miyawaki micro-forests to mangrove restoration in the delta, seeing the verified community impact is inspiring." },
  { name: "Vikram Singh", text: "The carbon offset calculator clearly demonstrates the tangible contribution of each native sapling over its lifetime." }
];

export const autoSeedDatabase = async () => {
  try {
    console.log('[AutoSeed] Checking database collections...');

    // 1. Seed Cities in MongoDB if empty
    const cityCount = await City.countDocuments();
    if (cityCount === 0) {
      console.log('[AutoSeed] Seeding default cities into MongoDB...');
      await City.insertMany(defaultCities);
      console.log(`[AutoSeed] Inserted ${defaultCities.length} cities into MongoDB.`);
    }

    // 2. Seed Species in MongoDB if empty
    const speciesCount = await Species.countDocuments();
    if (speciesCount === 0) {
      console.log('[AutoSeed] Seeding default tree species into MongoDB...');
      await Species.insertMany(defaultSpecies);
      console.log(`[AutoSeed] Inserted ${defaultSpecies.length} species into MongoDB.`);
    }

    // 3. Seed Programs in MongoDB if empty
    const programCount = await Program.countDocuments();
    let seededPrograms = [];
    if (programCount === 0) {
      console.log('[AutoSeed] Seeding default programs into MongoDB...');
      seededPrograms = await Program.insertMany(defaultPrograms);
      console.log(`[AutoSeed] Inserted ${defaultPrograms.length} programs into MongoDB.`);
    } else {
      seededPrograms = await Program.find().limit(10);
    }

    // 4. Seed Admin if missing
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const adminPassword = await bcrypt.hash('greenroots9090', 10);
      await Admin.create({
        username: 'admin',
        password: adminPassword,
        createdAt: new Date()
      });
      console.log('[AutoSeed] Default admin created in MongoDB.');
    }

    // 5. Seed Initial Users if empty
    const userCount = await User.countDocuments();
    let seededUsers = [];
    if (userCount === 0) {
      console.log('[AutoSeed] Seeding default users into MongoDB...');
      const userHash = await bcrypt.hash('greenroots123', 10);
      const initialUsers = [
        { username: 'aarav_sharma', email: 'aarav.sharma.green@gmail.com', password: userHash },
        { username: 'priya_patel', email: 'priya.patel.trees@gmail.com', password: userHash },
        { username: 'rohit_verma', email: 'rohit.verma.eco@gmail.com', password: userHash },
        { username: 'ananya_iyer', email: 'ananya.iyer.earth@gmail.com', password: userHash },
        { username: 'vikram_singh', email: 'vikram.singh.roots@gmail.com', password: userHash },
        { username: 'kavita_deshmukh', email: 'kavita.deshmukh.eco@gmail.com', password: userHash }
      ];
      seededUsers = await User.insertMany(initialUsers);
      console.log(`[AutoSeed] Inserted ${seededUsers.length} users into MongoDB.`);
    } else {
      seededUsers = await User.find().limit(10);
    }

    // 6. Seed Testimonials if empty
    const testimonialCount = await Testimonial.countDocuments();
    if (testimonialCount === 0) {
      console.log('[AutoSeed] Seeding default testimonials into MongoDB...');
      await Testimonial.insertMany(defaultTestimonials);
      console.log(`[AutoSeed] Inserted ${defaultTestimonials.length} testimonials into MongoDB.`);
    }

    // 7. Seed Initial Tree Photos (Trees) if empty
    const photoCount = await Photo.countDocuments();
    if (photoCount === 0 && seededPrograms.length > 0) {
      console.log('[AutoSeed] Seeding initial verified trees into MongoDB...');
      const samplePhotos = [
        {
          userEmail: 'aarav.sharma.green@gmail.com',
          treeSpecies: 'Sundarbans Mangrove',
          description: 'Pioneering Rhizophora mangrove sapling planted along the tidal mudflats.',
          location: { type: 'Point', coordinates: [88.9007, 21.9497], locationSource: 'exif' },
          verified: true,
          dedication: 'In honor of coastal community resilience',
          cheers: 24,
          programId: seededPrograms[0]?._id,
          photoUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
          uploadDate: new Date(Date.now() - 3600000 * 2)
        },
        {
          userEmail: 'aarav.sharma.green@gmail.com',
          treeSpecies: 'Peepal',
          description: 'Sacred Ficus religiosa planted along the lake catchment buffer.',
          location: { type: 'Point', coordinates: [77.5946, 12.9716], locationSource: 'geolocation' },
          verified: true,
          dedication: 'For a greener, cooler Garden City Bengaluru!',
          cheers: 42,
          programId: seededPrograms[4]?._id || seededPrograms[0]?._id,
          photoUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80',
          uploadDate: new Date(Date.now() - 3600000 * 8)
        },
        {
          userEmail: 'priya.patel.trees@gmail.com',
          treeSpecies: 'Banj Oak',
          description: 'Native Himalayan oak planted on degraded mountain slopes to safeguard hill aquifers.',
          location: { type: 'Point', coordinates: [79.6467, 29.5892], locationSource: 'manual-pin' },
          verified: true,
          dedication: 'Dedicated to the women tree protectors of the hills',
          cheers: 31,
          programId: seededPrograms[3]?._id || seededPrograms[0]?._id,
          photoUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&auto=format&fit=crop&q=80',
          uploadDate: new Date(Date.now() - 3600000 * 18)
        },
        {
          userEmail: 'rohit.verma.eco@gmail.com',
          treeSpecies: 'Khejri',
          description: 'Indigenous drought-resilient Khejri tree planted to halt desertification.',
          location: { type: 'Point', coordinates: [76.7139, 28.0229], locationSource: 'manual-pin' },
          verified: true,
          dedication: 'Honoring the legendary Bishnoi forest pledge',
          cheers: 19,
          programId: seededPrograms[2]?._id || seededPrograms[0]?._id,
          photoUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop&q=80',
          uploadDate: new Date(Date.now() - 3600000 * 24)
        },
        {
          userEmail: 'ananya.iyer.earth@gmail.com',
          treeSpecies: 'Ashoka',
          description: 'Rainforest evergreen planted in the Western Ghats wildlife sanctuary corridor.',
          location: { type: 'Point', coordinates: [76.1320, 11.6854], locationSource: 'exif' },
          verified: true,
          dedication: 'For our daughter’s birthday and a greener planet',
          cheers: 56,
          programId: seededPrograms[1]?._id || seededPrograms[0]?._id,
          photoUrl: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=800&auto=format&fit=crop&q=80',
          uploadDate: new Date(Date.now() - 3600000 * 48)
        },
        {
          userEmail: 'vikram.singh.roots@gmail.com',
          treeSpecies: 'Neem',
          description: 'Hardy Neem sapling planted in urban Mumbai to purify local air and cool temperatures.',
          location: { type: 'Point', coordinates: [72.8777, 19.0760], locationSource: 'geolocation' },
          verified: true,
          dedication: 'Every tree counts towards cleaner city air',
          cheers: 15,
          programId: seededPrograms[5]?._id || seededPrograms[0]?._id,
          photoUrl: 'https://images.unsplash.com/photo-1511497584788-87676104235f?w=800&auto=format&fit=crop&q=80',
          uploadDate: new Date(Date.now() - 3600000 * 72)
        }
      ];
      await Photo.insertMany(samplePhotos);
      console.log(`[AutoSeed] Inserted ${samplePhotos.length} verified trees into MongoDB.`);
    }

    console.log('[AutoSeed] MongoDB verification & seeding complete.');
  } catch (err) {
    console.error('[AutoSeed] Error during auto-seeding:', err.message);
  }
};
