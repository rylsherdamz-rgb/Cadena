'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Plus, Users, History as HistoryIcon, Gamepad2 } from 'lucide-react';

import CreateGame from '../rock-game/create-game/page';
import JoinGame from '../rock-game/join-game/page';
import History from '../history/page';

type Tab = 'create' | 'join' | 'history';

function GamePage() {
  const [activeTab, setActiveTab] = useState<Tab>('create');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const tabButton = (
    tab: Tab,
    label: string,
    Icon: React.ElementType
  ) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 border-4 border-black transition-all uppercase font-black text-xs tracking-widest
        ${
          activeTab === tab
            ? 'bg-black text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]'
            : 'bg-white text-black hover:bg-zinc-100 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0 active:translate-y-0 active:shadow-none'
        }`}
    >
      <Icon className="w-5 h-5" />
      <span className="italic">{label.replace(' ', '_')}</span>
    </button>
  );

  if (!mounted) return <div className="min-h-screen bg-white" />;

  return (
    <div className="bg-white w-full min-h-screen pb-20">
      
      {/* HEADER SECTION */}
      <div className="px-5 py-10 border-b-4 border-black mb-10">
        <div className="flex items-center gap-4 mb-2">
           <Gamepad2 size={32} className="text-black" />
           <h1 className="text-5xl font-black uppercase italic tracking-tighter">Battle_Arena</h1>
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Protocol: Rock_Paper_Scissors_v1.0</p>
      </div>

      {/* TABS CONTAINER */}
      <div className="px-5 mb-12">
        <div className="flex flex-col md:flex-row gap-4">
          {tabButton('create', 'Create Game', Plus)}
          {tabButton('join', 'Join Game', Users)}
          {tabButton('history', 'History', HistoryIcon)}
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="px-5">
        <div className="border-4 border-black p-8 bg-white shadow-[20px_20px_0px_0px_rgba(0,0,0,0.05)] relative overflow-hidden">
          {/* Decorative Corner Tag */}
          <div className="absolute top-0 right-0 bg-black text-white px-4 py-1 text-[9px] font-black uppercase tracking-widest">
            {activeTab}_Module
          </div>
          
          <div className="mt-4">
            {activeTab === 'create' && <CreateGame />}
            {activeTab === 'join' && <JoinGame />}
            {activeTab === 'history' && <History />}
          </div>
        </div>
      </div>

    </div>
  );
}

export default dynamic(() => Promise.resolve(GamePage), { ssr: false });