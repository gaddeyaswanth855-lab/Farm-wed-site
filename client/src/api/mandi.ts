import { api } from './client';
import { MandiPrice, SchemeInfo } from '../types';

export async function fetchMandiPrices(params?: {
  commodity?: string;
  district?: string;
  state?: string;
}): Promise<MandiPrice[]> {
  const query = new URLSearchParams();
  if (params?.commodity) query.set('commodity', params.commodity);
  if (params?.district) query.set('district', params.district);
  if (params?.state) query.set('state', params.state);

  const qs = query.toString();
  return api.get<MandiPrice[]>(`/mandi/latest${qs ? `?${qs}` : ''}`);
}

export async function calculateArbitrageApi(payload: {
  commodity: string;
  quantityQuintals: number;
  localPricePerQuintal: number;
  destinationPricePerQuintal: number;
  distanceKm: number;
  destinationMarket: string;
}) {
  return api.post<any>('/mandi/arbitrage', payload);
}

export async function calculateStorageBreakevenApi(payload: {
  commodity: string;
  quantityQuintals: number;
  currentPricePerQuintal: number;
  storageMonths: number;
  isPerishable: boolean;
}) {
  return api.post<any>('/mandi/storage-breakeven', payload);
}

export async function fetchMatchedSchemes(): Promise<{
  totalPotentialBenefitsINR: number;
  matchedSchemesCount: number;
  farmerContext: any;
  schemes: SchemeInfo[];
}> {
  return api.get<any>('/schemes/match');
}
