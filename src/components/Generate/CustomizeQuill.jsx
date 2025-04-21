import { useMemo, useRef } from "react";
import PropTypes from "prop-types";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./CustomizeQuill.scss";
import { uploadToCloudinary } from "../../services/uploadCloudary";

const CustomizeQuill = ({ value, onChange, placeholder, style, link = "" }) => {
  const quillRef = useRef(null);
  let icons = ReactQuill.Quill.import("ui/icons");
  icons["file"] = '<i class="fa-solid fa-paperclip"></i>';
  icons["undo"] = '<i class="fa-solid fa-rotate-left"></i>';
  icons["redo"] = '<i class="fa-solid fa-rotate-right"></i>';

  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      try {
        const imageUrl = await uploadToCloudinary(file, link, (progress) => {
          console.log(`Upload Progress: ${progress}%`);
        });

        if (imageUrl && quillRef.current) {
          const quill = quillRef.current.getEditor(); // Lấy instance Quill từ ref
          const range = quill.getSelection(); // Lấy vị trí con trỏ hiện tại
          quill.insertEmbed(range?.index || 0, "image", imageUrl);
        }
      } catch (error) {
        console.error("Upload failed:", error);
      }
    };
  };
  const handleFileUpload = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute(
      "accept",
      ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.rar,.zip"
    ); // Hỗ trợ các loại file
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      try {
        const fileUrl = await uploadToCloudinary(file, link, (progress) => {
          console.log(`Upload Progress: ${progress}%`);
        });

        if (fileUrl && quillRef.current) {
          const quill = quillRef.current.getEditor();
          const range = quill.getSelection();

          // Chèn link file vào nội dung editor
          quill.insertText(range?.index || 0, `[📄 ${file.name}](${fileUrl})`);
          quill.clipboard.dangerouslyPasteHTML(
            range?.index || 0,
            `<p class="file-link">📄 <a href="${fileUrl}" target="_blank">${file.name}</a></p>`
          );
        }
      } catch (error) {
        console.error("Lỗi khi upload file:", error);
      }
    };
  };
  const handleUndo = () => {
    const quill = quillRef.current?.getEditor();
    if (quill) quill.history.undo();
  };

  const handleRedo = () => {
    const quill = quillRef.current?.getEditor();
    if (quill) quill.history.redo();
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image", "file"],
          ["undo", "redo"], // Thêm Undo & Redo
          ["clean"],
        ],
        handlers: {
          image: handleImageUpload, // Ghi đè sự kiện image
          file: handleFileUpload, // Thêm sự kiện file
          undo: handleUndo, // Sự kiện Undo
          redo: handleRedo, // Sự kiện Redo
        },
        history: {
          delay: 10000,
          maxStack: 50,
          userOnly: true,
        },
      },
    }),
    []
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "align",
    "list",
    "bullet",
    "link",
    "image",
  ];

  return (
    <div style={style}>
      <ReactQuill
        ref={quillRef} // Gán ref vào ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="editor-quill"
      />
    </div>
  );
};

CustomizeQuill.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  style: PropTypes.object,
};

export default CustomizeQuill;
