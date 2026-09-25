# Backend setup

The server side is written and builds without a database. To bring it online
you need a Supabase project and four minutes.

Nothing here asks you to share a credential with anyone. Every value goes into
your own `.env`, which is gitignored.

---

## 1. Create the Supabase project

<https://supabase.com/dashboard> → **New project**. Pick a region near
Rawalpindi (Singapore or Frankfurt are the usual choices) and set a database
password — you'll need it in the next step.

## 2. Fill in `.env`

```bash
cp .env.example .env
```

In Supabase: **Project Settings → Database → Connection string**. You need
**both** strings, and they are not interchangeable:

| Variable | Which string | Port | Used by |
|---|---|---|---|
| `DATABASE_URL` | Transaction pooler | 6543 | the running app |
| `DIRECT_DATABASE_URL` | Session / direct | 5432 | `prisma migrate` only |

`DATABASE_URL` **must** end with `?pgbouncer=true`. Prisma uses prepared
statements, which a transaction pooler does not support; without that flag
you'll get intermittent `prepared statement "s0" already exists` errors under
load rather than a clean failure.

Then generate a session secret.

**`SESSION_SECRET` does not come from Supabase.** It isn't in their dashboard
and no external service needs to know it. It's a random string you invent,
used as the HMAC key that hashes session tokens before they're stored
(`src/lib/session.ts`), so a leaked session table isn't a list of working
logins.

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Or in Windows PowerShell 5.1, without Node:

```powershell
$rng = New-Object System.Security.Cryptography.RNGCryptoServiceProvider
$b = New-Object byte[] 32
$rng.GetBytes($b)
[Convert]::ToBase64String($b)
```

Don't reach for `Get-Random` (not cryptographically secure) or
`RandomNumberGenerator::Fill` (.NET Core only — on PowerShell 5.1 it throws and
leaves the buffer as 32 zero bytes, which still base64-encodes to something
that looks like a real secret).

Paste the output as `SESSION_SECRET`. Use a different value per environment,
and don't paste it into a chat, an issue or a commit. Changing it later logs
everybody out.

## 3. Create the tables

```bash
npm run db:migrate -- --name init
```

This reads `DIRECT_DATABASE_URL`, creates every table in
`prisma/schema.prisma`, and writes a migration file to `prisma/migrations/`
that should be committed.

## 4. Seed the menu

```bash
npm run db:seed
```

Upserts the 17 dishes, 7 tables and 3 promo codes from `src/lib/data.ts`. Safe
to run repeatedly — it updates in place and never touches orders, bookings,
reviews or accounts.

## 4b. Create a staff login

`/admin` is staff-only, so you need one account with the `STAFF` role:

```bash
npm run db:staff
```

It asks for an email and password, **with the password hidden as you type** so
it doesn't land in your shell history. Minimum 12 characters, hashed with
bcrypt, never printed back. If the email already has an account it offers to
promote that one instead.

`npm run db:seed` also accepts `SEED_STAFF_EMAIL` / `SEED_STAFF_PASSWORD`, but
prefer `db:staff` — environment variables on the command line are recorded in
your shell history.

## 5. Check it

```bash
npm run dev
```

- `/api/menu` should return the 17 dishes as JSON.
- `/admin` should show the kitchen dashboard once you log in as the staff account.
- `npm run db:studio` opens a table browser.

---

## What exists

| Route | Method | Who |
|---|---|---|
| `/api/auth/signup` | POST | anyone |
| `/api/auth/login` | POST | anyone |
| `/api/auth/logout` | POST | anyone |
| `/api/auth/me` | GET, PATCH | signed in |
| `/api/menu` | GET | anyone |
| `/api/orders` | GET, POST | GET signed in; POST anyone (guest checkout) |
| `/api/orders/[reference]` | GET, PATCH | owner or staff; guests by reference |
| `/api/reservations` | GET, POST | GET signed in; POST anyone |
| `/api/reviews` | GET, POST, DELETE | GET anyone; POST/DELETE signed in |
| `/api/favourites` | GET, POST | signed in |
| `/api/promo` | POST | anyone |
| `/api/admin/orders` | GET | **staff** |
| `/api/admin/orders/[reference]` | PATCH | **staff** |
| `/api/admin/reservations` | GET, PATCH | **staff** |

## Decisions worth knowing

**Prices are never trusted from the client.** An order posts dish ids and
quantities; the server looks up every price, applies the promo, computes tax
and the total. A request that tried to set its own total is ignored.

**Double-booking is prevented by the database**, not by the app. A unique index
on `(tableId, date, time)` means two people racing for the same slot cannot
both succeed — one gets a 409. An application-level "is it free?" check would
let both through.

**An order reference is an identifier, not a password.** `TSH-F4JXZT69` is
short so it can be read down a phone line, which also means it can be guessed.
Nothing is authorized by holding one:

- An order placed while signed in needs that account's session, or staff.
- A guest order needs the separate 128-bit `accessToken` issued once at
  checkout and carried in the tracking link.

Both a missing order and a wrong token return the same 404, so the endpoint
can't be used to discover which references exist, and the token is compared in
constant time.

The reference alphabet is exactly 32 characters (no `0`, `1`, `O` or `I`) for
two reasons: those four are the pairs people misread aloud, and 256 divides
evenly by 32, so `byte % 32` is uniform. Dropping another letter to 31 would
reintroduce modulo bias.

**Sessions are opaque tokens, hashed before storage.** The cookie holds a
random 32-byte token; the database stores an HMAC of it keyed on
`SESSION_SECRET`. A dump of the session table is therefore not a list of
working logins. Deleting a row logs that session out immediately, which a
stateless JWT could not do.

**Login is constant-time.** An unknown email is compared against a dummy hash
so a missing account takes as long as a wrong password. Without that, response
timing tells an attacker which addresses are registered.

**Order lines are snapshots.** Name and price are copied onto the line when the
order is placed, so changing a menu price never rewrites an old receipt.

**Money is stored as integer rupees**, not floats, so subtotal, discount, tax
and total can't drift apart through rounding.

---

## Still to do

The server is built; the **frontend still reads and writes `localStorage`**.
Nothing on the site calls these endpoints yet. Switching it over means
replacing the store bodies in `src/lib/storage.ts` and the two contexts with
`fetch` calls — that was deliberately left as the next step so you can see the
API working before the UI depends on it.

Also not done:

- **Payments.** Checkout records a method but charges nothing. Needs your
  merchant credentials.
- **Email/SMS confirmation.** `STAFF_NOTIFICATION_EMAIL` is read but nothing
  sends yet; needs a provider.
- **Rate limiting** on login and signup.
- **Password reset.**
