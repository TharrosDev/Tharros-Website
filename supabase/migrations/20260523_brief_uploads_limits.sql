-- 20260523_brief_uploads_limits.sql
-- Enforce upload constraints at the bucket level. The size/MIME checks in
-- /api/brief/upload-url are advisory only — the signed PUT ignores them, so
-- without this an attacker who can mint an upload URL could store an
-- arbitrarily large file. file_size_limit + allowed_mime_types are enforced by
-- Supabase Storage on every upload regardless of the client.
-- Apply via Supabase dashboard SQL editor or `supabase db push`.

update storage.buckets
set
  file_size_limit = 52428800, -- 50 MB, matches MAX_BYTES in the API route
  allowed_mime_types = array[
    'image/png','image/jpeg','image/gif','image/webp','image/avif','image/svg+xml',
    'video/mp4','video/quicktime','video/webm',
    'application/pdf',
    'application/zip','application/x-zip-compressed',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
where id = 'brief-uploads';
