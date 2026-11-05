import mongoose from 'mongoose';
import Program from '../models/programs.js';
import Donation from '../models/donation.js';
import User from '../models/users.js';

// -----------------------------------------------------------------------------
// 1. Fetch All Programs
// -----------------------------------------------------------------------------
export const fetchprograms = async (req, res) => {
  try {
    const programs = await Program.find()
      .populate('donatedUsers', 'username email')
      .lean();

    return res.status(200).json(programs || []);
  } catch (error) {
    console.error('Error fetching programs:', error.message);
    return res.status(500).json({ message: 'Error fetching programs' });
  }
};

// -----------------------------------------------------------------------------
// 2. Fetch Single Program by ID
// -----------------------------------------------------------------------------
export const fetchSingleProgram = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid program ID' });
    }

    const program = await Program.findById(id).lean();
    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }

    return res.status(200).json(program);
  } catch (error) {
    console.error('Error fetching single program:', error.message);
    return res.status(500).json({ message: 'Error fetching program' });
  }
};

// -----------------------------------------------------------------------------
// 3. Add a New Reforestation Program (Admin)
// -----------------------------------------------------------------------------
export const addprogram = async (req, res) => {
  const { title, description, location, state, donationCost, targetAmount } = req.body;

  try {
    const newProgram = new Program({
      title,
      description,
      location: location || '',
      state: state || '',
      donationCost: Number(donationCost) || 500,
      targetAmount: Number(targetAmount) || 500000,
      raisedAmount: 0,
      donatedUsers: []
    });

    await newProgram.save();
    return res.status(201).json(newProgram);
  } catch (error) {
    console.error('Error creating program:', error.message);
    return res.status(500).json({ message: 'Failed to add program' });
  }
};

// -----------------------------------------------------------------------------
// 4. Link Donated Program to User & Save Donation Record
// -----------------------------------------------------------------------------
export const addProgramIdToUser = async (req, res) => {
  const { programId, userId, amount } = req.body;

  try {
    if (!programId || !userId) {
      return res.status(400).json({ message: 'programId and userId are required' });
    }

    // Add program to user's donatedPrograms list
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { donatedPrograms: programId } }
    );

    // Add user to program's donatedUsers list and increment raised funds
    const numericAmount = Number(amount) || 0;
    await Program.findByIdAndUpdate(
      programId,
      {
        $addToSet: { donatedUsers: userId },
        $inc: { raisedAmount: numericAmount }
      }
    );

    // Record the donation
    await Donation.create({
      user: userId,
      program: programId,
      amount: numericAmount,
      date: new Date()
    });

    return res.status(200).json({ message: 'Donation linked successfully' });
  } catch (error) {
    console.error('Error in addProgramIdToUser:', error.message);
    return res.status(500).json({ message: 'Failed to link donation to user' });
  }
};

// -----------------------------------------------------------------------------
// 5. Get User Impact Grouped by Program
// -----------------------------------------------------------------------------
export const getUserImpact = async (req, res) => {
  try {
    const userId = req.userid;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const donations = await Donation.find({ user: userId }).populate('program').lean();

    // Group donations by program
    const programsMap = {};

    for (let i = 0; i < donations.length; i++) {
      const d = donations[i];
      if (!d.program) continue;

      const progId = d.program._id.toString();
      if (!programsMap[progId]) {
        programsMap[progId] = {
          _id: d.program._id,
          programName: d.program.title,
          totalDonated: 0,
          trees: []
        };
      }
      programsMap[progId].totalDonated += (d.amount || 0);
    }

    const result = Object.values(programsMap);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching user impact:', error.message);
    return res.status(200).json([]);
  }
};


// -----------------------------------------------------------------------------
// 6. Get Single User by ID
// -----------------------------------------------------------------------------
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await User.findById(id).populate('donatedPrograms').lean();
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error.message);
    return res.status(500).json({ message: 'Error fetching user' });
  }
};

// -----------------------------------------------------------------------------
// 7. Get Top Donors Leaderboard
// -----------------------------------------------------------------------------
export const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find().populate('donatedPrograms').lean();

    const leaderboard = users.map((u) => {
      const treeCount = (u.donatedPrograms || []).length;
      return {
        _id: u._id,
        username: u.username || 'Anonymous',
        treesPlanted: treeCount,
        carbonKg: treeCount * 22
      };
    }).sort((a, b) => b.treesPlanted - a.treesPlanted).slice(0, 10);

    return res.status(200).json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error.message);
    return res.status(200).json([]);
  }
};