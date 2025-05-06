import { useEffect, useState, useRef, Component } from "react";
import {
  Row,
  Col,
  Card,
  Typography,
  Button,
  Divider,
  message,
  Space,
  Spin,
  Modal,
  Input,
  Tooltip,
  Select,
  Slider,
  Upload,
  ColorPicker,
  Progress,
} from "antd";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  DeleteOutlined,
  EyeOutlined,
  SaveOutlined,
  PlusOutlined,
  LayoutOutlined,
  EditOutlined,
  DragOutlined,
  DownloadOutlined,
  CloseOutlined,
  FontSizeOutlined,
  GlobalOutlined,
  CameraOutlined,
  UploadOutlined,
  FileOutlined,
} from "@ant-design/icons";
import BoxContainer from "../../Generate/BoxContainer";
import { useTranslation } from "react-i18next";
import "./CVBuilder.scss";
import {
  uploadCV,
  updateCV,
  getSkillStudent,
} from "../../../services/apiService";
import { uploadToCloudinary } from "../../../services/uploadCloudary";
import CVPreview from "./CVPreview";
import CVTemplateSelector from "./CVTemplateSelector";
import { useSelector } from "react-redux";
import { apiService } from "../../../services/getAddressId";
import { useQueryClient } from "@tanstack/react-query";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// Define item types for drag and drop
const ItemTypes = {
  CV_SECTION: "cv_section",
  CV_ELEMENT: "cv_element",
};

// CV template options
const CV_TEMPLATES = [
  {
    id: "modern",
    name: "Modern",
    color: "#3366FF",
    description:
      "Mẫu hiện đại với thiết kế sạch sẽ, phù hợp cho hầu hết ngành nghề",
  },
  {
    id: "professional",
    name: "Professional",
    color: "#0078D7",
    description:
      "Mẫu chuyên nghiệp phù hợp với môi trường doanh nghiệp và lĩnh vực tài chính, luật",
  },
  {
    id: "creative",
    name: "Creative",
    color: "#5C2D91",
    description: "Mẫu sáng tạo cho ngành thiết kế, nghệ thuật và marketing",
  },
  {
    id: "minimal",
    name: "Minimal",
    color: "#424242",
    description: "Mẫu tối giản tập trung vào nội dung, dễ đọc và chuyên nghiệp",
  },
  {
    id: "elegant",
    name: "Elegant",
    color: "#107C41",
    description:
      "Mẫu sang trọng với bố cục thanh lịch, phù hợp cho những người muốn tạo ấn tượng cao cấp",
  },
];

// Color presets for CV theming
const CV_COLOR_PRESETS = [
  { color: "#f57c00", name: "Orange" },
  { color: "#1890ff", name: "Blue" },
  { color: "#2f54eb", name: "Indigo" },
  { color: "#52c41a", name: "Green" },
  { color: "#000000", name: "Black" },
];

// Font options
const FONT_OPTIONS = [
  { value: "'Open Sans', sans-serif", label: "Open Sans" },
  { value: "'Roboto', sans-serif", label: "Roboto" },
  { value: "'Montserrat', sans-serif", label: "Montserrat" },
  { value: "'Poppins', sans-serif", label: "Poppins" },
  { value: "'Playfair Display', serif", label: "Playfair Display" },
];

// Available sections that can be added to the CV
const AVAILABLE_SECTIONS = [
  {
    id: "workExperience",
    name: "Kinh nghiệm làm việc",
    description:
      "Mô tả các kinh nghiệm làm việc của bạn càng chi tiết càng tốt.",
  },
  {
    id: "education",
    name: "Học vấn",
    description:
      "Mô tả toàn bộ quá trình học vấn của bạn, cùng như các bằng cấp bạn đã đạt được.",
  },
  {
    id: "languages",
    name: "Ngoại ngữ",
    description: "Liệt kê các chứng chỉ ngoại ngữ mà bạn đã đạt được.",
  },
  {
    id: "references",
    name: "Người tham khảo",
    description:
      "Thông tin người tham khảo giúp tăng độ tin cậy cho hồ sơ của bạn.",
  },
  {
    id: "activities",
    name: "Hoạt động",
    description:
      "Liệt kê những hoạt động bạn đã tham gia trong quá trình học hoặc làm việc.",
  },
  {
    id: "skills",
    name: "Kỹ năng",
    description: "Danh sách các kỹ năng chuyên môn và mức độ thành thạo.",
  },
  {
    id: "projects",
    name: "Dự án",
    description: "Mô tả các dự án bạn đã tham gia hoặc thực hiện.",
  },
  {
    id: "certificates",
    name: "Chứng chỉ",
    description: "Liệt kê các chứng chỉ chuyên môn bạn đã đạt được.",
  },
];

// ErrorBoundary component
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error information
    console.error("CV Builder Error:", error);
    console.error("Error details:", errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Reset error state after a short delay
      setTimeout(() => {
        this.setState({ hasError: false, error: null });
      }, 2000);

      return (
        <div
          className="error-boundary-fallback"
          style={{
            padding: "15px",
            margin: "10px",
            backgroundColor: "#fff8f8",
            border: "1px solid #ffb6b6",
            borderRadius: "4px",
          }}
        >
          <h4>Oops! Something went wrong with the CV Builder</h4>
          <p>
            The application encountered an error while updating the template.
            Please try again.
          </p>
          <p style={{ fontSize: "12px", color: "#888" }}>
            Error: {this.state.error && this.state.error.toString()}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

const CVBuilder = ({ onFinish, existingCvData = null, setShowBuilder }) => {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const user = useSelector((state) => state.user);
  const student = useSelector((state) => state.student);
  const [sections, setSections] = useState([]);
  const [fullName, setFullName] = useState(
    student.firstName + " " + student.lastName
  );
  const [jobTitle, setJobTitle] = useState("CHỨC DANH - 0 NĂM KINH NGHIỆM");
  const [careerObjective, setCareerObjective] = useState(
    "Nhập mục tiêu nghề nghiệp của bạn tại đây..."
  );
  const [contactInfo, setContactInfo] = useState({
    email: user.email,
    phone: student.phoneNumber,
    address: student.address,
  });
  const [personalInfo, setPersonalInfo] = useState({
    birthDate: student.dob,
    nationality: "Việt Nam",
    maritalStatus: "Độc thân",
    gender: student.gender ? "Nữ" : "Nam",
  });
  const [skills, setSkills] = useState([]);

  // Work Experience
  const [workExperiences, setWorkExperiences] = useState([
    {
      id: 1,
      companyName: "Tên công ty",
      jobTitle: "Chức danh",
      startDate: "MM/YYYY",
      endDate: "MM/YYYY",
      description: "Mô tả",
    },
  ]);

  // Certificates
  const [certificates, setCertificates] = useState([
    {
      id: 1,
      organization: "Tổ chức",
      name: "Tên chứng chỉ",
      date: "YYYY",
      description: "Đường dẫn",
    },
  ]);

  const [selectedColor, setSelectedColor] = useState(CV_COLOR_PRESETS[0].color);
  const [selectedFont, setSelectedFont] = useState(FONT_OPTIONS[0].value);
  const [fontSize, setFontSize] = useState(12);
  const [previewMode, setPreviewMode] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(student.profileImage);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);

  // Template selection state
  const [selectedTemplate, setSelectedTemplate] = useState(CV_TEMPLATES[0]);

  // Reference to the preview component for PDF generation
  const previewComponentRef = useRef();

  // Thêm state mới để quản lý trạng thái tải ảnh
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadPhotoProgress, setUploadPhotoProgress] = useState(0);

  useEffect(() => {
    apiService
      .getInforAddress(
        student.address,
        student.provinceId,
        student.districtId,
        student.wardId
      )
      .then((res) => {
        setContactInfo({
          ...contactInfo,
          address: res,
        });
      });
    getSkillStudent().then((res) => {
      setSkills(
        res.data.map((item, index) => {
          return {
            id: index + 1,
            name: item.skillName,
            level:
              item.level <= 2
                ? "Beginner"
                : item.level === 3
                ? "Intermediate"
                : item.level === 4
                ? "Advanced"
                : "Expert",
          };
        })
      );
    });
  }, [student]);

  useEffect(() => {
    if (existingCvData) {
      try {
        console.log("Loading existing CV data:", existingCvData);

        // Load personal info
        if (existingCvData.personalInfo) {
          setFullName(existingCvData.personalInfo.fullName || "PHONG THANH");
          setJobTitle(
            existingCvData.personalInfo.jobTitle ||
              "CHỨC DANH - 0 NĂM KINH NGHIỆM"
          );

          // Load career objective
          if (existingCvData.personalInfo.objective) {
            setCareerObjective(existingCvData.personalInfo.objective);
          }

          // Load contact info
          setContactInfo({
            email: existingCvData.personalInfo.email || "",
            phone: existingCvData.personalInfo.phone || "",
            address: existingCvData.personalInfo.address || "",
          });

          // Load additional personal info
          setPersonalInfo({
            birthDate: existingCvData.personalInfo.birthDate || "",
            nationality: existingCvData.personalInfo.nationality || "Việt Nam",
            maritalStatus:
              existingCvData.personalInfo.maritalStatus || "Độc thân",
            gender: existingCvData.personalInfo.gender || "Nam",
          });

          if (existingCvData.personalInfo.photoUrl) {
            setProfilePhotoUrl(existingCvData.personalInfo.photoUrl);
          }
        }

        // Load work experiences
        if (
          existingCvData.workExperiences &&
          existingCvData.workExperiences.length > 0
        ) {
          setWorkExperiences(existingCvData.workExperiences);
        }

        // Load certificates
        if (
          existingCvData.certificates &&
          existingCvData.certificates.length > 0
        ) {
          setCertificates(existingCvData.certificates);
        }

        // Load skills if they exist
        if (existingCvData.skills && existingCvData.skills.length > 0) {
          setSkills(existingCvData.skills);
        }

        // Load custom sections
        if (existingCvData.sections) {
          setSections(existingCvData.sections);
        }

        // Load theme settings
        if (existingCvData.theme) {
          setSelectedColor(
            existingCvData.theme.color || CV_COLOR_PRESETS[0].color
          );
          setSelectedFont(existingCvData.theme.font || FONT_OPTIONS[0].value);
          setFontSize(existingCvData.theme.fontSize || 12);

          // Set template if it exists
          if (existingCvData.theme.id) {
            const templateId = existingCvData.theme.id;
            const template = CV_TEMPLATES.find((t) => t.id === templateId);
            if (template) {
              setSelectedTemplate(template);
            }
          }
        }

        console.log("CV data loaded successfully");
      } catch (error) {
        console.error("Error loading existing CV data:", error);
        message.error(t("cv.builder.errorLoading"));
      }
    }
  }, [existingCvData, t]);

  // Lắng nghe thay đổi của template để cập nhật giao diện
  useEffect(() => {
    // Áp dụng ngay các thay đổi về style và template khi thay đổi template
    if (previewComponentRef.current) {
      previewComponentRef.current.updateTemplate({
        id: selectedTemplate.id,
        color: selectedColor,
        font: selectedFont,
        fontSize: fontSize,
      });
    }
  }, [selectedTemplate, selectedColor, selectedFont, fontSize]);

  const addSection = (sectionType) => {
    const sectionTemplate = AVAILABLE_SECTIONS.find(
      (s) => s.id === sectionType
    );
    if (!sectionTemplate) return;

    // Check if section already exists
    const exists = sections.some((s) => s.type === sectionType);
    if (exists) {
      message.info("Mục này đã được thêm");
      return;
    }

    // Add new section
    setSections((prevSections) => [
      ...prevSections,
      {
        id: `${sectionType}-${Date.now()}`,
        type: sectionType,
        title: sectionTemplate.name,
        position: prevSections.length,
        content: { items: [] },
      },
    ]);

    message.success("Thêm mục thành công");
  };

  const removeSection = (sectionId) => {
    setSections((prevSections) => {
      const filteredSections = prevSections.filter((s) => s.id !== sectionId);
      // Reorder positions
      return filteredSections.map((section, index) => ({
        ...section,
        position: index,
      }));
    });

    message.success("Đã xóa mục");
  };

  const moveSection = (dragIndex, hoverIndex) => {
    setSections((prevSections) => {
      const result = [...prevSections];
      const [removed] = result.splice(dragIndex, 1);
      result.splice(hoverIndex, 0, removed);

      // Update positions
      return result.map((section, index) => ({
        ...section,
        position: index,
      }));
    });
  };

  const handleSave = async () => {
    try {
      setSaveLoading(true);

      // Upload profile photo if it exists and is new
      let photoUrl = profilePhotoUrl;
      if (profilePhoto && profilePhoto instanceof File) {
        photoUrl = await uploadToCloudinary(profilePhoto, "student");
      }

      // Generate the CV as PDF using the preview component
      const pdfBlob = await previewComponentRef.current.generatePDF();

      // Upload PDF to Cloudinary
      const pdfUrl = await uploadToCloudinary(
        new File([pdfBlob], `${fullName.replace(/\s+/g, "_")}_CV.pdf`, {
          type: "application/pdf",
        }),
        "student"
      );

      // Save CV data
      const cvData = {
        resumeTitle: `${fullName} - CV`,
        resumeDescription: `${jobTitle}`,
        resumeFile: pdfUrl,
        levelId: 1,
        theme: {
          color: selectedColor,
          font: selectedFont,
          fontSize: fontSize,
        },
        personalInfo: {
          fullName,
          jobTitle,
          ...contactInfo,
          ...personalInfo,
          photoUrl: photoUrl,
        },
        sections: sections,
        workExperiences: workExperiences,
        certificates: certificates,
      };

      let response;
      if (existingCvData && existingCvData.resumeId) {
        response = await updateCV(existingCvData.resumeId, cvData);
        console.log("CV cvData successfully:", cvData);
        console.log("CV updated successfully:", response);
      } else {
        response = await uploadCV(cvData);
      }

      if (response.status === "OK") {
        message.success("Lưu CV thành công");
        if (onFinish) onFinish(response.data);
      } else {
        throw new Error(response.message || "Unknown error");
      }
    } catch (error) {
      console.error("Error saving CV:", error);
      message.error("Có lỗi khi lưu CV");
    } finally {
      queryClient.invalidateQueries({ queryKey: ["resume"] });
      setSaveLoading(false);
    }
  };

  const handlePreview = async () => {
    try {
      // Hiển thị thông báo về quá trình tạo PDF
      const messageKey = "preview";
      message.open({
        key: messageKey,
        type: "loading",
        content: "Đang chuẩn bị xem trước...",
        duration: 0,
      });

      // Lưu dữ liệu CV hiện tại vào localStorage để có thể khôi phục sau này
      const cvData = {
        fullName,
        jobTitle,
        contactInfo,
        personalInfo,
        skills,
        workExperiences,
        certificates,
        sections,
        selectedColor,
        selectedFont,
        fontSize,
        profilePhotoUrl,
      };
      localStorage.setItem("cv_preview_data", JSON.stringify(cvData));

      // Đợi để component preview được render đầy đủ (component ẩn vẫn tồn tại)
      setTimeout(async () => {
        try {
          if (!previewComponentRef.current) {
            throw new Error("Preview component not found");
          }

          message.open({
            key: messageKey,
            type: "loading",
            content: "Đang tạo bản xem trước PDF...",
            duration: 0,
          });

          // Sử dụng phương thức previewCV mới từ component CVPreview
          // Phương thức này sẽ tạo PDF và mở trong tab mới mà không cần hiển thị trên trang hiện tại
          const success = await previewComponentRef.current.previewCV();

          if (success) {
            message.open({
              key: messageKey,
              type: "success",
              content: "Đã mở bản xem trước CV trong tab mới",
              duration: 2,
            });
          } else {
            throw new Error("Could not generate PDF");
          }
        } catch (err) {
          console.error("Error opening preview:", err);
          message.open({
            key: messageKey,
            type: "error",
            content: "Không thể xem trước CV. Vui lòng thử lại sau.",
            duration: 3,
          });
        }
      }, 800);
    } catch (error) {
      console.error("Error previewing CV:", error);
      message.error("Không thể xem trước CV");
    }
  };

  const handleDownload = async () => {
    try {
      const messageKey = "download";
      message.open({
        key: messageKey,
        type: "loading",
        content: "Đang chuẩn bị tải xuống...",
        duration: 0,
      });

      if (!previewComponentRef.current) {
        throw new Error("Preview component not found");
      }

      // Make sure we're in preview mode to have the component fully rendered
      const wasInPreviewMode = previewMode;
      if (!wasInPreviewMode) {
        //setPreviewMode(true);
        // Give time for the preview to render
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }

      // Use the improved download method directly from the CVPreview component
      const fileName = `${fullName.replace(/\s+/g, "_")}_CV.pdf`;
      const success = await previewComponentRef.current.downloadPDF(fileName);

      // Reset to previous mode if needed
      if (!wasInPreviewMode) {
        setTimeout(() => setPreviewMode(false), 500);
      }

      if (success) {
        message.open({
          key: messageKey,
          type: "success",
          content: "Tải xuống thành công!",
          duration: 3,
        });
      } else {
        throw new Error("Download failed");
      }
    } catch (error) {
      console.error("Error downloading PDF:", error);
      message.error("Không thể tải xuống CV. Vui lòng thử lại sau.");
    }
  };

  const handleProfilePhotoChange = async (info) => {
    // Nếu đang trong trạng thái uploading của Ant Design Upload
    console.log("File info:", info.file);
    if (info.file.status === "uploading") {
      return;
    }
    try {
      const file = info.file.originFileObj || info.file;

      if (file instanceof File) {
        setUploadingPhoto(true);
        setUploadPhotoProgress(0);

        const reader = new FileReader();
        reader.onload = () => {
          setProfilePhotoUrl(reader.result);
        };
        reader.readAsDataURL(file);

        const messageKey = "uploading-photo";
        message.loading({
          content: "Đang tải ảnh lên...",
          key: messageKey,
          duration: 0,
        });
        console.log("Uploading photo to Cloudinary...");
        const uploadedUrl = await uploadToCloudinary(
          file,
          "student",
          (progress) => {
            setUploadPhotoProgress(progress);
          }
        );

        setProfilePhotoUrl(uploadedUrl);
        message.success({
          content: "Tải ảnh thành công!",
          key: messageKey,
          duration: 2,
        });

        // Lưu file gốc để có thể tải lại hoặc chỉnh sửa
        setProfilePhoto(file);

        // Đặt lại trạng thái tải lên
        setUploadingPhoto(false);
      } else if (info.file.status === "done" && info.file.response) {
        // Nếu file được tải lên ngay lập tức qua Ant Design Upload, sử dụng URL từ response
        setProfilePhotoUrl(info.file.response.url);
        setUploadingPhoto(false);
      }
    } catch (error) {
      console.error("Error processing profile photo:", error);
      message.error("Không thể tải lên ảnh. Vui lòng thử lại sau.", 3);
      setUploadingPhoto(false);
    }

    if (info.file.status === "error") {
      message.error(`${info.file.name} tải lên thất bại.`, 3);
      setUploadingPhoto(false);
    }
  };

  const addSkill = () => {
    const newId =
      skills.length > 0 ? Math.max(...skills.map((s) => s.id)) + 1 : 1;
    setSkills([
      ...skills,
      { id: newId, name: "Kỹ năng mới", level: "Beginner" },
    ]);
  };

  const removeSkill = (skillId) => {
    setSkills(skills.filter((skill) => skill.id !== skillId));
  };

  const updateSkill = (skillId, field, value) => {
    setSkills(
      skills.map((skill) =>
        skill.id === skillId ? { ...skill, [field]: value } : skill
      )
    );
  };

  // Work Experience Functions
  const addWorkExperience = () => {
    const newId =
      workExperiences.length > 0
        ? Math.max(...workExperiences.map((exp) => exp.id)) + 1
        : 1;
    setWorkExperiences([
      ...workExperiences,
      {
        id: newId,
        companyName: "Tên công ty",
        jobTitle: "Chức danh",
        startDate: "MM/YYYY",
        endDate: "MM/YYYY",
        description: "Mô tả",
      },
    ]);
  };

  const removeWorkExperience = (expId) => {
    setWorkExperiences(workExperiences.filter((exp) => exp.id !== expId));
  };

  const updateWorkExperience = (expId, field, value) => {
    setWorkExperiences(
      workExperiences.map((exp) =>
        exp.id === expId ? { ...exp, [field]: value } : exp
      )
    );
  };

  // Certificate Functions
  const addCertificate = () => {
    const newId =
      certificates.length > 0
        ? Math.max(...certificates.map((cert) => cert.id)) + 1
        : 1;
    setCertificates([
      ...certificates,
      {
        id: newId,
        organization: "Tổ chức",
        name: "Tên chứng chỉ",
        date: "YYYY",
        description: "Đường dẫn",
      },
    ]);
  };

  const removeCertificate = (certId) => {
    setCertificates(certificates.filter((cert) => cert.id !== certId));
  };

  const updateCertificate = (certId, field, value) => {
    setCertificates(
      certificates.map((cert) =>
        cert.id === certId ? { ...cert, [field]: value } : cert
      )
    );
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setShowColorPicker(false);
  };

  const renderEditableHeader = () => {
    switch (selectedTemplate.id) {
      case "professional":
        return (
          <div
            className="cv-header"
            style={{
              backgroundColor: selectedColor,
              padding: "20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              color: "white",
            }}
          >
            <div className="header-content">
              <div
                className="header-name"
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => setFullName(e.target.innerText)}
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  marginBottom: "8px",
                }}
              >
                {fullName}
              </div>

              <div
                className="header-title"
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => setJobTitle(e.target.innerText)}
                style={{ fontSize: "16px" }}
              >
                {jobTitle}
              </div>
            </div>

            <div className="profile-photo-container">
              <Upload
                name="avatar"
                listType="picture-card"
                className="profile-photo-uploader"
                showUploadList={false}
                onChange={handleProfilePhotoChange}
                beforeUpload={() => false} // prevent auto upload
                style={{
                  width: "100%",
                  height: "100%",
                  display: "block",
                  cursor: "pointer",
                  position: "relative",
                  zIndex: 20,
                }}
              >
                {profilePhotoUrl ? (
                  <div className="profile-photo" style={{ border: "none" }}>
                    <img
                      src={profilePhotoUrl}
                      alt="Profile"
                      style={{ maxWidth: "100%", maxHeight: "100%" }}
                    />
                  </div>
                ) : (
                  uploadButton
                )}
              </Upload>
            </div>
          </div>
        );
      case "creative":
        return (
          <div
            className="cv-header"
            style={{
              backgroundColor: selectedColor,
              padding: "20px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-30px",
                right: "-30px",
                width: "150px",
                height: "150px",
                backgroundColor: "rgba(255,255,255,0.15)",
                borderRadius: "50%",
              }}
            ></div>

            <div
              className="header-content"
              style={{
                display: "flex",
                alignItems: "center",
                position: "relative",
                zIndex: 2,
              }}
            >
              <div
                className="profile-photo-container"
                style={{ marginRight: "20px" }}
              >
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="profile-photo-uploader"
                  showUploadList={false}
                  onChange={handleProfilePhotoChange}
                  beforeUpload={() => false} // prevent auto upload
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "block",
                    cursor: "pointer",
                    position: "relative",
                    zIndex: 20,
                  }}
                >
                  {profilePhotoUrl ? (
                    <div
                      className="profile-photo"
                      style={{
                        border: "none",
                        borderRadius: "0",
                        overflow: "hidden",
                        boxShadow: "5px 5px 0px rgba(0,0,0,0.2)",
                      }}
                    >
                      <img
                        src={profilePhotoUrl}
                        alt="Profile"
                        style={{ width: "100%" }}
                      />
                    </div>
                  ) : (
                    uploadButton
                  )}
                </Upload>
              </div>

              <div className="header-text">
                <div
                  className="header-name"
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => setFullName(e.target.innerText)}
                  style={{
                    color: "white",
                    fontWeight: "800",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    fontSize: "24px",
                  }}
                >
                  {fullName}
                </div>

                <div
                  className="header-title"
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => setJobTitle(e.target.innerText)}
                  style={{
                    color: "white",
                    backgroundColor: "rgba(255,255,255,0.2)",
                    padding: "4px 8px",
                    display: "inline-block",
                    marginTop: "10px",
                  }}
                >
                  {jobTitle}
                </div>
              </div>
            </div>
          </div>
        );
      case "minimal":
        return (
          <div
            className="cv-header"
            style={{
              borderBottom: `2px solid ${selectedColor}`,
              padding: "20px",
              textAlign: "center",
            }}
          >
            <div
              className="header-name"
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => setFullName(e.target.innerText)}
              style={{
                color: selectedColor,
                fontWeight: "600",
                fontSize: "28px",
              }}
            >
              {fullName}
            </div>

            <div
              className="header-title"
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => setJobTitle(e.target.innerText)}
              style={{
                fontFamily: "'Courier New', monospace",
                marginTop: "10px",
                fontSize: "16px",
              }}
            >
              {"<"}
              {jobTitle}
              {">"}
            </div>

            <div
              className="contact-details"
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "20px",
                marginTop: "15px",
                padding: "10px",
                backgroundColor: "#f7f7f7",
                borderRadius: "4px",
                flexWrap: "wrap",
              }}
            >
              <div className="contact-item">
                <code style={{ color: selectedColor }}># </code>
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    setContactInfo({
                      ...contactInfo,
                      phone: e.target.innerText,
                    })
                  }
                >
                  {contactInfo.phone || "Thêm số điện thoại"}
                </span>
              </div>

              <div className="contact-item">
                <code style={{ color: selectedColor }}>@ </code>
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    setContactInfo({
                      ...contactInfo,
                      email: e.target.innerText,
                    })
                  }
                >
                  {contactInfo.email}
                </span>
              </div>

              <div className="contact-item">
                <code style={{ color: selectedColor }}>~ </code>
                <span
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    setContactInfo({
                      ...contactInfo,
                      address: e.target.innerText,
                    })
                  }
                >
                  {contactInfo.address}
                </span>
              </div>
            </div>
          </div>
        );
      case "elegant":
        return (
          <div
            className="cv-header"
            style={{
              borderBottom: `2px solid ${selectedColor}`,
              paddingBottom: "20px",
              marginBottom: "30px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div className="header-content">
              <div
                className="header-name"
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => setFullName(e.target.innerText)}
                style={{
                  color: selectedColor,
                  fontSize: "28px",
                  fontWeight: "600",
                  marginBottom: "5px",
                }}
              >
                {fullName}
              </div>

              <div
                className="header-title"
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => setJobTitle(e.target.innerText)}
                style={{
                  fontSize: "16px",
                  color: "#555",
                  marginBottom: "15px",
                  fontStyle: "italic",
                }}
              >
                {jobTitle}
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "15px",
                  fontSize: "14px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      color: selectedColor,
                      marginRight: "5px",
                    }}
                  >
                    Điện thoại:
                  </div>
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      setContactInfo({
                        ...contactInfo,
                        phone: e.target.innerText,
                      })
                    }
                  >
                    {contactInfo.phone || "Thêm số điện thoại"}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      color: selectedColor,
                      marginRight: "5px",
                    }}
                  >
                    Email:
                  </div>
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      setContactInfo({
                        ...contactInfo,
                        email: e.target.innerText,
                      })
                    }
                  >
                    {contactInfo.email}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      color: selectedColor,
                      marginRight: "5px",
                    }}
                  >
                    Địa chỉ:
                  </div>
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      setContactInfo({
                        ...contactInfo,
                        address: e.target.innerText,
                      })
                    }
                  >
                    {contactInfo.address}
                  </span>
                </div>
              </div>
            </div>

            <Upload
              name="avatar"
              listType="picture-card"
              className="profile-photo-uploader"
              showUploadList={false}
              onChange={handleProfilePhotoChange}
              beforeUpload={() => false} // prevent auto upload
              style={{
                width: "100%",
                height: "100%",
                display: "block",
                cursor: "pointer",
                position: "relative",
                zIndex: 20,
              }}
            >
              {profilePhotoUrl ? (
                <div
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: `2px solid ${selectedColor}`,
                  }}
                >
                  <img
                    src={profilePhotoUrl}
                    alt="Profile"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "50%",
                    }}
                  />
                </div>
              ) : (
                uploadButton
              )}
            </Upload>
          </div>
        );
      default: // modern
        return (
          <div
            className="cv-header"
            style={{ backgroundColor: `${selectedColor}10` }}
          >
            <div className="profile-photo-container">
              <Upload
                name="avatar"
                listType="picture-card"
                className="profile-photo-uploader"
                showUploadList={false}
                onChange={handleProfilePhotoChange}
                beforeUpload={() => false} // prevent auto upload
                style={{
                  width: "100%",
                  height: "100%",
                  display: "block",
                  cursor: "pointer",
                  position: "relative",
                  zIndex: 20,
                }}
              >
                {profilePhotoUrl ? (
                  <div
                    className="profile-photo"
                    style={{ border: `3px solid ${selectedColor}` }}
                  >
                    <img src={profilePhotoUrl} alt="Profile" />
                  </div>
                ) : (
                  uploadButton
                )}
              </Upload>
            </div>

            <div className="header-content">
              <div
                className="header-name"
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => setFullName(e.target.innerText)}
                style={{ color: selectedColor }}
              >
                {fullName}
              </div>

              <div
                className="header-title"
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => setJobTitle(e.target.innerText)}
              >
                {jobTitle}
              </div>

              <div className="contact-details">
                <div className="contact-item">
                  <span
                    className="contact-icon"
                    style={{ color: selectedColor }}
                  >
                    📱
                  </span>
                  <span
                    className="contact-text"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      setContactInfo({
                        ...contactInfo,
                        phone: e.target.innerText,
                      })
                    }
                  >
                    {contactInfo.phone || "Thêm số điện thoại"}
                  </span>
                </div>

                <div className="contact-item">
                  <span
                    className="contact-icon"
                    style={{ color: selectedColor }}
                  >
                    ✉️
                  </span>
                  <span
                    className="contact-text"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      setContactInfo({
                        ...contactInfo,
                        email: e.target.innerText,
                      })
                    }
                  >
                    {contactInfo.email}
                  </span>
                </div>

                <div className="contact-item">
                  <span
                    className="contact-icon"
                    style={{ color: selectedColor }}
                  >
                    📍
                  </span>
                  <span
                    className="contact-text"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      setContactInfo({
                        ...contactInfo,
                        address: e.target.innerText,
                      })
                    }
                  >
                    {contactInfo.address}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  const handleTemplateChange = (template) => {
    try {
      setSelectedTemplate(template);
      setShowTemplateSelector(false);
      // Use template's color by default when changing templates
      setSelectedColor(template.color);

      // Delay DOM operations to ensure React has completed its updates
      setTimeout(() => {
        try {
          // Update the preview component immediately for PDF generation
          if (previewComponentRef.current) {
            previewComponentRef.current.updateTemplate({
              id: template.id,
              color: template.color,
              font: selectedFont,
              fontSize: fontSize,
            });
          }

          // Force refresh the CV a4 page to apply the new template styles
          const cvA4Page = document.querySelector(".cv-a4-page");
          if (cvA4Page) {
            // Using a safer approach to update class names
            const classesToRemove = Array.from(cvA4Page.classList).filter(
              (cls) => cls.startsWith("template-")
            );

            if (classesToRemove.length > 0) {
              // Remove classes one by one safely
              classesToRemove.forEach((cls) => {
                try {
                  cvA4Page.classList.remove(cls);
                } catch (error) {
                  console.warn("Error removing class:", error);
                }
              });
            }

            // Add the new template class safely
            try {
              cvA4Page.classList.add(`template-${template.id}`);
            } catch (error) {
              console.warn("Error adding template class:", error);
            }

            // Reapply styles based on the template
            try {
              updateElementStylesByTemplate(template.id);
            } catch (error) {
              console.error("Error updating styles:", error);
            }
          }
        } catch (error) {
          console.error("Error in template change operation:", error);
        }
      }, 200); // Increase timeout to ensure DOM is ready
    } catch (error) {
      console.error("Fatal error in template change:", error);
    }
  };

  const cvTheme = {
    color: selectedColor,
    font: selectedFont,
    fontSize: fontSize,
  };

  // Upload button for profile photo with loading indicator
  const uploadButton = (
    <div
      className="upload-button-container"
      style={{
        cursor: "pointer",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {uploadingPhoto ? (
        <div className="upload-progress-container">
          <Spin size="small" />
          <Progress
            type="circle"
            percent={uploadPhotoProgress}
            size={40}
            strokeWidth={6}
            style={{ marginBottom: 8 }}
          />
          <div style={{ fontSize: "12px", marginTop: 5 }}>
            Đang tải... {uploadPhotoProgress}%
          </div>
        </div>
      ) : (
        <>
          <CameraOutlined style={{ fontSize: "24px" }} />
          <div style={{ marginTop: 8 }}>Thêm ảnh</div>
        </>
      )}
    </div>
  );

  const handleSectionContentChange = (sectionId, newContent) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId
          ? { ...section, content: { ...section.content, text: newContent } }
          : section
      )
    );
  };

  return (
    <ErrorBoundary>
      <DndProvider backend={HTML5Backend}>
        <div className="cv-builder">
          {/* Top toolbar for quick actions and closing */}
          <div className="cv-toolbar">
            <Button
              icon={<CloseOutlined />}
              onClick={() => setShowBuilder(false)}
              className="toolbar-btn close-btn"
            >
              Đóng
            </Button>
            <Space size="middle">
              <Tooltip title="Xem CV dưới dạng PDF">
                <Button
                  icon={<EyeOutlined />}
                  onClick={handlePreview}
                  className="toolbar-btn preview-btn"
                  type={previewMode ? "primary" : "default"}
                >
                  {previewMode ? "Chỉnh sửa CV" : "Xem trước CV"}
                </Button>
              </Tooltip>
              <Tooltip title="Tải CV xuống máy">
                <Button
                  icon={<DownloadOutlined />}
                  onClick={handleDownload}
                  className="toolbar-btn download-btn"
                >
                  Tải xuống
                </Button>
              </Tooltip>
              <Tooltip title="Lưu CV vào hồ sơ của bạn">
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  loading={saveLoading}
                  onClick={handleSave}
                  className="toolbar-btn save-btn"
                >
                  Lưu CV
                </Button>
              </Tooltip>
            </Space>
          </div>

          {previewMode ? (
            <div className="preview-container">
              <CVPreview
                ref={previewComponentRef}
                cvTitle={`${fullName} - CV`}
                personalInfo={{
                  fullName,
                  jobTitle,
                  email: contactInfo.email,
                  phone: contactInfo.phone,
                  address: contactInfo.address,
                  photoUrl: profilePhotoUrl,
                  objective: careerObjective,
                  ...personalInfo,
                }}
                workExperiences={workExperiences}
                certificates={certificates}
                skills={skills}
                sections={sections}
                template={{
                  id: selectedTemplate.id,
                  color: selectedColor,
                  font: selectedFont,
                  fontSize: fontSize,
                }}
              />
            </div>
          ) : (
            <div className="cv-main-content">
              {/* Left sidebar: Theme and section options */}
              <div className="cv-sidebar">
                <div className="sidebar-section">
                  <Title level={5}>Thiết kế CV</Title>

                  <Button
                    className="template-button"
                    block
                    onClick={() => setShowTemplateSelector(true)}
                    icon={<FileOutlined />}
                  >
                    Chọn mẫu CV
                  </Button>

                  <Modal
                    title="Chọn mẫu CV"
                    open={showTemplateSelector}
                    onCancel={() => setShowTemplateSelector(false)}
                    width={700}
                    footer={[
                      <Button
                        key="back"
                        onClick={() => setShowTemplateSelector(false)}
                      >
                        Đóng
                      </Button>,
                      <Button
                        key="submit"
                        type="primary"
                        onClick={() => setShowTemplateSelector(false)}
                      >
                        Áp dụng
                      </Button>,
                    ]}
                  >
                    <div style={{ padding: "10px 0" }}>
                      <Text>
                        Mẫu hiện tại:{" "}
                        <Text strong>{selectedTemplate.name}</Text>
                      </Text>
                      <Divider />
                      <CVTemplateSelector
                        templates={CV_TEMPLATES}
                        selectedTemplate={selectedTemplate}
                        onSelect={handleTemplateChange}
                      />
                    </div>
                  </Modal>

                  <Divider />

                  <div className="color-controls">
                    <div className="control-label">Màu chủ đề</div>
                    <div className="color-options">
                      {CV_COLOR_PRESETS.map((preset) => (
                        <Tooltip key={preset.color} title={preset.name}>
                          <div
                            className={`color-preset ${
                              selectedColor === preset.color ? "active" : ""
                            }`}
                            style={{ backgroundColor: preset.color }}
                            onClick={() => setSelectedColor(preset.color)}
                          />
                        </Tooltip>
                      ))}
                      <div
                        className="color-preset add-color"
                        onClick={() => setShowColorPicker(!showColorPicker)}
                      >
                        <PlusOutlined />
                      </div>
                    </div>

                    {/* Modal chọn màu tùy chỉnh */}
                    <Modal
                      title="Chọn màu tùy chỉnh"
                      open={showColorPicker}
                      onCancel={() => setShowColorPicker(false)}
                      footer={[
                        <Button
                          key="back"
                          onClick={() => setShowColorPicker(false)}
                        >
                          Hủy
                        </Button>,
                        <Button
                          key="submit"
                          type="primary"
                          onClick={() => setShowColorPicker(false)}
                        >
                          Áp dụng
                        </Button>,
                      ]}
                    >
                      <div
                        style={{ textAlign: "center", marginBottom: "20px" }}
                      >
                        <ColorPicker
                          showText
                          value={selectedColor}
                          onChange={(color, hex) => setSelectedColor(hex)}
                          presets={[
                            {
                              label: "Màu đề xuất",
                              colors: CV_COLOR_PRESETS.map(
                                (preset) => preset.color
                              ),
                            },
                            {
                              label: "Trung tính",
                              colors: [
                                "#000000",
                                "#333333",
                                "#666666",
                                "#999999",
                                "#CCCCCC",
                                "#FFFFFF",
                              ],
                            },
                          ]}
                        />
                      </div>
                    </Modal>
                  </div>

                  <div className="font-controls">
                    <div className="control-group">
                      <div className="control-label">Font chữ</div>
                      <Select
                        value={selectedFont}
                        onChange={setSelectedFont}
                        className="font-select"
                        dropdownStyle={{ zIndex: 1001 }}
                      >
                        {FONT_OPTIONS.map((font) => (
                          <Option
                            key={font.value}
                            value={font.value}
                            style={{ fontFamily: font.value }}
                          >
                            <span style={{ fontFamily: font.value }}>
                              {font.label}
                            </span>
                          </Option>
                        ))}
                      </Select>
                    </div>

                    <div className="control-group">
                      <div className="control-label">Cỡ chữ</div>
                      <div className="font-size-control">
                        <FontSizeOutlined />
                        <Slider
                          min={10}
                          max={18}
                          step={1}
                          value={fontSize}
                          onChange={setFontSize}
                          className="font-slider"
                        />
                        <span>{fontSize}px</span>
                      </div>
                    </div>

                    <div className="control-group">
                      <div className="control-label">Ngôn ngữ</div>
                      <Select
                        value={i18n.language.startsWith("vi") ? "vi" : "en"}
                        onChange={(value) => {
                          if (i18n) {
                            const changeLang = value === "vi" ? "vi" : "en";
                            i18n.changeLanguage(changeLang);
                          }
                        }}
                        className="language-select"
                        dropdownStyle={{ zIndex: 1001 }}
                      >
                        <Option value="vi">Tiếng Việt</Option>
                        <Option value="en">English</Option>
                      </Select>
                    </div>
                  </div>
                </div>

                <Divider />

                <div className="sidebar-section">
                  <Title level={5}>Thêm mục</Title>
                  <div className="section-list">
                    {AVAILABLE_SECTIONS.map((section) => (
                      <div key={section.id} className="section-item">
                        <Button
                          block
                          className="section-add-btn"
                          onClick={() => addSection(section.id)}
                        >
                          <div className="section-btn-content">
                            <div className="section-btn-title">
                              {section.name}
                            </div>
                            <div className="section-btn-desc">
                              {section.description}
                            </div>
                          </div>
                          <PlusOutlined className="section-btn-icon" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Center: CV Preview with A4 page layout */}
              <div className="cv-preview-container">
                <div
                  className="cv-a4-page"
                  style={{
                    fontFamily: selectedFont,
                    fontSize: `${fontSize}px`,
                    color: "#333",
                  }}
                >
                  {/* Header with name, title and photo */}
                  {renderEditableHeader()}

                  {/* Career Objective */}
                  <div className="cv-section">
                    <div
                      className="section-title"
                      style={{ borderBottomColor: selectedColor }}
                    >
                      MỤC TIÊU NGHỀ NGHIỆP
                    </div>
                    <div
                      className="section-content"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => setCareerObjective(e.target.innerText)}
                      style={{ minHeight: "80px" }}
                    >
                      {careerObjective}
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div className="cv-section">
                    <div
                      className="section-title"
                      style={{ borderBottomColor: selectedColor }}
                    >
                      THÔNG TIN CÁ NHÂN
                    </div>
                    <div className="section-content personal-info">
                      <div className="personal-info-item">
                        <div className="info-label">Ngày sinh</div>
                        <div
                          className="info-value"
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) =>
                            setPersonalInfo({
                              ...personalInfo,
                              birthDate: e.target.innerText,
                            })
                          }
                        >
                          {personalInfo.birthDate || "DD/MM/YYYY"}
                        </div>
                      </div>

                      <div className="personal-info-item">
                        <div className="info-label">Quốc tịch</div>
                        <div
                          className="info-value"
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) =>
                            setPersonalInfo({
                              ...personalInfo,
                              nationality: e.target.innerText,
                            })
                          }
                        >
                          {personalInfo.nationality}
                        </div>
                      </div>

                      <div className="personal-info-item">
                        <div className="info-label">Tình trạng hôn nhân</div>
                        <div
                          className="info-value"
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) =>
                            setPersonalInfo({
                              ...personalInfo,
                              maritalStatus: e.target.innerText,
                            })
                          }
                        >
                          {personalInfo.maritalStatus}
                        </div>
                      </div>

                      <div className="personal-info-item">
                        <div className="info-label">Giới tính</div>
                        <div
                          className="info-value"
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) =>
                            setPersonalInfo({
                              ...personalInfo,
                              gender: e.target.innerText,
                            })
                          }
                        >
                          {personalInfo.gender}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Work Experience - Timeline style */}
                  <div className="cv-section">
                    <div
                      className="section-title"
                      style={{ borderBottomColor: selectedColor }}
                    >
                      KINH NGHIỆM LÀM VIỆC
                    </div>
                    <div className="section-content timeline-section">
                      {workExperiences.map((exp, index) => (
                        <div key={exp.id} className="timeline-item group">
                          <div
                            className="timeline-point"
                            style={{ borderColor: selectedColor }}
                          ></div>
                          <div className="timeline-date">
                            <span
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                updateWorkExperience(
                                  exp.id,
                                  "startDate",
                                  e.target.innerText
                                )
                              }
                              className="date-field"
                            >
                              {exp.startDate}
                            </span>
                            <span className="date-separator">-</span>
                            <span
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                updateWorkExperience(
                                  exp.id,
                                  "endDate",
                                  e.target.innerText
                                )
                              }
                              className="date-field"
                            >
                              {exp.endDate}
                            </span>
                          </div>
                          <div className="timeline-content">
                            <div className="timeline-item-header">
                              <div
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) =>
                                  updateWorkExperience(
                                    exp.id,
                                    "companyName",
                                    e.target.innerText
                                  )
                                }
                                className="company-name"
                              >
                                {exp.companyName}
                              </div>
                              <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => removeWorkExperience(exp.id)}
                                className="invisible remove-item-btn group-hover:visible"
                              />
                            </div>
                            <div
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                updateWorkExperience(
                                  exp.id,
                                  "jobTitle",
                                  e.target.innerText
                                )
                              }
                              className="job-title"
                            >
                              {exp.jobTitle}
                            </div>
                            <div
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                updateWorkExperience(
                                  exp.id,
                                  "description",
                                  e.target.innerText
                                )
                              }
                              className="description"
                            >
                              {exp.description}
                            </div>
                          </div>
                        </div>
                      ))}

                      <Button
                        type="dashed"
                        block
                        icon={<PlusOutlined />}
                        onClick={addWorkExperience}
                        className="add-timeline-btn"
                        style={{ marginTop: "15px" }}
                      >
                        Thêm kinh nghiệm làm việc
                      </Button>
                    </div>
                  </div>

                  {/* Certificates - Timeline style */}
                  <div className="cv-section">
                    <div
                      className="section-title"
                      style={{ borderBottomColor: selectedColor }}
                    >
                      CHỨNG CHỈ
                    </div>
                    <div className="section-content timeline-section">
                      {certificates.map((cert, index) => (
                        <div key={cert.id} className="timeline-item group">
                          <div
                            className="timeline-point"
                            style={{ borderColor: selectedColor }}
                          ></div>
                          <div className="timeline-date">
                            <span
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                updateCertificate(
                                  cert.id,
                                  "date",
                                  e.target.innerText
                                )
                              }
                              className="date-field"
                            >
                              {cert.date}
                            </span>
                          </div>
                          <div className="timeline-content">
                            <div className="timeline-item-header">
                              <div
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) =>
                                  updateCertificate(
                                    cert.id,
                                    "organization",
                                    e.target.innerText
                                  )
                                }
                                className="organization-name"
                              >
                                {cert.organization}
                              </div>
                              <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => removeCertificate(cert.id)}
                                className="invisible remove-item-btn group-hover:visible"
                              />
                            </div>
                            <div
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                updateCertificate(
                                  cert.id,
                                  "name",
                                  e.target.innerText
                                )
                              }
                              className="certificate-name"
                            >
                              {cert.name}
                            </div>
                            <div
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                updateCertificate(
                                  cert.id,
                                  "description",
                                  e.target.innerText
                                )
                              }
                              className="description"
                            >
                              {cert.description}
                            </div>
                          </div>
                        </div>
                      ))}

                      <Button
                        type="dashed"
                        block
                        icon={<PlusOutlined />}
                        onClick={addCertificate}
                        className="add-timeline-btn"
                        style={{ marginTop: "15px" }}
                      >
                        Thêm chứng chỉ
                      </Button>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="cv-section">
                    <div
                      className="section-title"
                      style={{ borderBottomColor: selectedColor }}
                    >
                      KỸ NĂNG
                    </div>
                    <div className="section-content skills-list">
                      {skills.map((skill) => (
                        <div key={skill.id} className="skill-item">
                          <div
                            className="skill-name"
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) =>
                              updateSkill(skill.id, "name", e.target.innerText)
                            }
                          >
                            {skill.name}
                          </div>
                          <div className="skill-controls">
                            <Select
                              value={skill.level}
                              onChange={(value) =>
                                updateSkill(skill.id, "level", value)
                              }
                              className="skill-level-select"
                              size="small"
                              style={{ width: 120, marginRight: 8 }}
                              dropdownStyle={{ zIndex: 1050 }}
                            >
                              <Option value="Beginner">Beginner</Option>
                              <Option value="Intermediate">Intermediate</Option>
                              <Option value="Advanced">Advanced</Option>
                              <Option value="Expert">Expert</Option>
                            </Select>
                            <Button
                              type="text"
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => removeSkill(skill.id)}
                              className="remove-skill-btn"
                            />
                          </div>
                        </div>
                      ))}

                      <Button
                        type="dashed"
                        block
                        icon={<PlusOutlined />}
                        onClick={addSkill}
                        className="add-skill-btn"
                      >
                        Thêm kỹ năng
                      </Button>
                    </div>
                  </div>

                  {/* Draggable Sections */}
                  {sections.map((section) => (
                    <div
                      key={section.id}
                      className="cv-section draggable-section"
                    >
                      <div className="section-header">
                        <div className="section-drag-handle">
                          <DragOutlined />
                        </div>
                        <div
                          className="section-title"
                          style={{ borderBottomColor: selectedColor }}
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) =>
                            handleSectionContentChange(
                              section.id,
                              e.target.innerText
                            )
                          }
                        >
                          {section.title}
                        </div>
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => removeSection(section.id)}
                          className="remove-section-btn"
                        />
                      </div>
                      <div
                        className="section-content"
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) =>
                          handleSectionContentChange(
                            section.id,
                            e.target.innerText
                          )
                        }
                      >
                        {section.content.text || "Nhập nội dung cho mục này..."}
                      </div>
                    </div>
                  ))}

                  <Button
                    className="add-section-btn"
                    type="dashed"
                    block
                    icon={<PlusOutlined />}
                    onClick={() => {
                      // Tạo ID ngẫu nhiên cho mục mới
                      const sectionId = `custom-${Date.now()}`;
                      // Thêm mục mới vào danh sách các mục
                      setSections((prevSections) => [
                        ...prevSections,
                        {
                          id: sectionId,
                          type: "custom",
                          title: "MỤC MỚI",
                          position: prevSections.length,
                          content: {
                            text: "Nhập nội dung cho mục mới tại đây...",
                          },
                        },
                      ]);
                      message.success("Đã thêm mục mới");
                    }}
                  >
                    Thêm mục mới
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Hidden but properly rendered CVPreview component for PDF generation */}
          <div
            style={{
              position: "absolute",
              left: "-9999px",
              top: 0,
              width: "210mm",
              height: "297mm",
              overflow: "hidden",
              visibility: "hidden",
              opacity: 0,
              marginBottom: 0,
              pointerEvents: "none",
            }}
          >
            <CVPreview
              ref={previewComponentRef}
              cvTitle={`${fullName} - CV`}
              personalInfo={{
                fullName,
                jobTitle,
                email: contactInfo.email,
                phone: contactInfo.phone,
                address: contactInfo.address,
                photoUrl: profilePhotoUrl,
                objective: careerObjective,
                ...personalInfo,
              }}
              workExperiences={workExperiences}
              certificates={certificates}
              skills={skills}
              sections={sections}
              template={{
                id: selectedTemplate.id,
                color: selectedColor,
                font: selectedFont,
                fontSize: fontSize,
              }}
            />
          </div>
        </div>
      </DndProvider>
    </ErrorBoundary>
  );
};

export default CVBuilder;
