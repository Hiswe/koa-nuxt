export default function(nuxtContext) {
  const { req, error } = nuxtContext
  if (process.server && !req) return
  if (!req.error) return
  error({
    statusCode: req.error.statusCode || 500,
    message: req.error.message || `an fatal error as occurred`,
  })
}
