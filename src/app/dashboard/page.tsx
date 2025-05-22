"use client"

import { createClient } from "@/lib/supabase/client";


const supabase = createClient();

export default function DashboardPage() {

  supabase.auth.signOut();

  return (
    <div>
      <h1>Dashboard Page</h1>
      <p>This is the DashBoard page.</p>
    </div>
  );
}