import "server-only";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { media } from "@/db/schema";
import { publicUrl, putObject } from "@/lib/storage";
import { collectImageIds, mapImages, type Fields, type ImageValue } from "@/templates/engine/fields";

export const maxUploadBytes = 15 * 1024 * 1024;
const acceptedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

export class UploadError extends Error {}

// Telefondan gelen büyük fotoğrafları döndürür (EXIF), küçültür ve WebP'ye çevirir.
// İki boyut üretilir: sayfa için 1600px, kartlar ve galeri için 640px.
export async function processUpload(file: File, siteId: string, userId: string): Promise<ImageValue> {
  if (!acceptedTypes.has(file.type)) throw new UploadError("Sadece JPG, PNG, WebP veya AVIF fotoğraf yükleyebilirsiniz.");
  if (file.size > maxUploadBytes) throw new UploadError("Fotoğraf en fazla 15 MB olabilir.");

  const input = Buffer.from(await file.arrayBuffer());
  let result: { large: Buffer; small: Buffer; width: number; height: number };
  try {
    const base = sharp(input, { failOn: "error" }).rotate();
    const fit = { fit: "inside", withoutEnlargement: true } as const;
    const { data, info } = await base.clone().resize({ width: 1600, height: 1600, ...fit }).webp({ quality: 80 }).toBuffer({ resolveWithObject: true });
    const small = await base.clone().resize({ width: 640, height: 640, ...fit }).webp({ quality: 75 }).toBuffer();
    result = { large: data, small, width: info.width, height: info.height };
  } catch {
    throw new UploadError("Fotoğraf okunamadı. Farklı bir dosya deneyin.");
  }

  const key = `sites/${siteId}/${randomUUID()}`;
  await putObject(`${key}-1600.webp`, result.large);
  await putObject(`${key}-640.webp`, result.small);

  const [row] = await db
    .insert(media)
    .values({ siteId, key, width: result.width, height: result.height, bytes: result.large.length, uploadedBy: userId })
    .returning({ id: media.id });

  return toImageValue({ id: row.id, key, width: result.width, height: result.height });
}

export function toImageValue(row: { id: string; key: string; width: number; height: number }): ImageValue {
  return {
    id: row.id,
    src: publicUrl(`${row.key}-1600.webp`),
    srcSmall: publicUrl(`${row.key}-640.webp`),
    width: row.width,
    height: row.height,
  };
}

// İçerikteki fotoğrafları veritabanından doğrular: bu siteye ait olmayanları çıkarır, adresleri sunucuda yeniden üretir.
// Böylece istemciden gelen src değerlerine asla güvenilmez.
export async function resolveSiteImages(siteId: string, fields: Fields, content: Record<string, unknown>) {
  const ids = collectImageIds(fields, content);
  if (ids.length === 0) return content;

  const rows = await db
    .select({ id: media.id, key: media.key, width: media.width, height: media.height })
    .from(media)
    .where(and(eq(media.siteId, siteId), inArray(media.id, ids)));
  const byId = new Map(rows.map((row) => [row.id, toImageValue(row)]));

  return mapImages(fields, content, (image) => byId.get(image.id) ?? null);
}
