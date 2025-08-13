-- CRITICAL ANIMAL WELFARE FIX: Remove harmful timing advice from all activities
-- Replace completion criteria that could overwhelm dogs

-- Update mental activities with proper completion guidance
UPDATE activities 
SET instructions = CASE
  WHEN pillar = 'mental' THEN 
    array_replace(
      array_replace(
        array_replace(instructions, 
          'Complete when dog shows understanding or after 15-20 minutes maximum', 
          'End when dog succeeds 2-3 times or shows any sign of frustration (typically 2-5 minutes)'
        ),
        'Continue until dog understands completely or 15-20 minutes maximum',
        'End when dog succeeds consistently or shows signs of mental fatigue (usually 2-5 minutes)'
      ),
      'Practice for 15-20 minutes maximum',
      'Practice for 2-5 minutes, ending on a positive note'
    )
  WHEN pillar = 'physical' THEN
    array_replace(
      array_replace(instructions,
        'Complete when dog shows understanding or after 15-20 minutes maximum',
        'Stop when dog shows fatigue signs: heavy panting, slowing down, or seeking rest'
      ),
      'Continue for 15-20 minutes',
      'Continue until dog shows signs of tiredness, taking breaks as needed'
    )
  WHEN pillar = 'social' THEN
    array_replace(instructions,
      'Complete when dog shows understanding or after 15-20 minutes maximum',
      'Watch dog comfort level - end when still having positive interactions'
    )
  WHEN pillar = 'environmental' THEN
    array_replace(instructions,
      'Complete when dog shows understanding or after 15-20 minutes maximum',
      'Let dog explore at their own pace - no time pressure needed'
    )
  WHEN pillar = 'instinctual' THEN
    array_replace(instructions,
      'Complete when dog shows understanding or after 15-20 minutes maximum',
      'End when dog is satisfied or shows disinterest (usually 5-10 minutes)'
    )
  ELSE instructions
END
WHERE array_to_string(instructions, ' ') ILIKE '%15-20 minutes%' 
   OR array_to_string(instructions, ' ') ILIKE '%until dog understands completely%'
   OR array_to_string(instructions, ' ') ILIKE '%complete when dog shows understanding%';

-- Add helpful completion guidance for any activities missing it
UPDATE activities 
SET instructions = instructions || CASE
  WHEN pillar = 'mental' THEN ARRAY['Remember: End on success, watch for signs of frustration, and keep learning sessions short and positive']
  WHEN pillar = 'physical' THEN ARRAY['Remember: Monitor for fatigue signs and provide water breaks as needed']
  WHEN pillar = 'social' THEN ARRAY['Remember: Watch dog body language and comfort level throughout the activity']
  WHEN pillar = 'environmental' THEN ARRAY['Remember: Allow dog to explore at their own pace without time pressure']
  WHEN pillar = 'instinctual' THEN ARRAY['Remember: Let dog follow their natural instincts and end when satisfied']
  ELSE ARRAY['Remember: Always prioritize your dog wellbeing and end on a positive note']
END
WHERE NOT array_to_string(instructions, ' ') ILIKE '%remember:%';