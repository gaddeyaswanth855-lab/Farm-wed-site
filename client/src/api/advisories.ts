import { api } from './client';
import { CropAdvisory, PestDiagnosis, FertilizerPlan } from '../types';

export async function generateCropPlanApi(payload: any): Promise<CropAdvisory> {
  return api.post<CropAdvisory>('/advisories/crop-plan', payload);
}

export async function fetchAdvisoryHistory(): Promise<CropAdvisory[]> {
  return api.get<CropAdvisory[]>('/advisories/history');
}

export async function diagnosePestApi(payload: {
  plotId?: string;
  cropName: string;
  plantPart: string[];
  symptomsText: string;
  imageBase64?: string;
}): Promise<PestDiagnosis> {
  return api.post<PestDiagnosis>('/pest/diagnose', payload);
}

export async function fetchPestHistory(): Promise<PestDiagnosis[]> {
  return api.get<PestDiagnosis[]>('/pest/history');
}

export async function calculateFertilizerPlanApi(payload: any): Promise<FertilizerPlan> {
  return api.post<FertilizerPlan>('/soil/fertilizer-plan', payload);
}
