export type WorldCup2026Result = {
  id: number;
  homeTeam: string;
  awayTeam: string;
  matchDate?: string | null;
  stage: string;
  groupName?: string | null;
  stadium?: string | null;
  city?: string | null;
  sourceMatchId?: string | null;
  finished: boolean;
  homeScore: number;
  awayScore: number;
  note?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type WorldCup2026ResultPayload = {
  homeTeam: string;
  awayTeam: string;
  matchDate?: string | null;
  stage: string;
  groupName?: string;
  stadium?: string;
  city?: string;
  finished?: boolean;
  homeScore: number;
  awayScore: number;
  note?: string;
};
