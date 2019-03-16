CREATE TABLE IF NOT EXISTS difficulty_level (
  id BIGSERIAL PRIMARY KEY,
  level INTEGER UNIQUE NOT NULL,
  name TEXT UNIQUE NOT NULL
);

INSERT INTO difficulty_level (level, name) VALUES (1, 'beginner') ON CONFLICT DO NOTHING;
INSERT INTO difficulty_level (level, name) VALUES (2, 'intermediate') ON CONFLICT DO NOTHING;
INSERT INTO difficulty_level (level, name) VALUES (3, 'advance') ON CONFLICT DO NOTHING;
INSERT INTO difficulty_level (level, name) VALUES (4, 'monster') ON CONFLICT DO NOTHING;
