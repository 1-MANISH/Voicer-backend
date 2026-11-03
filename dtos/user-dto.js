class UserDto{

        _id
        phone
        email
        activated
        createdAt
        name
        avatar

        constructor(user){
                this._id = user._id
                this.phone = user.phone || null
                this.email = user.email || null
                this.name = user.name
                this.avatar = user.avatar ? (typeof user.avatar === 'string' ? user.avatar : user.avatar.url) : null 
                this.activated = user.activated
                this.createdAt = user.createdAt
              
        }
}

export default UserDto