import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/dashboard");

  const { data: courses } = await supabase.from("courses").select("id,title,level,is_published").order("created_at", { ascending: false });
  return (
    <main style={{ maxWidth: 900, margin: "45px auto", padding: 24 }}>
      <h1>Avora Zone Admin</h1>
      <p>Admin-only page. Database Row Level Security also protects course records.</p>
      <h2>Courses</h2>
      {courses?.length ? courses.map((c) => <p key={c.id}>{c.title} · {c.level} · {c.is_published ? "Published" : "Draft"}</p>) : <p>No courses added yet.</p>}
    </main>
  );
}
