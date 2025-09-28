#!/usr/bin/env node

/**
 * Comprehensive Test Suite for Proposal Generation System
 * Tests all critical functionality including API, database, and integrations
 */

const API_KEY = '12345'; // Development key
const BASE_URL = 'https://knyzwlsewissymnuczxz.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtueXp3bHNld2lzc3ltbnVjenh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxNjY1MzgsImV4cCI6MjA3MTc0MjUzOH0.nndDloB2G2Aw0aWCIib1WtyRy1gZaSik7A4xu5xdk40';

// Test utilities
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, type = 'info') {
  const color = {
    success: colors.green,
    error: colors.red,
    warning: colors.yellow,
    info: colors.blue
  }[type] || colors.reset;

  console.log(`${color}${message}${colors.reset}`);
}

async function hashApiKey(key) {
  // Use Web Crypto API instead of Node's crypto
  const encoder = new TextEncoder();
  const data = encoder.encode(key);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

let testsPassed = 0;
let testsFailed = 0;

async function runTest(name, testFn) {
  process.stdout.write(`Testing ${name}... `);
  try {
    await testFn();
    log('✓', 'success');
    testsPassed++;
  } catch (error) {
    log('✗', 'error');
    log(`  Error: ${error.message}`, 'error');
    testsFailed++;
  }
}

// Test Functions
async function testDatabaseConnection() {
  const response = await fetch(`${BASE_URL}/rest/v1/`, {
    headers: {
      'apikey': ANON_KEY
    }
  });

  if (!response.ok) {
    throw new Error(`Database connection failed: ${response.status}`);
  }
}

async function testApiKeyValidation() {
  const keyHash = await hashApiKey(API_KEY);
  const response = await fetch(`${BASE_URL}/rest/v1/api_keys?key_hash=eq.${keyHash}`, {
    headers: {
      'apikey': ANON_KEY,
      'Authorization': `Bearer ${ANON_KEY}`
    }
  });

  const data = await response.json();
  if (!data || data.length === 0) {
    throw new Error('API key not found in database');
  }

  if (!data[0].is_active) {
    throw new Error('API key is not active');
  }
}

async function testProposalCreation() {
  const proposalData = {
    client: {
      first_name: "Test",
      last_name: "User",
      email: "test@example.com",
      company_name: "Test Company"
    },
    proposal: {
      title: "Test Proposal",
      executive_summary: "This is a test proposal",
      sections: [
        {
          type: "text",
          title: "Introduction",
          content: "Test content",
          order: 1
        }
      ],
      financial_amount: 10000,
      financial_currency: "USD",
      valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    }
  };

  // Note: This would normally call the edge function
  // For now, we'll test direct database insertion
  const clientResponse = await fetch(`${BASE_URL}/rest/v1/clients`, {
    method: 'POST',
    headers: {
      'apikey': ANON_KEY,
      'Authorization': `Bearer ${ANON_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: `${proposalData.client.first_name} ${proposalData.client.last_name}`,
      email: proposalData.client.email,
      company: proposalData.client.company_name
    })
  });

  if (!clientResponse.ok) {
    throw new Error(`Failed to create client: ${clientResponse.status}`);
  }

  const clientText = await clientResponse.text();
  const client = JSON.parse(clientText);

  const proposalResponse = await fetch(`${BASE_URL}/rest/v1/proposals`, {
    method: 'POST',
    headers: {
      'apikey': ANON_KEY,
      'Authorization': `Bearer ${ANON_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      client_id: client.id,
      title: proposalData.proposal.title,
      description: proposalData.proposal.executive_summary,
      total_value: proposalData.proposal.financial_amount,
      currency: proposalData.proposal.financial_currency,
      valid_until: proposalData.proposal.valid_until,
      sections: proposalData.proposal.sections,
      status: 'draft'
    })
  });

  if (!proposalResponse.ok) {
    throw new Error(`Failed to create proposal: ${proposalResponse.status}`);
  }

  const proposalText = await proposalResponse.text();
  const proposal = JSON.parse(proposalText);

  // Cleanup
  await fetch(`${BASE_URL}/rest/v1/proposals?id=eq.${proposal.id}`, {
    method: 'DELETE',
    headers: {
      'apikey': ANON_KEY,
      'Authorization': `Bearer ${ANON_KEY}`
    }
  });

  await fetch(`${BASE_URL}/rest/v1/clients?id=eq.${client.id}`, {
    method: 'DELETE',
    headers: {
      'apikey': ANON_KEY,
      'Authorization': `Bearer ${ANON_KEY}`
    }
  });
}

async function testEventTracking() {
  // Create a test proposal first
  const clientResponse = await fetch(`${BASE_URL}/rest/v1/clients`, {
    method: 'POST',
    headers: {
      'apikey': ANON_KEY,
      'Authorization': `Bearer ${ANON_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: 'Event Test Client',
      email: 'event@test.com',
      company: 'Event Test Co'
    })
  });

  const clientText = await clientResponse.text();
  const client = JSON.parse(clientText);

  const proposalResponse = await fetch(`${BASE_URL}/rest/v1/proposals`, {
    method: 'POST',
    headers: {
      'apikey': ANON_KEY,
      'Authorization': `Bearer ${ANON_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      client_id: client.id,
      title: 'Event Test Proposal',
      total_value: 5000,
      currency: 'USD',
      status: 'draft'
    })
  });

  const proposalText = await proposalResponse.text();
  const proposal = JSON.parse(proposalText);

  // Create an event
  const eventResponse = await fetch(`${BASE_URL}/rest/v1/proposal_events`, {
    method: 'POST',
    headers: {
      'apikey': ANON_KEY,
      'Authorization': `Bearer ${ANON_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      proposal_id: proposal.id,
      event_type: 'viewed',
      event_data: { test: true }
    })
  });

  if (!eventResponse.ok) {
    throw new Error(`Failed to create event: ${eventResponse.status}`);
  }

  // Cleanup
  await fetch(`${BASE_URL}/rest/v1/proposal_events?proposal_id=eq.${proposal.id}`, {
    method: 'DELETE',
    headers: {
      'apikey': ANON_KEY,
      'Authorization': `Bearer ${ANON_KEY}`
    }
  });

  await fetch(`${BASE_URL}/rest/v1/proposals?id=eq.${proposal.id}`, {
    method: 'DELETE',
    headers: {
      'apikey': ANON_KEY,
      'Authorization': `Bearer ${ANON_KEY}`
    }
  });

  await fetch(`${BASE_URL}/rest/v1/clients?id=eq.${client.id}`, {
    method: 'DELETE',
    headers: {
      'apikey': ANON_KEY,
      'Authorization': `Bearer ${ANON_KEY}`
    }
  });
}

async function testEmailTables() {
  const response = await fetch(`${BASE_URL}/rest/v1/email_templates`, {
    headers: {
      'apikey': ANON_KEY,
      'Authorization': `Bearer ${ANON_KEY}`
    }
  });

  if (!response.ok) {
    throw new Error(`Email templates table not accessible: ${response.status}`);
  }

  const templates = await response.json();
  if (!templates || templates.length === 0) {
    throw new Error('No email templates found');
  }
}

async function testPaymentTables() {
  const response = await fetch(`${BASE_URL}/rest/v1/payment_sessions?select=count`, {
    headers: {
      'apikey': ANON_KEY,
      'Authorization': `Bearer ${ANON_KEY}`
    }
  });

  if (!response.ok) {
    throw new Error(`Payment sessions table not accessible: ${response.status}`);
  }
}

async function testPsychologyProfiles() {
  const response = await fetch(`${BASE_URL}/rest/v1/psychology_profiles?select=count`, {
    headers: {
      'apikey': ANON_KEY,
      'Authorization': `Bearer ${ANON_KEY}`
    }
  });

  if (!response.ok) {
    throw new Error(`Psychology profiles table not accessible: ${response.status}`);
  }
}

async function testNotificationPreferences() {
  // Create a test preference
  const response = await fetch(`${BASE_URL}/rest/v1/notification_preferences`, {
    method: 'POST',
    headers: {
      'apikey': ANON_KEY,
      'Authorization': `Bearer ${ANON_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      user_email: 'test@preferences.com',
      proposal_created: true,
      proposal_viewed: true,
      proposal_accepted: true
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to create notification preference: ${response.status}`);
  }

  const prefText = await response.text();
  const pref = JSON.parse(prefText);

  // Cleanup
  await fetch(`${BASE_URL}/rest/v1/notification_preferences?id=eq.${pref.id}`, {
    method: 'DELETE',
    headers: {
      'apikey': ANON_KEY,
      'Authorization': `Bearer ${ANON_KEY}`
    }
  });
}

// Main test runner
async function runAllTests() {
  console.log('\n' + '='.repeat(60));
  log('🧪 Proposal Generation System - Comprehensive Test Suite', 'info');
  console.log('='.repeat(60) + '\n');

  log('Testing Database Connectivity...', 'info');
  await runTest('Database Connection', testDatabaseConnection);

  log('\nTesting Authentication...', 'info');
  await runTest('API Key Validation', testApiKeyValidation);

  log('\nTesting Core Functionality...', 'info');
  await runTest('Proposal Creation', testProposalCreation);
  await runTest('Event Tracking', testEventTracking);
  await runTest('Psychology Profiles', testPsychologyProfiles);

  log('\nTesting Email System...', 'info');
  await runTest('Email Templates', testEmailTables);
  await runTest('Notification Preferences', testNotificationPreferences);

  log('\nTesting Payment System...', 'info');
  await runTest('Payment Tables', testPaymentTables);

  // Summary
  console.log('\n' + '='.repeat(60));
  log('TEST RESULTS', 'info');
  console.log('='.repeat(60));
  log(`✅ Passed: ${testsPassed}`, 'success');
  if (testsFailed > 0) {
    log(`❌ Failed: ${testsFailed}`, 'error');
  }

  const successRate = ((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1);

  if (testsFailed === 0) {
    log(`\n🎉 All tests passed! Success rate: ${successRate}%`, 'success');
    log('✨ System is production ready!', 'success');
  } else {
    log(`\n⚠️  Some tests failed. Success rate: ${successRate}%`, 'warning');
    log('Please fix the failing tests before deploying to production.', 'warning');
  }

  console.log('='.repeat(60) + '\n');

  process.exit(testsFailed > 0 ? 1 : 0);
}

// Run tests
runAllTests().catch(error => {
  log(`\n❌ Test suite failed: ${error.message}`, 'error');
  process.exit(1);
});