export function GET() {
  return new Response('google-site-verification: google27d67ef3554303ff.html', {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=3600',
    },
  });
}
