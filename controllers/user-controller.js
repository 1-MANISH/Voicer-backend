import userService from '../services/user-service.js'
import UserDto from '../dtos/user-dto.js'
import cloudinaryService from '../services/cloudinary-service.js'
import { Room } from '../models/room-model.js'

class UserController {
        async getProfile(req, res) {
                try {
                        const user = await userService.findUser({ _id: req.user._id })
                        if (!user) {
                                return res.status(404).json({ success: false, message: 'User not found' })
                        }
                        const roomsCount = await Room.countDocuments({ ownerId: req.user._id })
                        return res.status(200).json({
                                success: true,
                                user: new UserDto(user),
                                roomsCount
                        })
                } catch (error) {
                        return res.status(500).json({
                                success: false,
                                message: 'Failed to fetch profile',
                                error
                        })
                }
        }

        async updateProfile(req, res) {
                const { name, avatar } = req.body

                if (!name) {
                        return res.status(400).json({ success: false, message: 'Name is required' })
                }

                try {
                        const user = await userService.findUser({ _id: req.user._id })
                        if (!user) {
                                return res.status(404).json({ success: false, message: 'User not found' })
                        }

                        user.name = name

                        // If new image provided in base64 format
                        if (avatar && avatar.startsWith('data:image')) {
                                const uploadResult = await cloudinaryService.uploadImage(avatar)
                                if (uploadResult && uploadResult.url) {
                                        user.avatar = {
                                                url: uploadResult.url,
                                                publicId: uploadResult.publicId
                                        }
                                }
                        }

                        await user.save()

                        return res.status(200).json({
                                success: true,
                                message: 'Profile updated successfully',
                                user: new UserDto(user)
                        })
                } catch (error) {
                        return res.status(500).json({
                                success: false,
                                message: 'Failed to update profile',
                                error
                        })
                }
        }
}

export default new UserController()
