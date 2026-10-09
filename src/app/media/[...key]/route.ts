import { getObject } from "@/lib/storage";

// Yüklenen görselleri sunar. Dosya adları içerik değişince değiştiği için sonsuza kadar önbelleğe alınabilir.
export async function GET(_request: Request, { params }: RouteContext<"/media/[...key]">) {
  const { key } = await params;
  const body = await getObject(key.join("/"));
  if (!body) return new Response("Bulunamadı", { status: 404 });

  return new Response(new Uint8Array(body), {
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
