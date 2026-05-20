# Error Handling Rules

Apply these rules when writing error handling in any language or framework.

## Core principles

- Every error is either expected (handle it) or unexpected (log it and surface it)
- Never silently swallow errors — either handle them or re-throw them
- Errors should be actionable: the receiver should know what to do next
- Never expose internal details (stack traces, database structure) to end users

## Catch specific, not general

```typescript
// Bad: catches everything, loses context
try {
  await processPayment(data)
} catch (e) {
  console.log('Error')
}

// Good: handle specific cases, re-throw the rest
try {
  await processPayment(data)
} catch (e) {
  if (e instanceof PaymentDeclinedError) {
    return { success: false, reason: 'payment_declined' }
  }
  if (e instanceof NetworkError) {
    // Retry logic or return transient error
    throw new RetryableError('Payment service unavailable', { cause: e })
  }
  throw e  // Unknown error: let it bubble up and be logged
}
```

## Error types

Define meaningful error types:
```typescript
class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
    public readonly isOperational: boolean = true
  ) {
    super(message)
    this.name = this.constructor.name
  }
}

class ValidationError extends AppError {
  constructor(message: string, public readonly fields?: Record<string, string>) {
    super(message, 'validation_error', 422)
  }
}

class NotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super(`${resource} ${id} not found`, 'not_found', 404)
  }
}

class UnauthorizedError extends AppError {
  constructor() {
    super('Authentication required', 'unauthorized', 401)
  }
}
```

## Async error handling

```typescript
// Always await in try/catch — floating promises swallow errors
// Bad:
async function handler() {
  processInBackground()  // errors here are lost
  return 'ok'
}

// Good:
async function handler() {
  await processInBackground()  // errors propagate correctly
  return 'ok'
}

// Express: always use next(err) for async route errors
router.get('/users', async (req, res, next) => {
  try {
    const users = await getUsers()
    res.json(users)
  } catch (err) {
    next(err)  // passes to error handler middleware
  }
})
```

## Logging errors

```typescript
// Log with context — not just the message
logger.error('Payment failed', {
  error: err.message,
  stack: err.stack,
  userId: user.id,
  orderId: order.id,
  amount: order.total,
})

// Never log PII in error messages
// Bad: logger.error(`Failed to authenticate user ${user.email}`)
// Good: logger.error('Authentication failed', { userId: user.id })
```

## User-facing error messages

- Never expose: stack traces, SQL errors, file paths, internal IDs
- Always expose: a human-readable message, an error code, and (for validation) which fields are wrong
- Error messages should describe the problem, not the implementation

```json
{
  "error": {
    "code": "payment_declined",
    "message": "Your payment was declined. Please check your card details or try a different payment method.",
    "requestId": "req_123abc"
  }
}
```

## Python equivalent

```python
class AppError(Exception):
    def __init__(self, message: str, code: str, status_code: int = 500):
        super().__init__(message)
        self.code = code
        self.status_code = status_code

# FastAPI error handler
@app.exception_handler(AppError)
async def app_error_handler(request: Request, exc: AppError):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": {"code": exc.code, "message": str(exc)}}
    )
```
