import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://qqcieafhthjfmrxngbfd.supabase.co";
const supbabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxY2llYWZodGhqZm1yeG5nYmZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2MDA4MzMsImV4cCI6MjA1MDE3NjgzM30.hRHgnH_czZl_le23U5NBwjdUL0AV5VmPsepyaznJNGM";
// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supbabaseKey);