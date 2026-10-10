import { SectorLanding, sectorMetadata } from "../_components/sector-landing";

export const metadata = sectorMetadata("restoran");

export default function RestoranPage() {
  return <SectorLanding sector="restoran" />;
}
