export interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ZakatRecord {
  id: string;
  userId: string;
  year: number;
  goldValue: number;
  silverValue: number;
  cashValue: number;
  stocksValue: number;
  totalAssets: number;
  nisabValue: number;
  zakatAmount: number;
  currency: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ZakatCalculationInput {
  goldValue: number;
  silverValue: number;
  cashValue: number;
  stocksValue: number;
  nisabValue: number;
  year: number;
  currency?: string;
  notes?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
