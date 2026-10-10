import "server-only";
import { connection } from "next/server";

// Sayfada "şu an"a göre hesap yapmak için (abonelik durumu, istatistik aralığı). connection() ile isteğe
// ertelenir; Cache Components bu sayede değeri derleme sırasında sabitlemeye çalışmaz.
export async function requestNow() {
  await connection();
  return new Date();
}
