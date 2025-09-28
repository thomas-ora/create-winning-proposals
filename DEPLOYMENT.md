# 🚀 Deployment Instructions

## Vercel Deployment (Recommended)

### 1. Connect to Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click "Import Project"
4. Select the `create-winning-proposals` repository
5. Configure the project:

### 2. Environment Variables

Add these environment variables in Vercel dashboard:

```bash
VITE_SUPABASE_URL=https://knyzwlsewissymnuczxz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtueXp3bHNld2lzc3ltbnVjenh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxNjY1MzgsImV4cCI6MjA3MTc0MjUzOH0.nndDloB2G2Aw0aWCIib1WtyRy1gZaSik7A4xu5xdk40
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtueXp3bHNld2lzc3ltbnVjenh6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjE2NjUzOCwiZXhwIjoyMDcxNzQyNTM4fQ.PsKVFWdA4ywcJFx1o5F_AO6RCBhGT9jOBdmg5PJX1c4
VITE_STRIPE_PUBLISHABLE_KEY=[Your Stripe Publishable Key]
STRIPE_SECRET_KEY=[Your Stripe Secret Key]
VITE_APP_NAME=OraSystems Proposal Platform
```

### 3. Build Settings

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 4. Deploy

Click "Deploy" and wait for the build to complete.

## Post-Deployment Setup

### 1. Update n8n Workflow

Replace the API URL in `bobby-davies-integration.json`:
- Change: `https://knyzwlsewissymnuczxz.supabase.co/functions/v1/create-proposal`
- To: `https://your-app.vercel.app/api/create-proposal`

### 2. Configure Stripe Webhooks

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-app.vercel.app/api/stripe-webhook`
3. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `invoice.paid`

### 3. Update Supabase URL Config

In Supabase Dashboard:
1. Go to Authentication → URL Configuration
2. Add your production URL to:
   - Site URL: `https://your-app.vercel.app`
   - Redirect URLs: `https://your-app.vercel.app/*`

### 4. Test the Production System

1. **Health Check**:
   ```bash
   curl https://your-app.vercel.app/api/health
   ```

2. **Create Test Proposal**:
   ```bash
   curl -X POST https://your-app.vercel.app/api/create-proposal \
     -H "Authorization: Bearer YOUR_API_KEY" \
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
         "executive_summary": "Testing production deployment",
         "sections": [],
         "financial_amount": 10000,
         "financial_currency": "USD",
         "valid_until": "2026-12-31T23:59:59Z"
       }
     }'
   ```

## Alternative: Deploy with CLI

If you prefer using the CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Follow prompts and add environment variables when asked
```

## Production URLs

Once deployed, your system will be available at:
- **Main App**: `https://your-app.vercel.app`
- **API Health**: `https://your-app.vercel.app/api/health`
- **Create Proposal**: `https://your-app.vercel.app/api/create-proposal`
- **Get Proposal**: `https://your-app.vercel.app/api/get-proposal?id={id}`

## Monitoring

- **Vercel Dashboard**: Monitor deployments, functions, and logs
- **Supabase Dashboard**: Monitor database, auth, and storage
- **Stripe Dashboard**: Monitor payments and webhooks

## Support

For issues or questions:
- **GitHub Issues**: [create-winning-proposals/issues](https://github.com/thomas-ora/create-winning-proposals/issues)
- **Documentation**: See API-DOCUMENTATION.md