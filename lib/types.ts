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
}

export interface Team {
  id: string;
  name: string;
  members: string[];
  score: number;
}

export interface GameState {
  teams: Team[];
  questions: Question[];
  currentQuestionIndex: number;
  strikes: number;
  tempScore: number;
  showStrike: boolean;
}
