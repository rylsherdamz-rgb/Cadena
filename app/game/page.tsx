'use client';

import { useState } from 'react';
import { Plus, Users, History as HistoryIcon } from 'lucide-react';

import CreateGame from '../rock-game/create-game/page';
import JoinGame from '../rock-game/join-game/page';
import History from '../history/page';

type Tab = 'create' | 'join' | 'history';

export default function GamePage() {
  const [activeTab, setActiveTab] = useState<Tab>('create');

  const tabButton = (
    tab: Tab,
    label: string,
    Icon: React.ElementType
  ) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-colors
        ${
          activeTab === tab
            ? 'bg-slate-200 text-black'
            : 'text-black border border-black hover:bg-slate-100'
        }`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="bg-white w-full">

      {/* Tabs */}
      <div className="flex flex-row gap-x-6 px-5 py-3 bg-white rounded-lg">
        {tabButton('create', 'Create Game', Plus)}
        {tabButton('join', 'Join Game', Users)}
        {tabButton('history', 'History', HistoryIcon)}
      </div>

      {/* Content */}
      <div className="px-5 py-4">
        {activeTab === 'create' && <CreateGame />}
        {activeTab === 'join' && <JoinGame />}
        {activeTab === 'history' && <History />}
      </div>

    </div>
  );
}
