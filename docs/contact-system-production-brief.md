# Contact System Production Brief

## Purpose
This document explains why frontend-only validation is not acceptable for production and defines the target backend-first architecture for a secure, paid, multi-tenant contact system.

## Executive Summary
Frontend validation is useful for user experience, but it is not a security boundary. Any browser-side check can be bypassed by directly calling APIs. For production, backend validation must be authoritative for captcha, forbidden words, tenant verification, and message routing.

## Why Frontend Validation Is Not Enough (Strong Points)

### 1. Browser code is fully visible and controllable
Users and bots can inspect, alter, or skip frontend logic. Any validation executed in JavaScript can be removed with:
- Browser devtools
- Scripted requests (curl, Postman, bot frameworks)
- Direct API calls without loading your website

Impact:
- Invalid payloads can be submitted
- Captcha checks can be skipped
- Forbidden words checks can be bypassed

### 2. Public credentials are not secrets
Anything in frontend bundles or public files (for example `public/credential.json`) is exposed to anyone.

Impact:
- Credential leakage
- Unauthorized use of paid forbidden-word service
- Abuse by non-customers

### 3. Domain restrictions alone are weak
Origin and referer headers can be absent or spoofed in server-to-server requests.

Impact:
- Attackers can replay requests from outside whitelisted domains unless backend also enforces tenant auth + signed credentials + rate limits.

### 4. No trustworthy audit trail from frontend-only flow
If the frontend calls third-party mail directly, internal systems may miss canonical logs.

Impact:
- Weak incident investigation
- Hard to prove abuse patterns
- Poor SLA/reporting for enterprise customers

### 5. Compliance and support workflows require backend ownership
Production support needs ticket storage, status changes, assignment, reply threads, and retention controls.

Impact:
- Email-only flow is not enough for admin operations
- No reliable conversation history

### 6. Reliability needs queue + retry logic
Frontend direct-send cannot guarantee retries or delivery state tracking.

Impact:
- Silent delivery failures
- Lost customer requests

## Production Design Principles
1. Frontend checks are UX prechecks only.
2. Backend checks are final authority.
3. Secrets stay server-side only.
4. Every submission is persisted as a ticket.
5. Every critical decision is logged with trace IDs.

## Target Architecture

### Frontend Responsibilities
- Render form and captcha UI
- Perform fast UX validation (required fields, format)
- Optionally precheck forbidden words for immediate user feedback
- Submit payload to backend API
- Render backend response messages

### Backend Responsibilities (Authoritative)
- Authenticate tenant/product key
- Validate website/domain against tenant allowlist
- Verify captcha server-side
- Re-check forbidden words server-side
- Rate-limit by IP + tenant + email fingerprint
- Persist ticket and message thread
- Dispatch email to configured recipients
- Support admin reply workflow
- Return stable error codes and traceId

## Recommended Request Flow
1. User opens customer website contact page.
2. Frontend requests captcha challenge/token.
3. User submits form.
4. Frontend posts data to backend:
   - tenant/site key
   - websiteUrl
   - form fields
   - captcha response
5. Backend validates tenant and domain.
6. Backend validates captcha.
7. Backend loads forbidden words (cached per tenant), then validates message.
8. Backend writes ticket + first message.
9. Backend sends notification email.
10. Backend returns `ticketId` and `traceId`.

## Multi-Tenant Paid Product Model
Each tenant record should include:
- tenantId
- allowedDomains[]
- receiverEmails[]
- plan limits (requests/minute, daily quota)
- forbiddenWordsPolicy (source, cache TTL, version)
- status (active, suspended)

Credential model:
- `siteKey` (public identifier used by frontend)
- `secretKey` (private, backend-only)
- Rotate keys periodically
- Never expose secret credentials in public assets

## Captcha Strategy
Preferred options:
1. Third-party token captcha (Turnstile/reCAPTCHA), verified on backend
2. Custom challenge generated and stored server-side with TTL and one-time use

Rule:
If captcha is generated in frontend only, it is not secure enough for production.

## Forbidden Words Strategy
- Frontend precheck can remain for UX only
- Backend must always re-check before save/send
- Backend fetches forbidden-word library securely
- Cache forbidden words by tenant with short TTL
- Record policy version used at validation time

## Minimum API Contract

### POST /v1/contact/submit
Required fields:
- siteKey
- websiteUrl
- name
- email
- subject
- message
- captchaToken or challengeId + captchaAnswer

Success response:
- `success: true`
- `ticketId`
- `traceId`

Error response:
- `success: false`
- `code` (e.g., INVALID_CAPTCHA, FORBIDDEN_CONTENT, DOMAIN_NOT_ALLOWED, RATE_LIMITED)
- `message`
- `traceId`

## Operational Controls
- Structured logs with traceId
- Retry queue for mail dispatch
- Dead-letter queue for failed sends
- Monitoring dashboards (delivery rate, spam rejects, latency, failures)
- Audit logs for admin actions and ticket state transitions

## Migration Plan
1. Build backend submit endpoint and validation pipeline.
2. Add ticket persistence and email dispatch.
3. Add admin view/reply APIs.
4. Switch frontend from SMTP direct-send to backend POST.
5. Keep existing frontend captcha/forbidden checks as UX precheck.
6. Enforce backend checks as final gate.
7. Remove public credentials from frontend assets.
8. Run staged rollout with monitoring and rollback plan.

## Non-Negotiable Security Rules
1. No secrets in frontend code or public files.
2. No trust in frontend-only validation for security decisions.
3. No ticket creation without backend captcha verification.
4. No message dispatch without backend forbidden-word validation.
5. No tenant processing without domain + key verification.

## Team Decision Outcome
Adopt backend-first validation and processing as the production standard. Keep frontend checks only for user experience improvements, never as final enforcement.
