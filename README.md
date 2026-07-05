# Pulse CRM — Electricity Retail Sales Dashboard

A sales performance dashboard built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and shadcn/ui-style components — backed by a real electricity-retail sales dataset.

Built collaboratively by **Bahar Naaderi** and **Claude (Anthropic)** — see [`PROMPT.md`](./PROMPT.md) for the distilled prompt that captures what this project is and how it was specified.

## Data source

The dataset in `lib/data/electricity-sales.json` is transcribed from a real electricity retailer's sales spreadsheet: 209 monthly records across 9 sales agents, spanning Persian calendar months 1402/09 through 1404/11 (~Nov 2023 – Feb 2026). It includes invoices finalized, new/returning/lost customers, kWh sold by tariff (normal/green/free), total invoice revenue (Rial), and average price per kWh.

**Anonymization:** the original sales agents' real (Persian) names have been replaced with fake English names, and every agent (plus the admin profile) uses the same synthetic placeholder photo (`public/avatars/default-avatar.svg`) rather than a real or real-looking picture. No other identifying information (customer names, account numbers, etc.) was present in the source data. The name mapping used was:

| Fake name (used in app) |
| --- |
| Daniel Ford |
| Sofia Bennett |
| Ethan Walker |
| Grace Coleman |
| Chloe Whitman |
| Marcus Reed |
| Jonathan Brooks |
| Olivia Turner |
| Natalie Price |

A handful of spreadsheet columns that were empty for every single row in the source file (pre-invoice count, contractual count, certificate kWh, free-tariff pricing, target-achievement %, retention target) were dropped from the schema rather than faked.

Month labels shown in charts (e.g. "Nov 2023") are converted from the source Jalali (Persian) year/month via `lib/jalali.ts`, a small public-domain Jalali↔Gregorian conversion routine.

## Features

- **Sidebar + top navbar + breadcrumb** — responsive app shell (mobile sidebar uses a slide-in sheet)
- **Dark / light mode** — toggle in the top bar, respects system preference
- **Login popup + profile menu** — demo auth (any email/password signs you in), profile dropdown with logout
- **KPI cards** — total revenue, kWh sold, net customer growth, average price per kWh (all with month-over-month change)
- **Revenue & volume trend** — combo chart of monthly revenue (in Rial, shown as `R`) and kWh sold
- **Price-per-kWh trend** — normal vs. green tariff pricing over time (the data shows real, dramatic inflation)
- **Agent bubble chart** — kWh sold (x) vs. revenue (y) per agent, bubble size = invoices finalized, with independent Year/Month filters
- **Energy mix donut** — kWh sold by tariff type, with its own independent Year/Month filters
- **Customer flow chart** — new vs. lost customers (correctly diverging bars) with a net growth overlay
- **Agent leaderboard table** — invoices, kWh, revenue, price, net customers, share of sales
- **Team roster** — full-size placeholder photo cards for every agent
- **Interactive to-do list** — add (with a priority picker), complete, and delete tasks; new tasks are stamped with today's real date; empty state when the list is cleared
- **Calendar widget** — current month view with today highlighted and dots on days with open to-dos
- **Responsive design** — chart x-axis date labels hide on mobile instead of overlapping; tables and headings use smaller type on mobile, larger on desktop
- **Real, functional API routes** — every widget is powered by actual Next.js Route Handlers under `app/api/*`

## API routes

| Route | Methods | Description |
| --- | --- | --- |
| `/api/metrics` | GET | KPI summary (revenue, kWh, customer growth, avg price) for the latest month vs. the prior month |
| `/api/revenue` | GET | Monthly revenue + kWh trend across the full dataset |
| `/api/price-trend` | GET | Monthly weighted-average normal & green price per kWh |
| `/api/customer-flow` | GET | Monthly new / returning / lost / net customers |
| `/api/tariff-mix` | GET | kWh sold by tariff (normal/green/free); accepts `?month=1402/09` |
| `/api/agents` | GET | Per-agent performance snapshot; accepts `?month=1402/09` |
| `/api/months` | GET | List of available Jalali months (for the Year/Month filter dropdowns) |
| `/api/notifications` | GET, PATCH | Activity feed; PATCH marks one (`{ id }`) or all (`{ markAll: true }`) as read |
| `/api/todos` | GET, POST, PATCH, DELETE | To-do list; POST adds a task (`{ label, priority }`), PATCH toggles completion, DELETE removes a task |
| `/api/regions` | GET | Deprecated alias of `/api/tariff-mix`, kept so old links don't 404 |

## Getting started

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Project structure

```
app/
  api/            Route handlers (the "backend")
  page.tsx        Dashboard overview
  agents/         Team roster + full agent table + bubble chart
  reports/        Revenue, price, mix, and customer-flow reports
  settings/       Profile settings (demo)
components/
  ui/             shadcn-style primitives (button, card, dialog, table, select, ...)
  layout/         Sidebar, top bar, breadcrumb, theme toggle, login dialog, profile/notifications menus
  dashboard/      Chart and widget components
lib/
  data/electricity-sales.json   The real (anonymized) dataset
  jalali.ts       Persian -> Gregorian month conversion
  store.ts        Aggregation logic over the dataset (the "database" layer)
  types.ts        Shared TypeScript types
  use-period-data.ts, use-media-query.ts   Shared client hooks
public/
  avatars/default-avatar.svg   Shared placeholder photo (agents + admin)
```

## Notes

- Authentication is UI-only for this demo — any email/password combination signs you in. Swap `components/layout/auth-provider.tsx` for a real provider (e.g. NextAuth.js) to add real auth.
- Notifications and to-dos are demo widgets with example content — they are not derived from the sales dataset.
- All aggregation happens in `lib/store.ts` at request time from the JSON file; there's no external database.


<div align="center">

Built with ❤️ by **Bahar** and **Claude**

</div>
