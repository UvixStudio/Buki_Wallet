export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-orange-50">
      <div className="text-center p-8 max-w-2xl">
        <h1 className="text-6xl font-bold mb-6 text-blue-900">
          THIS IS A VERCEL TEST
        </h1>
        <h2 className="text-4xl font-semibold text-orange-600 mb-8">
          BUKI WALLET
        </h2>
        <div className="space-y-4">
          <p className="text-2xl text-gray-700">
            ✅ GitHub → Vercel Connection Successful!
          </p>
          <p className="text-lg text-gray-600">
            Phase 0: Infrastructure test complete
          </p>
          <p className="text-sm text-gray-500 mt-8">
            Ready to proceed with POC development
          </p>
        </div>
      </div>
    </main>
  );
}
