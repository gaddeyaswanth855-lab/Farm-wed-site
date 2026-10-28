import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { env } from './env.js';

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Interface for DB results matching node-postgres
export interface QueryResult<T = any> {
  rows: T[];
  rowCount: number;
}

let pool: pg.Pool | null = null;
let useLocalStore = true;

const LOCAL_DB_PATH = path.resolve(__dirname, '../../kisanseva_local.json');

// Memory/File DB Store structure
interface LocalDatabase {
  users: any[];
  plots: any[];
  crop_advisories: any[];
  pest_diagnoses: any[];
  fertilizer_plans: any[];
  mandi_prices: any[];
  chat_messages: any[];
}

let localDb: LocalDatabase = {
  users: [],
  plots: [],
  crop_advisories: [],
  pest_diagnoses: [],
  fertilizer_plans: [],
  mandi_prices: [],
  chat_messages: []
};

// Seed initial data for local store
function seedInitialData() {
  const defaultUserId = 'e2b34a15-0819-4a94-984e-3755c91b1001';
  
  localDb.users = [
    {
      id: defaultUserId,
      full_name: 'Rameshwar "Ramesh" Patil',
      phone_number: '9876543210',
      state: 'Maharashtra',
      district: 'Ahmednagar',
      taluka_block: 'Rahata',
      preferred_language: 'en',
      total_land_acres: 7.5,
      created_at: new Date('2026-01-15T08:00:00Z').toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  const plot1Id = '11111111-1111-4111-a111-111111111111';
  const plot2Id = '22222222-2222-4222-a222-222222222222';
  const plot3Id = '33333333-3333-4333-a333-333333333333';

  localDb.plots = [
    {
      id: plot1Id,
      user_id: defaultUserId,
      plot_name: 'North Well Field',
      size_acres: 3.0,
      irrigation_type: 'drip',
      soil_type: 'black_cotton',
      organic_carbon_status: 'low',
      soil_ph: 7.8,
      current_crop: 'Cotton (Bt Hybrid)',
      sowing_date: '2026-06-25',
      created_at: new Date('2026-01-20T10:00:00Z').toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: plot2Id,
      user_id: defaultUserId,
      plot_name: 'Canal Basin Parcel',
      size_acres: 2.5,
      irrigation_type: 'canal',
      soil_type: 'alluvial',
      organic_carbon_status: 'medium',
      soil_ph: 7.2,
      current_crop: 'Soybean (JS-335)',
      sowing_date: '2026-07-02',
      created_at: new Date('2026-01-20T10:30:00Z').toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: plot3Id,
      user_id: defaultUserId,
      plot_name: 'Upland Rainfed Ridge',
      size_acres: 2.0,
      irrigation_type: 'rainfed',
      soil_type: 'red_sandy',
      organic_carbon_status: 'low',
      soil_ph: 6.8,
      current_crop: 'Pearl Millet (Bajra)',
      sowing_date: '2026-07-10',
      created_at: new Date('2026-02-01T09:15:00Z').toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  // Mandi Rates
  localDb.mandi_prices = [
    {
      id: uuidv4(),
      market_name: 'Lasalgaon APMC',
      district: 'Nashik',
      state: 'Maharashtra',
      commodity: 'Onion',
      variety: 'Red Nashik Medium',
      min_price: 1850.00,
      max_price: 2450.00,
      modal_price: 2200.00,
      price_date: '2026-10-28',
      created_at: new Date().toISOString()
    },
    {
      id: uuidv4(),
      market_name: 'Pimpalgaon Baswant APMC',
      district: 'Nashik',
      state: 'Maharashtra',
      commodity: 'Tomato',
      variety: 'Hybrid Hybrid-Red',
      min_price: 1200.00,
      max_price: 1950.00,
      modal_price: 1650.00,
      price_date: '2026-10-28',
      created_at: new Date().toISOString()
    },
    {
      id: uuidv4(),
      market_name: 'Ahmednagar Market Yard',
      district: 'Ahmednagar',
      state: 'Maharashtra',
      commodity: 'Cotton',
      variety: 'Medium Staple',
      min_price: 7100.00,
      max_price: 7750.00,
      modal_price: 7450.00,
      price_date: '2026-10-28',
      created_at: new Date().toISOString()
    },
    {
      id: uuidv4(),
      market_name: 'Guntur Mirchi Yard',
      district: 'Guntur',
      state: 'Andhra Pradesh',
      commodity: 'Red Chilli',
      variety: 'Teja S17 Best',
      min_price: 16500.00,
      max_price: 19800.00,
      modal_price: 18200.00,
      price_date: '2026-10-28',
      created_at: new Date().toISOString()
    },
    {
      id: uuidv4(),
      market_name: 'Indore Mandi',
      district: 'Indore',
      state: 'Madhya Pradesh',
      commodity: 'Soybean',
      variety: 'Yellow Standard',
      min_price: 4350.00,
      max_price: 4890.00,
      modal_price: 4680.00,
      price_date: '2026-10-28',
      created_at: new Date().toISOString()
    },
    {
      id: uuidv4(),
      market_name: 'Karnal Grain Market',
      district: 'Karnal',
      state: 'Haryana',
      commodity: 'Paddy',
      variety: 'Basmati 1121 Pusa',
      min_price: 3600.00,
      max_price: 4300.00,
      modal_price: 3950.00,
      price_date: '2026-10-28',
      created_at: new Date().toISOString()
    },
    {
      id: uuidv4(),
      market_name: 'Nagpur APMC',
      district: 'Nagpur',
      state: 'Maharashtra',
      commodity: 'Orange',
      variety: 'Nagpur Mandarin Grade A',
      min_price: 3800.00,
      max_price: 5200.00,
      modal_price: 4500.00,
      price_date: '2026-10-28',
      created_at: new Date().toISOString()
    },
    {
      id: uuidv4(),
      market_name: 'Rajkot APMC',
      district: 'Rajkot',
      state: 'Gujarat',
      commodity: 'Groundnut',
      variety: 'Bold G-20',
      min_price: 6100.00,
      max_price: 6780.00,
      modal_price: 6450.00,
      price_date: '2026-10-28',
      created_at: new Date().toISOString()
    }
  ];

  // Sample Past Diagnostic
  localDb.pest_diagnoses = [
    {
      id: uuidv4(),
      user_id: defaultUserId,
      plot_id: plot1Id,
      crop_name: 'Cotton',
      symptoms_text: 'Upward leaf curling, yellowing along leaf margins, honeydew secretion and sooty mold spots.',
      image_url: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=600&q=80',
      diagnosis_name: 'Cotton Whitefly & Cotton Leaf Curl Virus (CLCuV)',
      pathogen_type: 'pest_insect',
      severity_level: 'moderate',
      organic_remedies: [
        {
          method: 'Neem Seed Kernel Extract (NSKE 5%)',
          preparation: 'Pound 50g neem seed powder, soak overnight in 1L water, filter through muslin cloth, add 1ml liquid soap.',
          applicationTiming: 'Early morning or late evening spray, every 7 days until nymphs subside.'
        },
        {
          method: 'Yellow Sticky Pheromone Traps',
          preparation: 'Install bright yellow plastic cards coated with castor oil or sticky polybutene.',
          applicationTiming: 'Erect 8 to 10 traps per acre at canopy level.'
        }
      ],
      chemicalRemedies: [
        {
          activeChemicalName: 'Diafenthiuron 50% WP',
          dosagePerLiterWater: '1.2 grams per Liter of water',
          safetyWaitingPeriodDays: 21,
          applicationCaution: 'Target undersides of foliage. Do not spray during peak honeybee foraging hours (9 AM - 12 PM).'
        }
      ],
      prevention_tips: [
        'Avoid excessive synthetic Nitrogen fertilizer which promotes succulent leaf growth preferred by sucking pests.',
        'Sow border rows of Maize or Pearl Millet (Bajra) to act as biological barrier.'
      ],
      created_at: new Date('2026-10-20T11:20:00Z').toISOString()
    }
  ];

  // Sample Advisory
  localDb.crop_advisories = [
    {
      id: uuidv4(),
      user_id: defaultUserId,
      plot_id: plot1Id,
      season: 'Kharif',
      recommended_crops: [
        {
          cropName: 'Cotton (High-Density Planting) + Pigeonpea (Arhar)',
          varietyRecommended: 'Ajeet-155 / PKV-081',
          croppingPattern: 'Intercropping (6:1 row ratio)',
          durationDays: 160,
          seedRequirementPerAcre: '2.5 kg Cotton + 1.5 kg Arhar',
          irrigationRequirementLevel: 'Medium',
          estimatedCostPerAcreINR: 24500,
          projectedYieldQuintalsPerAcre: 9.5,
          estimatedNetProfitINR: 46275,
          resilienceFeatures: 'Pigeonpea fixes atmospheric nitrogen and acts as drought buffer against late monsoon withdrawal.',
          keyRisks: ['Pink Bollworm infestation post day 70', 'Waterlogging in deep black soils']
        }
      ],
      waterBudgetingNote: 'Requires 450-550mm effective moisture. Drip fertigation saves 42% water compared to furrow flooding.',
      total_estimated_cost: 73500.00,
      expected_net_margin: 138825.00,
      climate_risk_score: 4,
      ai_raw_response: {},
      created_at: new Date('2026-06-15T09:00:00Z').toISOString()
    }
  ];

  saveLocalDb();
}

function loadLocalDb() {
  if (fs.existsSync(LOCAL_DB_PATH)) {
    try {
      const data = fs.readFileSync(LOCAL_DB_PATH, 'utf-8');
      localDb = JSON.parse(data);
    } catch (e) {
      console.error('Error reading local db, reseeding...', e);
      seedInitialData();
    }
  } else {
    seedInitialData();
  }
}

function saveLocalDb() {
  try {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(localDb, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write local database file:', err);
  }
}

// Initialize DB connection
export async function initDb() {
  if (env.DATABASE_URL && env.DATABASE_URL.trim() !== '') {
    if (env.DATABASE_URL.startsWith('postgres://') || env.DATABASE_URL.startsWith('postgresql://')) {
      try {
        pool = new Pool({
          connectionString: env.DATABASE_URL,
          ssl: env.PGSSLMODE === 'require' ? { rejectUnauthorized: false } : false,
          connectionTimeoutMillis: 4000
        });
        const res = await pool.query('SELECT NOW()');
        console.log('✅ Connected to PostgreSQL database at:', res.rows[0].now);
        useLocalStore = false;
        await runPostgresMigrations();
        return;
      } catch (err) {
        console.warn('⚠️ Could not connect to PostgreSQL. Falling back to robust Local File Database.', err);
        useLocalStore = true;
      }
    } else {
      console.warn('ℹ️ DATABASE_URL is an HTTP/project endpoint, not a direct postgresql:// connection string. Utilizing Embedded Local File Database.');
      useLocalStore = true;
    }
  }

  loadLocalDb();
  console.log('🌾 KisanSeva Embedded Agronomic DB initialized successfully with pre-seeded data.');
}

async function runPostgresMigrations() {
  if (!pool) return;
  const sql = `
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        full_name VARCHAR(100) NOT NULL,
        phone_number VARCHAR(15) UNIQUE NOT NULL,
        state VARCHAR(50) NOT NULL,
        district VARCHAR(50) NOT NULL,
        taluka_block VARCHAR(50),
        preferred_language VARCHAR(10) DEFAULT 'en',
        total_land_acres NUMERIC(6, 2) NOT NULL DEFAULT 0.00,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS plots (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        plot_name VARCHAR(50) NOT NULL,
        size_acres NUMERIC(5, 2) NOT NULL,
        irrigation_type VARCHAR(50) NOT NULL,
        soil_type VARCHAR(50) NOT NULL,
        organic_carbon_status VARCHAR(20) DEFAULT 'medium',
        soil_ph NUMERIC(3, 1) DEFAULT 7.0,
        current_crop VARCHAR(50),
        sowing_date DATE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS crop_advisories (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        plot_id UUID REFERENCES plots(id) ON DELETE SET NULL,
        season VARCHAR(20) NOT NULL,
        recommended_crops JSONB NOT NULL,
        water_budget_analysis JSONB NOT NULL,
        total_estimated_cost NUMERIC(10, 2),
        expected_net_margin NUMERIC(10, 2),
        climate_risk_score INTEGER CHECK (climate_risk_score BETWEEN 1 AND 10),
        ai_raw_response JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS pest_diagnoses (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        plot_id UUID REFERENCES plots(id) ON DELETE SET NULL,
        crop_name VARCHAR(50) NOT NULL,
        symptoms_text TEXT NOT NULL,
        image_url TEXT,
        diagnosis_name VARCHAR(100) NOT NULL,
        pathogen_type VARCHAR(30) NOT NULL,
        severity_level VARCHAR(20) NOT NULL,
        organic_remedies JSONB NOT NULL,
        chemical_remedies JSONB NOT NULL,
        prevention_tips JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS fertilizer_plans (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        plot_id UUID NOT NULL REFERENCES plots(id) ON DELETE CASCADE,
        target_crop VARCHAR(50) NOT NULL,
        target_yield_quintals NUMERIC(6, 2),
        fertilizer_schedule JSONB NOT NULL,
        organic_carbon_amendments JSONB NOT NULL,
        estimated_input_cost NUMERIC(10, 2),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS mandi_prices (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        market_name VARCHAR(100) NOT NULL,
        district VARCHAR(50) NOT NULL,
        state VARCHAR(50) NOT NULL,
        commodity VARCHAR(50) NOT NULL,
        variety VARCHAR(50),
        min_price NUMERIC(8, 2) NOT NULL,
        max_price NUMERIC(8, 2) NOT NULL,
        modal_price NUMERIC(8, 2) NOT NULL,
        price_date DATE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS chat_messages (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        sender VARCHAR(10) NOT NULL CHECK (sender IN ('user', 'assistant')),
        message_text TEXT NOT NULL,
        distress_flag BOOLEAN DEFAULT FALSE,
        actionable_payload JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(sql);
}

// Unified query runner with PostgreSQL syntax and fallback support
export async function query<T = any>(sql: string, params: any[] = []): Promise<QueryResult<T>> {
  if (!useLocalStore && pool) {
    const res = await pool.query(sql, params);
    return { rows: res.rows, rowCount: res.rowCount || res.rows.length };
  }

  // Local JSON engine emulator
  return executeLocalQuery<T>(sql, params);
}

function executeLocalQuery<T = any>(sql: string, params: any[] = []): QueryResult<T> {
  const cleanSql = sql.trim();
  const normalized = cleanSql.toLowerCase();

  // Route queries based on table
  if (normalized.startsWith('select')) {
    return handleSelectQuery<T>(cleanSql, params);
  } else if (normalized.startsWith('insert into')) {
    return handleInsertQuery<T>(cleanSql, params);
  } else if (normalized.startsWith('update')) {
    return handleUpdateQuery<T>(cleanSql, params);
  } else if (normalized.startsWith('delete from')) {
    return handleDeleteQuery<T>(cleanSql, params);
  }

  return { rows: [], rowCount: 0 };
}

function getTableName(sql: string): keyof LocalDatabase | null {
  const match = sql.match(/(?:from|into|update)\s+([a-zA-Z0-9_]+)/i);
  if (!match) return null;
  const name = match[1].toLowerCase() as keyof LocalDatabase;
  return localDb[name] ? name : null;
}

function handleSelectQuery<T>(sql: string, params: any[]): QueryResult<T> {
  const table = getTableName(sql);
  if (!table) return { rows: [], rowCount: 0 };

  let rows = [...localDb[table]];

  // Simple WHERE condition filtering
  if (/where/i.test(sql)) {
    const whereClause = sql.split(/where/i)[1].split(/order by|limit/i)[0];
    
    // Check user_id
    if (whereClause.includes('user_id = $') || whereClause.includes('user_id =')) {
      const paramIndexMatch = whereClause.match(/user_id\s*=\s*\$(\d+)/);
      if (paramIndexMatch) {
        const idx = parseInt(paramIndexMatch[1], 10) - 1;
        const targetUserId = params[idx];
        rows = rows.filter(r => r.user_id === targetUserId);
      }
    }

    // Check id
    if (whereClause.includes('id = $') || whereClause.includes('id =')) {
      const paramIndexMatch = whereClause.match(/\bid\s*=\s*\$(\d+)/);
      if (paramIndexMatch) {
        const idx = parseInt(paramIndexMatch[1], 10) - 1;
        const targetId = params[idx];
        rows = rows.filter(r => r.id === targetId);
      }
    }

    // Check commodity
    if (whereClause.includes('commodity')) {
      const match = whereClause.match(/commodity\s*ILIKE\s*\$(\d+)/i) || whereClause.match(/commodity\s*=\s*\$(\d+)/i);
      if (match) {
        const idx = parseInt(match[1], 10) - 1;
        const val = String(params[idx] || '').replace(/%/g, '').toLowerCase();
        if (val) {
          rows = rows.filter(r => r.commodity && r.commodity.toLowerCase().includes(val));
        }
      }
    }

    // Check district
    if (whereClause.includes('district')) {
      const match = whereClause.match(/district\s*ILIKE\s*\$(\d+)/i) || whereClause.match(/district\s*=\s*\$(\d+)/i);
      if (match) {
        const idx = parseInt(match[1], 10) - 1;
        const val = String(params[idx] || '').replace(/%/g, '').toLowerCase();
        if (val) {
          rows = rows.filter(r => r.district && r.district.toLowerCase().includes(val));
        }
      }
    }
  }

  // Handle ORDER BY created_at DESC / ASC
  if (/order by created_at desc/i.test(sql)) {
    rows.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  } else if (/order by created_at asc/i.test(sql)) {
    rows.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }

  // Handle LIMIT
  const limitMatch = sql.match(/limit\s+(\d+)/i);
  if (limitMatch) {
    const limitNum = parseInt(limitMatch[1], 10);
    rows = rows.slice(0, limitNum);
  }

  return { rows: rows as unknown as T[], rowCount: rows.length };
}

function handleInsertQuery<T>(sql: string, params: any[]): QueryResult<T> {
  const table = getTableName(sql);
  if (!table) return { rows: [], rowCount: 0 };

  // Parse columns
  const colMatch = sql.match(/\((.*?)\)\s+values/i);
  if (!colMatch) return { rows: [], rowCount: 0 };

  const columns = colMatch[1].split(',').map(c => c.trim());
  const newRow: any = { id: uuidv4(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() };

  columns.forEach((col, idx) => {
    newRow[col] = params[idx];
  });

  if (!newRow.id || newRow.id === undefined) {
    newRow.id = uuidv4();
  }

  localDb[table].unshift(newRow);
  saveLocalDb();

  return { rows: [newRow as unknown as T], rowCount: 1 };
}

function handleUpdateQuery<T>(sql: string, params: any[]): QueryResult<T> {
  const table = getTableName(sql);
  if (!table) return { rows: [], rowCount: 0 };

  const idMatch = sql.match(/where\s+.*id\s*=\s*\$(\d+)/i);
  if (!idMatch) return { rows: [], rowCount: 0 };

  const idIdx = parseInt(idMatch[1], 10) - 1;
  const targetId = params[idIdx];

  const rowIndex = localDb[table].findIndex(r => r.id === targetId);
  if (rowIndex === -1) return { rows: [], rowCount: 0 };

  // Update fields
  const updatedRow = { ...localDb[table][rowIndex], updated_at: new Date().toISOString() };
  localDb[table][rowIndex] = updatedRow;
  saveLocalDb();

  return { rows: [updatedRow as unknown as T], rowCount: 1 };
}

function handleDeleteQuery<T>(sql: string, params: any[]): QueryResult<T> {
  const table = getTableName(sql);
  if (!table) return { rows: [], rowCount: 0 };

  const idMatch = sql.match(/where\s+.*id\s*=\s*\$(\d+)/i);
  if (!idMatch) return { rows: [], rowCount: 0 };

  const idIdx = parseInt(idMatch[1], 10) - 1;
  const targetId = params[idIdx];

  const initialLength = localDb[table].length;
  localDb[table] = localDb[table].filter(r => r.id !== targetId);
  saveLocalDb();

  return { rows: [], rowCount: initialLength - localDb[table].length };
}

export const db = {
  query,
  init: initDb
};

export default db;
