import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Area, AreaChart } from "recharts";
import { Users, CreditCard, IndianRupee, AlertTriangle, GraduationCap, Wallet, CalendarDays, UserCog, Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { inr } from "@/lib/admin-config";
import type { Row } from "@/lib/data";
import { setState, updateAccount, useStore } from "@/lib/store";
import { AdminTitle, Kpi, useAdminContext } from "./AdminLayout";
import { downloadCsv } from "./ModuleTable";

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];
const tip = { contentStyle: { background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--foreground)" } };

function byMonth(rows: Row[]) {
  const m = new Map<string, number>();
  [...rows].sort((a, b) => String(a.date).localeCompare(String(b.date))).forEach((r) => {
    const k = new Date(String(r.date)).toLocaleString("en-IN", { month: "short", year: "2-digit" });
    m.set(k, (m.get(k) ?? 0) + Number(r.amount || 0));
  });
  return [...m].map(([month, revenue]) => ({ month, revenue }));
}
function groupSum(rows: Row[], key: string) {
  const m = new Map<string, number>();
  rows.forEach((r) => m.set(String(r[key]), (m.get(String(r[key])) ?? 0) + Number(r.amount || 0)));
  return [...m].map(([name, value]) => ({ name, value }));
}

function useData(kind: "gym" | "academy") {
  const { pid } = useAdminContext(kind);
  const data = useStore((s) => s.partnerData[pid]) ?? {};
  return { pid, data };
}

export function Dashboard({ kind }: { kind: "gym" | "academy" }) {
  const { data } = useData(kind);
  const rev = kind === "gym" ? data.sales ?? [] : data.payments ?? [];
  const total = rev.reduce((s, r) => s + Number(r.amount || 0), 0);
  const monthly = byMonth(rev);
  const kpis = kind === "gym"
    ? [
        { label: "Active members", value: String((data.members ?? []).filter((m) => m.status === "Active").length), icon: Users },
        { label: "Active subscriptions", value: String((data.subscriptions ?? []).filter((m) => m.status === "Active").length), icon: CreditCard },
        { label: "Total revenue", value: inr(total), icon: IndianRupee },
        { label: "Expiring soon", value: String((data.subscriptions ?? []).filter((m) => m.status === "Expiring").length), icon: AlertTriangle },
      ]
    : [
        { label: "Active students", value: String((data.students ?? []).filter((m) => m.status === "Active").length), icon: GraduationCap },
        { label: "Batches", value: String((data.batches ?? []).length), icon: CalendarDays },
        { label: "Fees collected", value: inr(total), icon: Wallet },
        { label: "Pending fees", value: String((data.fees ?? []).filter((m) => m.status !== "Paid").length), icon: AlertTriangle },
      ];
  const recent = kind === "gym" ? (data.members ?? []).slice(0, 5) : (data.students ?? []).slice(0, 5);
  const split = kind === "gym" ? groupSum(data.subscriptions ?? [], "plan") : (data.batches ?? []).map((b) => ({ name: String(b.name), value: (data.students ?? []).filter((s) => s.batch === b.name).length }));

  return (
    <div>
      <AdminTitle title="Dashboard" text="Your business at a glance." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{kpis.map((k) => <Kpi key={k.label} {...k} />)}</div>
      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 xl:col-span-2">
          <div className="mb-4 font-display text-2xl tracking-wide">Revenue trend</div>
          {monthly.length ? (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={monthly}><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.5} /><stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} /></linearGradient></defs><CartesianGrid stroke="var(--border)" vertical={false} /><XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} /><YAxis stroke="var(--muted-foreground)" fontSize={12} tickFormatter={(v) => `₹${v / 1000}k`} /><Tooltip {...tip} formatter={(v: number) => inr(v)} /><Area dataKey="revenue" stroke="var(--chart-1)" fill="url(#g)" strokeWidth={2} /></AreaChart>
            </ResponsiveContainer>
          ) : <Empty text="Revenue will appear here once you record sales." />}
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-4 font-display text-2xl tracking-wide">{kind === "gym" ? "Revenue by plan" : "Students by batch"}</div>
          {split.some((x) => x.value > 0) ? (
            <ResponsiveContainer width="100%" height={280}><PieChart><Pie data={split} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={3}>{split.map((_, i) => <Cell key={i} fill={COLORS[i % 5]} />)}</Pie><Tooltip {...tip} /></PieChart></ResponsiveContainer>
          ) : <Empty text="No data yet." />}
        </div>
      </div>
      <div className="mt-6 rounded-2xl border border-border bg-card p-5">
        <div className="mb-4 font-display text-2xl tracking-wide">Recent {kind === "gym" ? "members" : "admissions"}</div>
        {recent.length ? (
          <Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>{kind === "gym" ? "Plan" : "Batch"}</TableHead><TableHead>Joined</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>{recent.map((r) => <TableRow key={r.id}><TableCell>{r.name}</TableCell><TableCell>{kind === "gym" ? r.plan : r.batch}</TableCell><TableCell>{r.joined}</TableCell><TableCell>{r.status}</TableCell></TableRow>)}</TableBody></Table>
        ) : <Empty text="No records yet." />}
      </div>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <div className="grid h-40 place-items-center text-sm text-muted-foreground">{text}</div>;
}

export function Reports({ kind }: { kind: "gym" | "academy" }) {
  const { data } = useData(kind);
  const all = kind === "gym" ? data.sales ?? [] : data.payments ?? [];
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const rows = useMemo(() => all.filter((r) => (!from || String(r.date) >= from) && (!to || String(r.date) <= to)), [all, from, to]);
  const total = rows.reduce((s, r) => s + Number(r.amount || 0), 0);
  const expenses = kind === "gym" ? (data.expenses ?? []).filter((r) => (!from || String(r.date) >= from) && (!to || String(r.date) <= to)).reduce((s, r) => s + Number(r.amount || 0), 0) : (data.coaches ?? []).reduce((s, r) => s + Number(r.salary || 0), 0);
  const byMode = groupSum(rows, "mode");
  const byItem = groupSum(rows, kind === "gym" ? "item" : "note");
  const fields = kind === "gym" ? [{ key: "date", label: "Date" }, { key: "member", label: "Customer" }, { key: "item", label: "Item" }, { key: "mode", label: "Mode" }, { key: "amount", label: "Amount" }] : [{ key: "date", label: "Date" }, { key: "student", label: "Student" }, { key: "note", label: "For" }, { key: "mode", label: "Mode" }, { key: "amount", label: "Amount" }];
  return (
    <div>
      <AdminTitle title={kind === "gym" ? "Sales Reports" : "Revenue Reports"} text="Filter by date range and export.">
        <Button variant="outline" className="rounded-full" onClick={() => downloadCsv("revenue-report", rows, fields)}><Download className="mr-1 h-4 w-4" />Export CSV</Button>
      </AdminTitle>
      <div className="mb-6 flex flex-wrap items-end gap-4">
        <div className="space-y-1"><Label>From</Label><Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></div>
        <div className="space-y-1"><Label>To</Label><Input type="date" value={to} onChange={(e) => setTo(e.target.value)} /></div>
        {(from || to) && <Button variant="ghost" onClick={() => { setFrom(""); setTo(""); }}>Clear</Button>}
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Kpi label="Revenue" value={inr(total)} hint={`${rows.length} transactions`} icon={IndianRupee} />
        <Kpi label={kind === "gym" ? "Expenses" : "Monthly payroll"} value={inr(expenses)} icon={UserCog} />
        <Kpi label="Net" value={inr(total - expenses)} icon={Wallet} />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5"><div className="mb-4 font-display text-2xl tracking-wide">Monthly revenue</div>
          <ResponsiveContainer width="100%" height={260}><BarChart data={byMonth(rows)}><CartesianGrid stroke="var(--border)" vertical={false} /><XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} /><YAxis stroke="var(--muted-foreground)" fontSize={12} tickFormatter={(v) => `₹${v / 1000}k`} /><Tooltip {...tip} formatter={(v: number) => inr(v)} /><Bar dataKey="revenue" fill="var(--chart-1)" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5"><div className="mb-4 font-display text-2xl tracking-wide">By {kind === "gym" ? "item" : "purpose"} & payment mode</div>
          <div className="grid grid-cols-2 gap-2">
            <ResponsiveContainer width="100%" height={260}><PieChart><Pie data={byItem} dataKey="value" nameKey="name" outerRadius={90}>{byItem.map((_, i) => <Cell key={i} fill={COLORS[i % 5]} />)}</Pie><Tooltip {...tip} formatter={(v: number) => inr(v)} /></PieChart></ResponsiveContainer>
            <ResponsiveContainer width="100%" height={260}><PieChart><Pie data={byMode} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90}>{byMode.map((_, i) => <Cell key={i} fill={COLORS[(i + 2) % 5]} />)}</Pie><Tooltip {...tip} formatter={(v: number) => inr(v)} /></PieChart></ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SettingsPage({ kind }: { kind: "gym" | "academy" }) {
  const { me, partner } = useAdminContext(kind);
  const [f, setF] = useState(() => ({ name: partner?.name ?? "", city: partner?.city ?? "", address: partner?.address ?? "", phone: partner?.phone ?? "", about: partner?.about ?? "", price: String(partner ? ("priceFrom" in partner ? partner.priceFrom : partner.feeFrom) : "") }));
  if (!partner || !me) return null;
  const save = () => {
    setState((s) => kind === "gym"
      ? { gyms: s.gyms.map((g) => (g.id === partner.id ? { ...g, ...f, priceFrom: Number(f.price) } : g)) }
      : { academies: s.academies.map((a) => (a.id === partner.id ? { ...a, ...f, feeFrom: Number(f.price) } : a)) });
    updateAccount(me.id, { name: f.name, city: f.city });
    toast.success("Profile updated");
  };
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });
  return (
    <div className="max-w-3xl">
      <AdminTitle title="Profile & Settings" text="This information appears on your public listing." />
      <form className="space-y-4 rounded-2xl border border-border bg-card p-6" onSubmit={(e) => { e.preventDefault(); save(); }}>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2"><Label>Name</Label><Input value={f.name} onChange={set("name")} /></div>
          <div className="space-y-2"><Label>City</Label><Input value={f.city} onChange={set("city")} /></div>
          <div className="space-y-2"><Label>Phone</Label><Input value={f.phone} onChange={set("phone")} /></div>
          <div className="space-y-2"><Label>{kind === "gym" ? "Price from (₹/mo)" : "Fee from (₹/mo)"}</Label><Input type="number" value={f.price} onChange={set("price")} /></div>
        </div>
        <div className="space-y-2"><Label>Address</Label><Input value={f.address} onChange={set("address")} /></div>
        <div className="space-y-2"><Label>About</Label><Textarea rows={4} value={f.about} onChange={set("about")} /></div>
        <div className="space-y-2"><Label>Login email</Label><Input disabled value={me.email} /></div>
        <Button type="submit" className="rounded-full">Save changes</Button>
      </form>
    </div>
  );
}
