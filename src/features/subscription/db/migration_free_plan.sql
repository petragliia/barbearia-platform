-- Migration: Add Free Plan Support
-- Description: Adds columns to support the Free Plan logic as default.

-- 1. Add 'plan_tier' column with default 'free'
ALTER TABLE barbershops 
ADD COLUMN IF NOT EXISTS plan_tier TEXT DEFAULT 'free';

-- 2. Add 'max_barbers' column (Limit for free plan is 1)
ALTER TABLE barbershops 
ADD COLUMN IF NOT EXISTS max_barbers INTEGER DEFAULT 1;

-- 3. Add 'whatsapp_enabled' column (Disabled for free plan)
ALTER TABLE barbershops 
ADD COLUMN IF NOT EXISTS whatsapp_enabled BOOLEAN DEFAULT false;

-- 4. Update existing rows (if any) to have these defaults explicitly if needed
UPDATE barbershops 
SET plan_tier = 'free', max_barbers = 1, whatsapp_enabled = false 
WHERE plan_tier IS NULL;

-- 5. (Optional) Create an index on plan_tier if we plan to query stats by plan
CREATE INDEX IF NOT EXISTS idx_barbershops_plan_tier ON barbershops(plan_tier);
