-- CREATE TABLE IF NOT EXISTS bought_program (
--   id BIGSERIAL PRIMARY KEY,
--   user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
--   program_id BIGINT REFERENCES program(id) ON DELETE RESTRICT,
--   transaction TEXT NOT NULL,
--   bought_date TIMESTAMP WITH TIME ZONE DEFAULT now()
-- );
