import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import WeatherCard from '../components/WeatherCard';
import HistoryGrid from '../components/HistoryGrid';

export default function Dashboard() {
    const { user, logout } = useAuth();
    
    const [city, setCity] = useState('');
    const [currentWeather, setCurrentWeather] = useState(null);
    const [searching, setSearching] = useState(false);
    const [searchError, setSearchError] = useState('');
    
    // History State
    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const loadHistory = async (pageNumber = 1) => {
        setHistoryLoading(true);
        try {
            const res = await axios.get(`http://localhost:3000/api/weather/history?page=${pageNumber}&limit=6`, {
                withCredentials: true
            });
            setHistory(res.data.items);
            setTotalPages(res.data.totalPages);
            setPage(res.data.page);
        } catch (error) {
            console.error("Failed to load history", error);
        } finally {
            setHistoryLoading(false);
        }
    };

    useEffect(() => {
        loadHistory(page);
    }, [page]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!city.trim()) return;

        setSearching(true);
        setSearchError('');
        setCurrentWeather(null);

        try {
            const res = await axios.get(`http://localhost:3000/api/weather/search?city=${encodeURIComponent(city)}`, {
                withCredentials: true
            });
            setCurrentWeather(res.data);
            setCity(''); // Clear search
            
            // Reload history to show the newly added search
            loadHistory(1);
            
        } catch (error) {
            setSearchError(error.response?.data?.error || 'Error al buscar el clima');
        } finally {
            setSearching(false);
        }
    };

    return (
        <div className="container">
            {/* Topbar */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <h1 className="title" style={{ fontSize: '2rem', marginBottom: 0 }}>ClimaDash</h1>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {user?.avatar_url && <img src={user.avatar_url} alt="avatar" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />}
                        <span style={{ fontWeight: 500 }}>{user?.username}</span>
                    </div>
                    <button className="btn btn-danger" onClick={logout}>
                        <LogOut size={16} /> Salir
                    </button>
                </div>
            </header>

            <main>
                {/* Search Section */}
                <section className="glass" style={{ padding: '30px' }}>
                    <h2 style={{ marginBottom: '20px', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Buscar Nueva Ciudad</h2>
                    <form onSubmit={handleSearch} className="input-group">
                        <input 
                            type="text" 
                            placeholder="Ej. Madrid, Tokyo, Buenos Aires..." 
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            disabled={searching}
                        />
                        <button type="submit" className="btn btn-primary" disabled={searching || !city.trim()}>
                            {searching ? <div className="loader" style={{width:'16px',height:'16px',borderWidth:'2px'}}></div> : <Search size={20} />}
                            {searching ? 'Buscando...' : 'Buscar'}
                        </button>
                    </form>
                    {searchError && (
                        <div style={{ color: 'var(--danger)', marginTop: '15px', padding: '10px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
                            {searchError}
                        </div>
                    )}
                </section>

                {/* Current Searched Weather */}
                <WeatherCard weather={currentWeather} />

                {/* History Section */}
                <HistoryGrid 
                    history={history} 
                    loading={historyLoading} 
                    page={page} 
                    totalPages={totalPages} 
                    setPage={setPage} 
                />
            </main>
        </div>
    );
}
