import React from 'react';
import { BLOCKS } from '../constants';
import { UserData } from '../types';
import { Coins, Camera, Users, Map, ArrowLeft } from 'lucide-react';

// Hotbar
export const Hotbar: React.FC<{ selected: number, onSelect: (id: number) => void, inventory: number[] }> = ({ selected, onSelect, inventory }) => {
    return (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1 p-2 bg-black/60 rounded-lg backdrop-blur-sm overflow-x-auto max-w-[90vw]">
            {inventory.map(id => (
                <button 
                    key={id} 
                    onClick={() => onSelect(id)}
                    className={`w-10 h-10 border-2 rounded flex items-center justify-center shrink-0 ${selected === id ? 'border-yellow-400 scale-110' : 'border-gray-600'}`}
                    style={{ backgroundColor: BLOCKS[id]?.color || '#fff' }}
                >
                    <span className="text-[10px] text-white drop-shadow-md font-bold">{id}</span>
                </button>
            ))}
        </div>
    );
};

// Main Menu
export const MainMenu: React.FC<{ onStart: (mode: any) => void, user: UserData | null }> = ({ onStart, user }) => {
    if (!user) return <div className="text-white text-center mt-20">Loading MagicOne...</div>;

    const btnClass = "bg-[#7C7C7C] border-b-4 border-[#555] text-white font-bold py-3 px-6 rounded-lg active:border-b-0 active:translate-y-1 w-full text-lg shadow-xl mb-3 flex items-center justify-center gap-2";

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#3C3C3C] p-6 bg-[url('https://picsum.photos/800/1200?blur=5')] bg-cover bg-center blend-overlay">
            <div className="bg-black/70 p-8 rounded-xl w-full max-w-md backdrop-blur-md border-2 border-white/20">
                <h1 className="text-4xl font-black text-center text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-orange-500 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] mb-2">MagicOne</h1>
                <p className="text-center text-gray-300 mb-8 font-mono">v1.0.0 | Coins: {user.coins}</p>
                
                <button onClick={() => onStart('plot')} className={btnClass}>Build Plot</button>
                <button onClick={() => onStart('world')} className={`${btnClass} bg-[#568203] border-green-800`}>Open World</button>
                <button onClick={() => onStart('gallery')} className={btnClass}><Camera size={20}/> Gallery</button>
                <button onClick={() => onStart('clan')} className={btnClass}><Users size={20}/> Clan</button>
                <button onClick={() => onStart('map')} className={btnClass}><Map size={20}/> Map</button>
                
                <div className="grid grid-cols-2 gap-2 mt-4">
                     <button className="bg-blue-600 text-white p-2 rounded font-bold text-sm">Daily Reward</button>
                     <button className="bg-purple-600 text-white p-2 rounded font-bold text-sm">Scan QR</button>
                </div>
            </div>
        </div>
    );
};

// HUD
export const HUD: React.FC<{ onBack: () => void, coins: number }> = ({ onBack, coins }) => {
    return (
        <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start pointer-events-none">
            <button onClick={onBack} className="pointer-events-auto bg-black/50 p-2 rounded-full text-white hover:bg-red-500/50 transition"><ArrowLeft /></button>
            <div className="bg-yellow-500/80 text-black font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <Coins size={16} /> {coins}
            </div>
        </div>
    );
};