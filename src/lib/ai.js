// Calls your Supabase Edge Function (which holds the LLM key securely).
// If env vars are not set, falls back to mock recipes so the UI works immediately.

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

const withIds = (recipes) =>
  recipes.map((r, i) => ({ ...r, id: r.id || `${Date.now()}-${i}` }));

export async function generateRecipes(ingredients) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    await new Promise((r) => setTimeout(r, 1400));
    return withIds(mockRecipes(ingredients));
  }

  const res = await fetch(`${SUPABASE_URL}/functions/v1/generate-recipes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ ingredients }),
  });

  if (!res.ok) throw new Error('Could not generate recipes. Please try again.');
  const data = await res.json();
  if (!Array.isArray(data.recipes) || data.recipes.length === 0) {
    throw new Error('No recipes came back. Try different ingredients.');
  }
  return withIds(data.recipes);
}

function mockRecipes(ing) {
  const list = ing.join(', ');
  return [
    {
      title: 'Everything Skillet Scramble',
      emoji: '🍳',
      time: '10 min',
      difficulty: 'Easy',
      description: `A fast, cozy scramble built around ${list}.`,
      ingredients: ing.map((i) => `${i}, as much as you have`),
      steps: [
        'Heat a pan over medium heat with a little oil or butter.',
        'Add the firmest ingredients first and cook 3 minutes.',
        'Add softer items and season with salt and pepper.',
        'Finish with anything melty or fresh, then serve warm.',
      ],
    },
    {
      title: 'Clean-Out-The-Fridge Bowl',
      emoji: '🥗',
      time: '15 min',
      difficulty: 'Easy',
      description: 'Layer, drizzle, done. Great for leftovers.',
      ingredients: ing.map((i) => i),
      steps: [
        'Warm or chop everything into bite-size pieces.',
        'Arrange in a bowl over a base like rice or greens.',
        'Drizzle with oil, lemon or any sauce you have.',
      ],
    },
    {
      title: 'Crispy Fridge Fritters',
      emoji: '🥞',
      time: '20 min',
      difficulty: 'Medium',
      description: 'Bind it all with egg and flour and pan-fry golden.',
      ingredients: [...ing, 'flour or breadcrumbs', '1 egg'],
      steps: [
        'Finely chop or grate the ingredients.',
        'Mix with egg and a few spoons of flour into a thick batter.',
        'Pan-fry spoonfuls 2 to 3 minutes per side until golden.',
      ],
    },
  ];
}
