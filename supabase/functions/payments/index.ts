import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const ALLOWED_ORIGINS = [
  "https://black-magic-ai.app",
  "http://localhost:5173",
  "http://localhost:3000",
];

const PLAN_AMOUNTS: Record<string, Record<string, number>> = {
  creator: { monthly: 1499, yearly: 1199 },
  pro: { monthly: 3499, yearly: 2799 },
  agency: { monthly: 6999, yearly: 5599 },
};

const RATE_LIMIT_WINDOW = 60_000;
const RATE_LIMIT_MAX = 5;
const rateLimitMap = new Map<string, { count: number; windowStart: number }>();

function validateOrigin(req: Request): string {
  const origin = req.headers.get("Origin") || "";
  if (ALLOWED_ORIGINS.includes(origin)) return origin;
  return ALLOWED_ORIGINS[0];
}

function sanitizeString(input: string, maxLength: number): string {
  return input.slice(0, maxLength).replace(/<[^>]*>/g, "").trim();
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

function errorResponse(status: number, message: string, origin: string) {
  return new Response(
    JSON.stringify({ error: message }),
    {
      status,
      headers: {
        ...corsHeaders,
        "Access-Control-Allow-Origin": origin,
        "Content-Type": "application/json",
      },
    }
  );
}

Deno.serve(async (req: Request) => {
  const origin = validateOrigin(req);
  const responseHeaders = {
    ...corsHeaders,
    "Access-Control-Allow-Origin": origin,
    "Content-Type": "application/json",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Content-Security-Policy": "default-src 'self'",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: responseHeaders });
  }

  if (req.method !== "POST") {
    return errorResponse(405, "Method not allowed", origin);
  }

  try {
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    if (!checkRateLimit(clientIp)) {
      return errorResponse(429, "Too many requests. Please wait before trying again.", origin);
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse(401, "Authentication required", origin);
    }

    const token = authHeader.replace("Bearer ", "");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: supabaseKey,
      },
    });

    if (!userRes.ok) {
      return errorResponse(401, "Invalid or expired token", origin);
    }

    const user = await userRes.json();
    const userId = user.id;

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return errorResponse(400, "Invalid JSON body", origin);
    }

    const action = body.action as string;

    if (action === "create") {
      const planId = sanitizeString((body.plan_id as string) || "", 20);
      const billingCycle = sanitizeString((body.billing_cycle as string) || "", 10);

      if (!planId || !PLAN_AMOUNTS[planId]) {
        return errorResponse(400, "Invalid plan. Must be creator, pro, or agency.", origin);
      }
      if (!billingCycle || !["monthly", "yearly"].includes(billingCycle)) {
        return errorResponse(400, "Invalid billing cycle. Must be monthly or yearly.", origin);
      }

      const expectedAmount = PLAN_AMOUNTS[planId][billingCycle];

      const recentPaymentsRes = await fetch(
        `${supabaseUrl}/rest/v1/payments?user_id=eq.${userId}&status=eq.pending&created_at=gte.${new Date(Date.now() - 30 * 60 * 1000).toISOString()}&select=id`,
        {
          headers: {
            Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!}`,
            apikey: supabaseKey,
            "Content-Type": "application/json",
            Prefer: "count=exact",
          },
        }
      );

      const recentPayments = await recentPaymentsRes.json();
      if (Array.isArray(recentPayments) && recentPayments.length >= 3) {
        return errorResponse(429, "Too many pending payments. Please wait for existing payments to be verified.", origin);
      }

      const transactionRef = `BMA_${planId.toUpperCase()}_${billingCycle.charAt(0).toUpperCase()}_${Date.now()}_${userId.slice(0, 8)}`;

      const insertRes = await fetch(`${supabaseUrl}/rest/v1/payments`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!}`,
          apikey: supabaseKey,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          user_id: userId,
          plan_id: planId,
          amount: expectedAmount,
          currency: "INR",
          billing_cycle: billingCycle,
          status: "pending",
          payment_method: "phonepe_qr",
          transaction_ref: transactionRef,
          notes: `Payment initiated for ${planId} plan (${billingCycle})`,
        }),
      });

      if (!insertRes.ok) {
        return errorResponse(500, "Failed to create payment record", origin);
      }

      const payment = (await insertRes.json())[0];

      return new Response(
        JSON.stringify({
          payment_id: payment.id,
          transaction_ref: transactionRef,
          amount: expectedAmount,
          currency: "INR",
          plan_id: planId,
          billing_cycle: billingCycle,
          status: "pending",
          message: "Scan the QR code with PhonePe to complete payment. Include the transaction reference in payment notes.",
        }),
        { status: 201, headers: responseHeaders }
      );
    }

    if (action === "status") {
      const paymentId = sanitizeString((body.payment_id as string) || "", 40);

      if (!paymentId) {
        return errorResponse(400, "Payment ID is required", origin);
      }

      const statusRes = await fetch(
        `${supabaseUrl}/rest/v1/payments?id=eq.${paymentId}&user_id=eq.${userId}&select=id,plan_id,amount,currency,billing_cycle,status,transaction_ref,created_at,verified_at`,
        {
          headers: {
            Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!}`,
            apikey: supabaseKey,
          },
        }
      );

      const payments = await statusRes.json();
      if (!Array.isArray(payments) || payments.length === 0) {
        return errorResponse(404, "Payment not found", origin);
      }

      return new Response(
        JSON.stringify({ payment: payments[0] }),
        { headers: responseHeaders }
      );
    }

    if (action === "history") {
      const historyRes = await fetch(
        `${supabaseUrl}/rest/v1/payments?user_id=eq.${userId}&select=id,plan_id,amount,currency,billing_cycle,status,transaction_ref,created_at,verified_at&order=created_at.desc&limit=20`,
        {
          headers: {
            Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!}`,
            apikey: supabaseKey,
          },
        }
      );

      const payments = await historyRes.json();

      return new Response(
        JSON.stringify({ payments }),
        { headers: responseHeaders }
      );
    }

    return errorResponse(400, "Invalid action. Must be create, status, or history.", origin);
  } catch {
    return errorResponse(500, "Internal server error", origin);
  }
});
