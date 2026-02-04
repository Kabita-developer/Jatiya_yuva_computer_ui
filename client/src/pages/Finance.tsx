import { useMemo, useState } from "react";
import Seo from "@/components/Seo";
import AppShell from "@/components/AppShell";
import DataTableShell from "@/components/DataTableShell";
import ConfirmDialog from "@/components/ConfirmDialog";
import { mockInvoices, type Invoice } from "@/mockdata";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus, Search, Receipt, Send, CheckCircle2, Ban, Trash2 } from "lucide-react";

function money(n: number) {
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(n);
}

function statusBadge(s: Invoice["status"]) {
  switch (s) {
    case "paid":
      return <Badge className="rounded-full bg-emerald-500/15 text-emerald-700 ring-1 ring-emerald-500/20">Paid</Badge>;
    case "overdue":
      return <Badge className="rounded-full bg-red-500/15 text-red-700 ring-1 ring-red-500/20">Overdue</Badge>;
    case "sent":
      return <Badge className="rounded-full bg-blue-500/15 text-blue-700 ring-1 ring-blue-500/20">Sent</Badge>;
    case "draft":
      return <Badge variant="secondary" className="rounded-full">Draft</Badge>;
    case "void":
      return <Badge variant="outline" className="rounded-full">Void</Badge>;
  }
}

export default function FinancePage() {
  const [rows, setRows] = useState<Invoice[]>(() => mockInvoices);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | Invoice["status"]>("all");
  const [category, setCategory] = useState<"all" | Invoice["category"]>("all");

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Invoice | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState<Invoice | null>(null);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return rows.filter((r) => {
      const matchesQ =
        !qq ||
        r.title.toLowerCase().includes(qq) ||
        r.studentName.toLowerCase().includes(qq) ||
        r.category.toLowerCase().includes(qq);
      const matchesStatus = status === "all" ? true : r.status === status;
      const matchesCategory = category === "all" ? true : r.category === category;
      return matchesQ && matchesStatus && matchesCategory;
    });
  }, [rows, q, status, category]);

  const totals = useMemo(() => {
    const amount = filtered.reduce((a, r) => a + r.amount, 0);
    const paid = filtered.reduce((a, r) => a + r.paid, 0);
    return { amount, paid, due: Math.max(0, amount - paid) };
  }, [filtered]);

  const [form, setForm] = useState<Omit<Invoice, "id">>({
    title: "",
    category: "Tuition",
    studentName: "",
    amount: 0,
    paid: 0,
    status: "draft",
    dueDate: new Date().toISOString().slice(0, 10),
    createdAt: new Date().toISOString().slice(0, 10),
  });

  const resetForm = () =>
    setForm({
      title: "",
      category: "Tuition",
      studentName: "",
      amount: 0,
      paid: 0,
      status: "draft",
      dueDate: new Date().toISOString().slice(0, 10),
      createdAt: new Date().toISOString().slice(0, 10),
    });

  const validate = () => {
    if (!form.title.trim()) return "Title is required";
    if (!form.studentName.trim()) return "Student name is required";
    if (!(form.amount > 0)) return "Amount must be > 0";
    if (form.paid < 0) return "Paid cannot be negative";
    if (form.paid > form.amount) return "Paid cannot exceed amount";
    return null;
  };

  const onCreate = () => {
    const err = validate();
    if (err) return alert(err);
    const next: Invoice = { ...form, id: crypto.randomUUID() };
    setRows((p) => [next, ...p]);
    setCreateOpen(false);
    resetForm();
  };

  const openEdit = (inv: Invoice) => {
    setEditing(inv);
    setForm({ ...inv, id: undefined as never });
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

  const onDelete = (inv: Invoice) => {
    setDeleting(inv);
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!deleting) return;
    setRows((p) => p.filter((r) => r.id !== deleting.id));
    setConfirmOpen(false);
    setDeleting(null);
  };

  const markSent = (inv: Invoice) => setRows((p) => p.map((r) => (r.id === inv.id ? { ...r, status: "sent" } : r)));
  const markPaid = (inv: Invoice) => setRows((p) => p.map((r) => (r.id === inv.id ? { ...r, status: "paid", paid: r.amount } : r)));
  const markVoid = (inv: Invoice) => setRows((p) => p.map((r) => (r.id === inv.id ? { ...r, status: "void" } : r)));

  return (
    <>
      <Seo title="Finance • Crestview Admin" description="Manage invoices and fees: draft, send, mark paid, overdue and export." />
      <AppShell pageTitle="Finance">
        <DataTableShell
          title="Finance"
          subtitle="Fees & invoices"
          toolbar={
            <>
              <div className="relative w-full sm:w-[280px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  data-testid="finance-search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search invoice, student, category…"
                  className="rounded-xl pl-10"
                />
              </div>

              <Select value={status} onValueChange={(v) => setStatus(v as any)}>
                <SelectTrigger data-testid="finance-status-filter" className="w-full sm:w-[160px] rounded-xl">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="void">Void</SelectItem>
                </SelectContent>
              </Select>

              <Select value={category} onValueChange={(v) => setCategory(v as any)}>
                <SelectTrigger data-testid="finance-category-filter" className="w-full sm:w-[170px] rounded-xl">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {["Tuition", "Transport", "Library", "Exams", "Misc"].map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Dialog open={createOpen} onOpenChange={(o) => { setCreateOpen(o); if (o) resetForm(); }}>
                <DialogTrigger asChild>
                  <Button
                    data-testid="finance-create"
                    className="rounded-xl bg-gradient-to-r from-primary to-primary/85 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5 active:translate-y-0 transition-all"
                    onClick={() => setCreateOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    New Invoice
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[620px]" data-testid="finance-create-dialog">
                  <DialogHeader>
                    <DialogTitle>Create invoice</DialogTitle>
                  </DialogHeader>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2 sm:col-span-2">
                      <Label>Title</Label>
                      <Input data-testid="finance-form-title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} className="rounded-xl" />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label>Student</Label>
                      <Input data-testid="finance-form-student" value={form.studentName} onChange={(e) => setForm((p) => ({ ...p, studentName: e.target.value }))} className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select value={form.category} onValueChange={(v) => setForm((p) => ({ ...p, category: v as any }))}>
                        <SelectTrigger data-testid="finance-form-category" className="rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {["Tuition", "Transport", "Library", "Exams", "Misc"].map((c) => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v as any }))}>
                        <SelectTrigger data-testid="finance-form-status" className="rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="sent">Sent</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="overdue">Overdue</SelectItem>
                          <SelectItem value="void">Void</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Amount</Label>
                      <Input
                        data-testid="finance-form-amount"
                        type="number"
                        value={form.amount}
                        onChange={(e) => setForm((p) => ({ ...p, amount: Number(e.target.value) }))}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Paid</Label>
                      <Input
                        data-testid="finance-form-paid"
                        type="number"
                        value={form.paid}
                        onChange={(e) => setForm((p) => ({ ...p, paid: Number(e.target.value) }))}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Due date</Label>
                      <Input
                        data-testid="finance-form-due"
                        type="date"
                        value={form.dueDate}
                        onChange={(e) => setForm((p) => ({ ...p, dueDate: e.target.value }))}
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Created</Label>
                      <Input
                        data-testid="finance-form-created"
                        type="date"
                        value={form.createdAt}
                        onChange={(e) => setForm((p) => ({ ...p, createdAt: e.target.value }))}
                        className="rounded-xl"
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button data-testid="finance-form-cancel" variant="secondary" className="rounded-xl" onClick={() => setCreateOpen(false)}>
                      Cancel
                    </Button>
                    <Button data-testid="finance-form-submit" className="rounded-xl" onClick={onCreate}>
                      Create
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button
                data-testid="finance-export"
                variant="secondary"
                className="rounded-xl"
                onClick={() => {
                  const blob = new Blob([JSON.stringify(filtered, null, 2)], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "invoices-export.json";
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                Export
              </Button>
            </>
          }
        >
          <div className="border-b border-border/70 p-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div data-testid="finance-kpi-total" className="rounded-2xl border border-border/70 bg-muted/30 p-4">
                <div className="text-xs font-semibold text-muted-foreground">Total billed</div>
                <div className="mt-1 text-2xl font-extrabold tracking-tight">{money(totals.amount)}</div>
              </div>
              <div data-testid="finance-kpi-paid" className="rounded-2xl border border-border/70 bg-muted/30 p-4">
                <div className="text-xs font-semibold text-muted-foreground">Paid</div>
                <div className="mt-1 text-2xl font-extrabold tracking-tight">{money(totals.paid)}</div>
              </div>
              <div data-testid="finance-kpi-due" className="rounded-2xl border border-border/70 bg-muted/30 p-4">
                <div className="text-xs font-semibold text-muted-foreground">Due</div>
                <div className="mt-1 text-2xl font-extrabold tracking-tight">{money(totals.due)}</div>
              </div>
            </div>
          </div>

          <div className="p-4">
            <Table data-testid="finance-table">
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead className="hidden md:table-cell">Student</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="hidden lg:table-cell">Due</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[60px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((inv, idx) => (
                  <TableRow key={inv.id} data-testid={`finance-row-${idx}`} className="hover:bg-muted/40">
                    <TableCell>
                      <div className="font-semibold">{inv.title}</div>
                      <div className="text-xs text-muted-foreground">Created {inv.createdAt}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">{inv.studentName}</TableCell>
                    <TableCell className="text-muted-foreground">{inv.category}</TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground">{inv.dueDate}</TableCell>
                    <TableCell>
                      <div className="font-semibold">{money(inv.amount)}</div>
                      <div className="text-xs text-muted-foreground">Paid {money(inv.paid)}</div>
                    </TableCell>
                    <TableCell>{statusBadge(inv.status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button data-testid={`finance-actions-${idx}`} variant="ghost" size="icon" className="rounded-xl">
                            <MoreHorizontal className="h-4.5 w-4.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            data-testid={`finance-open-${idx}`}
                            className="cursor-pointer"
                            onClick={() => openEdit(inv)}
                          >
                            <Receipt className="mr-2 h-4 w-4" />
                            Open
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            data-testid={`finance-send-${idx}`}
                            className="cursor-pointer"
                            onClick={() => markSent(inv)}
                          >
                            <Send className="mr-2 h-4 w-4" />
                            Mark Sent
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            data-testid={`finance-paid-${idx}`}
                            className="cursor-pointer"
                            onClick={() => markPaid(inv)}
                          >
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Mark Paid
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            data-testid={`finance-void-${idx}`}
                            className="cursor-pointer"
                            onClick={() => markVoid(inv)}
                          >
                            <Ban className="mr-2 h-4 w-4" />
                            Void
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            data-testid={`finance-delete-${idx}`}
                            className="cursor-pointer text-destructive focus:text-destructive"
                            onClick={() => onDelete(inv)}
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
                    <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground" data-testid="finance-empty">
                      No invoices found. Try adjusting filters.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>
        </DataTableShell>

        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="sm:max-w-[620px]" data-testid="finance-edit-dialog">
            <DialogHeader>
              <DialogTitle>Edit invoice</DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label>Title</Label>
                <Input data-testid="finance-edit-title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} className="rounded-xl" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Student</Label>
                <Input data-testid="finance-edit-student" value={form.studentName} onChange={(e) => setForm((p) => ({ ...p, studentName: e.target.value }))} className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm((p) => ({ ...p, category: v as any }))}>
                  <SelectTrigger data-testid="finance-edit-category" className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Tuition", "Transport", "Library", "Exams", "Misc"].map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v as any }))}>
                  <SelectTrigger data-testid="finance-edit-status" className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="void">Void</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Amount</Label>
                <Input data-testid="finance-edit-amount" type="number" value={form.amount} onChange={(e) => setForm((p) => ({ ...p, amount: Number(e.target.value) }))} className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Paid</Label>
                <Input data-testid="finance-edit-paid" type="number" value={form.paid} onChange={(e) => setForm((p) => ({ ...p, paid: Number(e.target.value) }))} className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Due date</Label>
                <Input data-testid="finance-edit-due" type="date" value={form.dueDate} onChange={(e) => setForm((p) => ({ ...p, dueDate: e.target.value }))} className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Created</Label>
                <Input data-testid="finance-edit-created" type="date" value={form.createdAt} onChange={(e) => setForm((p) => ({ ...p, createdAt: e.target.value }))} className="rounded-xl" />
              </div>
            </div>

            <DialogFooter>
              <Button data-testid="finance-edit-cancel" variant="secondary" className="rounded-xl" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button data-testid="finance-edit-submit" className="rounded-xl" onClick={onUpdate}>
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title="Delete invoice?"
          description={`This will permanently delete "${deleting?.title ?? "invoice"}". This action can't be undone.`}
          confirmText="Delete"
          destructive
          onConfirm={confirmDelete}
        />
      </AppShell>
    </>
  );
}
