require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const axios = require('axios');
const supabase = require('./supabaseClient');
require('./passport-setup'); // init passport

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true // Permite envío de cookies desde el front
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false, // Don't save empty sessions
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));

app.use(passport.initialize());
app.use(passport.session());

// --- ROUTES ---

// 1. Auth Routes
app.get('/api/auth/discord', passport.authenticate('discord'));

app.get('/api/auth/discord/callback', passport.authenticate('discord', {
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login`
}), (req, res) => {
    // Successful authentication, redirect to frontend dashboard.
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard`);
});

app.get('/api/auth/me', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ authenticated: true, user: req.user });
    } else {
        res.json({ authenticated: false, user: null });
    }
});

app.post('/api/auth/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        req.session.destroy();
        res.json({ ok: true, message: 'Sesión cerrada exitosamente' });
    });
});

// Middleware to protect routes
const requireAuth = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.status(401).json({ error: 'Acceso no autorizado' });
};

// 2. Weather Routes
app.get('/api/weather/search', requireAuth, async (req, res) => {
    const { city } = req.query;
    if (!city) return res.status(400).json({ error: 'La ciudad es requerida para buscar el clima' });

    try {
        // Consultar la API pública de clima
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${process.env.WEATHER_API_KEY}&units=metric&lang=es`;
        
        const response = await axios.get(weatherUrl);
        const data = response.data;
        
        // Extraer y transformar datos
        const weatherData = {
            discord_user_id: req.user.id,
            city_name: data.name,
            temperature: data.main.temp,
            condition_text: data.weather[0].description,
            humidity: data.main.humidity,
            wind_speed: data.wind.speed,
            icon_url: `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`
        };

        // Regla 4: Transferir los datos hacia la base de datos (Supabase)
        const { data: insertedData, error } = await supabase
            .from('weather_searches')
            .insert(weatherData)
            .select()
            .single();

        if (error) {
            console.error('Supabase DB Insert Error:', error);
            return res.status(500).json({ error: 'Error al persistir el historial en la base de datos' });
        }

        // Regla 5: Consumir la base de datos en Supabase para retornar el valor (insertedData)
        res.json(insertedData);

    } catch (error) {
        console.error('OpenWeather API Error:', error.response?.data || error.message);
        if (error.response?.status === 404) {
            return res.status(404).json({ error: 'La ciudad buscada no existe' });
        } else if (error.response?.status === 401) {
             return res.status(500).json({ error: 'API Key de OpenWeather inválida' });
        }
        res.status(500).json({ error: 'Error interno en el servidor al consultar clima' });
    }
});

app.get('/api/weather/history', requireAuth, async (req, res) => {
    // Pagination params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; // Max items per page
    const startRange = (page - 1) * limit;
    const endRange = startRange + limit - 1;

    try {
        // Extraer historial paginado del usuario autenticado
        const { data, error, count } = await supabase
            .from('weather_searches')
            .select('*', { count: 'exact' })
            .eq('discord_user_id', req.user.id)
            .order('created_at', { ascending: false })
            .range(startRange, endRange);

        if (error) {
            console.error('Supabase DB Request Error:', error);
            throw error;
        }

        res.json({
            items: data,
            total: count,
            page,
            limit,
            totalPages: Math.ceil((count || 0) / limit)
        });
    } catch (error) {
        res.status(500).json({ error: 'Ocurrió un error consultando el historial de clima' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Weather Backend en marcha! http://localhost:${PORT}`);
});
