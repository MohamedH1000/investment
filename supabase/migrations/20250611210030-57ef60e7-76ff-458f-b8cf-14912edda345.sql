
-- Create subscribers table to store user details and consent
CREATE TABLE public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  promotional_consent BOOLEAN DEFAULT false,
  payment_method TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Create policies for subscribers table
CREATE POLICY "Allow read subscribers" ON public.subscribers
  FOR SELECT USING (true);

CREATE POLICY "Allow insert subscribers" ON public.subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update subscribers" ON public.subscribers
  FOR UPDATE USING (true);

-- Create promotional_emails table to track sent emails
CREATE TABLE public.promotional_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  sent_to_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  sent_by TEXT DEFAULT 'admin'
);

-- Enable Row Level Security
ALTER TABLE public.promotional_emails ENABLE ROW LEVEL SECURITY;

-- Create policies for promotional_emails table
CREATE POLICY "Allow read promotional_emails" ON public.promotional_emails
  FOR SELECT USING (true);

CREATE POLICY "Allow insert promotional_emails" ON public.promotional_emails
  FOR INSERT WITH CHECK (true);

-- Update the existing payments table to link with subscribers
ALTER TABLE public.payments ADD COLUMN subscriber_id UUID REFERENCES public.subscribers(id);
