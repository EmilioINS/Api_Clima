import React from 'react';
import { Cloud, Wind, Droplets } from 'lucide-react';

export default function Login() {
    const handleLogin = () => {
        // Redirige al flujo OAuth de backend
        window.location.href = 'http://localhost:3000/api/auth/discord';
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px' }}>
            <div className="glass" style={{ maxWidth: '400px', width: '100%', padding: '40px 30px', textAlign: 'center' }}>
                <Cloud size={64} color="#38bdf8" style={{ marginBottom: '20px' }} />
                <h1 className="title" style={{ fontSize: '2rem' }}>ClimaDash</h1>
                <p className="subtitle" style={{ marginBottom: '30px' }}>
                    Explora el mundo y conoce su clima en tiempo real.
                </p>
                
                <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '30px', color: 'var(--text-secondary)' }}>
                    <Wind size={24} />
                    <Droplets size={24} />
                </div>
                
                <button className="btn btn-discord" onClick={handleLogin} style={{ width: '100%' }}>
                    Iniciar sesión con Discord
                </button>
                <p style={{ marginTop: '20px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    Al iniciar sesión aceptas nuestra política de cookies y privacidad.
                </p>
            </div>
        </div>
    );
}
