-- Create storage bucket for research files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('research-files', 'research-files', true);

-- Create policy for public file uploads
CREATE POLICY "Anyone can upload research files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'research-files');

-- Create policy for public file access
CREATE POLICY "Anyone can view research files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'research-files');

-- Create policy for public file deletion (optional - you can remove this if you don't want deletion)
CREATE POLICY "Anyone can delete research files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'research-files');