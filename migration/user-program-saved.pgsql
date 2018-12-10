CREATE TABLE IF NOT EXISTS user_program_saved (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE RESTRICT,
  program_id BIGINT REFERENCES program(id) ON DELETE CASCADE,
  save_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, program_id)
);

CREATE TABLE IF NOT EXISTS user_training_saved (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE RESTRICT,
  training_id BIGINT REFERENCES training(id) ON DELETE CASCADE,
  save_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, training_id)
);

