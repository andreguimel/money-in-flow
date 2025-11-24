import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    console.log("🔄 Webhook received for user signup/confirmation");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get the webhook payload
    const payload = await req.json();
    console.log("📝 Webhook payload:", JSON.stringify(payload, null, 2));

    // Extract user data from the webhook
    const { record, type, table } = payload;

    // Only process auth.users events for email confirmation
    if (table !== "users" || type !== "UPDATE") {
      console.log("⏭️ Skipping - not a user update event");
      return new Response(
        JSON.stringify({ message: "Event type not handled" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if this is an email confirmation event
    if (!record.email_confirmed_at) {
      console.log("⏭️ Skipping - email not confirmed yet");
      return new Response(
        JSON.stringify({ message: "Email not confirmed yet" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = record.id;
    const userEmail = record.email;
    const userName = record.raw_user_meta_data?.name || "Usuário";
    const organizationName =
      record.raw_user_meta_data?.organization_name || "Minha Empresa";
    const telefone = record.raw_user_meta_data?.telefone || "";

    console.log(`👤 Processing confirmed user: ${userEmail} (${userId})`);

    // 1. Create or update profile
    console.log("📋 Creating/updating profile...");
    const { error: profileError } = await supabaseClient
      .from("profiles")
      .upsert({
        id: userId,
        email: userEmail,
        name: userName,
        organization_name: organizationName,
        telefone: telefone,
        updated_at: new Date().toISOString(),
      });

    if (profileError) {
      console.error("❌ Profile creation error:", profileError);
    } else {
      console.log("✅ Profile created/updated successfully");
    }

    // 3. Create default categories
    console.log("📋 Creating default categories...");
    const categoriasPadrao = [
      // Receitas
      { nome: "Salário", tipo: "receita", cor: "#10B981", icone: "DollarSign" },
      { nome: "Freelance", tipo: "receita", cor: "#3B82F6", icone: "Briefcase" },
      { nome: "Investimentos", tipo: "receita", cor: "#8B5CF6", icone: "TrendingUp" },
      { nome: "Vendas", tipo: "receita", cor: "#F59E0B", icone: "ShoppingBag" },
      { nome: "Aluguel Recebido", tipo: "receita", cor: "#059669", icone: "Home" },
      // Despesas
      { nome: "Alimentação", tipo: "despesa", cor: "#EF4444", icone: "Utensils" },
      { nome: "Transporte", tipo: "despesa", cor: "#F97316", icone: "Car" },
      { nome: "Moradia", tipo: "despesa", cor: "#6366F1", icone: "Home" },
      { nome: "Saúde", tipo: "despesa", cor: "#EC4899", icone: "Heart" },
      { nome: "Educação", tipo: "despesa", cor: "#14B8A6", icone: "BookOpen" },
      { nome: "Lazer", tipo: "despesa", cor: "#8B5CF6", icone: "Gamepad2" },
      { nome: "Roupas", tipo: "despesa", cor: "#F59E0B", icone: "Shirt" },
      { nome: "Tecnologia", tipo: "despesa", cor: "#6B7280", icone: "Smartphone" },
      { nome: "Serviços", tipo: "despesa", cor: "#84CC16", icone: "Settings" },
      { nome: "Serviços de Streaming", tipo: "despesa", cor: "#9333EA", icone: "Film" },
    ];

    // Check if categories already exist
    const { data: existingCategories } = await supabaseClient
      .from("categorias")
      .select("id")
      .eq("user_id", userId)
      .limit(1);

    let categoriesCreated = false;
    if (!existingCategories || existingCategories.length === 0) {
      // Insert all categories at once using Promise.all for better performance
      const categoryInserts = categoriasPadrao.map((categoria) =>
        supabaseClient.from("categorias").insert({
          ...categoria,
          user_id: userId,
        })
      );

      const results = await Promise.all(categoryInserts);
      const errors = results.filter((r) => r.error);

      if (errors.length > 0) {
        console.error(`❌ ${errors.length} errors creating categories:`, errors);
      } else {
        console.log(`✅ ${categoriasPadrao.length} default categories created successfully`);
        categoriesCreated = true;
      }
    } else {
      console.log("ℹ️ Categories already exist, skipping creation");
    }

    // 2. Create subscriber with trial
    console.log("🎯 Creating subscriber with trial...");
    const trialStart = new Date();
    const trialEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

    const { error: subscriberError } = await supabaseClient
      .from("subscribers")
      .upsert({
        user_id: userId,
        email: userEmail,
        stripe_customer_id: null,
        subscribed: true,
        subscription_tier: "Trial",
        subscription_start: trialStart.toISOString(),
        subscription_end: trialEnd.toISOString(),
        trial_start: trialStart.toISOString(),
        trial_end: trialEnd.toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (subscriberError) {
      console.error("❌ Subscriber creation error:", subscriberError);
    } else {
      console.log("✅ Trial subscriber created successfully");
    }

    // Return success response
    const response = {
      success: true,
      message: "User onboarding completed",
      userId: userId,
      email: userEmail,
      profileCreated: !profileError,
      subscriberCreated: !subscriberError,
      categoriesCreated: categoriesCreated,
      trialEnd: trialEnd.toISOString(),
    };

    console.log("🎉 Onboarding completed:", response);

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("💥 Webhook error:", error);
    return new Response(
      JSON.stringify({
        error: true,
        message: error instanceof Error ? error.message : String(error),
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
