import { useState } from "react";
import { useLocation } from "react-router-dom";
import SectionNavigation from "../components/SectionNavigation";
import { adminSections } from "../data/admin.section.data";
import AddQuizForm from "../components/AddQuizForm";
import QuizList from "../components/QuizList";

export default function QuizzPage() {
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const location = useLocation();

  const categoryMap: Record<string, string | undefined> = {
    "/admin/quiz": undefined,
    "/admin/quiz/waiting": "waiting",
    "/admin/quiz/running": "running",
    "/admin/quiz/finished": "finished",
  };

  const currentCategory = categoryMap[location.pathname];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Quizz</h1>
        <p className="text-sm text-gray-500">Gérer le Quizz</p>
      </div>

      <SectionNavigation
        items={adminSections.quiz}
        search={{ value: search, onChange: setSearch, placeholder: "Rechercher une question..." }}
        addAction={{ label: "Ajouter un quizz", onClick: () => setShowAddForm(true) }}
      />

      {showAddForm && <AddQuizForm onClose={() => setShowAddForm(false)} />}
      <QuizList category={currentCategory} search={search} />
    </div>
  );
}
