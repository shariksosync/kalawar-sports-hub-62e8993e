import { useEffect, useState } from "react";
import { ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { addPost } from "@/lib/store";
import { saveMedia } from "@/lib/media-storage";

export function UploadDialog({ open, onOpenChange, meId }: { open: boolean; onOpenChange: (o: boolean) => void; meId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [caption, setCaption] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (!file) { setPreview(""); return; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  const reset = () => { setFile(null); setPreview(""); setCaption(""); };
  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) reset(); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle className="font-display text-3xl tracking-wide">New post</DialogTitle></DialogHeader>
        <label className="grid aspect-video cursor-pointer place-items-center overflow-hidden rounded-xl border-2 border-dashed border-border hover:border-primary/60">
          {preview ? (file?.type.startsWith("video") ? <video src={preview} className="h-full w-full object-cover" controls /> : <img src={preview} alt="" className="h-full w-full object-cover" />) : (
            <div className="text-center text-sm text-muted-foreground"><ImagePlus className="mx-auto mb-2 h-8 w-8 text-primary" />Choose a photo or video</div>
          )}
          <input type="file" accept="image/*,video/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (!f) return; if (!f.type.startsWith("image/") && !f.type.startsWith("video/")) return toast.error("Choose a photo or video."); setFile(f); }} />
        </label>
        <Textarea placeholder="Write a caption…" value={caption} onChange={(e) => setCaption(e.target.value)} />
        <Button disabled={!file || saving} className="rounded-full" onClick={async () => {
          if (!file) return;
          setSaving(true);
          try {
            const src = await saveMedia(file);
            const saved = addPost({ authorId: meId, kind: file.type.startsWith("video") ? "video" : "image", src, caption });
            if (!saved) return;
            toast.success("Posted!"); reset(); onOpenChange(false);
          } catch { toast.error("This device couldn't save the upload. Free some storage and try again."); }
          finally { setSaving(false); }
        }}>{saving ? "Saving…" : "Share"}</Button>
      </DialogContent>
    </Dialog>
  );
}
