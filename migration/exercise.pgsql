CREATE TABLE IF NOT EXISTS exercise_template (
  id BIGSERIAL PRIMARY KEY, -- this id for video in fs too
  title TEXT NOT NULL,
  description TEXT,
  user_id BIGINT REFERENCES users(id) ON DELETE RESTRICT,
  sport_id BIGINT REFERENCES sport(id) ON DELETE RESTRICT,
  created_date TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS exercise (
  id BIGSERIAL PRIMARY KEY,
  exercise_template_id BIGINT REFERENCES exercise_template(id) ON DELETE RESTRICT,
  duration INTEGER DEFAULT 0, -- by seconds
  reps INTEGER DEFAULT 0,
  created_date TIMESTAMP WITH TIME ZONE DEFAULT now()
);

