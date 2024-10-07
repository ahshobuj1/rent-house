import axios from 'axios';

export const UploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    //console.log(imageFile);

    const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${
            import.meta.env.VITE_API_KEY_IMGBB
        }`,
        formData
    );
    return res?.data?.data?.url;
};
