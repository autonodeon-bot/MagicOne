import React, { useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { api } from '../services/api';

const Admin: React.FC = () => {
    const [password, setPassword] = useState('');
    const [auth, setAuth] = useState(false);
    const [qrCount, setQrCount] = useState(1);
    const [qrType, setQrType] = useState('basic');

    const handleLogin = async () => {
        const res = await api.post('admin/login', { password });
        if (res.success) setAuth(true);
        else alert('Invalid');
    };

    const generateQRs = async () => {
        const res = await api.post('admin/generate-qr', { count: qrCount, type: qrType, password });
        if (res.success) {
            // Download logic placeholder - in real app would trigger CSV/ZIP download from Blob URL
            alert(`Generated ${res.codes.length} codes. Last: ${res.codes[0]}`);
            const qr = new QRCodeStyling({
                width: 300,
                height: 300,
                data: `https://t.me/MagicOneBot?start=${res.codes[0]}`,
                image: "https://babylonjs.com/assets/logo-babylonjs-social-twitter.png",
                dotsOptions: { color: "#4267b2", type: "rounded" },
                backgroundOptions: { color: "#e9ebee" },
            });
            const div = document.getElementById("qr-preview");
            if(div) { div.innerHTML = ''; qr.append(div); }
        }
    };

    if (!auth) {
        return (
            <div className="flex flex-col gap-4 p-8 items-center text-white">
                <h1 className="text-2xl font-bold">Admin Login</h1>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="text-black p-2 rounded" placeholder="Password" />
                <button onClick={handleLogin} className="bg-red-600 px-6 py-2 rounded">Enter</button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 p-4 text-white pb-20 overflow-y-auto h-screen">
            <h1 className="text-2xl font-bold text-red-500">CONTROL PANEL</h1>
            
            <div className="bg-gray-800 p-4 rounded">
                <h2 className="text-xl mb-2">Generate Promo QRs</h2>
                <div className="flex gap-2 mb-2">
                    <select value={qrType} onChange={e => setQrType(e.target.value)} className="text-black p-1">
                        <option value="basic">Basic (30d)</option>
                        <option value="pro">Pro (60d)</option>
                        <option value="limited">Event (90d)</option>
                    </select>
                    <input type="number" value={qrCount} onChange={e => setQrCount(Number(e.target.value))} className="text-black w-20 p-1" />
                    <button onClick={generateQRs} className="bg-blue-600 px-4 rounded">Gen</button>
                </div>
                <div id="qr-preview" className="bg-white w-fit p-2 mx-auto rounded"></div>
            </div>

            <div className="bg-gray-800 p-4 rounded">
                <h2 className="text-xl mb-2">Global Actions</h2>
                <div className="flex gap-2 flex-wrap">
                    <button onClick={() => api.post('admin/reset-leaderboard', {password})} className="bg-orange-600 p-2 rounded">Reset Leaderboard</button>
                    <button onClick={() => api.post('admin/force-meteor', {password})} className="bg-purple-600 p-2 rounded">Summon Meteor</button>
                </div>
            </div>
        </div>
    );
};

export default Admin;