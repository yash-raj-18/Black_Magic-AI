import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const ALLOWED_ORIGINS = [
  "https://black-magic-ai.app",
  "http://localhost:5173",
  "http://localhost:3000",
];

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
};

const YOUTUBE_URL_REGEX = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/|embed\/)|youtu\.be\/)[\w-]{11}/;

function validateOrigin(req: Request): string {
  const origin = req.headers.get("Origin") || "";
  if (ALLOWED_ORIGINS.includes(origin)) return origin;
  return ALLOWED_ORIGINS[0];
}

function sanitizeString(input: string, maxLength: number): string {
  return input.slice(0, maxLength).replace(/<[^>]*>/g, "");
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
  const responseCorsHeaders = {
    ...corsHeaders,
    "Access-Control-Allow-Origin": origin,
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: responseCorsHeaders });
  }

  if (req.method !== "GET" && req.method !== "POST") {
    return errorResponse(405, "Method not allowed", origin);
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse(401, "Missing or invalid authorization header", origin);
    }

    const url = new URL(req.url);
    const path = url.pathname.replace("/functions/v1/api", "");

    if (path === "/health" && req.method === "GET") {
      return new Response(
        JSON.stringify({ status: "ok", service: "black-magic-ai", timestamp: new Date().toISOString() }),
        { headers: { ...responseCorsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (path === "/generate" && req.method === "POST") {
      let body: Record<string, unknown>;
      try {
        body = await req.json();
      } catch {
        return errorResponse(400, "Invalid JSON body", origin);
      }

      const sourceType = body.source_type as string;
      const sourceUrl = body.source_url as string;
      const transcript = body.transcript as string;

      if (!sourceType || !["youtube", "upload", "transcript"].includes(sourceType)) {
        return errorResponse(400, "Invalid source_type. Must be youtube, upload, or transcript.", origin);
      }

      if (sourceType === "youtube") {
        if (!sourceUrl || typeof sourceUrl !== "string") {
          return errorResponse(400, "source_url is required for youtube source type", origin);
        }
        if (!YOUTUBE_URL_REGEX.test(sourceUrl as string)) {
          return errorResponse(400, "Invalid YouTube URL format", origin);
        }
      }

      if (sourceType === "transcript") {
        if (!transcript || typeof transcript !== "string") {
          return errorResponse(400, "transcript is required for transcript source type", origin);
        }
        if ((transcript as string).length > 50000) {
          return errorResponse(400, "Transcript exceeds maximum length of 50000 characters", origin);
        }
      }

      const result = {
        id: crypto.randomUUID(),
        source_type: sanitizeString(sourceType, 20),
        status: "processing",
        message: "Video submitted for AI processing",
        estimated_time: "2-5 minutes",
        created_at: new Date().toISOString(),
      };

      return new Response(
        JSON.stringify(result),
        { headers: { ...responseCorsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (path === "/viral-score" && req.method === "POST") {
      let body: Record<string, unknown>;
      try {
        body = await req.json();
      } catch {
        return errorResponse(400, "Invalid JSON body", origin);
      }

      const title = sanitizeString((body.title as string) || "", 200);
      const duration = Number(body.duration);
      if (isNaN(duration) || duration < 0 || duration > 3600) {
        return errorResponse(400, "Invalid duration. Must be between 0 and 3600 seconds.", origin);
      }

      const score = Math.floor(Math.random() * 30) + 70;
      const factors = {
        hook_strength: Math.floor(Math.random() * 20) + 80,
        retention_prediction: Math.floor(Math.random() * 25) + 75,
        trend_alignment: Math.floor(Math.random() * 30) + 70,
        engagement_potential: Math.floor(Math.random() * 20) + 80,
      };

      return new Response(
        JSON.stringify({ score, factors, title, duration }),
        { headers: { ...responseCorsHeaders, "Content-Type": "application/json" } }
      );
    }

    return errorResponse(404, "Not found", origin);
  } catch {
    return errorResponse(500, "Internal server error", origin);
  }
});
