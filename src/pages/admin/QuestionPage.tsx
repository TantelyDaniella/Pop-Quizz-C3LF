import SectionNavigation from "../../components/admin/SectionNavigation";
import { adminSections } from "../../data/admin.section.data";
import { useState } from "react";

export default function QuestionsPage() {
  const [search, setSearch] = useState("");

  const handleAddQuestion = () => {
    console.log("Ajouter une question");
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
    </div>
  );
}