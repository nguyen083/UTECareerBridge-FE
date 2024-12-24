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
        // [{ font: [] }],
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
        // toggle to add extra line breaks when pasting HTML:
        matchVisual: false,
    },
};

const formats = [
    // "header",
    // "font",
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
                // style={{ borderRadius: "10px", border: "1px solid #d9d9d9" }}
                ref={quillRef}
                theme="snow"
                modules={modules}
                formats={formats}
                placeholder="Nhập mô tả ở đây..."
                value={value}
                onChange={onChange}
            />
        </>
    );
}