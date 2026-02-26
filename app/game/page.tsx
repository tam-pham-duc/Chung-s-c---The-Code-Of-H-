import GameBoard from '@/components/GameBoard';
import { GameProvider } from '@/components/GameProvider';

export default function GamePage() {
  return (
    <GameProvider>
      <GameBoard />
    </GameProvider>
  );
}
