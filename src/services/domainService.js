/**
 * Real Domain Availability Service for GoMummy
 *
 * Uses DNS-over-HTTPS (DoH) via Google Public DNS (https://dns.google/resolve)
 * querying the SOA (Start of Authority) record.
 *
 * Benefits:
 * - Direct browser execution without server proxy or CORS issues
 * - Free, reliable, and millisecond-fast
 * - Accurate across .com, .io, .ai, .co:
 *   - Status 0 (NOERROR) -> Domain is registered (TAKEN)
 *   - Status 3 (NXDOMAIN) -> Domain is unregistered (AVAILABLE)
 */

export async function checkDomainAvailability(domainWithTld) {
  const clean = (domainWithTld || '').toLowerCase().trim()
  if (!clean || !clean.includes('.')) {
    return 'unknown'
  }

  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 4000)

    const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(clean)}&type=SOA`, {
      method: 'GET',
      headers: { accept: 'application/dns-json' },
      signal: controller.signal,
    })
    clearTimeout(timer)

    if (!res.ok) {
      return 'unknown'
    }

    const data = await res.json()
    // DNS Status 0 = NOERROR (registered / active zone)
    // DNS Status 3 = NXDOMAIN (does not exist / available)
    if (data.Status === 0) {
      return 'taken'
    }
    if (data.Status === 3) {
      return 'available'
    }
    return 'unknown'
  } catch {
    return 'unknown'
  }
}

/**
 * Checks a batch of domains concurrently with a concurrency limit
 */
export async function checkDomainsBatch(domainList) {
  const results = await Promise.allSettled(
    domainList.map(async (domain) => {
      const state = await checkDomainAvailability(domain)
      return { domain, state }
    })
  )

  const map = {}
  for (const item of results) {
    if (item.status === 'fulfilled') {
      map[item.value.domain] = item.value.state
    }
  }
  return map
}
