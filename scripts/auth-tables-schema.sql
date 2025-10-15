-- FleetFlow Authentication System Database Schema
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- USERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  company_name VARCHAR(255) NOT NULL,
  position VARCHAR(100) NOT NULL,
  department VARCHAR(100),
  selected_plan VARCHAR(50) NOT NULL,
  role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'dispatcher', 'broker')),
  status VARCHAR(50) DEFAULT 'pending_verification' CHECK (status IN ('pending_verification', 'active', 'inactive')),
  email_verified BOOLEAN DEFAULT false,
  agree_to_terms BOOLEAN DEFAULT false NOT NULL,
  agree_to_marketing BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- ============================================================================
-- SUBSCRIPTIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'trial' CHECK (status IN ('trial', 'active', 'cancelled', 'expired', 'payment_failed')),
  trial_start TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  billing_start TIMESTAMP WITH TIME ZONE,
  billing_end TIMESTAMP WITH TIME ZONE,
  payment_method VARCHAR(50),
  amount DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'USD',
  billing_cycle VARCHAR(20) CHECK (billing_cycle IN ('monthly', 'quarterly', 'annual')),
  auto_renew BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for subscriptions
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- ============================================================================
-- VERIFICATION TOKENS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS verification_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(500) UNIQUE NOT NULL,
  token_type VARCHAR(50) NOT NULL CHECK (token_type IN ('email_verification', 'password_reset', 'phone_verification')),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT false,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for verification tokens
CREATE INDEX IF NOT EXISTS idx_verification_tokens_user ON verification_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_token ON verification_tokens(token);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_expires ON verification_tokens(expires_at);

-- ============================================================================
-- USER SESSIONS TABLE (for tracking active sessions)
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_token VARCHAR(500) UNIQUE NOT NULL,
  ip_address VARCHAR(50),
  user_agent TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for sessions
CREATE INDEX IF NOT EXISTS idx_user_sessions_user ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires ON user_sessions(expires_at);

-- ============================================================================
-- AUDIT LOG TABLE (for security and compliance)
-- ============================================================================
CREATE TABLE IF NOT EXISTS auth_audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  resource VARCHAR(100),
  ip_address VARCHAR(50),
  user_agent TEXT,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for audit log
CREATE INDEX IF NOT EXISTS idx_auth_audit_user ON auth_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_audit_action ON auth_audit_log(action);
CREATE INDEX IF NOT EXISTS idx_auth_audit_created ON auth_audit_log(created_at DESC);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to clean up expired tokens (run periodically)
CREATE OR REPLACE FUNCTION cleanup_expired_tokens()
RETURNS void AS $$
BEGIN
  DELETE FROM verification_tokens
  WHERE expires_at < NOW() AND used = false;
  
  DELETE FROM user_sessions
  WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- VIEWS
-- ============================================================================

-- Active users view
CREATE OR REPLACE VIEW active_users AS
SELECT 
  u.id,
  u.name,
  u.email,
  u.company_name,
  u.role,
  u.created_at,
  s.plan_id,
  s.status as subscription_status
FROM users u
LEFT JOIN subscriptions s ON u.id = s.user_id
WHERE u.status = 'active' AND u.email_verified = true;

-- Pending verifications view
CREATE OR REPLACE VIEW pending_verifications AS
SELECT 
  u.id,
  u.name,
  u.email,
  u.company_name,
  u.created_at,
  vt.token,
  vt.expires_at
FROM users u
LEFT JOIN verification_tokens vt ON u.id = vt.user_id
WHERE u.status = 'pending_verification' 
  AND u.email_verified = false
  AND vt.token_type = 'email_verification'
  AND vt.used = false
  AND vt.expires_at > NOW();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) - Optional but recommended
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_audit_log ENABLE ROW LEVEL SECURITY;

-- Policies for users table
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Policies for subscriptions table
CREATE POLICY "Users can view their own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid()::text = user_id::text);

-- ============================================================================
-- SAMPLE DATA (for testing only - remove in production)
-- ============================================================================

-- Uncomment below to insert a test user (password: TestPassword123!)
-- INSERT INTO users (name, email, password_hash, company_name, position, selected_plan, role, status, email_verified, agree_to_terms)
-- VALUES (
--   'Test User',
--   'test@fleetflow.com',
--   '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5O2LH5RkEaB3u',
--   'FleetFlow Test Company',
--   'Manager',
--   'professional',
--   'admin',
--   'active',
--   true,
--   true
-- );

-- ============================================================================
-- VERIFICATION QUERY
-- ============================================================================

-- Run this to verify all tables were created successfully:
SELECT 
  table_name, 
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_name IN ('users', 'subscriptions', 'verification_tokens', 'user_sessions', 'auth_audit_log')
ORDER BY table_name;

-- Check indexes
SELECT 
  tablename, 
  indexname, 
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('users', 'subscriptions', 'verification_tokens', 'user_sessions', 'auth_audit_log')
ORDER BY tablename, indexname;




