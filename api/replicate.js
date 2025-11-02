export default async function handler(req, res) {
  // CORS 헤더
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { image, prompt, style } = req.body;

    if (!image || !prompt) {
      return res.status(400).json({ error: 'Missing image or prompt' });
    }

    // FLUX ControlNet API 호출
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.VITE_REPLICATE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        version: "bb0da9f3aaaa357c0cc82e2002c2e8f88ee4c81e3c9cf21d8acbfeb8c86ea0a2", // FLUX dev ControlNet
        input: {
          control_image: image,
          prompt: prompt,
          control_strength: 0.5,
          num_inference_steps: 28,
          guidance_scale: 3.5,
          output_format: "jpg",
          output_quality: 90
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Replicate API error:', response.status, errorText);
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message });
  }
}
