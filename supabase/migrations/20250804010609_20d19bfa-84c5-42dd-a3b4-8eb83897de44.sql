-- Fix the expired proposal by setting a valid future date
UPDATE proposals 
SET valid_until = (created_at + INTERVAL '30 days')::date
WHERE id = 'b15a8383-f4a5-4e6d-945b-c1d5789b1256';

-- Fix any other proposals that have invalid dates
UPDATE proposals 
SET valid_until = (created_at + INTERVAL '30 days')::date
WHERE valid_until < created_at::date;