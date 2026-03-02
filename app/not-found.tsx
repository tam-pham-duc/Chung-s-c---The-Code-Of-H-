import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-900 to-blue-950 p-6 font-sans text-white">
      <h2 className="text-4xl font-bold mb-4">Not Found</h2>
      <p className="mb-8">Could not find requested resource</p>
      <Link href="/" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors">
        Return Home
      </Link>
    </div>
  )
}
