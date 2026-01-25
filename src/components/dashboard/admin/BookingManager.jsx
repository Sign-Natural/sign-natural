// src/components/dashboard/admin/BookingManager.jsx
import React, { useEffect, useState, useCallback } from "react";
import {
  getAllBookings,
  updateBookingStatus,
} from "../../../api/services/bookings";
import useNotifications from "../../../hooks/useNotifications";

const STATUSES = ["all", "pending", "confirmed", "cancelled", "completed"];

export default function BookingManager() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [err, setErr] = useState("");

  const [filters, setFilters] = useState({
    status: "all",
    from: "",
    to: "",
    q: "",
  });

  const [serverSupportsQuery, setServerSupportsQuery] = useState(true);

  /* ---------------- Load bookings ---------------- */
  const load = useCallback(
    async (opts = {}) => {
      setLoading(true);
      setErr("");
      try {
        const params = {
          ...(opts.useFilters ? filters : {}),
          ...(opts.extra || {}),
        };

        const res = await getAllBookings(params);
        let list = Array.isArray(res.data)
          ? res.data
          : (res.data?.items ?? res.data?.list ?? []);

        if (!serverSupportsQuery) {
          list = applyClientFilters(list, filters);
        }

        setRows(list);
      } catch (e) {
        setErr(e?.response?.data?.message || "Failed to load bookings");
        setRows([]);
      } finally {
        setLoading(false);
      }
    },
    [filters, serverSupportsQuery],
  );

  useEffect(() => {
    load({ useFilters: true });
  }, []);

  useNotifications({
    onEvent: (payload) => {
      if (
        payload?.type === "new_booking" ||
        payload?.type === "booking_updated" ||
        payload?.type === "booking_created"
      ) {
        load({ useFilters: true });
      }
    },
  });

  const applyClientFilters = (list = [], f = {}) => {
    const q = (f.q || "").trim().toLowerCase();
    return list.filter((b) => {
      if (f.status !== "all" && b.status !== f.status) return false;
      if (!q) return true;

      const name = (b.user?.name || b.contact?.name || "").toLowerCase();
      const email = (b.user?.email || b.contact?.email || "").toLowerCase();
      const item = (b.item?.title || b.item?.name || "").toLowerCase();

      return name.includes(q) || email.includes(q) || item.includes(q);
    });
  };

  const changeStatus = async (id, status) => {
    setBusyId(id);
    setOpenMenuId(null);
    try {
      await updateBookingStatus(id, status);
      await load({ useFilters: true });
    } finally {
      setBusyId(null);
    }
  };

  const fmtDate = (d) => (d ? new Date(d).toLocaleString() : "—");

  return (
    <div className="bg-white shadow rounded-lg p-5 space-y-5">
      <h3 className="font-semibold text-lg"></h3>

      <div className="overflow-x-auto">
        <div className="min-w-full text-sm">
          <div className="grid grid-cols-[1.2fr_1.6fr_1fr_0.9fr_2fr_0.9fr_0.8fr_1.4fr_0.9fr_0.5fr] gap-3 px-4 pb-2 text-[11px] uppercase tracking-wide text-gray-400">

            <div>User</div>
            <div>Email</div>
            <div>Phone</div>
            <div>Mode</div>
            <div>Item</div>
            <div>Type</div>
            <div>Price</div>
            <div>Scheduled</div>
            <div>Status</div>
            <div></div>
          </div>

          <div>
            {loading ? (
              <div>
                <div colSpan={9} className="py-6 text-center text-gray-500">
                  Loading…
                </div>
              </div>
            ) : (
              rows.map((b) => {
                const id = b._id;
                const isExpanded = expandedId === id;

                const displayName = b.user?.name || b.contact?.name || "Guest";
                const displayEmail = b.user?.email || b.contact?.email || "—";

                const bookingMode = !b.user
                  ? "Guest"
                  : b.attendees?.length > 0
                    ? "For Others"
                    : "Self";

                return (
                  <React.Fragment key={id}>
                   <div className="grid grid-cols-[1.2fr_1.6fr_1fr_0.9fr_2fr_0.9fr_0.8fr_1.4fr_0.9fr_0.5fr] items-center gap-3 bg-white px-4 py-3 rounded-xl shadow-sm hover:shadow-md transition">

                      <div className="font-medium text-sm">{displayName}</div>

                      <div
                        className="text-xs text-gray-600 truncate"
                        title={displayEmail}
                      >
                        {displayEmail}
                      </div>

                      <div
                        className="text-xs text-gray-600 truncate"
                        title={b.contact?.phone}
                      >
                        {b.contact?.phone || "—"}
                      </div>

                      <div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            bookingMode === "Guest"
                              ? "bg-gray-100"
                              : bookingMode === "For Others"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-green-100 text-green-700"
                          }`}
                        >
                          {bookingMode}
                        </span>

                        {bookingMode === "For Others" && (
                          <button
                            onClick={() =>
                              setExpandedId(isExpanded ? null : id)
                            }
                            className="ml-2 text-xs text-blue-600 hover:underline"
                          >
                            {isExpanded ? "Hide" : "View"} attendees
                          </button>
                        )}
                      </div>

                      <div
                        className="text-sm truncate"
                        title={b.item?.title || b.item?.name}
                      >
                        {b.item?.title || b.item?.name || "—"}
                      </div>

                      <div className="py-3 text-sm">{b.itemType}</div>

                      <div className="py-3 text-sm">
                        {typeof b.price === "number" ? `₵${b.price}` : "—"}
                      </div>

                      <div className="py-3 text-sm">{fmtDate(b.scheduledAt)}</div>

                      <div>
                        <span className="px-2 py-1 rounded-full text-xs bg-gray-100">
                          {b.status}
                        </span>
                      </div>

                      <div className="relative text-right">
                        <button
                          onClick={() =>
                            setOpenMenuId(openMenuId === id ? null : id)
                          }
                          className="px-3 py-1 rounded-md text-sm hover:bg-gray-100"
                        >
                          ⋮
                        </button>

                        {openMenuId === id && (
                          <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg z-10 overflow-hidden">
                            {["confirmed", "completed", "cancelled"].map(
                              (s) => (
                                <button
                                  key={s}
                                  onClick={() => changeStatus(id, s)}
                                  disabled={busyId === id}
                                  className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                                >
                                  {s}
                                </button>
                              ),
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* ✅ EXPANDED ATTENDEES ROW */}
                    {isExpanded && b.attendees?.length > 0 && (
                      <div className="mx-4 mb-3 p-3 rounded-xl bg-blue-50 text-xs shadow-inner">
                        <div className="text-xs text-gray-700">
                          <strong className="block mb-1">Attendees</strong>
                          <ul className="list-disc pl-5 space-y-1">
                            {b.attendees.map((a, i) => (
                              <li key={i}>{a.email || "—"}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </div>
        </div>
      </div>

      {err && <div className="text-sm text-red-600">{err}</div>}
    </div>
  );
}
