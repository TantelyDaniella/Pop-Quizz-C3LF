import { useState } from "react";
import { useLocation } from "react-router-dom";
import SectionNavigation from "../components/SectionNavigation";
import { adminSections } from "../data/admin.section.data";
import QuestionList from "../components/QuestionList";
import AddQuestionForm from "../components/AddQuestionForm";

export default function QuestionsPage() {
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const location = useLocation();

  const categoryMap: Record<string, string | undefined> = {
    "/admin/questions": undefined,
    "/admin/questions/general-knowledge": "culture_generale",
    "/admin/questions/linux-commands": "linux",
    "/admin/questions/shell-programming": "shell",
  };

  const currentCategory = categoryMap[location.pathname];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Questions</h1>
        <p className="mt-1 text-sm text-gray-500">Gérez les questions du quiz</p>
      </div>

      <SectionNavigation
        items={adminSections.questions}
        search={{ value: search, onChange: setSearch, placeholder: "Rechercher une question..." }}
        addAction={{ label: "Ajouter une question", onClick: () => setShowAddForm(true) }}
      />

      <QuestionList category={currentCategory} search={search} />

      {showAddForm && <AddQuestionForm onClose={() => setShowAddForm(false)} />}
    </div>
  );
}
