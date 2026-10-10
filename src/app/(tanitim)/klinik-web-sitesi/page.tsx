import { SectorLanding, sectorMetadata } from "../_components/sector-landing";

export const metadata = sectorMetadata("klinik");

export default function KlinikPage() {
  return <SectorLanding sector="klinik" />;
}
