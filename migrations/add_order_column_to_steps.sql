-- Add missing 'order' column to steps table if it doesn't exist
ALTER TABLE steps
ADD COLUMN IF NOT EXISTS "order" integer DEFAULT 1;

-- Create sequence for order if needed
CREATE SEQUENCE IF NOT EXISTS steps_order_seq START WITH 1 INCREMENT BY 1;

-- Update existing rows with sequential order values if they don't have them
UPDATE steps
SET "order" = DEFAULT
WHERE "order" IS NULL OR "order" = 0;
