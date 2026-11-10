import Link from "next/link";
import { redirect } from "next/navigation";
import { signOut } from "@/app/actions/auth";
import { createClient } from "@/lib/supabase/server";

export default async function Dashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { count: attempts }, { data: progress }] = await Promise.all([
    supabase.from("profiles").select("full_name, role").eq("id", user.id).single(),
    supabase.from("quiz_attempts").select("*", { count: "exact", head: true }).eq("student_id", user.id),
    supabase.from("lesson_progress").select("id, completed").eq("student_id", user.id)
  ]);

  const completed = progress?.filter((p) => p.completed).length || 0;
  return (
    <main style={{ maxWidth: 900, margin: "45px auto", padding: 24 }}>
      <p style={{ color: "#5367d5", fontWeight: 700 }}>AVORA ZONE · STUDENT</p>
      <h1>Welcome, {profile?.full_name || user.email}</h1>
      <p>Your learning data is now read from Supabase.</p>
      <section style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <Stat label="Completed lessons" value={completed} />
        <Stat label="Quiz attempts" value={attempts || 0} />
        <Stat label="Account type" value={profile?.role || "student"} />
      </section>
      <p style={{ marginTop: 28 }}><Link href="/api/health">Check backend status</Link></p>
      {profile?.role === "admin" && <p><Link href="/admin">Open Admin Panel →</Link></p>}
      <form action={signOut}><button style={{ padding: 10 }}>Sign out</button></form>
    </main>
  );
}
function Stat({ label, value }: { label: string; value: string | number }) {
  return <div style={{ background: "white", padding: 22, borderRadius: 14, minWidth: 160 }}><small>{label}</small><h2>{value}</h2></div>;
}
