import { useState, useEffect } from "react";
import { Spin } from "antd";
import { FilePdfOutlined } from "@ant-design/icons";

const PDFThumbnail = ({ pdfUrl, width = "100%", height = 200 }) => {
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!pdfUrl) {
      setLoading(false);
      setError(true);
      return;
    }

    const fetchPdfThumbnail = async () => {
      try {
        // Nếu pdfUrl là URL trực tiếp đến file, hiển thị trong iframe
        setThumbnail(pdfUrl);
        setLoading(false);
      } catch (error) {
        console.error("Error loading PDF thumbnail:", error);
        setError(true);
        setLoading(false);
      }
    };

    fetchPdfThumbnail();
  }, [pdfUrl]);

  if (loading) {
    return (
      <div
        style={{
          width,
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Spin />
      </div>
    );
  }

  if (error || !thumbnail) {
    return (
      <div
        style={{
          width,
          height,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f5f5f5",
          color: "#999",
        }}
      >
        <FilePdfOutlined style={{ fontSize: 36, marginBottom: 8 }} />
        <span>PDF không khả dụng</span>
      </div>
    );
  }

  return (
    <div style={{ width, height, overflow: "hidden", position: "relative" }}>
      <iframe
        src={`${thumbnail}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
        title="PDF Thumbnail"
        width="100%"
        height="100%"
        style={{
          border: "none",
          transform: "scale(1.2)",
          transformOrigin: "top center",
        }}
      />
    </div>
  );
};

export default PDFThumbnail;
