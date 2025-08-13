-- Enhance discovered activities with more detailed instructions
UPDATE activities 
SET instructions = CASE 
  WHEN pillar = 'mental' THEN 
    ARRAY[
      'Set up activity in quiet space with minimal distractions (2-3 minutes setup)',
      instructions[1] || ' - Start slowly and let dog understand the goal',
      COALESCE(instructions[2], 'Watch dog''s body language for engagement vs. frustration signs'),
      COALESCE(instructions[3], 'If dog struggles, break task into smaller steps or provide gentle guidance'),
      'Take 30-second breaks if dog loses focus or seems overwhelmed',
      'Complete when dog shows understanding or after 15-20 minutes maximum',
      'Always end on a positive note with treats and praise'
    ]
  WHEN pillar = 'physical' THEN
    ARRAY[
      'SAFETY: Check weather conditions and ensure adequate water supply',
      'Start with 3-5 minute warm-up at gentle pace to prevent injury',
      instructions[1] || ' - Monitor for signs of fatigue: heavy panting, slowing down, excessive drooling',
      COALESCE(instructions[2], 'Take water breaks every 10-15 minutes during activity'),
      COALESCE(instructions[3], 'If dog shows distress or overheating, stop immediately and move to shade'),
      'Cool down with slow movement for 5 minutes to prevent muscle stiffness',
      'Check paws and overall condition after activity - watch for cuts or soreness'
    ]
  WHEN pillar = 'social' THEN
    ARRAY[
      'Choose appropriate environment - not too crowded or overwhelming initially',
      instructions[1] || ' - Start with brief 10-15 minute exposures',
      COALESCE(instructions[2], 'Watch dog''s comfort level: relaxed vs. stressed body language'),
      'Reward calm, confident behavior immediately with treats and praise',
      'If dog shows anxiety (trembling, hiding), reduce intensity and try again later',
      'Allow dog to approach interactions at their own pace - never force',
      'End session on positive note before dog becomes tired or overstimulated'
    ]
  ELSE instructions
END
WHERE source = 'discovered' 
AND array_length(instructions, 1) < 5;