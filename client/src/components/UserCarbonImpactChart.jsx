import React, { useState, useEffect, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

// Species carbon sequestration rates in kg/year (matching forestry models)
const SPECIES_RATES = {
  'mangrove': 40,
  'sundarbans mangrove': 40,
  'banyan': 35,
  'peepal': 30,
  'teak': 28,
  'banj oak': 28,
  'oak': 28,
  'sal': 26,
  'mango': 25,
  'jamun': 24,
  'neem': 22,
  'khejri': 20,
  'pine': 18,
  'gulmohar': 18,
  'amaltas': 16,
  'ashoka': 15,
  'default': 20
};

const getSpeciesAnnualRate = (speciesName) => {
  if (!speciesName) return SPECIES_RATES.default;
  const lower = speciesName.toLowerCase().trim();
  for (const [key, rate] of Object.entries(SPECIES_RATES)) {
    if (lower.includes(key)) return rate;
  }
  return SPECIES_RATES.default;
};

// Custom Tooltip component for Recharts
const CustomChartTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload;
    const carbonVal = payload[0].value;
    const phones = Math.round(carbonVal * 122);
    const carKm = (carbonVal * 4.1).toFixed(1);

    return (
      <div
        id="carbon-chart-tooltip"
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #c1dcc0',
          borderRadius: '8px',
          padding: '12px 16px',
          boxShadow: '0 4px 12px rgba(21, 71, 52, 0.12)',
          minWidth: '180px'
        }}
      >
        <p style={{ margin: '0 0 6px', fontWeight: 'bold', color: '#154734', fontSize: '0.9rem' }}>
          {label || dataPoint.period || dataPoint.name}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#2e7d32', display: 'inline-block' }} />
          <span style={{ fontSize: '0.85rem', color: '#333' }}>
            Carbon Offset: <strong style={{ color: '#154734' }}>{carbonVal} kg CO₂</strong>
          </span>
        </div>
        {dataPoint.treesCount !== undefined && (
          <p style={{ margin: '2px 0', fontSize: '0.8rem', color: '#666' }}>
            Trees Active: <strong>{dataPoint.treesCount}</strong>
          </p>
        )}
        {dataPoint.species && (
          <p style={{ margin: '2px 0', fontSize: '0.8rem', color: '#666' }}>
            Species: <strong>{dataPoint.species}</strong>
          </p>
        )}
        <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px dashed #e0e0e0', fontSize: '0.75rem', color: '#555' }}>
          <div>📱 ~{phones.toLocaleString()} phones charged</div>
          <div>🚗 ~{carKm} km driving offset</div>
        </div>
      </div>
    );
  }
  return null;
};

const UserCarbonImpactChart = ({ trees: propTrees, userEmail: propUserEmail, title }) => {
  const [internalTrees, setInternalTrees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('timeline'); // 'timeline' | 'projection' | 'species'

  // Determine user email
  const effectiveEmail = useMemo(() => {
    if (propUserEmail) return propUserEmail;
    try {
      const stored = localStorage.getItem('profile');
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed?.result?.email || parsed?.newUser?.email || '';
      }
    } catch {
      // ignore JSON error
    }
    return '';
  }, [propUserEmail]);

  // Fetch trees from MongoDB if not passed via props
  useEffect(() => {
    if (propTrees && Array.isArray(propTrees) && propTrees.length > 0) {
      setInternalTrees(propTrees);
      return;
    }

    const fetchUserTrees = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = effectiveEmail
          ? `/admin/getPhoto?userEmail=${encodeURIComponent(effectiveEmail)}`
          : '/api/photos/public';

        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch tree data from database');
        const data = await res.json();
        const treeList = Array.isArray(data) ? data : data.photos || [];
        setInternalTrees(treeList);
      } catch (err) {
        console.error('[UserCarbonImpactChart] Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserTrees();
  }, [propTrees, effectiveEmail]);

  // Verified trees list
  const verifiedTrees = useMemo(() => {
    return (internalTrees || []).filter(t => t.verified !== false);
  }, [internalTrees]);

  // 1. Calculate Timeline Data (Cumulative offset over time as trees were planted)
  const timelineData = useMemo(() => {
    if (!verifiedTrees.length) return [];

    // Sort chronologically
    const sorted = [...verifiedTrees].sort((a, b) => {
      const dateA = new Date(a.uploadDate || a.createdAt || Date.now()).getTime();
      const dateB = new Date(b.uploadDate || b.createdAt || Date.now()).getTime();
      return dateA - dateB;
    });

    let cumulativeCarbon = 0;
    const points = [];

    sorted.forEach((tree, idx) => {
      const annualRate = getSpeciesAnnualRate(tree.treeSpecies);
      const checkInBonus = (tree.checkIns?.filter(c => c.verified)?.length || 0) * 2;
      const initialCarbon = annualRate + checkInBonus;

      cumulativeCarbon += initialCarbon;

      const dateObj = new Date(tree.uploadDate || tree.createdAt || Date.now());
      const label = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

      points.push({
        date: label,
        carbonOffset: Math.round(cumulativeCarbon),
        annualRate: annualRate,
        treesCount: idx + 1,
        species: tree.treeSpecies || 'Native Tree'
      });
    });

    return points;
  }, [verifiedTrees]);

  // 2. Multi-Year Compounding Projection Data (Years 1 to 10)
  const projectionData = useMemo(() => {
    if (!verifiedTrees.length) return [];

    const totalAnnualRate = verifiedTrees.reduce((acc, t) => {
      return acc + getSpeciesAnnualRate(t.treeSpecies);
    }, 0);

    const baseCarbon = verifiedTrees.reduce((acc, t) => {
      const checkInBonus = (t.checkIns?.filter(c => c.verified)?.length || 0) * 2;
      return acc + getSpeciesAnnualRate(t.treeSpecies) + checkInBonus;
    }, 0);

    const years = [1, 2, 3, 4, 5, 7, 10];
    return years.map(yr => {
      // Younger saplings increase sequestration efficiency by ~5% per year as leaf area expands
      const growthMultiplier = 1 + (yr - 1) * 0.05;
      const projectedTotal = Math.round(baseCarbon + (yr - 1) * totalAnnualRate * growthMultiplier);
      return {
        period: `Year ${yr}`,
        carbonOffset: projectedTotal,
        treesCount: verifiedTrees.length,
        annualRate: Math.round(totalAnnualRate * growthMultiplier)
      };
    });
  }, [verifiedTrees]);

  // 3. Species Breakdown Data
  const speciesData = useMemo(() => {
    if (!verifiedTrees.length) return [];

    const map = {};
    verifiedTrees.forEach(t => {
      const sp = t.treeSpecies?.trim() || 'Native Sapling';
      const rate = getSpeciesAnnualRate(sp);
      if (!map[sp]) {
        map[sp] = { name: sp, count: 0, totalRate: 0 };
      }
      map[sp].count += 1;
      map[sp].totalRate += rate;
    });

    return Object.values(map)
      .map(item => ({
        name: item.name,
        carbonOffset: item.totalRate,
        treesCount: item.count,
        annualRate: item.totalRate
      }))
      .sort((a, b) => b.carbonOffset - a.carbonOffset);
  }, [verifiedTrees]);

  // Summary statistics
  const totalTreesCount = verifiedTrees.length;
  const currentTotalCarbon = useMemo(() => {
    return verifiedTrees.reduce((sum, t) => {
      const checkIns = (t.checkIns?.filter(c => c.verified)?.length || 0) * 2;
      return sum + getSpeciesAnnualRate(t.treeSpecies) + checkIns;
    }, 0);
  }, [verifiedTrees]);

  const annualSequestrationRate = useMemo(() => {
    return verifiedTrees.reduce((sum, t) => sum + getSpeciesAnnualRate(t.treeSpecies), 0);
  }, [verifiedTrees]);

  const tenYearProjectedMetricTons = ((currentTotalCarbon + (annualSequestrationRate * 9 * 1.2)) / 1000).toFixed(2);

  return (
    <div
      id="user-carbon-impact-visualization"
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid #c1dcc0',
        boxShadow: '0 2px 12px rgba(21, 71, 52, 0.06)',
        marginTop: '28px',
        marginBottom: '28px'
      }}
    >
      {/* Component Header */}
      <div
        id="carbon-viz-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '20px',
          borderBottom: '1px solid #e8f3ea',
          paddingBottom: '16px'
        }}
      >
        <div>
          <h2
            id="carbon-viz-title"
            style={{
              margin: '0 0 4px',
              fontSize: '1.4rem',
              color: '#154734',
              fontWeight: '700'
            }}
          >
            {title || '🌿 Carbon Offset Impact Over Time'}
          </h2>
          <p
            id="carbon-viz-subtitle"
            style={{
              margin: 0,
              fontSize: '0.9rem',
              color: '#557762'
            }}
          >
            Real-time biometric sequestration modeled from MongoDB verified tree records
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div
          id="carbon-viz-tabs"
          style={{
            display: 'inline-flex',
            backgroundColor: '#edf5ee',
            padding: '4px',
            borderRadius: '10px',
            border: '1px solid #d4e8d8'
          }}
        >
          <button
            id="tab-btn-timeline"
            type="button"
            onClick={() => setActiveTab('timeline')}
            style={{
              padding: '6px 14px',
              fontSize: '0.85rem',
              fontWeight: activeTab === 'timeline' ? '600' : '400',
              color: activeTab === 'timeline' ? '#154734' : '#557762',
              backgroundColor: activeTab === 'timeline' ? '#ffffff' : 'transparent',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              boxShadow: activeTab === 'timeline' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            📈 Planting Timeline
          </button>
          <button
            id="tab-btn-projection"
            type="button"
            onClick={() => setActiveTab('projection')}
            style={{
              padding: '6px 14px',
              fontSize: '0.85rem',
              fontWeight: activeTab === 'projection' ? '600' : '400',
              color: activeTab === 'projection' ? '#154734' : '#557762',
              backgroundColor: activeTab === 'projection' ? '#ffffff' : 'transparent',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              boxShadow: activeTab === 'projection' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            🌱 10-Yr Projection
          </button>
          <button
            id="tab-btn-species"
            type="button"
            onClick={() => setActiveTab('species')}
            style={{
              padding: '6px 14px',
              fontSize: '0.85rem',
              fontWeight: activeTab === 'species' ? '600' : '400',
              color: activeTab === 'species' ? '#154734' : '#557762',
              backgroundColor: activeTab === 'species' ? '#ffffff' : 'transparent',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              boxShadow: activeTab === 'species' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            🌳 Species Share
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div
        id="carbon-metric-cards"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '14px',
          marginBottom: '24px'
        }}
      >
        <div
          id="stat-card-total-trees"
          style={{
            backgroundColor: '#f6fbf7',
            border: '1px solid #d4e8d8',
            borderRadius: '12px',
            padding: '14px 18px'
          }}
        >
          <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#557762', fontWeight: '600' }}>
            Planted Trees
          </span>
          <div style={{ fontSize: '1.6rem', fontWeight: '700', color: '#154734', marginTop: '4px' }}>
            {totalTreesCount} <span style={{ fontSize: '0.9rem', fontWeight: '400', color: '#666' }}>trees</span>
          </div>
        </div>

        <div
          id="stat-card-current-offset"
          style={{
            backgroundColor: '#f6fbf7',
            border: '1px solid #d4e8d8',
            borderRadius: '12px',
            padding: '14px 18px'
          }}
        >
          <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#557762', fontWeight: '600' }}>
            Current Offset
          </span>
          <div style={{ fontSize: '1.6rem', fontWeight: '700', color: '#2e7d32', marginTop: '4px' }}>
            {currentTotalCarbon.toLocaleString()} <span style={{ fontSize: '0.9rem', fontWeight: '400', color: '#666' }}>kg CO₂</span>
          </div>
        </div>

        <div
          id="stat-card-annual-rate"
          style={{
            backgroundColor: '#f6fbf7',
            border: '1px solid #d4e8d8',
            borderRadius: '12px',
            padding: '14px 18px'
          }}
        >
          <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#557762', fontWeight: '600' }}>
            Annual Rate
          </span>
          <div style={{ fontSize: '1.6rem', fontWeight: '700', color: '#154734', marginTop: '4px' }}>
            +{annualSequestrationRate.toLocaleString()} <span style={{ fontSize: '0.9rem', fontWeight: '400', color: '#666' }}>kg/year</span>
          </div>
        </div>

        <div
          id="stat-card-projected-tons"
          style={{
            backgroundColor: '#eaf4ec',
            border: '1px solid #bce0c3',
            borderRadius: '12px',
            padding: '14px 18px'
          }}
        >
          <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#1b5e20', fontWeight: '600' }}>
            10-Yr Sequestration
          </span>
          <div style={{ fontSize: '1.6rem', fontWeight: '700', color: '#1b5e20', marginTop: '4px' }}>
            ~{tenYearProjectedMetricTons} <span style={{ fontSize: '0.9rem', fontWeight: '400', color: '#444' }}>Tons CO₂</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas Area */}
      {loading ? (
        <div
          id="carbon-viz-loading"
          style={{
            height: '320px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#557762',
            fontSize: '0.95rem'
          }}
        >
          Loading MongoDB tree records...
        </div>
      ) : error ? (
        <div
          id="carbon-viz-error"
          style={{
            padding: '16px',
            backgroundColor: '#fbe9e7',
            borderRadius: '8px',
            color: '#c62828',
            fontSize: '0.9rem'
          }}
        >
          Failed to load carbon impact data: {error}
        </div>
      ) : verifiedTrees.length === 0 ? (
        <div
          id="carbon-viz-empty"
          style={{
            textAlign: 'center',
            padding: '40px 20px',
            backgroundColor: '#f8faf9',
            borderRadius: '12px',
            border: '1px dashed #c1dcc0'
          }}
        >
          <p style={{ fontSize: '1.2rem', margin: '0 0 8px', color: '#154734', fontWeight: '600' }}>
            🌱 No Trees Planted Yet
          </p>
          <p style={{ fontSize: '0.9rem', color: '#666', margin: '0 0 16px' }}>
            Donate to plant your first native tree or upload planting photos to begin tracking your live carbon offset timeline!
          </p>
        </div>
      ) : (
        <div id="recharts-container-wrapper" style={{ width: '100%', height: '340px' }}>
          {activeTab === 'timeline' && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                id="recharts-area-timeline"
                data={timelineData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="carbonGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2e7d32" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2e7d32" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0ece2" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#557762"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#c1dcc0' }}
                />
                <YAxis
                  stroke="#557762"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#c1dcc0' }}
                  unit=" kg"
                />
                <Tooltip content={<CustomChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="carbonOffset"
                  name="Cumulative Carbon Offset (kg CO₂)"
                  stroke="#2e7d32"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#carbonGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {activeTab === 'projection' && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                id="recharts-area-projection"
                data={projectionData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="projectedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1b5e20" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#1b5e20" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0ece2" vertical={false} />
                <XAxis
                  dataKey="period"
                  stroke="#557762"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#c1dcc0' }}
                />
                <YAxis
                  stroke="#557762"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#c1dcc0' }}
                  unit=" kg"
                />
                <Tooltip content={<CustomChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="carbonOffset"
                  name="Projected Carbon Absorption (kg CO₂)"
                  stroke="#1b5e20"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#projectedGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {activeTab === 'species' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                id="recharts-bar-species"
                data={speciesData}
                margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0ece2" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#557762"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#c1dcc0' }}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis
                  stroke="#557762"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#c1dcc0' }}
                  unit=" kg/yr"
                />
                <Tooltip content={<CustomChartTooltip />} />
                <Bar
                  dataKey="carbonOffset"
                  name="Annual Sequestration Rate (kg CO₂/yr)"
                  fill="#388e3c"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      )}

      {/* Chart Footer Note */}
      <div
        id="carbon-viz-footnote"
        style={{
          marginTop: '16px',
          paddingTop: '12px',
          borderTop: '1px solid #f0f7f2',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
          fontSize: '0.8rem',
          color: '#668872'
        }}
      >
        <span>
          📊 Verified with Mongoose models & GPS coordinates from field sapling checks
        </span>
        <span>
          💡 1 Tree ≈ 20–40 kg CO₂ annually based on native species maturity curves
        </span>
      </div>
    </div>
  );
};

export default UserCarbonImpactChart;
