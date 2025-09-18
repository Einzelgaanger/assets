-- Add category column to existing files table
ALTER TABLE public.files ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'initial';

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_files_category ON public.files(category);
