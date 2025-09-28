"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export default function BookingsPage() {
  const { state: authState } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getStatusBadge = (status: string) => {
    const base =
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";
    const map: Record<string, string> = {
      pending: `${base} bg-yellow-100 text-yellow-800`,
      confirmed: `${base} bg-emerald-100 text-emerald-800`,
      cancelled: `${base} bg-red-100 text-red-800`,
      default: `${base} bg-gray-100 text-gray-800`,
    };
    const cls = map[status?.toLowerCase?.()] || map.default;
    return <span className={cls}>{status}</span>;
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleDownloadVoucher = (booking: any) => {
    if (typeof window === "undefined") return;
    const voucherHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Transport Voucher - ${booking?.id ?? ""}</title>
  <style>
    body{font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,Apple Color Emoji,Segoe UI Emoji;line-height:1.5;margin:0;padding:24px;background:#fff;color:#111827}
    .card{max-width:720px;margin:0 auto;border:1px solid #E5E7EB;border-radius:12px;padding:24px}
    .row{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
    .muted{color:#6B7280;font-size:12px}
    .label{color:#6B7280;font-size:14px}
    .value{font-weight:600}
    .divider{height:1px;background:#E5E7EB;margin:16px 0}
    .title{font-size:20px;font-weight:700;margin:0 0 16px}
    @media print {.no-print{display:none}}
  </style>
  <script>function printAndClose(){window.print();}</script>
  </head>
<body>
  <div class="card">
    <h1 class="title">Transport Booking Voucher</h1>
    <div class="row">
      <div>
        <div class="label">Booking ID</div>
        <div class="value">${booking?.id ?? ""}</div>
      </div>
      <div style="text-align:right">
        <div class="label">Placed</div>
        <div class="value">${
          booking?.createdAt ? new Date(booking.createdAt).toLocaleString() : ""
        }</div>
      </div>
    </div>
    <div class="divider"></div>
    <div class="row" style="align-items:flex-start">
      <div>
        <div class="label">Status</div>
        <div class="value">${booking?.status ?? ""}</div>
      </div>
      <div style="text-align:right">
        <div class="label">Route</div>
        <div class="value">${booking?.origin ?? ""} → ${
      booking?.destination ?? ""
    }</div>
      </div>
    </div>
    <div class="divider"></div>
    <div class="row" style="align-items:flex-start">
      <div>
        <div class="label">Truck</div>
        <div class="value">${booking?.truckLabel ?? ""}</div>
      </div>
      <div style="text-align:right">
        <div class="label">Weight</div>
        <div class="value">${booking?.weightViss ?? ""} viss</div>
      </div>
    </div>
    <div class="divider"></div>
    <div class="row" style="align-items:flex-start">
      <div>
        <div class="label">Pickup</div>
        <div class="value">${
          booking?.pickupDate
            ? new Date(booking.pickupDate).toLocaleDateString()
            : ""
        } ${booking?.pickupTime ?? ""}</div>
      </div>
      <div style="text-align:right">
        <div class="label">Contact</div>
        <div class="value">${booking?.user?.name ?? ""}${
      booking?.phone ? " · " + booking.phone : ""
    }</div>
      </div>
    </div>
    <p class="muted">Keep this voucher for your records.</p>
    <button class="no-print" onclick="printAndClose()" style="margin-top:12px;padding:8px 12px;background:#4F46E5;color:#fff;border:none;border-radius:8px;cursor:pointer">Print</button>
  </div>
</body>
</html>`;
    const blob = new Blob([voucherHtml], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `transport-voucher-${booking?.id ?? "booking"}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const load = async () => {
      if (!authState.isAuthenticated || !authState.token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch("/api/transportation/bookings", {
          headers: { Authorization: `Bearer ${authState.token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load bookings");
        setBookings(data.bookings || []);
      } catch (e: any) {
        setError(e.message || "Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [authState.isAuthenticated, authState.token]);

  if (!authState.isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-700">Please login to view your bookings.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Your Transport Bookings
        </h1>
        {loading && <p className="text-gray-600">Loading...</p>}
        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4 text-red-800">
            {error}
          </div>
        )}

        <div className="space-y-5">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase tracking-wide text-gray-500">
                        Booking
                      </span>
                      <span className="text-gray-900 font-semibold">
                        #{b.id}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span>
                        Placed{" "}
                        {b.createdAt
                          ? new Date(b.createdAt).toLocaleString()
                          : ""}
                      </span>
                      <span className="hidden sm:inline-block h-1 w-1 rounded-full bg-gray-300" />
                      <span className="inline-flex">
                        {getStatusBadge(b.status)}
                      </span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-end sm:items-end gap-3 sm:gap-2">
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Route</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {b.origin} → {b.destination}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handlePrint}
                        className="print:hidden inline-flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        aria-label="Print voucher"
                        title="Print voucher"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="h-4 w-4"
                        >
                          <path d="M6 2a2 2 0 00-2 2v2h12V4a2 2 0 00-2-2H6z" />
                          <path d="M16 8H4a2 2 0 00-2 2v3a2 2 0 002 2h1v-1a2 2 0 012-2h6a2 2 0 012 2v1h1a2 2 0 002-2v-3a2 2 0 00-2-2z" />
                          <path d="M7 15a1 1 0 011-1h4a1 1 0 011 1v3H7v-3z" />
                        </svg>
                        Print
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownloadVoucher(b)}
                        className="print:hidden inline-flex items-center gap-2 rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
                        aria-label="Download voucher"
                        title="Download voucher"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="h-4 w-4"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 14.5A1.5 1.5 0 014.5 13h11a1.5 1.5 0 011.5 1.5v1A1.5 1.5 0 0115.5 17h-11A1.5 1.5 0 013 15.5v-1zm7-10a.75.75 0 01.75.75V10h2.19a.75.75 0 01.53 1.28l-3.19 3.25a.75.75 0 01-1.06 0L6.03 11.3A.75.75 0 016.56 10h2.19V5.25A.75.75 0 0110 4.5z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-100 px-5 sm:px-6 py-4">
                <div className="text-sm text-gray-600 flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Truck</span>
                    <span className="font-medium text-gray-800">
                      {b.truckLabel}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Weight</span>
                    <span className="font-medium text-gray-800">
                      {b.weightViss} viss
                    </span>
                  </div>
                  {b.pickupDate && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Pickup</span>
                      <span className="font-medium text-gray-800">
                        {new Date(b.pickupDate).toLocaleDateString()}{" "}
                        {b.pickupTime || ""}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Contact</span>
                    <span className="font-medium text-gray-800">
                      {b.user?.name || "N/A"}
                      {b.phone ? ` · ${b.phone}` : ""}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {!loading && bookings.length === 0 && (
            <p className="text-gray-600">You have no transport bookings yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
