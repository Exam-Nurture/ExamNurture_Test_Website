"use client";

import { useEffect, useState } from "react";
import {
  apiAdminGetExamCategories,
  apiAdminCreateExamCategory,
  apiAdminUpdateExamCategory,
  apiAdminDeleteExamCategory,
} from "@/lib/api";
import { AdminTable, Modal, Field } from "@/components/admin/AdminTable";

interface ExamCategory {
  id: number;
  name: string;
  _count?: { exams: number };
}

export default function AdminExamCategoriesPage() {
  const [categories, setCategories] = useState<ExamCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [editing, setEditing] = useState<ExamCategory | null>(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await apiAdminGetExamCategories();
      setCategories(Array.isArray(res) ? res : (res as any).items ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function openCreate() {
    setEditing(null);
    setName("");
    setModal("create");
  }

  function openEdit(cat: ExamCategory) {
    setEditing(cat);
    setName(cat.name);
    setModal("edit");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (modal === "edit" && editing) {
        await apiAdminUpdateExamCategory(editing.id, name);
      } else {
        await apiAdminCreateExamCategory(name);
      }
      setModal(null);
      setName("");
      setEditing(null);
      load();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(cat: ExamCategory) {
    if (!confirm(`Delete category "${cat.name}"? Exams in this category will become uncategorised.`)) return;
    await apiAdminDeleteExamCategory(cat.id);
    load();
  }

  const cols = [
    { key: "id", label: "ID", width: "80px" },
    { key: "name", label: "Name" },
    {
      key: "exams",
      label: "Exams",
      render: (cat: ExamCategory) => <span>{cat._count?.exams ?? 0}</span>,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Manage Exam Categories</h1>
        <button
          onClick={openCreate}
          className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
          style={{ background: "var(--blue)" }}
        >
          + Add Category
        </button>
      </div>

      <AdminTable
        columns={cols}
        data={categories}
        loading={loading}
        onDelete={handleDelete}
        onEdit={openEdit}
      />

      {modal && (
        <Modal
          title={modal === "edit" ? "Edit Exam Category" : "Add Exam Category"}
          onClose={() => { setModal(null); setEditing(null); setName(""); }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field
              name="name"
              label="Category Name"
              value={name}
              onChange={setName}
              required
              placeholder="e.g. State PSC"
            />
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-60"
                style={{ background: "var(--blue)" }}
              >
                {saving ? "Saving..." : modal === "edit" ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={() => { setModal(null); setEditing(null); setName(""); }}
                className="flex-1 py-2 rounded-lg text-sm font-medium"
                style={{ border: "1px solid var(--line)", color: "var(--ink-2)" }}
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
