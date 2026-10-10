import { SectorLanding, sectorMetadata } from "../_components/sector-landing";

export const metadata = sectorMetadata("usta");

export default function UstaPage() {
  return <SectorLanding sector="usta" />;
}
