# Contributing Guidelines

This document outlines the contribution process, coding standards, and best practices for Country Calendar.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone <your-fork-url>`
3. Set up development environment (see [DEVELOPMENT.md](./DEVELOPMENT.md))
4. Create a feature branch: `git checkout -b feature/my-feature`

## Development Principles

### SOLID Principles

All code must follow SOLID principles:

- **Single Responsibility:** Each class/function does one thing
- **Open/Closed:** Open for extension, closed for modification
- **Liskov Substitution:** Subtypes must be substitutable for base types
- **Interface Segregation:** Many specific interfaces over one general
- **Dependency Inversion:** Depend on abstractions, not concretions

### Additional Principles

- **KISS:** Keep It Simple, Stupid
- **DRY:** Don't Repeat Yourself
- **YAGNI:** You Aren't Gonna Need It

## Coding Standards

### TypeScript

- Use strict mode (enabled in tsconfig)
- Define explicit return types for public functions
- Prefer interfaces over types for object shapes
- Use `const` assertions for literal types
- Avoid `any` - use `unknown` if type is uncertain

```typescript
// Good
interface User {
  id: string;
  email: string;
  name: string;
}

function getUser(id: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { id } });
}

// Bad
function getUser(id): any {
  return prisma.user.findUnique({ where: { id } });
}
```

### React Components

- Use functional components with hooks
- Keep components focused (single responsibility)
- Extract reusable logic into custom hooks
- Use proper TypeScript props interfaces

```typescript
// Good
interface ButtonProps {
  variant: 'primary' | 'secondary';
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

function Button({ variant, onClick, children, disabled = false }: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

// Bad
function Button(props: any) {
  return <button {...props}>{props.children}</button>;
}
```

### API Design

- Use RESTful conventions
- Return consistent error formats
- Validate all inputs with Zod
- Use appropriate HTTP status codes

```typescript
// Good
app.post('/api/v1/users', validate(createUserSchema), async (req, res) => {
  try {
    const user = await UserService.create(req.body);
    res.status(201).json({ user });
  } catch (error) {
    if (error instanceof ConflictError) {
      res.status(409).json({ error: { code: 'CONFLICT', message: error.message } });
    } else {
      throw error;
    }
  }
});
```

### File Organization

```
# Services
packages/api/src/services/
├── userService.ts       # User business logic
├── authService.ts       # Authentication logic
└── index.ts             # Exports

# Components
packages/web/src/components/
├── features/
│   └── calendar/
│       ├── Calendar.tsx
│       ├── Calendar.test.tsx
│       ├── DayCell.tsx
│       └── index.ts
└── ui/
    ├── Button.tsx
    └── Input.tsx
```

### Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Files (components) | PascalCase | `UserProfile.tsx` |
| Files (utilities) | camelCase | `formatDate.ts` |
| Variables | camelCase | `userName` |
| Constants | SCREAMING_SNAKE | `MAX_ATTEMPTS` |
| Types/Interfaces | PascalCase | `UserResponse` |
| Functions | camelCase | `getUserById` |
| React Components | PascalCase | `UserProfile` |
| CSS Classes | kebab-case | `user-profile` |

## Test-Driven Development (TDD)

All features must be developed using TDD:

### TDD Workflow

1. **Write a failing test** - Define expected behavior
2. **Write minimal code** - Just enough to pass the test
3. **Refactor** - Improve code while keeping tests green

```typescript
// 1. Write failing test
describe('calculateTax', () => {
  it('should return 10% of amount', () => {
    expect(calculateTax(100)).toBe(10);
  });
});

// 2. Write minimal code
function calculateTax(amount: number): number {
  return amount * 0.1;
}

// 3. Refactor (if needed)
const TAX_RATE = 0.1;

function calculateTax(amount: number): number {
  return amount * TAX_RATE;
}
```

### Test Requirements

- Write unit tests for all business logic
- Write integration tests for API endpoints
- Write E2E tests for critical user flows
- Maintain minimum 70% code coverage

## Git Workflow

### Branch Naming

```
feature/add-user-profile
fix/calendar-date-bug
docs/update-api-docs
refactor/simplify-auth-flow
test/add-calendar-tests
chore/update-dependencies
```

### Commit Messages

Follow conventional commits:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting (no code change)
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

Examples:
```
feat(calendar): add bulk date selection

Allows users to select multiple dates at once using shift+click.
Includes visual feedback for selected range.

Closes #123
```

```
fix(auth): prevent login after account lockout

Users were able to bypass lockout by clearing cookies.
Now lockout is stored server-side.
```

### Pull Request Process

1. **Before Creating PR:**
   - Run all tests: `npm test`
   - Run linting: `npm run lint`
   - Run type check: `npm run typecheck`

2. **PR Description Template:**
   ```markdown
   ## Summary
   Brief description of changes

   ## Changes
   - List of specific changes

   ## Testing
   - How to test the changes

   ## Screenshots
   (if applicable)

   ## Checklist
   - [ ] Tests added/updated
   - [ ] Documentation updated
   - [ ] Linting passes
   - [ ] Type checking passes
   ```

3. **Review Process:**
   - At least one approval required
   - All CI checks must pass
   - Resolve all comments before merging

## Change Proposals

For significant changes, create a proposal first:

### When to Create a Proposal

- New features
- Breaking changes
- Architecture modifications
- Performance/security improvements

### Proposal Process

See [openspec/AGENTS.md](../openspec/AGENTS.md) for detailed instructions.

Quick summary:
1. Create spec in `openspec/changes/`
2. Include problem, solution, implementation plan
3. Get approval before implementation
4. Archive spec after completion

## Code Review Checklist

### For Reviewers

- [ ] Code follows project conventions
- [ ] Tests are meaningful and pass
- [ ] No security vulnerabilities
- [ ] Error handling is appropriate
- [ ] Performance is acceptable
- [ ] Documentation is updated

### Common Issues to Watch

- Missing error handling
- Untested edge cases
- Hardcoded values
- Missing input validation
- Potential security issues
- Performance bottlenecks

## Security Guidelines

### Input Validation

- Validate all user inputs with Zod
- Sanitize data before storage
- Use parameterized queries (Prisma handles this)

### Authentication

- Never log sensitive data
- Use secure password hashing (bcrypt)
- Implement proper session management
- Rate limit authentication endpoints

### Data Protection

- Don't expose internal IDs unnecessarily
- Implement proper access controls
- Use HTTPS in production
- Follow principle of least privilege

## Performance Guidelines

### Database

- Use appropriate indexes
- Avoid N+1 queries
- Paginate large result sets
- Use connection pooling

### Frontend

- Lazy load components
- Optimize images
- Minimize bundle size
- Use proper caching

### API

- Implement response caching
- Use compression
- Optimize database queries
- Monitor response times

## Documentation

### Code Comments

- Explain "why", not "what"
- Document complex algorithms
- Keep comments up to date
- Use JSDoc for public APIs

```typescript
/**
 * Calculates the number of days between two dates.
 *
 * @param startDate - The start date
 * @param endDate - The end date
 * @returns Number of days (inclusive)
 * @throws {Error} If startDate is after endDate
 */
function daysBetween(startDate: Date, endDate: Date): number {
  // Implementation
}
```

### API Documentation

- Document all endpoints in [API.md](./API.md)
- Include request/response examples
- Document error codes
- Keep documentation in sync with code

## Getting Help

- **Questions:** Open a GitHub issue
- **Bugs:** Use the bug report template
- **Features:** Create a proposal first
- **Security:** Email security@countrycalendar.app

## License

By contributing, you agree that your contributions will be licensed under the project's license.
