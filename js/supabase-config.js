// ============================================================
// Supabase Configuration — Golden Library Pro
// ============================================================
// IMPORTANT: Replace the placeholder values below with your
// actual Supabase Project URL, Anon Key, and Service Role Key.
// You can find these in your Supabase Dashboard → Settings → API.
// ============================================================

const SUPABASE_URL = 'https://nhbukulrmcmumlgreifj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5oYnVrdWxybWNtdW1sZ3JlaWZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMzAzODcsImV4cCI6MjA5MDgwNjM4N30.3ZPtTri-Z31QEixxB2AeWdSCFfU512p0CadU3xEVptk';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5oYnVrdWxybWNtdW1sZ3JlaWZqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTIzMDM4NywiZXhwIjoyMDkwODA2Mzg3fQ.Z7rcJaxLIHLFvHjXYxQq5axsObLWGauIhEg0WgmK9O8';

// Regular client (uses Anon Key — respects RLS)
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Admin client (uses Service Role Key — bypasses RLS, for admin panel only)
const supabaseAdmin = supabase.createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});
