import React from 'react';

export default function HistoryGrid({ history, loading, page, totalPages, setPage }) {
    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><div className="loader"></div></div>;
    }

    if (!history || history.length === 0) {
        return (
            <div className="glass" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)', marginTop: '30px' }}>
                Aún no has realizado ninguna búsqueda.
            </div>
        );
    }

    return (
        <div style={{ marginTop: '30px' }}>
            <h3 style={{ marginBottom: '20px', borderBottom: '1px solid var(--card-border)', paddingBottom: '10px' }}>
                Historial de Búsquedas (BD)
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                {history.map((item) => (
                    <div key={item.id} className="glass" style={{ padding: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <strong style={{ fontSize: '1.2rem' }}>{item.city_name}</strong>
                            <img src={item.icon_url} alt="icon" style={{ width: '40px', height: '40px' }} />
                        </div>
                        <div style={{ color: 'var(--text-secondary)', marginBottom: '5px' }}>
                            {Math.round(item.temperature)}°C - {item.condition_text}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '10px' }}>
                            {new Date(item.created_at).toLocaleString('es-ES')}
                        </div>
                    </div>
                ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginTop: '30px' }}>
                    <button 
                        className="btn" 
                        disabled={page <= 1} 
                        onClick={() => setPage(page - 1)}
                        style={{ background: 'var(--card-bg)' }}
                    >
                        Anterior
                    </button>
                    <span style={{ color: 'var(--text-secondary)' }}>
                        Página {page} de {totalPages}
                    </span>
                    <button 
                        className="btn" 
                        disabled={page >= totalPages} 
                        onClick={() => setPage(page + 1)}
                        style={{ background: 'var(--card-bg)' }}
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    );
}
