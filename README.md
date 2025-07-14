# Proposal Generation System

A complete API-driven system for generating beautiful, interactive client proposals with psychology-optimized content and comprehensive tracking.

## 🚀 Quick Start

1. **Clone and Install**
   ```bash
   git clone <your-repo-url>
   cd proposal-system
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Complete Setup**
   - Visit `/setup` to run system verification
   - Generate your first API key at `/settings/api-keys`
   - Test the API at `/test-api`

## 🛠 Deployment

### Vercel Deployment (Recommended)

1. **Connect to Vercel**
   ```bash
   npm install -g vercel
   vercel login
   vercel --prod
   ```

2. **Environment Variables**
   Set these in your Vercel dashboard:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Custom Domain** (Optional)
   - Add your domain in Vercel dashboard
   - Update Supabase Auth URLs to match your domain

### Other Platforms

The app is a standard Vite React application and can be deployed to:
- Netlify
- AWS Amplify
- Firebase Hosting
- Any static hosting service

## 🔧 Configuration

### Required Environment Variables

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Optional: Custom Branding
VITE_APP_NAME="Your Company Proposals"
VITE_SUPPORT_EMAIL=support@yourcompany.com
```

### Supabase Setup

1. **Database Tables** - Run the provided SQL migration
2. **Edge Functions** - Deployed automatically with the project
3. **Authentication** - Configure redirect URLs in Supabase dashboard

## 📋 System Requirements

- Node.js 18+ 
- npm 9+
- Modern browser with JavaScript enabled
- Supabase project with database and edge functions

## 🔗 API Integration

### Quick API Test

```bash
curl -X POST https://your-domain.com/functions/v1/create-proposal \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d @sample-payload.json
```

### N8N Integration

1. Download the N8N template from `/test-api`
2. Import into your N8N workspace
3. Replace `YOUR_API_KEY_HERE` with your actual API key
4. Customize the payload data as needed

## 📊 Features

### ✅ Core Features
- **Psychology-Optimized Proposals** - Analytical, Driver, Expressive, Amiable types
- **Real-time Tracking** - View tracking, section engagement, interaction analytics
- **API Key Management** - Secure key generation, rate limiting, usage monitoring
- **PDF Generation** - Downloadable proposal documents
- **Password Protection** - Optional proposal access control
- **Mobile Responsive** - Optimized for all devices

### ✅ Developer Features
- **Complete API** - RESTful endpoints for all operations
- **TypeScript** - Full type safety and IntelliSense
- **Test Console** - Built-in API testing interface
- **Documentation** - Interactive API docs with examples
- **Monitoring** - System health and performance tracking

## 🧪 Testing

### Manual Testing Checklist

- [ ] Create proposal via API
- [ ] View proposal with unique URL
- [ ] Track engagement events
- [ ] Download PDF
- [ ] Test password protection
- [ ] Verify mobile responsiveness
- [ ] Check API rate limiting

### Automated Testing

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:api
npm run test:components
npm run test:integration
```

## 🔍 Monitoring

### Health Checks

The system includes built-in health monitoring:
- Database connectivity
- Edge Functions status
- API key validation
- System performance metrics

Access monitoring at: `/health`

### Performance Metrics

Track key metrics:
- Proposal creation rate
- API response times
- User engagement
- Error rates

## 🆘 Troubleshooting

### Common Issues

**API Keys Not Working**
- Verify key is active in `/settings/api-keys`
- Check rate limits (100 requests/minute)
- Ensure correct Authorization header format

**Proposals Not Loading**
- Check Supabase connection
- Verify Edge Functions are deployed
- Test with `/test-api` console

**Database Errors**
- Run setup verification at `/setup`
- Check Supabase project status
- Verify database migrations

### Support

- 📚 [Complete Documentation](/api-docs)
- 🧪 [Test API Console](/test-api)
- ⚙️ [System Setup Guide](/setup)
- 🔑 [API Key Management](/settings/api-keys)

## 📄 License

This project is proprietary software. All rights reserved.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

---

**Ready to generate amazing proposals?** Start at `/setup` to verify your system is ready for production! 🚀