import SectionNavigation from "../../components/admin/SectionNavigation";
import { adminSections } from "../../data/admin.section.data";
import PlayerList from "../../components/admin/PlayerList";
import { useState } from "react";
import { useLocation } from "react-router-dom";
export default function PlayerPage() {
    const [search, setSearch] = useState("");
    const location = useLocation();

    const categoryMap: Record<string, string | undefined> = {
      "/admin/player": undefined,

      "/admin/player/active":
        "active",

      "/admin/player/inactive":
        "inactive",
    };
    

   const currentCategory = categoryMap[location.pathname];
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

      <PlayerList 
        category={currentCategory}
        search={search}
      />
      {/* Contenu de la page */}
    </div>
  );
}