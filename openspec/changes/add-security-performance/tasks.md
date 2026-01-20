# Tasks: Security & Performance

## 1. Helmet.js Security Headers (Backend)

- [ ] 1.1 Install Helmet.js package
- [ ] 1.2 Configure Content-Security-Policy (CSP)
- [ ] 1.3 Set default-src to 'self'
- [ ] 1.4 Configure style-src for inline styles
- [ ] 1.5 Configure script-src for self
- [ ] 1.6 Configure img-src for self, data, https
- [ ] 1.7 Configure connect-src for API endpoints
- [ ] 1.8 Configure HSTS (Strict-Transport-Security)
- [ ] 1.9 Set max-age to 1 year (31536000)
- [ ] 1.10 Enable includeSubDomains
- [ ] 1.11 Configure X-Frame-Options (DENY)
- [ ] 1.12 Configure X-Content-Type-Options (nosniff)
- [ ] 1.13 Configure Referrer-Policy
- [ ] 1.14 Write tests for security headers

## 2. CORS Configuration (Backend)

- [ ] 2.1 Install cors middleware
- [ ] 2.2 Configure allowed origins from environment
- [ ] 2.3 Allow localhost for development
- [ ] 2.4 Allow production frontend URL
- [ ] 2.5 Configure allowed methods (GET, POST, PATCH, DELETE)
- [ ] 2.6 Configure allowed headers
- [ ] 2.7 Enable credentials for cookies
- [ ] 2.8 Set appropriate max-age for preflight cache
- [ ] 2.9 Write tests for CORS configuration

## 3. Input Sanitization (Backend)

- [ ] 3.1 Create sanitization middleware
- [ ] 3.2 Trim whitespace from string inputs
- [ ] 3.3 Escape HTML special characters where needed
- [ ] 3.4 Normalize email addresses (lowercase)
- [ ] 3.5 Remove control characters from strings
- [ ] 3.6 Validate and sanitize URL inputs
- [ ] 3.7 Apply to all request bodies
- [ ] 3.8 Write tests for input sanitization

## 4. Rate Limiting Setup (Backend)

- [ ] 4.1 Install express-rate-limit package
- [ ] 4.2 Install rate-limit-redis package
- [ ] 4.3 Configure Redis store for rate limits
- [ ] 4.4 Create global rate limiter (100/15min)
- [ ] 4.5 Create auth rate limiter (registration: 3/hour)
- [ ] 4.6 Create login rate limiter (5/minute)
- [ ] 4.7 Create password reset rate limiter (3/hour)
- [ ] 4.8 Create OAuth rate limiter (10/minute)
- [ ] 4.9 Create travel records rate limiter (60/minute)
- [ ] 4.10 Create export rate limiter (5/hour)
- [ ] 4.11 Configure rate limit headers (X-RateLimit-*)
- [ ] 4.12 Configure Retry-After header
- [ ] 4.13 Write tests for rate limiting

## 5. Winston Logging Setup (Backend)

- [ ] 5.1 Install Winston package
- [ ] 5.2 Create logger configuration file
- [ ] 5.3 Configure log levels (error, warn, info, debug)
- [ ] 5.4 Configure JSON format
- [ ] 5.5 Add timestamp to all logs
- [ ] 5.6 Add error stack traces
- [ ] 5.7 Configure Console transport
- [ ] 5.8 Configure File transport for errors
- [ ] 5.9 Configure File transport for combined logs
- [ ] 5.10 Set log level based on environment
- [ ] 5.11 Create request logging middleware
- [ ] 5.12 Log request method, URL, status, duration
- [ ] 5.13 Exclude sensitive data from logs
- [ ] 5.14 Write tests for logging

## 6. Sentry Error Tracking (Backend)

- [ ] 6.1 Install Sentry Node package
- [ ] 6.2 Initialize Sentry with DSN from environment
- [ ] 6.3 Configure release tracking
- [ ] 6.4 Configure environment (development/staging/production)
- [ ] 6.5 Add Sentry request handler middleware
- [ ] 6.6 Add Sentry error handler middleware
- [ ] 6.7 Configure user context capture
- [ ] 6.8 Configure breadcrumbs
- [ ] 6.9 Filter sensitive data from reports
- [ ] 6.10 Write tests for Sentry integration

## 7. Sentry Error Tracking (Frontend)

- [ ] 7.1 Install Sentry React package
- [ ] 7.2 Initialize Sentry in application entry
- [ ] 7.3 Configure release tracking
- [ ] 7.4 Configure environment
- [ ] 7.5 Add Error Boundary with Sentry reporting
- [ ] 7.6 Configure user context capture
- [ ] 7.7 Filter sensitive data from reports
- [ ] 7.8 Write tests for error boundary

## 8. Database Indexes (Backend)

- [ ] 8.1 Create migration for users.email index (if not exists)
- [ ] 8.2 Create migration for travel_records(userId, date) index
- [ ] 8.3 Verify unique constraint on travel_records(userId, date, countryCode)
- [ ] 8.4 Verify unique constraint on oauth_accounts(provider, providerId)
- [ ] 8.5 Create migration for support_tickets.referenceId index
- [ ] 8.6 Create migration for support_tickets.status index
- [ ] 8.7 Analyze query patterns and add indexes as needed
- [ ] 8.8 Write documentation for index strategy

## 9. Redis Caching Setup (Backend)

- [ ] 9.1 Install ioredis package
- [ ] 9.2 Create Redis client configuration
- [ ] 9.3 Configure connection from environment (REDIS_URL)
- [ ] 9.4 Implement connection error handling
- [ ] 9.5 Create cache utility functions (get, set, delete)
- [ ] 9.6 Cache countries list (24 hour TTL)
- [ ] 9.7 Implement token blacklist for logout
- [ ] 9.8 Add cache invalidation on data changes
- [ ] 9.9 Write tests for caching

## 10. Code Splitting (Frontend)

- [ ] 10.1 Identify route-based split points
- [ ] 10.2 Implement React.lazy for Landing page
- [ ] 10.3 Implement React.lazy for Login page
- [ ] 10.4 Implement React.lazy for Register page
- [ ] 10.5 Implement React.lazy for Calendar page
- [ ] 10.6 Implement React.lazy for Reports page
- [ ] 10.7 Implement React.lazy for Profile page
- [ ] 10.8 Implement React.lazy for Support page
- [ ] 10.9 Implement React.lazy for Admin pages
- [ ] 10.10 Create Suspense boundaries with loading states
- [ ] 10.11 Configure Vite for optimal chunking
- [ ] 10.12 Analyze bundle size and optimize

## 11. Frontend Performance Optimizations

- [ ] 11.1 Implement React.memo for expensive components
- [ ] 11.2 Use useMemo for expensive computations
- [ ] 11.3 Use useCallback for stable function references
- [ ] 11.4 Optimize re-renders with proper key usage
- [ ] 11.5 Implement virtual scrolling for long lists (if needed)
- [ ] 11.6 Add image lazy loading
- [ ] 11.7 Preload critical resources
- [ ] 11.8 Configure prefetching for likely navigation

## 12. Performance Monitoring

- [ ] 12.1 Add request duration logging
- [ ] 12.2 Log slow database queries (> 100ms)
- [ ] 12.3 Monitor Redis connection health
- [ ] 12.4 Add memory usage logging
- [ ] 12.5 Configure Heroku metrics dashboards

## 13. Security Testing

- [ ] 13.1 Test CSP blocks inline scripts
- [ ] 13.2 Test CORS rejects unauthorized origins
- [ ] 13.3 Test rate limiting blocks excessive requests
- [ ] 13.4 Test input sanitization removes malicious content
- [ ] 13.5 Test authentication failures are logged
- [ ] 13.6 Test sensitive data is excluded from logs
- [ ] 13.7 Run OWASP ZAP scan (if available)

## 14. Integration & Review

- [ ] 14.1 Run all unit tests and ensure they pass
- [ ] 14.2 Run all integration tests and ensure they pass
- [ ] 14.3 Run linters (ESLint, TypeScript) and fix issues
- [ ] 14.4 Test security headers with securityheaders.com
- [ ] 14.5 Test rate limiting in staging
- [ ] 14.6 Verify Sentry receives errors
- [ ] 14.7 Analyze bundle size with vite-bundle-analyzer
- [ ] 14.8 Review code for SOLID principles compliance
- [ ] 14.9 Document security configuration
