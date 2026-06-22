export default function FeedLoading() {
  return (
    <div className="min-h-screen bg-[#0a0f0d]">
      <header className="bg-[#0d1310] border-b border-[#1e2e26] px-6 py-4">
        <span className="text-xl font-bold text-[#00a86b]">SocioN</span>
      </header>
      <div className="max-w-xl mx-auto py-8 px-4">
        {/* barra de carregamento */}
        <div className="h-1.5 w-full bg-[#1e2e26] rounded-full overflow-hidden mb-8">
          <div className="h-full w-1/3 bg-[#00a86b] rounded-full animate-[loadingbar_1.2s_ease-in-out_infinite]" />
        </div>
        <div className="flex flex-col gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="bg-[#111816] border border-[#1e2e26] rounded-2xl p-5 animate-pulse">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-[#1e2e26]" />
                <div className="flex-1">
                  <div className="h-4 w-32 bg-[#1e2e26] rounded mb-2" />
                  <div className="h-3 w-48 bg-[#1e2e26] rounded" />
                </div>
              </div>
              <div className="h-3 w-full bg-[#1e2e26] rounded mb-2" />
              <div className="h-3 w-2/3 bg-[#1e2e26] rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
