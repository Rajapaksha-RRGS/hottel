const RoomCard = ({ room, onSelect }) => {
  // Status අනුව වර්ණ තීරණය කිරීම
  const statusColors = {
    arrived: "border-red-500 bg-red-500/10 text-red-500",
    confirmed: "border-amber-500 bg-amber-500/10 text-amber-500",
    pending: "border-emerald-500 bg-emerald-500/10 text-emerald-500",
  };

  return (
    <div 
      className={`p-5 rounded-[24px] border-2 flex flex-col justify-between h-48 transition-all hover:-translate-y-1 cursor-pointer ${statusColors[room.status]}`}
      onClick={() => onSelect(room)}
    >
      <div className="flex justify-between items-center">
        <span className="text-2xl font-black">Room {room.table}</span>
        <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-lg bg-current/20">
          {room.status === 'arrived' ? 'Occupied' : room.status === 'confirmed' ? 'Booked' : 'Available'}
        </span>
      </div>
      
      <div>
        <h3 className="text-lg font-bold text-white">
          {room.guest === '-' ? 'Vacant Room' : room.guest}
        </h3>
        <p className="text-xs opacity-70">Max {room.guests} Persons</p>
      </div>

      <div className="flex gap-2 mt-2">
        <button className="flex-1 bg-white/10 hover:bg-white/20 py-2 rounded-xl text-[11px] font-semibold text-white">
          Folio
        </button>
        {room.status === 'arrived' && (
          <button className="flex-1 bg-white text-black py-2 rounded-xl text-[11px] font-bold">
            + Order
          </button>
        )}
      </div>
    </div>
  );
};