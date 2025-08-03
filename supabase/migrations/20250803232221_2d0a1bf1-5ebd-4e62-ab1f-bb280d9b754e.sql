-- Fix the remaining function search path issue
-- Update generate_unique_slug function with proper search_path
CREATE OR REPLACE FUNCTION public.generate_unique_slug(base_slug text, table_name text, column_name text)
RETURNS text
LANGUAGE plpgsql
SET search_path = 'public'
AS $$
DECLARE
    final_slug text;
    counter integer := 1;
    sql_query text;
    slug_exists boolean;
BEGIN
    final_slug := base_slug;
    
    LOOP
        -- Check if slug exists
        sql_query := format('SELECT EXISTS(SELECT 1 FROM %I WHERE %I = $1)', table_name, column_name);
        EXECUTE sql_query USING final_slug INTO slug_exists;
        
        -- If slug doesn't exist, return it
        IF NOT slug_exists THEN
            RETURN final_slug;
        END IF;
        
        -- Generate next variant
        counter := counter + 1;
        final_slug := base_slug || '-' || counter;
    END LOOP;
END;
$$;