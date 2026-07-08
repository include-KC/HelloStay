function formatPrice(value) {
  if (value === null || value === undefined || value === "") {
    return "Not set";
  }

  return `₹${Number(value).toLocaleString("en-IN")}`;
}

function getStatusClassName(status) {
  if (!status) {
    return "status-badge";
  }

  return `status-badge status-${status.toLowerCase().replaceAll(" ", "-")}`;
}

function RoomTable({ rooms, onEdit, onDelete, deletingRoomId }) {
  return (
    <div className="room-table-wrapper">
      <table className="room-table">
        <thead>
          <tr>
            <th>Room</th>
            <th>Type</th>
            <th>Price / night</th>
            <th>Occupancy</th>
            <th>Status</th>
            <th>Facilities</th>
            <th className="table-actions-column">Actions</th>
          </tr>
        </thead>

        <tbody>
          {rooms.map((room) => (
            <tr key={room.id}>
              <td>
                <strong>Room {room.room_number}</strong>
              </td>

              <td>{room.room_type || "Not set"}</td>

              <td>{formatPrice(room.price_per_night)}</td>

              <td>
                {room.max_occupancy
                  ? `${room.max_occupancy} guest${
                      Number(room.max_occupancy) === 1 ? "" : "s"
                    }`
                  : "Not set"}
              </td>

              <td>
                <span className={getStatusClassName(room.room_status)}>
                  {room.room_status || "Unknown"}
                </span>
              </td>

              <td>{room.facilities || "No facilities listed"}</td>

              <td>
                <div className="table-actions">
                  <button
                    type="button"
                    className="button button-secondary button-small"
                    onClick={() => onEdit(room)}
                    disabled={deletingRoomId === room.id}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="button button-danger button-small"
                    onClick={() => onDelete(room)}
                    disabled={deletingRoomId === room.id}
                  >
                    {deletingRoomId === room.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RoomTable;