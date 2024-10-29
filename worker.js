addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)

  // /proxy/:match/:url* 转发到 https
  if (url.pathname.startsWith('/proxy/')) {
    const pathParts = url.pathname.split('/')
    const match = pathParts[2]
    const targetUrl = `https://${match}/${pathParts.slice(3).join('/')}`

    return fetch(buildUrl(targetUrl, url), request)
  }

  // /httpproxy/:match/:url* 转发到 http
  if (url.pathname.startsWith('/httpproxy/')) {
    const pathParts = url.pathname.split('/')
    const match = pathParts[2]
    const targetUrl = `http://${match}/${pathParts.slice(3).join('/')}`

    return fetch(buildUrl(targetUrl, url), request)
  }

  return new Response('Not found', { status: 404 })
}

// Helper function to reconstruct URL with query params
function buildUrl(baseUrl, originalUrl) {
  const originalUrlObj = new URL(originalUrl)
  const newUrlObj = new URL(baseUrl)

  // Copy query parameters
  for (const [key, value] of originalUrlObj.searchParams) {
    newUrlObj.searchParams.append(key, value)
  }

  return newUrlObj.toString()
}
