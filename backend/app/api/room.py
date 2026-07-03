from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.room import Room
from app.schemas.room import RoomCreate, RoomResponse, RoomUpdate

router = APIRouter(
    tags = ["Rooms"]
)

@router.post("/rooms", response_model=RoomResponse)
def create_room(
    room: RoomCreate,
    db: Session = Depends(get_db)
):
    existing_room = db.query(Room)\
        .filter(Room.room_number == room.room_number)\
        .first()

    if existing_room is not None:
        raise HTTPException(
            status_code=400,
            detail="Room number already exists."
        )

    new_room = Room(
        room_number=room.room_number,
        room_type=room.room_type,
        price_per_night=room.price_per_night,
        max_occupancy=room.max_occupancy,
        facilities=room.facilities,
        room_status=room.room_status
    )

    db.add(new_room)
    db.commit()
    db.refresh(new_room)

    return new_room

@router.get("/rooms", response_model=list[RoomResponse])
def get_room(db: Session = Depends(get_db)):
    rooms = db.query(Room).all()
    return rooms

@router.get("/rooms/{room_id}", response_model = RoomResponse)
def Get_Room_by_Id(room_id:int, db: Session = Depends(get_db)):
    rooms = db.query(Room)\
    .filter(Room.id == room_id)\
    .first()

    if rooms is None:
        raise HTTPException(
            status_code = 404,
            detail = "Room Not Found."
        )
    return rooms

@router.put("/rooms/{room_id}", response_model=RoomResponse)
def update_room_info(
    room_id: int,
    room: RoomUpdate,
    db: Session = Depends(get_db)
):
    existing_room = db.query(Room)\
        .filter(Room.id == room_id)\
        .first()

    if existing_room is None:
        raise HTTPException(
            status_code=404,
            detail="Room Not Found."
        )
    update_data = room.model_dump(exclude_unset = True)
    
    for key, value in update_data.items():
        setattr(existing_room, key, value)
    
    
    db.commit()
    db.refresh(existing_room)

    return existing_room

@router.delete("/rooms/{room_id}")
def Delete_room_info(
    room_id: int,
    db: Session = Depends(get_db)
):
    fetch_room = db.query(Room)\
    .filter(Room.id == room_id)\
    .first()

    if fetch_room is None:
        raise HTTPException(
            status_code = 404,
            detail = "Room Not Found."
        )
    

    db.delete(fetch_room)
    
    db.commit()

    return{
        "message":"Room has been deleted successfully."
    }