import { GameState } from './types';

export const defaultGameState: GameState = {
  teams: [
    { id: 'team1', name: 'Đội 1', members: ['Đội trưởng 1', 'Thành viên 2', 'Thành viên 3', 'Thành viên 4'], score: 0 },
    { id: 'team2', name: 'Đội 2', members: ['Đội trưởng 2', 'Thành viên 2', 'Thành viên 3', 'Thành viên 4'], score: 0 },
  ],
  questions: [
    {
      id: 'q1',
      text: 'Đâu là món quà 8/3 mà chị em phụ nữ mong muốn nhận được nhất?',
      round: 1,
      multiplier: 1,
      answers: [
        { id: 'a1', text: 'Hoa tươi', points: 35, revealed: false },
        { id: 'a2', text: 'Trang sức', points: 25, revealed: false },
        { id: 'a3', text: 'Mỹ phẩm', points: 20, revealed: false },
        { id: 'a4', text: 'Tiền mặt / Chuyển khoản', points: 15, revealed: false },
        { id: 'a5', text: 'Đồ công nghệ', points: 5, revealed: false },
      ]
    },
    {
      id: 'q2',
      text: 'Đặc điểm nào ở nam giới thu hút phái đẹp nhất từ cái nhìn đầu tiên?',
      round: 1,
      multiplier: 1,
      answers: [
        { id: 'b1', text: 'Nụ cười', points: 40, revealed: false },
        { id: 'b2', text: 'Ánh mắt', points: 30, revealed: false },
        { id: 'b3', text: 'Sự gọn gàng, sạch sẽ', points: 15, revealed: false },
        { id: 'b4', text: 'Giọng nói', points: 10, revealed: false },
        { id: 'b5', text: 'Chiều cao', points: 5, revealed: false },
      ]
    }
  ],
  currentQuestionIndex: 0,
  strikes: 0,
  tempScore: 0,
  showStrike: false,
  settings: {
    enableQuestionZoom: true,
    questionZoomIntensity: 0.5,
    enableSoundEffects: true,
    soundVolume: 0.7,
    enableScoreAnimations: true,
    scoreAnimationIntensity: 0.5,
  },
};
