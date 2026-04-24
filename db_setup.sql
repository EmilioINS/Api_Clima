-- Tabla de Usuarios (Discord Auth)
CREATE TABLE users (
  id TEXT PRIMARY KEY, -- Discord User ID
  username TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Búsquedas (Historial del clima)
CREATE TABLE weather_searches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  discord_user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  city_name TEXT NOT NULL,
  temperature NUMERIC NOT NULL,
  condition_text TEXT NOT NULL,
  humidity INTEGER NOT NULL,
  wind_speed NUMERIC NOT NULL,
  icon_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
