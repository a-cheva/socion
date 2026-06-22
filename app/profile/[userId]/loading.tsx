export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-[#0a0f0d]">
      <header className="bg-[#0d1310] border-b border-[#1e2e26] px-6 py-4">
        <span className="text-sm text-[#4a5e54]">Carregando perfil…</span>
      </header>
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="h-1.5 w-full bg-[#1e2e26] rounded-full overflow-hidden mb-8">
          <div className="h-full w-1/3 bg-[#00a86b] rounded-full animate-[loadingbar_1.2s_ease-in-out_infinite]" />
        </div>
        <div className="flex flex-col gap-5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="bg-[#111816] border border-[#1e2e26] rounded-2xl p-6 animate-pulse">
              <div className="h-5 w-40 bg-[#1e2e26] rounded mb-4" />
              <div className="h-3 w-full bg-[#1e2e26] rounded mb-2" />
              <div className="h-3 w-3/4 bg-[#1e2e26] rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
