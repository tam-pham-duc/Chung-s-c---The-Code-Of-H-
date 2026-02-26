'use client';

import React from 'react';
import Link from 'next/link';
import { Settings, MonitorPlay, Trophy } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-900 to-blue-950 p-6 font-sans">
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-7xl font-black text-yellow-400 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] tracking-wider uppercase mb-4">
          CHUNG SỨC
        </h1>
        <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-md">
          Giải Mã Phái Đẹp - The Code Of Her
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {/* Game Board Link */}
        <Link href="/game" target="_blank" className="group flex flex-col items-center justify-center p-8 bg-blue-800/50 hover:bg-blue-700/80 border-2 border-blue-400/50 hover:border-blue-300 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-2">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <MonitorPlay className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Màn Hình Chính</h3>
          <p className="text-blue-200 text-center text-sm">Hiển thị câu hỏi và đáp án cho khán giả (Mở ở cửa sổ/màn hình riêng)</p>
        </Link>

        {/* Leaderboard Link */}
        <Link href="/leaderboard" target="_blank" className="group flex flex-col items-center justify-center p-8 bg-purple-800/50 hover:bg-purple-700/80 border-2 border-purple-400/50 hover:border-purple-300 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-2">
          <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Bảng Xếp Hạng</h3>
          <p className="text-purple-200 text-center text-sm">Hiển thị điểm số và thứ hạng các đội (Mở ở cửa sổ/màn hình riêng)</p>
        </Link>

        {/* Admin Link */}
        <Link href="/admin" target="_blank" className="group flex flex-col items-center justify-center p-8 bg-slate-800/50 hover:bg-slate-700/80 border-2 border-slate-400/50 hover:border-slate-300 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-2">
          <div className="w-20 h-20 bg-slate-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Settings className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Bảng Điều Khiển</h3>
          <p className="text-slate-200 text-center text-sm">Dành cho MC/Admin điều khiển trò chơi (Mở ở thiết bị/màn hình riêng)</p>
        </Link>
      </div>
      
      <div className="mt-12 text-blue-300/60 text-sm text-center max-w-2xl">
        <p><strong>Lưu ý:</strong> Dữ liệu được đồng bộ tự động giữa các cửa sổ. Hãy mở Bảng Điều Khiển ở một thiết bị riêng (hoặc màn hình riêng) để MC thao tác, và mở Màn Hình Chính / Bảng Xếp Hạng ở màn hình chiếu cho khán giả xem.</p>
      </div>
    </main>
  );
}

