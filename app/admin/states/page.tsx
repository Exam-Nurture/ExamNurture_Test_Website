"use client";

import { useEffect, useState } from "react";
import {
  apiAdminGetStates, apiAdminCreateState, apiAdminDeleteState,
} from "@/lib/api";
import { AdminTable, Modal, Field } from "@/components/admin/AdminTable";

interface AdminState {
  id: number;
  name: string;
  _count?: {
    boards: number;
  };
}

export default function AdminStatesPage() {
  const [states, setStates] = useState<AdminState[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"create" | null>(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await apiAdminGetStates();
      // res is PaginatedResponse or just array? lib/api.ts says PaginatedResponse
      setStates(Array.isArray(res) ? res : (res as any).items || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await apiAdminCreateState(name);
      setModal(null);
      setName("");
      load();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(s: AdminState) {
    if (!confirm(`Delete state "${s.name}"?`)) return;
    await apiAdminDeleteState(s.id);
    load();
  }

  const cols = [
    { key: "id", label: "ID", width: "80px" },
    { key: "name", label: "Name" },
    { 
      key: "boards", 
      label: "Boards", 
      render: (s: AdminState) => <span>{s._count?.boards ?? 0}</span> 
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Manage States</h1>
        <button onClick={() => setModal("create")} className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: "var(--blue)" }}>
          + Add State
        </button>
      </div>

      <AdminTable columns={cols} data={states} loading={loading} onDelete={handleDelete} />

      {modal && (
        <Modal title="Add New State" onClose={() => setModal(null)}>
          <form onSubmit={handleCreate} className="space-y-4">
            <Field name="name" label="State Name" value={name} onChange={setName} required placeholder="e.g. Jharkhand" />
            <div className="flex gap-2 pt-2">
              <button type="submit" disabled={saving} className="flex-1 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-60" style={{ background: "var(--blue)" }}>
                {saving ? "Creating..." : "Create"}
              </button>
              <button type="button" onClick={() => setModal(null)} className="flex-1 py-2 rounded-lg text-sm font-medium" style={{ border: "1px solid var(--line)", color: "var(--ink-2)" }}>
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
