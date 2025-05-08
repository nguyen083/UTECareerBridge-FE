import { useRef, useState, useEffect } from "react";
import { Input } from "antd";

const AutoResizingInput = ({
  value,
  onChange,
  placeholder,
  className,
  style,
  size,
  minWidth = 60,
  maxWidth = 500,
  ...props
}) => {
  const [inputWidth, setInputWidth] = useState(minWidth);
  const measureRef = useRef(null);
  // Lưu trữ giá trị fontSize để so sánh khi có thay đổi
  const fontSizeRef = useRef(style?.fontSize);

  useEffect(() => {
    if (measureRef.current) {
      // Cập nhật giá trị fontSize hiện tại
      fontSizeRef.current = style?.fontSize;

      const computedWidth = calculateTextWidth(
        value || placeholder,
        getComputedStyle(measureRef.current)
      );

      // Thêm khoảng đệm để tránh hiện tượng nội dung bị cắt
      // Tăng padding khi fontSize lớn hơn
      const basePadding = 20;

      const newWidth = Math.min(
        Math.max(computedWidth + basePadding, minWidth),
        maxWidth
      );

      setInputWidth(newWidth);
    }
  }, [value, placeholder, minWidth, maxWidth, style?.fontSize]); // Thêm style.fontSize vào dependencies

  // Hàm tính toán chiều rộng của văn bản
  const calculateTextWidth = (text, style) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (context) {
      // Đảm bảo sử dụng font chính xác khi tính toán kích thước
      const fontFamily = style.fontFamily || "'Open Sans', sans-serif";
      const fontSize = style.fontSize || "14px";
      const fontWeight = style.fontWeight || "normal";
      const fontStyle = style.fontStyle || "normal";

      context.font = `${fontStyle} ${fontWeight} ${fontSize} ${fontFamily}`;
      return context.measureText(text || "").width;
    }

    return minWidth;
  };

  return (
    <div style={{ display: "inline-block", position: "relative" }}>
      <span
        ref={measureRef}
        style={{
          position: "absolute",
          visibility: "hidden",
          whiteSpace: "pre",
          ...style,
        }}
      >
        {value || placeholder}
      </span>
      <Input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={className}
        style={{ ...style, width: inputWidth }}
        size={size}
        {...props}
      />
    </div>
  );
};

export default AutoResizingInput;
