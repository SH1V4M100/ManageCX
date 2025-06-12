// src/components/UploadRosterCard.tsx

import { UploadCloud } from "lucide-react";

export default function UploadRosterCard() {
  return (
    <div className="bg-concentrix-navy text-white rounded-xl shadow-lg p-6 flex flex-col items-center gap-4 w-full sm:w-96">
      <div className="bg-concentrix-turquoise text-concentrix-navy rounded-full p-3">
        <UploadCloud className="h-6 w-6" />
      </div>
      <h3 className="text-xl font-semibold">Upload Roster</h3>
      <p className="text-sm text-concentrix-turquoiseLight text-center">
        Upload your team’s contact roster to automate verification and outreach.
      </p>
      <button className="mt-4 px-4 py-2 rounded-md bg-concentrix-turquoise text-concentrix-navy font-medium hover:bg-concentrix-turquoiseLight transition">
        Upload CSV
      </button>
    </div>
  );
}
