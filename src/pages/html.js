export const prerender = false;

export async function GET(context) {
  const name = context.url.searchParams.get('name');
  console.log(context);

  return new Response(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
      </head>
      <body>
      <h1>Hello World 2</h1>
      <p>Query param name: ${name || 'not provided'}</p>
      </body>
      </html>
    `, {
    headers: {
      'Content-Type': 'text/html'
    },
    status: 200
  });
} 
