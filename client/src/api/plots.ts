import { api } from './client';
import { Plot } from '../types';

export async function fetchPlots(): Promise<Plot[]> {
  return api.get<Plot[]>('/plots');
}

export async function createPlotApi(data: any): Promise<Plot> {
  return api.post<Plot>('/plots', data);
}

export async function deletePlotApi(id: string): Promise<{ message: string; id: string }> {
  return api.delete<{ message: string; id: string }>(`/plots/${id}`);
}

export async function fetchUserProfile(): Promise<any> {
  return api.get<any>('/users/me');
}
