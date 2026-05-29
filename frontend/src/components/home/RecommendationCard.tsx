import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

// 1. Define the props for the component
interface RecommendationCardProps {
  hasData?: boolean;
}

export default function RecommendationCard({ hasData = false }: RecommendationCardProps) {
  if (!hasData) return null;

  return (
    <section className="recommendation-card flex flex-row bg-blue-600/20 rounded-2xl gap-3 ring-1 ring-blue-600/40 shadow-md">
      <div className="rounded-tl-2xl rounded-bl-2xl p-1 bg-blue-600/30 flex items-center">
        <Icon
          icon={'material-symbols:energy-savings-leaf-rounded'}
          className="shrink-0 text-2xl text-blue-600 "
        />
      </div>

      <div className="flex flex-col items-start gap-2 mt-3 mb-3">
        <h2 className="font-bold text-blue-600 text-base">Rekomendasi A.L.I.C.E</h2>
        <p className="text-blue-600 text-base">
          A.L.I.C.E telah selesai memproses data pengeluaran dan pemasukan Anda. Temukan potensi
          penghematan serta distribusi anggaran yang paling optimal untuk kondisi keuangan Anda saat
          ini..
        </p>
        <Link
          to={'/alice'}
          className="bg-blue-600 text-bg-main p-3 py-2 rounded-xl hover:scale-105 active:scale-110 active:bg-text-main"
        >
          Lihat Rekomendasi
        </Link>
      </div>
    </section>
  );
}
