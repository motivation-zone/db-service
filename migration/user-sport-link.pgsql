CREATE TABLE IF NOT EXISTS user_sport_link (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE RESTRICT,
  sport_id BIGINT REFERENCES sport(id) ON DELETE CASCADE,
  UNIQUE (user_id, sport_id)
);
