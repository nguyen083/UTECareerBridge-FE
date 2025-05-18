import {
  Modal,
  Typography,
  List,
  Avatar,
  Tag,
  Spin,
  Progress,
  Alert,
} from "antd";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { UserOutlined } from "@ant-design/icons";

const { Text } = Typography;

// Fake data cho danh sách sinh viên
const fakeStudents = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    avatar: null,
    email: "nguyenvana@student.hcmute.edu.vn",
    major: "Công nghệ thông tin",
    matchPercent: 95,
    skills: ["React", "JavaScript", "Node.js"],
    yearOfStudy: 4,
  },
  {
    id: 2,
    name: "Trần Thị B",
    avatar: null,
    email: "tranthib@hcmus.edu.vn",
    major: "Khoa học máy tính",
    matchPercent: 88,
    skills: ["Python", "Machine Learning", "SQL"],
    yearOfStudy: 3,
  },
  {
    id: 3,
    name: "Lê Văn C",
    avatar: null,
    email: "levanc@hcmut.edu.vn",
    major: "Kỹ thuật phần mềm",
    matchPercent: 82,
    skills: ["Java", "Spring Boot", "Docker", "React", "Node.js"],
    yearOfStudy: 5,
  },
  {
    id: 4,
    name: "Phạm Thị D",
    avatar: null,
    email: "phamthid@uit.edu.vn",
    major: "An toàn thông tin",
    matchPercent: 78,
    skills: ["Security", "C++", "Linux"],
    yearOfStudy: 4,
  },
  {
    id: 5,
    name: "Hoàng Văn E",
    avatar: null,
    email: "hoangvane@student.hcmute.edu.vn",
    major: "Hệ thống thông tin",
    matchPercent: 75,
    skills: ["Database", "SQL", "PHP"],
    yearOfStudy: 2,
  },
];

const AnalyzeCVsModal = ({ open, setOpen }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    // Giả lập gọi API
    if (open) {
      setLoading(true);
      setTimeout(() => {
        setStudents(fakeStudents);
        setLoading(false);
      }, 1500);
    }
  }, [open]);

  const getMatchColor = (percent) => {
    if (percent >= 90) return "green";
    if (percent >= 80) return "blue";
    if (percent >= 70) return "gold";
    return "orange";
  };

  const renderSkillTags = (skills) => {
    if (skills.length <= 3) {
      return skills.map((skill) => (
        <Tag color="blue" key={skill} className="p-0.5 mb-1 mr-1 text-xs w-fit">
          {skill}
        </Tag>
      ));
    } else {
      const displayedSkills = skills.slice(0, 3);
      const remainingCount = skills.length - 3;

      return (
        <>
          {displayedSkills.map((skill) => (
            <Tag color="blue" key={skill} className="mb-1 mr-1 w-fit">
              {skill}
            </Tag>
          ))}
          <Tag color="blue" className="mb-1 mr-1 w-fit">
            +{remainingCount}
          </Tag>
        </>
      );
    }
  };

  return (
    <Modal
      title={
        <Text className="!mb-0 text-xl font-bold">
          {t("employer.applicant.analyze")}
        </Text>
      }
      width={800}
      centered
      open={open}
      footer={null}
      onCancel={() => setOpen(false)}
      className="analyze-cvs-modal"
    >
      <div className="py-2 max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-webkit">
        <Alert
          message="Phân tích CV theo công việc"
          description="Chức năng này giúp bạn phân tích các CV apply dựa trên độ phù hợp với công việc."
          type="info"
          showIcon
          className="mb-4"
        />

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Spin size="large" tip="Đang phân tích..." />
          </div>
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={students}
            renderItem={(student) => (
              <List.Item
                key={student.id}
                className="!p-3 mb-3 transition-all border rounded-lg hover:shadow-md"
                actions={[
                  <div
                    className="flex flex-col items-center gap-2"
                    key="match-percent"
                  >
                    <Progress
                      type="circle"
                      percent={student.matchPercent}
                      size={50}
                      strokeColor={getMatchColor(student.matchPercent)}
                    />
                    <Text className="text-sm font-medium">Độ phù hợp</Text>
                  </div>,
                ]}
              >
                <List.Item.Meta
                  avatar={<Avatar size={48} icon={<UserOutlined />} />}
                  title={
                    <div className="flex flex-wrap items-center gap-2">
                      <Text strong>{student.name}</Text>
                    </div>
                  }
                  description={
                    <div className="space-y-2 text-sm">
                      <div className="flex">
                        <div className="w-1/4">
                          <Text type="secondary" className="text-sm">
                            Email:
                          </Text>
                        </div>
                        <div className="w-3/4">
                          <Text className="text-sm">{student.email}</Text>
                        </div>
                      </div>
                      <div className="flex">
                        <div className="w-1/4">
                          <Text type="secondary" className="text-sm">
                            Ngành:
                          </Text>
                        </div>
                        <div className="w-3/4">
                          <Text className="text-sm">{student.major}</Text>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-1/4">
                          <Text type="secondary" className="text-sm">
                            Năm thứ:
                          </Text>
                        </div>
                        <div className="flex items-center w-3/4">
                          <Text className="text-sm">{student.yearOfStudy}</Text>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Text type="secondary" className="text-sm">
                            Kỹ năng:
                          </Text>
                          <div className="flex flex-wrap mt-1">
                            {renderSkillTags(student.skills)}
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </div>
    </Modal>
  );
};

export default AnalyzeCVsModal;
