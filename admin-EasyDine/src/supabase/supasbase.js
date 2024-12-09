import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://supabase.fcs.ninja";
const supbaBaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogImFub24iLAogICJpc3MiOiAic3VwYWJhc2UiLAogICJpYXQiOiAxNzE3MTc0ODAwLAogICJleHAiOiAxODc0OTQxMjAwCn0.H7X9t-iS9Qiw0pfA-DCJkXVyUDctAjF-LROw8VgV068";
// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supbaBaseKey);