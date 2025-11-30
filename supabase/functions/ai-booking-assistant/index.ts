import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Message {
  role: "user" | "assistant";
  content: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory } = await req.json();

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Get current user
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    // Call Lovable AI
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const systemPrompt = `You are a helpful AI booking assistant. Your job is to help users schedule appointments by extracting relevant information from their natural language requests.

When a user provides booking details, extract:
- Client name
- Client email (if not provided, ask for it)
- Date (convert relative dates like "next Tuesday" to actual dates)
- Time (in 24-hour format)
- Duration in minutes (default to 30 if not specified)

Once you have all required information (client name, email, date, and time), respond with a JSON object in this exact format:
{
  "action": "book",
  "data": {
    "client_name": "Name",
    "client_email": "email@example.com",
    "appointment_date": "YYYY-MM-DD",
    "appointment_time": "HH:MM:00",
    "duration_minutes": 30,
    "notes": "any additional notes"
  }
}

If information is missing, ask clarifying questions in a friendly way. Today's date is ${
      new Date().toISOString().split("T")[0]
    }.`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...conversationHistory.map((msg: Message) => ({
            role: msg.role,
            content: msg.content,
          })),
          { role: "user", content: message },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI Gateway error:", aiResponse.status, errorText);
      throw new Error("AI service error");
    }

    const aiData = await aiResponse.json();
    const assistantMessage = aiData.choices[0].message.content;

    // Check if the response contains booking data
    let bookingData = null;
    let booked = false;
    try {
      const jsonMatch = assistantMessage.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsedData = JSON.parse(jsonMatch[0]);
        if (parsedData.action === "book" && parsedData.data) {
          bookingData = parsedData.data;

          // Insert appointment into database
          const { error: insertError } = await supabaseClient.from("appointments").insert({
            user_id: user.id,
            client_name: bookingData.client_name,
            client_email: bookingData.client_email,
            appointment_date: bookingData.appointment_date,
            appointment_time: bookingData.appointment_time,
            duration_minutes: bookingData.duration_minutes,
            notes: bookingData.notes || null,
            status: "scheduled",
          });

          if (insertError) throw insertError;
          booked = true;
        }
      }
    } catch (e) {
      console.log("Not a booking command, continuing conversation");
    }

    return new Response(
      JSON.stringify({
        response: booked
          ? "Great! I've successfully booked your appointment. You'll be redirected to your dashboard shortly."
          : assistantMessage.replace(/\{[\s\S]*\}/, "").trim(),
        booked,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An error occurred" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
