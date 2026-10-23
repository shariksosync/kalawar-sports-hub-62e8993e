import { useEffect, useState } from "react";

const PREFIX = "media-local:";

function openMedia(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("kalawar-media", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("files");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveMedia(file: Blob): Promise<string> {
  const db = await openMedia();
  const key = crypto.randomUUID();
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction("files", "readwrite");
      tx.objectStore("files").put(file, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
    return PREFIX + key;
  } finally { db.close(); }
}

export function useMediaSource(source: string | undefined) {
  const [resolved, setResolved] = useState<{ source: string; url: string } | null>(null);
  useEffect(() => {
    if (!source?.startsWith(PREFIX)) return;
    let active = true;
    let objectUrl: string | undefined;
    void openMedia().then((db) => new Promise<Blob | undefined>((resolve, reject) => {
      const tx = db.transaction("files", "readonly");
      const request = tx.objectStore("files").get(source.slice(PREFIX.length));
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      tx.oncomplete = () => db.close();
    })).then((blob) => {
      if (!active) return;
      objectUrl = blob ? URL.createObjectURL(blob) : undefined;
      setResolved({ source, url: objectUrl ?? "" });
    }).catch(() => { if (active) setResolved({ source, url: "" }); });
    return () => { active = false; if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [source]);
  if (!source?.startsWith(PREFIX)) return source ?? "";
  return resolved?.source === source ? resolved.url : "";
}