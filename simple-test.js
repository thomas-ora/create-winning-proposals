#!/usr/bin/env node

/**
 * Simple Test Script for Proposal System
 * Validates core functionality is working
 */

const BASE_URL = 'https://knyzwlsewissymnuczxz.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtueXp3bHNld2lzc3ltbnVjenh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxNjY1MzgsImV4cCI6MjA3MTc0MjUzOH0.nndDloB2G2Aw0aWCIib1WtyRy1gZaSik7A4xu5xdk40';

async function runTests() {
  console.log('🧪 Running Simple System Tests...\n');

  let passed = 0;
  let failed = 0;

  // Test 1: Database Connection
  console.log('1. Testing Database Connection...');
  try {
    const response = await fetch(`${BASE_URL}/rest/v1/`, {
      headers: { 'apikey': ANON_KEY }
    });
    if (response.ok) {
      console.log('   ✅ Database connected\n');
      passed++;
    } else {
      throw new Error(`Status: ${response.status}`);
    }
  } catch (error) {
    console.log(`   ❌ Database connection failed: ${error.message}\n`);
    failed++;
  }

  // Test 2: Tables Exist
  console.log('2. Testing Required Tables...');
  const tables = [
    'api_keys',
    'clients',
    'proposals',
    'proposal_events',
    'psychology_profiles',
    'email_templates',
    'email_logs',
    'notification_preferences',
    'payment_sessions'
  ];

  for (const table of tables) {
    try {
      const response = await fetch(`${BASE_URL}/rest/v1/${table}?select=count`, {
        headers: { 'apikey': ANON_KEY }
      });

      if (response.ok) {
        console.log(`   ✅ ${table}`);
        passed++;
      } else {
        const error = await response.text();
        throw new Error(error);
      }
    } catch (error) {
      console.log(`   ❌ ${table}: ${error.message.substring(0, 50)}`);
      failed++;
    }
  }

  // Test 3: Development API Key
  console.log('\n3. Testing Development API Key...');
  try {
    const response = await fetch(`${BASE_URL}/rest/v1/api_keys?name=eq.Development%20Key`, {
      headers: { 'apikey': ANON_KEY }
    });

    const data = await response.json();
    if (data && data.length > 0 && data[0].is_active) {
      console.log('   ✅ Development API key exists and is active');
      console.log(`   Key hash: ${data[0].key_hash.substring(0, 20)}...`);
      console.log('   Test with key: 12345\n');
      passed++;
    } else {
      throw new Error('Key not found or inactive');
    }
  } catch (error) {
    console.log(`   ❌ API key test failed: ${error.message}\n`);
    failed++;
  }

  // Test 4: Email Templates
  console.log('4. Testing Email Templates...');
  try {
    const response = await fetch(`${BASE_URL}/rest/v1/email_templates`, {
      headers: { 'apikey': ANON_KEY }
    });

    const templates = await response.json();
    if (templates && templates.length > 0) {
      console.log(`   ✅ ${templates.length} email templates found`);
      templates.forEach(t => console.log(`      - ${t.name}`));
      passed++;
    } else {
      throw new Error('No templates found');
    }
  } catch (error) {
    console.log(`   ❌ Email templates test failed: ${error.message}`);
    failed++;
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('TEST SUMMARY');
  console.log('='.repeat(50));
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);

  const total = passed + failed;
  const percentage = ((passed / total) * 100).toFixed(1);

  console.log(`Success Rate: ${percentage}%`);

  if (failed === 0) {
    console.log('\n🎉 All core systems operational!');
    console.log('✨ The proposal system is ready for use!');
  } else {
    console.log('\n⚠️  Some components need attention.');
    console.log('Please check the failed tests above.');
  }

  console.log('='.repeat(50));

  // Application URLs
  console.log('\n📍 Access Points:');
  console.log('   Main App:    http://localhost:8080');
  console.log('   Health Check: http://localhost:8080/health');
  console.log('   API Test:     http://localhost:8080/test-api');
  console.log('   API Keys:     http://localhost:8080/settings/api-keys');
  console.log('\n');

  process.exit(failed > 0 ? 1 : 0);
}

// Run the tests
runTests().catch(error => {
  console.error('Test suite failed:', error);
  process.exit(1);
});