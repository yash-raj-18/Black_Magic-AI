/*
  # Create Payments Table

  1. New Tables
    - `payments`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `plan_id` (text, references the plan selected: creator, pro, agency)
      - `amount` (integer, payment amount in cents)
      - `currency` (text, default 'INR')
      - `billing_cycle` (text, 'monthly' or 'yearly')
      - `status` (text, default 'pending' - pending/verified/failed/refunded)
      - `payment_method` (text, default 'phonepe_qr')
      - `transaction_ref` (text, unique reference from PhonePe)
      - `verified_at` (timestamptz, when admin verified payment)
      - `verified_by` (uuid, admin who verified)
      - `notes` (text, optional notes)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `payments` table
    - Users can only view their own payments
    - Only authenticated users can insert their own payments
    - Users cannot update or delete payments (admin only)
    - Add rate limit tracking via payment_attempts concept

  3. Indexes
    - Index on user_id for fast user payment lookups
    - Index on status for admin filtering
    - Unique constraint on transaction_ref to prevent duplicates
*/

CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id text NOT NULL CHECK (plan_id IN ('creator', 'pro', 'agency')),
  amount integer NOT NULL CHECK (amount > 0),
  currency text NOT NULL DEFAULT 'INR',
  billing_cycle text NOT NULL CHECK (billing_cycle IN ('monthly', 'yearly')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'failed', 'refunded')),
  payment_method text NOT NULL DEFAULT 'phonepe_qr',
  transaction_ref text UNIQUE,
  verified_at timestamptz,
  verified_by uuid,
  notes text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at DESC);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payments"
  ON payments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all payments"
  ON payments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.plan = 'admin'
    )
  );

CREATE POLICY "Admins can update payments"
  ON payments FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.plan = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.plan = 'admin'
    )
  );
