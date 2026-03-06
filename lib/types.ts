export interface Answer {
  id: string;
  text: string;
  textEn?: string;
  points: number;
  revealed: boolean;
}

export interface Question {
  id: string;
  text: string;
  textEn?: string;
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

export interface SoundSettings {
  bgmUrl: string;
  bgmVolume: number;
  correctSoundType: 'chime' | 'bell' | 'magic' | 'custom';
  wrongSoundType: 'buzzer' | 'horn' | 'custom';
  completeSoundType: 'triumphant' | 'fanfare' | 'custom';
  winSoundType: 'fanfare' | 'applause' | 'custom';
  customUrls?: {
    correct?: string;
    wrong?: string;
    complete?: string;
    win?: string;
  };
}

export interface GameState {
  programName: string;
  programTheme: string;
  programNameEn: string;
  programThemeEn: string;
  numberOfTeams: number;
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
  soundSettings?: SoundSettings;
  bgmSpeed?: number;
  bgmPlaying?: boolean;
  specialEffect?: 'confetti' | 'fireworks' | 'applause' | 'alert' | null;
  announcement?: string | null;
}
