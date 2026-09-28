CREATE TABLE IF NOT EXISTS profile_counter (
  key TEXT PRIMARY KEY CHECK (key = 'profile_views'),
  count INTEGER NOT NULL DEFAULT 0 CHECK (count >= 0)
);

INSERT INTO profile_counter (key, count)
VALUES ('profile_views', 0)
ON CONFLICT(key) DO NOTHING;
