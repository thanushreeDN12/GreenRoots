// Part C - Carbon Impact Estimator
// Approximate annual CO2 sequestration per tree species in kg/year.
// Grounded in forestry and agroforestry empirical estimates (Arbor Day Foundation, ICAR, Forest Research Institute).
const CARBON_RATES = {
  Mangrove: 40,
  Sundarbans: 40,
  Banyan: 35,
  Peepal: 30,
  Teak: 28,
  Oak: 28,
  Banj: 28,
  Sal: 26,
  Mango: 25,
  Jamun: 24,
  Neem: 22,
  Khejri: 20,
  Pine: 18,
  Gulmohar: 18,
  Maple: 20,
  Birch: 18,
  Amaltas: 16,
  Ashoka: 15,
  Cedar: 14,
  Default: 20 // Standard annual average for healthy native sapling
};

/**
 * Calculates estimated lifetime or annual carbon offset.
 * @param {Array} trees - Array of tree objects with a treeSpecies field
 * @returns {Number} - Total estimated CO2 in kg
 */
export const calculateTotalCarbon = (trees) => {
  if (!trees || !Array.isArray(trees)) return 0;
  
  return trees.reduce((total, tree) => {
    // Only verified trees count toward carbon offset
    if (tree.verified === false) return total; 
    
    let rate = CARBON_RATES.Default;
    if (tree.treeSpecies) {
      // Very basic normalization (e.g. "oak", "Oak tree")
      const speciesLower = tree.treeSpecies.toLowerCase();
      const matchedKey = Object.keys(CARBON_RATES).find(key => speciesLower.includes(key.toLowerCase()));
      if (matchedKey) rate = CARBON_RATES[matchedKey];
    }
    
    // For Part D (Growth Check-ins), we could factor in age:
    // e.g., base rate + (number of check-ins * bonus).
    // Let's add 2kg for every verified check-in indicating survival/growth
    let checkInBonus = 0;
    if (tree.checkIns && Array.isArray(tree.checkIns)) {
      checkInBonus = tree.checkIns.filter(c => c.verified).length * 2;
    }

    return total + rate + checkInBonus;
  }, 0);
};
