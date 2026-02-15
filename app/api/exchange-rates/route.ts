import { NextResponse } from "next/server";

const CURRENCIES = ["USD", "EUR", "JPY", "CNY", "TWD", "HKD", "GBP", "AUD", "CAD", "SGD", "THB", "VND"] as const;

export async function GET() {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/KRW", {
      next: { revalidate: 60 * 60 },
    });
    if (!res.ok) {
      return NextResponse.json({ ok: false, error: "upstream_failed" }, { status: 502 });
    }

    const json = (await res.json()) as {
      result: string;
      time_last_update_utc?: string;
      rates?: Record<string, number>;
      conversion_rates?: Record<string, number>;
    };

    const sourceRates = json.rates ?? json.conversion_rates;
    if (json.result !== "success" || !sourceRates) {
      return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 502 });
    }

    const ratesKrwPerUnit: Record<string, number> = {};
    for (const code of CURRENCIES) {
      const perKrw = sourceRates[code];
      if (typeof perKrw === "number" && perKrw > 0) {
        ratesKrwPerUnit[code] = Number((1 / perKrw).toFixed(6));
      }
    }

    return NextResponse.json({
      ok: true,
      base: "KRW",
      updatedAt: json.time_last_update_utc ?? null,
      ratesKrwPerUnit,
    });
  } catch {
    return NextResponse.json({ ok: false, error: "network_error" }, { status: 502 });
  }
}
