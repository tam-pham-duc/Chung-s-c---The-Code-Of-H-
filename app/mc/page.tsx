import MCPanel from '@/components/MCPanel';
import { GameProvider } from '@/components/GameProvider';

export default function MCPage() {
  return (
    <GameProvider>
      <MCPanel />
    </GameProvider>
  );
}
