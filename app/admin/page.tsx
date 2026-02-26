import AdminPanel from '@/components/AdminPanel';
import { GameProvider } from '@/components/GameProvider';

export default function AdminPage() {
  return (
    <GameProvider>
      <AdminPanel />
    </GameProvider>
  );
}
