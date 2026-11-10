# Avora Zone — Phase 2 Starter

এটি Phase 1-এর HTML ডেমোর পরের ধাপ। এই প্যাকেজে Next.js + Supabase ভিত্তিক backend-ready starter আছে।

## কী প্রস্তুত আছে
- Supabase Auth দিয়ে Signup / Login / Logout
- Student dashboard-এ database থেকে profile, quiz attempt ও lesson progress পড়া
- Supabase SQL schema এবং Row Level Security (RLS)
- Admin-only page এবং admin role check
- AI English Teacher-এর server-side API route (API key browser-এ যায় না)
- Phase 1-এর HTML demo `public/phase1-demo.html`-এ রাখা হয়েছে

## চালু করার ধাপ

1. Node.js-এর সাম্প্রতিক LTS সংস্করণ ইনস্টল করুন।
2. Supabase-এ নতুন project খুলুন।
3. Supabase → SQL Editor-এ `supabase/schema.sql` ফাইলের SQL সম্পূর্ণ রান করুন।
4. এই ফোল্ডারে `.env.example` কপি করে `.env.local` নামে রাখুন।
5. Supabase → Project Settings → API থেকে Project URL এবং publishable/anon key বসান।
6. Supabase Authentication → URL Configuration-এ local URL `http://localhost:3000` যোগ করুন।
7. টার্মিনালে চালান:

   ```bash
   npm install
   npm run dev
   ```

8. ব্রাউজারে `http://localhost:3000` খুলুন।

## প্রথম Admin তৈরি

প্রথমে ওয়েবসাইটে নিজের account signup করুন। তারপর Supabase SQL Editor-এ নিচের SQL চালান (নিজের account-এর email দিন):

```sql
update public.profiles
set role = 'admin'
where id = (
  select id from auth.users where email = 'YOUR-EMAIL@example.com'
);
```

Admin role কখনো public signup form থেকে সেট করবেন না। Admin promotion শুধু Supabase dashboard-এর trusted SQL Editor থেকে করুন।

## AI Teacher চালু

`.env.local`-এ server-side key দিন:

```env
OPENAI_API_KEY=your_secret_key
OPENAI_MODEL=gpt-4.1-mini
```

তারপর server restart করুন। `OPENAI_API_KEY`-এর নামের আগে `NEXT_PUBLIC_` দেবেন না। API route-এ logged-in user check আছে; production launch-এর আগে rate limit, usage limit এবং abuse monitoring যোগ করতে হবে।

## গুরুত্বপূর্ণ সীমাবদ্ধতা

- এই প্যাকেজ তৈরি করা হয়েছে, কিন্তু Supabase project বা hosting account-এ deploy করা হয়নি।
- আপনার Supabase URL/key এবং AI key না থাকায় live login/database/AI এখনো চালু নয়।
- Payment gateway, video hosting, email delivery, production rate limiting এবং full admin course editor পরের ধাপে যুক্ত করতে হবে।
- Production launch-এর আগে email confirmation, password reset, CAPTCHA, rate limiting, backups, privacy policy, terms এবং security review দরকার।
- Supabase service-role key কখনো browser/client code-এ দেবেন না।
