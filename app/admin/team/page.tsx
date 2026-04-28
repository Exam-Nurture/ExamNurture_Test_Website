"use client";

import { useEffect, useState } from "react";
import {
  apiAdminGetTeam, apiAdminCreateTeamMember, apiAdminUpdateTeamMember, apiAdminDeleteTeamMember,
  AdminTeamMember,
} from "@/lib/api";
import { AdminTable, Pagination, Modal, Field, Toggle } from "@/components/admin/AdminTable";

const empty = (): Partial<AdminTeamMember> => ({
  name: "", role: "", photoUrl: "", bio: "", linkedinUrl: "", twitterUrl: "",
  email: "", displayOrder: 0, isActive: true,
});

export default function AdminTeamPage() {
  const [data, setData] = useState<{ items: AdminTeamMember[]; total: number } | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [form, setForm] = useState<Partial<AdminTeamMember>>(empty());
  const [saving, setSaving] = useState(false);

  async function load(p = page) {
    setLoading(true);
    try { setData(await apiAdminGetTeam({ page: p })); }
    finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [page]);

  function set(key: keyof AdminTeamMember, val: unknown) { setForm((f) => ({ ...f, [key]: val })); }

  async function handleSave(ev: React.FormEvent) {
    ev.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, displayOrder: Number(form.displayOrder) };
      if (modal === "create") await apiAdminCreateTeamMember(payload);
      else await apiAdminUpdateTeamMember(form.id!, payload);
      setModal(null);
      load();
    } finally { setSaving(false); }
  }

  async function handleDelete(m: AdminTeamMember) {
    if (!confirm(`Remove "${m.name}" from team?`)) return;
    await apiAdminDeleteTeamMember(m.id);
    load();
  }

  const cols = [
    { key: "displayOrder", label: "#", width: "40px" },
    {
      key: "name", label: "Name",
      render: (m: AdminTeamMember) => (
        <div className="flex items-center gap-2">
          {m.photoUrl
            ? <img src={m.photoUrl} alt="" className="w-7 h-7 rounded-full object-cover" />
            : <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: "var(--blue)" }}>{m.name[0]}</div>
          }
          {m.name}
        </div>
      ),
    },
    { key: "role", label: "Role" },
    { key: "email", label: "Email", render: (m: AdminTeamMember) => m.email ?? "—" },
    {
      key: "isActive", label: "Active",
      render: (m: AdminTeamMember) => <span style={{ color: m.isActive ? "var(--green)" : "var(--red)" }}>{m.isActive ? "Yes" : "No"}</span>,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => { setForm(empty()); setModal("create"); }} className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: "var(--blue)" }}>
          + Add Member
        </button>
      </div>

      <AdminTable columns={cols} data={data?.items ?? []} loading={loading}
        onEdit={(m) => { setForm({ ...m }); setModal("edit"); }}
        onDelete={handleDelete}
      />
      <Pagination page={page} total={data?.total ?? 0} limit={20} onChange={setPage} />

      {modal && (
        <Modal title={modal === "create" ? "Add Team Member" : `Edit — ${form.name}`} onClose={() => setModal(null)}>
          <form onSubmit={handleSave} className="space-y-3">
            <Field label="Name" name="name" value={form.name ?? ""} onChange={(v) => set("name", v)} required />
            <Field label="Role / Title" name="role" value={form.role ?? ""} onChange={(v) => set("role", v)} required />
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: "var(--ink-2)" }}>Bio</label>
              <textarea value={form.bio ?? ""} onChange={(e) => set("bio", e.target.value)} rows={2}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{ border: "1.5px solid var(--line)", background: "var(--bg)", color: "var(--ink-1)" }} />
            </div>
            <Field label="Photo URL" name="photoUrl" value={form.photoUrl ?? ""} onChange={(v) => set("photoUrl", v)} />
            <Field label="Email" name="email" type="email" value={form.email ?? ""} onChange={(v) => set("email", v)} />
            <Field label="LinkedIn URL" name="linkedinUrl" value={form.linkedinUrl ?? ""} onChange={(v) => set("linkedinUrl", v)} />
            <Field label="Twitter URL" name="twitterUrl" value={form.twitterUrl ?? ""} onChange={(v) => set("twitterUrl", v)} />
            <Field label="Display Order" name="displayOrder" type="number" value={form.displayOrder ?? 0} onChange={(v) => set("displayOrder", parseInt(v))} />
            <Toggle label="Active" checked={form.isActive ?? true} onChange={(v) => set("isActive", v)} />
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
