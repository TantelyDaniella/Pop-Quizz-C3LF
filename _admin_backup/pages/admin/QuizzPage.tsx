
import SectionNavigation from "../../components/admin/SectionNavigation";
import { adminSections } from "../../data/admin.section.data";
import { useQuiz } from "../../hooks/admin/useQuiz";
import { useState } from "react";
import AddQuizForm from "../../components/admin/AddQuizForm";
import QuizList from "../../components/admin/QuizList";
import { useLocation } from "react-router-dom";
export default function QuizzPage() {
  const {quizzes} = useQuiz();
  const [search, setSearch] = useState("");
   const [showAddForm, setShowAddForm] = useState(false);
   const location = useLocation();

    const categoryMap: Record<string, string | undefined> = {
      "/admin/quiz": undefined,

      "/admin/quiz/waiting":
        "waiting",

      "/admin/quiz/running":
        "running",
      "/admin/quiz/finished":
        "finished",
    };
    

   const currentCategory = categoryMap[location.pathname];

  const handleAddQuestion = () => {
      setShowAddForm(true);
    };

  const handleCloseAddForm = () => {
      setShowAddForm(false);
    };
  console.log("quizzes are: ", quizzes)
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Quizz</h1>
        <p className="text-sm text-gray-500">
          Gérer le Quizz
        </p>
      </div>

      <SectionNavigation
       items={adminSections.quiz} 
        search={{
          value: search,
          onChange: setSearch,
          placeholder: "Rechercher une question...",
        }}
        addAction={{
          label: "Ajouter un quizz",
          onClick: handleAddQuestion,
        }}
       
       />

      {/* Formulaire d'ajout */}
      {showAddForm && (
        <AddQuizForm
          onClose={handleCloseAddForm}
        />
      )}
      <QuizList 
        category={currentCategory}
        search={search}
      />
    </div>
  );
}