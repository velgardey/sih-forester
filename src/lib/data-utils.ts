import { FilterState } from '@/components/map/FilterPanel';

/**
 * Filter locations based on the provided filter state
 */
export function filterLocations(locations: any[], filters: FilterState): any[] {
  let filtered = [...locations];

  // Apply state filter
  if (filters.state) {
    filtered = filtered.filter(loc => loc.state === filters.state);
  }

  // Apply district filter
  if (filters.district) {
    filtered = filtered.filter(loc => loc.district === filters.district);
  }

  // Apply village filter
  if (filters.village) {
    filtered = filtered.filter(loc => loc.villages.includes(filters.village));
  }

  // Apply tribal group filter (independent)
  if (filters.tribalGroup) {
    filtered = filtered.filter(loc => 
      loc.tribalGroups && loc.tribalGroups.includes(filters.tribalGroup)
    );
  }

  return filtered;
}

/**
 * Get aggregated statistics from filtered locations
 */
export function getAggregatedStats(locations: any[]) {
  if (locations.length === 0) {
    return null;
  }

  const totalClaims = locations.reduce((sum, loc) => sum + (loc.fraProgress?.totalClaims || 0), 0);
  const grantedClaims = locations.reduce((sum, loc) => sum + (loc.fraProgress?.grantedClaims || 0), 0);
  const pendingClaims = locations.reduce((sum, loc) => sum + (loc.fraProgress?.pendingClaims || 0), 0);
  const rejectedClaims = locations.reduce((sum, loc) => sum + (loc.fraProgress?.rejectedClaims || 0), 0);
  const totalHouseholds = locations.reduce((sum, loc) => sum + (loc.fraProgress?.households || 0), 0);

  const avgCoverage = locations.reduce((sum, loc) => sum + (loc.fraProgress?.coverage || 0), 0) / locations.length;

  // Aggregate land use data
  const totalLandUse = locations.reduce((acc, loc) => {
    if (loc.landUse) {
      acc.agriculturalLand += loc.landUse.agriculturalLand || 0;
      acc.forestCover += loc.landUse.forestCover || 0;
      acc.waterBodies += loc.landUse.waterBodies || 0;
      acc.homesteads += loc.landUse.homesteads || 0;
    }
    return acc;
  }, { agriculturalLand: 0, forestCover: 0, waterBodies: 0, homesteads: 0 });

  const avgLandUse = {
    agriculturalLand: totalLandUse.agriculturalLand / locations.length,
    forestCover: totalLandUse.forestCover / locations.length,
    waterBodies: totalLandUse.waterBodies / locations.length,
    homesteads: totalLandUse.homesteads / locations.length,
  };

  // Aggregate risk data
  const avgRisk = locations.reduce((acc, loc) => {
    if (loc.risk) {
      acc.firePercentage += loc.risk.firePercentage || 0;
      acc.biodiversityIndex += loc.risk.biodiversityIndex || 0;
      acc.endangeredSpecies += loc.risk.endangeredSpecies || 0;
    }
    return acc;
  }, { firePercentage: 0, biodiversityIndex: 0, endangeredSpecies: 0 });

  avgRisk.firePercentage /= locations.length;
  avgRisk.biodiversityIndex /= locations.length;
  avgRisk.endangeredSpecies /= locations.length;

  // Determine most common fire risk level
  const fireLevels = locations.map(loc => loc.risk?.fireLevel).filter(Boolean);
  const fireLevel = getMostCommon(fireLevels) || 'Medium';

  // Determine most common conservation status
  const conservationStatuses = locations.map(loc => loc.risk?.conservationStatus).filter(Boolean);
  const conservationStatus = getMostCommon(conservationStatuses) || 'Moderate';

  // Aggregate scheme eligibility
  const schemeEligibility = {
    pmKisan: locations.filter(loc => loc.schemes?.pmKisan).length > locations.length / 2,
    mgnrega: locations.filter(loc => loc.schemes?.mgnrega).length > locations.length / 2,
    jalJeevan: locations.filter(loc => loc.schemes?.jalJeevan).length > locations.length / 2,
    pmay: locations.filter(loc => loc.schemes?.pmay).length > locations.length / 2,
  };

  // Aggregate data layers
  const avgPmGatiShaktiScore = locations.reduce((sum, loc) => 
    sum + (loc.dataLayers?.pmGatiShaktiScore || 0), 0) / locations.length;

  const groundwaterLevels = locations.map(loc => loc.dataLayers?.groundwaterLevel).filter(Boolean);
  const groundwaterLevel = getMostCommon(groundwaterLevels) || 'Moderate';

  const classificationModels = locations.map(loc => loc.dataLayers?.classificationModel).filter(Boolean);
  const classificationModel = getMostCommon(classificationModels) || 'CNN';

  // Determine dependency and trend
  const dependencies = locations.map(loc => loc.fraProgress?.dependency).filter(Boolean);
  const dependency = getMostCommon(dependencies) || 'Medium';

  const trends = locations.map(loc => loc.fraProgress?.populationTrend).filter(Boolean);
  const populationTrend = getMostCommon(trends) || 'Stable';

  // Determine status
  const statuses = locations.map(loc => loc.fraProgress?.status).filter(Boolean);
  const status = getMostCommon(statuses) || 'Active';

  return {
    fraProgress: {
      coverage: Math.round(avgCoverage),
      totalClaims,
      grantedClaims,
      pendingClaims,
      rejectedClaims,
      households: totalHouseholds,
      status,
      dependency,
      populationTrend,
    },
    landUse: {
      agriculturalLand: Math.round(avgLandUse.agriculturalLand),
      forestCover: Math.round(avgLandUse.forestCover),
      waterBodies: Math.round(avgLandUse.waterBodies),
      homesteads: Math.round(avgLandUse.homesteads),
    },
    risk: {
      fireLevel,
      firePercentage: Math.round(avgRisk.firePercentage),
      biodiversityIndex: Math.round(avgRisk.biodiversityIndex),
      endangeredSpecies: Math.round(avgRisk.endangeredSpecies),
      conservationStatus,
    },
    schemes: schemeEligibility,
    dataLayers: {
      classificationModel,
      groundwaterLevel,
      pmGatiShaktiScore: Math.round(avgPmGatiShaktiScore),
    },
    locationCount: locations.length,
  };
}

/**
 * Helper function to get the most common value in an array
 */
function getMostCommon(arr: string[]): string | null {
  if (arr.length === 0) return null;
  
  const counts: { [key: string]: number } = {};
  arr.forEach(item => {
    counts[item] = (counts[item] || 0) + 1;
  });

  let maxCount = 0;
  let mostCommon = arr[0];
  
  Object.entries(counts).forEach(([item, count]) => {
    if (count > maxCount) {
      maxCount = count;
      mostCommon = item;
    }
  });

  return mostCommon;
}

/**
 * Check if filters are active
 */
export function hasActiveFilters(filters: FilterState): boolean {
  return !!(filters.state || filters.district || filters.village || filters.tribalGroup);
}

/**
 * Get filter summary text
 */
export function getFilterSummary(filters: FilterState): string {
  const parts: string[] = [];
  
  if (filters.village) {
    parts.push(filters.village);
  }
  if (filters.district) {
    parts.push(filters.district);
  }
  if (filters.state) {
    parts.push(filters.state);
  }
  if (filters.tribalGroup) {
    parts.push(`Tribal Group: ${filters.tribalGroup}`);
  }

  return parts.length > 0 ? parts.join(', ') : 'All Locations';
}

/**
 * Get unique states from locations
 */
export function getUniqueStates(locations: any[]): string[] {
  return Array.from(new Set(locations.map(loc => loc.state))).sort();
}

/**
 * Get districts for a specific state
 */
export function getDistrictsForState(locations: any[], state: string): string[] {
  return Array.from(
    new Set(
      locations
        .filter(loc => loc.state === state)
        .map(loc => loc.district)
    )
  ).sort();
}

/**
 * Get villages for a specific state and district
 */
export function getVillagesForDistrict(locations: any[], state: string, district: string): string[] {
  return locations
    .filter(loc => loc.state === state && loc.district === district)
    .flatMap(loc => loc.villages)
    .sort();
}

/**
 * Aggregate claim data at village level
 */
export function aggregateVillageProgress(claims: any[], village: string, district: string, state: string) {
  const villageClaims = claims.filter(
    claim => claim.village === village && claim.district === district && claim.state === state
  );

  return aggregateClaimsData(villageClaims);
}

/**
 * Aggregate claim data at block level
 */
export function aggregateBlockProgress(claims: any[], block: string, district: string, state: string) {
  const blockClaims = claims.filter(
    claim => claim.block === block && claim.district === district && claim.state === state
  );

  return aggregateClaimsData(blockClaims);
}

/**
 * Aggregate claim data at district level
 */
export function aggregateDistrictProgress(claims: any[], district: string, state: string) {
  const districtClaims = claims.filter(
    claim => claim.district === district && claim.state === state
  );

  return aggregateClaimsData(districtClaims);
}

/**
 * Aggregate claim data at state level
 */
export function aggregateStateProgress(claims: any[], state: string) {
  const stateClaims = claims.filter(claim => claim.state === state);

  return aggregateClaimsData(stateClaims);
}

/**
 * Core aggregation logic for claims data
 */
function aggregateClaimsData(claims: any[]) {
  if (claims.length === 0) {
    return {
      totalClaims: 0,
      grantedClaims: 0,
      pendingClaims: 0,
      rejectedClaims: 0,
      underReviewClaims: 0,
      coverage: 0,
      households: 0,
    };
  }

  const grantedClaims = claims.filter(c => c.status === 'Granted').length;
  const pendingClaims = claims.filter(c => c.status === 'Pending').length;
  const rejectedClaims = claims.filter(c => c.status === 'Rejected').length;
  const underReviewClaims = claims.filter(c => c.status === 'Under Review').length;
  const totalClaims = claims.length;

  const totalHouseholds = claims.reduce((sum, claim) => sum + (claim.households || 0), 0);

  // Calculate coverage as percentage of granted claims
  const coverage = totalClaims > 0 ? Math.round((grantedClaims / totalClaims) * 100) : 0;

  return {
    totalClaims,
    grantedClaims,
    pendingClaims,
    rejectedClaims,
    underReviewClaims,
    coverage,
    households: totalHouseholds,
  };
}

/**
 * Get all unique blocks for a district
 */
export function getBlocksForDistrict(claims: any[], district: string, state: string): string[] {
  return Array.from(
    new Set(
      claims
        .filter(claim => claim.district === district && claim.state === state)
        .map(claim => claim.block)
    )
  ).sort();
}

/**
 * Get all unique villages for a block
 */
export function getVillagesForBlock(claims: any[], block: string, district: string, state: string): string[] {
  return Array.from(
    new Set(
      claims
        .filter(claim => claim.block === block && claim.district === district && claim.state === state)
        .map(claim => claim.village)
    )
  ).sort();
}

/**
 * Get progress data for all blocks in a district
 */
export function getBlockProgressList(claims: any[], district: string, state: string) {
  const blocks = getBlocksForDistrict(claims, district, state);
  
  return blocks.map(block => ({
    name: block,
    level: 'block' as const,
    data: aggregateBlockProgress(claims, block, district, state),
  }));
}

/**
 * Get progress data for all districts in a state
 */
export function getDistrictProgressList(claims: any[], state: string) {
  const districts = Array.from(
    new Set(claims.filter(claim => claim.state === state).map(claim => claim.district))
  ).sort();
  
  return districts.map(district => ({
    name: district,
    level: 'district' as const,
    data: aggregateDistrictProgress(claims, district, state),
  }));
}

/**
 * Get progress data for all states
 */
export function getStateProgressList(claims: any[]) {
  const states = Array.from(new Set(claims.map(claim => claim.state))).sort();
  
  return states.map(state => ({
    name: state,
    level: 'state' as const,
    data: aggregateStateProgress(claims, state),
  }));
}

/**
 * Get hierarchical progress data based on filter level
 */
export function getHierarchicalProgress(
  claims: any[],
  filters: { state?: string; district?: string; block?: string; village?: string }
) {
  // Village level - most specific
  if (filters.village && filters.block && filters.district && filters.state) {
    return {
      level: 'village' as const,
      name: filters.village,
      data: aggregateVillageProgress(claims, filters.village, filters.district, filters.state),
    };
  }

  // Block level
  if (filters.block && filters.district && filters.state) {
    return {
      level: 'block' as const,
      name: filters.block,
      data: aggregateBlockProgress(claims, filters.block, filters.district, filters.state),
      children: getVillagesForBlock(claims, filters.block, filters.district, filters.state).map(village => ({
        name: village,
        level: 'village' as const,
        data: aggregateVillageProgress(claims, village, filters.district!, filters.state!),
      })),
    };
  }

  // District level
  if (filters.district && filters.state) {
    return {
      level: 'district' as const,
      name: filters.district,
      data: aggregateDistrictProgress(claims, filters.district, filters.state),
      children: getBlockProgressList(claims, filters.district, filters.state),
    };
  }

  // State level
  if (filters.state) {
    return {
      level: 'state' as const,
      name: filters.state,
      data: aggregateStateProgress(claims, filters.state),
      children: getDistrictProgressList(claims, filters.state),
    };
  }

  // National level - all states
  return {
    level: 'national' as const,
    name: 'All India',
    data: aggregateClaimsData(claims),
    children: getStateProgressList(claims),
  };
}
