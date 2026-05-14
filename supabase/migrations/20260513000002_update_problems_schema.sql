-- Migration to add category and tags to problems
ALTER TABLE public.problems 
ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'General',
ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS constraints TEXT;

-- Update existing problems with some categories
UPDATE public.problems SET category = 'Fundamentals', tags = '["strings", "basics"]'::jsonb WHERE title = 'Hello World';
UPDATE public.problems SET category = 'Arrays', tags = '["arrays", "math"]'::jsonb WHERE title = 'Sum of Array';
UPDATE public.problems SET category = 'Algorithms', tags = '["recursion", "dynamic programming"]'::jsonb WHERE title = 'Fibonacci Sequence';
