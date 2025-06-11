
-- Create admin_users table for admin authentication
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_users table
CREATE POLICY "Allow read admin_users" ON public.admin_users
  FOR SELECT USING (true);

-- Insert a default admin user (password: admin123)
-- You should change this password after first login
INSERT INTO public.admin_users (username, password_hash, role) 
VALUES ('admin', '$2b$10$8K1p/a0dFpg7qiRgHkFX4.WmB7Wi0Grd4ukIqvl0iJBdQ5YjbLyOu', 'admin');
