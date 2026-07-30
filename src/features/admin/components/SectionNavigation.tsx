import { NavLink, useLocation } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import type { NavigationItem } from "../data/admin.section.data";

interface Props {
  items: NavigationItem[];
  search?: { placeholder?: string; value: string; onChange: (value: string) => void };
  addAction?: { label: string; onClick: () => void };
}

export default function SectionNavigation({ items, search, addAction }: Props) {
  const location = useLocation();

  return (
    <div className="flex items-center justify-between border-b border-gray-200">
      <nav className="flex items-center gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin/quiz"}
              className={() =>
                `flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  active
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:shadow-sm hover:rounded-lg hover:bg-blue-600 hover:text-gray-900"
                }`
              }
            >
              <Icon size={17} strokeWidth={2} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {(search || addAction) && (
        <div className="flex items-center justify-between gap-4">
          {search && (
            <div className="relative w-full max-w-md">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search.value}
                onChange={(e) => search.onChange(e.target.value)}
                placeholder={search.placeholder ?? "Rechercher..."}
                className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          )}
          {addAction && (
            <button
              type="button"
              onClick={addAction.onClick}
              className="flex shrink-0 items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              <Plus size={17} />
              {addAction.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
