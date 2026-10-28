import { z } from 'zod';

export const userRegistrationSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100),
  phoneNumber: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian mobile phone number"),
  state: z.string().min(2),
  district: z.string().min(2),
  talukaBlock: z.string().optional(),
  preferredLanguage: z.enum(['en', 'hi', 'mr', 'te', 'ta', 'kn']).default('en'),
  totalLandAcres: z.number().nonnegative().max(1000)
});

export const createPlotSchema = z.object({
  plotName: z.string().min(1, "Plot name is required").max(50),
  sizeAcres: z.number().positive("Size must be greater than 0").max(500),
  irrigationType: z.enum(['rainfed', 'borewell', 'canal', 'drip', 'open_well']),
  soilType: z.enum(['black_cotton', 'alluvial', 'red_sandy', 'laterite', 'clay', 'saline']),
  organicCarbonStatus: z.enum(['low', 'medium', 'high']).default('medium'),
  soilPh: z.number().min(3.0).max(11.0).default(7.0),
  currentCrop: z.string().optional(),
  sowingDate: z.string().optional()
});

export const cropPlanRequestSchema = z.object({
  plotId: z.string().uuid().optional(),
  state: z.string().min(2),
  district: z.string().min(2),
  season: z.enum(['Kharif', 'Rabi', 'Zaid']),
  sizeAcres: z.number().positive(),
  soilType: z.string(),
  organicCarbon: z.string(),
  irrigation: z.string(),
  budgetInr: z.number().nonnegative(),
  laborAvailability: z.enum(['Family Only', 'Moderate Hired', 'Severe Shortage'])
});

export const pestDiagnosisRequestSchema = z.object({
  plotId: z.string().uuid().optional(),
  cropName: z.string().min(2),
  plantPart: z.array(z.string()).nonempty("Select at least one affected plant part"),
  symptomsText: z.string().min(5, "Please describe observed signs in at least 5 characters"),
  imageBase64: z.string().optional()
});

export const fertilizerPlanSchema = z.object({
  plotId: z.string().uuid().optional(),
  targetCrop: z.string().min(2, "Target crop is required"),
  sizeAcres: z.number().positive(),
  nitrogenRating: z.enum(['Low', 'Medium', 'High']).default('Low'),
  phosphorusRating: z.enum(['Low', 'Medium', 'High']).default('Medium'),
  potassiumRating: z.enum(['Low', 'Medium', 'High']).default('Medium'),
  organicCarbonStatus: z.enum(['low', 'medium', 'high']).default('low'),
  soilPh: z.number().min(3.0).max(11.0).default(7.5),
  targetYieldQuintals: z.number().positive().optional()
});

export const chatMessageSchema = z.object({
  messageText: z.string().min(1, "Message cannot be empty").max(1000),
  currentPlotId: z.string().uuid().optional()
});
