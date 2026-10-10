// Yasal metinler tanıtım sitesinin çerçevesi içinde, okunaklı dar bir sütunda gösterilir
export default function LegalLayout({ children }: LayoutProps<"/">) {
  return <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">{children}</div>;
}
