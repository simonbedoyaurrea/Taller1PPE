import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ewkeotcvacznrrcmpoam.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3a2VvdGN2YWN6bnJyY21wb2FtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNDA2MTYsImV4cCI6MjA4ODgxNjYxNn0.oUxTsZ_WCiDcKiq6TctOKvvtcUJLq-_jwVgqoBBYSik";

export const supabase = createClient(supabaseUrl, supabaseKey);
