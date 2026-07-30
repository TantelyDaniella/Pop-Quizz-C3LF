import SectionNavigation from "../components/SectionNavigation";
import { adminSections } from "../data/admin.section.data";

export default function ResultPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Résultats</h1>
        <p className="text-sm text-gray-500">Gérer les résultats du Quizz</p>
      </div>
      <SectionNavigation items={adminSections.results} />
    </div>
  );
}
