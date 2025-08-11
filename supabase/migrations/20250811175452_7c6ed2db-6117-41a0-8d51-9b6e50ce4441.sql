-- Add critical performance index for dogs table
CREATE INDEX IF NOT EXISTS idx_dogs_user_id ON public.dogs(user_id);

-- Create storage bucket for dog images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('dog-images', 'dog-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for dog images
CREATE POLICY "Dog images are publicly viewable" ON storage.objects
FOR SELECT USING (bucket_id = 'dog-images');

CREATE POLICY "Users can upload dog images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'dog-images' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their dog images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'dog-images' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their dog images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'dog-images' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);