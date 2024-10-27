CREATE TABLE tasks(
  id INT8 PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR,
  description TEXT,
  task_type VARCHAR,
  guide_url VARCHAR,
  action_url VARCHAR,
  required_docs JSONB,
  output VARCHAR,
  step_order INTEGER,
  is_final BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT 'NOW()',
  updated_at TIMESTAMPTZ NULL DEFAULT 'NOW()',
  next_task_id INT8 REFERENCES tasks(id)
)