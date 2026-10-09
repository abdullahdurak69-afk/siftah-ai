import "server-only";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

// Dosya depolama katmanı. Şimdilik yerel disk; canlıya geçerken (Cloudflare R2 / S3) sadece bu dosya değişir.
// Dosyalar /media/<key> adresinden sunulur; bu adres her host'ta (subdomain, custom domain) çalışır.

const localDir = path.join(process.cwd(), ".media");

const keyPattern = /^[a-z0-9][a-z0-9/_-]*\.webp$/;

function resolveKey(key: string) {
  if (!keyPattern.test(key) || key.includes("..")) return null;
  const full = path.join(localDir, key);
  // Klasör dışına çıkan yolları reddet
  return full.startsWith(localDir + path.sep) ? full : null;
}

export async function putObject(key: string, body: Buffer) {
  const full = resolveKey(key);
  if (!full) throw new Error(`Geçersiz dosya anahtarı: ${key}`);
  await mkdir(path.dirname(full), { recursive: true });
  await writeFile(full, body);
}

export async function getObject(key: string): Promise<Buffer | null> {
  const full = resolveKey(key);
  if (!full) return null;
  try {
    // Yerel geliştirme deposu; derleme sırasında izlenmesine gerek yok
    return await readFile(/*turbopackIgnore: true*/ full);
  } catch {
    return null;
  }
}

export function publicUrl(key: string) {
  return `/media/${key}`;
}
