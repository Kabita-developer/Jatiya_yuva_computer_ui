import { useMemo, useState } from "react";
import Seo from "@/components/Seo";
import AppShell from "@/components/AppShell";
import DataTableShell from "@/components/DataTableShell";
import ConfirmDialog from "@/components/ConfirmDialog";
import { mockStudents, type Student } from "@/mockdata";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus, Search, UserRoundPen, Trash2 } from "lucide-react";

function statusBadge(s: Student["status"]) {
  return s === "active" ? (
    <Badge className="rounded-full bg-emerald-500/15 text-emerald-700 ring-1 ring-emerald-500/20">Active</Badge>
  ) : (
    <Badge variant="secondary" className="rounded-full">Inactive</Badge>
  );
}

export default function StudentsPage() {
  const [rows, setRows] = useState<Student[]>(() => mockStudents);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | Student["status"]>("all");

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState<Student | null>(null);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return rows.filter((r) => {
      const matchesQ =
        !qq ||
        r.name.toLowerCase().includes(qq) ||
        r.rollNo.toLowerCase().includes(qq) ||
        r.guardian.toLowerCase().includes(qq);
      const matchesStatus = status === "all" ? true : r.status === status;
      return matchesQ && matchesStatus;
    });
  }, [rows, q, status]);

  const [form, setForm] = useState<Omit<Student, "id">>({
    name: "",
    grade: "10",
    section: "A",
    rollNo: "",
    guardian: "",
    phone: "",
    status: "active",
    joinedAt: new Date().toISOString().slice(0, 10),
  });

  const resetForm = () =>
    setForm({
      name: "",
      grade: "10",
      section: "A",
      rollNo: "",
      guardian: "",
      phone: "",
      status: "active",
      joinedAt: new Date().toISOString().slice(0, 10),
    });

  const validate = () => {
    if (!form.name.trim()) return "Name is required";
    if (!form.rollNo.trim()) return "Roll No is required";
    if (!form.guardian.trim()) return "Guardian is required";
    if (!form.phone.trim()) return "Phone is required";
    return null;
  };

  const onCreate = () => {
    const err = validate();
    if (err) return alert(err);
    const next: Student = { ...form, id: crypto.randomUUID() };
    setRows((p) => [next, ...p]);
    setCreateOpen(false);
    resetForm();
  };

  const openEdit = (s: Student) => {
    setEditing(s);
    setForm({ ...s, id: undefined as never });
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

  const onDelete = (s: Student) => {
    setDeleting(s);
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
      <Seo title="Students • Crestview Admin" description="Manage student roster: create, edit, search and filter." />
      <AppShell pageTitle="Students">
        <DataTableShell
          title="Students"
          subtitle="Roster management"
          toolbar={
            <>
              <div className="relative w-full sm:w-[280px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  data-testid="students-search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search name, roll no, guardian…"
                  className="rounded-xl pl-10"
                />
              </div>
              <Select value={status} onValueChange={(v) => setStatus(v as any)}>
                <SelectTrigger data-testid="students-status-filter" className="w-full sm:w-[170px] rounded-xl">
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
                    data-testid="students-create"
                    className="rounded-xl bg-gradient-to-r from-primary to-primary/85 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5 active:translate-y-0 transition-all"
                    onClick={() => setCreateOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Student
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[560px]" data-testid="students-create-dialog">
                  <DialogHeader>
                    <DialogTitle>Add student</DialogTitle>
                  </DialogHeader>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="s-name">Student name</Label>
                      <Input data-testid="students-form-name" id="s-name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="rounded-xl" />
                    </div>

                    <div className="space-y-2">
                      <Label>Grade</Label>
                      <Select value={form.grade} onValueChange={(v) => setForm((p) => ({ ...p, grade: v }))}>
                        <SelectTrigger data-testid="students-form-grade" className="rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {["6", "7", "8", "9", "10", "11", "12"].map((g) => (
                            <SelectItem key={g} value={g}>{g}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Section</Label>
                      <Select value={form.section} onValueChange={(v) => setForm((p) => ({ ...p, section: v }))}>
                        <SelectTrigger data-testid="students-form-section" className="rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {["A", "B", "C", "D"].map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="s-roll">Roll No</Label>
                      <Input data-testid="students-form-roll" id="s-roll" value={form.rollNo} onChange={(e) => setForm((p) => ({ ...p, rollNo: e.target.value }))} className="rounded-xl" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="s-joined">Joined</Label>
                      <Input data-testid="students-form-joined" id="s-joined" type="date" value={form.joinedAt} onChange={(e) => setForm((p) => ({ ...p, joinedAt: e.target.value }))} className="rounded-xl" />
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="s-guardian">Guardian</Label>
                      <Input data-testid="students-form-guardian" id="s-guardian" value={form.guardian} onChange={(e) => setForm((p) => ({ ...p, guardian: e.target.value }))} className="rounded-xl" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="s-phone">Phone</Label>
                      <Input data-testid="students-form-phone" id="s-phone" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} className="rounded-xl" />
                    </div>

                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v as any }))}>
                        <SelectTrigger data-testid="students-form-status" className="rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button data-testid="students-form-cancel" variant="secondary" className="rounded-xl" onClick={() => setCreateOpen(false)}>
                      Cancel
                    </Button>
                    <Button data-testid="students-form-submit" className="rounded-xl" onClick={onCreate}>
                      Create
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          }
        >
          <div className="p-4">
            <Table data-testid="students-table">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Roll No</TableHead>
                  <TableHead className="hidden md:table-cell">Guardian</TableHead>
                  <TableHead className="hidden lg:table-cell">Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[60px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((s, idx) => (
                  <TableRow key={s.id} data-testid={`students-row-${idx}`} className="hover:bg-muted/40">
                    <TableCell className="font-semibold">{s.name}</TableCell>
                    <TableCell>{s.grade}-{s.section}</TableCell>
                    <TableCell className="text-muted-foreground">{s.rollNo}</TableCell>
                    <TableCell className="hidden md:table-cell">{s.guardian}</TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground">{s.phone}</TableCell>
                    <TableCell>{statusBadge(s.status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button data-testid={`students-actions-${idx}`} variant="ghost" size="icon" className="rounded-xl">
                            <MoreHorizontal className="h-4.5 w-4.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            data-testid={`students-edit-${idx}`}
                            className="cursor-pointer"
                            onClick={() => openEdit(s)}
                          >
                            <UserRoundPen className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            data-testid={`students-delete-${idx}`}
                            className="cursor-pointer text-destructive focus:text-destructive"
                            onClick={() => onDelete(s)}
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
                    <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground" data-testid="students-empty">
                      No students found. Try adjusting filters.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>
        </DataTableShell>

        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="sm:max-w-[560px]" data-testid="students-edit-dialog">
            <DialogHeader>
              <DialogTitle>Edit student</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label>Student name</Label>
                <Input data-testid="students-edit-name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Grade</Label>
                <Select value={form.grade} onValueChange={(v) => setForm((p) => ({ ...p, grade: v }))}>
                  <SelectTrigger data-testid="students-edit-grade" className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["6", "7", "8", "9", "10", "11", "12"].map((g) => (
                      <SelectItem key={g} value={g}>{g}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Section</Label>
                <Select value={form.section} onValueChange={(v) => setForm((p) => ({ ...p, section: v }))}>
                  <SelectTrigger data-testid="students-edit-section" className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["A", "B", "C", "D"].map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Roll No</Label>
                <Input data-testid="students-edit-roll" value={form.rollNo} onChange={(e) => setForm((p) => ({ ...p, rollNo: e.target.value }))} className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Joined</Label>
                <Input data-testid="students-edit-joined" type="date" value={form.joinedAt} onChange={(e) => setForm((p) => ({ ...p, joinedAt: e.target.value }))} className="rounded-xl" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Guardian</Label>
                <Input data-testid="students-edit-guardian" value={form.guardian} onChange={(e) => setForm((p) => ({ ...p, guardian: e.target.value }))} className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input data-testid="students-edit-phone" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v as any }))}>
                  <SelectTrigger data-testid="students-edit-status" className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button data-testid="students-edit-cancel" variant="secondary" className="rounded-xl" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button data-testid="students-edit-submit" className="rounded-xl" onClick={onUpdate}>
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title="Delete student?"
          description={`This will remove "${deleting?.name ?? "student"}" from the roster. This action can't be undone.`}
          confirmText="Delete"
          destructive
          onConfirm={confirmDelete}
        />
      </AppShell>
    </>
  );
}
