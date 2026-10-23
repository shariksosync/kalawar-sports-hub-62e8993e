import { useState } from "react";
import { ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { addPost } from "@/lib/store";

function readFile(f: File): Promise<string> {
  // Images are stored as data URLs so they survive reloads; videos use a session preview URL.
  if (f.type.startsWith("video")) return Promise.resolve(URL.createObjectURL(f));
  return new Promise((res) => { const r = new FileReader(); r.onload = () => res(String(r.result)); r.readAsDataURL(f); });
}

export function UploadDialog({ open, onOpenChange, meId }: { open: boolean; onOpenChange: (o: boolean) => void; meId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [caption, setCaption] = useState("");
  const reset = () => { setFile(null); setPreview(""); setCaption(""); };
  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) reset(); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle className="font-display text-3xl tracking-wide">New post</DialogTitle></DialogHeader>
        <label className="grid aspect-video cursor-pointer place-items-center overflow-hidden rounded-xl border-2 border-dashed border-border hover:border-primary/60">
          {preview ? (file?.type.startsWith("video") ? <video src={preview} className="h-full w-full object-cover" controls /> : <img src={preview} alt="" className="h-full w-full object-cover" />) : (
            <div className="text-center text-sm text-muted-foreground"><ImagePlus className="mx-auto mb-2 h-8 w-8 text-primary" />Choose a photo or video</div>
          )}
          <input type="file" accept="image/*,video/*" className="hidden" onChange={async (e) => { const f = e.target.files?.[0]; if (!f) return; if (f.size > 4_000_000 && f.type.startsWith("image")) return toast.error("Please choose an image under 4 MB."); setFile(f); setPreview(await readFile(f)); }} />
        </label>
        <Textarea placeholder="Write a caption…" value={caption} onChange={(e) => setCaption(e.target.value)} />
        <Button disabled={!file} className="rounded-full" onClick={() => {
          if (!file) return;
          addPost({ authorId: meId, kind: file.type.startsWith("video") ? "video" : "image", src: preview, caption });
          toast.success("Posted!"); reset(); onOpenChange(false);
        }}>Share</Button>
      </DialogContent>
    </Dialog>
  );
}
