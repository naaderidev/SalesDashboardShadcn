# The prompt behind this project

This dashboard was built through an iterative back-and-forth between **Bahar Naaderi** and **Claude (Anthropic)** — starting from a simple idea, then refined step by step as real data and real feedback came in (anonymizing a real sales export, fixing chart edge cases, adjusting mobile layout, swapping the notifications panel for a calendar, and so on).

Below is a single, distilled prompt that captures everything the project ended up being. If you fed this to Claude in one shot, along with a real sales CSV/Excel export, it should produce essentially this same app.

> Build a sales performance dashboard in Next.js (App Router) + TypeScript + Tailwind, using shadcn-style components, for an electricity retail business. I'm attaching a CSV/Excel export of our real sales data (Persian columns, Persian agent names) — anonymize the agent names to fake English ones, and build the dataset into a JSON file the app reads from (no external DB, but wire it through real Next.js API routes, not hardcoded frontend data).
>
> Layout: sidebar + top navbar + breadcrumb, dark/light mode toggle, a demo login popup (any email/password works) with a profile menu in the top-right, all using a single shared fake placeholder avatar image (not per-agent photos) for both the admin and every sales agent.
>
> Widgets, based on whatever the real data actually supports: KPI cards, a revenue trend chart, a price-per-kWh trend chart (agent performance), an energy-mix donut, a customer-flow chart, and a bubble chart comparing agents — the bubble chart and donut should each have independent Year/Month dropdown filters driven by the real months in the dataset. Add an agent leaderboard table and a "team roster" section with full-size placeholder photos. Add an interactive to-do list (add/complete/delete, real due dates, a priority picker) with a proper empty state, and a small calendar widget instead of a generic notifications panel.
>
> Format currency as a plain Latin symbol like "R" (not ﷼ or spelled out). Make sure it's responsive: hide x-axis date labels on chart mobile views instead of squishing them, and use distinctly smaller font sizes on mobile vs. desktop, especially in tables. Diverging bar charts (e.g., new vs. lost customers) need correctly rounded corners at the end away from the zero axis, with semantically correct colors (red for negative).

## Why this is here

Publishing an AI-assisted project is easiest to do honestly. This file exists so anyone looking at the repo can see exactly what was asked for and reconstruct the intent behind the code, rather than treating the prompt as a secret.
