export interface Slide {
  id: number;
  title: string;
  subtitle?: string;
  points?: string[];
  illustrationType: 'cover' | 'goals' | 'story' | 'idea' | 'survey' | 'capital' | 'pricing' | 'table' | 'revenue' | 'expenses' | 'balance' | 'full_example' | 'steps' | 'tips' | 'ledger' | 'challenge' | 'projects' | 'solutions' | 'homework' | 'summary';
  interactiveData?: any;
}

export interface MaterialCostItem {
  id: string;
  name: string;
  cost: number;
}

export interface StudentProject {
  name: string;
  idea: string;
  category: string;
  targetPrice: number;
  materials: MaterialCostItem[];
  votedPrice: number;
  votedInterest: number; // 0-5 people interest
  daysPlayed: number;
}

export interface DailyLedgerRecord {
  id: string;
  day: string;
  product: string;
  revenue: number;
  expenses: number;
  profit: number;
  note?: string;
}

export interface SimulationResult {
  day: number;
  event: string;
  eventType: 'neutral' | 'positive' | 'negative';
  soldUnits: number;
  pricePerUnit: number;
  revenue: number;
  expenses: number;
  profit: number;
  balanceAfter: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  unlocked: boolean;
}
