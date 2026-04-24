import React from 'react';
import { Droplets, Wind, MapPin } from 'lucide-react';

export default function WeatherCard({ weather }) {
    if (!weather) return null;

    return (
        <div className="glass" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MapPin color="var(--danger)" /> {weather.city_name}
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                        {weather.condition_text}
                    </p>
                </div>
                <img 
                    src={weather.icon_url} 
                    alt="Weather icon" 
                    style={{ width: '100px', height: '100px', objectFit: 'contain' }}
                />
            </div>
            
            <div style={{ fontSize: '3rem', fontWeight: 'bold' }}>
                {Math.round(weather.temperature)}°C
            </div>
            
            <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                    <Droplets size={20} color="var(--accent)" />
                    <span>Humedad: {weather.humidity}%</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                    <Wind size={20} />
                    <span>Viento: {weather.wind_speed} kph</span>
                </div>
            </div>
        </div>
    );
}
