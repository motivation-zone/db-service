CREATE TABLE IF NOT EXISTS user_sport (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  sport_id BIGINT REFERENCES sport(id) ON DELETE CASCADE,
  UNIQUE (user_id, sport_id)
);
