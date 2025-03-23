import "react-quill/dist/quill.snow.css";
import ReactQuill from 'react-quill';
import './CustomizeQuill.scss';
import { Row } from 'antd';
import { useRef } from "react";

const modules = {
    toolbar: [

        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ size: [] }],
        [
            {
                color: ["black", "red", "blue", "yellow"],
            },
        ],
       
        [{ align: [false, "right", "center", "justify"] }],
        [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
        ],
        ["link"],
        [{ background: [false, "red", "#785412"] }]
    ],
    clipboard: {
       
        matchVisual: false,
    },
};

const formats = [
   
   
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "background",
    "bullet",
    "indent",
    "link",
    "align",
    "color",
];

export default function CustomizeQuill(props) {
    const quillRef = useRef(null);
    const { value } = props;
    const onChange = (value) => {
        props.onChange(value);
    }
    return (
        <>
            <ReactQuill
               
                ref={quillRef}
                theme="snow"
                modules={modules}
                formats={formats}
                placeholder="Nhập mô tả ở đây..."
                value={value}
                onChange={onChange}
                key={props.key}
            />
        </>
    );
}