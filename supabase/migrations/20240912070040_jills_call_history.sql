CREATE TABLE jills_call_history (
  call_id TEXT PRIMARY KEY,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE jills_call_history ENABLE ROW LEVEL SECURITY;

-- Create a policy for public read and write access
CREATE POLICY "Public read and write access for jills_call_history"
ON jills_call_history
FOR ALL
USING (true)
WITH CHECK (true);
