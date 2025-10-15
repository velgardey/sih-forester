'use client';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-5">
      <h1 className="text-6xl md:text-[6rem] font-bold text-red-600 mb-4">500</h1>
      <p className="text-2xl text-gray-800 mb-6">Something went wrong on our side.</p>
      <button
        onClick={() => reset()}
        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md text-lg transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}

