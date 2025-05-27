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
    const { messages, dogProfile, activityHistory, pillarBalance } = await req.json();

    // Build context-aware system prompt
    const systemPrompt = `You are an expert dog enrichment coach specializing in the 5 pillars of enrichment: Mental, Physical, Social, Environmental, and Instinctual.

Current Dog Profile:
- Name: ${dogProfile?.name || 'Unknown'}
- Age: ${dogProfile?.age || 'Unknown'} years
- Breed: ${dogProfile?.breed || 'Unknown'}
- Size: ${dogProfile?.size || 'Unknown'}
- Energy Level: ${dogProfile?.energyLevel || 'Unknown'}
- Mobility Issues: ${dogProfile?.mobilityIssues || 'None'}
- Living Situation: ${dogProfile?.livingSituation || 'Unknown'}

Recent Activity Balance:
${Object.entries(pillarBalance || {}).map(([pillar, count]) => `- ${pillar}: ${count} activities today`).join('\n')}

Quiz Results: ${dogProfile?.quizResults ? `Top pillars: ${dogProfile.quizResults.ranking.slice(0, 2).map(r => r.pillar).join(', ')}` : 'Not completed'}

Guidelines:
- Always consider the dog's specific profile, limitations, and preferences
- Provide practical, actionable enrichment suggestions
- Focus on balancing all 5 pillars based on the dog's needs
- Be encouraging and supportive
- Keep responses concise but helpful
- Suggest specific activities when appropriate
- Consider the dog's living situation and any mobility issues
- When you recommend a specific enrichment activity, always include a JSON object for the activity immediately following your suggestion, using this format:

{
  "title": "Activity Name",
  "pillar": "mental|physical|social|environmental|instinctual",
  "difficulty": "Easy|Medium|Hard",
  "duration": 15,
  "materials": ["item1", "item2"],
  "instructions": ["step1", "step2"],
  "benefits": "Brief description",
  "emotionalGoals": ["goal1", "goal2"],
  "tags": ["tag1", "tag2"],
  "ageGroup": "Puppy|Adult|Senior|All Ages",
  "energyLevel": "Low|Medium|High"
}

Always write the JSON exactly as shown, and do not include any markdown or commentary inside the JSON. Only suggest activities that are not already in the provided activityHistory.

Respond in a friendly, expert tone as a professional dog enrichment specialist.`;

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
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;

    // Extract any JSON objects matching the activity schema from the reply
    const activityMatches = [];
    const activityRegex = /{[\s\S]*?"title":\s*".+?[\s\S]*?"energyLevel":\s*".+?"[\s\S]*?}/g;
    let match;
    while ((match = activityRegex.exec(reply)) !== null) {
      try {
        // Try to parse the JSON object
        const activityObj = JSON.parse(match[0]);
        activityMatches.push(activityObj);
      } catch (err) {
        // If parsing fails, skip this one
        continue;
      }
    }

    return new Response(JSON.stringify({
      reply,
      activities: activityMatches
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in enrichment-coach function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});