export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://duke-free-food-finder-alb-1670048241.us-east-1.elb.amazonaws.com'

// Duke coordinates
export const DUKE_CENTER = [36.0014, -78.9382]

export function resolveImageUrl(url) {
  if (!url) return null
  if (/^https?:\/\//i.test(url)) return url
  return `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`
}
