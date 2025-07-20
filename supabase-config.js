// Supabase Configuration for FleetFlow
// Copy these values to your .env.local file

const SUPABASE_CONFIG = {
  // Your Supabase Project URL
  NEXT_PUBLIC_SUPABASE_URL: 'https://nleqplwwothhxgrovnjw.supabase.co',
  
  // Your Supabase Anon Key (Public)
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sZXFwbHd3b3RoaHhncm92bmp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNzczODcsImV4cCI6MjA2Nzk1MzM4N30.SewQx-DIRXaKLtPHbxnmRWvdx96_VtMu5sjoKpaBWjg',
  
  // You'll need to get this from Supabase Dashboard > Settings > API > service_role key
  SUPABASE_SERVICE_ROLE_KEY: 'your_service_role_key_here'
}

// Instructions:
// 1. Create a .env.local file in your project root
// 2. Add the following lines:
// NEXT_PUBLIC_SUPABASE_URL=https://nleqplwwothhxgrovnjw.supabase.co
// NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sZXFwbHd3b3RoaHhncm92bmp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNzczODcsImV4cCI6MjA2Nzk1MzM4N30.SewQx-DIRXaKLtPHbxnmRWvdx96_VtMu5sjoKpaBWjg
// SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

export default SUPABASE_CONFIG 