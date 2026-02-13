CREATE TABLE IF NOT EXISTS assessments (
  id SERIAL PRIMARY KEY,
  user_id varchar NOT NULL,
  enrollment_id integer NOT NULL REFERENCES enrollments(id),
  score integer NOT NULL,
  skill_level text NOT NULL,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP
);
