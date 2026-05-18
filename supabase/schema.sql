-- Papatong - Supabase Schema
-- Jalankan SQL ini di Supabase SQL Editor untuk membuat tabel

-- Tabel untuk menyimpan roster anggota
CREATE TABLE IF NOT EXISTS rosters (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  members JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index untuk sorting berdasarkan waktu
CREATE INDEX idx_rosters_created_at ON rosters (created_at DESC);

-- Row Level Security (opsional, untuk proteksi)
ALTER TABLE rosters ENABLE ROW LEVEL SECURITY;

-- Policy: semua orang bisa baca (untuk anon key)
CREATE POLICY "Allow public read" ON rosters
  FOR SELECT USING (true);

-- Policy: semua orang bisa insert
CREATE POLICY "Allow public insert" ON rosters
  FOR INSERT WITH CHECK (true);

-- Policy: semua orang bisa delete
CREATE POLICY "Allow public delete" ON rosters
  FOR DELETE USING (true);
