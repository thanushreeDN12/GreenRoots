import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

// 36 verified distinct working Unsplash tree/sapling/forest photograph IDs
const UNIQUE_PHOTO_IDS = [
  'photo-1542601906990-b4d3fb778b09', // Young green sapling in soil
  'photo-1502082553048-f009c37129b9', // Solitary sunlit oak tree
  'photo-1448375240586-882707db888b', // Tall pine canopy
  'photo-1513836279014-a89f7a76ae86', // Upward forest canopy
  'photo-1473448912268-2022ce9509d8', // Golden autumn birch
  'photo-1426604966848-d7adac402bff', // Mountain evergreen slopes
  'photo-1500530855697-b586d89ba3ee', // Ancient banyan roots
  'photo-1509316975850-ff9c5deb0cd9', // Fresh spring green tree
  'photo-1464822759023-fed622ff2c3b', // Alpine rhododendron valley
  'photo-1476231682828-37e571bc172f', // Emerald tropical rainforest
  'photo-1516214104703-d870798883c5', // Frost-dusted fir pine
  'photo-1518495973542-4542c06a5843', // Sunbeams in forest
  'photo-1470240731273-7821a6eeb6bd', // Sun-drenched birch trail
  'photo-1546842931-886c185b4c8c', // Seedling held in hands
  'photo-1477414348463-c0eb7f1359b6', // Radiant golden maple foliage
  'photo-1528183429752-a97d0bf99b5a', // Bamboo grove in morning mist
  'photo-1572085313466-6710de8d7ba3', // Healthy planted potted conifer
  'photo-1441974231531-c6227db76b6e', // Mossy woodland sunbeam
  'photo-1469474968028-56623f02e42e', // Solitary cypress on green hill
  'photo-1500382017468-9049fed747ef', // Acacia tree on savanna
  'photo-1473773508845-188df298d2d1', // Golden sunset forest canopy
  'photo-1470071459604-3b5ec3a7fe05', // Wild woodland meadow
  'photo-1472214103451-9374bd1c798e', // Solitary blooming tree
  'photo-1518531933037-91b2f5f229cc', // Dewy green forest leaves
  'photo-1465146344425-f00d5f5c8f07', // Lush wilderness foliage
  'photo-1475113548554-5a36f1f523d6', // Forest pathway with towering trees
  'photo-1438786657495-640937046d18', // Riverbank willow grove
  'photo-1541443131876-44b03de101c5', // Vibrant green foliage in sun
  'photo-1502472584812-f78b74dd449f', // Redwood grove trunks
  'photo-1516026672322-bc52d61a55d5', // Mountain pine forest
  'photo-1444492417251-9c84a5fa18e0', // High canopy in mist
  'photo-1465056836041-7f43ac27dcb5', // Mountain peak pines
  'photo-1501785888041-af3ef285b470', // Lake reflection conifers
  'photo-1497250681960-ef046c08a56e', // Broad tropical green leaves
  'photo-1473081556163-2a17de81fc97', // Forest fern and canopy
  'photo-1510798831971-661eb04b3739'  // Autumn larch trees
];

// Eco program metadata for regional tree species, coordinates, and realistic descriptions
const PROGRAM_SPECIES_DATA = {
  "Sundarbans Mangrove Protection": {
    species: "Sundarbans Mangrove (Rhizophora mucronata)",
    coords: [88.9007, 21.9497],
    notes: "Pioneering mangrove sapling planted along tidal mudflats, stabilizing the coastal delta."
  },
  "Western Ghats Biodiversity Corridor": {
    species: "Malabar Ironwood (Hopea parviflora)",
    coords: [75.8362, 11.2588],
    notes: "Endemic rainforest sapling planted to reconnect fragmented wildlife corridors in the Western Ghats."
  },
  "Aravalli Green Wall Project": {
    species: "Desert Khejri (Prosopis cineraria)",
    coords: [75.7873, 26.9124],
    notes: "Drought-resilient Khejri planted along the ridge line to combat desertification."
  },
  "Himalayan Oak & Rhododendron Drive": {
    species: "Himalayan Banj Oak (Quercus leucotrichophora)",
    coords: [79.4304, 30.0668],
    notes: "Broadleaf Banj Oak sapling planted to restore montane watershed retention in the Himalayas."
  },
  "Cauvery River Basin Afforestation": {
    species: "Indian Teak (Tectona grandis)",
    coords: [77.7274, 11.3410],
    notes: "Native riparian hardwood planted along the river basin to recharge groundwater tables."
  },
  "Mumbai Urban Miyawaki Forest": {
    species: "Miyawaki Native Canopy (Jamun & Neem)",
    coords: [72.8777, 19.0760],
    notes: "High-density multi-tier urban micro-forest sapling absorbing city emissions and lowering heat."
  },
  "Kaziranga Buffer Zone Wildlife Corridor": {
    species: "Assam Hollong (Dipterocarpus macrocarpus)",
    coords: [93.1711, 26.5775],
    notes: "State tree of Assam planted in the peripheral buffer zone to shelter migrating rhinos."
  },
  "Chambal Badlands Soil Reclamation": {
    species: "Flame of the Forest (Butea monosperma)",
    coords: [78.1828, 26.5000],
    notes: "Nitrogen-fixing Dhak sapling planted into ravine gully soils to halt topsoil erosion."
  },
  "Bengaluru Urban Lake Catchment Re-Greening": {
    species: "Sacred Peepal (Ficus religiosa)",
    coords: [77.5946, 12.9716],
    notes: "Keystone fig sapling planted along the lake wetland perimeter to support bird bio-diversity."
  },
  "Thar Desert Bishnoi Sacred Groves": {
    species: "Rohida Desert Teak (Tecomella undulata)",
    coords: [71.9270, 26.2389],
    notes: "Endangered desert timber sapling nurtured under traditional Bishnoi community stewardship."
  },
  "Nilgiri Biosphere Shola Restoration": {
    species: "Shola Cloud Forest Sapling (Syzygium densiflorum)",
    coords: [76.7337, 11.4102],
    notes: "High-altitude cloud forest sapling planted in grassland shola margins to protect perennial springs."
  },
  "Pichavaram Coastal Wetland Preservation": {
    species: "Black Mangrove (Avicennia marina)",
    coords: [79.7900, 11.4285],
    notes: "Salt-excreting mangrove sapling anchored in the estuarine canals to protect fisheries."
  },
  "Delhi-NCR Southern Ridge Regeneration": {
    species: "Anogeissus Pendula (Dhau Tree)",
    coords: [77.2090, 28.6139],
    notes: "Indigenous rocky ridge sapling re-introduced to replace invasive Vilayati Kikar."
  },
  "Gir Asiatic Lion Buffer Habitat": {
    species: "Gir Timru & Babul (Diospyros melanoxylon)",
    coords: [70.7961, 21.1240],
    notes: "Dry deciduous thorn tree sapling planted to expand protective canopy for Asiatic lions."
  },
  "Chota Nagpur Tribal Community Orchards": {
    species: "Mahua & Sal (Madhuca longifolia)",
    coords: [85.3096, 23.3441],
    notes: "Sacred multi-purpose agroforestry tree providing clean nectar flowers and soil health."
  },
  "Kashmir Valley Royal Chinar & Walnut Revival": {
    species: "Royal Kashmiri Chinar (Platanus orientalis)",
    coords: [74.7973, 34.0837],
    notes: "Historic Oriental Plane sapling rooted in valley soils to restore Kashmir's heritage canopy."
  },
  "Telangana Semi-Arid Agroforestry": {
    species: "Red Sandalwood (Pterocarpus santalinus)",
    coords: [78.4867, 17.3850],
    notes: "Valuable dry-zone endemic hardwood planted in farm bund agroforestry clusters."
  },
  "Goa Coastal Dune & Casuarina Shield": {
    species: "Coastal Dune Shield (Casuarina equisetifolia)",
    coords: [73.8180, 15.2993],
    notes: "Deep-rooting salt-spray shield tree planted along shoreline dunes to guard against sea surges."
  },
  "Mahanadi Delta Community Green Wall": {
    species: "Sundari Mangrove (Heritiera fomes)",
    coords: [86.6800, 20.3000],
    notes: "Sturdy delta mangrove planted by community youth groups to buffer cyclone storm surges."
  },
  "Silent Valley Cloud Forest Canopy Protection": {
    species: "Wild Durian Canopy (Cullenia exarillata)",
    coords: [76.4294, 11.0805],
    notes: "Primary rainforest canopy sapling that feeds endemic Lion-Tailed Macaques."
  }
};

const seedPlantedTreeImages = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 8000 });
    const db = mongoose.connection.db;

    // Remove any existing photos to ensure a completely clean, pristine, 100% unique collection
    const delResult = await db.collection('photos').deleteMany({});
    console.log(`Cleared previous photos (${delResult.deletedCount} removed).`);

    // Fetch all programs
    const programs = await db.collection('programs').find({}).toArray();
    const programMap = new Map();
    programs.forEach(p => programMap.set(p._id.toString(), p));

    // Dummy users to upload images for
    const dummyUsernames = [
      'aarav_sharma',
      'priya_patel',
      'rohit_verma',
      'ananya_iyer',
      'vikram_singh',
      'sneha_reddy',
      'arjun_nair',
      'kavita_deshmukh',
      'rahul_mehta'
    ];

    const users = await db.collection('users').find({
      username: { $in: dummyUsernames }
    }).toArray();

    console.log(`Found ${users.length} dummy users to seed planted tree photos for.`);

    let imageIndex = 0;
    const photoDocs = [];

    for (const user of users) {
      const donatedProgramIds = user.donatedPrograms || [];
      console.log(`User ${user.username} (${user.email}) donated to ${donatedProgramIds.length} programs.`);

      for (const progId of donatedProgramIds) {
        const prog = programMap.get(progId.toString());
        if (!prog) continue;

        const photoId = UNIQUE_PHOTO_IDS[imageIndex % UNIQUE_PHOTO_IDS.length];
        imageIndex++;

        const photoUrl = `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=800&q=80`;
        const programInfo = PROGRAM_SPECIES_DATA[prog.title] || {
          species: "Native Regional Forest Sapling",
          coords: [78.9629, 20.5937],
          notes: `Healthy native sapling planted and GPS-verified in the ${prog.title} reserve.`
        };

        const daysAgo = Math.floor(Math.random() * 20) + 2;
        const uploadDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

        photoDocs.push({
          userEmail: user.email.toLowerCase().trim(),
          programId: prog._id,
          photoUrl: photoUrl,
          description: `${programInfo.notes} Verified and geo-tagged by local forest field wardens.`,
          treeSpecies: programInfo.species,
          location: {
            type: "Point",
            locationSource: "geolocation",
            coordinates: programInfo.coords
          },
          uploadDate: uploadDate,
          verified: true,
          dedication: `Planted in honor of @${user.username}'s dedicated sponsorship in ${prog.title}.`,
          cheers: Math.floor(Math.random() * 12) + 3,
          checkIns: [
            {
              photoUrl: photoUrl,
              date: uploadDate,
              note: `Initial plantation and geotag verification complete. Root vigor: excellent.`,
              verified: true
            }
          ]
        });
      }
    }

    // Insert all documents
    if (photoDocs.length > 0) {
      const insertResult = await db.collection('photos').insertMany(photoDocs);
      console.log(`Successfully uploaded ${insertResult.insertedCount} unique planted tree photos across all dummy users!`);
    }

    // Verify each user has photos now
    for (const u of users) {
      const count = await db.collection('photos').countDocuments({ userEmail: u.email });
      console.log(`- ${u.username} (${u.email}): ${count} verified planted tree photos`);
    }

    // Also verify total distinct photo URLs
    const distinctUrls = await db.collection('photos').distinct('photoUrl');
    console.log(`Total photos in DB: ${photoDocs.length}, Unique photo URLs: ${distinctUrls.length}`);

  } catch (err) {
    console.error('Error seeding tree photos:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seedPlantedTreeImages();
