import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/greenroots';

async function seed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI);
  const db = mongoose.connection.db;

  console.log('1. Clearing existing users, donations, programs, photos, and admins...');
  await db.collection('users').deleteMany({});
  await db.collection('donations').deleteMany({});
  await db.collection('programs').deleteMany({});
  await db.collection('photos').deleteMany({});
  await db.collection('admins').deleteMany({});

  console.log('2. Inserting new admin (username: admin, pw: greenroots9090)...');
  const adminPasswordHash = await bcrypt.hash('greenroots9090', 10);
  const adminDoc = {
    username: 'admin',
    password: adminPasswordHash,
    createdAt: new Date()
  };
  await db.collection('admins').insertOne(adminDoc);
  console.log('✅ Admin created successfully.');

  console.log('3. Inserting 10 new users with @gmail.com emails, usernames, and passwords...');
  const userPasswordHash = await bcrypt.hash('greenroots123', 12);
  const usersData = [
    { username: 'manish_kumar', email: 'manish.kumar.trees@gmail.com' },
    { username: 'aarav_sharma', email: 'aarav.sharma.green@gmail.com' },
    { username: 'priya_patel', email: 'priya.patel.trees@gmail.com' },
    { username: 'rohit_verma', email: 'rohit.verma.eco@gmail.com' },
    { username: 'ananya_iyer', email: 'ananya.iyer.earth@gmail.com' },
    { username: 'vikram_singh', email: 'vikram.singh.roots@gmail.com' },
    { username: 'sneha_reddy', email: 'sneha.reddy.nature@gmail.com' },
    { username: 'arjun_nair', email: 'arjun.nair.green@gmail.com' },
    { username: 'kavita_deshmukh', email: 'kavita.deshmukh.eco@gmail.com' },
    { username: 'rahul_mehta', email: 'rahul.mehta.roots@gmail.com' },
  ];

  const userDocs = usersData.map(u => ({
    _id: new mongoose.Types.ObjectId(),
    username: u.username,
    email: u.email,
    password: userPasswordHash,
    donatedPrograms: [],
    createdAt: new Date(),
    __v: 0
  }));

  await db.collection('users').insertMany(userDocs);
  console.log(`✅ ${userDocs.length} users inserted successfully.`);

  console.log('4. Inserting 20 diverse programs all over India with varying donation costs...');
  const programsData = [
    {
      title: 'Sundarbans Mangrove Protection',
      description: 'Planting resilient coastal mangrove species in the delta to defend coastal villages against cyclones and restore Royal Bengal tiger wetlands.',
      location: 'Sundarbans, West Bengal',
      state: 'West Bengal',
      donationCost: 350,
      targetAmount: 350000,
      lat: 21.9497,
      lng: 88.9007
    },
    {
      title: 'Western Ghats Biodiversity Corridor',
      description: 'Reforesting endemic rainforest species like Malabar Ironwood to reconnect fragmented elephant and leopard habitats in the UNESCO heritage corridor.',
      location: 'Wayanad & Coorg, Western Ghats',
      state: 'Kerala & Karnataka',
      donationCost: 600,
      targetAmount: 600000,
      lat: 11.6854,
      lng: 76.1320
    },
    {
      title: 'Aravalli Green Wall Project',
      description: 'Planting indigenous desert-hardy Khejri and Rohida trees along the rocky Aravalli range to halt Thar desertification and recharge NCR groundwater.',
      location: 'Alwar & Gurugram, Aravalli Hills',
      state: 'Rajasthan & Haryana',
      donationCost: 450,
      targetAmount: 450000,
      lat: 28.0229,
      lng: 76.7139
    },
    {
      title: 'Himalayan Oak & Rhododendron Drive',
      description: 'Revitalizing mountain catchment forests with native Banj Oak to prevent monsoonal landslides and protect perennial Himalayan hill springs.',
      location: 'Almora & Nainital, Kumaon',
      state: 'Uttarakhand',
      donationCost: 750,
      targetAmount: 750000,
      lat: 29.5892,
      lng: 79.6467
    },
    {
      title: 'Cauvery River Basin Afforestation',
      description: 'Planting agroforestry timber, Jamun, and fruit trees along riverbanks to revive perennial flow in Cauvery and secure sustainable farm yields.',
      location: 'Thanjavur & Mandya, Cauvery Basin',
      state: 'Tamil Nadu & Karnataka',
      donationCost: 500,
      targetAmount: 500000,
      lat: 10.7870,
      lng: 79.1378
    },
    {
      title: 'Mumbai Urban Miyawaki Forest',
      description: 'Creating hyper-dense native micro-forests in empty urban spaces across Mumbai to scrub particulate pollutants and reduce extreme heat island effects.',
      location: 'Bandra & Chembur, Mumbai',
      state: 'Maharashtra',
      donationCost: 1200,
      targetAmount: 1200000,
      lat: 19.0760,
      lng: 72.8777
    },
    {
      title: 'Kaziranga Buffer Zone Wildlife Corridor',
      description: 'Planting high-canopy flood refuge trees and wetland flora around Kaziranga to shelter one-horned rhinos during Brahmaputra monsoon floods.',
      location: 'Golaghat & Bokakhat, Kaziranga',
      state: 'Assam',
      donationCost: 550,
      targetAmount: 550000,
      lat: 26.5775,
      lng: 93.1711
    },
    {
      title: 'Chambal Badlands Soil Reclamation',
      description: 'Planting deep-rooting Acacia, Neem, and Shisham along the steep Chambal ravines to stop severe gully erosion and turn badlands green.',
      location: 'Morena & Bhind, Chambal',
      state: 'Madhya Pradesh',
      donationCost: 400,
      targetAmount: 400000,
      lat: 26.4947,
      lng: 77.9940
    },
    {
      title: 'Bengaluru Urban Lake Catchment Re-Greening',
      description: 'Restoring native wetland trees, bamboo thickets, and bio-swales around Bengaluru water bodies to purify runoff and prevent urban flooding.',
      location: 'Varthur & Bellandur, Bengaluru',
      state: 'Karnataka',
      donationCost: 800,
      targetAmount: 800000,
      lat: 12.9716,
      lng: 77.5946
    },
    {
      title: 'Thar Desert Bishnoi Sacred Groves',
      description: 'Empowering community-managed Oran groves with Kankera, Ber, and Ghaf trees, carrying forward the Bishnoi communitys legendary tree protection pledge.',
      location: 'Jodhpur & Barmer, Thar Desert',
      state: 'Rajasthan',
      donationCost: 650,
      targetAmount: 650000,
      lat: 26.2389,
      lng: 73.0243
    },
    {
      title: 'Nilgiri Biosphere Shola Restoration',
      description: 'Replacing invasive eucalyptus plantations with ancient high-altitude Shola forest saplings and native montane grasslands in the Nilgiris.',
      location: 'Kotagiri & Ooty, Nilgiris',
      state: 'Tamil Nadu',
      donationCost: 900,
      targetAmount: 900000,
      lat: 11.4102,
      lng: 76.6950
    },
    {
      title: 'Pichavaram Coastal Wetland Preservation',
      description: 'Protecting and expanding the world’s second-largest mangrove ecosystem with Rhizophora propagules to nurture marine life and support fisherfolk.',
      location: 'Chidambaram, Cuddalore',
      state: 'Tamil Nadu',
      donationCost: 420,
      targetAmount: 420000,
      lat: 11.4286,
      lng: 79.7820
    },
    {
      title: 'Delhi-NCR Southern Ridge Regeneration',
      description: 'Reclaiming degraded Delhi ridge woodlands by replacing invasive Vilayati Kikar with indigenous Dhau, Peepal, and Amaltas trees to clean NCR air.',
      location: 'Southern Ridge, New Delhi',
      state: 'Delhi NCR',
      donationCost: 1000,
      targetAmount: 1000000,
      lat: 28.5355,
      lng: 77.1855
    },
    {
      title: 'Gir Asiatic Lion Buffer Habitat',
      description: 'Creating drought-resilient forest buffer zones of Ber and Timru around Sasan Gir to expand safe roaming territories for Asiatic lion prides.',
      location: 'Junagadh & Sasan Gir',
      state: 'Gujarat',
      donationCost: 700,
      targetAmount: 700000,
      lat: 21.1245,
      lng: 70.7946
    },
    {
      title: 'Chota Nagpur Tribal Community Orchards',
      description: 'Partnering with tribal farming families to plant fruit-bearing Mahua, Sal, and Karanj trees for soil enrichment and sustainable forest livelihood.',
      location: 'Ranchi & Khunti, Chota Nagpur',
      state: 'Jharkhand',
      donationCost: 380,
      targetAmount: 380000,
      lat: 23.3441,
      lng: 85.3096
    },
    {
      title: 'Kashmir Valley Royal Chinar & Walnut Revival',
      description: 'Protecting historic heritage Chinar trees and planting walnut and deodar cedar groves on terraced Himalayan mountain slopes.',
      location: 'Srinagar & Anantnag, Kashmir',
      state: 'Jammu & Kashmir',
      donationCost: 1500,
      targetAmount: 1500000,
      lat: 34.0837,
      lng: 74.7973
    },
    {
      title: 'Telangana Semi-Arid Agroforestry',
      description: 'Planting drought-hardy Red Sandalwood, Neem, and Tamarind to restore soil moisture and enhance agricultural sustainability in rainfed drylands.',
      location: 'Mahbubnagar & Warangal',
      state: 'Telangana',
      donationCost: 480,
      targetAmount: 480000,
      lat: 16.7488,
      lng: 78.0035
    },
    {
      title: 'Goa Coastal Dune & Casuarina Shield',
      description: 'Stabilizing sensitive turtle-nesting shores and beach sand dunes with salt-tolerant Casuarina, Pongamia, and coastal ground creepers.',
      location: 'Morjim & Agonda, Coastal Goa',
      state: 'Goa',
      donationCost: 520,
      targetAmount: 520000,
      lat: 15.2993,
      lng: 74.1240
    },
    {
      title: 'Mahanadi Delta Community Green Wall',
      description: 'Shielding vulnerable coastal agrarian villages against frequent Bay of Bengal super-cyclones through deep-rooting mangrove and Casuarina belts.',
      location: 'Kendrapara & Jagatsinghpur',
      state: 'Odisha',
      donationCost: 390,
      targetAmount: 390000,
      lat: 20.5000,
      lng: 86.4200
    },
    {
      title: 'Silent Valley Cloud Forest Canopy Protection',
      description: 'Fostering buffer zone canopy layers for one of the last pristine tropical evergreen rainforest tracts in the southern Western Ghats.',
      location: 'Palakkad & Mannarkkad, Silent Valley',
      state: 'Kerala',
      donationCost: 850,
      targetAmount: 850000,
      lat: 11.0827,
      lng: 76.4520
    }
  ];

  const programDocs = programsData.map(p => ({
    _id: new mongoose.Types.ObjectId(),
    title: p.title,
    description: p.description,
    location: p.location,
    state: p.state,
    donationCost: p.donationCost,
    targetAmount: p.targetAmount,
    raisedAmount: 0,
    donatedUsers: [],
    __v: 0
  }));

  await db.collection('programs').insertMany(programDocs);
  console.log(`✅ ${programDocs.length} programs across India inserted.`);

  console.log('5. Simulating donations from all 10 users across various programs...');
  const donations = [];

  // Define donation pairings for all 10 users
  // User 0 (manish_kumar) donates to programs: Sundarbans (350), Western Ghats (600), Bengaluru (800), Mumbai (1200)
  const donationPlan = [
    { userIdx: 0, progIndices: [0, 1, 5, 8], trees: [3, 2, 2, 1] },
    { userIdx: 1, progIndices: [2, 3, 12], trees: [2, 3, 1] },
    { userIdx: 2, progIndices: [0, 4, 10], trees: [5, 2, 1] },
    { userIdx: 3, progIndices: [6, 7], trees: [4, 2] },
    { userIdx: 4, progIndices: [1, 8, 14], trees: [2, 2, 4] },
    { userIdx: 5, progIndices: [9, 13], trees: [3, 2] },
    { userIdx: 6, progIndices: [4, 11, 16], trees: [3, 2, 2] },
    { userIdx: 7, progIndices: [15, 17], trees: [1, 3] },
    { userIdx: 8, progIndices: [5, 18, 19], trees: [1, 4, 2] },
    { userIdx: 9, progIndices: [3, 9], trees: [2, 3] },
  ];

  for (const plan of donationPlan) {
    const user = userDocs[plan.userIdx];
    const userDonatedProgramIds = [];

    for (let i = 0; i < plan.progIndices.length; i++) {
      const progIdx = plan.progIndices[i];
      const program = programDocs[progIdx];
      const treeCount = plan.trees[i];
      const amount = program.donationCost * treeCount;

      const donationDoc = {
        _id: new mongoose.Types.ObjectId(),
        user: user._id,
        program: program._id,
        amount: amount,
        treeCount: treeCount,
        date: new Date(Date.now() - (Math.floor(Math.random() * 20) + 1) * 86400000)
      };

      donations.push(donationDoc);
      userDonatedProgramIds.push(program._id);

      // Update program raised amount and donated users in memory
      program.raisedAmount += amount;
      if (!program.donatedUsers.some(id => id.equals(user._id))) {
        program.donatedUsers.push(user._id);
      }
    }

    // Update user donatedPrograms in DB
    await db.collection('users').updateOne(
      { _id: user._id },
      { $set: { donatedPrograms: userDonatedProgramIds } }
    );
  }

  await db.collection('donations').insertMany(donations);
  console.log(`✅ ${donations.length} donations recorded in database.`);

  // Update all programs in DB with updated raisedAmount and donatedUsers
  for (const program of programDocs) {
    await db.collection('programs').updateOne(
      { _id: program._id },
      {
        $set: {
          raisedAmount: program.raisedAmount,
          donatedUsers: program.donatedUsers
        }
      }
    );
  }
  console.log('✅ Programs updated with donation amounts and donor links.');

  console.log('6. Adding verified tree photos for user donations with rich details and public front page support...');
  
  // Real curated high-res nature / sapling / tree photo URLs (Unsplash CDN direct image URLs)
  const curatedTreePhotos = [
    {
      species: 'Mangrove Sapling (Rhizophora mucronata)',
      url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
      description: 'Lush mangrove sapling planted along the saline tidal mudflats in the Sundarbans delta.',
      checkInUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80',
      checkInNote: 'Propagule rooted firmly; 4 new leaves sprouted after high tide cycles.'
    },
    {
      species: 'Malabar Rosewood (Dalbergia latifolia)',
      url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
      description: 'Hardwood sapling established in the rainforest canopy buffer zone in Wayanad, Western Ghats.',
      checkInUrl: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80',
      checkInNote: 'Height reached 45cm with deep taproot anchoring into fertile forest loam.'
    },
    {
      species: 'Sacred Peepal (Ficus religiosa)',
      url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1200&q=80',
      description: 'Broad-canopy Peepal planted along the Bengaluru lake catchment to shelter native sunbirds and bees.',
      checkInUrl: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=800&q=80',
      checkInNote: 'Heart-shaped foliage expanding vigorously; natural drip irrigation established.'
    },
    {
      species: 'Miyawaki Native Canopy Mix (Jamun & Neem)',
      url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
      description: 'Dense native saplings planted using the high-density Miyawaki technique in suburban Mumbai.',
      checkInUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
      checkInNote: 'Microbial compost working wonders; 30cm vertical growth recorded in month two.'
    },
    {
      species: 'Himalayan Banj Oak (Quercus leucotrichophora)',
      url: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=1200&q=80',
      description: 'Broadleaf oak sapling planted on terraced Himalayan slopes in Almora to recharge fresh mountain springs.',
      checkInUrl: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=800&q=80',
      checkInNote: 'Surviving frosty morning dews effortlessly; healthy deep-green leaf buds.'
    },
    {
      species: 'Desert Khejri (Prosopis cineraria)',
      url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
      description: 'Indigenous drought-resilient Khejri tree planted in the Aravalli foothills to bind loose desert sand.',
      checkInUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80',
      checkInNote: 'Thorns developed naturally; taproot accessing deep sub-surface moisture.'
    },
    {
      species: 'Indian Teak (Tectona grandis)',
      url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
      description: 'Sturdy Teak sapling planted in Cauvery river basin agroforestry parcel in Thanjavur.',
      checkInUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
      checkInNote: 'Large velvety leaves capturing maximum sunlight; zero pest damage.'
    },
    {
      species: 'Red Sandalwood (Pterocarpus santalinus)',
      url: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1200&q=80',
      description: 'High-value conservation sapling planted in the semi-arid Deccan plateau reserve forest.',
      checkInUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80',
      checkInNote: 'Sturdy stem bark forming; protected by community bamboo tree-guards.'
    },
    {
      species: 'Shola Cloud Forest Sapling (Syzygium densiflorum)',
      url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
      description: 'Endemic high-altitude evergreen sapling restoring cloud-forest vegetation in the Nilgiris.',
      checkInUrl: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=800&q=80',
      checkInNote: 'Moisture condensation on leaves creating miniature rainforest microclimate.'
    },
    {
      species: 'Royal Kashmiri Chinar (Platanus orientalis)',
      url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80',
      description: 'Heritage Chinar sapling planted near Dal Lake watershed to preserve ancient Kashmiri valley greenery.',
      checkInUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80',
      checkInNote: 'Five-pointed iconic foliage unfurling gracefully in crisp autumn air.'
    }
  ];

  // Specific photos for users' donations
  const photoDocs = [
    // 3 Photos for manish.kumar.trees@gmail.com
    {
      userEmail: 'manish.kumar.trees@gmail.com',
      programId: programDocs[0]._id, // Sundarbans
      photoUrl: curatedTreePhotos[0].url,
      description: curatedTreePhotos[0].description,
      treeSpecies: curatedTreePhotos[0].species,
      location: {
        type: 'Point',
        locationSource: 'manual-pin',
        coordinates: [88.9007, 21.9497]
      },
      uploadDate: new Date(Date.now() - 12 * 86400000),
      verified: true,
      dedication: 'Dedicated to clean air and mangrove preservation in Sundarbans',
      cheers: 42,
      checkIns: [
        {
          photoUrl: curatedTreePhotos[0].checkInUrl,
          date: new Date(Date.now() - 3 * 86400000),
          note: curatedTreePhotos[0].checkInNote,
          verified: true
        }
      ]
    },
    {
      userEmail: 'manish.kumar.trees@gmail.com',
      programId: programDocs[1]._id, // Western Ghats
      photoUrl: curatedTreePhotos[1].url,
      description: curatedTreePhotos[1].description,
      treeSpecies: curatedTreePhotos[1].species,
      location: {
        type: 'Point',
        locationSource: 'manual-pin',
        coordinates: [76.1320, 11.6854]
      },
      uploadDate: new Date(Date.now() - 8 * 86400000),
      verified: true,
      dedication: 'In honor of our family roots and Western Ghats wildlife',
      cheers: 31,
      checkIns: [
        {
          photoUrl: curatedTreePhotos[1].checkInUrl,
          date: new Date(Date.now() - 2 * 86400000),
          note: curatedTreePhotos[1].checkInNote,
          verified: true
        }
      ]
    },
    {
      userEmail: 'manish.kumar.trees@gmail.com',
      programId: programDocs[8]._id, // Bengaluru
      photoUrl: curatedTreePhotos[2].url,
      description: curatedTreePhotos[2].description,
      treeSpecies: curatedTreePhotos[2].species,
      location: {
        type: 'Point',
        locationSource: 'manual-pin',
        coordinates: [77.5946, 12.9716]
      },
      uploadDate: new Date(Date.now() - 4 * 86400000),
      verified: true,
      dedication: 'For a greener, cooler Garden City Bengaluru!',
      cheers: 58,
      checkIns: [
        {
          photoUrl: curatedTreePhotos[2].checkInUrl,
          date: new Date(Date.now() - 1 * 86400000),
          note: curatedTreePhotos[2].checkInNote,
          verified: true
        }
      ]
    },

    // Photos for Aarav Sharma
    {
      userEmail: 'aarav.sharma.green@gmail.com',
      programId: programDocs[2]._id, // Aravalli
      photoUrl: curatedTreePhotos[5].url,
      description: curatedTreePhotos[5].description,
      treeSpecies: curatedTreePhotos[5].species,
      location: {
        type: 'Point',
        locationSource: 'manual-pin',
        coordinates: [76.7139, 28.0229]
      },
      uploadDate: new Date(Date.now() - 10 * 86400000),
      verified: true,
      dedication: 'Holding the desert back one Khejri at a time',
      cheers: 27,
      checkIns: [
        {
          photoUrl: curatedTreePhotos[5].checkInUrl,
          date: new Date(Date.now() - 2 * 86400000),
          note: curatedTreePhotos[5].checkInNote,
          verified: true
        }
      ]
    },

    // Photos for Priya Patel
    {
      userEmail: 'priya.patel.trees@gmail.com',
      programId: programDocs[4]._id, // Cauvery
      photoUrl: curatedTreePhotos[6].url,
      description: curatedTreePhotos[6].description,
      treeSpecies: curatedTreePhotos[6].species,
      location: {
        type: 'Point',
        locationSource: 'manual-pin',
        coordinates: [79.1378, 10.7870]
      },
      uploadDate: new Date(Date.now() - 9 * 86400000),
      verified: true,
      dedication: 'Planted with love for Mother Cauvery',
      cheers: 19,
      checkIns: []
    },

    // Photos for Rohit Verma
    {
      userEmail: 'rohit.verma.eco@gmail.com',
      programId: programDocs[3]._id, // Himalayan Oak
      photoUrl: curatedTreePhotos[4].url,
      description: curatedTreePhotos[4].description,
      treeSpecies: curatedTreePhotos[4].species,
      location: {
        type: 'Point',
        locationSource: 'manual-pin',
        coordinates: [79.6467, 29.5892]
      },
      uploadDate: new Date(Date.now() - 7 * 86400000),
      verified: true,
      dedication: 'In memory of grandfather who loved the Himalayas',
      cheers: 34,
      checkIns: [
        {
          photoUrl: curatedTreePhotos[4].checkInUrl,
          date: new Date(Date.now() - 1 * 86400000),
          note: curatedTreePhotos[4].checkInNote,
          verified: true
        }
      ]
    },

    // Photos for Ananya Iyer
    {
      userEmail: 'ananya.iyer.earth@gmail.com',
      programId: programDocs[5]._id, // Mumbai Miyawaki
      photoUrl: curatedTreePhotos[3].url,
      description: curatedTreePhotos[3].description,
      treeSpecies: curatedTreePhotos[3].species,
      location: {
        type: 'Point',
        locationSource: 'manual-pin',
        coordinates: [72.8777, 19.0760]
      },
      uploadDate: new Date(Date.now() - 6 * 86400000),
      verified: true,
      dedication: 'Breathing fresh life into our Mumbai skyline',
      cheers: 64,
      checkIns: [
        {
          photoUrl: curatedTreePhotos[3].checkInUrl,
          date: new Date(Date.now() - 1 * 86400000),
          note: curatedTreePhotos[3].checkInNote,
          verified: true
        }
      ]
    },

    // Photos for Sneha Reddy
    {
      userEmail: 'sneha.reddy.nature@gmail.com',
      programId: programDocs[10]._id, // Nilgiri Shola
      photoUrl: curatedTreePhotos[8].url,
      description: curatedTreePhotos[8].description,
      treeSpecies: curatedTreePhotos[8].species,
      location: {
        type: 'Point',
        locationSource: 'manual-pin',
        coordinates: [76.6950, 11.4102]
      },
      uploadDate: new Date(Date.now() - 5 * 86400000),
      verified: true,
      dedication: 'Bringing back the mystical Nilgiri Shola forests',
      cheers: 45,
      checkIns: []
    },

    // Photos for Arjun Nair
    {
      userEmail: 'arjun.nair.green@gmail.com',
      programId: programDocs[15]._id, // Kashmir Chinar
      photoUrl: curatedTreePhotos[9].url,
      description: curatedTreePhotos[9].description,
      treeSpecies: curatedTreePhotos[9].species,
      location: {
        type: 'Point',
        locationSource: 'manual-pin',
        coordinates: [74.7973, 34.0837]
      },
      uploadDate: new Date(Date.now() - 3 * 86400000),
      verified: true,
      dedication: 'May the majestic Chinar shade generations to come',
      cheers: 82,
      checkIns: [
        {
          photoUrl: curatedTreePhotos[9].checkInUrl,
          date: new Date(Date.now() - 1 * 86400000),
          note: curatedTreePhotos[9].checkInNote,
          verified: true
        }
      ]
    },

    // Photos for Kavita Deshmukh
    {
      userEmail: 'kavita.deshmukh.eco@gmail.com',
      programId: programDocs[16]._id, // Telangana Agroforestry
      photoUrl: curatedTreePhotos[7].url,
      description: curatedTreePhotos[7].description,
      treeSpecies: curatedTreePhotos[7].species,
      location: {
        type: 'Point',
        locationSource: 'manual-pin',
        coordinates: [78.0035, 16.7488]
      },
      uploadDate: new Date(Date.now() - 2 * 86400000),
      verified: true,
      dedication: 'Support for dryland farming families and biodiversity',
      cheers: 29,
      checkIns: []
    }
  ];

  await db.collection('photos').insertMany(photoDocs);
  console.log(`✅ ${photoDocs.length} tree photos with donor dedications, species, coordinates, and check-ins inserted.`);

  console.log('\n================ SEED SUMMARY ================');
  console.log('Admin Account:');
  console.log('  Username: admin');
  console.log('  Password: greenroots9090');
  console.log('\n10 Users (Password for all: greenroots123):');
  usersData.forEach((u, i) => {
    console.log(`  ${i + 1}. Username: ${u.username.padEnd(16)} | Email: ${u.email}`);
  });
  console.log('\n20 Programs created across India with varying donation costs (₹350 to ₹1500).');
  console.log('All 10 users have donated to multiple programs.');
  console.log('Tree photos created and linked to users & programs for both User Profiles and Public Front Page.');
  console.log('==============================================\n');

  process.exit(0);
}

seed().catch(err => {
  console.error('Seed script error:', err);
  process.exit(1);
});
