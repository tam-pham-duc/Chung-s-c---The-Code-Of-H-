import Leaderboard from '@/components/Leaderboard';
import { GameProvider } from '@/components/GameProvider';

export default function LeaderboardPage() {
  return (
    <GameProvider>
      <Leaderboard />
    </GameProvider>
  );
}
