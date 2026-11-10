import Link from "next/link";
import { signIn } from "@/app/actions/auth";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; message?: string }> }) {
  const params = await searchParams;
  return (
    <main style={{ maxWidth: 460, margin: "60px auto", background: "white", padding: 28, borderRadius: 18 }}>
      <h1>Login to Avora Zone</h1>
      {params.error && <p style={{ color: "crimson" }}>{params.error}</p>}
      {params.message && <p style={{ color: "green" }}>{params.message}</p>}
      <form action={signIn} style={{ display: "grid", gap: 12 }}>
        <label>Email<input name="email" type="email" required style={field} /></label>
        <label>Password<input name="password" type="password" required style={field} /></label>
        <button style={button}>Login</button>
      </form>
      <p>New student? <Link href="/signup">Create account</Link></p>
    </main>
  );
}
const field = { display: "block", width: "100%", padding: 12, marginTop: 6, boxSizing: "border-box" as const };
const button = { padding: 13, background: "#5367d5", color: "white", border: 0, borderRadius: 9, cursor: "pointer" };
