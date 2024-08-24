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
    <>
      <div style={{ overflowY: 'auto', height: '100vh' }}>

        <p style={{ fontSize: '1rem' }}>Buổi trao quyết định có sự tham dự của Bộ trưởng, Chủ nhiệm Văn phòng Chính phủ Trần Văn Sơn; đại diện Ban Thường vụ Đảng ủy, Công đoàn Văn phòng Chính phủ và đại diện cán bộ, công chức các Vụ, cục, đơn vị.

          Thực hiện quy định của Nhà nước về việc nghỉ hưu đối với công chức, Thủ tướng Chính phủ, Bộ trưởng, Chủ nhiệm Văn phòng Chính phủ đã có các Quyết định nghỉ hưu hưởng chế độ bảo hiểm xã hội đối với 5 đồng chí: Nguyễn Xuân Thành, nguyên Phó Chủ nhiệm Văn phòng Chính phủ; Nguyễn Tất Vinh, nguyên Phó Vụ trưởng Vụ Hành chính; Hà Văn Sáng, nguyên Hàm Vụ phó Vụ Pháp luật; Xuân Thế Thụ, nguyên chuyên viên cao cấp Vụ Đổi mới doanh nghiệp; Vương Quốc Chính, nguyên cán bộ biệt phái Vụ Nội chính.

          Theo truyền thống, Văn phòng Chính phủ tổ chức gặp mặt để ghi nhận quá trình công tác và trao quyết định nghỉ hưu cho các cán bộ.

          Tại buổi gặp mặt, đại diện Vụ Tổ chức cán bộ đã nêu lại quá trình công tác của 5 đồng chí nghỉ hưu theo chế độ. Các đồng chí đều là những cán bộ có bề dày công tác tại Văn phòng Chính phủ, trải qua nhiều vị trí công tác; nhiều đồng chí đã đảm nhận các chức vụ quản lý, lãnh đạo của Văn phòng Chính phủ cũng như các đơn vị của Văn phòng Chính phủ.

          Trong quá trình công tác, các đồng chí đã được trao tặng nhiều phần thưởng, danh hiệu cao quý như: Huân chương Lao động hạng Nhất; Huân chương Lao động hạng Nhì; Huân chương Lao động hạng Ba; Huân chương Bảo vệ Tổ quốc; Bằng khen của Thủ tướng Chính phủ, Bằng khen của Bộ trưởng, Chủ nhiệm, Chiến sĩ thi đua cấp Bộ...</p>
      </div>
    </>

  );
};

export default Test;
