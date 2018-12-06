CREATE TABLE IF NOT EXISTS training (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  difficulty_level INTEGER REFERENCES difficulty_level(level) ON DELETE RESTRICT,
  is_daily BOOLEAN DEFAULT FALSE,
  is_hidden BOOLEAN DEFAULT TRUE,
  type_id INTEGER REFERENCES training_type(id) ON DELETE RESTRICT,
  user_id BIGINT REFERENCES users(id) ON DELETE RESTRICT,
  sport_id BIGINT REFERENCES sport(id) ON DELETE RESTRICT,
  duration INTEGER REFERENCES training_duration(id) ON DELETE RESTRICT,
  modified_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_date TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS training_round (
  id BIGSERIAL PRIMARY KEY,
  training_id BIGINT REFERENCES training(id) ON DELETE CASCADE,
  sets INTEGER DEFAULT 1,
  position INTEGER NOT NULL,
  exercises BIGINT[]
);

CREATE TABLE IF NOT EXISTS training_program_link (
  id BIGSERIAL PRIMARY KEY,
  program_id BIGINT REFERENCES program(id) ON DELETE CASCADE,
  training_id BIGINT REFERENCES training(id) ON DELETE RESTRICT,
  day INTEGER NOT NULL
);


CREATE OR REPLACE FUNCTION update_training_modified_date() RETURNS TRIGGER AS
  $BODY$
    BEGIN
      UPDATE training SET modified_date=now();
      RETURN new;
    END;
  $BODY$
  LANGUAGE plpgsql;

CREATE TRIGGER trainingUpdate AFTER UPDATE ON training FOR EACH ROW EXECUTE PROCEDURE update_training_modified_date();
