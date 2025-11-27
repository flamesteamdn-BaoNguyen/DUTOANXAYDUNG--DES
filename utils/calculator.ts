import { InputState, CalculationResult, CostItem } from '../types';
import { TUM_COEFF } from '../constants';

export const calculateEstimate = (inputs: InputState): CalculationResult => {
  const {
    servicePrice,
    floorArea,
    floors,
    foundationCoeff,
    roofCoeff,
    basementCoeff,
    hasContingency,
    hasTum
  } = inputs;

  const foundationArea = floorArea * foundationCoeff;
  const foundationCost = foundationArea * servicePrice;

  const basementArea = floorArea * basementCoeff;
  const basementCost = basementArea * servicePrice;

  // Body area = area * number of floors
  const bodyArea = floorArea * floors;
  const bodyCost = bodyArea * servicePrice;

  const roofArea = floorArea * roofCoeff;
  const roofCost = roofArea * servicePrice;

  let tumArea = 0;
  let tumCost = 0;
  if (hasTum) {
    tumArea = floorArea * TUM_COEFF;
    tumCost = tumArea * servicePrice;
  }

  let totalCost = foundationCost + basementCost + bodyCost + roofCost + tumCost;
  let contingencyCost = 0;

  if (hasContingency) {
    contingencyCost = totalCost * 0.05;
    totalCost += contingencyCost;
  }

  const items: CostItem[] = [
    {
      name: `Phần móng (${Math.round(foundationCoeff * 100)}% diện tích)`,
      area: foundationArea,
      price: servicePrice,
      total: foundationCost,
    },
    {
      name: `Phần thân (${floors} tầng)`,
      area: bodyArea,
      price: servicePrice,
      total: bodyCost,
    },
  ];

  if (hasTum) {
    items.push({
      name: `Tầng tum (${Math.round(TUM_COEFF * 100)}% diện tích)`,
      area: tumArea,
      price: servicePrice,
      total: tumCost,
    });
  }

  items.push({
    name: `Phần mái (${Math.round(roofCoeff * 100)}% diện tích)`,
    area: roofArea,
    price: servicePrice,
    total: roofCost,
  });

  if (basementCost > 0) {
    // Insert basement after foundation
    items.splice(1, 0, {
      name: `Tầng hầm (${Math.round(basementCoeff * 100)}% diện tích)`,
      area: basementArea,
      price: servicePrice,
      total: basementCost,
    });
  }

  if (hasContingency) {
    items.push({
      name: 'Chi phí dự phòng (5%)',
      area: 0,
      price: 0,
      total: contingencyCost,
      note: '5% Tổng',
      isHighlight: true,
    });
  }

  return {
    items,
    totalCost,
    breakdown: {
      foundation: foundationCost,
      body: bodyCost + tumCost, // Group Tum into Body for simple chart, or could separate
      roof: roofCost,
      basement: basementCost,
      contingency: contingencyCost,
    },
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};