export default defineEventHandler((event) => {
  const url = event.node.req.url || ''

  if (url.startsWith('/_ipx/')) {
    setHeader(event, 'Cache-Control', 'public, max-age=604800, immutable')
  }
})