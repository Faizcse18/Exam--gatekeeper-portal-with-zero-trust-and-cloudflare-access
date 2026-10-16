DROP TABLE IF EXISTS role_map_new;
DROP TABLE IF EXISTS app_rules_new;

CREATE TABLE role_map_new (
  email TEXT PRIMARY KEY COLLATE NOCASE,
  role TEXT NOT NULL CHECK (role IN ('student', 'faculty', 'accounts', 'admin'))
);

INSERT INTO role_map_new (email, role)
SELECT
  email,
  CASE LOWER(role)
    WHEN 'intern' THEN 'student'
    WHEN 'engineer' THEN 'faculty'
    WHEN 'hr' THEN 'accounts'
    WHEN 'admin' THEN 'admin'
  END
FROM role_map;

DROP TABLE role_map;
ALTER TABLE role_map_new RENAME TO role_map;

UPDATE role_map SET email = 'faculty@example.com' WHERE email = 'engineer@example.com';
UPDATE role_map SET email = 'accounts@example.com' WHERE email = 'hr@example.com';

CREATE TABLE app_rules_new (
  app TEXT PRIMARY KEY,
  allowed_roles TEXT NOT NULL CHECK (json_valid(allowed_roles))
);

INSERT INTO app_rules_new (app, allowed_roles) VALUES
  ('library', '["student","faculty","accounts","admin"]'),
  ('exam-cell', '["faculty","admin"]'),
  ('fees', '["accounts","admin"]'),
  ('admin-office', '["admin"]');

DROP TABLE app_rules;
ALTER TABLE app_rules_new RENAME TO app_rules;

DELETE FROM audit_log;