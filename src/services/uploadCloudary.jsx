import axios from 'axios';
import CryptoJS from 'crypto-js';

const CLOUD_NAME = "utejobhub"
const UPLOAD_PRESET = "ml_default"; 
const CLOUDINARY_API_KEY = "916681887772487"; 
const CLOUDINARY_API_SECRET = "fVU7zJM9IoWYZAKumpfqyOazjbI"; 
// Hàm tạo chữ ký (signature)
const generateSignature = (timestamp, folder) => {
    const stringToSign = `folder=${folder}&timestamp=${timestamp}&upload_preset=${UPLOAD_PRESET}`; 
    console.log("stringToSign:", stringToSign);
    return CryptoJS.SHA1(stringToSign + CLOUDINARY_API_SECRET).toString(CryptoJS.enc.Hex); 
};
// Hàm upload ảnh lên Cloudinary
export const uploadToCloudinary = async (file, folder, onProgress) => {
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = generateSignature(timestamp, folder); 
    console.log("signature:", signature);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("api_key", CLOUDINARY_API_KEY);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature); 
    formData.append("folder", folder);
    try {
        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onProgress(percentCompleted); 
                },
            }
        );
        console.log("response:", response?.data);
        return response.data.secure_url; 
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error.response?.data || error.message);
        throw error; 
    }
};
export const deleteImageFromCloudinaryByLink = async (link, type = "image", folder = "student") => {
    const publicId = folder + "/" + link.split('/').pop().split('.')[0];
    console.log("publicId:", publicId);
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = generateSignatureDelete(publicId, timestamp);
    let endpoint;
    switch (type) {
        case "image":
            endpoint = `/image/destroy`;
            break;
        case "video":
            endpoint = `/video/destroy`;
            break;
        case "raw":
            endpoint = `/raw/destroy`;
            break;
        default:
            throw new Error("Loại tài nguyên không hợp lệ");
    }
    try {
        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}${endpoint}`,
            {
                public_id: publicId,
                api_key: CLOUDINARY_API_KEY,
                timestamp: timestamp,
                signature: signature,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        return response.status;
    } catch (error) {
        console.error("Lỗi khi xóa ảnh cũ từ Cloudinary:", error.response?.data || error.message);
        throw error;
    }
};
// Hàm xóa ảnh từ Cloudinary
export const deleteImageFromCloudinary = async (publicId) => {
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = generateSignatureDelete(publicId, timestamp);
    try {
        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/destroy`,
            {
                public_id: publicId,
                api_key: CLOUDINARY_API_KEY,
                timestamp: timestamp,
                signature: signature,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Lỗi khi xóa ảnh cũ từ Cloudinary:", error.response?.data || error.message);
        throw error;
    }
};
// Hàm tạo chữ ký (signature)
const generateSignatureDelete = (publicId, timestamp) => {
    const stringToSign = `public_id=${publicId}&timestamp=${timestamp}`;
    return CryptoJS.SHA1(stringToSign + CLOUDINARY_API_SECRET).toString(CryptoJS.enc.Hex); 
};
export const uploadAndDeleteToCloudinary = async (file, folder, oldLink, onProgress) => {
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = generateSignature(timestamp, folder);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("api_key", CLOUDINARY_API_KEY);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature); 
    formData.append("folder", folder);

    try {
       
        if (oldLink) {
            const publicId = folder + "/" + oldLink.split('/').pop().split('.')[0]; 
            await deleteImageFromCloudinary(publicId); 
        }
       
        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, 
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    onProgress(percentCompleted);
                },
            }
        );
        return response.data.secure_url; 
    } catch (error) {
        console.error("Lỗi khi upload ảnh lên Cloudinary:", error.response?.data || error.message);
        throw error; 
    }
};

