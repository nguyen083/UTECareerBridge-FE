import { useEffect, useState, useRef, Component } from "react";
import {
  Typography,
  Button,
  Divider,
  message,
  Space,
  Spin,
  Modal,
  Tooltip,
  Select,
  Slider,
  Upload,
  ColorPicker,
  Progress,
  AutoComplete,
  Rate,
  Input,
} from "antd";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  DeleteOutlined,
  EyeOutlined,
  SaveOutlined,
  PlusOutlined,
  DownloadOutlined,
  CloseOutlined,
  FontSizeOutlined,
  CameraOutlined,
  FileOutlined,
  DragOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import "./CVBuilder.scss";
import {
  uploadCV,
  updateCV,
  getSkillStudent,
  getAllSkills,
} from "../../../services/apiService";
import { uploadToCloudinary } from "../../../services/uploadCloudary";
import CVPreview from "./CVPreview";
import CVTemplateSelector from "./CVTemplateSelector";
import { useSelector } from "react-redux";
import { apiService } from "../../../services/getAddressId";
import { useQueryClient } from "@tanstack/react-query";
import AutoResizingInput from "./AutoResizingInput";

const { Title, Text } = Typography;
const { Option } = Select;

// Define item types for drag and drop
// const ItemTypes = {
//   CV_SECTION: "cv_section",
//   CV_ELEMENT: "cv_element",
// };

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
  {
    value: "'Open Sans', sans-serif",
    label: "Open Sans",
    className: "font-open-sans",
  },
  { value: "'Arial', sans-serif", label: "Arial", className: "font-arial" },
  {
    value: "'Times New Roman', serif",
    label: "Times New Roman",
    className: "font-times-new-roman",
  },
  {
    value: "'Helvetica', sans-serif",
    label: "Helvetica",
    className: "font-helvetica",
  },
  {
    value: "'Calibri', sans-serif",
    label: "Calibri",
    className: "font-calibri",
  },
  { value: "'BE Vietnam Pro', sans-serif", label: "BE VietNam Pro" },
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
  const [listSkill, setListSkill] = useState([]);
  const user = useSelector((state) => state.user);
  const student = useSelector((state) => state.student);
  const [sections, setSections] = useState([]);
  const [fullName, setFullName] = useState(
    student.lastName + " " + student.firstName
  );
  const [jobTitle, setJobTitle] = useState("");
  const [careerObjective, setCareerObjective] = useState("");
  const [contactInfo, setContactInfo] = useState({
    email: user.email,
    phone: student.phoneNumber,
    address: student.address,
  });
  const [personalInfo, setPersonalInfo] = useState({
    birthDate: student.dob,
    nationality: "",
    maritalStatus: "",
    gender: student.gender ? "Nữ" : "Nam",
  });
  const [skills, setSkills] = useState([]);

  // Work Experience
  const [workExperiences, setWorkExperiences] = useState([]);

  // Certificates
  const [certificates, setCertificates] = useState([]);

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
    if (!existingCvData) {
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
              level: item.level || 3,
            };
          })
        );
      });
    }
  }, [student]);

  useEffect(() => {
    if (existingCvData) {
      try {
        console.log("Loading existing CV data:", existingCvData);

        // Load personal info
        if (existingCvData.personalInfo) {
          setFullName(existingCvData.personalInfo.fullName || "");
          setJobTitle(existingCvData.personalInfo.jobTitle || "");

          // Load career objective
          if (existingCvData.personalInfo.careerObjective) {
            setCareerObjective(existingCvData.personalInfo.careerObjective);
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
            nationality: existingCvData.personalInfo.nationality || "",
            maritalStatus: existingCvData.personalInfo.maritalStatus || "",
            gender: existingCvData.personalInfo.gender || "",
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
          console.log(
            CV_TEMPLATES.find((t) => t.id === existingCvData.theme.id)
          );
          setSelectedTemplate(
            CV_TEMPLATES.find((t) => t.id === existingCvData.theme.id) ||
              CV_TEMPLATES[0]
          );

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

  useEffect(() => {
    getAllSkills().then((res) => {
      setListSkill(res.data.map((item) => item.skillName));
    });
  }, []);

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
          id: selectedTemplate.id,
          color: selectedColor,
          font: selectedFont,
          fontSize: fontSize,
        },
        personalInfo: {
          fullName,
          jobTitle,
          ...contactInfo,
          ...personalInfo,
          careerObjective,
          photoUrl: photoUrl,
        },
        sections: sections,
        workExperiences: workExperiences,
        certificates: certificates,
        skills: skills,
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
    setSkills([...skills, { id: newId, name: "Kỹ năng mới", level: 3 }]);
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
        companyName: "",
        jobTitle: "",
        startDate: "",
        endDate: "",
        description: "",
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
        organization: "",
        name: "",
        score: "",
        date: "",
        description: "",
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

  // const handleColorSelect = (color) => {
  //   setSelectedColor(color);
  //   setShowColorPicker(false);
  // };

  const renderEditableHeader = () => {
    switch (selectedTemplate.id) {
      case "professional":
        return (
          <div
            className="overflow-hidden rounded-lg shadow-md"
            style={{ backgroundColor: `${selectedColor}15` }}
          >
            <div className="flex flex-col items-center gap-6 p-6 md:flex-row md:items-start">
              <div className="flex-shrink-0">
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  onChange={handleProfilePhotoChange}
                  beforeUpload={() => false} // prevent auto upload
                >
                  {profilePhotoUrl ? (
                    <img
                      src={profilePhotoUrl}
                      alt="Profile"
                      className="object-cover min-w-full min-h-full rounded-full"
                    />
                  ) : (
                    <div
                      className="flex items-center justify-center w-32 h-32 bg-gray-100 rounded-full ring-4"
                      style={{
                        ringColor: selectedColor,
                        border: `2px solid white`,
                      }}
                    >
                      <div className="text-center">
                        <div className="flex justify-center">
                          <UploadOutlined style={{ fontSize: "24px" }} />
                        </div>
                        <div className="mt-2 text-xs">Tải lên ảnh</div>
                      </div>
                    </div>
                  )}
                </Upload>
              </div>

              <div className="flex flex-col items-center flex-grow md:items-start">
                <Input
                  placeholder="Họ và tên"
                  value={fullName || ""}
                  onChange={(e) => setFullName(e.target.value)}
                  size="large"
                  className={`mb-2 text-2xl font-bold md:text-3xl ${
                    !fullName ? "empty-input" : ""
                  } border-none bg-transparent px-2 py-1 !shadow-none`}
                  style={{
                    fontFamily: selectedFont,
                    fontSize: `${fontSize + 8}px`,
                    color: selectedColor,
                    fontWeight: "bold",
                  }}
                />

                <Input
                  placeholder="Chức danh - kinh nghiệm"
                  value={jobTitle || ""}
                  onChange={(e) => setJobTitle(e.target.value)}
                  size="middle"
                  className={`mb-4 text-lg font-medium text-gray-700 ${
                    !jobTitle ? "empty-input" : ""
                  } border-none bg-transparent px-2 py-1 !shadow-none`}
                  style={{
                    fontFamily: selectedFont,
                    fontSize: `${fontSize + 2}px`,
                  }}
                />

                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center">
                    <span
                      className="mr-2 text-xl"
                      style={{ color: selectedColor }}
                    >
                      📱
                    </span>
                    <Input
                      placeholder="Số điện thoại"
                      value={contactInfo.phone || ""}
                      onChange={(e) =>
                        setContactInfo({
                          ...contactInfo,
                          phone: e.target.value,
                        })
                      }
                      size="small"
                      className="border-none bg-transparent !shadow-none"
                      style={{
                        fontFamily: selectedFont,
                        fontSize: `${fontSize}px`,
                      }}
                    />
                  </div>

                  <div className="flex items-center">
                    <span
                      className="mr-2 text-xl"
                      style={{ color: selectedColor }}
                    >
                      ✉️
                    </span>
                    <Input
                      placeholder="Địa chỉ Email"
                      value={contactInfo.email || ""}
                      onChange={(e) =>
                        setContactInfo({
                          ...contactInfo,
                          email: e.target.value,
                        })
                      }
                      size="small"
                      className="border-none bg-transparent !shadow-none"
                      style={{
                        fontFamily: selectedFont,
                        fontSize: `${fontSize}px`,
                      }}
                    />
                  </div>

                  <div className="flex items-center">
                    <span
                      className="mr-2 text-xl"
                      style={{ color: selectedColor }}
                    >
                      📍
                    </span>
                    <Input
                      placeholder="Địa chỉ"
                      value={contactInfo.address || ""}
                      onChange={(e) =>
                        setContactInfo({
                          ...contactInfo,
                          address: e.target.value,
                        })
                      }
                      size="small"
                      className="border-none bg-transparent !shadow-none"
                      style={{
                        fontFamily: selectedFont,
                        fontSize: `${fontSize}px`,
                        borderBottom: "1px dashed #f0f0f0",
                        minWidth: "100px",
                      }}
                    />
                  </div>
                </div>
              </div>
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

              <div className="flex flex-col">
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
                    width: "fit-content",
                    minWidth: "100px",
                    backgroundColor: "rgba(255,255,255,0.2)",
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
            className="overflow-hidden shadow-sm cv-header"
            style={{
              borderBottom: `2px solid ${selectedColor}`,
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-grow header-content">
                <div className="flex flex-col">
                  <Input
                    placeholder="Họ và tên"
                    value={fullName || ""}
                    onChange={(e) => setFullName(e.target.value)}
                    size="small"
                    className="border-none !bg-transparent !shadow-none"
                    style={{
                      color: selectedColor,
                      fontSize: "28px",
                      fontWeight: "600",
                    }}
                    minWidth={150}
                    maxWidth={400}
                  />

                  <Input
                    placeholder="Chức danh - kinh nghiệm"
                    value={jobTitle || ""}
                    onChange={(e) => setJobTitle(e.target.value)}
                    size="small"
                    className="border-none !bg-transparent !shadow-none mb-4 italic text-gray-600"
                    style={{
                      fontSize: "16px",
                      fontFamily: selectedFont,
                    }}
                    minWidth={180}
                    maxWidth={400}
                  />
                </div>

                <div className="flex flex-wrap mt-2 mb-2 text-sm">
                  <div className="flex items-center">
                    <div
                      className="font-medium"
                      style={{
                        color: selectedColor,
                      }}
                    >
                      Điện thoại:
                    </div>
                    <AutoResizingInput
                      placeholder="Số điện thoại"
                      value={contactInfo.phone || ""}
                      onChange={(e) =>
                        setContactInfo({
                          ...contactInfo,
                          phone: e.target.value,
                        })
                      }
                      size="small"
                      className="border-none !bg-transparent !shadow-none"
                      style={{
                        fontFamily: selectedFont,
                        fontSize: `${fontSize}px`,
                      }}
                      minWidth={100}
                    />
                  </div>

                  <div className="flex items-center">
                    <div
                      className="font-medium"
                      style={{
                        color: selectedColor,
                      }}
                    >
                      Email:
                    </div>
                    <AutoResizingInput
                      placeholder="Địa chỉ Email"
                      value={contactInfo.email || ""}
                      onChange={(e) =>
                        setContactInfo({
                          ...contactInfo,
                          email: e.target.value,
                        })
                      }
                      size="small"
                      className="border-none !bg-transparent !shadow-none"
                      style={{
                        fontFamily: selectedFont,
                        fontSize: `${fontSize}px`,
                      }}
                      minWidth={120}
                    />
                  </div>

                  <div className="flex items-center">
                    <div
                      className="font-medium"
                      style={{
                        color: selectedColor,
                      }}
                    >
                      Địa chỉ:
                    </div>
                    <AutoResizingInput
                      placeholder="Địa chỉ"
                      value={contactInfo.address || ""}
                      onChange={(e) =>
                        setContactInfo({
                          ...contactInfo,
                          address: e.target.value,
                        })
                      }
                      size="small"
                      className="border-none !bg-transparent !shadow-none"
                      style={{
                        fontFamily: selectedFont,
                        fontSize: `${fontSize}px`,
                      }}
                      minWidth={120}
                    />
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 ml-4">
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="profile-photo-uploader"
                  showUploadList={false}
                  onChange={handleProfilePhotoChange}
                  beforeUpload={() => false} // prevent auto upload
                >
                  {profilePhotoUrl ? (
                    <div
                      className="w-24 h-24 overflow-hidden border-2 rounded-full"
                      style={{
                        borderColor: selectedColor,
                      }}
                    >
                      <img
                        src={profilePhotoUrl}
                        alt="Profile"
                        className="object-cover w-full h-full rounded-full"
                      />
                    </div>
                  ) : (
                    <div
                      className="flex items-center justify-center w-24 h-24 bg-gray-100 border-2 rounded-full"
                      style={{
                        borderColor: selectedColor,
                      }}
                    >
                      <div className="text-center">
                        <div className="flex justify-center">
                          <UploadOutlined style={{ fontSize: "20px" }} />
                        </div>
                        <div className="mt-1 text-xs">Tải lên ảnh</div>
                      </div>
                    </div>
                  )}
                </Upload>
              </div>
            </div>
          </div>
        );
      default: // modern
        return (
          <div
            className="overflow-hidden rounded-lg shadow-md"
            style={{ backgroundColor: `${selectedColor}15` }}
          >
            <div className="flex flex-col items-center gap-4 p-6 md:flex-row md:items-start">
              <div className="flex-shrink-0">
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className=" avatar-uploader"
                  showUploadList={false}
                  onChange={handleProfilePhotoChange}
                  beforeUpload={() => false} // prevent auto upload
                >
                  {profilePhotoUrl ? (
                    <img
                      src={profilePhotoUrl}
                      alt="Profile"
                      className="object-cover min-w-full min-h-full rounded-full"
                    />
                  ) : (
                    <div
                      className="flex items-center justify-center w-32 h-32 bg-gray-100 rounded-full ring-4"
                      style={{
                        ringColor: selectedColor,
                        border: `2px solid white`,
                      }}
                    >
                      <div className="text-center">
                        <div className="flex justify-center">
                          <UploadOutlined style={{ fontSize: "24px" }} />
                        </div>
                        <div className="mt-2 text-xs">Tải lên ảnh</div>
                      </div>
                    </div>
                  )}
                </Upload>
              </div>

              <div className="flex flex-col items-center flex-grow md:items-start">
                <Input
                  placeholder="Họ và tên"
                  value={fullName || ""}
                  onChange={(e) => setFullName(e.target.value)}
                  size="small"
                  className="border-none !bg-transparent !shadow-none mb-1"
                  style={{
                    fontFamily: selectedFont,
                    fontSize: `${fontSize + 8}px`,
                    color: selectedColor,
                    fontWeight: "bold",
                  }}
                />

                <Input
                  placeholder="Chức danh - kinh nghiệm"
                  value={jobTitle || ""}
                  onChange={(e) => setJobTitle(e.target.value)}
                  size="middle"
                  className="border-none !bg-transparent !shadow-none mb-1"
                  style={{
                    fontFamily: selectedFont,
                    fontSize: `${fontSize + 2}px`,
                  }}
                />

                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center">
                    <span
                      className="mr-2 text-xl"
                      style={{ color: selectedColor }}
                    >
                      📱
                    </span>
                    <AutoResizingInput
                      placeholder="Số điện thoại"
                      value={contactInfo.phone || ""}
                      onChange={(e) =>
                        setContactInfo({
                          ...contactInfo,
                          phone: e.target.value,
                        })
                      }
                      size="small"
                      className="border-none !bg-transparent !shadow-none"
                      style={{
                        fontFamily: selectedFont,
                        fontSize: `${fontSize}px`,
                      }}
                      minWidth={100}
                    />
                  </div>

                  <div className="flex items-center">
                    <span
                      className="mr-2 text-xl"
                      style={{ color: selectedColor }}
                    >
                      ✉️
                    </span>
                    <AutoResizingInput
                      placeholder="Địa chỉ Email"
                      value={contactInfo.email || ""}
                      onChange={(e) =>
                        setContactInfo({
                          ...contactInfo,
                          email: e.target.value,
                        })
                      }
                      size="small"
                      className="border-none !bg-transparent !shadow-none"
                      style={{
                        fontFamily: selectedFont,
                        fontSize: `${fontSize}px`,
                      }}
                      minWidth={120}
                    />
                  </div>

                  <div className="flex items-center">
                    <span
                      className="mr-2 text-xl"
                      style={{ color: selectedColor }}
                    >
                      📍
                    </span>
                    <AutoResizingInput
                      placeholder="Địa chỉ"
                      value={contactInfo.address || ""}
                      onChange={(e) =>
                        setContactInfo({
                          ...contactInfo,
                          address: e.target.value,
                        })
                      }
                      size="small"
                      className="border-none !bg-transparent !shadow-none"
                      style={{
                        fontFamily: selectedFont,
                        fontSize: `${fontSize}px`,
                      }}
                      minWidth={120}
                    />
                  </div>
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
          }
        } catch (error) {
          console.error("Error in template change operation:", error);
        }
      }, 200); // Increase timeout to ensure DOM is ready
    } catch (error) {
      console.error("Fatal error in template change:", error);
    }
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

  useEffect(() => {
    // Áp dụng lớp empty-content cho tất cả các phần tử trống
    document.querySelectorAll("[contenteditable]").forEach((el) => {
      if (!el.textContent.trim()) {
        el.classList.add("empty-content");
      }
    });
  }, []);

  // Thêm useEffect này để đảm bảo kiểm tra mọi trường khi component render
  useEffect(() => {
    // Xử lý các thông tin cá nhân
    document.querySelectorAll("[contenteditable]").forEach((el) => {
      const content = el.textContent.trim();
      if (!content) {
        el.classList.add("empty-content");
      } else {
        el.classList.remove("empty-content");
      }
    });

    // Chạy lại kiểm tra sau khi component đã render hoàn toàn
    setTimeout(() => {
      document.querySelectorAll("[contenteditable]").forEach((el) => {
        const content = el.textContent.trim();
        if (!content) {
          el.classList.add("empty-content");
        } else {
          el.classList.remove("empty-content");
        }
      });
    }, 100);
  }, [
    fullName,
    jobTitle,
    contactInfo.phone,
    contactInfo.email,
    contactInfo.address,
    personalInfo.birthDate,
    personalInfo.nationality,
    personalInfo.maritalStatus,
    personalInfo.gender,
    careerObjective,
  ]);

  // Thêm vào cuối useEffect xử lý dữ liệu hiện có
  useEffect(() => {
    if (existingCvData) {
      // ... code hiện có

      // Thêm đoạn này
      setTimeout(() => {
        document.querySelectorAll("[contenteditable]").forEach((el) => {
          if (el.textContent.trim()) {
            el.classList.remove("empty-content");
          } else {
            el.classList.add("empty-content");
          }
        });
      }, 500);
    }
  }, [existingCvData]);

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
              <Button
                icon={<EyeOutlined />}
                onClick={handlePreview}
                className="toolbar-btn preview-btn"
                type={previewMode ? "primary" : "default"}
              >
                {previewMode ? "Chỉnh sửa CV" : "Xem trước CV"}
              </Button>
              <Button
                icon={<DownloadOutlined />}
                onClick={handleDownload}
                className="toolbar-btn download-btn"
              >
                Tải xuống
              </Button>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                loading={saveLoading}
                onClick={handleSave}
                className="toolbar-btn save-btn"
              >
                Lưu CV
              </Button>
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
                    <div className="section-content">
                      <Input.TextArea
                        placeholder="Nhập mục tiêu nghề nghiệp của bạn tại đây..."
                        value={careerObjective || ""}
                        onChange={(e) => setCareerObjective(e.target.value)}
                        autoSize={{ minRows: 2, maxRows: 6 }}
                        className={`w-full ${
                          careerObjective ? "border-transparent" : "empty-input"
                        } border-none bg-transparent px-2 py-1 resize-none !shadow-none`}
                        style={{
                          fontFamily: selectedFont,
                          fontSize: `${fontSize}px`,
                          minHeight: "80px",
                        }}
                      />
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
                        <Input
                          placeholder="Ngày / tháng / năm"
                          value={personalInfo.birthDate || ""}
                          onChange={(e) =>
                            setPersonalInfo({
                              ...personalInfo,
                              birthDate: e.target.value,
                            })
                          }
                          size="small"
                          className={`info-value ${
                            personalInfo.birthDate
                              ? "border-transparent"
                              : "empty-input"
                          } border-none bg-transparent px-2 py-1 !shadow-none`}
                          style={{
                            fontFamily: selectedFont,
                            fontSize: `${fontSize}px`,
                          }}
                        />
                      </div>

                      <div className="personal-info-item">
                        <div className="info-label">Quốc tịch</div>
                        <Input
                          placeholder="Quốc tịch"
                          value={personalInfo.nationality || ""}
                          onChange={(e) =>
                            setPersonalInfo({
                              ...personalInfo,
                              nationality: e.target.value,
                            })
                          }
                          size="small"
                          className={`info-value ${
                            personalInfo.nationality
                              ? "border-transparent"
                              : "empty-input"
                          } border-none bg-transparent px-2 py-1 !shadow-none`}
                          style={{
                            fontFamily: selectedFont,
                            fontSize: `${fontSize}px`,
                          }}
                        />
                      </div>

                      <div className="personal-info-item">
                        <div className="info-label">Tình trạng hôn nhân</div>
                        <Input
                          placeholder="Độc thân / Đã kết hôn"
                          value={personalInfo.maritalStatus || ""}
                          onChange={(e) =>
                            setPersonalInfo({
                              ...personalInfo,
                              maritalStatus: e.target.value,
                            })
                          }
                          size="small"
                          className={`info-value ${
                            personalInfo.maritalStatus
                              ? "border-transparent"
                              : "empty-input"
                          } border-none bg-transparent px-2 py-1 !shadow-none`}
                          style={{
                            fontFamily: selectedFont,
                            fontSize: `${fontSize}px`,
                          }}
                        />
                      </div>

                      <div className="personal-info-item">
                        <div className="info-label">Giới tính</div>
                        <Input
                          placeholder="Nam / Nữ"
                          value={personalInfo.gender || ""}
                          onChange={(e) =>
                            setPersonalInfo({
                              ...personalInfo,
                              gender: e.target.value,
                            })
                          }
                          size="small"
                          className={`info-value ${
                            personalInfo.gender
                              ? "border-transparent"
                              : "empty-input"
                          } border-none bg-transparent px-2 py-1 !shadow-none`}
                          style={{
                            fontFamily: selectedFont,
                            fontSize: `${fontSize}px`,
                          }}
                        />
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
                      {workExperiences.map((exp) => (
                        <div key={exp.id} className="timeline-item group">
                          <div
                            className="timeline-point"
                            style={{ borderColor: selectedColor }}
                          ></div>
                          <div className="timeline-date">
                            <div className="flex items-center">
                              <Input
                                placeholder="Ngày bắt đầu"
                                value={exp.startDate || ""}
                                onChange={(e) =>
                                  updateWorkExperience(
                                    exp.id,
                                    "startDate",
                                    e.target.value
                                  )
                                }
                                size="small"
                                className={`w-full border-none ${
                                  exp.startDate
                                    ? "border-transparent"
                                    : "border-gray-300"
                                } rounded-md bg-transparent text-base font-normal px-2 py-1 experience-date-input !shadow-none`}
                                style={{
                                  fontFamily: selectedFont,
                                  fontSize: `${fontSize}px`,
                                }}
                              />
                              <span className="mx-2 date-separator">-</span>
                              <Input
                                placeholder="Ngày kết thúc"
                                value={exp.endDate || ""}
                                onChange={(e) =>
                                  updateWorkExperience(
                                    exp.id,
                                    "endDate",
                                    e.target.value
                                  )
                                }
                                size="small"
                                className={`w-full border-none ${
                                  exp.endDate
                                    ? "border-transparent"
                                    : "border-gray-300"
                                } rounded-md bg-transparent text-base font-normal px-2 py-1 experience-date-input !shadow-none`}
                                style={{
                                  fontFamily: selectedFont,
                                  fontSize: `${fontSize}px`,
                                }}
                              />
                            </div>
                          </div>
                          <div className="timeline-content">
                            <div
                              className="timeline-item-header"
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <Input
                                placeholder="Tên công ty"
                                value={exp.companyName || ""}
                                onChange={(e) =>
                                  updateWorkExperience(
                                    exp.id,
                                    "companyName",
                                    e.target.value
                                  )
                                }
                                size="middle"
                                className={`company-name-input ${
                                  exp.companyName
                                    ? "border-transparent"
                                    : "border-gray-300"
                                } rounded-md bg-transparent text-base !font-semibold px-2.5 py-1.5 !shadow-none !border-none border-color-transparent`}
                                style={{
                                  fontFamily: selectedFont,
                                  fontSize: `${fontSize}px`,
                                }}
                              />
                              <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => removeWorkExperience(exp.id)}
                                className="invisible remove-item-btn group-hover:visible"
                              />
                            </div>
                            <Input
                              placeholder="Vị trí công việc"
                              value={exp.jobTitle || ""}
                              onChange={(e) =>
                                updateWorkExperience(
                                  exp.id,
                                  "jobTitle",
                                  e.target.value
                                )
                              }
                              size="middle"
                              className={`${
                                exp.jobTitle
                                  ? "border-transparent"
                                  : "border-d9d9d9"
                              } border-none !hover:bg-transparent rounded-md bg-transparent text-base font-normal px-2 py-1 text-gray-600 !shadow-none`}
                              style={{
                                fontFamily: selectedFont,
                                fontSize: `${fontSize}px`,
                              }}
                            />
                            <Input.TextArea
                              placeholder="Mô tả công việc"
                              value={exp.description || ""}
                              onChange={(e) =>
                                updateWorkExperience(
                                  exp.id,
                                  "description",
                                  e.target.value
                                )
                              }
                              autoSize={{ minRows: 2, maxRows: 6 }}
                              className={`w-full border ${
                                exp.description
                                  ? "border-transparent"
                                  : "border-d9d9d9"
                              } rounded-md bg-transparent text-base font-normal px-2 py-1 resize-none !shadow-none !border-none border-color-transparent`}
                              style={{
                                fontFamily: selectedFont,
                                fontSize: `${fontSize}px`,
                              }}
                            />
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
                      {certificates.map((cert) => (
                        <div key={cert.id} className="timeline-item group">
                          <div
                            className="timeline-point"
                            style={{ borderColor: selectedColor }}
                          ></div>
                          <div className="timeline-date">
                            <Input
                              placeholder="Ngày cấp"
                              value={cert.date || ""}
                              onChange={(e) =>
                                updateCertificate(
                                  cert.id,
                                  "date",
                                  e.target.value
                                )
                              }
                              size="small"
                              style={{
                                fontFamily: selectedFont,
                                fontSize: `${fontSize}px`,
                              }}
                              className={`w-fit border-none ${
                                cert.date
                                  ? "border-transparent"
                                  : "border-gray-300"
                              } rounded-md bg-transparent text-base font-normal px-2 py-1 certificate-date-input !shadow-none`}
                            />
                          </div>
                          <div className="timeline-content">
                            <div
                              className="timeline-item-header"
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <Input
                                placeholder="Tên tổ chức"
                                value={cert.organization || ""}
                                onChange={(e) =>
                                  updateCertificate(
                                    cert.id,
                                    "organization",
                                    e.target.value
                                  )
                                }
                                size="middle"
                                className={`organization-name-input ${
                                  cert.organization
                                    ? "border-transparent"
                                    : "border-gray-300"
                                }  rounded-md bg-transparent text-base !font-semibold px-2.5 py-1.5 !shadow-none !border-none border-color-transparent`}
                                style={{
                                  fontFamily: selectedFont,
                                  fontSize: `${fontSize}px`,
                                }}
                              />
                              <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => removeCertificate(cert.id)}
                                className="invisible remove-item-btn group-hover:visible"
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <AutoResizingInput
                                placeholder="Tên chứng chỉ"
                                value={cert.name || ""}
                                onChange={(e) =>
                                  updateCertificate(
                                    cert.id,
                                    "name",
                                    e.target.value
                                  )
                                }
                                size="middle"
                                className={` ${
                                  cert.name
                                    ? "border-transparent"
                                    : "border-d9d9d9"
                                } border-none !hover:bg-transparent rounded-md bg-transparent text-base font-normal px-2 py-1 text-gray-600 !shadow-none`}
                                style={{
                                  fontFamily: selectedFont,
                                  fontSize: `${fontSize}px`,
                                }}
                                minWidth={150}
                              />
                              <AutoResizingInput
                                placeholder="Điểm"
                                value={cert.score || ""}
                                onChange={(e) =>
                                  updateCertificate(
                                    cert.id,
                                    "score",
                                    e.target.value
                                  )
                                }
                                size="middle"
                                className={` ${
                                  cert.score
                                    ? "border-transparent"
                                    : "border-d9d9d9"
                                } border-none !hover:bg-transparent rounded-md bg-transparent text-base font-normal px-2 py-1 text-gray-600 !shadow-none`}
                                style={{
                                  fontFamily: selectedFont,
                                  fontSize: `${fontSize}px`,
                                }}
                                minWidth={150}
                              />
                            </div>

                            <Input.TextArea
                              placeholder="Mô tả về chứng chỉ"
                              value={cert.description || ""}
                              onChange={(e) =>
                                updateCertificate(
                                  cert.id,
                                  "description",
                                  e.target.value
                                )
                              }
                              autoSize={{ minRows: 2, maxRows: 6 }}
                              className={`w-full border ${
                                cert.description
                                  ? "border-transparent"
                                  : "border-d9d9d9"
                              } rounded-md bg-transparent text-base font-normal px-2 py-1 resize-none !shadow-none !border-none border-color-transparent`}
                              style={{
                                fontFamily: selectedFont,
                                fontSize: `${fontSize}px`,
                              }}
                            />
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
                          <AutoComplete
                            className="skill-name-autocomplete"
                            value={skill.name}
                            options={listSkill.map((name) => ({ value: name }))}
                            onChange={(value) =>
                              updateSkill(skill.id, "name", value)
                            }
                            placeholder="Nhập tên kỹ năng"
                            style={{ width: "50%", marginRight: 8 }}
                            filterOption={(inputValue, option) =>
                              option.value
                                .toLowerCase()
                                .indexOf(inputValue.toLowerCase()) !== -1
                            }
                          />
                          <div className="skill-controls">
                            <Rate
                              value={skill.level}
                              onChange={(value) =>
                                updateSkill(skill.id, "level", value)
                              }
                              className="skill-level-rate"
                              style={{ marginRight: 8 }}
                            />
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
                        <Input
                          value={section.title || ""}
                          onChange={(e) => {
                            setSections((prevSections) =>
                              prevSections.map((s) =>
                                s.id === section.id
                                  ? { ...s, title: e.target.value }
                                  : s
                              )
                            );
                          }}
                          className="section-title border-none bg-transparent px-2 py-1 !shadow-none"
                          style={{
                            fontFamily: selectedFont,
                            fontSize: `${fontSize + 2}px`,
                            fontWeight: "bold",
                            borderBottomColor: selectedColor,
                            borderBottom: `2px solid ${selectedColor}`,
                          }}
                        />
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => removeSection(section.id)}
                          className="remove-section-btn"
                        />
                      </div>
                      <Input.TextArea
                        value={section.content?.text || ""}
                        placeholder="Nhập nội dung cho mục này..."
                        onChange={(e) => {
                          handleSectionContentChange(
                            section.id,
                            e.target.value
                          );
                        }}
                        autoSize={{ minRows: 3, maxRows: 10 }}
                        className="section-content border-none bg-transparent px-2 py-1 !shadow-none"
                        style={{
                          fontFamily: selectedFont,
                          fontSize: `${fontSize}px`,
                        }}
                      />
                    </div>
                  ))}
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
