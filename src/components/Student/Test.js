import React, { useEffect } from 'react';

const Test = () => {
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= 768) {
        // Nếu chiều rộng cửa sổ nhỏ hơn hoặc bằng 768px, đặt font-size là 14px
        document.documentElement.style.fontSize = '14px';
        return;
      }
      else
      {
        document.documentElement.style.fontSize = `16px`;
      }
      // const newFontSize = width * 0.01; // Ví dụ: 1% của chiều rộng cửa sổ
      // document.documentElement.style.fontSize = `${newFontSize}px`;
    };

    // Gọi hàm xử lý khi lần đầu render component
    handleResize();

    // Lắng nghe sự kiện thay đổi kích thước cửa sổ
    window.addEventListener('resize', handleResize);

    // Cleanup khi component bị hủy
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div>
      
      <p style={{fontSize: '1rem'}}>This text size changes based on the window size!</p>
    </div>
  );
};

export default Test;
