import { SectorLanding, sectorMetadata } from "../_components/sector-landing";

export const metadata = sectorMetadata("kuafor");

export default function KuaforPage() {
  return <SectorLanding sector="kuafor" />;
}
