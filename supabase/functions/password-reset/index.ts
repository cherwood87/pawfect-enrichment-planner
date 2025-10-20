import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PasswordResetRequest {
  email: string;
  redirectUrl?: string;
}

interface RateLimitEntry {
  email: string;
  attempts: number;
  first_attempt: string;
  last_attempt: string;
}

const RATE_LIMIT_MAX_ATTEMPTS = 3;
const RATE_LIMIT_WINDOW_HOURS = 1;

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, redirectUrl }: PasswordResetRequest = await req.json();

    if (!email || !email.includes('@')) {
      return new Response(
        JSON.stringify({ error: "Valid email address is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Rate limiting check
    const rateLimitKey = `password_reset_${email.toLowerCase()}`;
    const now = new Date().toISOString();
    const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_HOURS * 60 * 60 * 1000).toISOString();

    // Check existing rate limit entries
    const { data: existingLimit, error: limitCheckError } = await supabase
      .from('rate_limits')
      .select('*')
      .eq('key', rateLimitKey)
      .gte('last_attempt', windowStart)
      .single();

    if (existingLimit && existingLimit.attempts >= RATE_LIMIT_MAX_ATTEMPTS) {
      const resetTime = new Date(new Date(existingLimit.first_attempt).getTime() + RATE_LIMIT_WINDOW_HOURS * 60 * 60 * 1000);
      const minutesRemaining = Math.ceil((resetTime.getTime() - Date.now()) / 60000);
      
      return new Response(
        JSON.stringify({ 
          error: `Too many password reset attempts. Please try again in ${minutesRemaining} minute(s).` 
        }),
        {
          status: 429,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Update or create rate limit entry
    if (existingLimit) {
      await supabase
        .from('rate_limits')
        .update({ 
          attempts: existingLimit.attempts + 1, 
          last_attempt: now 
        })
        .eq('key', rateLimitKey);
    } else {
      await supabase
        .from('rate_limits')
        .insert({ 
          key: rateLimitKey, 
          attempts: 1, 
          first_attempt: now, 
          last_attempt: now 
        });
    }

    // Generate password reset link using Supabase Auth
    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email: email,
      options: {
        redirectTo: redirectUrl || `${new URL(req.url).origin}/auth?mode=reset`
      }
    });

    if (error) {
      console.error('Supabase password reset error:', error);
      return new Response(
        JSON.stringify({ error: "Failed to generate reset link" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Send password reset email
    const emailResponse = await resend.emails.send({
      from: "Beyond Busy Dog Enrichment <noreply@beyondbusydogs.com>",
      to: [email],
      subject: "Reset Your Password - Beyond Busy Dog Enrichment",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f7f3ff;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 16px; box-shadow: 0 10px 30px rgba(139, 69, 219, 0.1); overflow: hidden; margin-top: 40px; margin-bottom: 40px;">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%); padding: 40px 30px; text-align: center;">
              <div style="width: 64px; height: 64px; background: rgba(255, 255, 255, 0.2); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
                <div style="width: 32px; height: 32px; background: white; border-radius: 50%; position: relative;">
                  <div style="position: absolute; top: 8px; left: 8px; width: 16px; height: 16px; background: #8b5cf6; border-radius: 50%;"></div>
                </div>
              </div>
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Reset Your Password</h1>
              <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 16px;">Beyond Busy Dog Enrichment Planner</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                We received a request to reset your password for your Beyond Busy Dog Enrichment account.
              </p>
              
              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 32px 0;">
                Click the button below to create a new password:
              </p>
              
              <!-- Reset Button -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="${data.properties?.action_link}" 
                   style="display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(139, 69, 219, 0.3); transition: all 0.3s ease;">
                  Reset My Password
                </a>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 32px 0 0 0;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="color: #06b6d4; font-size: 14px; word-break: break-all; background-color: #f9fafb; padding: 12px; border-radius: 8px; border: 1px solid #e5e7eb; margin: 8px 0 24px 0;">
                ${data.properties?.action_link}
              </p>
              
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">
              
              <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0;">
                If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
              </p>
              
              <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 16px 0 0 0;">
                This password reset link will expire in 1 hour for security reasons.
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 12px; margin: 0;">
                Beyond Busy Dog Enrichment Planner<br>
                Keep your pup happy, healthy, and engaged! 🐕
              </p>
            </div>
            
          </div>
        </body>
        </html>
      `,
    });

    if (emailResponse.error) {
      console.error("Resend email error:", emailResponse.error);
      return new Response(
        JSON.stringify({ error: "Failed to send reset email" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Password reset email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Password reset email sent successfully" 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error("Error in password-reset function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);