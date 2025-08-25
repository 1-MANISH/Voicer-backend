
import userService from '../services/user-service.js'
import UserDto from '../dtos/user-dto.js'
import cloudinaryService from '../services/cloudinary-service.js'

class ActivateController{

        async activateUser(req,res){
                const {name,avatar} = req.body
                if(!name || !avatar){
                        return res.status(400).json({message:'All fields are required'})
                }

                let result
                try {
                       result = await cloudinaryService.uploadImage(avatar)
                } catch (error) {
                        return res.status(500).json({
                                message:'Image upload failed',
                                success:false,
                                error
                        })
                }

                // update user

                let _id = req.user._id
                let user
               try {
                        user = await userService.findUser({_id})
                        if(!user){
                                res.status(404).json({message:'User not found',success:false})
                        }
                        user.activated = true
                        user.avatar = {
                                url:result.url,
                                publicId:result.publicId
                        }
                        user.name = name
                
                        await user.save()

                        res.status(200).json({
                                success:true,
                                message:'User activated successfully',
                                user:new UserDto(user),
                                auth:true
                        })

               } catch (error) {
                        res.status(500).json({
                                message:'User activation failed : DB error',
                                success:false
                        })
               }

               
        }
}

export default new ActivateController()