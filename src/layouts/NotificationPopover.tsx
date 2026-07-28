import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/common/EmptyState";
import { Bell, BellDot, Inbox } from "lucide-react";

const mockNotifications = [
  { id: 1, message: "Linux Battle #1 demarre bientot", read: false },
];

export default function NotificationPopover() {
  const unreadCount = mockNotifications.filter((n) => !n.read).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          {unreadCount > 0 ? (
            <>
              <BellDot className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-red-500" />
            </>
          ) : (
            <Bell className="w-5 h-5" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 p-2">
        <h3 className="text-sm font-medium px-2 py-1">Notifications</h3>
        {mockNotifications.length === 0 ? (
          <EmptyState icon={Inbox} text="Aucune notification" height="h-20" iconSize={20} />
        ) : (
          <div className="flex flex-col gap-1 mt-1">
            {mockNotifications.map((n) => (
              <div
                key={n.id}
                className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-(--primary)/5 cursor-pointer"
              >
                <div
                  className={`w-2 h-2 rounded-full shrink-0 ${n.read ? "bg-transparent" : "bg-(--primary)"}`}
                />
                <span className="text-xs">{n.message}</span>
              </div>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
