import SectionNavigation from "../../components/admin/SectionNavigation";
import { adminSections } from "../../data/admin.section.data";
import { useState } from "react";
import QuestionList from "../../components/admin/QuestionList";
import AddQuestionForm from "../../components/admin/AddQuestionForm";
import { useLocation } from "react-router-dom";

export default function QuestionsPage() {
  const [search, setSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const location = useLocation();

  const categoryMap: Record<string, string | undefined> = {
    "/admin/questions": undefined,

    "/admin/questions/general-knowledge":
      "culture_generale",

    "/admin/questions/linux-commands":
      "linux",

    "/admin/questions/shell-programming":
      "shell",
  };

  const currentCategory = categoryMap[location.pathname];
  const handleAddQuestion = () => {
      setShowAddForm(true);
    };

  const handleCloseAddForm = () => {
      setShowAddForm(false);
    };


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          Questions
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Gérez les questions du quiz
        </p>
      </div>

      <SectionNavigation
        items={adminSections.questions}
        search={{
          value: search,
          onChange: setSearch,
          placeholder: "Rechercher une question...",
        }}
        addAction={{
          label: "Ajouter une question",
          onClick: handleAddQuestion,
        }}
      />

      {/* Liste des questions */}
       <QuestionList 
          category={currentCategory}
          search={search}
       />
      {/* Formulaire d'ajout */}
      {showAddForm && (
        <AddQuestionForm
          onClose={handleCloseAddForm}
        />
      )}
    </div>
  );
}