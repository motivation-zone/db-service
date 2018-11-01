CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  login TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  password TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  country TEXT,
  is_athlete BOOLEAN DEFAULT FALSE,
  self_info TEXT,
  weight REAL,
  growth REAL,
  birth_date TIMESTAMP WITH TIME ZONE,
  is_banned BOOLEAN DEFAULT FALSE,
  registered TIMESTAMP WITH TIME ZONE DEFAULT now()
);
