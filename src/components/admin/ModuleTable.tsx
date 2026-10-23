import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Search, Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { inr, type ModuleDef } from "@/lib/admin-config";
import type { Row } from "@/lib/data";
import { deleteRow, uid, upsertRow, useStore } from "@/lib/store";
import { AdminTitle } from "./AdminLayout";

export function downloadCsv(name: string, rows: Row[], fields: { key: string; label: string }[]) {
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = [fields.map((f) => esc(f.label)).join(","), ...rows.map((r) => fields.map((f) => esc(r[f.key])).join(","))].join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  a.download = `${name}.csv`;
  a.click();
}

const tone = (v: string) => (/active|paid|upcoming|completed/i.test(v) ? "default" : /expir|pending|leave/i.test(v) ? "secondary" : "destructive") as "default" | "secondary" | "destructive";

export function ModuleTable({ pid, def }: { pid: string; def: ModuleDef }) {
  const rows = useStore((s) => s.partnerData[pid]?.[def.table]) ?? [];
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("All");
  const [edit, setEdit] = useState<Row | null>(null);
  const statusField = def.fields.find((f) => f.key === def.statusKey);
  const list = useMemo(() => rows.filter((r) => (filter === "All" || r[def.statusKey!] === filter) && Object.values(r).join(" ").toLowerCase().includes(q.toLowerCase())), [rows, q, filter, def.statusKey]);
  const moneyField = def.fields.find((f) => f.money);
  const total = moneyField ? list.reduce((s, r) => s + Number(r[moneyField.key] || 0), 0) : null;

  const blank = (): Row => ({ id: uid(), ...Object.fromEntries(def.fields.map((f) => [f.key, f.type === "select" ? f.options![0] : f.type === "date" ? new Date().toISOString().slice(0, 10) : ""])) });

  return (
    <div>
      <AdminTitle title={def.title} text={`${rows.length} records${total !== null ? ` · ${inr(total)} shown` : ""}`}>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-full" onClick={() => downloadCsv(def.slug, list, def.fields)}><Download className="mr-1 h-4 w-4" />Export</Button>
          <Button className="rounded-full" onClick={() => setEdit(blank())}><Plus className="mr-1 h-4 w-4" />Add {def.singular}</Button>
        </div>
      </AdminTitle>
      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative w-full md:w-80"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input className="pl-9" placeholder={`Search ${def.title.toLowerCase()}`} value={q} onChange={(e) => setQ(e.target.value)} /></div>
        {statusField && ["All", ...statusField.options!].map((o) => <Button key={o} size="sm" variant={filter === o ? "default" : "outline"} className="rounded-full" onClick={() => setFilter(o)}>{o}</Button>)}
      </div>
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader><TableRow>{def.fields.map((f) => <TableHead key={f.key}>{f.label}</TableHead>)}<TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {list.length === 0 && <TableRow><TableCell colSpan={def.fields.length + 1} className="py-12 text-center text-muted-foreground">No {def.title.toLowerCase()} yet. Click “Add {def.singular}” to create one.</TableCell></TableRow>}
            {list.map((r) => (
              <TableRow key={r.id}>
                {def.fields.map((f) => (
                  <TableCell key={f.key} className="whitespace-nowrap">
                    {f.key === def.statusKey ? <Badge variant={tone(String(r[f.key]))}>{r[f.key]}</Badge> : f.money ? inr(Number(r[f.key] || 0)) : r[f.key]}
                  </TableCell>
                ))}
                <TableCell className="whitespace-nowrap text-right">
                  <Button size="icon" variant="ghost" onClick={() => setEdit(r)} aria-label="Edit"><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => { deleteRow(pid, def.table, r.id); toast.success("Deleted"); }} aria-label="Delete"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-display text-3xl tracking-wide">{rows.some((r) => r.id === edit?.id) ? "Edit" : "Add"} {def.singular}</DialogTitle></DialogHeader>
          {edit && (
            <form id="mod-form" className="grid gap-4 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); upsertRow(pid, def.table, edit); toast.success("Saved"); setEdit(null); }}>
              {def.fields.map((f) => (
                <div key={f.key} className="space-y-2">
                  <Label>{f.label}</Label>
                  {f.type === "select" ? (
                    <Select value={String(edit[f.key])} onValueChange={(v) => setEdit({ ...edit, [f.key]: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{f.options!.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent></Select>
                  ) : (
                    <Input required type={f.type ?? "text"} value={edit[f.key] ?? ""} onChange={(e) => setEdit({ ...edit, [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value })} />
                  )}
                </div>
              ))}
            </form>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setEdit(null)}>Cancel</Button><Button type="submit" form="mod-form">Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
