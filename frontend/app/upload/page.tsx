import { TopBar } from "@/components/topbar";
import { UploadZone } from "@/components/upload-zone";

export default function UploadPage() {
  return (
    <>
      <TopBar
        title="Dosya Analizi"
        subtitle="Log, txt veya hata ekran görüntüsü yükleyin — sistem kök neden ve aksiyon önerir"
      />
      <div className="p-6 max-w-4xl">
        <UploadZone />
      </div>
    </>
  );
}
