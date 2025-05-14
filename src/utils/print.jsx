const convertAmountToWords = (amount) => {
  return convertNumberToWords(amount) + " đồng chẵn";
};
const generateInvoicePdf = async (orderId) => {
  setPdfLoading(true);
  try {
    // Lấy dữ liệu đơn hàng và chi tiết đơn hàng
    const orderResponse = await getOrderById(orderId);
    const detailsResponse = await getDetailOrder(orderId);

    if (!orderResponse.data || !detailsResponse.data) {
      message.error(t("employer.orders.invoiceError"));
      return;
    }

    const orderData = orderResponse.data;
    const detailsData = detailsResponse.data;

    // Format date in Vietnamese style
    const today = new Date();
    const formattedDate = `Ngày ${today.getDate()} tháng ${
      today.getMonth() + 1
    } năm ${today.getFullYear()}`;

    // Tạo bảng sản phẩm
    const tableBody = [];
    let subTotal = 0;

    // Header của bảng
    tableBody.push([
      { text: "STT", style: "tableHeader", alignment: "center" },
      { text: "Tên dịch vụ", style: "tableHeader" },
      { text: "Đơn vị", style: "tableHeader", alignment: "center" },
      { text: "Số lượng", style: "tableHeader", alignment: "center" },
      { text: "Đơn giá (VND)", style: "tableHeader", alignment: "right" },
      { text: "Thành tiền (VND)", style: "tableHeader", alignment: "right" },
    ]);

    // Thêm tất cả sản phẩm vào bảng
    detailsData.forEach((item, index) => {
      const amount = item.amount * item.price;
      subTotal += amount;

      tableBody.push([
        { text: (index + 1).toString(), alignment: "center" },
        { text: item.packageResponse.packageName },
        { text: "Gói", alignment: "center" },
        { text: item.amount.toString(), alignment: "center" },
        { text: item.price.toLocaleString("vi-VN"), alignment: "right" },
        { text: amount.toLocaleString("vi-VN"), alignment: "right" },
      ]);
    });

    // Định nghĩa cấu trúc tài liệu PDF
    const docDefinition = {
      pageSize: "A4",
      pageMargins: [20, 20, 20, 40],
      defaultStyle: {
        font: "Roboto",
      },
      footer: function (currentPage, pageCount) {
        return {
          text: `Trang ${currentPage} / ${pageCount}`,
          alignment: "center",
          fontSize: 9,
          margin: [0, 10, 0, 0],
        };
      },
      content: [
        // Header với 3 phần ngang nhau
        {
          columns: [
            // Logo và tên công ty (bên trái)
            {
              width: "*",
              stack: [
                {
                  text: "UTE Career",
                  fontSize: 22,
                  bold: true,
                  color: "#007e7a",
                },
                {
                  text: "TUYỂN DỤNG & HỖ TRỢ VIỆC LÀM",
                  fontSize: 8,
                  color: "#007e7a",
                },
              ],
            },
            // Tiêu đề hóa đơn (giữa)
            {
              width: "*",
              stack: [
                {
                  text: "HÓA ĐƠN",
                  fontSize: 24,
                  bold: true,
                  alignment: "center",
                  color: "#007e7a",
                },
                {
                  text: formattedDate,
                  fontSize: 10,
                  alignment: "center",
                },
              ],
            },
            // Thông tin hóa đơn (bên phải)
            {
              width: "*",
              stack: [
                {
                  columns: [
                    { text: "Ký hiệu:", fontSize: 10, width: 60 },
                    {
                      text: "UTE-INV",
                      fontSize: 10,
                      bold: true,
                      color: "#007e7a",
                      width: "*",
                    },
                  ],
                },
                {
                  columns: [
                    { text: "Số:", fontSize: 10, width: 60 },
                    {
                      text: orderData.orderId.toString().padStart(4, "0"),
                      fontSize: 10,
                      bold: true,
                      color: "#007e7a",
                      width: "*",
                    },
                  ],
                  margin: [0, 5, 0, 0],
                },
              ],
              alignment: "right",
            },
          ],
        },
        // Đường kẻ ngang
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 5,
              x2: 555,
              y2: 5,
              lineWidth: 1,
              lineColor: "#007e7a",
            },
          ],
          margin: [0, 10, 0, 10],
        },
        // THÔNG TIN NGƯỜI BÁN VÀ NGƯỜI MUA
        {
          columns: [
            // Thông tin người bán
            {
              width: "*",
              stack: [
                {
                  text: "THÔNG TIN ĐƠN VỊ BÁN HÀNG:",
                  fontSize: 11,
                  bold: true,
                  color: "#007e7a",
                  margin: [0, 0, 0, 5],
                },
                {
                  columns: [
                    {
                      text: "Đơn vị bán:",
                      width: 70,
                      fontSize: 10,
                      bold: true,
                    },
                    {
                      text: "UTE Career Bridge - Trang tuyển dụng",
                      width: "*",
                      fontSize: 10,
                    },
                  ],
                  margin: [0, 5, 0, 0],
                },
                {
                  columns: [
                    {
                      text: "Mã số thuế:",
                      width: 70,
                      fontSize: 10,
                      bold: true,
                    },
                    { text: "0100727825-999", width: "*", fontSize: 10 },
                  ],
                  margin: [0, 5, 0, 0],
                },
                {
                  columns: [
                    { text: "Địa chỉ:", width: 70, fontSize: 10, bold: true },
                    {
                      text: "TP. Hồ Chí Minh, Việt Nam",
                      width: "*",
                      fontSize: 10,
                    },
                  ],
                  margin: [0, 5, 0, 0],
                },
                {
                  columns: [
                    { text: "Liên hệ:", width: 70, fontSize: 10, bold: true },
                    {
                      text: "(028) 7108-8788 | utecareerbridge@gmail.com",
                      width: "*",
                      fontSize: 10,
                    },
                  ],
                  margin: [0, 5, 0, 0],
                },
              ],
            },
            // Thông tin người mua
            {
              width: "*",
              stack: [
                {
                  text: "THÔNG TIN KHÁCH HÀNG:",
                  fontSize: 11,
                  bold: true,
                  color: "#007e7a",
                  margin: [0, 0, 0, 5],
                },
                {
                  columns: [
                    {
                      text: "Người mua:",
                      width: 70,
                      fontSize: 10,
                      bold: true,
                    },
                    {
                      text:
                        orderData.employer?.firstName +
                        " " +
                        orderData.employer?.lastName,
                      width: "*",
                      fontSize: 10,
                    },
                  ],
                  margin: [0, 5, 0, 0],
                },
                {
                  columns: [
                    { text: "Đơn vị:", width: 70, fontSize: 10, bold: true },
                    {
                      text:
                        orderData.employer?.companyName ||
                        "CÔNG TY CỔ PHẦN GEM",
                      width: "*",
                      fontSize: 10,
                    },
                  ],
                  margin: [0, 5, 0, 0],
                },
                {
                  columns: [
                    {
                      text: "Mã số thuế:",
                      width: 70,
                      fontSize: 10,
                      bold: true,
                    },
                    {
                      text: orderData.employer?.taxCode || "-",
                      width: "*",
                      fontSize: 10,
                    },
                  ],
                  margin: [0, 5, 0, 0],
                },
                {
                  columns: [
                    { text: "Địa chỉ:", width: 70, fontSize: 10, bold: true },
                    {
                      text:
                        orderData.employer?.address ||
                        "TP. Hồ Chí Minh, Việt Nam",
                      width: "*",
                      fontSize: 10,
                    },
                  ],
                  margin: [0, 5, 0, 0],
                },
              ],
            },
          ],
          margin: [0, 0, 0, 15],
        },
        // THÔNG TIN THANH TOÁN
        {
          stack: [
            {
              text: "THÔNG TIN THANH TOÁN:",
              fontSize: 11,
              bold: true,
              color: "#007e7a",
              alignment: "center",
            },
            {
              columns: [
                {
                  text: "Đồng tiền thanh toán: VND",
                  width: "*",
                  fontSize: 10,
                },
                {
                  text: "Hình thức thanh toán: VNPay",
                  width: "*",
                  fontSize: 10,
                },
              ],
              margin: [0, 5, 0, 0],
            },
          ],
          margin: [0, 0, 0, 10],
          fillColor: "#f0fcfc",
          padding: [10, 10, 10, 10],
        },
        // BẢNG SẢN PHẨM
        {
          table: {
            headerRows: 1,
            widths: [30, "*", 50, 50, 80, 80],
            body: tableBody,
          },
          layout: {
            hLineWidth: function () {
              return 0.5;
            },
            vLineWidth: function () {
              return 0.5;
            },
            hLineColor: function () {
              return "#007e7a";
            },
            vLineColor: function () {
              return "#007e7a";
            },
            fillColor: function (rowIndex) {
              return rowIndex % 2 === 0 ? "#f8fcfc" : null;
            },
            paddingLeft: function () {
              return 8;
            },
            paddingRight: function () {
              return 8;
            },
            paddingTop: function () {
              return 5;
            },
            paddingBottom: function () {
              return 5;
            },
          },
          margin: [0, 10, 0, 10],
        },
        // PHẦN TỔNG TIỀN
        {
          columns: [
            // Số tiền bằng chữ
            {
              width: "*",
              stack: [
                { text: "Số tiền viết bằng chữ:", fontSize: 10, bold: true },
                {
                  text: convertAmountToWords(orderData.total),
                  fontSize: 10,
                  italics: true,
                  margin: [0, 5, 0, 0],
                },
              ],
            },
            // Cộng tiền hàng, chiết khấu, tổng tiền
            {
              width: 200,
              stack: [
                {
                  columns: [
                    { text: "Cộng tiền hàng:", fontSize: 10, width: 100 },
                    {
                      text: subTotal.toLocaleString("vi-VN") + " VND",
                      fontSize: 10,
                      bold: true,
                      width: "*",
                      alignment: "right",
                    },
                  ],
                },
                // Thêm giảm giá nếu có mã giảm giá
                orderData.couponCode
                  ? {
                      columns: [
                        {
                          text: "Chiết khấu:",
                          fontSize: 10,
                          width: 100,
                          margin: [0, 5, 0, 0],
                        },
                        {
                          text:
                            orderData.discount +
                            "% (" +
                            orderData.couponCode +
                            ")",
                          fontSize: 10,
                          color: "#dc1414",
                          width: "*",
                          alignment: "right",
                          margin: [0, 5, 0, 0],
                        },
                      ],
                    }
                  : {},
                // Tổng tiền
                {
                  columns: [
                    {
                      text: "THÀNH TIỀN:",
                      fontSize: 11,
                      bold: true,
                      color: "#007e7a",
                      width: 100,
                      margin: [0, 5, 0, 0],
                    },
                    {
                      text: orderData.total.toLocaleString("vi-VN") + " VND",
                      fontSize: 11,
                      bold: true,
                      color: "#007e7a",
                      width: "*",
                      alignment: "right",
                      margin: [0, 5, 0, 0],
                    },
                  ],
                },
              ],
            },
          ],
          margin: [0, 20, 0, 30],
        },
        // PHẦN CHỮ KÝ
        {
          columns: [
            // Chữ ký người mua
            {
              width: "*",
              stack: [
                {
                  text: " ",
                  fontSize: 10,
                  alignment: "center",
                  margin: [0, 0, 0, 5],
                },
                {
                  text: "NGƯỜI MUA HÀNG",
                  fontSize: 11,
                  bold: true,
                  color: "#007e7a",
                  alignment: "center",
                },
                {
                  text: "(Ký, ghi rõ họ tên)",
                  fontSize: 9,
                  italics: true,
                  alignment: "center",
                  margin: [0, 5, 0, 0],
                },
                { text: "", margin: [0, 60, 0, 0] }, // Thêm khoảng trống cho dấu mộc
                {
                  text: orderData.employer?.companyName,
                  fontSize: 9,
                  bold: true,
                  alignment: "center",
                  margin: [0, 5, 0, 0],
                },
              ],
            },
            // Chữ ký người bán
            {
              width: "*",
              stack: [
                {
                  text: "" + formattedDate,
                  fontSize: 10,
                  alignment: "center",
                  margin: [0, 0, 0, 5],
                },
                {
                  text: "NGƯỜI BÁN HÀNG",
                  fontSize: 11,
                  bold: true,
                  color: "#007e7a",
                  alignment: "center",
                },
                {
                  text: "(Ký, đóng dấu)",
                  fontSize: 9,
                  italics: true,
                  alignment: "center",
                  margin: [0, 5, 0, 0],
                },
                { text: "", margin: [0, 60, 0, 0] }, // Thêm khoảng trống cho dấu mộc
                {
                  text: "UTE Career Bridge",
                  fontSize: 9,
                  bold: true,
                  alignment: "center",
                  margin: [0, 5, 0, 0],
                },
              ],
            },
          ],
        },
      ],
      styles: {
        tableHeader: {
          bold: true,
          fontSize: 10,
          color: "white",
          fillColor: "#007e7a",
          margin: [0, 5, 0, 5],
        },
      },
    };

    // Tạo và tải xuống PDF
    pdfMake
      .createPdf(docDefinition)
      .download(`hoa_don_${orderData.orderId}.pdf`);
    message.success(t("employer.orders.invoiceSuccess"));
  } catch (error) {
    console.error("PDF generation error:", error);
    message.error(t("employer.orders.invoiceError"));
  } finally {
    setPdfLoading(false);
  }
};
