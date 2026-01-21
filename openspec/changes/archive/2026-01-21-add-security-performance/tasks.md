# Tasks: Security & Performance

## 1. Helmet.js Security Headers (Backend)

- [x] 1.1 Install Helmet.js package
- [x] 1.2 Configure Content-Security-Policy (CSP)
- [x] 1.3 Set default-src to 'self'
- [x] 1.4 Configure style-src for inline styles
- [x] 1.5 Configure script-src for self
- [x] 1.6 Configure img-src for self, data, https
- [x] 1.7 Configure connect-src for API endpoints
- [x] 1.8 Configure HSTS (Strict-Transport-Security)
- [x] 1.9 Set max-age to 1 year (31536000)
- [x] 1.10 Enable includeSubDomains
- [x] 1.11 Configure X-Frame-Options (DENY)
- [x] 1.12 Configure X-Content-Type-Options (nosniff)
- [x] 1.13 Configure Referrer-Policy
- [x] 1.14 Write tests for security headers

## 2. CORS Configuration (Backend)

- [x] 2.1 Install cors middleware
- [x] 2.2 Configure allowed origins from environment
- [x] 2.3 Allow localhost for development
- [x] 2.4 Allow production frontend URL
- [x] 2.5 Configure allowed methods (GET, POST, PATCH, DELETE)
- [x] 2.6 Configure allowed headers
- [x] 2.7 Enable credentials for cookies
- [x] 2.8 Set appropriate max-age for preflight cache
- [x] 2.9 Write tests for CORS configuration

## 3. Input Sanitization (Backend)

- [x] 3.1 Create sanitization middleware
- [x] 3.2 Trim whitespace from string inputs
- [x] 3.3 Escape HTML special characters where needed
- [x] 3.4 Normalize email addresses (lowercase)
- [x] 3.5 Remove control characters from strings
- [x] 3.6 Validate and sanitize URL inputs
- [x] 3.7 Apply to all request bodies
- [x] 3.8 Write tests for input sanitization

## 4. Rate Limiting Setup (Backend)

- [x] 4.1 Install express-rate-limit package
- [x] 4.2 Install rate-limit-redis package
- [x] 4.3 Configure Redis store for rate limits
- [x] 4.4 Create global rate limiter (100/15min)
- [x] 4.5 Create auth rate limiter (registration: 3/hour)
- [x] 4.6 Create login rate limiter (5/minute)
- [x] 4.7 Create password reset rate limiter (3/hour)
- [x] 4.8 Create OAuth rate limiter (10/minute)
- [x] 4.9 Create travel records rate limiter (60/minute)
- [x] 4.10 Create export rate limiter (5/hour)
- [x] 4.11 Configure rate limit headers (X-RateLimit-*)
- [x] 4.12 Configure Retry-After header
- [x] 4.13 Write tests for rate limiting

## 5. Winston Logging Setup (Backend)

- [x] 5.1 Install Winston package
- [x] 5.2 Create logger configuration file
- [x] 5.3 Configure log levels (error, warn, info, debug)
- [x] 5.4 Configure JSON format
- [x] 5.5 Add timestamp to all logs
- [x] 5.6 Add error stack traces
- [x] 5.7 Configure Console transport
- [x] 5.8 Configure File transport for errors
- [x] 5.9 Configure File transport for combined logs
- [x] 5.10 Set log level based on environment
- [x] 5.11 Create request logging middleware
- [x] 5.12 Log request method, URL, status, duration
- [x] 5.13 Exclude sensitive data from logs
- [x] 5.14 Write tests for logging

## 6. Sentry Error Tracking (Backend)

- [x] 6.1 Install Sentry Node package
- [x] 6.2 Initialize Sentry with DSN from environment
- [x] 6.3 Configure release tracking
- [x] 6.4 Configure environment (development/staging/production)
- [x] 6.5 Add Sentry request handler middleware
- [x] 6.6 Add Sentry error handler middleware
- [x] 6.7 Configure user context capture
- [x] 6.8 Configure breadcrumbs
- [x] 6.9 Filter sensitive data from reports
- [x] 6.10 Write tests for Sentry integration

## 7. Sentry Error Tracking (Frontend)

- [x] 7.1 Install Sentry React package
- [x] 7.2 Initialize Sentry in application entry
- [x] 7.3 Configure release tracking
- [x] 7.4 Configure environment
- [x] 7.5 Add Error Boundary with Sentry reporting
- [x] 7.6 Configure user context capture
- [x] 7.7 Filter sensitive data from reports
- [x] 7.8 Write tests for error boundary

## 8. Database Indexes (Backend)

- [x] 8.1 Create migration for users.email index (if not exists)
- [x] 8.2 Create migration for travel_records(userId, date) index
- [x] 8.3 Verify unique constraint on travel_records(userId, date, countryCode)
- [x] 8.4 Verify unique constraint on oauth_accounts(provider, providerId)
- [x] 8.5 Create migration for support_tickets.referenceId index
- [x] 8.6 Create migration for support_tickets.status index
- [x] 8.7 Analyze query patterns and add indexes as needed
- [x] 8.8 Write documentation for index strategy

## 9. Redis Caching Setup (Backend)

- [x] 9.1 Install ioredis package
- [x] 9.2 Create Redis client configuration
- [x] 9.3 Configure connection from environment (REDIS_URL)
- [x] 9.4 Implement connection error handling
- [x] 9.5 Create cache utility functions (get, set, delete)
- [x] 9.6 Cache countries list (24 hour TTL)
- [x] 9.7 Implement token blacklist for logout
- [x] 9.8 Add cache invalidation on data changes
- [x] 9.9 Write tests for caching

## 10. Code Splitting (Frontend)

- [x] 10.1 Identify route-based split points
- [x] 10.2 Implement React.lazy for Landing page
- [x] 10.3 Implement React.lazy for Login page
- [x] 10.4 Implement React.lazy for Register page
- [x] 10.5 Implement React.lazy for Calendar page
- [x] 10.6 Implement React.lazy for Reports page
- [x] 10.7 Implement React.lazy for Profile page
- [x] 10.8 Implement React.lazy for Support page
- [x] 10.9 Implement React.lazy for Admin pages
- [x] 10.10 Create Suspense boundaries with loading states
- [x] 10.11 Configure Vite for optimal chunking
- [x] 10.12 Analyze bundle size and optimize

## 11. Frontend Performance Optimizations

- [x] 11.1 Implement React.memo for expensive components
- [x] 11.2 Use useMemo for expensive computations
- [x] 11.3 Use useCallback for stable function references
- [x] 11.4 Optimize re-renders with proper key usage
- [x] 11.5 Implement virtual scrolling for long lists (if needed)
- [x] 11.6 Add image lazy loading
- [x] 11.7 Preload critical resources
- [x] 11.8 Configure prefetching for likely navigation

## 12. Performance Monitoring

- [x] 12.1 Add request duration logging
- [x] 12.2 Log slow database queries (> 100ms)
- [x] 12.3 Monitor Redis connection health
- [x] 12.4 Add memory usage logging
- [x] 12.5 Configure Heroku metrics dashboards

## 13. Security Testing

- [x] 13.1 Test CSP blocks inline scripts
- [x] 13.2 Test CORS rejects unauthorized origins
- [x] 13.3 Test rate limiting blocks excessive requests
- [x] 13.4 Test input sanitization removes malicious content
- [x] 13.5 Test authentication failures are logged
- [x] 13.6 Test sensitive data is excluded from logs
- [x] 13.7 Run OWASP ZAP scan (if available)

## 14. Integration & Review

- [x] 14.1 Run all unit tests and ensure they pass
- [x] 14.2 Run all integration tests and ensure they pass
- [x] 14.3 Run linters (ESLint, TypeScript) and fix issues
- [x] 14.4 Test security headers with securityheaders.com
- [x] 14.5 Test rate limiting in staging
- [x] 14.6 Verify Sentry receives errors
- [x] 14.7 Analyze bundle size with vite-bundle-analyzer
- [x] 14.8 Review code for SOLID principles compliance
- [x] 14.9 Document security configuration
