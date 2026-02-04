import { useMemo, useState } from "react";
import Seo from "@/components/Seo";
import AppShell from "@/components/AppShell";
import DataTableShell from "@/components/DataTableShell";
import ConfirmDialog from "@/components/ConfirmDialog";
import { mockParents, type Parent } from "@/mockdata";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus, Search, UserRoundPen, Trash2, Mail } from "lucide-react";

function statusBadge(s: Parent["status"]) {
  return s === "active" ? (
    <Badge className="rounded-full bg-emerald-500/15 text-emerald-700 ring-1 ring-emerald-500/20">Active</Badge>
  ) : (
    <Badge variant="secondary" className="rounded-full">Inactive</Badge>
  );
}

export default function ParentsPage() {
  const [rows, setRows] = useState<Parent[]>(() => mockParents);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | Parent["status"]>("all");

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Parent | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState<Parent | null>(null);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return rows.filter((r) => {
      const matchesQ =
        !qq ||
        r.name.toLowerCase().includes(qq) ||
        r.studentName.toLowerCase().includes(qq) ||
        r.email.toLowerCase().includes(qq);
      const matchesStatus = status === "all" ? true : r.status === status;
      return matchesQ && matchesStatus;
    });
  }, [rows, q, status]);

  const [form, setForm] = useState<Omit<Parent, "id">>({
    name: "",
    studentName: "",
    relationship: "Guardian",
    phone: "",
    email: "",
    status: "active",
  });

  const resetForm = () =>
    setForm({
      name: "",
      studentName: "",
      relationship: "Guardian",
      phone: "",
      email: "",
      status: "active",
    });

  const validate = () => {
    if (!form.name.trim()) return "Name is required";
    if (!form.studentName.trim()) return "Student name is required";
    if (!form.phone.trim()) return "Phone is required";
    if (!form.email.trim() || !form.email.includes("@")) return "Valid email is required";
    return null;
  };

  const onCreate = () => {
    const err = validate();
    if (err) return alert(err);
    const next: Parent = { ...form, id: crypto.randomUUID() };
    setRows((p) => [next, ...p]);
    setCreateOpen(false);
    resetForm();
  };

  const openEdit = (p: Parent) => {
    setEditing(p);
    setForm({ ...p, id: undefined as never });
    setEditOpen(true);
  };

  const onUpdate = () => {
    if (!editing) return;
    const err = validate();
    if (err) return alert(err);
    setRows((p) => p.map((r) => (r.id === editing.id ? { ...r, ...form } : r)));
    setEditOpen(false);
    setEditing(null);
    resetForm();
  };

  const onDelete = (p: Parent) => {
    setDeleting(p);
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!deleting) return;
    setRows((p) => p.filter((r) => r.id !== deleting.id));
    setConfirmOpen(false);
    setDeleting(null);
  };

  return (
    <>
      <Seo title="Parents • Crestview Admin" description="Manage parent contacts: create, edit, email and filter." />
      <AppShell pageTitle="Parents">
        <DataTableShell
          title="Parents"
          subtitle="Contact directory"
          toolbar={
            <>
              <div className="relative w-full sm:w-[280px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  data-testid="parents-search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search parent, student, email…"
                  className="rounded-xl pl-10"
                />
              </div>
              <Select value={status} onValueChange={(v) => setStatus(v as any)}>
                <SelectTrigger data-testid="parents-status-filter" className="w-full sm:w-[170px] rounded-xl">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Dialog open={createOpen} onOpenChange={(o) => { setCreateOpen(o); if (o) resetForm(); }}>
                <DialogTrigger asChild>
                  <Button
                    data-testid="parents-create"
                    className="rounded-xl bg-gradient-to-r from-primary to-primary/85 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5 active:translate-y-0 transition-all"
                    onClick={() => setCreateOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Parent
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[560px]" data-testid="parents-create-dialog">
                  <DialogHeader>
                    <DialogTitle>Add parent</DialogTitle>
                  </DialogHeader>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2 sm:col-span-2">
                      <Label>Parent name</Label>
                      <Input data-testid="parents-form-name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="rounded-xl" />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label>Student name</Label>
                      <Input data-testid="parents-form-student" value={form.studentName} onChange={(e) => setForm((p) => ({ ...p, studentName: e.target.value }))} className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label>Relationship</Label>
                      <Select value={form.relationship} onValueChange={(v) => setForm((p) => ({ ...p, relationship: v as any }))}>
                        <SelectTrigger data-testid="parents-form-relationship" className="rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Father">Father</SelectItem>
                          <SelectItem value="Mother">Mother</SelectItem>
                          <SelectItem value="Guardian">Guardian</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v as any }))}>
                        <SelectTrigger data-testid="parents-form-status" className="rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input data-testid="parents-form-phone" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input data-testid="parents-form-email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} className="rounded-xl" />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button data-testid="parents-form-cancel" variant="secondary" className="rounded-xl" onClick={() => setCreateOpen(false)}>
                      Cancel
                    </Button>
                    <Button data-testid="parents-form-submit" className="rounded-xl" onClick={onCreate}>
                      Create
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          }
        >
          <div className="p-4">
            <Table data-testid="parents-table">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead className="hidden md:table-cell">Relationship</TableHead>
                  <TableHead className="hidden lg:table-cell">Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[60px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p, idx) => (
                  <TableRow key={p.id} data-testid={`parents-row-${idx}`} className="hover:bg-muted/40">
                    <TableCell className="font-semibold">{p.name}</TableCell>
                    <TableCell className="text-muted-foreground">{p.studentName}</TableCell>
                    <TableCell className="hidden md:table-cell">{p.relationship}</TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground">{p.email}</TableCell>
                    <TableCell className="text-muted-foreground">{p.phone}</TableCell>
                    <TableCell>{statusBadge(p.status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button data-testid={`parents-actions-${idx}`} variant="ghost" size="icon" className="rounded-xl">
                            <MoreHorizontal className="h-4.5 w-4.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            data-testid={`parents-email-${idx}`}
                            className="cursor-pointer"
                            onClick={() => {
                              window.location.href = `mailto:${p.email}`;
                            }}
                          >
                            <Mail className="mr-2 h-4 w-4" />
                            Email
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            data-testid={`parents-edit-${idx}`}
                            className="cursor-pointer"
                            onClick={() => openEdit(p)}
                          >
                            <UserRoundPen className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            data-testid={`parents-delete-${idx}`}
                            className="cursor-pointer text-destructive focus:text-destructive"
                            onClick={() => onDelete(p)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}

                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground" data-testid="parents-empty">
                      No parents found. Try adjusting filters.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>
        </DataTableShell>

        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="sm:max-w-[560px]" data-testid="parents-edit-dialog">
            <DialogHeader>
              <DialogTitle>Edit parent</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label>Parent name</Label>
                <Input data-testid="parents-edit-name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="rounded-xl" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Student name</Label>
                <Input data-testid="parents-edit-student" value={form.studentName} onChange={(e) => setForm((p) => ({ ...p, studentName: e.target.value }))} className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Relationship</Label>
                <Select value={form.relationship} onValueChange={(v) => setForm((p) => ({ ...p, relationship: v as any }))}>
                  <SelectTrigger data-testid="parents-edit-relationship" className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Father">Father</SelectItem>
                    <SelectItem value="Mother">Mother</SelectItem>
                    <SelectItem value="Guardian">Guardian</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v as any }))}>
                  <SelectTrigger data-testid="parents-edit-status" className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input data-testid="parents-edit-phone" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input data-testid="parents-edit-email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} className="rounded-xl" />
              </div>
            </div>
            <DialogFooter>
              <Button data-testid="parents-edit-cancel" variant="secondary" className="rounded-xl" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button data-testid="parents-edit-submit" className="rounded-xl" onClick={onUpdate}>
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title="Delete parent?"
          description={`This will remove "${deleting?.name ?? "parent"}" from the directory. This action can't be undone.`}
          confirmText="Delete"
          destructive
          onConfirm={confirmDelete}
        />
      </AppShell>
    </>
  );
}
