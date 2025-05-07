import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
} from "react";
import { Typography } from "antd";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useTranslation } from "react-i18next";
import "./CVPreview.scss";

const { Paragraph } = Typography;

// Helper function to convert skill level to percentage
const getLevelPercentage = (level) => {
  switch (level) {
    case 1:
      return "20%";
    case 2:
      return "40%";
    case 3:
      return "60%";
    case 4:
      return "80%";
    case 5:
      return "100%";
    default:
      return "20%";
  }
};

// Helper function to get section titles based on template
const getSectionTitles = (templateId) => {
  switch (templateId) {
    case "professional":
      return {
        objective: "MỤC TIÊU NGHỀ NGHIỆP",
        personalInfo: "THÔNG TIN CÁ NHÂN",
        workExperience: "KINH NGHIỆM LÀM VIỆC",
        skills: "KỸ NĂNG CHUYÊN MÔN",
        certificates: "CHỨNG CHỈ CHUYÊN MÔN",
        contact: "LIÊN HỆ",
        profileLabel: "Hồ sơ chuyên môn",
        dateLabel: "Ngày:",
        localeLabel: "Quốc tịch:",
        genderLabel: "Giới tính:",
        statusLabel: "Tình trạng:",
      };
    case "creative":
      return {
        objective: "MỤC TIÊU NGHỀ NGHIỆP",
        personalInfo: "THÔNG TIN CÁ NHÂN",
        workExperience: "KINH NGHIỆM SÁNG TẠO",
        skills: "KỸ NĂNG THIẾT KẾ",
        certificates: "CHỨNG CHỈ CHUYÊN MÔN",
        contact: "LIÊN HỆ",
        profileLabel: "Tiểu sử sáng tạo",
        dateLabel: "Ngày sinh:",
        localeLabel: "Quốc tịch:",
        genderLabel: "Giới tính:",
        statusLabel: "Tình trạng hôn nhân:",
      };
    case "minimal":
      return {
        objective: "PROFILE",
        personalInfo: "THÔNG TIN CÁ NHÂN",
        workExperience: "EXPERIENCE",
        skills: "TECH STACK",
        certificates: "CERTIFICATIONS",
        contact: "CONTACT",
        profileLabel: "Developer Profile",
        dateLabel: "Date:",
        localeLabel: "Locale:",
        genderLabel: "Gender:",
        statusLabel: "Status:",
      };
    case "elegant":
      return {
        objective: "LỜI GIỚI THIỆU",
        personalInfo: "THÔNG TIN CÁ NHÂN",
        workExperience: "KINH NGHIỆM CHUYÊN MÔN",
        skills: "KỸ NĂNG CHUYÊN MÔN",
        certificates: "CHỨNG CHỈ & BẰNG CẤP",
        contact: "THÔNG TIN LIÊN HỆ",
        profileLabel: "Chuyên môn",
        dateLabel: "Ngày sinh:",
        localeLabel: "Quốc tịch:",
        genderLabel: "Giới tính:",
        statusLabel: "Tình trạng hôn nhân:",
      };
    case "modern":
    default:
      return {
        objective: "MỤC TIÊU NGHỀ NGHIỆP",
        personalInfo: "THÔNG TIN CÁ NHÂN",
        workExperience: "KINH NGHIỆM LÀM VIỆC",
        skills: "KỸ NĂNG",
        certificates: "CHỨNG CHỈ",
        contact: "LIÊN HỆ",
        profileLabel: "Hồ sơ",
        dateLabel: "Ngày sinh:",
        localeLabel: "Quốc tịch:",
        genderLabel: "Giới tính:",
        statusLabel: "Tình trạng hôn nhân:",
      };
  }
};

const CVPreview = forwardRef(
  (
    {
      personalInfo = {},
      workExperiences = [],
      certificates = [],
      skills = [],
      sections = [],
      template = {
        id: "modern",
        color: "#f57c00",
        font: "'Open Sans', sans-serif",
        fontSize: 12,
      },
    },
    ref
  ) => {
    const { t } = useTranslation();
    const contentRef = useRef(null);
    const [currentTemplate, setCurrentTemplate] = useState(template);
    const [titles, setTitles] = useState(getSectionTitles(template.id));

    // Force apply styles to the preview content
    useEffect(() => {
      if (contentRef.current) {
        // Apply font and size to all elements
        contentRef.current.style.fontFamily = currentTemplate.font;
        contentRef.current.style.fontSize = `${currentTemplate.fontSize}px`;
      }
    }, [currentTemplate.font, currentTemplate.fontSize]);

    // Update when template props change
    useEffect(() => {
      setCurrentTemplate(template);
      setTitles(getSectionTitles(template.id));
    }, [template]);

    // Đảm bảo load xong ảnh trước khi xuất PDF
    const waitForImages = async () => {
      const images = contentRef.current?.querySelectorAll("img") || [];
      await Promise.all(
        Array.from(images).map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        })
      );
    };

    // Hàm tạo PDF không mở trong tab mới
    const createPDF = async () => {
      if (!contentRef.current) return false;
      try {
        // Lưu style gốc để khôi phục sau khi tạo PDF
        const originalDisplay = contentRef.current.style.display;
        const originalOpacity = contentRef.current.style.opacity;
        const originalPosition = contentRef.current.style.position;
        const originalVisibility = contentRef.current.style.visibility;
        const originalWidth = contentRef.current.style.width;
        const originalTransform = contentRef.current.style.transform;
        const originalMaxWidth = contentRef.current.style.maxWidth;

        // Force proper display với kích thước cho rendering
        contentRef.current.style.display = "block";
        contentRef.current.style.opacity = "1";
        contentRef.current.style.position = "relative";
        contentRef.current.style.visibility = "visible";
        contentRef.current.style.width = "210mm"; // Chiều rộng A4
        contentRef.current.style.maxWidth = "210mm"; // Chiều rộng tối đa A4
        contentRef.current.style.transform = "none";

        // Áp dụng font và style cho root element
        contentRef.current.style.fontFamily = currentTemplate.font;
        contentRef.current.style.fontSize = `${currentTemplate.fontSize}px`;

        // Đợi ảnh và font load xong
        await waitForImages();
        await document.fonts.ready;

        // Thêm delay để đảm bảo rendering
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const element = contentRef.current;
        const rect = element.getBoundingClientRect();

        if (rect.width <= 0 || rect.height <= 0) {
          throw new Error(
            "CV content has no dimensions. Make sure it's visible."
          );
        }

        // Tạo đối tượng PDF mới
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
          compress: true,
          putOnlyUsedFonts: true,
        });

        // Tính toán kích thước và tỷ lệ
        const pdfWidth = pdf.internal.pageSize.getWidth(); // A4 width in mm
        const pdfHeight = pdf.internal.pageSize.getHeight(); // A4 height in mm

        // Sử dụng tỷ lệ cao hơn để chất lượng tốt hơn
        const scaleValue = 4; // Tăng scale cho chất lượng tốt hơn

        // Tạo một phiên bản sao chép của DOM trước, thực hiện các điều chỉnh style chi tiết
        const domClone = document.createElement("div");
        domClone.appendChild(element.cloneNode(true));
        const cloneElement = domClone.firstChild;

        // Đặt style cho clone để đảm bảo kích thước và style chính xác
        cloneElement.style.width = "210mm";
        cloneElement.style.margin = "0";
        cloneElement.style.padding = "0";
        cloneElement.style.fontFamily = currentTemplate.font;
        cloneElement.style.fontSize = `${currentTemplate.fontSize}px`;
        cloneElement.style.boxSizing = "border-box";
        cloneElement.style.transform = "none";
        cloneElement.style.position = "relative";

        // Xử lý các phần tử con
        const processAllChildElements = (parent) => {
          const elements = parent.querySelectorAll("*");
          elements.forEach((el) => {
            // Đảm bảo font thống nhất
            if (!(el instanceof HTMLImageElement)) {
              el.style.fontFamily = currentTemplate.font;
            }

            // Tuỳ chỉnh style cho tiêu đề mục
            if (el.classList.contains("section-title")) {
              el.style.fontWeight = "bold";
              el.style.fontSize = `${parseInt(currentTemplate.fontSize) + 2}px`;
              // Đảm bảo border luôn hiển thị trong PDF
              if (el.style.borderBottomColor) {
                // Đặt borderBottom đầy đủ để đảm bảo nó hiển thị trong PDF
                el.style.borderBottomWidth = "2px";
                el.style.borderBottomStyle = "solid";
                el.style.borderBottomColor = themeColor;
              }
              if (el.style.borderBottom) {
                // Không cần gán lại cho chính nó
                // el.style.borderBottom = el.style.borderBottom;
              }
              if (el.style.borderLeft) {
                // Đảm bảo borderLeft hiển thị
                el.style.borderLeftWidth = el.style.borderLeftWidth || "4px";
                el.style.borderLeftStyle = "solid";
                el.style.borderLeftColor = themeColor;
              }
              el.style.paddingBottom = "5px";
              el.style.marginBottom = "15px";
            }

            // Đảm bảo không phần tử nào bị phóng to
            el.style.transform = "none";
            el.style.zoom = "1";

            // Đảm bảo border của các element khác
            if (el.style.border && el.style.border.includes(themeColor)) {
              // Không cần gán lại cho chính nó
              // el.style.border = el.style.border;
            }

            // Đảm bảo các thuộc tính border khác được hiển thị
            ["Top", "Right", "Bottom", "Left"].forEach((side) => {
              if (
                el.style[`border${side}Color`] === themeColor ||
                el.style[`border${side}`]?.includes(themeColor)
              ) {
                el.style[`border${side}Width`] =
                  el.style[`border${side}Width`] || "2px";
                el.style[`border${side}Style`] =
                  el.style[`border${side}Style`] || "solid";
                el.style[`border${side}Color`] = themeColor;
              }
            });
          });
        };

        // Xử lý các template cụ thể
        const templateSpecificAdjustments = (cloneEl) => {
          // Xử lý template Professional và Elegant có cấu trúc cột
          if (
            cloneEl.classList.contains("template-professional") ||
            cloneEl.classList.contains("template-elegant")
          ) {
            const layoutContainer =
              cloneEl.querySelector(".professional-layout") ||
              cloneEl.querySelector(".elegant-two-column");

            if (layoutContainer) {
              layoutContainer.style.display = "flex";
              layoutContainer.style.flexDirection = "row";
              layoutContainer.style.minHeight = "auto";

              // Xử lý sidebar/left column
              const sidebar =
                layoutContainer.querySelector(".professional-sidebar") ||
                layoutContainer.querySelector(".elegant-left-column");
              if (sidebar) {
                sidebar.style.width = "30%";
                sidebar.style.boxSizing = "border-box";

                // Đảm bảo tất cả các phần tử trong sidebar có kích thước phù hợp
                const sections = sidebar.querySelectorAll('[class*="section"]');
                sections.forEach((section) => {
                  section.style.width = "100%";
                  section.style.boxSizing = "border-box";
                });
              }

              // Xử lý main/right column
              const main =
                layoutContainer.querySelector(".professional-main") ||
                layoutContainer.querySelector(".elegant-right-column");
              if (main) {
                main.style.flex = "1";
                main.style.boxSizing = "border-box";
              }
            }
          }

          // Xử lý template Creative có cấu trúc cột đặc biệt
          if (cloneEl.classList.contains("template-creative")) {
            const creativeContent = cloneEl.querySelector(".creative-content");
            if (creativeContent) {
              creativeContent.style.display = "flex";
              creativeContent.style.minHeight = "auto";

              const sidebar =
                creativeContent.querySelector(".creative-sidebar");
              if (sidebar) {
                sidebar.style.width = "35%";
                sidebar.style.boxSizing = "border-box";
              }

              const main = creativeContent.querySelector(".creative-main");
              if (main) {
                main.style.flex = "1";
                main.style.boxSizing = "border-box";
              }
            }
          }

          // Xử lý skill bars trong tất cả các template
          const skillBars = cloneEl.querySelectorAll(".skill-level-bar");
          skillBars.forEach((bar) => {
            bar.style.width = bar.style.width || "";
            bar.style.backgroundColor = themeColor;
          });
        };

        // Xử lý clone
        processAllChildElements(cloneElement);
        templateSpecificAdjustments(cloneElement);

        // Chèn vào DOM để lấy computed style
        document.body.appendChild(domClone);

        // Tạo canvas với scaling phù hợp
        const fullCanvas = await html2canvas(cloneElement, {
          scale: scaleValue,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          logging: false,
          imageTimeout: 15000,
          scrollX: 0,
          scrollY: 0,
          windowWidth: document.documentElement.offsetWidth,
          windowHeight: document.documentElement.offsetHeight,
        });

        // Xóa DOM clone
        document.body.removeChild(domClone);

        // Lấy dữ liệu hình ảnh chất lượng cao
        const imgData = fullCanvas.toDataURL("image/jpeg", 1.0);

        // Tính toán tỷ lệ phù hợp cho PDF
        const imgProps = pdf.getImageProperties(imgData);
        const imgWidth = pdfWidth;
        const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

        // Kiểm tra nội dung cần nhiều trang
        if (imgHeight > pdfHeight) {
          // Tính số trang cần thiết
          const pageRatio = imgHeight / pdfHeight;
          const totalPages = Math.ceil(pageRatio);

          for (let i = 0; i < totalPages; i++) {
            if (i > 0) {
              pdf.addPage();
            }

            // Tính phần của hình ảnh sử dụng cho trang này
            const sourceHeight = fullCanvas.height / pageRatio;
            const sourceY = i * sourceHeight;

            // Tạo canvas tạm thời cho mỗi trang
            const tempCanvas = document.createElement("canvas");
            const ctx = tempCanvas.getContext("2d");
            tempCanvas.width = fullCanvas.width;
            tempCanvas.height = sourceHeight;

            // Nền trắng
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

            // Vẽ phần thích hợp từ canvas đầy đủ
            ctx.drawImage(
              fullCanvas,
              0,
              sourceY,
              fullCanvas.width,
              sourceHeight,
              0,
              0,
              tempCanvas.width,
              tempCanvas.height
            );

            // Thêm vào PDF với kích thước phù hợp
            const pageImgData = tempCanvas.toDataURL("image/jpeg", 1.0);
            pdf.addImage(pageImgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
          }
        } else {
          // Nội dung vừa 1 trang
          pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
        }

        // Khôi phục style gốc
        contentRef.current.style.display = originalDisplay;
        contentRef.current.style.opacity = originalOpacity;
        contentRef.current.style.position = originalPosition;
        contentRef.current.style.visibility = originalVisibility;
        contentRef.current.style.width = originalWidth;
        contentRef.current.style.transform = originalTransform;
        contentRef.current.style.maxWidth = originalMaxWidth;

        return pdf;
      } catch (error) {
        console.error("Error creating PDF:", error);
        return null;
      }
    };

    useImperativeHandle(ref, () => ({
      // Main method to preview CV in new tab
      previewCV: async () => {
        try {
          const pdf = await createPDF();
          if (pdf) {
            const pdfBlob = pdf.output("blob");
            const pdfUrl = URL.createObjectURL(pdfBlob);
            window.open(pdfUrl, "_blank");
            return true;
          }
          return false;
        } catch (error) {
          console.error("Error previewing CV:", error);
          return false;
        }
      },

      // Keep original methods for backward compatibility
      generatePDF: async () => {
        try {
          const pdf = await createPDF();
          return pdf ? pdf.output("blob") : null;
        } catch (error) {
          console.error("Error generating PDF:", error);
          return null;
        }
      },

      downloadPDF: async (filename) => {
        try {
          const pdf = await createPDF();
          if (pdf) {
            // Just download the PDF without opening in new tab
            pdf.save(filename || "cv.pdf");
            return true;
          }
          return false;
        } catch (error) {
          console.error("Error downloading PDF:", error);
          return false;
        }
      },

      // Method to update template dynamically
      updateTemplate: (newTemplate) => {
        try {
          if (newTemplate) {
            setCurrentTemplate(newTemplate);
            setTitles(getSectionTitles(newTemplate.id || "modern"));
            return true;
          }
          return false;
        } catch (error) {
          console.error("Error updating template:", error);
          return false;
        }
      },

      // Method to open CV in new tab
      openCVInNewTab: async () => {
        try {
          const pdf = await createPDF();
          if (pdf) {
            const pdfBlob = pdf.output("blob");
            const pdfUrl = URL.createObjectURL(pdfBlob);
            window.open(pdfUrl, "_blank");
            return true;
          }
          return false;
        } catch (error) {
          console.error("Error opening CV in new tab:", error);
          return false;
        }
      },
    }));

    const templateClass = `template-${currentTemplate?.id || "modern"}`;
    const themeColor = currentTemplate?.color || "#f57c00";

    // Helper function to render custom sections
    const renderCustomSections = () => (
      <>
        {sections.map((section) => (
          <div key={section.id} className="cv-section">
            <div
              className="section-title"
              style={{ borderBottomColor: themeColor }}
            >
              {section.title}
            </div>
            <div className="section-content custom-section-content">
              {section.content?.items?.length > 0 ? (
                section.content.items.map((item, index) => (
                  <div key={index} className="custom-item">
                    {item.title && (
                      <div className="custom-item-title">{item.title}</div>
                    )}
                    {item.subtitle && (
                      <div className="custom-item-subtitle">
                        {item.subtitle}
                      </div>
                    )}
                    {item.description && (
                      <div className="custom-item-description">
                        {item.description}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div>
                  {section.content?.text || "Nội dung chưa được cập nhật."}
                </div>
              )}
            </div>
          </div>
        ))}
      </>
    );

    // Modern template (default)
    const renderModernTemplate = () => (
      <div className="flex flex-col space-y-6">
        {/* Header with personal information */}
        <div
          className="overflow-hidden rounded-lg shadow-md"
          style={{ backgroundColor: `${themeColor}15` }}
        >
          <div className="flex flex-col items-center gap-6 p-6 md:flex-row md:items-start">
            {personalInfo.photoUrl && (
              <div className="flex-shrink-0">
                <div
                  className="w-32 h-32 overflow-hidden rounded-full ring-4"
                  style={{ ringColor: themeColor }}
                >
                  <img
                    src={personalInfo.photoUrl}
                    alt="Profile"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col items-center flex-grow md:items-start">
              <h2
                className="mb-2 text-2xl font-bold md:text-3xl"
                style={{ color: themeColor }}
              >
                {personalInfo.fullName || "Họ và tên"}
              </h2>

              <div className="mb-4 text-lg font-medium text-gray-700">
                {personalInfo.jobTitle || "Chức danh - Kinh nghiệm"}
              </div>

              <div className="flex flex-col flex-wrap gap-4 md:flex-row">
                {personalInfo.phone && (
                  <div className="flex items-center">
                    <span
                      className="mr-2 text-xl"
                      style={{ color: themeColor }}
                    >
                      📱
                    </span>
                    <span>{personalInfo.phone}</span>
                  </div>
                )}

                {personalInfo.email && (
                  <div className="flex items-center">
                    <span
                      className="mr-2 text-xl"
                      style={{ color: themeColor }}
                    >
                      ✉️
                    </span>
                    <span>{personalInfo.email}</span>
                  </div>
                )}

                {personalInfo.address && (
                  <div className="flex items-center">
                    <span
                      className="mr-2 text-xl"
                      style={{ color: themeColor }}
                    >
                      📍
                    </span>
                    <span>{personalInfo.address}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Career Objective Section */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <div
            className="pb-2 mb-4 text-xl font-bold"
            style={{ borderBottom: `2px solid ${themeColor}` }}
          >
            {titles.objective}
          </div>
          <div className="prose max-w-none">
            <Paragraph>
              {personalInfo.objective ||
                "Mục tiêu nghề nghiệp chưa được cập nhật."}
            </Paragraph>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <div
            className="pb-2 mb-4 text-xl font-bold"
            style={{ borderBottom: `2px solid ${themeColor}` }}
          >
            {titles.personalInfo}
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {personalInfo.birthDate && (
              <div className="flex flex-col">
                <div className="font-medium text-gray-600">
                  {titles.dateLabel}
                </div>
                <div>{personalInfo.birthDate}</div>
              </div>
            )}
            {personalInfo.nationality && (
              <div className="flex flex-col">
                <div className="font-medium text-gray-600">
                  {titles.localeLabel}
                </div>
                <div>{personalInfo.nationality}</div>
              </div>
            )}
            {personalInfo.maritalStatus && (
              <div className="flex flex-col">
                <div className="font-medium text-gray-600">
                  {titles.statusLabel}
                </div>
                <div>{personalInfo.maritalStatus}</div>
              </div>
            )}
            {personalInfo.gender && (
              <div className="flex flex-col">
                <div className="font-medium text-gray-600">
                  {titles.genderLabel}
                </div>
                <div>{personalInfo.gender}</div>
              </div>
            )}
          </div>
        </div>

        {/* Work Experience Section */}
        {workExperiences && workExperiences.length > 0 && (
          <div className="p-6 bg-white rounded-lg shadow-md">
            <div
              className="pb-2 mb-4 text-xl font-bold"
              style={{ borderBottom: `2px solid ${themeColor}` }}
            >
              {titles.workExperience}
            </div>
            <div className="space-y-6">
              {workExperiences.map((exp) => (
                <div
                  key={exp.id}
                  className="relative pl-6 border-l-2"
                  style={{ borderColor: themeColor }}
                >
                  <div
                    className="absolute w-4 h-4 rounded-full -left-[9px] top-1"
                    style={{ backgroundColor: themeColor }}
                  ></div>
                  <div className="mb-1 text-sm font-medium text-gray-500">
                    {exp.startDate} - {exp.endDate}
                  </div>
                  <div className="mb-1 text-lg font-bold">
                    {exp.companyName}
                  </div>
                  <div className="mb-2 italic font-medium text-gray-700">
                    {exp.jobTitle}
                  </div>
                  <div className="text-gray-600">{exp.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills Section */}
        {skills && skills.length > 0 && (
          <div className="p-6 bg-white rounded-lg shadow-md">
            <div
              className="pb-2 mb-4 text-xl font-bold"
              style={{ borderBottom: `2px solid ${themeColor}` }}
            >
              {titles.skills}
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {skills.map((skill) => (
                <div key={skill.id} className="flex flex-col">
                  <div className="flex justify-between mb-1">
                    <div className="font-medium">{skill.name}</div>
                    <div className="text-sm" style={{ color: themeColor }}>
                      {getLevelPercentage(skill.level)}
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="h-2.5 rounded-full"
                      style={{
                        width: getLevelPercentage(skill.level),
                        backgroundColor: themeColor,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certificates Section */}
        {certificates && certificates.length > 0 && (
          <div className="p-6 bg-white rounded-lg shadow-md">
            <div
              className="pb-2 mb-4 text-xl font-bold"
              style={{ borderBottom: `2px solid ${themeColor}` }}
            >
              {titles.certificates}
            </div>
            <div className="space-y-6">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="relative pl-6 border-l-2"
                  style={{ borderColor: themeColor }}
                >
                  <div
                    className="absolute w-4 h-4 rounded-full -left-[9px] top-1"
                    style={{ backgroundColor: themeColor }}
                  ></div>
                  <div className="mb-1 text-sm font-medium text-gray-500">
                    {cert.date}
                  </div>
                  <div className="mb-1 text-lg font-bold">{cert.name}</div>
                  <div className="mb-2 italic font-medium text-gray-700">
                    {cert.organization}
                  </div>
                  <div className="text-gray-600">{cert.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Custom Sections */}
        {renderCustomSections()}
      </div>
    );

    // Professional template
    const renderProfessionalTemplate = () => (
      <>
        {/* Header with personal information */}
        <div
          className="flex items-center justify-between p-6 rounded-t-lg shadow-md"
          style={{ backgroundColor: themeColor }}
        >
          <div className="text-white">
            <h2 className="mb-2 text-2xl font-bold md:text-3xl">
              {personalInfo.fullName || "Họ và tên"}
            </h2>
            <div className="text-lg opacity-90">
              {personalInfo.jobTitle || "Chức danh - Kinh nghiệm"}
            </div>
          </div>

          {personalInfo.photoUrl && (
            <div className="ml-4">
              <div className="w-24 h-24 overflow-hidden border-4 rounded-full md:w-28 md:h-28 border-white/30">
                <img
                  src={personalInfo.photoUrl}
                  alt="Profile"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          )}
        </div>

        {/* Two-column layout for Professional */}
        <div className="flex flex-col gap-6 mt-6 md:flex-row">
          {/* Sidebar */}
          <div className="w-full space-y-6 md:w-1/3">
            {/* Contact Section */}
            <div className="overflow-hidden bg-white rounded-lg shadow-md">
              <div
                className="p-4 font-bold text-white"
                style={{ backgroundColor: themeColor }}
              >
                {titles.contact}
              </div>
              <div className="p-4 space-y-3">
                {personalInfo.phone && (
                  <div className="flex">
                    <span className="w-20 font-medium text-gray-600">SĐT:</span>
                    <span className="flex-1">{personalInfo.phone}</span>
                  </div>
                )}

                {personalInfo.email && (
                  <div className="flex">
                    <span className="w-20 font-medium text-gray-600">
                      Email:
                    </span>
                    <span className="flex-1 break-all">
                      {personalInfo.email}
                    </span>
                  </div>
                )}

                {personalInfo.address && (
                  <div className="flex">
                    <span className="w-20 font-medium text-gray-600">
                      Địa chỉ:
                    </span>
                    <span className="flex-1">{personalInfo.address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Personal Information Section */}
            <div className="overflow-hidden bg-white rounded-lg shadow-md">
              <div
                className="p-4 font-bold text-white"
                style={{ backgroundColor: themeColor }}
              >
                {titles.personalInfo}
              </div>
              <div className="p-4 space-y-3">
                {personalInfo.birthDate && (
                  <div className="flex flex-col">
                    <div className="font-medium" style={{ color: themeColor }}>
                      {titles.dateLabel}
                    </div>
                    <div className="mt-1">{personalInfo.birthDate}</div>
                  </div>
                )}
                {personalInfo.nationality && (
                  <div className="flex flex-col mt-3">
                    <div className="font-medium" style={{ color: themeColor }}>
                      {titles.localeLabel}
                    </div>
                    <div className="mt-1">{personalInfo.nationality}</div>
                  </div>
                )}
                {personalInfo.maritalStatus && (
                  <div className="flex flex-col mt-3">
                    <div className="font-medium" style={{ color: themeColor }}>
                      {titles.statusLabel}
                    </div>
                    <div className="mt-1">{personalInfo.maritalStatus}</div>
                  </div>
                )}
                {personalInfo.gender && (
                  <div className="flex flex-col mt-3">
                    <div className="font-medium" style={{ color: themeColor }}>
                      {titles.genderLabel}
                    </div>
                    <div className="mt-1">{personalInfo.gender}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Skills Section */}
            {skills && skills.length > 0 && (
              <div className="overflow-hidden bg-white rounded-lg shadow-md">
                <div
                  className="p-4 font-bold text-white"
                  style={{ backgroundColor: themeColor }}
                >
                  {titles.skills}
                </div>
                <div className="p-4 space-y-4">
                  {skills.map((skill) => (
                    <div key={skill.id} className="skill-item">
                      <div className="flex justify-between mb-2">
                        <div className="font-medium">{skill.name}</div>
                        <div className="text-sm opacity-75">
                          {getLevelPercentage(skill.level)}
                        </div>
                      </div>
                      <div className="flex gap-1.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div
                            key={i}
                            className={`h-2.5 w-full rounded`}
                            style={{
                              backgroundColor:
                                i < skill.level ? themeColor : "#e0e0e0",
                              opacity: i < skill.level ? 1 : 0.5,
                            }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="w-full space-y-6 md:w-2/3">
            {/* Career Objective Section */}
            <div className="overflow-hidden bg-white rounded-lg shadow-md">
              <div
                className="p-4 font-bold text-white"
                style={{ backgroundColor: themeColor }}
              >
                {titles.objective}
              </div>
              <div className="p-4">
                <Paragraph className="text-gray-700">
                  {personalInfo.objective ||
                    "Mục tiêu nghề nghiệp chưa được cập nhật."}
                </Paragraph>
              </div>
            </div>

            {/* Work Experience Section */}
            {workExperiences && workExperiences.length > 0 && (
              <div className="overflow-hidden bg-white rounded-lg shadow-md">
                <div
                  className="p-4 font-bold text-white"
                  style={{ backgroundColor: themeColor }}
                >
                  {titles.workExperience}
                </div>
                <div className="p-4 space-y-6">
                  {workExperiences.map((exp) => (
                    <div
                      key={exp.id}
                      className="pb-4 border-b border-gray-200 last:border-b-0"
                    >
                      <div className="flex flex-wrap justify-between mb-2">
                        <div
                          className="text-lg font-bold"
                          style={{ color: themeColor }}
                        >
                          {exp.companyName}
                        </div>
                        <div className="px-2 py-1 text-sm bg-gray-100 rounded">
                          {exp.startDate} - {exp.endDate}
                        </div>
                      </div>
                      <div className="mb-2 italic font-medium">
                        {exp.jobTitle}
                      </div>
                      <div className="text-gray-700">{exp.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certificates Section */}
            {certificates && certificates.length > 0 && (
              <div className="overflow-hidden bg-white rounded-lg shadow-md">
                <div
                  className="p-4 font-bold text-white"
                  style={{ backgroundColor: themeColor }}
                >
                  {titles.certificates}
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {certificates.map((cert) => (
                      <div
                        key={cert.id}
                        className="p-3 border rounded-lg"
                        style={{ borderColor: `${themeColor}40` }}
                      >
                        <div className="flex justify-between mb-2">
                          <div
                            className="font-bold"
                            style={{ color: themeColor }}
                          >
                            {cert.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {cert.date}
                          </div>
                        </div>
                        <div className="mb-2 text-sm font-medium">
                          {cert.organization}
                        </div>
                        <div className="text-sm text-gray-600">
                          {cert.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Custom Sections */}
            {renderCustomSections()}
          </div>
        </div>
      </>
    );

    // Creative template
    const renderCreativeTemplate = () => (
      <>
        {/* Header with personal information */}
        <div
          className="relative overflow-hidden "
          style={{
            backgroundColor: themeColor,
            padding: "20px",
          }}
        >
          <div className="z-10 flex items-center">
            {personalInfo.photoUrl && (
              <div className="mr-5">
                <div className="w-32 h-32 overflow-hidden rounded-full shadow-lg">
                  <img
                    src={personalInfo.photoUrl}
                    alt="Profile"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2 header-text">
              <h2
                className="mb-1 text-3xl font-bold text-white"
                style={{ letterSpacing: "1px", textTransform: "uppercase" }}
              >
                {personalInfo.fullName || "Họ và tên"}
              </h2>

              <div className="px-2 py-1 text-white rounded w-fit bg-white/20">
                {personalInfo.jobTitle || "Chức danh - Kinh nghiệm"}
              </div>
            </div>
          </div>
        </div>

        {/* Two-column layout for Creative */}
        <div className="flex mt-6">
          {/* Sidebar */}
          <div
            className="w-1/3 p-5 bg-white rounded-lg shadow-md creative-sidebar"
            style={{ backgroundColor: `${themeColor}20` }}
          >
            {/* Contact Info */}
            <div className="cv-section sidebar-section">
              <div
                className="text-lg font-bold section-title"
                style={{
                  borderLeft: `4px solid ${themeColor}`,
                  padding: "10px 15px",
                  marginBottom: "15px",
                }}
              >
                {titles.contact}
              </div>
              <div className="section-content contact-info-creative">
                {personalInfo.phone && (
                  <div className="flex items-center contact-item">
                    <span className="text-xl" style={{ color: themeColor }}>
                      📱
                    </span>
                    <span className="ml-2">{personalInfo.phone}</span>
                  </div>
                )}

                {personalInfo.email && (
                  <div className="flex items-center contact-item">
                    <span className="text-xl" style={{ color: themeColor }}>
                      ✉️
                    </span>
                    <span className="ml-2">{personalInfo.email}</span>
                  </div>
                )}

                {personalInfo.address && (
                  <div className="flex items-center contact-item">
                    <span className="text-xl" style={{ color: themeColor }}>
                      📍
                    </span>
                    <span className="ml-2">{personalInfo.address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Personal Information */}
            <div className="cv-section sidebar-section">
              <div
                className="text-lg font-bold section-title"
                style={{
                  borderLeft: `4px solid ${themeColor}`,
                  padding: "10px 15px",
                  marginBottom: "15px",
                }}
              >
                {titles.personalInfo}
              </div>
              <div className="section-content">
                <div className="personal-info-list-creative">
                  {personalInfo.birthDate && (
                    <div className="personal-info-item">
                      <div className="info-label" style={{ color: themeColor }}>
                        {titles.dateLabel}
                      </div>
                      <div className="info-value">{personalInfo.birthDate}</div>
                    </div>
                  )}
                  {personalInfo.nationality && (
                    <div className="personal-info-item">
                      <div className="info-label" style={{ color: themeColor }}>
                        {titles.localeLabel}
                      </div>
                      <div className="info-value">
                        {personalInfo.nationality}
                      </div>
                    </div>
                  )}
                  {personalInfo.maritalStatus && (
                    <div className="personal-info-item">
                      <div className="info-label" style={{ color: themeColor }}>
                        {titles.statusLabel}
                      </div>
                      <div className="info-value">
                        {personalInfo.maritalStatus}
                      </div>
                    </div>
                  )}
                  {personalInfo.gender && (
                    <div className="personal-info-item">
                      <div className="info-label" style={{ color: themeColor }}>
                        {titles.genderLabel}
                      </div>
                      <div className="info-value">{personalInfo.gender}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Skills */}
            {skills && skills.length > 0 && (
              <div className="cv-section sidebar-section">
                <div
                  className="text-lg font-bold section-title"
                  style={{
                    borderLeft: `4px solid ${themeColor}`,
                    padding: "10px 15px",
                    marginBottom: "15px",
                  }}
                >
                  {titles.skills}
                </div>
                <div className="section-content skills-list-creative">
                  {skills.map((skill) => (
                    <div key={skill.id} className="skill-item-creative">
                      <div className="skill-name">{skill.name}</div>
                      <div className="skill-level-creative">
                        <div
                          className="skill-level-bar"
                          style={{
                            width: getLevelPercentage(skill.level),
                            backgroundColor: themeColor,
                            height: "5px",
                            borderRadius: "2px",
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="w-2/3 p-5 creative-main">
            {/* Career Objective */}
            <div className="cv-section">
              <div
                className="text-lg font-bold section-title"
                style={{
                  borderLeft: `4px solid ${themeColor}`,
                  padding: "10px 15px",
                  marginBottom: "15px",
                }}
              >
                {titles.objective}
              </div>
              <div className="section-content">
                <Paragraph>
                  {personalInfo.objective ||
                    "Mục tiêu nghề nghiệp chưa được cập nhật."}
                </Paragraph>
              </div>
            </div>

            {/* Work Experience */}
            {workExperiences && workExperiences.length > 0 && (
              <div className="cv-section">
                <div
                  className="text-lg font-bold section-title"
                  style={{
                    borderLeft: `4px solid ${themeColor}`,
                    padding: "10px 15px",
                    marginBottom: "15px",
                  }}
                >
                  {titles.workExperience}
                </div>
                <div className="section-content creative-experience">
                  {workExperiences.map((exp) => (
                    <div key={exp.id} className="creative-experience-item">
                      <div
                        className="experience-date-badge"
                        style={{
                          backgroundColor: themeColor,
                          color: "white",
                          display: "inline-block",
                          padding: "5px 10px",
                          marginBottom: "10px",
                        }}
                      >
                        {exp.startDate} - {exp.endDate}
                      </div>
                      <div className="experience-content">
                        <div
                          className="company-name"
                          style={{ fontWeight: "bold", marginBottom: "5px" }}
                        >
                          {exp.companyName}
                        </div>
                        <div
                          className="job-title"
                          style={{ fontStyle: "italic", marginBottom: "10px" }}
                        >
                          {exp.jobTitle}
                        </div>
                        <div className="description">{exp.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certificates */}
            {certificates && certificates.length > 0 && (
              <div className="cv-section">
                <div
                  className="text-lg font-bold section-title"
                  style={{
                    borderLeft: `4px solid ${themeColor}`,
                    padding: "10px 15px",
                    marginBottom: "15px",
                  }}
                >
                  {titles.certificates}
                </div>
                <div className="section-content creative-certificates">
                  <div className="certificates-grid">
                    {certificates.map((cert) => (
                      <div
                        key={cert.id}
                        className="p-3 border rounded-lg certificate-card"
                        style={{
                          border: `1px solid ${themeColor}30`,
                          borderLeft: `3px solid ${themeColor}`,
                          marginBottom: "15px",
                        }}
                      >
                        <div
                          className="certificate-name"
                          style={{ fontWeight: "bold", marginBottom: "5px" }}
                        >
                          {cert.name}
                        </div>
                        <div className="certificate-meta">
                          <span className="organization-name">
                            {cert.organization}
                          </span>
                          <span className="certificate-date">
                            ({cert.date})
                          </span>
                        </div>
                        {cert.description && (
                          <div
                            className="description"
                            style={{ marginTop: "5px", fontSize: "0.9em" }}
                          >
                            {cert.description}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Custom Sections */}
            {renderCustomSections()}
          </div>
        </div>
      </>
    );

    // Minimal template
    const renderMinimalTemplate = () => (
      <div className="flex flex-col overflow-hidden bg-white rounded-lg shadow-sm">
        {/* Header với thông tin cá nhân */}
        <div className="p-6 border-b-2" style={{ borderColor: themeColor }}>
          <div className="flex flex-col items-center md:flex-row md:justify-between">
            <div className="mb-4 text-center md:text-left md:mb-0">
              <h2
                className="mb-2 text-2xl font-bold md:text-3xl"
                style={{ color: themeColor }}
              >
                {personalInfo.fullName || "Họ và tên"}
              </h2>

              <div className="mb-2 font-mono text-sm md:text-base">
                <span className="px-2 py-1 bg-gray-100 rounded-md">
                  {personalInfo.jobTitle || "Chức danh - Kinh nghiệm"}
                </span>
              </div>
            </div>

            {personalInfo.photoUrl && (
              <div className="mb-4 md:mb-0">
                <div
                  className="w-24 h-24 mx-auto overflow-hidden border-2 rounded-full"
                  style={{ borderColor: themeColor }}
                >
                  <img
                    src={personalInfo.photoUrl}
                    alt="Profile"
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div className="flex flex-wrap items-center justify-center gap-4 p-3 pt-4 mt-4 rounded-lg md:justify-start bg-gray-50">
            {personalInfo.phone && (
              <div className="flex items-center text-sm">
                <span
                  className="inline-flex items-center justify-center w-8 h-8 mr-2 rounded-full"
                  style={{
                    backgroundColor: `${themeColor}15`,
                    color: themeColor,
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </span>
                <span className="font-mono">{personalInfo.phone}</span>
              </div>
            )}

            {personalInfo.email && (
              <div className="flex items-center text-sm">
                <span
                  className="inline-flex items-center justify-center w-8 h-8 mr-2 rounded-full"
                  style={{
                    backgroundColor: `${themeColor}15`,
                    color: themeColor,
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </span>
                <span className="font-mono">{personalInfo.email}</span>
              </div>
            )}

            {personalInfo.address && (
              <div className="flex items-center text-sm">
                <span
                  className="inline-flex items-center justify-center w-8 h-8 mr-2 rounded-full"
                  style={{
                    backgroundColor: `${themeColor}15`,
                    color: themeColor,
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <span className="font-mono">{personalInfo.address}</span>
              </div>
            )}
          </div>
        </div>

        {/* Main content */}
        <div className="p-6 space-y-8">
          {/* Career Objective Section */}
          <div className="cv-section">
            <div className="flex items-center mb-4">
              <div
                className="w-1 h-6 mr-2 rounded"
                style={{ backgroundColor: themeColor }}
              ></div>
              <h3
                className="text-sm font-bold tracking-wider uppercase"
                style={{ color: themeColor }}
              >
                {titles.objective}
              </h3>
            </div>
            <div className="pl-3 border-l-2 border-gray-100">
              <Paragraph className="font-mono text-gray-700">
                {personalInfo.objective ||
                  "Mục tiêu nghề nghiệp chưa được cập nhật."}
              </Paragraph>
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="cv-section">
            <div className="flex items-center mb-4">
              <div
                className="w-1 h-6 mr-2 rounded"
                style={{ backgroundColor: themeColor }}
              ></div>
              <h3
                className="text-sm font-bold tracking-wider uppercase"
                style={{ color: themeColor }}
              >
                {titles.personalInfo}
              </h3>
            </div>
            <div className="pl-3 border-l-2 border-gray-100">
              <div className="grid grid-cols-1 gap-4 p-4 font-mono text-sm rounded-md md:grid-cols-2 bg-gray-50">
                {personalInfo.birthDate && (
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 mr-2 rounded-full"
                      style={{ backgroundColor: themeColor }}
                    ></div>
                    <span className="mr-2 font-medium">Ngày sinh:</span>
                    <span>{personalInfo.birthDate}</span>
                  </div>
                )}
                {personalInfo.nationality && (
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 mr-2 rounded-full"
                      style={{ backgroundColor: themeColor }}
                    ></div>
                    <span className="mr-2 font-medium">Quốc tịch:</span>
                    <span>{personalInfo.nationality}</span>
                  </div>
                )}
                {personalInfo.maritalStatus && (
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 mr-2 rounded-full"
                      style={{ backgroundColor: themeColor }}
                    ></div>
                    <span className="mr-2 font-medium">Tình trạng:</span>
                    <span>{personalInfo.maritalStatus}</span>
                  </div>
                )}
                {personalInfo.gender && (
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 mr-2 rounded-full"
                      style={{ backgroundColor: themeColor }}
                    ></div>
                    <span className="mr-2 font-medium">Giới tính:</span>
                    <span>{personalInfo.gender}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Work Experience Section */}
          {workExperiences && workExperiences.length > 0 && (
            <div className="cv-section">
              <div className="flex items-center mb-4">
                <div
                  className="w-1 h-6 mr-2 rounded"
                  style={{ backgroundColor: themeColor }}
                ></div>
                <h3
                  className="text-sm font-bold tracking-wider uppercase"
                  style={{ color: themeColor }}
                >
                  {titles.workExperience}
                </h3>
              </div>
              <div className="pl-3 space-y-6 border-l-2 border-gray-100">
                {workExperiences.map((exp) => (
                  <div key={exp.id} className="minimal-experience-item">
                    <div className="flex flex-col mb-2 md:flex-row md:items-center md:justify-between">
                      <div
                        className="text-base font-bold md:text-lg"
                        style={{ color: themeColor }}
                      >
                        {exp.companyName}
                      </div>
                      <div className="inline-block px-2 py-1 mt-1 font-mono text-xs bg-gray-100 rounded md:mt-0">
                        {exp.startDate} - {exp.endDate}
                      </div>
                    </div>
                    <div className="mb-2 text-sm italic font-medium text-gray-600">
                      {exp.jobTitle}
                    </div>
                    <div className="pl-0 mt-2 text-sm text-gray-700 md:pl-4">
                      {exp.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Two-column layout for skills and certificates */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Skills Section */}
            {skills && skills.length > 0 && (
              <div className="cv-section">
                <div className="flex items-center mb-4">
                  <div
                    className="w-1 h-6 mr-2 rounded"
                    style={{ backgroundColor: themeColor }}
                  ></div>
                  <h3
                    className="text-sm font-bold tracking-wider uppercase"
                    style={{ color: themeColor }}
                  >
                    {titles.skills}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2 pl-3 border-l-2 border-gray-100">
                  {skills.map((skill) => (
                    <div
                      key={skill.id}
                      className="relative px-3 py-2 transition-all duration-200 rounded-md group hover:shadow-md bg-gray-50"
                      style={{
                        borderLeft: `2px solid ${themeColor}`,
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">{skill.name}</div>
                        <div
                          className="ml-2 text-xs px-1.5 py-0.5 rounded-sm"
                          style={{
                            backgroundColor: `${themeColor}15`,
                            color: themeColor,
                          }}
                        >
                          {skill.level}/5
                        </div>
                      </div>

                      <div className="mt-1.5 w-full bg-gray-200 rounded-full h-1">
                        <div
                          className="h-1 transition-all duration-200 rounded-full"
                          style={{
                            width: getLevelPercentage(skill.level),
                            backgroundColor: themeColor,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certificates Section */}
            {certificates && certificates.length > 0 && (
              <div className="cv-section">
                <div className="flex items-center mb-4">
                  <div
                    className="w-1 h-6 mr-2 rounded"
                    style={{ backgroundColor: themeColor }}
                  ></div>
                  <h3
                    className="text-sm font-bold tracking-wider uppercase"
                    style={{ color: themeColor }}
                  >
                    {titles.certificates}
                  </h3>
                </div>
                <div className="pl-3 space-y-3 border-l-2 border-gray-100">
                  {certificates.map((cert) => (
                    <div
                      key={cert.id}
                      className="p-3 transition-shadow duration-200 rounded-md bg-gray-50 hover:shadow-md"
                    >
                      <div
                        className="font-medium"
                        style={{ color: themeColor }}
                      >
                        {cert.name}
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-gray-500">
                        <span>{cert.organization}</span>
                        <span className="font-mono">{cert.date}</span>
                      </div>
                      {cert.description && (
                        <div className="mt-2 text-sm text-gray-600">
                          {cert.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Custom Sections */}
          {renderCustomSections()}
        </div>
      </div>
    );

    // Elegant template
    const renderElegantTemplate = () => (
      <>
        {/* Header với thông tin cá nhân - được sắp xếp lại */}
        <div
          className="flex items-start justify-between pb-5 mb-6 border-b-2"
          style={{ borderColor: themeColor }}
        >
          <div className="flex-1 pr-4">
            <div className="flex flex-col gap-2">
              <h2
                className="mb-1 text-2xl font-semibold md:text-3xl"
                style={{ color: themeColor }}
              >
                {personalInfo.fullName || "Họ và tên"}
              </h2>

              <div className="mb-4 text-base italic text-gray-600">
                {personalInfo.jobTitle || "Chức danh - Kinh nghiệm"}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 ">
              {personalInfo.phone && (
                <div className="flex items-center">
                  <span
                    className="mr-2 font-medium"
                    style={{ color: themeColor }}
                  >
                    Điện thoại:
                  </span>
                  <span>{personalInfo.phone}</span>
                </div>
              )}

              {personalInfo.email && (
                <div className="flex items-center">
                  <span
                    className="mr-2 font-medium"
                    style={{ color: themeColor }}
                  >
                    Email:
                  </span>
                  <span className="break-all">{personalInfo.email}</span>
                </div>
              )}

              {personalInfo.address && (
                <div className="flex items-center col-span-1 md:col-span-2">
                  <span
                    className="mr-2 font-medium"
                    style={{ color: themeColor }}
                  >
                    Địa chỉ:
                  </span>
                  <span>{personalInfo.address}</span>
                </div>
              )}
            </div>
          </div>

          {personalInfo.photoUrl && (
            <div className="flex-shrink-0">
              <div
                className="w-24 h-24 overflow-hidden rounded-full md:w-28 md:h-28 ring-2"
                style={{ ringColor: themeColor }}
              >
                <img
                  src={personalInfo.photoUrl}
                  alt="Profile"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          )}
        </div>

        {/* Two-column layout for Elegant */}
        <div className="flex flex-col gap-6 md:flex-row">
          {/* Left Column */}
          <div className="w-full md:w-1/3">
            {/* Career Objective Section */}
            <div className="mb-6">
              <div
                className="pb-2 mb-3 text-lg font-bold border-b-2"
                style={{ borderColor: themeColor, color: themeColor }}
              >
                {titles.objective}
              </div>
              <div className="prose max-w-none">
                <Paragraph>
                  {personalInfo.objective ||
                    "Mục tiêu nghề nghiệp chưa được cập nhật."}
                </Paragraph>
              </div>
            </div>

            {/* Personal Information Section */}
            <div className="mb-6">
              <div
                className="pb-2 mb-3 text-lg font-bold border-b-2"
                style={{ borderColor: themeColor, color: themeColor }}
              >
                {titles.personalInfo}
              </div>
              <div className="space-y-3">
                {personalInfo.birthDate && (
                  <div>
                    <div className="mb-1 font-bold">{titles.dateLabel}</div>
                    <div>{personalInfo.birthDate}</div>
                  </div>
                )}
                {personalInfo.nationality && (
                  <div>
                    <div className="mb-1 font-bold">{titles.localeLabel}</div>
                    <div>{personalInfo.nationality}</div>
                  </div>
                )}
                {personalInfo.maritalStatus && (
                  <div>
                    <div className="mb-1 font-bold">{titles.statusLabel}</div>
                    <div>{personalInfo.maritalStatus}</div>
                  </div>
                )}
                {personalInfo.gender && (
                  <div>
                    <div className="mb-1 font-bold">{titles.genderLabel}</div>
                    <div>{personalInfo.gender}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Skills Section */}
            {skills && skills.length > 0 && (
              <div className="mb-6">
                <div
                  className="pb-2 mb-3 text-lg font-bold border-b-2"
                  style={{ borderColor: themeColor, color: themeColor }}
                >
                  {titles.skills}
                </div>
                <div className="space-y-4">
                  {skills.map((skill) => (
                    <div key={skill.id}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-bold">{skill.name}</div>
                        <div
                          className="text-sm italic"
                          style={{ color: themeColor }}
                        >
                          {skill.level}/5
                        </div>
                      </div>
                      <div className="bg-gray-100 h-1.5 rounded-full w-full">
                        <div
                          className="h-1.5 rounded-full skill-level-bar"
                          style={{
                            width: getLevelPercentage(skill.level),
                            backgroundColor: themeColor,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div
            className="w-full md:w-2/3 md:border-l md:pl-6"
            style={{ borderColor: `${themeColor}30` }}
          >
            {/* Work Experience Section */}
            {workExperiences && workExperiences.length > 0 && (
              <div className="mb-6">
                <div
                  className="pb-2 mb-3 text-lg font-bold border-b-2"
                  style={{ borderColor: themeColor, color: themeColor }}
                >
                  {titles.workExperience}
                </div>
                <div className="p-4 space-y-6">
                  {workExperiences.map((exp) => (
                    <div
                      key={exp.id}
                      className="pb-4 border-b border-gray-200 last:border-b-0"
                    >
                      <div className="flex flex-wrap justify-between mb-2">
                        <div
                          className="text-lg font-bold"
                          style={{ color: themeColor }}
                        >
                          {exp.companyName}
                        </div>
                        <div className="px-2 py-1 text-sm bg-gray-100 rounded">
                          {exp.startDate} - {exp.endDate}
                        </div>
                      </div>
                      <div className="mb-2 italic font-medium">
                        {exp.jobTitle}
                      </div>
                      <div className="text-gray-700">{exp.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certificates Section */}
            {certificates && certificates.length > 0 && (
              <div className="mb-6">
                <div
                  className="pb-2 mb-3 text-lg font-bold border-b-2"
                  style={{ borderColor: themeColor, color: themeColor }}
                >
                  {titles.certificates}
                </div>
                <div className="space-y-4">
                  {certificates.map((cert) => (
                    <div key={cert.id} className="relative pl-5">
                      <div
                        className="absolute w-2.5 h-2.5 rounded-full left-0 top-1.5"
                        style={{ backgroundColor: themeColor }}
                      ></div>
                      <div className="font-bold">{cert.name}</div>
                      <div className="flex justify-between mt-1 text-sm text-gray-500">
                        <span>{cert.organization}</span>
                        <span className="font-mono">{cert.date}</span>
                      </div>
                      {cert.description && (
                        <div className="mt-1 text-sm italic text-gray-600">
                          {cert.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Sections */}
            {renderCustomSections()}
          </div>
        </div>
      </>
    );

    // Function to render the appropriate template based on template ID
    const renderTemplate = () => {
      switch (currentTemplate.id) {
        case "professional":
          return renderProfessionalTemplate();
        case "creative":
          return renderCreativeTemplate();
        case "minimal":
          return renderMinimalTemplate();
        case "elegant":
          return renderElegantTemplate();
        case "modern":
        default:
          return renderModernTemplate();
      }
    };

    return (
      <div className={`cv-preview ${templateClass}`} ref={contentRef}>
        <div
          className="preview-content"
          style={{
            fontFamily: currentTemplate.font,
            fontSize: `${currentTemplate.fontSize}px`,
          }}
        >
          {renderTemplate()}
        </div>
      </div>
    );
  }
);

CVPreview.displayName = "CVPreview";

export default CVPreview;
