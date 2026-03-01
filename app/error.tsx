'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-950 text-white">
      <h2 className="text-4xl font-bold mb-4">Đã xảy ra lỗi!</h2>
      <button
        onClick={() => reset()}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold transition-colors"
      >
        Thử lại
      </button>
    </div>
  );
}
