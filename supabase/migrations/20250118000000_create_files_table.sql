-- Create files table for storing file metadata
CREATE TABLE IF NOT EXISTS public.files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  size BIGINT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  download_url TEXT NOT NULL,
  type TEXT NOT NULL,
  path TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'initial',
  uploaded_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_files_uploaded_at ON public.files(uploaded_at DESC);
CREATE INDEX IF NOT EXISTS idx_files_name ON public.files(name);
CREATE INDEX IF NOT EXISTS idx_files_category ON public.files(category);

-- Enable Row Level Security
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Anyone can view files" 
ON public.files 
FOR SELECT 
USING (true);

-- Create policy for public insert access
CREATE POLICY "Anyone can upload files" 
ON public.files 
FOR INSERT 
WITH CHECK (true);

-- Create policy for public delete access
CREATE POLICY "Anyone can delete files" 
ON public.files 
FOR DELETE 
USING (true);

-- Create policy for public update access
CREATE POLICY "Anyone can update files" 
ON public.files 
FOR UPDATE 
USING (true);
