# EveryShift Security Rules & Guidelines

## Project Security Overview

This document outlines the security rules, configurations, and best practices for the EveryShift Vue & Supabase application.

## Environment & Configuration Security

### Environment Variables
- **CRITICAL**: Never commit `.env` files to version control
- Use `.env.prod` only as a template - copy to `.env` for local development
- Rotate Supabase keys regularly in production
- Keep hCaptcha keys secure and use test keys only in development

### Exposed Credentials (IMMEDIATE ACTION REQUIRED)
**WARNING**: The following credentials are currently exposed in `.env.prod`:
- Supabase URL: `https://atuqzcyzuecixshusbib.supabase.co`
- Supabase Anon Key: `eyJhbGciOiJIUzI1NiIs...`
- Service Role Key: `eyJhbGciOiJIUzI1NiIs...`
- Project Password: `5t4r3e@W1q`

**Actions Required**:
1. Rotate all Supabase keys immediately
2. Change project password
3. Remove `.env.prod` from git history if possible
4. Update production environment with new credentials

## Authentication Security

### Supabase Auth Configuration
- JWT token expiry: 3600 seconds (1 hour) ✅
- Refresh token rotation: Enabled ✅
- Anonymous sign-ins: Disabled ✅
- Manual account linking: Disabled ✅
- Minimum password length: 6 characters (RECOMMEND: Increase to 8+)

### Password Requirements
**Current Implementation** (`src/utils/form-validations.ts:16-28`):
- Minimum 6 characters (weak - recommend 8+)
- Must contain '@' symbol (unusual requirement)
- Basic email validation with regex

**Recommendations**:
- Implement stronger password policy:
  - Minimum 8-12 characters
  - Require uppercase, lowercase, numbers, special characters
  - Use industry-standard validation libraries
  - Remove unusual '@' requirement

### Email Security
- Email confirmations: Disabled (SECURITY RISK)
- Double confirm changes: Enabled ✅
- Secure password change: Disabled (SECURITY RISK)
- OTP length: 6 characters ✅
- OTP expiry: 3600 seconds ✅

**Recommendations**:
- Enable email confirmations for new registrations
- Enable secure password change requirement
- Implement rate limiting for auth attempts

## Database Security

### Row Level Security (RLS)
**Current Implementation**:
- Profiles table: RLS enabled ✅
- Entities table: RLS enabled ✅
- Sub-entities table: RLS enabled ✅
- Keep-alive table: RLS enabled ✅

### Database Policies
**Profiles Table**:
- Read: Authenticated users only ✅
- Insert: Authenticated users only ✅

**Entities & Sub-entities Tables**:
- Read: Authenticated users only ✅
- Insert: Authenticated users only ✅
- Update: Authenticated users only ✅
- Delete: Authenticated users only ✅

**Keep-alive Table**:
- Read: All users (public access) ⚠️

**Recommendations**:
- Review keep-alive table public access necessity
- Implement user-specific policies (users can only access their own data)
- Add audit logging for sensitive operations

## API Security

### Supabase Configuration
- Max rows limit: 1000 ✅
- API schemas: `public`, `graphql_public` ✅
- TLS: Disabled in development (acceptable for local)

### Rate Limiting
**Current Implementation**: Limited Supabase built-in protection
**Recommendations**:
- Implement application-level rate limiting
- Use Supabase Edge Functions for custom rate limiting
- Monitor API usage patterns

## Frontend Security

### Input Validation
**Current Implementation**:
- VeeValidate integration ✅
- Custom form validation utilities ✅
- Email format validation ✅

**Security Gaps**:
- Weak password validation
- Limited XSS protection measures
- No input sanitization documentation

### CAPTCHA Integration
- hCaptcha implementation: Present ✅
- Site key configuration: Environment-based ✅
- Error handling: Implemented ✅

**Recommendations**:
- Ensure CAPTCHA is required for all sensitive operations
- Implement server-side CAPTCHA verification
- Use production keys in production environment

## Content Security & XSS Protection

### Current Status
- No explicit CSP headers configured
- Vue 3 provides some built-in XSS protection
- Input sanitization not explicitly implemented

**Recommendations**:
1. Implement Content Security Policy (CSP)
2. Add explicit input sanitization
3. Use DOMPurify for user-generated content
4. Validate all user inputs on both client and server

## Network Security

### HTTPS/TLS
- Development: HTTP (acceptable for local)
- Production: Must enforce HTTPS
- Supabase endpoints: HTTPS by default ✅

### CORS Configuration
- Managed by Supabase settings
- Review allowed origins in production

## File Upload Security

### Current Status
- File upload functionality: Not implemented
- Storage bucket configuration: Available but unused

**Future Recommendations** (when file uploads are implemented):
- Implement file type validation
- Scan uploaded files for malware
- Limit file sizes
- Use signed URLs for access control

## Dependency Security

### Package Audit
**Action Required**: Run `npm audit` regularly
**Current Dependencies**: Modern versions used ✅

### Security-Related Packages
- `@supabase/supabase-js`: v2.53.0 ✅
- `@hcaptcha/vue3-hcaptcha`: v1.3.0 ✅
- `uuid`: v11.1.0 ✅

## Error Handling & Logging

### Current Implementation
- Error store for centralized error handling ✅
- Development vs production error messages ✅
- Auth error handling ✅

**Security Recommendations**:
- Never expose sensitive information in error messages
- Implement proper logging for security events
- Monitor failed authentication attempts
- Set up alerting for suspicious activities

## Deployment Security

### Environment Separation
- Development configuration: `.env`
- Production template: `.env.prod`
- Environment-specific settings: ✅

### Recommendations
1. Use proper secrets management (e.g., Vault, AWS Secrets Manager)
2. Implement CI/CD security scanning
3. Regular security audits
4. Dependency vulnerability scanning

## Incident Response

### Current Preparedness
- Error tracking: Implemented
- User notification system: Present
- Recovery mechanisms: Basic

### Recommendations
1. Develop incident response plan
2. Implement security monitoring
3. Set up automated alerts
4. Create rollback procedures

## Compliance Considerations

### Data Privacy
- User data handling: Standard Supabase practices
- Data retention: Not explicitly configured
- User consent: Not implemented

**Recommendations**:
- Implement GDPR compliance measures
- Add data retention policies
- Provide user data export/deletion capabilities

## Action Items (Priority Order)

### CRITICAL (Immediate)
1. Rotate all exposed Supabase credentials
2. Remove sensitive data from version control
3. Enable email confirmations for registration
4. Strengthen password requirements

### HIGH (Within 1 week)
1. Implement Content Security Policy
2. Add input sanitization
3. Enable secure password change requirement
4. Set up security monitoring

### MEDIUM (Within 1 month)
1. Implement rate limiting
2. Add audit logging
3. Conduct dependency security audit
4. Develop incident response plan

### LOW (Future releases)
1. Add GDPR compliance features
2. Implement advanced threat detection
3. Set up automated security testing
4. Add security headers middleware

## Security Testing

### Recommended Tests
1. Penetration testing
2. Dependency vulnerability scanning
3. Authentication bypass testing
4. Input validation testing
5. Authorization testing

### Tools Recommended
- OWASP ZAP for web security testing
- npm audit for dependency scanning
- Semgrep for static code analysis
- Lighthouse for security best practices

---

**Last Updated**: 2025-08-01  
**Next Review Date**: 2025-09-01  
**Document Version**: 1.0