// @ts-nocheck
// Supabase Edge Function: keeps your LLM API key off the device.
// Deploy:  supabase functions deploy generate-recipes
// Secret:  supabase secrets set GEMINI_API_KEY=your_key_here

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });

  try {
    const { ingredients } = await req.json();
    if (!Array.isArray(ingredients) || ingredients.length === 0 || ingredients.length > 25) {
      return json({ error: 'Provide 1-25 ingredients' }, 400);
    }
    const list = ingredients.map((i: unknown) => String(i).slice(0, 40)).join(', ');

    const prompt = `You are a friendly home chef. Using ONLY these ingredients (plus water, salt, pepper, and cooking oil): ${list}.
Create 3 different easy recipes. Respond with JSON only, in this exact shape:
{"recipes":[{"title":string,"emoji":string (one food emoji),"time":string like "15 min","difficulty":"Easy"|"Medium","description":string (one short sentence),"ingredients":[string with amounts],"steps":[string]}]}`;

    const model = Deno.env.get('GEMINI_MODEL') ?? 'gemini-2.5-flash';
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': Deno.env.get('GEMINI_API_KEY') ?? '',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      },
    );

    if (!res.ok) return json({ error: 'LLM request failed' }, 502);
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}';
    return json(JSON.parse(text));
  } catch (_e) {
    return json({ error: 'Something went wrong' }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
}
