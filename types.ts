
export enum ServiceType {
  RAW_AND_FINISH = 3200000,
  TURNKEY = 5500000,
}

export interface InputState {
  servicePrice: number;
  floorArea: number;
  floors: number;
  foundationCoeff: number;
  roofCoeff: number;
  basementCoeff: number;
  hasContingency: boolean;
  hasTum: boolean;
  customerName: string;
  email: string;
  zaloNumber: string;
}

export interface CostItem {
  name: string;
  area: number;
  price: number;
  total: number;
  note?: string;
  isHighlight?: boolean;
}

export interface CalculationResult {
  items: CostItem[];
  totalCost: number;
  breakdown: {
    foundation: number;
    body: number;
    roof: number;
    basement: number;
    contingency: number;
  };
}

export interface SelectOption {
  label: string;
  value: number;
  tooltip?: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
}
