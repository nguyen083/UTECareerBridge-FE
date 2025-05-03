import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
import { Typography, Divider } from 'antd';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useTranslation } from 'react-i18next';
import './CVPreview.scss';

const { Title, Text, Paragraph } = Typography;

// Helper function to convert skill level to percentage
const getLevelPercentage = (level) => {
  switch (level?.toLowerCase()) {
    case 'beginner': return '25%';
    case 'intermediate': return '50%';
    case 'advanced': return '75%';
    case 'expert': return '100%';
    default: return '50%';
  }
};

// Helper function to convert skill level to number of dots (1-5)
const getLevelDots = (level) => {
  switch (level?.toLowerCase()) {
    case 'beginner': return 1;
    case 'intermediate': return 2;
    case 'advanced': return 4;
    case 'expert': return 5;
    default: return 3;
  }
};

// Helper function to get section titles based on template
const getSectionTitles = (templateId) => {
  switch (templateId) {
    case 'professional':
      return {
        objective: 'MỤC TIÊU NGHỀ NGHIỆP',
        personalInfo: 'THÔNG TIN CÁ NHÂN',
        workExperience: 'KINH NGHIỆM LÀM VIỆC',
        skills: 'KỸ NĂNG CHUYÊN MÔN',
        certificates: 'CHỨNG CHỈ CHUYÊN MÔN',
        contact: 'LIÊN HỆ',
        profileLabel: 'Hồ sơ chuyên môn',
        dateLabel: 'Ngày:',
        localeLabel: 'Quốc tịch:',
        genderLabel: 'Giới tính:',
        statusLabel: 'Tình trạng:',
      };
    case 'creative':
      return {
        objective: 'MỤC TIÊU NGHỀ NGHIỆP',
        personalInfo: 'THÔNG TIN CÁ NHÂN',
        workExperience: 'KINH NGHIỆM SÁNG TẠO',
        skills: 'KỸ NĂNG THIẾT KẾ',
        certificates: 'CHỨNG CHỈ CHUYÊN MÔN',
        contact: 'LIÊN HỆ',
        profileLabel: 'Tiểu sử sáng tạo',
        dateLabel: 'Ngày sinh:',
        localeLabel: 'Quốc tịch:',
        genderLabel: 'Giới tính:',
        statusLabel: 'Tình trạng hôn nhân:',
      };
    case 'minimal':
      return {
        objective: 'PROFILE',
        personalInfo: 'THÔNG TIN CÁ NHÂN',
        workExperience: 'EXPERIENCE',
        skills: 'TECH STACK',
        certificates: 'CERTIFICATIONS',
        contact: 'CONTACT',
        profileLabel: 'Developer Profile',
        dateLabel: 'Date:',
        localeLabel: 'Locale:',
        genderLabel: 'Gender:',
        statusLabel: 'Status:',
      };
    case 'elegant':
      return {
        objective: 'LỜI GIỚI THIỆU',
        personalInfo: 'THÔNG TIN CÁ NHÂN',
        workExperience: 'KINH NGHIỆM CHUYÊN MÔN',
        skills: 'KỸ NĂNG CHUYÊN MÔN',
        certificates: 'CHỨNG CHỈ & BẰNG CẤP',
        contact: 'THÔNG TIN LIÊN HỆ',
        profileLabel: 'Chuyên môn',
        dateLabel: 'Ngày sinh:',
        localeLabel: 'Quốc tịch:',
        genderLabel: 'Giới tính:',
        statusLabel: 'Tình trạng hôn nhân:',
      };
    case 'modern':
    default:
      return {
        objective: 'MỤC TIÊU NGHỀ NGHIỆP',
        personalInfo: 'THÔNG TIN CÁ NHÂN',
        workExperience: 'KINH NGHIỆM LÀM VIỆC',
        skills: 'KỸ NĂNG',
        certificates: 'CHỨNG CHỈ',
        contact: 'LIÊN HỆ',
        profileLabel: 'Hồ sơ',
        dateLabel: 'Ngày sinh:',
        localeLabel: 'Quốc tịch:',
        genderLabel: 'Giới tính:',
        statusLabel: 'Tình trạng hôn nhân:',
      };
  }
};

const CVPreview = forwardRef(({ 
  personalInfo = {},
  workExperiences = [],
  certificates = [],
  skills = [],
  sections = [],
  template = {
    id: 'modern',
    color: '#f57c00',
    font: "'Open Sans', sans-serif",
    fontSize: 12
  }
}, ref) => {
  const { t } = useTranslation();
  const contentRef = useRef(null);
  const [isRendering, setIsRendering] = useState(false);
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
    const images = contentRef.current?.querySelectorAll('img') || [];
    await Promise.all(
      Array.from(images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => {
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
      setIsRendering(true);
      
      // Lưu style gốc để khôi phục sau khi tạo PDF
      const originalDisplay = contentRef.current.style.display;
      const originalOpacity = contentRef.current.style.opacity;
      const originalPosition = contentRef.current.style.position;
      const originalVisibility = contentRef.current.style.visibility;
      const originalWidth = contentRef.current.style.width;
      const originalTransform = contentRef.current.style.transform;
      const originalMaxWidth = contentRef.current.style.maxWidth;
      
      // Force proper display với kích thước cho rendering
      contentRef.current.style.display = 'block';
      contentRef.current.style.opacity = '1';
      contentRef.current.style.position = 'relative'; 
      contentRef.current.style.visibility = 'visible';
      contentRef.current.style.width = '210mm'; // Chiều rộng A4
      contentRef.current.style.maxWidth = '210mm'; // Chiều rộng tối đa A4
      contentRef.current.style.transform = 'none';
      
      // Áp dụng font và style cho root element
      contentRef.current.style.fontFamily = currentTemplate.font;
      contentRef.current.style.fontSize = `${currentTemplate.fontSize}px`;
      
      // Đợi ảnh và font load xong
      await waitForImages();
      await document.fonts.ready;
      
      // Thêm delay để đảm bảo rendering
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const element = contentRef.current;
      const rect = element.getBoundingClientRect();
      
      if (rect.width <= 0 || rect.height <= 0) {
        throw new Error("CV content has no dimensions. Make sure it's visible.");
      }
      
      // Tạo đối tượng PDF mới
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
        putOnlyUsedFonts: true,
      });
      
      // Tính toán kích thước và tỷ lệ
      const pdfWidth = pdf.internal.pageSize.getWidth(); // A4 width in mm
      const pdfHeight = pdf.internal.pageSize.getHeight(); // A4 height in mm
      
      // Sử dụng tỷ lệ cao hơn để chất lượng tốt hơn
      const scaleValue = 4; // Tăng scale cho chất lượng tốt hơn
      
      // Tạo một phiên bản sao chép của DOM trước, thực hiện các điều chỉnh style chi tiết
      const domClone = document.createElement('div');
      domClone.appendChild(element.cloneNode(true));
      const cloneElement = domClone.firstChild;
      
      // Đặt style cho clone để đảm bảo kích thước và style chính xác
      cloneElement.style.width = '210mm';
      cloneElement.style.margin = '0';
      cloneElement.style.padding = '0';
      cloneElement.style.fontFamily = currentTemplate.font;
      cloneElement.style.fontSize = `${currentTemplate.fontSize}px`;
      cloneElement.style.boxSizing = 'border-box';
      cloneElement.style.transform = 'none';
      cloneElement.style.position = 'relative';
      
      // Xử lý các phần tử con
      const processAllChildElements = (parent) => {
        const elements = parent.querySelectorAll('*');
        elements.forEach(el => {
          // Đảm bảo font thống nhất
          if (!(el instanceof HTMLImageElement)) {
            el.style.fontFamily = currentTemplate.font;
          }
          
          // Tuỳ chỉnh style cho tiêu đề mục
          if (el.classList.contains('section-title')) {
            el.style.fontWeight = 'bold';
            el.style.fontSize = `${parseInt(currentTemplate.fontSize) + 2}px`;
            el.style.borderBottomWidth = '2px';
            el.style.borderBottomStyle = 'solid';
            el.style.borderBottomColor = themeColor;
            el.style.paddingBottom = '5px';
            el.style.marginBottom = '15px';
          }
          
          // Đảm bảo không phần tử nào bị phóng to
          el.style.transform = 'none';
          el.style.zoom = '1';
          el.style.boxSizing = 'border-box';
          
          // Xử lý grid và flex một cách tường minh
          const computedStyle = window.getComputedStyle(el);
          
          // Xử lý flexbox
          if (computedStyle.display === 'flex') {
            el.style.display = 'flex';
            el.style.flexDirection = computedStyle.flexDirection;
            el.style.justifyContent = computedStyle.justifyContent;
            el.style.alignItems = computedStyle.alignItems;
            el.style.flexWrap = computedStyle.flexWrap;
            
            // Đảm bảo các phần tử con trong flex container có kích thước chính xác
            Array.from(el.children).forEach(child => {
              child.style.boxSizing = 'border-box';
              
              // Lấy các thông số flex thực tế từ computed style
              const childStyle = window.getComputedStyle(child);
              if (childStyle.flexBasis !== 'auto') {
                child.style.flexBasis = childStyle.flexBasis;
              }
              if (childStyle.flexGrow !== '0') {
                child.style.flexGrow = childStyle.flexGrow;
              }
              if (childStyle.flexShrink !== '1') {
                child.style.flexShrink = childStyle.flexShrink;
              }
              
              // Đảm bảo kích thước thực tế được áp dụng
              child.style.width = childStyle.width;
              child.style.height = childStyle.height;
            });
          }
          
          // Xử lý grid
          if (computedStyle.display === 'grid') {
            el.style.display = 'grid';
            el.style.gridTemplateColumns = computedStyle.gridTemplateColumns;
            el.style.gridTemplateRows = computedStyle.gridTemplateRows;
            el.style.gridGap = computedStyle.gridGap;
          }
          
          // Đảm bảo các giá trị width và height được áp dụng chính xác
          if (computedStyle.width && !computedStyle.width.includes('auto')) {
            // Chuyển đổi % thành px
            if (computedStyle.width.includes('%')) {
              const parentWidth = el.parentElement.getBoundingClientRect().width;
              const percentage = parseFloat(computedStyle.width) / 100;
              el.style.width = `${parentWidth * percentage}px`;
            } else {
              el.style.width = computedStyle.width;
            }
          }
          
          if (computedStyle.height && !computedStyle.height.includes('auto')) {
            if (computedStyle.height.includes('%')) {
              const parentHeight = el.parentElement.getBoundingClientRect().height;
              const percentage = parseFloat(computedStyle.height) / 100;
              el.style.height = `${parentHeight * percentage}px`;
            } else {
              el.style.height = computedStyle.height;
            }
          }
          
          // Đảm bảo margin và padding được áp dụng chính xác
          el.style.margin = computedStyle.margin;
          el.style.padding = computedStyle.padding;
          
          // Bảo toàn màu sắc và các thuộc tính hiển thị khác
          el.style.color = computedStyle.color;
          el.style.backgroundColor = computedStyle.backgroundColor;
          el.style.borderRadius = computedStyle.borderRadius;
          
          // Áp dụng các thuộc tính văn bản
          el.style.lineHeight = computedStyle.lineHeight;
          el.style.textAlign = computedStyle.textAlign;
          el.style.fontWeight = computedStyle.fontWeight;
          el.style.fontStyle = computedStyle.fontStyle;
        });
      };
      
      // Xử lý các template cụ thể
      const templateSpecificAdjustments = (cloneEl) => {
        // Xử lý template Professional và Elegant có cấu trúc cột
        if (cloneEl.classList.contains('template-professional') || 
            cloneEl.classList.contains('template-elegant')) {
          const layoutContainer = cloneEl.querySelector('.professional-layout') || 
                                 cloneEl.querySelector('.elegant-two-column');
          
          if (layoutContainer) {
            layoutContainer.style.display = 'flex';
            layoutContainer.style.flexDirection = 'row';
            layoutContainer.style.minHeight = 'auto';
            
            // Xử lý sidebar/left column
            const sidebar = layoutContainer.querySelector('.professional-sidebar') || 
                           layoutContainer.querySelector('.elegant-left-column');
            if (sidebar) {
              sidebar.style.width = '30%';
              sidebar.style.boxSizing = 'border-box';
              
              // Đảm bảo tất cả các phần tử trong sidebar có kích thước phù hợp
              const sections = sidebar.querySelectorAll('[class*="section"]');
              sections.forEach(section => {
                section.style.width = '100%';
                section.style.boxSizing = 'border-box';
              });
            }
            
            // Xử lý main/right column
            const main = layoutContainer.querySelector('.professional-main') || 
                        layoutContainer.querySelector('.elegant-right-column');
            if (main) {
              main.style.flex = '1';
              main.style.boxSizing = 'border-box';
            }
          }
        }
        
        // Xử lý template Creative có cấu trúc cột đặc biệt
        if (cloneEl.classList.contains('template-creative')) {
          const creativeContent = cloneEl.querySelector('.creative-content');
          if (creativeContent) {
            creativeContent.style.display = 'flex';
            creativeContent.style.minHeight = 'auto';
            
            const sidebar = creativeContent.querySelector('.creative-sidebar');
            if (sidebar) {
              sidebar.style.width = '35%';
              sidebar.style.boxSizing = 'border-box';
            }
            
            const main = creativeContent.querySelector('.creative-main');
            if (main) {
              main.style.flex = '1';
              main.style.boxSizing = 'border-box';
            }
          }
        }
        
        // Xử lý skill bars trong tất cả các template
        const skillBars = cloneEl.querySelectorAll('.skill-level-bar');
        skillBars.forEach(bar => {
          bar.style.width = bar.style.width || '';
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
        backgroundColor: '#ffffff',
        logging: false,
        imageTimeout: 15000,
        scrollX: 0,
        scrollY: 0,
        windowWidth: document.documentElement.offsetWidth,
        windowHeight: document.documentElement.offsetHeight
      });
      
      // Xóa DOM clone
      document.body.removeChild(domClone);
      
      // Lấy dữ liệu hình ảnh chất lượng cao
      const imgData = fullCanvas.toDataURL('image/jpeg', 1.0);
      
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
          const tempCanvas = document.createElement('canvas');
          const ctx = tempCanvas.getContext('2d');
          tempCanvas.width = fullCanvas.width;
          tempCanvas.height = sourceHeight;
          
          // Nền trắng
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
          
          // Vẽ phần thích hợp từ canvas đầy đủ
          ctx.drawImage(
            fullCanvas,
            0, sourceY,
            fullCanvas.width, sourceHeight,
            0, 0,
            tempCanvas.width, tempCanvas.height
          );
          
          // Thêm vào PDF với kích thước phù hợp
          const pageImgData = tempCanvas.toDataURL('image/jpeg', 1.0);
          pdf.addImage(pageImgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        }
      } else {
        // Nội dung vừa 1 trang
        pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
      }
      
      // Khôi phục style gốc
      contentRef.current.style.display = originalDisplay;
      contentRef.current.style.opacity = originalOpacity;
      contentRef.current.style.position = originalPosition;
      contentRef.current.style.visibility = originalVisibility;
      contentRef.current.style.width = originalWidth;
      contentRef.current.style.transform = originalTransform;
      contentRef.current.style.maxWidth = originalMaxWidth;
      
      setIsRendering(false);
      return pdf;
    } catch (error) {
      console.error("Error creating PDF:", error);
      setIsRendering(false);
      return null;
    }
  };

  useImperativeHandle(ref, () => ({
    // Main method to preview CV in new tab
    previewCV: async () => {
      try {
        const pdf = await createPDF();
        if (pdf) {
          const pdfBlob = pdf.output('blob');
          const pdfUrl = URL.createObjectURL(pdfBlob);
          window.open(pdfUrl, '_blank');
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
        return pdf ? pdf.output('blob') : null;
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
          pdf.save(filename || 'cv.pdf');
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
          setTitles(getSectionTitles(newTemplate.id || 'modern'));
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
          const pdfBlob = pdf.output('blob');
          const pdfUrl = URL.createObjectURL(pdfBlob);
          window.open(pdfUrl, '_blank');
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error opening CV in new tab:", error);
        return false;
      }
    }
  }));

  const templateClass = `template-${currentTemplate?.id || 'modern'}`;
  const themeColor = currentTemplate?.color || '#f57c00';

  // Helper function to render custom sections
  const renderCustomSections = () => (
    <>
      {sections.map((section) => (
        <div key={section.id} className="cv-section">
          <div className="section-title" style={{ borderBottomColor: themeColor }}>
            {section.title}
          </div>
          <div className="section-content custom-section-content">
            {section.content?.items?.length > 0 ? (
              section.content.items.map((item, index) => (
                <div key={index} className="custom-item">
                  {item.title && <div className="custom-item-title">{item.title}</div>}
                  {item.subtitle && <div className="custom-item-subtitle">{item.subtitle}</div>}
                  {item.description && <div className="custom-item-description">{item.description}</div>}
                </div>
              ))
            ) : (
              <div>{section.content?.text || 'Nội dung chưa được cập nhật.'}</div>
            )}
          </div>
        </div>
      ))}
    </>
  );
  
  // Modern template (default)
  const renderModernTemplate = () => (
    <>
      {/* Header with personal information */}
      <div className="cv-header" style={{ backgroundColor: `${themeColor}10` }}>
        <div className="header-content">
          {personalInfo.photoUrl && (
            <div className="profile-photo-container">
              <div className="profile-photo" style={{ border: `3px solid ${themeColor}` }}>
                <img src={personalInfo.photoUrl} alt="Profile" />
              </div>
            </div>
          )}
          
          <div className="personal-details">
            <h2 className="full-name" style={{ color: themeColor }}>
              {personalInfo.fullName || 'Họ và tên'}
            </h2>
            
            <div className="job-title">
              {personalInfo.jobTitle || 'Chức danh - Kinh nghiệm'}
            </div>
            
            <div className="contact-info">
              {personalInfo.phone && (
                <div className="contact-item">
                  <span className="contact-icon" style={{ color: themeColor }}>📱</span>
                  <span className="contact-text">{personalInfo.phone}</span>
                </div>
              )}
              
              {personalInfo.email && (
                <div className="contact-item">
                  <span className="contact-icon" style={{ color: themeColor }}>✉️</span>
                  <span className="contact-text">{personalInfo.email}</span>
                </div>
              )}
              
              {personalInfo.address && (
                <div className="contact-item">
                  <span className="contact-icon" style={{ color: themeColor }}>📍</span>
                  <span className="contact-text">{personalInfo.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Career Objective Section */}
      <div className="cv-section">
        <div className="section-title" style={{ borderBottomColor: themeColor }}>
          {titles.objective}
        </div>
        <div className="section-content">
          <Paragraph>{personalInfo.objective || 'Mục tiêu nghề nghiệp chưa được cập nhật.'}</Paragraph>
        </div>
      </div>
      
      {/* Personal Information Section */}
      <div className="cv-section">
        <div className="section-title" style={{ borderBottomColor: themeColor }}>
          {titles.personalInfo}
        </div>
        <div className="section-content">
          <div className="personal-info-grid">
            {personalInfo.birthDate && (
              <div className="personal-info-item">
                <div className="info-label">{titles.dateLabel}</div>
                <div className="info-value">{personalInfo.birthDate}</div>
              </div>
            )}
            {personalInfo.nationality && (
              <div className="personal-info-item">
                <div className="info-label">{titles.localeLabel}</div>
                <div className="info-value">{personalInfo.nationality}</div>
              </div>
            )}
            {personalInfo.maritalStatus && (
              <div className="personal-info-item">
                <div className="info-label">{titles.statusLabel}</div>
                <div className="info-value">{personalInfo.maritalStatus}</div>
              </div>
            )}
            {personalInfo.gender && (
              <div className="personal-info-item">
                <div className="info-label">{titles.genderLabel}</div>
                <div className="info-value">{personalInfo.gender}</div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Work Experience Section */}
      {workExperiences && workExperiences.length > 0 && (
        <div className="cv-section">
          <div className="section-title" style={{ borderBottomColor: themeColor }}>
            {titles.workExperience}
          </div>
          <div className="section-content timeline-section">
            {workExperiences.map((exp) => (
              <div key={exp.id} className="timeline-item">
                <div className="timeline-point" style={{ borderColor: themeColor }}></div>
                <div className="timeline-date">{exp.startDate} - {exp.endDate}</div>
                <div className="timeline-content">
                  <div className="company-name">{exp.companyName}</div>
                  <div className="job-title">{exp.jobTitle}</div>
                  <div className="description">{exp.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Skills Section */}
      {skills && skills.length > 0 && (
        <div className="cv-section">
          <div className="section-title" style={{ borderBottomColor: themeColor }}>
            {titles.skills}
          </div>
          <div className="section-content skills-list">
            {skills.map((skill) => (
              <div key={skill.id} className="skill-item">
                <div className="skill-name">{skill.name}</div>
                <div className="skill-level">
                  <div 
                    className="skill-level-bar"
                    style={{ 
                      width: getLevelPercentage(skill.level), 
                      backgroundColor: themeColor 
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
          <div className="section-title" style={{ borderBottomColor: themeColor }}>
            {titles.certificates}
          </div>
          <div className="section-content timeline-section">
            {certificates.map((cert) => (
              <div key={cert.id} className="timeline-item">
                <div className="timeline-point" style={{ borderColor: themeColor }}></div>
                <div className="timeline-date">{cert.date}</div>
                <div className="timeline-content">
                  <div className="organization-name">{cert.organization}</div>
                  <div className="certificate-name">{cert.name}</div>
                  <div className="description">{cert.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Custom Sections */}
      {renderCustomSections()}
    </>
  );

  // Professional template
  const renderProfessionalTemplate = () => (
    <>
      {/* Header with personal information */}
      <div className="cv-header" style={{ 
        backgroundColor: themeColor,
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: 'white'
      }}>
        <div className="header-content">
          <h2 className="full-name" style={{ color: 'white', fontWeight: 'bold', marginBottom: '8px' }}>
            {personalInfo.fullName || 'Họ và tên'}
          </h2>
          
          <div className="job-title" style={{ fontSize: '16px' }}>
            {personalInfo.jobTitle || 'Chức danh - Kinh nghiệm'}
          </div>
        </div>
        
        {personalInfo.photoUrl && (
          <div className="profile-photo-container">
            <div className="profile-photo" style={{ border: 'none' }}>
              <img src={personalInfo.photoUrl} alt="Profile" style={{ maxWidth: '100%', maxHeight: '100%' }} />
            </div>
          </div>
        )}
      </div>
      
      {/* Two-column layout for Professional */}
      <div className="professional-layout" style={{ display: 'flex', marginTop: '20px' }}>
        {/* Sidebar */}
        <div className="professional-sidebar" style={{ 
          width: '30%', 
          backgroundColor: `${themeColor}10`,
          padding: '20px',
          borderRadius: '5px'
        }}>
          {/* Contact Section */}
          <div className="cv-section sidebar-section">
            <div className="section-title" style={{ 
              backgroundColor: themeColor,
              color: 'white',
              padding: '10px 15px',
              marginBottom: '15px'
            }}>
              {titles.contact}
            </div>
            <div className="section-content contact-info-professional">
              {personalInfo.phone && (
                <div className="contact-item">
                  <span className="contact-label">SĐT:</span>
                  <span className="contact-value">{personalInfo.phone}</span>
                </div>
              )}
              
              {personalInfo.email && (
                <div className="contact-item">
                  <span className="contact-label">Email:</span>
                  <span className="contact-value">{personalInfo.email}</span>
                </div>
              )}
              
              {personalInfo.address && (
                <div className="contact-item">
                  <span className="contact-label">Địa chỉ:</span>
                  <span className="contact-value">{personalInfo.address}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Personal Information Section */}
          <div className="cv-section sidebar-section">
            <div className="section-title" style={{ 
              backgroundColor: themeColor,
              color: 'white',
              padding: '10px 15px',
              marginBottom: '15px'
            }}>
              {titles.personalInfo}
            </div>
            <div className="section-content">
              <div className="personal-info-list">
                {personalInfo.birthDate && (
                  <div className="personal-info-item">
                    <div className="info-label">{titles.dateLabel}</div>
                    <div className="info-value">{personalInfo.birthDate}</div>
                  </div>
                )}
                {personalInfo.nationality && (
                  <div className="personal-info-item">
                    <div className="info-label">{titles.localeLabel}</div>
                    <div className="info-value">{personalInfo.nationality}</div>
                  </div>
                )}
                {personalInfo.maritalStatus && (
                  <div className="personal-info-item">
                    <div className="info-label">{titles.statusLabel}</div>
                    <div className="info-value">{personalInfo.maritalStatus}</div>
                  </div>
                )}
                {personalInfo.gender && (
                  <div className="personal-info-item">
                    <div className="info-label">{titles.genderLabel}</div>
                    <div className="info-value">{personalInfo.gender}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Skills Section */}
          {skills && skills.length > 0 && (
            <div className="cv-section sidebar-section">
              <div className="section-title" style={{ 
                backgroundColor: themeColor,
                color: 'white',
                padding: '10px 15px',
                marginBottom: '15px'
              }}>
                {titles.skills}
              </div>
              <div className="section-content skills-list-professional">
                {skills.map((skill) => (
                  <div key={skill.id} className="skill-item-professional">
                    <div className="skill-name">{skill.name}</div>
                    <div className="skill-level-dots">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span 
                          key={i} 
                          className={`skill-dot ${i < getLevelDots(skill.level) ? 'filled' : ''}`}
                          style={{ backgroundColor: i < getLevelDots(skill.level) ? themeColor : '#e0e0e0' }}
                        ></span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Main Content */}
        <div className="professional-main" style={{ width: '70%', padding: '0 0 0 20px' }}>
          {/* Career Objective Section */}
          <div className="cv-section">
            <div className="section-title" style={{ 
              backgroundColor: themeColor,
              color: 'white',
              padding: '10px 15px',
              marginBottom: '15px'
            }}>
              {titles.objective}
            </div>
            <div className="section-content">
              <Paragraph>{personalInfo.objective || 'Mục tiêu nghề nghiệp chưa được cập nhật.'}</Paragraph>
            </div>
          </div>
          
          {/* Work Experience Section */}
          {workExperiences && workExperiences.length > 0 && (
            <div className="cv-section">
              <div className="section-title" style={{ 
                backgroundColor: themeColor,
                color: 'white',
                padding: '10px 15px',
                marginBottom: '15px'
              }}>
                {titles.workExperience}
              </div>
              <div className="section-content professional-timeline">
                {workExperiences.map((exp) => (
                  <div key={exp.id} className="professional-experience-item">
                    <div className="experience-header">
                      <div className="company-name">{exp.companyName}</div>
                      <div className="experience-date">{exp.startDate} - {exp.endDate}</div>
                    </div>
                    <div className="job-title">{exp.jobTitle}</div>
                    <div className="description">{exp.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Certificates Section */}
          {certificates && certificates.length > 0 && (
            <div className="cv-section">
              <div className="section-title" style={{ 
                backgroundColor: themeColor,
                color: 'white',
                padding: '10px 15px',
                marginBottom: '15px'
              }}>
                {titles.certificates}
              </div>
              <div className="section-content professional-certificates">
                {certificates.map((cert) => (
                  <div key={cert.id} className="certificate-item">
                    <div className="certificate-header">
                      <div className="certificate-name">{cert.name}</div>
                      <div className="certificate-date">{cert.date}</div>
                    </div>
                    <div className="organization-name">{cert.organization}</div>
                    <div className="description">{cert.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Custom Sections - only those not shown in sidebar */}
          {renderCustomSections()}
        </div>
      </div>
    </>
  );

  // Creative template
  const renderCreativeTemplate = () => (
    <>
      {/* Header with personal information */}
      <div className="cv-header" style={{ 
        backgroundColor: themeColor,
        padding: '20px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-30px',
          right: '-30px',
          width: '150px',
          height: '150px',
          backgroundColor: 'rgba(255,255,255,0.15)',
          borderRadius: '50%'
        }}></div>
        
        <div className="header-content" style={{ 
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          zIndex: 2
        }}>
          {personalInfo.photoUrl && (
            <div className="profile-photo-container" style={{ marginRight: '20px' }}>
              <div className="profile-photo" style={{ 
                border: 'none',
                borderRadius: '0',
                overflow: 'hidden',
                boxShadow: '5px 5px 0px rgba(0,0,0,0.2)'
              }}>
                <img src={personalInfo.photoUrl} alt="Profile" style={{ width: '100%' }} />
              </div>
            </div>
          )}
          
          <div className="header-text">
            <h2 className="full-name" style={{ 
              color: 'white',
              fontWeight: '800',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              fontSize: '24px'
            }}>
              {personalInfo.fullName || 'Họ và tên'}
            </h2>
            
            <div className="job-title" style={{ 
              color: 'white',
              backgroundColor: 'rgba(255,255,255,0.2)',
              padding: '4px 8px',
              display: 'inline-block',
              marginTop: '10px'
            }}>
              {personalInfo.jobTitle || 'Chức danh - Kinh nghiệm'}
            </div>
          </div>
        </div>
      </div>
      
      {/* Two-column layout for Creative */}
      <div className="creative-content" style={{ display: 'flex', marginTop: '20px' }}>
        {/* Sidebar */}
        <div className="creative-sidebar" style={{ 
          width: '35%', 
          backgroundColor: `${themeColor}20`,
          padding: '20px'
        }}>
          {/* Contact Info */}
          <div className="cv-section sidebar-section">
            <div className="section-title" style={{ 
              borderLeft: `4px solid ${themeColor}`,
              padding: '10px 15px',
              marginBottom: '15px'
            }}>
              {titles.contact}
            </div>
            <div className="section-content contact-info-creative">
              {personalInfo.phone && (
                <div className="contact-item">
                  <span className="contact-icon" style={{ color: themeColor }}>📱</span>
                  <span className="contact-value">{personalInfo.phone}</span>
                </div>
              )}
              
              {personalInfo.email && (
                <div className="contact-item">
                  <span className="contact-icon" style={{ color: themeColor }}>✉️</span>
                  <span className="contact-value">{personalInfo.email}</span>
                </div>
              )}
              
              {personalInfo.address && (
                <div className="contact-item">
                  <span className="contact-icon" style={{ color: themeColor }}>📍</span>
                  <span className="contact-value">{personalInfo.address}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Personal Information */}
          <div className="cv-section sidebar-section">
            <div className="section-title" style={{ 
              borderLeft: `4px solid ${themeColor}`,
              padding: '10px 15px',
              marginBottom: '15px'
            }}>
              {titles.personalInfo}
            </div>
            <div className="section-content">
              <div className="personal-info-list-creative">
                {personalInfo.birthDate && (
                  <div className="personal-info-item">
                    <div className="info-label" style={{ color: themeColor }}>{titles.dateLabel}</div>
                    <div className="info-value">{personalInfo.birthDate}</div>
                  </div>
                )}
                {personalInfo.nationality && (
                  <div className="personal-info-item">
                    <div className="info-label" style={{ color: themeColor }}>{titles.localeLabel}</div>
                    <div className="info-value">{personalInfo.nationality}</div>
                  </div>
                )}
                {personalInfo.maritalStatus && (
                  <div className="personal-info-item">
                    <div className="info-label" style={{ color: themeColor }}>{titles.statusLabel}</div>
                    <div className="info-value">{personalInfo.maritalStatus}</div>
                  </div>
                )}
                {personalInfo.gender && (
                  <div className="personal-info-item">
                    <div className="info-label" style={{ color: themeColor }}>{titles.genderLabel}</div>
                    <div className="info-value">{personalInfo.gender}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Skills */}
          {skills && skills.length > 0 && (
            <div className="cv-section sidebar-section">
              <div className="section-title" style={{ 
                borderLeft: `4px solid ${themeColor}`,
                padding: '10px 15px',
                marginBottom: '15px'
              }}>
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
                          height: '5px',
                          borderRadius: '2px' 
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
        <div className="creative-main" style={{ width: '65%', padding: '20px' }}>
          {/* Career Objective */}
          <div className="cv-section">
            <div className="section-title" style={{ 
              borderLeft: `4px solid ${themeColor}`,
              padding: '10px 15px',
              marginBottom: '15px'
            }}>
              {titles.objective}
            </div>
            <div className="section-content">
              <Paragraph>{personalInfo.objective || 'Mục tiêu nghề nghiệp chưa được cập nhật.'}</Paragraph>
            </div>
          </div>
          
          {/* Work Experience */}
          {workExperiences && workExperiences.length > 0 && (
            <div className="cv-section">
              <div className="section-title" style={{ 
                borderLeft: `4px solid ${themeColor}`,
                padding: '10px 15px',
                marginBottom: '15px'
              }}>
                {titles.workExperience}
              </div>
              <div className="section-content creative-experience">
                {workExperiences.map((exp) => (
                  <div key={exp.id} className="creative-experience-item">
                    <div className="experience-date-badge" style={{ 
                      backgroundColor: themeColor,
                      color: 'white',
                      display: 'inline-block',
                      padding: '5px 10px',
                      marginBottom: '10px'
                    }}>
                      {exp.startDate} - {exp.endDate}
                    </div>
                    <div className="experience-content">
                      <div className="company-name" style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                        {exp.companyName}
                      </div>
                      <div className="job-title" style={{ fontStyle: 'italic', marginBottom: '10px' }}>
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
              <div className="section-title" style={{ 
                borderLeft: `4px solid ${themeColor}`,
                padding: '10px 15px',
                marginBottom: '15px'
              }}>
                {titles.certificates}
              </div>
              <div className="section-content creative-certificates">
                <div className="certificates-grid">
                  {certificates.map((cert) => (
                    <div key={cert.id} className="certificate-card" style={{
                      border: `1px solid ${themeColor}30`,
                      borderLeft: `3px solid ${themeColor}`,
                      padding: '15px',
                      marginBottom: '15px'
                    }}>
                      <div className="certificate-name" style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                        {cert.name}
                      </div>
                      <div className="certificate-meta">
                        <span className="organization-name">{cert.organization}</span>
                        <span className="certificate-date">({cert.date})</span>
                      </div>
                      {cert.description && (
                        <div className="description" style={{ marginTop: '5px', fontSize: '0.9em' }}>
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
    <>
      {/* Header with personal information */}
      <div className="cv-header" style={{ 
        borderBottom: `2px solid ${themeColor}`,
        padding: '20px',
        textAlign: 'center'
      }}>
        <h2 className="full-name" style={{ 
          color: themeColor,
          fontWeight: '600',
          fontSize: '28px'
        }}>
          {personalInfo.fullName || 'Họ và tên'}
        </h2>
        
        <div className="job-title" style={{ 
          fontFamily: "'Courier New', monospace", 
          marginTop: '10px',
          fontSize: '16px'
        }}>
          {'<'}{personalInfo.jobTitle || 'Chức danh - Kinh nghiệm'}{'>'}
        </div>
        
        <div className="contact-details" style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '20px', 
          marginTop: '15px',
          padding: '10px',
          backgroundColor: '#f7f7f7',
          borderRadius: '4px',
          flexWrap: 'wrap'
        }}>
          {personalInfo.phone && (
            <div className="contact-item">
              <code style={{ color: themeColor }}># </code>
              <span>{personalInfo.phone}</span>
            </div>
          )}
          
          {personalInfo.email && (
            <div className="contact-item">
              <code style={{ color: themeColor }}>@ </code>
              <span>{personalInfo.email}</span>
            </div>
          )}
          
          {personalInfo.address && (
            <div className="contact-item">
              <code style={{ color: themeColor }}>~ </code>
              <span>{personalInfo.address}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Single-column content for Minimal */}
      <div className="minimal-content" style={{ padding: '0 20px', marginTop: '20px' }}>
        {/* Career Objective Section */}
        <div className="cv-section">
          <div className="section-title" style={{ 
            borderBottom: `1px solid ${themeColor}`,
            color: themeColor,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            {titles.objective}
          </div>
          <div className="section-content">
            <Paragraph style={{ fontFamily: "'Courier New', monospace" }}>
              {personalInfo.objective || 'Mục tiêu nghề nghiệp chưa được cập nhật.'}
            </Paragraph>
          </div>
        </div>
        
        {/* Work Experience Section */}
        {workExperiences && workExperiences.length > 0 && (
          <div className="cv-section">
            <div className="section-title" style={{ 
              borderBottom: `1px solid ${themeColor}`,
              color: themeColor,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              {titles.workExperience}
            </div>
            <div className="section-content minimal-experience">
              {workExperiences.map((exp) => (
                <div key={exp.id} className="minimal-experience-item">
                  <div className="experience-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div className="company-name" style={{ fontWeight: 'bold' }}>
                      <code style={{ color: themeColor }}></code> {exp.companyName}
                    </div>
                    <div className="experience-date" style={{ fontFamily: "'Courier New', monospace" }}>
                      {exp.startDate} - {exp.endDate}
                    </div>
                  </div>
                  <div className="job-title" style={{ 
                    marginLeft: '15px', 
                    fontStyle: 'italic',
                    marginBottom: '5px'
                  }}>
                    {exp.jobTitle}
                  </div>
                  <div className="description" style={{ 
                    marginLeft: '15px',
                    paddingLeft: '10px',
                    borderLeft: `1px solid #eee`
                  }}>
                    {exp.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Skills Section */}
        {skills && skills.length > 0 && (
          <div className="cv-section">
            <div className="section-title" style={{ 
              borderBottom: `1px solid ${themeColor}`,
              color: themeColor,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              {titles.skills}
            </div>
            <div className="section-content minimal-skills" style={{ 
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              {skills.map((skill) => (
                <div key={skill.id} className="minimal-skill-tag" style={{
                  border: `1px solid ${themeColor}`,
                  padding: '5px 10px',
                  borderRadius: '3px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  <span className="skill-name">{skill.name}</span>
                  <span className="skill-level" style={{ 
                    fontSize: '0.8em',
                    backgroundColor: `${themeColor}20`,
                    padding: '2px 5px',
                    borderRadius: '2px'
                  }}>
                    {skill.level}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Certificates Section */}
        {certificates && certificates.length > 0 && (
          <div className="cv-section">
            <div className="section-title" style={{ 
              borderBottom: `1px solid ${themeColor}`,
              color: themeColor,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              {titles.certificates}
            </div>
            <div className="section-content minimal-certificates">
              <ul style={{ 
                listStyleType: 'none', 
                paddingLeft: 0, 
                fontFamily: "'Courier New', monospace" 
              }}>
                {certificates.map((cert) => (
                  <li key={cert.id} style={{ marginBottom: '10px' }}>
                    <code style={{ color: themeColor }}>*</code> {cert.name}
                    <span className="certificate-meta" style={{ display: 'block', marginLeft: '15px' }}>
                      <span className="organization-name">{cert.organization}</span>
                      <span className="certificate-date"> | {cert.date}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        
        {/* Personal Information Section */}
        <div className="cv-section">
          <div className="section-title" style={{ 
            borderBottom: `1px solid ${themeColor}`,
            color: themeColor,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            {titles.personalInfo}
          </div>
          <div className="section-content">
            <pre style={{ 
              fontFamily: "'Courier New', monospace",
              backgroundColor: '#f7f7f7',
              padding: '10px',
              borderRadius: '4px'
            }}>
{`// Personal info
const developer = {
  birthDate: "${personalInfo.birthDate || 'N/A'}",
  nationality: "${personalInfo.nationality || 'N/A'}",
  status: "${personalInfo.maritalStatus || 'N/A'}",
  gender: "${personalInfo.gender || 'N/A'}"
};`}
            </pre>
          </div>
        </div>
        
        {/* Custom Sections */}
        {renderCustomSections()}
      </div>
    </>
  );

  // Elegant template
  const renderElegantTemplate = () => (
    <>
      {/* Header with personal information */}
      <div className="cv-header" style={{ 
        borderBottom: `2px solid ${themeColor}`,
        paddingBottom: '20px',
        marginBottom: '30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
      }}>
        <div className="header-content">
          <h2 className="full-name" style={{ 
            color: themeColor,
            fontSize: '28px',
            fontWeight: '600',
            marginBottom: '5px'
          }}>
            {personalInfo.fullName || 'Họ và tên'}
          </h2>
          
          <div className="job-title" style={{ 
            fontSize: '16px',
            color: '#555',
            marginBottom: '15px',
            fontStyle: 'italic'
          }}>
            {personalInfo.jobTitle || 'Chức danh - Kinh nghiệm'}
          </div>
          
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '15px',
            fontSize: '14px'
          }}>
            {personalInfo.phone && (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ 
                  color: themeColor,
                  marginRight: '5px'
                }}>Điện thoại:</div>
                <span>{personalInfo.phone}</span>
              </div>
            )}
            
            {personalInfo.email && (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ 
                  color: themeColor,
                  marginRight: '5px'
                }}>Email:</div>
                <span>{personalInfo.email}</span>
              </div>
            )}
            
            {personalInfo.address && (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ 
                  color: themeColor,
                  marginRight: '5px'
                }}>Địa chỉ:</div>
                <span>{personalInfo.address}</span>
              </div>
            )}
          </div>
        </div>
        
        {personalInfo.photoUrl && (
          <div style={{ 
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: `2px solid ${themeColor}`
          }}>
            <img src={personalInfo.photoUrl} alt="Profile" style={{ 
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '50%'
            }} />
          </div>
        )}
      </div>
      
      {/* Two-column layout for Elegant */}
      <div className="elegant-two-column" style={{ 
        display: 'flex', 
        gap: '30px', 
        marginTop: '20px'
      }}>
        {/* Left Column */}
        <div className="elegant-left-column" style={{ width: '35%' }}>
          {/* Career Objective Section */}
          <div className="cv-section">
            <div className="section-title" style={{ 
              color: themeColor,
              borderBottom: `2px solid ${themeColor}`,
              paddingBottom: '5px',
              marginBottom: '15px'
            }}>
              {titles.objective}
            </div>
            <div className="section-content">
              <Paragraph>
                {personalInfo.objective || 'Mục tiêu nghề nghiệp chưa được cập nhật.'}
              </Paragraph>
            </div>
          </div>
          
          {/* Personal Information Section */}
          <div className="cv-section">
            <div className="section-title" style={{ 
              color: themeColor,
              borderBottom: `2px solid ${themeColor}`,
              paddingBottom: '5px',
              marginBottom: '15px'
            }}>
              {titles.personalInfo}
            </div>
            <div className="section-content elegant-personal-info">
              <div className="personal-info-list">
                {personalInfo.birthDate && (
                  <div className="personal-info-item">
                    <div className="info-label" style={{ fontWeight: 'bold' }}>{titles.dateLabel}</div>
                    <div className="info-value">{personalInfo.birthDate}</div>
                  </div>
                )}
                {personalInfo.nationality && (
                  <div className="personal-info-item">
                    <div className="info-label" style={{ fontWeight: 'bold' }}>{titles.localeLabel}</div>
                    <div className="info-value">{personalInfo.nationality}</div>
                  </div>
                )}
                {personalInfo.maritalStatus && (
                  <div className="personal-info-item">
                    <div className="info-label" style={{ fontWeight: 'bold' }}>{titles.statusLabel}</div>
                    <div className="info-value">{personalInfo.maritalStatus}</div>
                  </div>
                )}
                {personalInfo.gender && (
                  <div className="personal-info-item">
                    <div className="info-label" style={{ fontWeight: 'bold' }}>{titles.genderLabel}</div>
                    <div className="info-value">{personalInfo.gender}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Skills Section */}
          {skills && skills.length > 0 && (
            <div className="cv-section">
              <div className="section-title" style={{ 
                color: themeColor,
                borderBottom: `2px solid ${themeColor}`,
                paddingBottom: '5px',
                marginBottom: '15px'
              }}>
                {titles.skills}
              </div>
              <div className="section-content elegant-skills">
                {skills.map((skill) => (
                  <div key={skill.id} className="elegant-skill-item">
                    <div className="skill-header" style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      marginBottom: '5px',
                      alignItems: 'center'
                    }}>
                      <div className="skill-name" style={{ fontWeight: 'bold' }}>{skill.name}</div>
                      <div className="skill-level" style={{ 
                        fontStyle: 'italic', 
                        color: themeColor,
                        fontSize: '0.9em'
                      }}>
                        {skill.level}
                      </div>
                    </div>
                    <div className="skill-bar-container" style={{
                      backgroundColor: '#f0f0f0',
                      height: '3px',
                      borderRadius: '1.5px',
                      marginBottom: '15px'
                    }}>
                      <div 
                        className="skill-level-bar"
                        style={{ 
                          width: getLevelPercentage(skill.level), 
                          backgroundColor: themeColor,
                          height: '100%',
                          borderRadius: '1.5px'
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
        <div className="elegant-right-column" style={{ 
          width: '65%', 
          borderLeft: `1px solid ${themeColor}30`,
          paddingLeft: '25px'
        }}>
          {/* Work Experience Section */}
          {workExperiences && workExperiences.length > 0 && (
            <div className="cv-section">
              <div className="section-title" style={{ 
                color: themeColor,
                borderBottom: `2px solid ${themeColor}`,
                paddingBottom: '5px',
                marginBottom: '15px'
              }}>
                {titles.workExperience}
              </div>
              <div className="section-content elegant-experience">
                {workExperiences.map((exp) => (
                  <div key={exp.id} className="elegant-experience-item">
                    <div className="experience-header">
                      <div className="company-name" style={{ 
                        fontWeight: 'bold', 
                        borderLeft: `3px solid ${themeColor}`,
                        paddingLeft: '10px'
                      }}>
                        {exp.companyName}
                      </div>
                      <div className="experience-date" style={{ 
                        color: '#777',
                        fontSize: '0.9em',
                        marginTop: '3px',
                        marginLeft: '13px'
                      }}>
                        {exp.startDate} - {exp.endDate}
                      </div>
                    </div>
                    <div className="job-title" style={{ 
                      fontStyle: 'italic',
                      margin: '10px 0 5px 13px'
                    }}>
                      {exp.jobTitle}
                    </div>
                    <div className="description" style={{ marginLeft: '13px' }}>
                      {exp.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Certificates Section */}
          {certificates && certificates.length > 0 && (
            <div className="cv-section">
              <div className="section-title" style={{ 
                color: themeColor,
                borderBottom: `2px solid ${themeColor}`,
                paddingBottom: '5px',
                marginBottom: '15px'
              }}>
                {titles.certificates}
              </div>
              <div className="section-content elegant-certificates">
                {certificates.map((cert) => (
                  <div key={cert.id} className="elegant-certificate-item" style={{ 
                    marginBottom: '15px',
                    position: 'relative'
                  }}>
                    <div style={{ 
                      position: 'absolute',
                      left: '-5px',
                      top: '5px',
                      width: '10px',
                      height: '10px',
                      backgroundColor: themeColor,
                      borderRadius: '50%'
                    }}></div>
                    <div style={{ marginLeft: '15px' }}>
                      <div className="certificate-name" style={{ fontWeight: 'bold' }}>
                        {cert.name}
                      </div>
                      <div className="certificate-meta" style={{ 
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginTop: '3px',
                        color: '#777',
                        fontSize: '0.9em'
                      }}>
                        <span className="organization-name">{cert.organization}</span>
                        <span className="certificate-date">{cert.date}</span>
                      </div>
                      {cert.description && (
                        <div className="description" style={{ 
                          marginTop: '5px',
                          fontSize: '0.9em',
                          fontStyle: 'italic'
                        }}>
                          {cert.description}
                        </div>
                      )}
                    </div>
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
      case 'professional':
        return renderProfessionalTemplate();
      case 'creative':
        return renderCreativeTemplate();
      case 'minimal':
        return renderMinimalTemplate();
      case 'elegant':
        return renderElegantTemplate();
      case 'modern':
      default:
        return renderModernTemplate();
    }
  };

  return (
    <div className={`cv-preview ${templateClass}`} ref={contentRef}>
      <div className="preview-content" style={{ fontFamily: currentTemplate.font, fontSize: `${currentTemplate.fontSize}px` }}>
        {renderTemplate()}
      </div>
    </div>
  );
});

export default CVPreview;