# Proposal System Setup Guide

## Quick Start with N8N Integration

This guide will walk you through connecting N8N to your proposal generation system.

### Prerequisites

1. **System Requirements**
   - Active N8N workspace
   - Proposal system deployed and running
   - Valid API key (generate at `/settings/api-keys`)

2. **Required Information**
   - API Base URL: `https://axqqqpomxdjwrpkbfawl.supabase.co/functions/v1`
   - Your API Key: Get from the API Keys page
   - Webhook URLs: For tracking events (optional)

---

## Step 1: Generate API Key

1. Navigate to `/settings/api-keys` in your proposal system
2. Click "Generate New Key"
3. Enter a descriptive name (e.g., "N8N Production Workflow")
4. **IMPORTANT**: Copy the API key immediately - it's only shown once
5. Keep this key secure and never commit it to version control

---

## Step 2: Set Up N8N Workflow

### Option A: Import Template (Recommended)

1. Download the N8N template from `/test-api`
2. In N8N, go to Workflows → Import from File
3. Upload the downloaded template
4. Replace `YOUR_API_KEY_HERE` with your actual API key

### Option B: Manual Setup

1. Create a new workflow in N8N
2. Add an HTTP Request node
3. Configure the node:
   ```
   Method: POST
   URL: https://axqqqpomxdjwrpkbfawl.supabase.co/functions/v1/create-proposal
   Authentication: Header Auth
   Headers:
     - Authorization: Bearer YOUR_API_KEY
     - Content-Type: application/json
   ```

---

## Step 3: Configure Request Body

Use this JSON structure for the request body:

```json
{
  "client": {
    "first_name": "{{ $json.client_first_name }}",
    "last_name": "{{ $json.client_last_name }}",
    "email": "{{ $json.client_email }}",
    "company_name": "{{ $json.company_name }}",
    "title": "{{ $json.client_title }}",
    "phone": "{{ $json.client_phone }}",
    "industry": "{{ $json.industry }}",
    "employee_count": {{ $json.employee_count }},
    "revenue_range": "{{ $json.revenue_range }}",
    "growth_stage": "{{ $json.growth_stage }}"
  },
  "psychology_profile": {
    "primary_type": "{{ $json.psychology_type }}",
    "decision_style": "{{ $json.decision_style }}",
    "risk_tolerance": "{{ $json.risk_tolerance }}",
    "decision_authority": "{{ $json.decision_authority }}"
  },
  "proposal": {
    "title": "{{ $json.proposal_title }}",
    "executive_summary": "{{ $json.executive_summary }}",
    "sections": {{ $json.sections }},
    "financial_amount": {{ $json.amount }},
    "financial_currency": "USD",
    "payment_terms": "{{ $json.payment_terms }}",
    "valid_until": "{{ $json.valid_until }}",
    "prepared_by": "{{ $json.prepared_by }}"
  }
}
```

---

## Step 4: Psychology Profile Types

Choose the appropriate psychology type based on your client assessment:

### Analytical Clients
- **Characteristics**: Data-driven, detail-oriented, risk-averse
- **Proposal Style**: Comprehensive analysis, detailed ROI, technical specifications
- **Decision Style**: "Deliberate" 
- **Risk Tolerance**: "Conservative"

### Driver Clients  
- **Characteristics**: Results-focused, impatient, decisive
- **Proposal Style**: Bottom-line focused, quick wins, action-oriented
- **Decision Style**: "Fast"
- **Risk Tolerance**: "Aggressive"

### Expressive Clients
- **Characteristics**: Relationship-focused, creative, collaborative
- **Proposal Style**: Vision-oriented, partnership language, innovative solutions
- **Decision Style**: "Moderate"
- **Risk Tolerance**: "Moderate"

### Amiable Clients
- **Characteristics**: Supportive, team-oriented, stability-seeking
- **Proposal Style**: Gentle approach, team benefits, gradual implementation
- **Decision Style**: "Deliberate"
- **Risk Tolerance**: "Conservative"

---

## Step 5: Handle API Response

The API returns:

```json
{
  "success": true,
  "proposal_id": "uuid-string",
  "url": "https://your-domain.com/p/uuid-string",
  "expires_at": "2024-08-15T23:59:59Z"
}
```

### Recommended Follow-up Actions

1. **Store the proposal URL** in your CRM
2. **Send email notification** to the client
3. **Set follow-up reminders** based on expiry date
4. **Track proposal status** using webhooks

---

## Step 6: Event Tracking (Optional)

Track when clients interact with proposals:

### Webhook Setup

1. Add a webhook trigger to your N8N workflow
2. Use this URL format: `https://your-n8n-webhook-url`
3. Configure the proposal system to send tracking events

### Tracking Events

The system automatically tracks:
- `view` - When someone opens the proposal
- `section_view` - When someone scrolls to different sections  
- `calculator_use` - When someone uses interactive calculators
- `download` - When someone downloads the PDF
- `cta_click` - When someone clicks the accept button

---

## Troubleshooting

### Common Issues

**❌ 401 Unauthorized**
- Check your API key is correct and active
- Verify the Authorization header format: `Bearer YOUR_KEY`

**❌ 400 Bad Request**
- Validate your JSON payload structure
- Ensure required fields are present
- Check data types (numbers vs strings)

**❌ 429 Too Many Requests**
- You're hitting the rate limit (100 requests/minute)
- Add delays between requests
- Consider batching if creating multiple proposals

**❌ 500 Server Error**
- The system may be experiencing issues
- Check the health endpoint: `/health`
- Try again in a few minutes

### Testing Your Integration

1. Use the test console at `/test-api`
2. Verify your API key works
3. Test with sample psychology profiles
4. Check the generated proposal URL

### Getting Help

- 📚 [Complete API Documentation](/api-docs)
- 🧪 [Interactive Test Console](/test-api) 
- ⚙️ [System Health Status](/health)
- 🔑 [API Key Management](/settings/api-keys)

---

## Advanced Configuration

### Custom Branding

Add these optional fields to customize proposal appearance:

```json
{
  "proposal": {
    "brand_color": "#7B7FEB",
    "logo_url": "https://your-domain.com/logo.png"
  }
}
```

### Password Protection

Protect sensitive proposals:

```json
{
  "proposal": {
    "password_protected": true,
    "password": "secure123"
  }
}
```

### Pricing Tiers

Include multiple pricing options:

```json
{
  "proposal": {
    "pricing_tiers": {
      "basic": {
        "name": "Basic Package",
        "price": 5000,
        "features": ["Feature 1", "Feature 2"]
      },
      "premium": {
        "name": "Premium Package", 
        "price": 10000,
        "features": ["All Basic", "Feature 3", "Feature 4"]
      }
    }
  }
}
```

---

## Video Tutorials

*[Video embed placeholders - add your tutorial videos here]*

1. **Getting Started** (5 min)
   - System overview and basic concepts
   - API key generation
   - First proposal creation

2. **N8N Integration** (10 min)
   - Template import and configuration
   - Psychology profile selection
   - Error handling and testing

3. **Advanced Features** (15 min)
   - Custom branding and styling
   - Event tracking and analytics
   - Password protection and security

4. **Troubleshooting** (8 min)
   - Common issues and solutions
   - Using the test console
   - Monitoring and health checks

---

**🚀 Ready to create amazing proposals?** Start by generating your API key and testing with the console!

*Last updated: July 14, 2024*