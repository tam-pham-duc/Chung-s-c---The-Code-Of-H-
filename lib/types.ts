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

export interface EffectSettings {
  enableQuestionZoom: boolean;
  questionZoomIntensity: number; // 0 to 1
  enableSoundEffects: boolean;
  soundVolume: number; // 0 to 1
  enableScoreAnimations: boolean;
  scoreAnimationIntensity: number; // 0 to 1
}

export interface GameState {
  teams: Team[];
  questions: Question[];
  currentQuestionIndex: number;
  strikes: number;
  tempScore: number;
  showStrike: boolean;
  settings: EffectSettings;
}
