import {v2 as cloudinary} from 'cloudinary'
class CloudinaryService{
        async uploadImage(fileBuffer){
                try {
                        const result = await cloudinary.uploader.upload(
                                fileBuffer,
                                {
                                        folder:"Voicer Avatar",
                                        resource_type:"image"
                                }
                        )
                        return {
                                publicId:result.public_id,
                                url:result.secure_url
                        }
                } catch (error) {
                        console.log(error)
                        return error
                }
        }
}

export default new CloudinaryService()