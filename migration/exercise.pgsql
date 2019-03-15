CREATE TABLE IF NOT EXISTS exercise_template (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  user_id BIGINT REFERENCES users(id) ON DELETE RESTRICT,
  sport_id BIGINT REFERENCES sport(id) ON DELETE RESTRICT,
  created_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(title, description, user_id, sport_id)
);

CREATE DOMAIN VALUE_TYPE AS TEXT NOT NULL CHECK (VALUE='reps' OR VALUE='duration');
CREATE TABLE IF NOT EXISTS exercise (
  id BIGSERIAL PRIMARY KEY,
  exercise_template_id BIGINT REFERENCES exercise_template(id) ON DELETE RESTRICT,
  value INTEGER NOT NULL,
  type VALUE_TYPE,
  created_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(exercise_template_id, value, type)
);
