type Entry = { count: number; resetAt: number }
const buckets = new Map<string, Entry>()

export function hit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now()
  const e = buckets.get(key)
  if (!e || e.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }
  if (e.count >= max) return false
  e.count++
  return true
}

// cleanup so the map doesn't grow forever
setInterval(() => {
  const now = Date.now()
  for (const [k, v] of buckets) if (v.resetAt < now) buckets.delete(k)
}, 60_000).unref()
