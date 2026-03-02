export interface Answer {
  id: string;
  text: string;
  points: number;
  revealed: boolean;
}

export interface Question {
  id: string;
  text: string;
  answers: Answer[];
  multiplier: number;
  round: number;
  isSuddenDeath?: boolean;
  timeLimit?: number;
}

export interface Team {
  id: string;
  name: string;
  members: string[];
  score: number;
}

export interface GameState {
  programName: string;
  programTheme: string;
  programNameEn: string;
  programThemeEn: string;
  teams: Team[];
  questions: Question[];
  currentQuestionIndex: number;
  strikes: number;
  tempScore: number;
  showStrike: boolean;
  controllingTeamId?: string | null;
  stealingTeamId?: string | null;
  isStealing?: boolean;
  timerDuration: number;
  timerStartedAt: number | null;
  showTimer: boolean;
}
