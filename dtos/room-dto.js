class RoomDto{

        _id
      roomTopic
      roomType
      ownerId
      speakers
      hasPasscode
      passcode
      createdAt

        constructor(room){
                this._id = room._id
                this.roomTopic = room.roomTopic
                this.roomType = room.roomType
                this.ownerId = room.ownerId
                this.speakers = room.speakers
                this.hasPasscode = !!room.passcode
                this.passcode = room.passcode || null
                this.createdAt = room.createdAt
              
        }
}

export default RoomDto