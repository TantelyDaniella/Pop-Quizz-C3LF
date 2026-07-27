import SectionNavigation from "../../components/admin/SectionNavigation";
import { adminSections } from "../../data/admin.section.data";
import { useState } from "react";
export default function PlayerPage() {
    const [search, setSearch] = useState("");
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Joueurs</h1>
        <p className="text-sm text-gray-500">
          Gérer les Joueurs        </p>
      </div>

      <SectionNavigation 
        items={adminSections.players} 

        search={{
        value: search,
        onChange: setSearch,
        placeholder: "Rechercher un joueur...",
        }}

        addAction={{
        label: "Ajouter un joueur",
        onClick: () => {
        // ouvrir le formulaire
        },
        }}    
            />

      {/* Contenu de la page */}
    </div>
  );
}