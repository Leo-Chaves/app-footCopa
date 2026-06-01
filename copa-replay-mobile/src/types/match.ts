import { Team } from "./team";
import { WorldCup } from "./worldCup";

export type Match = {
  id: number;
  worldCup: WorldCup;
  homeTeam: Team;
  awayTeam: Team;
  matchDate?: string | null;
  stage: string;
  groupName?: string | null;
  stadium?: string | null;
  city?: string | null;
  homeScore?: number | null;
  awayScore?: number | null;
  sourceMatchId?: string | null;
};
