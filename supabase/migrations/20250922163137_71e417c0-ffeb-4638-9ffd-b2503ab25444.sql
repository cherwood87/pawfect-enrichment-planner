-- Clean up activities with dog names in instructions and benefits
UPDATE activities 
SET 
  instructions = ARRAY(
    SELECT 
      CASE 
        WHEN instruction LIKE '%Bebop%' THEN REPLACE(REPLACE(REPLACE(instruction, 'Bebop', 'your dog'), 'him', 'them'), 'his', 'their')
        WHEN instruction LIKE '%Lil Thing%' THEN REPLACE(instruction, 'Lil Thing', 'your dog')
        WHEN instruction LIKE '%Good Morning%' THEN REPLACE(instruction, 'Good Morning', 'your dog')
        ELSE instruction
      END
    FROM unnest(instructions) AS instruction
  ),
  benefits = 
    CASE 
      WHEN benefits LIKE '%Bebop%' THEN REPLACE(REPLACE(REPLACE(benefits, 'Bebop', 'your dog'), 'him', 'them'), 'his', 'their')
      WHEN benefits LIKE '%Lil Thing%' THEN REPLACE(benefits, 'Lil Thing', 'your dog')
      WHEN benefits LIKE '%Good Morning%' THEN REPLACE(benefits, 'Good Morning', 'your dog')
      ELSE benefits
    END
WHERE 
  instructions::text LIKE '%Bebop%' OR 
  instructions::text LIKE '%Lil Thing%' OR 
  instructions::text LIKE '%Good Morning%' OR
  benefits LIKE '%Bebop%' OR 
  benefits LIKE '%Lil Thing%' OR 
  benefits LIKE '%Good Morning%';