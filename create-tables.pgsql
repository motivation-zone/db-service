CREATE TABLE IF NOT EXISTS exercise_template (
  id BIGSERIAL PRIMARY KEY, -- this id for video in fs too
  title TEXT NOT NULL,
  description TEXT,
  user_id BIGINT REFERENCES users(id) ON DELETE RESTRICT,
  sport_id BIGINT REFERENCES kind_of_sport(id) ON DELETE RESTRICT,
  created TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ########################### Difficulty level ###########################
CREATE TABLE IF NOT EXISTS difficulty_level (
  level INTEGER NOT NULL UNIQUE,
  name TEXT NOT NULL UNIQUE
);

INSERT INTO difficulty_level (level, name) VALUES (1, 'beginner') ON CONFLICT DO NOTHING;
INSERT INTO difficulty_level (level, name) VALUES (2, 'intermediate') ON CONFLICT DO NOTHING;
INSERT INTO difficulty_level (level, name) VALUES (3, 'advance') ON CONFLICT DO NOTHING;
INSERT INTO difficulty_level (level, name) VALUES (4, 'monster') ON CONFLICT DO NOTHING;
-- ######################################################


-- ########################### Training type ###########################
CREATE TABLE IF NOT EXISTS training_type (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

INSERT INTO training_type (name) VALUES ('fat burning') ON CONFLICT DO NOTHING;
INSERT INTO training_type (name) VALUES ('rep building') ON CONFLICT DO NOTHING;
INSERT INTO training_type (name) VALUES ('strength building') ON CONFLICT DO NOTHING;
-- ######################################################


CREATE TABLE IF NOT EXISTS training (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  difficulty_level INTEGER REFERENCES difficulty_level(level) ON DELETE RESTRICT,
  is_daily BOOLEAN DEFAULT FALSE,
  is_hidden BOOLEAN DEFAULT TRUE,
  type INTEGER REFERENCES training_type(id) ON DELETE RESTRICT,
  user_id BIGINT REFERENCES users(id) ON DELETE RESTRICT,
  sport_id BIGINT REFERENCES kind_of_sport(id) ON DELETE RESTRICT,
  duration INTEGER,
  created TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS training_round (
  id BIGSERIAL PRIMARY KEY,
  training_id BIGINT REFERENCES training(id) ON DELETE CASCADE,
  reps INTEGER DEFAULT 1,
  position INTEGER NOT NULL -- позиция упражнения в тренировке, при удалении сохраняем последовательность
);

CREATE TABLE IF NOT EXISTS exercise (
  id BIGSERIAL PRIMARY KEY,
  exercise_template_id BIGINT REFERENCES exercise_template(id) ON DELETE RESTRICT,
  duration INTEGER DEFAULT 0, -- by seconds
  reps INTEGER DEFAULT 0,
  round BIGINT REFERENCES training_round(id) ON DELETE CASCADE
);

-- Программа тренировок создается по выбору на кол-во дней (max 30 дней за раз, minimum 1 день)
CREATE TABLE IF NOT EXISTS program (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE RESTRICT,
  duration INTEGER NOT NULL, -- by days
  sport_id BIGINT REFERENCES kind_of_sport(id) ON DELETE RESTRICT,
  is_paid BOOLEAN DEFAULT TRUE,
  difficulty_level INTEGER REFERENCES difficulty_level(level) ON DELETE RESTRICT, -- automatic on server aggregate all trainings difficulties
  created TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Если день пропущен, то это rest day
CREATE TABLE IF NOT EXISTS training_program_link (
  id BIGSERIAL PRIMARY KEY,
  program_id BIGINT REFERENCES program(id) ON DELETE CASCADE,
  training_id BIGINT REFERENCES training(id) ON DELETE RESTRICT,
  day INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS bought_program (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE RESTRICT,
  program_id BIGINT REFERENCES program(id) ON DELETE RESTRICT,
  bought TIMESTAMP WITH TIME ZONE DEFAULT now()
);
