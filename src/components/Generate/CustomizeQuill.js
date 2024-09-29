import "react-quill/dist/quill.snow.css";
import ReactQuill from 'react-quill';
import { useEffect, useState } from "react";
import parse from 'html-react-parser';

const modules = {
    toolbar: [
        [{ header: "1" }, { header: "2" }, { font: [] }],
        [{ size: [] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [
            {
                color: ["red", "blue", "yellow"],
            },
        ],
        [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
        ],
        ["link", "image", "video"],
        ["clean"],
    ],
    clipboard: {
        // toggle to add extra line breaks when pasting HTML:
        matchVisual: false,
    },
};

const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
    "color",
];



export default function CustomizeQuill(props) {
    const { value } = props;
    const onChange = (value) => {
        props.onChange(value);
    }
    return (
        <>
            <ReactQuill
                style={{ height: "150px" }}
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