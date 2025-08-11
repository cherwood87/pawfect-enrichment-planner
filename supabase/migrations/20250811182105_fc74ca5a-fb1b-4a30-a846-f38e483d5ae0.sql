-- Fix oversized base64 images that are causing network failures
-- Clear image data for dogs where image is larger than 1MB (base64 encoded)
UPDATE dogs 
SET image = NULL 
WHERE image IS NOT NULL 
  AND length(image) > 1000000;