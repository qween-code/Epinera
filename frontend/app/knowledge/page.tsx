import { TopBar } from "@/components/topbar";
import { KbSearch } from "@/components/kb-search";

export default function KnowledgePage() {
  return (
    <>
      <TopBar
        title="Know-How"
        subtitle="Geçmiş vakalar, kök nedenler ve çözüm adımları (semantik arama)"
      />
      <div className="p-6 max-w-4xl">
        <KbSearch />
      </div>
    </>
  );
}
