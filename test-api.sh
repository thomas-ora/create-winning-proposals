#!/bin/bash

echo "Testing API connection..."

curl -s "https://knyzwlsewissymnuczxz.supabase.co/rest/v1/api_keys?select=*" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtueXp3bHNld2lzc3ltbnVjenh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxNjY1MzgsImV4cCI6MjA3MTc0MjUzOH0.nndDloB2G2Aw0aWCIib1WtyRy1gZaSik7A4xu5xdk40" | python3 -m json.tool

echo ""
echo "Testing proposals table..."

curl -s "https://knyzwlsewissymnuczxz.supabase.co/rest/v1/proposals?select=count" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtueXp3bHNld2lzc3ltbnVjenh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxNjY1MzgsImV4cCI6MjA3MTc0MjUzOH0.nndDloB2G2Aw0aWCIib1WtyRy1gZaSik7A4xu5xdk40"