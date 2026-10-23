import { Label } from "@/components/ui/label";

export function Steps({ step, labels }: { step: number; labels: string[] }) {
  return (
    <div className="mb-8 flex gap-2">
      {labels.map((l, i) => (
        <div key={l} className="flex-1"><div className={`h-1 rounded-full ${i <= step ? "bg-primary" : "bg-muted"}`} /><div className={`mt-2 text-xs ${i === step ? "text-primary" : "text-muted-foreground"}`}>{l}</div></div>
      ))}
    </div>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-2"><Label>{label}</Label>{children}</div>;
}

