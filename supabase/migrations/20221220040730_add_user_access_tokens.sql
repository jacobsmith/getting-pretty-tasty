CREATE TABLE user_access_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  access_token text NOT NULL,
  refresh_token text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);
