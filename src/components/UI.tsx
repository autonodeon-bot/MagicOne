import React from 'react';
import { BLOCKS } from '../constants';
import { UserData } from '../types';
import { Coins, Camera, Users, Map, ArrowLeft } from 'lucide-react';

export const Hotbar: React.FC<{ selected: number, onSelect: (id: number) => void, inventory: number[] }> = ({ selected, onSelect, inventory }) => {
    return (
        <div style={{
            position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
            display: 'flex', gap: '8px', padding: '10px', background: 'rgba(0,0,0,0.6)',
            borderRadius: '16px', backdropFilter: 'blur(5px)', maxWidth: '95vw', overflowX: 'auto'
        }}>
            {inventory.map(id => (
                <button 
                    key={id} 
                    onClick={() => onSelect(id)}
                    className={`hotbar-slot ${selected === id ? 'selected' : ''}`}
                    style={{ backgroundColor: BLOCKS[id]?.color || '#fff' }}
                >
                    <span style={{ fontSize: '10px', color: 'white' }}>{id}</span>
                </button>
            ))}
        </div>
    );
};

export const MainMenu: React.FC<{ onStart: (mode: any) => void, user: UserData | null }> = ({ onStart, user }) => {
    if (!user) return null;

    return (
        <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            minHeight: '100vh', background: 'linear-gradient(to bottom, #2b32b2, #1488cc)', padding: '20px'
        }}>
            <div className="panel">
                <h1 style={{ 
                    fontSize: '3rem', margin: '0 0 10px 0', 
                    background: '-webkit-linear-gradient(#eee, #333)', WebkitBackgroundClip: 'text',
                    textShadow: '0 4px 0 #000'
                }}>MagicOne</h1>
                
                <p style={{ color: '#ccc', marginBottom: '30px', fontFamily: 'monospace' }}>
                    Coins: {user.coins} | Streak: {user.streak}
                </p>
                
                <button onClick={() => onStart('plot')} className="btn">Build Plot</button>
                <button onClick={() => onStart('world')} className="btn btn-green">Open World</button>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginTop: '10px' }}>
                    <button onClick={() => onStart('gallery')} className="btn" style={{ fontSize: '12px', padding: '10px' }}>
                        <Camera size={18}/> Gallery
                    </button>
                    <button onClick={() => onStart('clan')} className="btn" style={{ fontSize: '12px', padding: '10px' }}>
                        <Users size={18}/> Clan
                    </button>
                    <button onClick={() => onStart('map')} className="btn" style={{ fontSize: '12px', padding: '10px' }}>
                        <Map size={18}/> Map
                    </button>
                </div>
            </div>
        </div>
    );
};

export const HUD: React.FC<{ onBack: () => void, coins: number }> = ({ onBack, coins }) => {
    return (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', padding: '15px', display: 'flex', justifyContent: 'space-between', pointerEvents: 'none' }}>
            <button onClick={onBack} style={{ pointerEvents: 'auto', background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', padding: '8px', color: 'white' }}>
                <ArrowLeft />
            </button>
            <div style={{ background: 'rgba(255, 215, 0, 0.9)', color: 'black', fontWeight: 'bold', padding: '5px 15px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Coins size={16} /> {coins}
            </div>
        </div>
    );
};