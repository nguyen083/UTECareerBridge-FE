// import cloudinary from 'cloudinary';

// cloudinary.v2.config({
//     cloud_name: 'utejobhub',
//     api_key: '916681887772487',
//     api_secret: 'fVU7zJM9IoWYZAKumpfqyOazjbI',
//     secure: true,
// });

// export const renameFile = (oldFileName, newFileName) => {
//     return new Promise((resolve, reject) => {
//         cloudinary.uploader.rename(
//             oldFileName,
//             newFileName,
//             { overwrite: true }, // Ghi đè nếu file mới đã tồn tại
//             (error, result) => {
//                 if (error) {
//                     cloudinary
//                     reject("Đổi tên thất bại! Vui lòng kiểm tra lại.");
//                 } else {
//                     resolve(result.public_id);
//                 }
//             }
//         );
//     });
// }