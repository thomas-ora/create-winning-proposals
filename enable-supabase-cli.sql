-- Enable Supabase CLI Access for Ora-Admin Database
-- ==================================================
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)

-- 1. Enable necessary extensions for CLI access
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pgjwt";
CREATE EXTENSION IF NOT EXISTS "pg_graphql";

-- 2. Create schema for Supabase CLI if it doesn't exist
CREATE SCHEMA IF NOT EXISTS supabase_migrations;

-- 3. Create migrations table for tracking
CREATE TABLE IF NOT EXISTS supabase_migrations.schema_migrations (
    version text PRIMARY KEY,
    inserted_at timestamp without time zone DEFAULT now()
);

-- 4. Grant necessary permissions for CLI
GRANT ALL ON SCHEMA supabase_migrations TO postgres;
GRANT ALL ON ALL TABLES IN SCHEMA supabase_migrations TO postgres;
GRANT ALL ON ALL SEQUENCES IN SCHEMA supabase_migrations TO postgres;

-- 5. Enable required settings for remote access
ALTER DATABASE postgres SET statement_timeout = '60s';
ALTER DATABASE postgres SET lock_timeout = '10s';

-- 6. Create CLI access verification
DO $$
BEGIN
    RAISE NOTICE 'Supabase CLI access enabled successfully!';
    RAISE NOTICE 'You can now run: supabase link --project-ref knyzwlsewissymnuczxz';
END $$;

-- 7. Verify the setup
SELECT
    current_database() as database,
    current_user as user,
    version() as postgres_version,
    'CLI Access Enabled' as status;