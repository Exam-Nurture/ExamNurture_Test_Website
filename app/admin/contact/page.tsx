"use client";

import { useEffect, useState } from "react";
import { apiAdminGetContact, apiAdminResolveContact, apiAdminDeleteContact, AdminContactMessage } from "@/lib/api";
import { Pagination } from "@/components/admin/AdminTable";

export default function AdminContactPage() {
  const [data, setData] = useState<{ items: AdminContactMessage[]; total: number } | null>(null);
  const [page, setPage] = useState(1);
  const [showUnresolved, setShowUnresolved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  async function load(p = page) {
    setLoading(true);
    try { setData(await apiAdminGetContact({ page: p, unresolved: showUnresolved || undefined })); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [page, showUnresolved]);

  async function handleResolve(id: string) {
    await apiAdminResolveContact(id);
    load();
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete message from ${name}?`)) return;
    await apiAdminDeleteContact(id);
    load();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: "var(--ink-2)" }}>
          <input type="checkbox" checked={showUnresolved} onChange={(e) => { setShowUnresolved(e.target.checked); setPage(1); }} />
          Show unresolved only
        </label>
        <span className="ml-auto text-sm" style={{ color: "var(--ink-3)" }}>{data?.total ?? 0} messages</span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-6 h-6 rounded-full border-2 animate-spin" style={{ borderColor: "var(--line)", borderTopColor: "var(--blue)" }} />
        </div>
      ) : (
        <div className="space-y-3">
          {(data?.items ?? []).map((msg) => (
            <div key={msg.id} className="rounded-xl overflow-hidden" style={{ background: "var(--card)", boxShadow: "var(--shadow)", border: msg.isResolved ? "1px solid var(--line)" : "1px solid var(--blue)" }}>
              <div
                className="flex items-center gap-3 px-4 py-3 cursor-pointer"
                onClick={() => setExpanded(expanded === msg.id ? null : msg.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm" style={{ color: "var(--ink-1)" }}>{msg.name}</span>
                    <span className="text-xs" style={{ color: "var(--ink-3)" }}>{msg.email}</span>
                    {!msg.isResolved && <span className="text-xs font-semibold px-1.5 py-0.5 rounded" style={{ background: "var(--blue-soft)", color: "var(--blue)" }}>New</span>}
                    {msg.isResolved && <span className="text-xs font-semibold px-1.5 py-0.5 rounded" style={{ background: "var(--green-soft)", color: "var(--green)" }}>Resolved</span>}
                  </div>
                  <p className="text-xs mt-0.5 truncate" style={{ color: "var(--ink-2)" }}>{msg.subject}</p>
                </div>
                <span className="text-xs flex-shrink-0" style={{ color: "var(--ink-4)" }}>{new Date(msg.createdAt).toLocaleDateString()}</span>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="var(--ink-3)" strokeWidth={2} className={`flex-shrink-0 transition-transform ${expanded === msg.id ? "rotate-180" : ""}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {expanded === msg.id && (
                <div className="px-4 pb-4 border-t" style={{ borderColor: "var(--line)" }}>
                  <p className="mt-3 text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "var(--ink-2)" }}>{msg.message}</p>
                  <div className="flex gap-2 mt-3">
                    {!msg.isResolved && (
                      <button
                        onClick={() => handleResolve(msg.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium"
                        style={{ background: "var(--green-soft)", color: "var(--green)" }}
                      >
                        Mark Resolved
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(msg.id, msg.name)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium"
                      style={{ background: "var(--red-soft)", color: "var(--red)" }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {(data?.items ?? []).length === 0 && (
            <div className="text-center py-12 text-sm" style={{ color: "var(--ink-3)" }}>No messages</div>
          )}
        </div>
      )}

      <Pagination page={page} total={data?.total ?? 0} limit={20} onChange={setPage} />
    </div>
  );
}
