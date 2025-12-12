import React, { useState } from 'react';
import { api } from '../services/api';

const Admin: React.FC = () => {
    const [password, setPassword] = useState('');
    const [auth, setAuth] = useState(false);
    const [qrCount, setQrCount] = useState(1);
    const [qrType, setQrType] = useState('basic');

    const handleLogin = async () => {
        // Mock auth for local test if API fails
        if(password === 'supersecret123') {
            setAuth(true);
            return;
        }
        const res = await api.post('admin/login', { password });
        if (res.success) setAuth(true);
        else alert('Invalid');
    };

    const generateQRs = async () => {
        const res = await api.post('admin/generate-qr', { count: qrCount, type: qrType, password });
        if (res.success) {
            alert(`Generated ${res.codes.length} codes. Code: ${res.codes[0]}`);
        } else {
            alert('Error generating QR');
        }
    };

    if (!auth) {
        return (
            <div style={{ padding: 40, display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 300, margin: '0 auto' }}>
                <h1 style={{fontSize: 24, textAlign: 'center'}}>Admin Access</h1>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="input-field" placeholder="Password" />
                <button onClick={handleLogin} className="btn btn-green">Login</button>
            </div>
        );
    }

    return (
        <div style={{ padding: 20, color: 'white' }}>
            <h1 style={{ color: 'red', marginBottom: 20 }}>CONTROL PANEL</h1>
            
            <div style={{ background: '#333', padding: 15, borderRadius: 10, marginBottom: 20 }}>
                <h2 style={{ margin: '0 0 10px 0' }}>Generate Promo QRs</h2>
                <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                    <select value={qrType} onChange={e => setQrType(e.target.value)} style={{ color: 'black', padding: 5 }}>
                        <option value="basic">Basic (30d)</option>
                        <option value="pro">Pro (60d)</option>
                        <option value="limited">Event (90d)</option>
                    </select>
                    <input type="number" value={qrCount} onChange={e => setQrCount(Number(e.target.value))} style={{ color: 'black', width: 60, padding: 5 }} />
                </div>
                <button onClick={generateQRs} className="btn" style={{ padding: '8px' }}>Generate</button>
            </div>

            <div style={{ background: '#333', padding: 15, borderRadius: 10 }}>
                <h2 style={{ margin: '0 0 10px 0' }}>Global Actions</h2>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <button onClick={() => api.post('admin/reset-leaderboard', {password})} className="btn" style={{ background: 'orange' }}>Reset Lead</button>
                    <button onClick={() => api.post('admin/force-meteor', {password})} className="btn" style={{ background: 'purple' }}>Meteor</button>
                </div>
            </div>
        </div>
    );
};

export default Admin;