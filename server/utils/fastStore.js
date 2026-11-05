import mongoose from 'mongoose';
import Program from '../models/programs.js';

// Pre-defined stable 24-char hex ObjectIds for each program to ensure consistency
export const curated20Programs = [
  {
    _id: '65f100000000000000000001',
    id: '65f100000000000000000001',
    title: 'Sundarbans Mangrove Protection',
    description: 'Planting resilient coastal mangrove species in the delta to defend coastal villages against cyclones and restore Royal Bengal tiger wetlands.',
    location: 'Sundarbans, West Bengal',
    state: 'West Bengal',
    donationCost: 350,
    targetAmount: 350000,
    raisedAmount: 245000,
    donatedUsers: []
  },
  {
    _id: '65f100000000000000000002',
    id: '65f100000000000000000002',
    title: 'Western Ghats Biodiversity Corridor',
    description: 'Reforesting endemic rainforest species like Malabar Ironwood to reconnect fragmented elephant and leopard habitats in the UNESCO heritage corridor.',
    location: 'Wayanad & Coorg, Western Ghats',
    state: 'Kerala & Karnataka',
    donationCost: 600,
    targetAmount: 600000,
    raisedAmount: 480000,
    donatedUsers: []
  },
  {
    _id: '65f100000000000000000003',
    id: '65f100000000000000000003',
    title: 'Aravalli Green Wall Project',
    description: 'Planting indigenous desert-hardy Khejri and Rohida trees along the rocky Aravalli range to halt Thar desertification and recharge NCR groundwater.',
    location: 'Alwar & Gurugram, Aravalli Hills',
    state: 'Rajasthan & Haryana',
    donationCost: 450,
    targetAmount: 450000,
    raisedAmount: 310000,
    donatedUsers: []
  },
  {
    _id: '65f100000000000000000004',
    id: '65f100000000000000000004',
    title: 'Himalayan Oak & Rhododendron Drive',
    description: 'Revitalizing mountain catchment forests with native Banj Oak to prevent monsoonal landslides and protect perennial Himalayan hill springs.',
    location: 'Almora & Nainital, Kumaon',
    state: 'Uttarakhand',
    donationCost: 750,
    targetAmount: 750000,
    raisedAmount: 520000,
    donatedUsers: []
  },
  {
    _id: '65f100000000000000000005',
    id: '65f100000000000000000005',
    title: 'Cauvery River Basin Afforestation',
    description: 'Planting agroforestry timber, Jamun, and fruit trees along riverbanks to revive perennial flow in Cauvery and secure sustainable farm yields.',
    location: 'Thanjavur & Mandya, Cauvery Basin',
    state: 'Tamil Nadu & Karnataka',
    donationCost: 500,
    targetAmount: 500000,
    raisedAmount: 380000,
    donatedUsers: []
  },
  {
    _id: '65f100000000000000000006',
    id: '65f100000000000000000006',
    title: 'Mumbai Urban Miyawaki Forest',
    description: 'Creating hyper-dense native micro-forests in empty urban spaces across Mumbai to scrub particulate pollutants and reduce extreme heat island effects.',
    location: 'Bandra & Chembur, Mumbai',
    state: 'Maharashtra',
    donationCost: 1200,
    targetAmount: 1200000,
    raisedAmount: 940000,
    donatedUsers: []
  },
  {
    _id: '65f100000000000000000007',
    id: '65f100000000000000000007',
    title: 'Kaziranga Buffer Zone Wildlife Corridor',
    description: 'Planting high-canopy flood refuge trees and wetland flora around Kaziranga to shelter one-horned rhinos during Brahmaputra monsoon floods.',
    location: 'Golaghat & Bokakhat, Kaziranga',
    state: 'Assam',
    donationCost: 550,
    targetAmount: 550000,
    raisedAmount: 410000,
    donatedUsers: []
  },
  {
    _id: '65f100000000000000000008',
    id: '65f100000000000000000008',
    title: 'Chambal Badlands Soil Reclamation',
    description: 'Planting deep-rooting Acacia, Neem, and Shisham along the steep Chambal ravines to stop severe gully erosion and turn badlands green.',
    location: 'Morena & Bhind, Chambal',
    state: 'Madhya Pradesh',
    donationCost: 400,
    targetAmount: 400000,
    raisedAmount: 290000,
    donatedUsers: []
  },
  {
    _id: '65f100000000000000000009',
    id: '65f100000000000000000009',
    title: 'Bengaluru Urban Lake Catchment Re-Greening',
    description: 'Restoring native wetland trees, bamboo thickets, and bio-swales around Bengaluru water bodies to purify runoff and prevent urban flooding.',
    location: 'Varthur & Bellandur, Bengaluru',
    state: 'Karnataka',
    donationCost: 800,
    targetAmount: 800000,
    raisedAmount: 690000,
    donatedUsers: []
  },
  {
    _id: '65f100000000000000000010',
    id: '65f100000000000000000010',
    title: 'Thar Desert Bishnoi Sacred Groves',
    description: 'Empowering community-managed Oran groves with Kankera, Ber, and Ghaf trees, carrying forward the Bishnoi communitys legendary tree protection pledge.',
    location: 'Jodhpur & Barmer, Thar Desert',
    state: 'Rajasthan',
    donationCost: 650,
    targetAmount: 650000,
    raisedAmount: 510000,
    donatedUsers: []
  },
  {
    _id: '65f100000000000000000011',
    id: '65f100000000000000000011',
    title: 'Nilgiri Biosphere Shola Restoration',
    description: 'Replacing invasive eucalyptus plantations with ancient high-altitude Shola forest saplings and native montane grasslands in the Nilgiris.',
    location: 'Kotagiri & Ooty, Nilgiris',
    state: 'Tamil Nadu',
    donationCost: 900,
    targetAmount: 900000,
    raisedAmount: 720000,
    donatedUsers: []
  },
  {
    _id: '65f100000000000000000012',
    id: '65f100000000000000000012',
    title: 'Pichavaram Coastal Wetland Preservation',
    description: 'Protecting and expanding the world’s second-largest mangrove ecosystem with Rhizophora propagules to nurture marine life and support fisherfolk.',
    location: 'Chidambaram, Cuddalore',
    state: 'Tamil Nadu',
    donationCost: 420,
    targetAmount: 420000,
    raisedAmount: 330000,
    donatedUsers: []
  },
  {
    _id: '65f100000000000000000013',
    id: '65f100000000000000000013',
    title: 'Delhi-NCR Southern Ridge Regeneration',
    description: 'Reclaiming degraded Delhi ridge woodlands by replacing invasive Vilayati Kikar with indigenous Dhau, Peepal, and Amaltas trees to clean NCR air.',
    location: 'Southern Ridge, New Delhi',
    state: 'Delhi NCR',
    donationCost: 1000,
    targetAmount: 1000000,
    raisedAmount: 850000,
    donatedUsers: []
  },
  {
    _id: '65f100000000000000000014',
    id: '65f100000000000000000014',
    title: 'Gir Asiatic Lion Buffer Habitat',
    description: 'Creating drought-resilient forest buffer zones of Ber and Timru around Sasan Gir to expand safe roaming territories for Asiatic lion prides.',
    location: 'Junagadh & Sasan Gir',
    state: 'Gujarat',
    donationCost: 700,
    targetAmount: 700000,
    raisedAmount: 560000,
    donatedUsers: []
  },
  {
    _id: '65f100000000000000000015',
    id: '65f100000000000000000015',
    title: 'Chota Nagpur Tribal Community Orchards',
    description: 'Partnering with tribal farming families to plant fruit-bearing Mahua, Sal, and Karanj trees for soil enrichment and sustainable forest livelihood.',
    location: 'Ranchi & Khunti, Chota Nagpur',
    state: 'Jharkhand',
    donationCost: 380,
    targetAmount: 380000,
    raisedAmount: 290000,
    donatedUsers: []
  },
  {
    _id: '65f100000000000000000016',
    id: '65f100000000000000000016',
    title: 'Kashmir Valley Royal Chinar & Walnut Revival',
    description: 'Protecting historic heritage Chinar trees and planting walnut and deodar cedar groves on terraced Himalayan mountain slopes.',
    location: 'Srinagar & Anantnag, Kashmir',
    state: 'Jammu & Kashmir',
    donationCost: 1500,
    targetAmount: 1500000,
    raisedAmount: 1100000,
    donatedUsers: []
  },
  {
    _id: '65f100000000000000000017',
    id: '65f100000000000000000017',
    title: 'Telangana Semi-Arid Agroforestry',
    description: 'Planting drought-hardy Red Sandalwood, Neem, and Tamarind to restore soil moisture and enhance agricultural sustainability in rainfed drylands.',
    location: 'Mahbubnagar & Warangal',
    state: 'Telangana',
    donationCost: 480,
    targetAmount: 480000,
    raisedAmount: 390000,
    donatedUsers: []
  },
  {
    _id: '65f100000000000000000018',
    id: '65f100000000000000000018',
    title: 'Goa Coastal Dune & Casuarina Shield',
    description: 'Stabilizing sensitive turtle-nesting shores and beach sand dunes with salt-tolerant Casuarina, Pongamia, and coastal ground creepers.',
    location: 'Morjim & Agonda, Coastal Goa',
    state: 'Goa',
    donationCost: 520,
    targetAmount: 520000,
    raisedAmount: 420000,
    donatedUsers: []
  },
  {
    _id: '65f100000000000000000019',
    id: '65f100000000000000000019',
    title: 'Mahanadi Delta Community Green Wall',
    description: 'Shielding vulnerable coastal agrarian villages against frequent Bay of Bengal super-cyclones through deep-rooting mangrove and Casuarina belts.',
    location: 'Kendrapara & Jagatsinghpur',
    state: 'Odisha',
    donationCost: 390,
    targetAmount: 390000,
    raisedAmount: 310000,
    donatedUsers: []
  },
  {
    _id: '65f100000000000000000020',
    id: '65f100000000000000000020',
    title: 'Silent Valley Cloud Forest Canopy Protection',
    description: 'Fostering buffer zone canopy layers for one of the last pristine tropical evergreen rainforest tracts in the southern Western Ghats.',
    location: 'Palakkad & Mannarkkad, Silent Valley',
    state: 'Kerala',
    donationCost: 850,
    targetAmount: 850000,
    raisedAmount: 640000,
    donatedUsers: []
  }
];

// In-memory high-speed cache
class FastProgramStore {
  constructor() {
    this.programs = [...curated20Programs];
    this.lookupMap = new Map();
    this.lastSync = 0;
    this.rebuildIndex();
  }

  rebuildIndex() {
    this.lookupMap.clear();
    this.programs.forEach((p, idx) => {
      if (p._id) this.lookupMap.set(String(p._id), p);
      if (p.id) this.lookupMap.set(String(p.id), p);
      // Index by title slug for friendly URLs
      if (p.title) {
        const slug = p.title.toLowerCase().replace(/[^a-z0-9]/g, '');
        this.lookupMap.set(slug, p);
      }
      this.lookupMap.set(String(idx + 1), p);
    });
  }

  getAll() {
    return this.programs;
  }

  getById(id) {
    if (!id) return this.programs[0];
    const key = String(id).trim();

    // 1. Direct O(1) key match
    if (this.lookupMap.has(key)) {
      return this.lookupMap.get(key);
    }

    // 2. Case-insensitive slug match
    const cleanKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (this.lookupMap.has(cleanKey)) {
      return this.lookupMap.get(cleanKey);
    }

    // 3. Partial title substring search
    const matched = this.programs.find(p => 
      p.title && (
        p.title.toLowerCase().includes(key.toLowerCase()) || 
        key.toLowerCase().includes(p.title.toLowerCase())
      )
    );
    if (matched) return matched;

    // 4. Default fallback to prevent "Not Found" breaking UI
    return this.programs[0];
  }

  upsert(prog) {
    if (!prog) return;
    const existingIdx = this.programs.findIndex(p => 
      (prog._id && String(p._id) === String(prog._id)) ||
      (prog.id && String(p.id) === String(prog.id)) ||
      (prog.title && p.title.toLowerCase() === prog.title.toLowerCase())
    );

    if (existingIdx >= 0) {
      this.programs[existingIdx] = { ...this.programs[existingIdx], ...prog };
    } else {
      const newEntry = {
        _id: prog._id || new mongoose.Types.ObjectId().toString(),
        id: prog.id || prog._id,
        raisedAmount: 0,
        targetAmount: 500000,
        donationCost: 500,
        donatedUsers: [],
        ...prog
      };
      this.programs.push(newEntry);
    }
    this.rebuildIndex();
  }

  recordDonation(programId, amount, donorId) {
    const prog = this.getById(programId);
    if (prog) {
      prog.raisedAmount = (prog.raisedAmount || 0) + Number(amount || 0);
      if (donorId && !prog.donatedUsers?.includes(donorId)) {
        prog.donatedUsers = prog.donatedUsers || [];
        prog.donatedUsers.push(donorId);
      }
      this.rebuildIndex();
    }
  }

  // Asynchronous background sync with MongoDB without blocking client responses
  async syncFromDb() {
    const isConnected = mongoose.connection.readyState === 1;
    if (!isConnected) return;

    try {
      const dbPrograms = await Program.find().lean();
      if (dbPrograms && dbPrograms.length > 0) {
        dbPrograms.forEach(p => this.upsert(p));
        this.lastSync = Date.now();
      }
    } catch (err) {
      console.warn('[FastProgramStore] Sync warning:', err.message);
    }
  }
}

export const fastStore = new FastProgramStore();
