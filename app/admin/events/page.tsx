"use client";

import { useEffect, useState } from "react";
import {
  apiAdminGetEvents, apiAdminCreateEvent, apiAdminUpdateEvent, apiAdminDeleteEvent,
  AdminLiveEvent,
} from "@/lib/api";
import { AdminTable, Pagination, Modal, Field, SelectField, Toggle } from "@/components/admin/AdminTable";

const now = () => new Date().toISOString().slice(0, 16);
const empty = (): Partial<AdminLiveEvent> => ({
  title: "", description: "", host: "", hostRole: "",
  scheduledAt: now(), durationMin: 60, isLive: false,
  meetUrl: "", tierRequired: 0, isActive: true,
});

export default function AdminEventsPage() {
  const [data, setData] = useState<{ items: AdminLiveEvent[]; total: number } | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [form, setForm] = useState<Partial<AdminLiveEvent>>(empty());
  const [saving, setSaving] = useState(false);

  async function load(p = page) {
    setLoading(true);
    try { setData(await apiAdminGetEvents({ page: p })); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [page]);

  function set(key: keyof AdminLiveEvent, val: unknown) { setForm((f) => ({ ...f, [key]: val })); }

  async function handleSave(ev: React.FormEvent) {
    ev.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        durationMin: Number(form.durationMin),
        tierRequired: Number(form.tierRequired),
        scheduledAt: new Date(form.scheduledAt!).toISOString(),
      };
      if (modal === "create") await apiAdminCreateEvent(payload);
      else await apiAdminUpdateEvent(form.id!, payload);
      setModal(null);
      load();
    } finally { setSaving(false); }
  }

  async function handleDelete(e: AdminLiveEvent) {
    if (!confirm(`Delete event "${e.title}"?`)) return;
    await apiAdminDeleteEvent(e.id);
    load();
  }

  const cols = [
    { key: "title", label: "Title" },
    { key: "host", label: "Host" },
    { key: "scheduledAt", label: "Scheduled", render: (e: AdminLiveEvent) => new Date(e.scheduledAt).toLocaleDateString() },
    { key: "durationMin", label: "Duration", render: (e: AdminLiveEvent) => `${e.durationMin} min` },
    {
      key: "isLive", label: "Live",
      render: (e: AdminLiveEvent) => e.isLive ? <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ background: "var(--red-soft)", color: "var(--red)" }}>LIVE</span> : "—",
    },
    { key: "tierRequired", label: "Tier", render: (e: AdminLiveEvent) => `Tier ${e.tierRequired}` },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => { setForm(empty()); setModal("create"); }} className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: "var(--blue)" }}>
          + Add Event
        </button>
      </div>

      <AdminTable columns={cols} data={data?.items ?? []} loading={loading}
        onEdit={(e) => { setForm({ ...e, scheduledAt: e.scheduledAt.slice(0, 16) }); setModal("edit"); }}
        onDelete={handleDelete}
      />
      <Pagination page={page} total={data?.total ?? 0} limit={20} onChange={setPage} />

      {modal && (
        <Modal title={modal === "create" ? "Add Live Event" : `Edit — ${form.title}`} onClose={() => setModal(null)}>
          <form onSubmit={handleSave} className="space-y-3">
            <Field label="Title" name="title" value={form.title ?? ""} onChange={(v) => set("title", v)} required />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Host Name" name="host" value={form.host ?? ""} onChange={(v) => set("host", v)} required />
              <Field label="Host Role" name="hostRole" value={form.hostRole ?? ""} onChange={(v) => set("hostRole", v)} required />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--ink-2)" }}>Description</label>
              <textarea value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} rows={2}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{ border: "1.5px solid var(--line)", background: "var(--bg)", color: "var(--ink-1)" }} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Scheduled At" name="scheduledAt" type="datetime-local" value={form.scheduledAt ?? ""} onChange={(v) => set("scheduledAt", v)} required />
              <Field label="Duration (min)" name="durationMin" type="number" value={form.durationMin ?? 60} onChange={(v) => set("durationMin", parseInt(v))} />
            </div>
            <Field label="Meet URL" name="meetUrl" value={form.meetUrl ?? ""} onChange={(v) => set("meetUrl", v)} />
            <SelectField label="Tier Required" name="tierRequired" value={String(form.tierRequired ?? 0)}
              onChange={(v) => set("tierRequired", parseInt(v))}
              options={[0, 1, 2, 3].map((n) => ({ value: n, label: n === 0 ? "Free" : `Tier ${n}` }))} />
            <div className="grid grid-cols-2 gap-3">
              <Toggle label="Is Live Now" checked={form.isLive ?? false} onChange={(v) => set("isLive", v)} />
              <Toggle label="Active" checked={form.isActive ?? true} onChange={(v) => set("isActive", v)} />
            </div>
            <div className="flex gap-2 pt-2">
              <button type="submit" disabled={saving} className="flex-1 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-60" style={{ background: "var(--blue)" }}>
                {saving ? "Saving…" : "Save"}
              </button>
              <button type="button" onClick={() => setModal(null)} className="flex-1 py-2 rounded-lg text-sm" style={{ border: "1px solid var(--line)", color: "var(--ink-2)" }}>
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
