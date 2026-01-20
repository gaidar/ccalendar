# Proposal: Support System

## Summary

Add a support ticket system allowing users (and guests) to submit support requests, receive confirmation, and track their tickets. Administrators can manage tickets through the admin panel (covered in Phase 9).

## Motivation

Users need a way to contact support for help with their accounts, report bugs, request features, or get answers to questions. A structured ticket system ensures no requests are lost and provides tracking capabilities for both users and administrators.

## Scope

### In Scope

- Create support ticket endpoint (public, no auth required)
- Support form UI with name, email, category, subject, message
- Ticket confirmation page with reference ID
- User ticket confirmation email
- Admin notification email for new tickets
- Reference ID generation (TKT-XXXXXXXX format)
- Automatic user linking for logged-in users

### Out of Scope

- Admin ticket management (Phase 9)
- Ticket status tracking by users
- Reply/conversation threads
- File attachments
- Ticket priority levels
- SLA tracking

## Design

### Support API

The API will provide a public endpoint for creating tickets:

- `POST /api/v1/support` - Create a new support ticket (public)

The endpoint accepts:
- `name`: Submitter's name (1-100 chars)
- `email`: Submitter's email (valid email, max 120 chars)
- `subject`: Ticket subject (5-200 chars)
- `category`: One of: general, account, bug, feature, billing, other
- `message`: Ticket content (20-5000 chars)

If the user is authenticated, the ticket is automatically linked to their account.

### Support UI

The support page will include:

1. **Support Form**
   - Name field (pre-filled if logged in)
   - Email field (pre-filled if logged in)
   - Category dropdown
   - Subject input
   - Message textarea
   - Submit button

2. **Confirmation Page**
   - Reference ID display
   - Summary of submitted ticket
   - Estimated response time
   - Link to return home

### Email Notifications

Two emails are sent when a ticket is created:

1. **User Confirmation Email**
   - Reference ID
   - Subject and category
   - Copy of message
   - Response time estimate

2. **Admin Notification Email**
   - Reference ID
   - Submitter details
   - Category and message
   - Link to admin panel

## Technical Considerations

- Reference ID format: `TKT-` prefix + 8 alphanumeric characters
- Tickets can be created without authentication (public endpoint)
- Rate limiting should be applied to prevent spam (5/hour per IP)
- Email validation should be thorough to ensure delivery
- Message should be sanitized but preserve line breaks
