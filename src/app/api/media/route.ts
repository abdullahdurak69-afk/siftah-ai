import { findEditableSite, getCurrentUser } from "@/lib/dal";
import { processUpload, UploadError } from "@/lib/images";

// Panelden fotoğraf yükleme. Form alanları: siteId, file
export async function POST(request: Request) {
  const form = await request.formData().catch(() => null);
  const siteId = form?.get("siteId");
  const file = form?.get("file");

  if (typeof siteId !== "string" || !(file instanceof File)) {
    return Response.json({ error: "Eksik bilgi." }, { status: 400 });
  }

  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "Oturum açmanız gerekiyor." }, { status: 401 });

  const site = await findEditableSite(siteId);
  if (!site) return Response.json({ error: "Bu siteye fotoğraf yükleme yetkiniz yok." }, { status: 403 });

  try {
    const image = await processUpload(file, site.id, user.id);
    return Response.json(image);
  } catch (error) {
    if (error instanceof UploadError) return Response.json({ error: error.message }, { status: 400 });
    throw error;
  }
}
