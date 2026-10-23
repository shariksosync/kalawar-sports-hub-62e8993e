import type { Post } from "@/lib/data";
import { useMediaSource } from "@/lib/media-storage";

export function PostThumbnail({ post }: { post: Post }) {
  const source = useMediaSource(post.kind === "video" ? post.poster || post.src : post.src);
  return post.kind === "video" && !post.poster
    ? <video src={source || undefined} muted playsInline preload="metadata" className="h-full w-full bg-muted object-cover" />
    : <img src={source || undefined} alt={post.caption} loading="lazy" className="h-full w-full bg-muted object-cover transition-transform group-hover:scale-105" />;
}