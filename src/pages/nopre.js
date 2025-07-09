export const prerender = false;

export async function GET() {
  const random = Math.random();
  return new Response(
    JSON.stringify({
      message: `This is my dynamic endpoint ${random}`,
    }),
  );
}
