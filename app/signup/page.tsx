import Link from "next/link";
import { signUp } from "@/app/actions/auth";

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  return (
    <main style={{ maxWidth: 460, margin: "60px auto", background: "white", padding: 28, borderRadius: 18 }}>
      <h1>Create your student account</h1>
      <p>Avora Zone-এ শেখা শুরু করুন।</p>
      {params.error && <p style={{ color: "crimson" }}>{params.error}</p>}
      <form action={signUp} style={{ display: "grid", gap: 12 }}>
        <label>Full name<input name="fullName" required minLength={2} style={field} /></label>
        <label>Email<input name="email" type="email" required style={field} /></label>
        <label>Password (at least 8 characters)<input name="password" type="password" minLength={8} required style={field} /></label>
        <button style={button}>Create account</button>
      </form>
      <p>Already registered? <Link href="/login">Login</Link></p>
    </main>
  );
}
const field = { display: "block", width: "100%", padding: 12, marginTop: 6, boxSizing: "border-box" as const };
const button = { padding: 13, background: "#5367d5", color: "white", border: 0, borderRadius: 9, cursor: "pointer" };
