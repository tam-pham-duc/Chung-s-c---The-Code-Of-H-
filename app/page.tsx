'use client';

import React from 'react';
import Link from 'next/link';
import { Settings, MonitorPlay, Trophy } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen overflow-hidden bg-gradient-to-b from-blue-900 to-blue-950 p-4 md:p-8 font-sans box-border">
      <div className="text-center mb-6 md:mb-10 flex-shrink-0">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-yellow-400 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] tracking-wider uppercase mb-2 md:mb-4">
          CHUNG SỨC
        </h1>
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white drop-shadow-md">
          Giải Mã Phái Đẹp - The Code Of Her
        </h2>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full max-w-6xl flex-shrink-0">
        {/* Game Board Link */}
        <Link href="/game" target="_blank" className="group flex flex-col items-center justify-start p-4 md:p-6 bg-blue-800/50 hover:bg-blue-700/80 border-2 border-blue-400/50 hover:border-blue-300 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1">
          <div className="w-14 h-14 md:w-16 md:h-16 bg-blue-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shrink-0">
            <MonitorPlay className="w-7 h-7 md:w-8 md:h-8 text-white" />
          </div>
          <h3 className="text-lg md:text-xl font-bold text-white mb-2 text-center">Màn Hình Chính</h3>
          <p className="text-blue-200 text-center text-xs md:text-sm line-clamp-3">Hiển thị câu hỏi và đáp án cho khán giả (Mở ở cửa sổ/màn hình riêng)</p>
        </Link>

        {/* MC Panel Link */}
        <Link href="/mc" target="_blank" className="group flex flex-col items-center justify-start p-4 md:p-6 bg-emerald-800/50 hover:bg-emerald-700/80 border-2 border-emerald-400/50 hover:border-emerald-300 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1">
          <div className="w-14 h-14 md:w-16 md:h-16 bg-emerald-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shrink-0">
            <MonitorPlay className="w-7 h-7 md:w-8 md:h-8 text-white" />
          </div>
          <h3 className="text-lg md:text-xl font-bold text-white mb-2 text-center">Màn Hình MC</h3>
          <p className="text-emerald-200 text-center text-xs md:text-sm line-clamp-3">Hiển thị toàn bộ đáp án và trạng thái đóng/mở dành riêng cho MC</p>
        </Link>

        {/* Leaderboard Link */}
        <Link href="/leaderboard" target="_blank" className="group flex flex-col items-center justify-start p-4 md:p-6 bg-purple-800/50 hover:bg-purple-700/80 border-2 border-purple-400/50 hover:border-purple-300 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1">
          <div className="w-14 h-14 md:w-16 md:h-16 bg-purple-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shrink-0">
            <Trophy className="w-7 h-7 md:w-8 md:h-8 text-white" />
          </div>
          <h3 className="text-lg md:text-xl font-bold text-white mb-2 text-center">Bảng Xếp Hạng</h3>
          <p className="text-purple-200 text-center text-xs md:text-sm line-clamp-3">Hiển thị điểm số và thứ hạng các đội (Mở ở cửa sổ/màn hình riêng)</p>
        </Link>

        {/* Admin Link */}
        <Link href="/admin" target="_blank" className="group flex flex-col items-center justify-start p-4 md:p-6 bg-slate-800/50 hover:bg-slate-700/80 border-2 border-slate-400/50 hover:border-slate-300 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1">
          <div className="w-14 h-14 md:w-16 md:h-16 bg-slate-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shrink-0">
            <Settings className="w-7 h-7 md:w-8 md:h-8 text-white" />
          </div>
          <h3 className="text-lg md:text-xl font-bold text-white mb-2 text-center">Bảng Điều Khiển</h3>
          <p className="text-slate-200 text-center text-xs md:text-sm line-clamp-3">Dành cho Admin điều khiển trò chơi (Mở ở thiết bị/màn hình riêng)</p>
        </Link>
      </div>
      
      <div className="mt-8 md:mt-10 text-blue-300/80 text-xs md:text-sm text-center max-w-3xl flex-shrink-0 px-4">
        <p><strong>Lưu ý:</strong> Dữ liệu được đồng bộ tự động giữa các cửa sổ. Hãy mở Bảng Điều Khiển ở một thiết bị riêng (hoặc màn hình riêng) để MC thao tác, và mở Màn Hình Chính / Bảng Xếp Hạng ở màn hình chiếu cho khán giả xem.</p>
      </div>
    </main>
  );
}

