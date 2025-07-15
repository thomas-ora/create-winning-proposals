-- Update existing proposals with expired dates to have valid future dates
UPDATE proposals 
SET 
  valid_until = '2026-08-20T23:59:59Z',
  expires_at = '2026-08-20T23:59:59Z',
  updated_at = now()
WHERE valid_until < now() OR expires_at < now();

-- Update clients consultation dates to current year  
UPDATE clients 
SET 
  consultation_date = '2025-07-20T14:00:00Z',
  updated_at = now()
WHERE consultation_date < '2025-01-01T00:00:00Z';