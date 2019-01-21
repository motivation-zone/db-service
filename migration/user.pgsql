CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  login TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  password TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  is_athlete BOOLEAN DEFAULT FALSE,
  gender BOOLEAN NOT NULL,
  self_info TEXT,
  weight REAL,
  growth REAL,
  country_id BIGINT REFERENCES country(id) ON DELETE RESTRICT,
  birth_date TIMESTAMP WITH TIME ZONE,
  is_banned BOOLEAN DEFAULT FALSE,
  instagram TEXT,
  phone TEXT,
  registered_date TIMESTAMP WITH TIME ZONE DEFAULT now()
);
