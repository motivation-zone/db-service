-- Программа тренировок создается по выбору на кол-во дней (max 30 дней за раз, minimum 1 день)
CREATE TABLE IF NOT EXISTS program (
  id BIGSERIAL PRIMARY KEY, -- identification for image
  user_id BIGINT REFERENCES users(id) ON DELETE RESTRICT,
  sport_id BIGINT REFERENCES sport(id) ON DELETE RESTRICT,
  price DECIMAL(19,2) DEFAULT 0,
  difficulty_level INTEGER REFERENCES difficulty_level(level) ON DELETE RESTRICT,
  modified_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_date TIMESTAMP WITH TIME ZONE DEFAULT now()
);


CREATE OR REPLACE FUNCTION update_program_modified_date() RETURNS TRIGGER AS
  $BODY$
    BEGIN
      UPDATE program SET modified_date=now();
      RETURN new;
    END;
  $BODY$
  LANGUAGE plpgsql;

CREATE TRIGGER programUpdate AFTER UPDATE ON program FOR EACH ROW EXECUTE PROCEDURE update_program_modified_date();
