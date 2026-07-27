import SectionNavigation from "../../components/admin/SectionNavigation";
import { adminSections } from "../../data/admin.section.data";

export default function QuizzPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Quizz</h1>
        <p className="text-sm text-gray-500">
          Gérer le Quizz
        </p>
      </div>

      <SectionNavigation items={adminSections.quiz} />

      {/* Contenu de la page */}
    </div>
  );
}