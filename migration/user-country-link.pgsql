CREATE TABLE IF NOT EXISTS user_country_link (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE RESTRICT,
  country_id BIGINT REFERENCES country(id) ON DELETE CASCADE,
  UNIQUE (user_id, country_id)
);
