CREATE TABLE IF NOT EXISTS exercise_template (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  user_id UUID REFERENCES users(id) ON DELETE RESTRICT NOT NULL,
  sport_id BIGINT REFERENCES sport(id) ON DELETE RESTRICT NOT NULL,
  difficulty_level_id BIGINT REFERENCES difficulty_level(id) ON DELETE RESTRICT NOT NULL,
  created_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(title, description, user_id, sport_id)
);

CREATE INDEX index_exercise_template__sport_id ON exercise_template (sport_id);
CREATE INDEX index_exercise_template__user_id ON exercise_template (user_id);
CREATE INDEX index_exercise_template__difficulty_level_id ON exercise_template (difficulty_level_id);
CREATE INDEX index_exercise_template__sport_id__user_id ON exercise_template (user_id, sport_id);
CREATE INDEX index_exercise_template__user_id__difficulty_level_id ON exercise_template (user_id, difficulty_level_id);
CREATE INDEX index_exercise_template__sport_id__difficulty_level_id ON exercise_template (sport_id, difficulty_level_id);
CREATE INDEX index_exercise_template__user_id__sport_id__difficulty_level_id ON exercise_template (user_id, sport_id, difficulty_level_id);

CREATE TABLE IF NOT EXISTS exercise (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  exercise_template_id UUID REFERENCES exercise_template(id) ON DELETE RESTRICT NOT NULL,
  value INTEGER NOT NULL,
  type EXERCISE_VALUE_TYPE NOT NULL,
  created_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(exercise_template_id, value, type)
);

CREATE INDEX index_exercise__exercise_template_id ON exercise (exercise_template_id);
