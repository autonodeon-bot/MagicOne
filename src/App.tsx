import React, { useState, useEffect } from 'react';
import SceneManager from './game/SceneManager';
import { MainMenu, Hotbar, HUD } from './components/UI';
import Admin from './components/Admin';
import { GameState, UserData, ChunkData } from './types';
import { api } from './services/api';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.LOADING);
  const [user, setUser] = useState<UserData | null>(null);
  const [selectedBlock, setSelectedBlock] = useState(1);
  const [chunks, setChunks] = useState<ChunkData[]>([]);

  useEffect(() => {
    const init = async () => {
      // Telegram init
      if (window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();
        window.Telegram.WebApp.expand();
        window.Telegram.WebApp.enableClosingConfirmation();
      }

      // Mock login for demo (replace with actual API call)
      // const userData = await api.get('user/me');
      // For demo, we simulate
      setTimeout(() => {
        setUser({
            tgId: 12345,
            coins: 100,
            premium: false,
            inventory: [1, 2, 3, 4, 5, 31, 32, 33, 34, 35],
            streak: 1,
            lastDaily: Date.now()
        });
        setGameState(GameState.MENU);
      }, 1000);
    };
    init();
  }, []);

  const startGame = async (mode: 'plot' | 'world') => {
      setGameState(mode === 'plot' ? GameState.PLOT_BUILDER : GameState.WORLD_EXPLORER);
      // Fetch chunks
      // const data = await api.get(`world/chunks?mode=${mode}`);
      // Mock chunks
      setChunks([
          { x: 0, z: 0, blocks: [{x: 0, y: 0, z: 0, type: 2}, {x: 1, y: 0, z: 0, type: 2}] }
      ]);
  };

  const handlePlaceBlock = (x: number, y: number, z: number, type: number) => {
      // Update local state
      const newChunks = [...chunks];
      if(!newChunks[0]) newChunks.push({x:0, z:0, blocks: []});
      newChunks[0].blocks.push({x, y, z, type});
      setChunks(newChunks);
      
      // Optimistic API call
      // api.post('world/place', { x, y, z, type });
      setUser(u => u ? ({...u, coins: u.coins + 1}) : null);
  };

  const handleRemoveBlock = (x: number, y: number, z: number) => {
      const newChunks = chunks.map(c => ({
          ...c,
          blocks: c.blocks.filter(b => b.x !== x || b.y !== y || b.z !== z)
      }));
      setChunks(newChunks);
  };

  return (
    <div className="w-full h-screen bg-black overflow-hidden relative font-sans">
      {gameState === GameState.LOADING && (
          <div className="flex items-center justify-center h-full flex-col">
              <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-white mt-4 animate-pulse">Loading World...</p>
          </div>
      )}

      {gameState === GameState.MENU && (
        <>
            <MainMenu onStart={startGame} user={user} />
            {/* Admin Secret Entry */}
            <div className="absolute bottom-0 right-0 w-10 h-10" onClick={() => setGameState(GameState.ADMIN)} />
        </>
      )}

      {(gameState === GameState.PLOT_BUILDER || gameState === GameState.WORLD_EXPLORER) && (
        <>
          <SceneManager 
            mode={gameState === GameState.PLOT_BUILDER ? 'plot' : 'world'}
            chunks={chunks}
            onPlaceBlock={handlePlaceBlock}
            onRemoveBlock={handleRemoveBlock}
            selectedBlock={selectedBlock}
          />
          <HUD onBack={() => setGameState(GameState.MENU)} coins={user?.coins || 0} />
          <Hotbar selected={selectedBlock} onSelect={setSelectedBlock} inventory={user?.inventory || []} />
        </>
      )}

      {gameState === GameState.ADMIN && (
          <>
             <button onClick={() => setGameState(GameState.MENU)} className="absolute top-4 left-4 text-white z-50 bg-gray-700 p-2 rounded">Back</button>
             <Admin />
          </>
      )}

      {/* Placeholders for other screens */}
      {gameState === GameState.GALLERY && <div className="text-white p-10 text-center"><h1 className="text-2xl">Gallery</h1><button onClick={() => setGameState(GameState.MENU)} className="mt-4 bg-white text-black p-2">Back</button></div>}
      {gameState === GameState.CLAN && <div className="text-white p-10 text-center"><h1 className="text-2xl">Clans</h1><button onClick={() => setGameState(GameState.MENU)} className="mt-4 bg-white text-black p-2">Back</button></div>}
      {gameState === GameState.MAP && <div className="text-white p-10 text-center"><h1 className="text-2xl">World Map</h1><button onClick={() => setGameState(GameState.MENU)} className="mt-4 bg-white text-black p-2">Back</button></div>}
    </div>
  );
};

export default App;