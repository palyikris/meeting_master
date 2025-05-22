"use client"

import { useUser } from "@/hooks/useUser";
import { createClient } from "@/lib/supabase/client";


const supabase = createClient();

export default function AdminPage() {

  supabase.auth.signOut();

  // const user = useUser();
  // console.log("User:", user);

  return (
    <div>
      <h1>Admin Page</h1>
      <p>This is the admin page.</p>
    </div>
  );
}