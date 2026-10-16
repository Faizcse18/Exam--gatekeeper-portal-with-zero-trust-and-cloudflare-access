CREATE TABLE role_map (
  email TEXT PRIMARY KEY COLLATE NOCASE,
  role TEXT NOT NULL CHECK (role IN ('intern', 'engineer', 'hr', 'admin'))
);

CREATE TABLE app_rules (
  app TEXT PRIMARY KEY,
  allowed_roles TEXT NOT NULL CHECK (json_valid(allowed_roles))
);

CREATE TABLE audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  email TEXT,
  app TEXT NOT NULL,
  decision TEXT NOT NULL CHECK (decision IN ('allow', 'deny')),
  reason TEXT NOT NULL,
  country TEXT
);

CREATE INDEX audit_log_id_desc ON audit_log (id DESC);

INSERT INTO role_map (email, role) VALUES
  ('intern@example.com', 'intern'),
  ('engineer@example.com', 'engineer'),
  ('hr@example.com', 'hr'),
  ('admin@example.com', 'admin');

INSERT INTO app_rules (app, allowed_roles) VALUES
  ('wiki', '["intern","engineer","hr","admin"]'),
  ('engineering', '["engineer","admin"]'),
  ('payroll', '["hr","admin"]'),
  ('admin-console', '["admin"]');