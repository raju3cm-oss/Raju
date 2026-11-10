import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main style={{ maxWidth: 900, margin: "70px auto", padding: 24 }}>
      <p style={{ color: "#5367d5", fontWeight: 700 }}>AVORA ZONE</p>
      <h1 style={{ fontSize: 42, marginBottom: 8 }}>Learn English. Build confidence.</h1>
      <p>Beginner থেকে Advanced—নিজের গতিতে English শিখুন।</p>
      <div style={{ display: "flex", gap: 12, marginTop: 28, flexWrap: "wrap" }}>
        {user ? <Link href="/dashboard">Open Student Dashboard →</Link> : <>
          <Link href="/signup">Create student account</Link>
          <Link href="/login">Login</Link>
        </>}
        <a href="/phase1-demo.html">Open Phase 1 demo</a>
      </div>
    </main>
  );
}
