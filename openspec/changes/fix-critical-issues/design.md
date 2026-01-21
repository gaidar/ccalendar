# Design: Fix Critical and High-Priority Issues

## Context

A comprehensive code review identified multiple issues affecting production reliability and performance. This design document covers the technical decisions for the most significant changes.

## Goals / Non-Goals

### Goals
- Fix critical rate limiting bug affecting all authenticated users
- Ensure rate limiting works correctly in multi-instance deployments
- Eliminate N+1 query patterns degrading performance
- Add proper error handling for async operations
- Improve response times with compression and caching

### Non-Goals
- Rewrite entire rate limiting system (incremental fix)
- Add new features beyond fixes
- Change API contracts (backward compatible)

## Decisions

### 1. Redis-Based Export Rate Limiter

**Decision**: Replace in-memory Map with Redis using `INCR` and `EXPIRE` commands.

**Implementation Pattern**:
```typescript
// Key format: export:ratelimit:{userId}
const key = `export:ratelimit:${userId}`;
const count = await redis.incr(key);
if (count === 1) {
  await redis.expire(key, WINDOW_SECONDS);
}
if (count > MAX_REQUESTS) {
  throw new HttpError(429, 'RATE_LIMIT_EXCEEDED', ...);
}
```

**Alternatives Considered**:
- **Sliding window with ZSET**: More accurate but more complex; not needed for 5/hour limit
- **Token bucket**: Overkill for simple rate limiting
- **Keep in-memory with sticky sessions**: Doesn't scale, adds deployment complexity

**Fallback**: If Redis unavailable, allow requests with warning log (fail open for exports, not security-critical).

### 2. Country Lookup Cache

**Decision**: Use `Map<string, Country>` initialized at startup.

**Implementation Pattern**:
```typescript
// In countriesService.ts
let countryCache: Map<string, Country> | null = null;

export function initializeCache(countries: Country[]): void {
  countryCache = new Map(countries.map(c => [c.code, c]));
}

export function getCountryByCode(code: string): Country | undefined {
  return countryCache?.get(code);
}
```

**Rationale**:
- Countries list is static (~200 entries, ~20KB)
- O(1) lookup vs O(n) array find
- No external dependency needed
- Memory impact negligible

**Alternatives Considered**:
- **Redis cache**: Unnecessary for static data
- **Keep as array with binary search**: More complex, minimal benefit

### 3. Response Compression

**Decision**: Use `compression` middleware with level 6.

**Configuration**:
```typescript
import compression from 'compression';
app.use(compression({
  level: 6,
  threshold: 1024, // Only compress responses > 1KB
  filter: (req, res) => {
    // Don't compress streams (exports)
    if (req.path.includes('/export')) return false;
    return compression.filter(req, res);
  }
}));
```

**Rationale**:
- Level 6 is balanced (good compression, acceptable CPU)
- Skip exports (already streaming, would buffer)
- Threshold avoids compressing tiny responses

### 4. Streaming CSV Export

**Decision**: Use async generator with `Readable.from()`.

**Implementation Pattern**:
```typescript
async function* generateCsvStream(records: TravelRecord[]): AsyncGenerator<string> {
  yield 'Date,Country Code,Country Name\n';
  for (const record of records) {
    const country = getCountryByCode(record.countryCode);
    const name = escapeCsvField(country?.name || record.countryCode);
    yield `${record.date},${record.countryCode},${name}\n`;
  }
}

const stream = Readable.from(generateCsvStream(records));
```

**Rationale**:
- Memory-efficient for large exports
- Works with existing pipe infrastructure
- No external dependencies

### 5. API Request Timeout

**Decision**: Use AbortController with 30-second default timeout.

**Implementation Pattern**:
```typescript
export async function apiRequest<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const timeout = options.timeout ?? 30000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    // ... handle response
  } finally {
    clearTimeout(timeoutId);
  }
}
```

**Rationale**:
- Standard browser API
- 30s reasonable for most operations
- Exports may need longer timeout (configurable)

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Redis unavailable breaks exports | Fail open with warning; exports are not security-critical |
| Compression adds CPU overhead | Level 6 is moderate; skip streaming endpoints |
| Cache invalidation if countries change | Countries are static; manual restart would refresh |
| Breaking rate limit for existing sessions | Deploy during low-traffic window |

## Migration Plan

1. **Phase 1**: Deploy rate limiter fix (immediate, low risk)
2. **Phase 2**: Deploy Redis rate limiter, country cache, compression (together)
3. **Phase 3**: Deploy streaming export, error handling improvements
4. **Phase 4**: Deploy P2 items incrementally

**Rollback**: All changes are backward compatible; can revert individual commits.

## Open Questions

- Should export rate limiter use same Redis instance as session cache?
  - **Answer**: Yes, reuse existing connection pool
- Should we add retry logic for failed emails?
  - **Decision**: Log errors now; job queue is future enhancement
