/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Reservation } from "../../../types";

interface ReservationSectionProps {
  reservations: Reservation[];
}

export const ReservationSection: React.FC<ReservationSectionProps> = ({ reservations }) => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden p-6">
      <h1 className="text-2xl font-bold mb-6">Reservations</h1>
      <div className="space-y-4">
        {reservations.map((reservation) => (
          <div key={reservation.id} className="border border-[#2e2e3a] rounded-lg p-4 bg-[#1a1a1f]">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-lg">{reservation.guest}</h3>
                <p className="text-sm text-[#6a6a7a]">Table {reservation.table}</p>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-lg ${
                reservation.status === "confirmed" ? "bg-[#1d9e7522] text-[#1d9e75]" :
                reservation.status === "arrived" ? "bg-[#4ecdc422] text-[#4ecdc4]" :
                "bg-[#ff6b6b22] text-[#ff6b6b]"
              }`}>
                {reservation.status}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-[#6a6a7a]">Time</p>
                <p className="font-semibold">{reservation.time}</p>
              </div>
              <div>
                <p className="text-[#6a6a7a]">Guests</p>
                <p className="font-semibold">{reservation.guests} people</p>
              </div>
              <div>
                <p className="text-[#6a6a7a]">Date</p>
                <p className="font-semibold">{reservation.bookDate}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
