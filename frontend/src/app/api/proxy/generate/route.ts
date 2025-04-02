// app/api/proxy/route2.ts
export async function POST(request: Request) {
    try {
      // Parse JSON instead of form data
      const payload = await request.json();
      
      // Forward the request to the actual API
      const response = await fetch('http://localhost:5000/contract/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      const data = await response.json();
      return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Proxy error:', error);
      return new Response(JSON.stringify({ error: (error instanceof Error) ? error.message : 'An unknown error occurred' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  