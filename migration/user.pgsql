CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  login TEXT UNIQUE NOT NULL ,
  name TEXT NOT NULL,
  password TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
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
