import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Inbox } from "@/components/Inbox";

export default function Message() {
  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900">
      {/* Navigation / Header */}
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            D-Message
          </h1>
          <ConnectButton showBalance={false} chainStatus="icon" />
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 gap-8">
          <section className="text-center space-y-2 mb-4">
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">
              Decentralized Inbox
            </h2>
            <p className="text-slate-500 max-w-md mx-auto">
              Send encrypted-style messages directly to any wallet address on-chain.
            </p>
          </section>

          <Inbox />
        </div>
      </div>
    </main>
  );
}