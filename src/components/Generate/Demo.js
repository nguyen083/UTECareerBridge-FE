import { useState } from "react";
import './Demo.scss';
import axios from "../../utils/axiosCustomize.js";

const Demo = () => {
    const [image, setImage] = useState("");
    const [previewImage, setPreviewImage] = useState("");

    const submit = () =>{
        // alert("Please enter");
        const Data =
        {
            
            image
        } 
        return axios.post("", data);
    }

    const handleUploadImage = (event) => {
        if (event.target && event.target.files && event.target.files[0]) {
            setPreviewImage(URL.createObjectURL(event.target.files[0]));
            setImage(event.target.files[0]);
        }
        else
            setPreviewImage("");
    }
    return (
        <>
            <div className="col-md-12">
                <label className="form-label label-upload" htmlFor='labelUpload'>
                    Upload Image
                </label>
                <input type="file" className="form-control" hidden id='labelUpload' onChange={(event) => handleUploadImage(event)} />

            </div>
            <div className='col-md-12 img-preview'>
                {
                    previewImage ?
                        <img src={previewImage} />
                        : <span>Choose image</span>
                }

            </div>
            <button className="btn btn-primary" onClick={() => submit()}> send request</button>
        </>
    );
}
export default Demo;