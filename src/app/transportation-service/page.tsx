"use client";

import { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

export default function TransportationServicePage() {
  const { state: authState } = useAuth();
  const [form, setForm] = useState({
    phone: "",
    truckLabel: "Truck 1",
    weightViss: "",
    goodsDescription: "",
    origin: "",
    destination: "",
    pickupDate: "",
    pickupTime: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [calculatedPrice, setCalculatedPrice] = useState(0);

  useEffect(() => {
    // Calculate price when weight changes: 200 per viss
    const weight = Number(form.weightViss);
    if (weight > 0) {
      setCalculatedPrice(weight * 200);
    } else {
      setCalculatedPrice(0);
    }
  }, [form.weightViss]);

  const onChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user is authenticated before allowing booking
    if (!authState.isAuthenticated) {
      setErrorMsg("Please login to make a booking.");
      return;
    }

    setSubmitting(true);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const requestBody = {
        phone: form.phone || null,
        truckLabel: form.truckLabel,
        weightViss: Number(form.weightViss),
        goodsDescription: form.goodsDescription,
        origin: form.origin,
        destination: form.destination,
        pickupDate: form.pickupDate || null,
        pickupTime: form.pickupTime || null,
      };

      const res = await fetch("/api/transportation/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error("Booking submission failed:", {
          status: res.status,
          statusText: res.statusText,
          data: data,
        });
        throw new Error(
          data?.error || data?.details || "Failed to create booking"
        );
      }
      setSuccessMsg(
        "Booking submitted successfully. We will contact you shortly."
      );
      setForm({
        phone: "",
        truckLabel: "Truck 1",
        weightViss: "",
        goodsDescription: "",
        origin: "",
        destination: "",
        pickupDate: "",
        pickupTime: "",
      });
      setCalculatedPrice(0);
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Transportation Service
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            New Star offers reliable truck transportation services for goods
            across Myanmar. Led by U Win Myint, our fleet includes three
            dedicated trucks to ensure safe and timely delivery from Village,
            Bagan–Nyaung U and Yangon to many cities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((idx) => {
            const src =
              idx === 1
                ? "https://firebasestorage.googleapis.com/v0/b/chatbox-604ac.appspot.com/o/0-02-06-b61ca466685995dcb91752b4ec5b8f1614dc557ac42d7a2f345a25e303b04eaa_d323a35f219de126.jpg?alt=media&token=27b7194c-9a2b-407e-87c0-6d200c31b49c"
                : idx === 2
                ? "https://firebasestorage.googleapis.com/v0/b/chatbox-604ac.appspot.com/o/0-02-06-530d4bc6d313dfa4268ee037388cb8a65219f9c5d94161c8c111578f48e04815_dddeda08057db94c.jpg?alt=media&token=7a33c332-1876-4b8c-98dd-b8ae95836202"
                : "https://firebasestorage.googleapis.com/v0/b/chatbox-604ac.appspot.com/o/0-02-0a-5cb4d85e9d83f94c89a02d8b2491dba9ac42ac73d70b4e6a5fb20ac229456548_9291396e22d4721f.jpg?alt=media&token=d04ef913-e166-4ea1-8efa-947fc0f25544";
            const driverName =
              idx === 1 ? "Aung Chan" : idx === 2 ? "Ar Kar" : "Moe Kaung";
            return (
              <div key={idx} className="bg-white rounded-lg shadow-md p-6">
                <div className="relative w-full h-48 mb-4 rounded-md overflow-hidden">
                  <Image
                    src={src}
                    alt={`Truck ${idx}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                    priority={idx === 1}
                  />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  Truck {idx}
                </h2>
                <p className="text-sm text-gray-500 mb-2">
                  Driver: {driverName}
                </p>
                <p className="text-gray-600">
                  Dedicated goods carrier with experienced driver. Suitable for
                  agricultural products, packaged foods, and general cargo.
                  Available for routes between Bagan–Nyaung U, Yangon, and other
                  major cities.
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Book a Transport
          </h3>
          {successMsg && (
            <div className="mb-4 rounded-md bg-green-50 p-4 text-green-800">
              {successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="mb-4 rounded-md bg-red-50 p-4 text-red-800">
              {errorMsg}
            </div>
          )}
          {!authState.isAuthenticated && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-blue-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Login Required
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      Please login to make a transportation booking. You can
                      view our services below.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  value={
                    authState.isAuthenticated
                      ? authState.user?.name || "Loading..."
                      : "Login required to book"
                  }
                  disabled
                  className="text-gray-900 w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  placeholder="Your name"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {authState.isAuthenticated
                    ? "Name from your account"
                    : "Please login to make a booking"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={onChange}
                  disabled={!authState.isAuthenticated}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
                    !authState.isAuthenticated
                      ? "bg-gray-100 cursor-not-allowed"
                      : "text-gray-900"
                  }`}
                  placeholder="+95 ... (optional)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {authState.isAuthenticated
                    ? "Leave empty to use your account phone"
                    : "Login required to make a booking"}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Date
                </label>
                <input
                  name="pickupDate"
                  type="date"
                  value={form.pickupDate}
                  onChange={onChange}
                  disabled={!authState.isAuthenticated}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
                    !authState.isAuthenticated
                      ? "bg-gray-100 cursor-not-allowed"
                      : "text-gray-900"
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Time
                </label>
                <input
                  name="pickupTime"
                  type="time"
                  value={form.pickupTime}
                  onChange={onChange}
                  disabled={!authState.isAuthenticated}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
                    !authState.isAuthenticated
                      ? "bg-gray-100 cursor-not-allowed"
                      : "text-gray-900"
                  }`}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Truck *
                </label>
                <select
                  name="truckLabel"
                  value={form.truckLabel}
                  onChange={onChange}
                  disabled={!authState.isAuthenticated}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
                    !authState.isAuthenticated
                      ? "bg-gray-100 cursor-not-allowed"
                      : "text-gray-900"
                  }`}
                >
                  <option>Truck 1</option>
                  <option>Truck 2</option>
                  <option>Truck 3</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (Viss) *
                </label>
                <input
                  name="weightViss"
                  type="number"
                  min={1}
                  step={1}
                  value={form.weightViss}
                  onChange={onChange}
                  required
                  disabled={!authState.isAuthenticated}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
                    !authState.isAuthenticated
                      ? "bg-gray-100 cursor-not-allowed"
                      : "text-gray-900"
                  }`}
                  placeholder="e.g., 5"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {authState.isAuthenticated
                    ? `Price: ${calculatedPrice} MMK (${
                        form.weightViss || 0
                      } viss × 200 MMK)`
                    : "Login required to calculate price"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Goods *
                </label>
                <input
                  name="goodsDescription"
                  value={form.goodsDescription}
                  onChange={onChange}
                  required
                  disabled={!authState.isAuthenticated}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
                    !authState.isAuthenticated
                      ? "bg-gray-100 cursor-not-allowed"
                      : "text-gray-900"
                  }`}
                  placeholder="e.g., jaggery boxes"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Origin *
                </label>
                <input
                  name="origin"
                  value={form.origin}
                  onChange={onChange}
                  required
                  disabled={!authState.isAuthenticated}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
                    !authState.isAuthenticated
                      ? "bg-gray-100 cursor-not-allowed"
                      : "text-gray-900"
                  }`}
                  placeholder="From (city/town)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destination *
                </label>
                <input
                  name="destination"
                  value={form.destination}
                  onChange={onChange}
                  required
                  disabled={!authState.isAuthenticated}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 ${
                    !authState.isAuthenticated
                      ? "bg-gray-100 cursor-not-allowed"
                      : "text-gray-900"
                  }`}
                  placeholder="To (city/town)"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={submitting || !authState.isAuthenticated}
                className={`inline-flex items-center py-3 px-6 rounded-lg font-semibold ${
                  authState.isAuthenticated
                    ? "bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-60"
                    : "bg-gray-400 text-gray-200 cursor-not-allowed"
                }`}
              >
                {submitting
                  ? "Submitting..."
                  : authState.isAuthenticated
                  ? "Submit Booking"
                  : "Login Required to Book"}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Booking & Inquiries
          </h3>
          <p className="text-gray-700 mb-2">
            For transportation quotes and availability:
          </p>
          <ul className="text-gray-700 list-disc pl-6 space-y-1">
            <li>
              Email:{" "}
              <span className="text-amber-700">
                logistics@newstarjaggery.com
              </span>
            </li>
            <li>
              Phone: <span className="text-amber-700">+95 9 425 293 411</span>
            </li>
            <li>Operating hubs: Village (Bagan–Nyaung U), Yangon</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
