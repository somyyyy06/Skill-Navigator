-- Add new columns to progress table
ALTER TABLE progress ADD COLUMN IF NOT EXISTS attempt_count integer DEFAULT 1;
ALTER TABLE progress ADD COLUMN IF NOT EXISTS time_spent_seconds integer DEFAULT 0;
ALTER TABLE progress ADD COLUMN IF NOT EXISTS started_at timestamp;

-- Add is_active column to daily_stats
ALTER TABLE daily_stats ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- Create session_logs table
CREATE TABLE IF NOT EXISTS session_logs (
  id SERIAL PRIMARY KEY,
  user_id varchar NOT NULL,
  enrollment_id integer NOT NULL REFERENCES enrollments(id),
  step_id integer NOT NULL REFERENCES steps(id),
  session_started timestamp DEFAULT CURRENT_TIMESTAMP,
  session_ended timestamp,
  time_spent_seconds integer NOT NULL DEFAULT 0,
  retry_attempt integer NOT NULL DEFAULT 1
);

-- Create user_metrics table
CREATE TABLE IF NOT EXISTS user_metrics (
  id SERIAL PRIMARY KEY,
  user_id varchar NOT NULL,
  enrollment_id integer NOT NULL REFERENCES enrollments(id),
  avg_time_per_step integer DEFAULT 0,
  retry_frequency real DEFAULT 0,
  completion_speed real DEFAULT 0,
  streak_length integer DEFAULT 0,
  doubt_frequency integer DEFAULT 0,
  last_updated timestamp DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_session_logs_user_id ON session_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_session_logs_enrollment_id ON session_logs(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_user_metrics_user_id ON user_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_user_metrics_enrollment_id ON user_metrics(enrollment_id);
