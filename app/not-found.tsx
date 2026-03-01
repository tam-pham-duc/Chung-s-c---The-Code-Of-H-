import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-950 text-white">
      <h2 className="text-4xl font-bold mb-4">404 - Không tìm thấy trang</h2>
      <p className="mb-8">Trang bạn đang tìm kiếm không tồn tại.</p>
      <Link href="/" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold transition-colors">
        Về trang chủ
      </Link>
    </div>
  );
}
