class UserDto{

        _id
        phone
        activated
        createdAt
        name
        avatar

        constructor(user){
                this._id = user._id
                this.phone = user.phone
                this.name = user.name
                this.avatar = user.avatar ? user.avatar.url : null 
                this.activated = user.activated
                this.createdAt = user.createdAt
              
        }
}

export default UserDto