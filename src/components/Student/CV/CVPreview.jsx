import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
} from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useTranslation } from "react-i18next";
import "./CVPreview.scss";

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
    // Helper function to get section titles based on template
    const getSectionTitles = (templateId) => {
      switch (templateId) {
        case "elegant":
          return {
            objective: "cv.sections.objective",
            personalInfo: "cv.sections.personalInfo",
            workExperience: "cv.sections.workExperience.elegant",
            skills: "cv.sections.skills",
            certificates: "cv.sections.certificates.elegant",
            contact: "cv.sections.contact.elegant",
            profileLabel: "cv.labels.profileLabel.elegant",
            dateLabel: "cv.labels.dateLabel",
            localeLabel: "cv.labels.localeLabel",
            genderLabel: "cv.labels.genderLabel",
            statusLabel: "cv.labels.statusLabel",
          };
        case "modern":
        default:
          return {
            objective: "cv.sections.objective",
            personalInfo: "cv.sections.personalInfo",
            workExperience: "cv.sections.workExperience",
            skills: "cv.sections.skills",
            certificates: "cv.sections.certificates",
            contact: "cv.sections.contact",
            profileLabel: "cv.labels.profileLabel.modern",
            dateLabel: "cv.labels.dateLabel",
            localeLabel: "cv.labels.localeLabel",
            genderLabel: "cv.labels.genderLabel",
            statusLabel: "cv.labels.statusLabel",
          };
      }
    };
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
    const renderCustomSectionsModern = () => (
      <>
        {sections.map((section) => (
          <div key={section.id} className="p-6 bg-white rounded-lg shadow-md">
            <div
              className="pb-2 mb-4 text-xl font-bold"
              style={{ borderBottom: `2px solid ${themeColor}` }}
            >
              {section.title}
            </div>
            <div className="space-y-6">
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
                <pre className="break-words whitespace-pre-wrap">
                  {section.content?.text}
                </pre>
              )}
            </div>
          </div>
        ))}
      </>
    );
    const renderCustomSectionsElegant = () => (
      <>
        {sections.map((section) => (
          <div key={section.id} className="mb-6">
            <div
              className="pb-2 mb-3 text-lg font-bold border-b-2"
              style={{ borderColor: themeColor, color: themeColor }}
            >
              {section.title}
            </div>
            <div className="space-y-4">
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
                <div className="relative pl-5">
                  <pre className="mt-1 text-sm break-words whitespace-pre-wrap">
                    {section.content?.text}
                  </pre>
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
                {personalInfo.fullName || t("cv.labels.fullNameLabel")}
              </h2>

              <div className="mb-4 text-lg font-medium text-gray-700">
                {personalInfo.jobTitle || t("cv.labels.jobTitleLabel")}
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
            {t(titles.objective)}
          </div>
          <div className="prose max-w-none">
            <pre className="break-words whitespace-pre-wrap">
              {personalInfo.objective || t("cv.labels.objectiveLabel")}
            </pre>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <div
            className="pb-2 mb-4 text-xl font-bold"
            style={{ borderBottom: `2px solid ${themeColor}` }}
          >
            {t(titles.personalInfo)}
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {personalInfo.birthDate && (
              <div className="flex flex-col">
                <div className="font-medium text-gray-600">
                  {t(titles.dateLabel)}
                </div>
                <div>{personalInfo.birthDate}</div>
              </div>
            )}
            {personalInfo.nationality && (
              <div className="flex flex-col">
                <div className="font-medium text-gray-600">
                  {t(titles.localeLabel)}
                </div>
                <div>{personalInfo.nationality}</div>
              </div>
            )}
            {personalInfo.maritalStatus && (
              <div className="flex flex-col">
                <div className="font-medium text-gray-600">
                  {t(titles.statusLabel)}
                </div>
                <div>{personalInfo.maritalStatus}</div>
              </div>
            )}
            {personalInfo.gender && (
              <div className="flex flex-col">
                <div className="font-medium text-gray-600">
                  {t(titles.genderLabel)}
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
              {t(titles.workExperience)}
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
                  <pre className="text-gray-600 break-words whitespace-pre-wrap">
                    {exp.description}
                  </pre>
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
              {t(titles.skills)}
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
              {t(titles.certificates)}
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
                  <pre className="text-gray-600 break-words whitespace-pre-wrap">
                    {cert.description}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Custom Sections */}
        {renderCustomSectionsModern()}
      </div>
    );

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
                {personalInfo.fullName || t("cv.labels.fullNameLabel")}
              </h2>

              <div className="mb-4 text-base italic text-gray-600">
                {personalInfo.jobTitle || t("cv.labels.jobTitleLabel")}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 ">
              {personalInfo.phone && (
                <div className="flex items-center">
                  <span
                    className="mr-2 font-medium"
                    style={{ color: themeColor }}
                  >
                    {t("cv.labels.phoneLabel")}
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
                    {t("cv.labels.emailLabel")}
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
                    {t("cv.labels.addressLabel")}
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
                {t(titles.objective)}
              </div>
              <div className="prose max-w-none">
                <pre className="break-words whitespace-pre-wrap">
                  {personalInfo.objective ||
                    t("cv.sections.objectivePlaceholder")}
                </pre>
              </div>
            </div>

            {/* Personal Information Section */}
            <div className="mb-6">
              <div
                className="pb-2 mb-3 text-lg font-bold border-b-2"
                style={{ borderColor: themeColor, color: themeColor }}
              >
                {t(titles.personalInfo)}
              </div>
              <div className="space-y-3">
                {personalInfo.birthDate && (
                  <div>
                    <div className="mb-1 font-bold">{t(titles.dateLabel)}</div>
                    <div>{personalInfo.birthDate}</div>
                  </div>
                )}
                {personalInfo.nationality && (
                  <div>
                    <div className="mb-1 font-bold">
                      {t(titles.localeLabel)}
                    </div>
                    <div>{personalInfo.nationality}</div>
                  </div>
                )}
                {personalInfo.maritalStatus && (
                  <div>
                    <div className="mb-1 font-bold">
                      {t(titles.statusLabel)}
                    </div>
                    <div>{personalInfo.maritalStatus}</div>
                  </div>
                )}
                {personalInfo.gender && (
                  <div>
                    <div className="mb-1 font-bold">
                      {t(titles.genderLabel)}
                    </div>
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
                  {t(titles.skills)}
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
                  {t(titles.workExperience)}
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
                      <pre className="text-gray-700 break-words whitespace-pre-wrap">
                        {exp.description}
                      </pre>
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
                  {t(titles.certificates)}
                </div>
                <div className="space-y-4">
                  {certificates.map((cert) => (
                    <div key={cert.id} className="relative pl-5">
                      <div className="flex items-center justify-between mb-2 text-sm text-gray-500">
                        <div
                          className="text-lg font-bold"
                          style={{ color: themeColor }}
                        >
                          {cert.organization}
                        </div>
                        <span className="font-mono">{cert.date}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="font-bold">{cert.name}</div>
                        <div>
                          <span>{t("cv.labels.scoreLabel")}</span> {cert.score}
                        </div>
                      </div>
                      {cert.description && (
                        <pre className="mt-1 text-sm italic text-gray-600 break-words whitespace-pre-wrap">
                          {cert.description}
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Sections */}
            {renderCustomSectionsElegant()}
          </div>
        </div>
      </>
    );

    // Function to render the appropriate template based on template ID
    const renderTemplate = () => {
      switch (currentTemplate.id) {
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
