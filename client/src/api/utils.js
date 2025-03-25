// Upload image and return image url

import axios from "axios"

export const imageUpload = async ImageData => {

    const formData = new FormData()
    formData.append('image', ImageData)


    const { data } = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
        formData
    )
    
    return data.data.display_url
   
}




export const saveUser  = async user =>{
    await axios.post(`${import.meta.env.VITE_API_URL}/users/${user?.email}`, {
        name: user?.displayName,
        image: user?.photoURL,
        email: user?.email,
      }
      )
}
