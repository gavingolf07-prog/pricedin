# Setting up accounts (one time, about 5 minutes)

Accounts and saved API keys use Supabase (free tier is enough).

1. Create a project at https://supabase.com.
2. In **SQL Editor**, run:

```sql
create table public.user_keys (
  user_id uuid primary key references auth.users(id) on delete cascade,
  fmp text not null default '',
  exa text not null default '',
  av  text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.user_keys enable row level security;

create policy "own row select" on public.user_keys for select using (auth.uid() = user_id);
create policy "own row insert" on public.user_keys for insert with check (auth.uid() = user_id);
create policy "own row update" on public.user_keys for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own row delete" on public.user_keys for delete using (auth.uid() = user_id);
```

3. In **Project Settings, API**, copy the Project URL and the `anon` public key into `accounts-config.js`.
4. In **Authentication, URL Configuration**, set Site URL to your Netlify address.
   (Authentication, Providers, Email is on by default. Turn "Confirm email" off if you don't want a confirmation email on sign-up.)
5. Redeploy the folder to Netlify.

Notes
- Each user can only read and write their own row (row-level security). Never put the `service_role` key in this site.
- Keys are stored as plain text in your Supabase database, so treat the Supabase project as sensitive.
- The `netlify/functions/exa.js` proxy is optional. The page calls Exa directly and only uses the proxy if the browser blocks that call.
