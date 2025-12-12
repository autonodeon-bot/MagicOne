import React, { useState, useEffect } from 'react';
import SceneManager from './game/SceneManager';
import { MainMenu, Hotbar, HUD } from './components/UI';
import Admin from './components/Admin';
import { GameState, UserData, ChunkData } from './types';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.LOADING);
  const [user, setUser] = useState<UserData | null>(null);
  const [selectedBlock, setSelectedBlock] = useState(1);
  const [chunks, setChunks] = useState<ChunkData[]>([]);

  useEffect(() => {
    const init = async () => {
      // Telegram init
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.ready();
        try {
            window.Telegram.WebApp.expand();
            window.Telegram.WebApp.enableClosingConfirmation();
            window.Telegram.WebApp.setHeaderColor('#000000');
            window.Telegram.WebApp.setBackgroundColor('#000000');
        } catch (e) { console.log('TG WebApp not fully active'); }
      }

      // Mock login for demo
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
      setChunks([
          { x: 0, z: 0, blocks: [{x: 0, y: 0, z: 0, type: 2}, {x: 1, y: 0, z: 0, type: 2}] }
      ]);
  };

  const handlePlaceBlock = (x: number, y: number, z: number, type: number) => {
      const newChunks = [...chunks];
      if(!newChunks[0]) newChunks.push({x:0, z:0, blocks: []});
      newChunks[0].blocks.push({x, y, z, type});
      setChunks(newChunks);
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
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden', background: '#000' }}>
      {gameState === GameState.LOADING && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <div style={{ width: 40, height: 40, border: '4px solid gold', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              <p style={{ marginTop: 20 }}>Loading World...</p>
              <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          </div>
      )}

      {gameState === GameState.MENU && (
        <>
            <MainMenu onStart={startGame} user={user} />
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: 50, height: 50, zIndex: 999 }} onClick={() => setGameState(GameState.ADMIN)} />
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
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: '#111', zIndex: 200, overflowY: 'auto' }}>
             <button onClick={() => setGameState(GameState.MENU)} className="btn" style={{ width: 'auto', margin: 10 }}>Back</button>
             <Admin />
          </div>
      )}

      {(gameState === GameState.GALLERY || gameState === GameState.CLAN || gameState === GameState.MAP) && (
          <div className="overlay">
              <div className="panel">
                  <h2>Coming Soon</h2>
                  <p>This feature is under construction.</p>
                  <button onClick={() => setGameState(GameState.MENU)} className="btn" style={{marginTop: 20}}>Back</button>
              </div>
          </div>
      )}
    </div>
  );
};

export default App;