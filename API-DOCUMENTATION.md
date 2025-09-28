# Proposal Generation System - API Documentation

## 🚀 Quick Start

### Base URL
```
Production: https://your-domain.com/api
Development: http://localhost:8080/api
Supabase Functions: https://knyzwlsewissymnuczxz.supabase.co/functions/v1
```

### Authentication
All API requests require an API key in the Authorization header:
```
Authorization: Bearer YOUR_API_KEY
```

**Development API Key**: Generated from the dashboard - use your own API key

## 📋 Endpoints

### 1. Create Proposal
Create a new proposal with client information and content.

**Endpoint**: `POST /create-proposal`

**Request Body**:
```json
{
  "client": {
    "first_name": "string",
    "last_name": "string",
    "email": "string",
    "phone": "string",
    "title": "string",
    "company_name": "string",
    "company_website": "string",
    "industry": "string",
    "employee_count": "number",
    "revenue_range": "string",
    "growth_stage": "string",
    "consultation_date": "ISO 8601 date"
  },
  "psychology_profile": {
    "primary_type": "Analytical|Driver|Expressive|Amiable",
    "secondary_type": "Analytical|Driver|Expressive|Amiable",
    "analytical_score": 0-100,
    "driver_score": 0-100,
    "expressive_score": 0-100,
    "amiable_score": 0-100,
    "decision_style": "Fast|Moderate|Deliberate",
    "decision_authority": "Full|Partial|None",
    "risk_tolerance": "Conservative|Moderate|Aggressive"
  },
  "proposal": {
    "title": "string",
    "executive_summary": "string",
    "sections": [
      {
        "type": "text|pricing|timeline|testimonial",
        "title": "string",
        "content": "string|object",
        "order": "number"
      }
    ],
    "financial_amount": "number",
    "financial_currency": "USD|EUR|GBP",
    "payment_terms": "string",
    "pricing_tiers": {
      "tier_name": {
        "name": "string",
        "price": "number",
        "features": ["string"]
      }
    },
    "valid_until": "ISO 8601 date",
    "prepared_by": "string",
    "password_protected": "boolean",
    "password": "string (if protected)",
    "brand_color": "#HEX"
  }
}
```

**Response**:
```json
{
  "success": true,
  "proposalId": "uuid",
  "proposalUrl": "https://domain.com/proposal/uuid",
  "password": "string (if protected)"
}
```

### 2. Get Proposal
Retrieve a proposal by ID.

**Endpoint**: `GET /get-proposal?id={proposalId}`

**Response**:
```json
{
  "id": "uuid",
  "title": "string",
  "client": {...},
  "sections": [...],
  "status": "draft|sent|viewed|accepted",
  "created_at": "ISO 8601 date",
  "valid_until": "ISO 8601 date"
}
```

### 3. Track Event
Track proposal events (views, interactions, etc).

**Endpoint**: `POST /track-event`

**Request Body**:
```json
{
  "proposal_id": "uuid",
  "event_type": "viewed|downloaded|section_viewed|link_clicked|accepted",
  "event_data": {
    "section": "string",
    "duration": "number",
    "ip_address": "string",
    "user_agent": "string"
  }
}
```

### 4. Create Payment
Initialize a payment session for a proposal.

**Endpoint**: `POST /create-payment`

**Request Body**:
```json
{
  "proposalId": "uuid",
  "amount": "number",
  "currency": "USD|EUR|GBP",
  "customerEmail": "string",
  "customerName": "string",
  "description": "string",
  "paymentMethod": "card|bank_transfer|invoice",
  "successUrl": "string",
  "cancelUrl": "string"
}
```

**Response**:
```json
{
  "success": true,
  "paymentUrl": "https://checkout.stripe.com/...",
  "sessionId": "string",
  "type": "checkout|invoice"
}
```

### 5. Send Email
Send proposal-related emails.

**Endpoint**: `POST /send-email`

**Request Body**:
```json
{
  "to": "string|array",
  "type": "proposal_created|proposal_viewed|proposal_accepted",
  "templateData": {
    "title": "string",
    "clientName": "string",
    "proposalUrl": "string",
    "value": "string"
  }
}
```

## 🔐 API Key Management

### Generate API Key
API keys can be generated through the web interface at `/settings/api-keys`.

### Rate Limiting
- Default: 100 requests per minute per API key
- Rate limit headers are included in responses:
  - `X-RateLimit-Limit`: Maximum requests per window
  - `X-RateLimit-Remaining`: Remaining requests in current window
  - `X-RateLimit-Reset`: Unix timestamp when window resets

## 🧪 Testing

### Test with cURL
```bash
# Create a proposal
curl -X POST https://knyzwlsewissymnuczxz.supabase.co/functions/v1/create-proposal \
  -H "Authorization: Bearer 12345" \
  -H "Content-Type: application/json" \
  -d '{
    "client": {
      "first_name": "Test",
      "last_name": "User",
      "email": "test@example.com",
      "company_name": "Test Company"
    },
    "proposal": {
      "title": "Test Proposal",
      "executive_summary": "This is a test",
      "sections": [],
      "financial_amount": 10000,
      "financial_currency": "USD",
      "valid_until": "2026-12-31T23:59:59Z"
    }
  }'
```

### Test with JavaScript
```javascript
const createProposal = async (data) => {
  const response = await fetch('https://knyzwlsewissymnuczxz.supabase.co/functions/v1/create-proposal', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer 12345',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  return response.json();
};
```

## 🔄 n8n Integration

### Import Workflow
1. Download `bobby-davies-integration.json`
2. In n8n, go to Workflows → Import
3. Select the JSON file
4. Update the API key in the HTTP Request node
5. Test with manual trigger

### Webhook Integration
Create a webhook in n8n to receive proposal events:

```json
{
  "nodes": [
    {
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "proposal-events",
        "responseMode": "responseNode",
        "httpMethod": "POST"
      }
    }
  ]
}
```

## 📊 Database Schema

### Core Tables
- `api_keys` - API key management
- `clients` - Client information
- `proposals` - Proposal data
- `proposal_events` - Event tracking
- `psychology_profiles` - Client psychology profiles
- `payment_sessions` - Payment tracking
- `email_logs` - Email history
- `email_templates` - Email templates
- `notification_preferences` - User preferences

### Direct Database Access
For advanced queries, use Supabase REST API:

```bash
# Get all proposals
curl "https://knyzwlsewissymnuczxz.supabase.co/rest/v1/proposals?select=*" \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY"

# Filter proposals by status
curl "https://knyzwlsewissymnuczxz.supabase.co/rest/v1/proposals?status=eq.accepted&select=*" \
  -H "apikey: YOUR_ANON_KEY"
```

## 🚨 Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Invalid or missing API key |
| 403 | Forbidden - API key is disabled |
| 404 | Not Found - Resource doesn't exist |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

## 📱 Webhook Events

Configure webhooks to receive real-time notifications:

### Available Events
- `proposal.created` - New proposal created
- `proposal.viewed` - Proposal viewed by client
- `proposal.accepted` - Proposal accepted
- `payment.completed` - Payment successful
- `payment.failed` - Payment failed

### Webhook Payload
```json
{
  "event": "proposal.viewed",
  "timestamp": "ISO 8601 date",
  "data": {
    "proposal_id": "uuid",
    "client_id": "uuid",
    "metadata": {}
  }
}
```

## 🛡️ Security Best Practices

1. **Never expose API keys in client-side code**
2. **Use environment variables for sensitive data**
3. **Implement IP whitelisting for production**
4. **Rotate API keys regularly**
5. **Use HTTPS for all API calls**
6. **Validate all input data**
7. **Implement request signing for webhooks**

## 📞 Support

- **Documentation**: This document
- **Test Console**: `/test-api`
- **Health Check**: `/health`
- **Support Email**: support@orasystems.com

## 🔄 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-09-28 | Initial release |
| 1.1.0 | TBD | Payment processing added |
| 1.2.0 | TBD | Email system integrated |

---

**OraSystems** - Intelligent Proposal Generation Platform