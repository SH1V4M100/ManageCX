// src/components/ViewRosterCard.tsx

import { Users } from "lucide-react";

export default function ViewRosterCard() {
  return (
    <div className="bg-concentrix-navy text-white rounded-xl shadow-lg p-6 flex flex-col items-center gap-4 w-full sm:w-96">
      <div className="bg-concentrix-turquoise text-concentrix-navy rounded-full p-3">
        <Users className="h-6 w-6" />
      </div>
      <h3 className="text-xl font-semibold">View Roster</h3>
      <p className="text-sm text-concentrix-turquoiseLight text-center">
        View your uploaded roster, track outreach status, and manage contacts.
      </p>
      <button className="mt-4 px-4 py-2 rounded-md bg-concentrix-turquoise text-concentrix-navy font-medium hover:bg-concentrix-turquoiseLight transition">
        View Roster
      </button>
    </div>
  );
}
