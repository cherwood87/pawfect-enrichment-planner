
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { existingActivities, dogProfile, maxActivities = 8, qualityThreshold = 0.6 } = await req.json();

    console.log(`Discovering activities for dog: ${dogProfile?.name || 'Unknown'}`);
    console.log(`Existing activities count: ${existingActivities?.length || 0}`);

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Build context about existing activities
    const existingTitles = existingActivities?.map((a: any) => a.title) || [];
    const pillarCounts = existingActivities?.reduce((acc: any, activity: any) => {
      acc[activity.pillar] = (acc[activity.pillar] || 0) + 1;
      return acc;
    }, {}) || {};

    // Create prompt for AI to generate new activities
    const systemPrompt = `You are an expert dog enrichment specialist. Generate ${maxActivities} unique, creative enrichment activities for dogs based on the 5 pillars: Mental, Physical, Social, Environmental, and Instinctual.

Dog Profile:
- Name: ${dogProfile?.name || 'Unknown'}
- Age: ${dogProfile?.age || 'Unknown'} years
- Breed: ${dogProfile?.breed || 'Mixed'}
- Energy Level: ${dogProfile?.energyLevel || 'Medium'}
- Living Situation: ${dogProfile?.livingSituation || 'House'}
- Mobility Issues: ${dogProfile?.mobilityIssues?.join(', ') || 'None'}

Current Activity Distribution:
${Object.entries(pillarCounts).map(([pillar, count]) => `- ${pillar}: ${count} activities`).join('\n')}

Existing Activity Titles (DO NOT duplicate):
${existingTitles.slice(0, 20).join(', ')}

Requirements:
1. Generate ONLY unique activities not in the existing list
2. Focus on practical, safe activities suitable for the dog's profile
3. Balance across all 5 pillars based on needs
4. Consider the dog's age, breed, energy level, and any mobility issues
5. Each activity should be creative but achievable

Return ONLY a valid JSON array with this exact structure:
[
  {
    "title": "Activity Name",
    "pillar": "mental|physical|social|environmental|instinctual",
    "difficulty": "Easy|Medium|Hard",
    "duration": 15,
    "materials": ["item1", "item2"],
    "instructions": ["step1", "step2", "step3"],
    "benefits": "Brief description of benefits",
    "emotionalGoals": ["goal1", "goal2"],
    "tags": ["tag1", "tag2"],
    "ageGroup": "Puppy|Adult|Senior|All Ages",
    "energyLevel": "Low|Medium|High",
    "confidence": 0.85
  }
]`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Generate ${maxActivities} unique enrichment activities for this ${dogProfile?.breed || 'dog'} considering their specific needs and avoiding duplicates.` }
        ],
        temperature: 0.8,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    console.log('AI Response received, parsing activities...');

    // Parse the JSON response
    let activities;
    try {
      // Extract JSON from response if it's wrapped in markdown
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      const jsonString = jsonMatch ? jsonMatch[0] : content;
      activities = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.error('Raw content:', content);
      throw new Error('Failed to parse AI response as JSON');
    }

    // Validate and filter activities
    const validActivities = activities.filter((activity: any) => {
      const isValid = activity.title && 
                     activity.pillar && 
                     ['mental', 'physical', 'social', 'environmental', 'instinctual'].includes(activity.pillar) &&
                     activity.difficulty &&
                     ['Easy', 'Medium', 'Hard'].includes(activity.difficulty) &&
                     activity.confidence >= qualityThreshold;
      
      if (!isValid) {
        console.log(`Filtered out invalid activity: ${activity.title}`);
      }
      
      return isValid;
    }).slice(0, maxActivities);

    console.log(`Generated ${validActivities.length} valid activities`);

    return new Response(JSON.stringify({ 
      activities: validActivities,
      message: `Successfully generated ${validActivities.length} new enrichment activities`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in discover-activities function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      activities: [] 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
