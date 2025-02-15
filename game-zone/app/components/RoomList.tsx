import React from 'react';

interface RoomListProps {
  rooms: { id: number; name: string }[];
  onSelectRoom: (roomId: number) => void;
}

const RoomList: React.FC<RoomListProps> = ({ rooms, onSelectRoom }) => {
console.log("rooms",rooms);
  return (
    <div className="room-list">
      <h2 className="text-2xl font-bold mb-4">Rooms</h2>
      <ul>
        {rooms.map((room) => (
          <li key={room.id} className="mb-2">
            <button
              className="w-full text-left p-2 bg-gray-200 rounded"
              onClick={() => onSelectRoom(room.id)}
            >
              {room.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoomList;
