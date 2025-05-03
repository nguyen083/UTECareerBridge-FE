import React, { useRef } from 'react';
import { Button, Input, Select, DatePicker, Space } from 'antd';
import { DeleteOutlined, DragOutlined, PlusOutlined } from '@ant-design/icons';
import { useDrag, useDrop } from 'react-dnd';
import { v4 as uuidv4 } from 'uuid';

const { TextArea } = Input;
const { Option } = Select;

const ItemTypes = {
  CV_SECTION: 'cv_section',
};

const CVSection = ({ id, index, type, content, onRemove, onChange, moveSection, themeColor }) => {
  const ref = useRef(null);
  
  const [, drop] = useDrop({
    accept: ItemTypes.CV_SECTION,
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      
      // Move section in the array
      moveSection(dragIndex, hoverIndex);
      
      // Note: Monitor mutates the item object
      item.index = hoverIndex;
    },
  });
  
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CV_SECTION,
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  
  // Connect drag and drop to the ref
  drag(drop(ref));
  
  const renderSectionContent = () => {
    switch (type) {
      case 'education':
        return renderEducation();
      case 'languages':
        return renderLanguages();
      case 'references':
        return renderReferences();
      case 'projects':
        return renderProjects();
      case 'achievements':
        return renderAchievements();
      case 'certificates':
        return renderCertificates();
      case 'hobbies':
        return renderHobbies();
      case 'skills':
        return renderSkills();
      case 'activities':
        return renderActivities();
      default:
        return <p>Section type not recognized</p>;
    }
  };
  
  const renderEducation = () => {
    const items = content.items || [];
    
    const addEducationItem = () => {
      const newItems = [...items, { 
        id: uuidv4(), 
        institution: 'Tên trường/Đơn vị đào tạo', 
        degree: 'Bằng cấp/Chứng chỉ', 
        field: 'Chuyên ngành', 
        startDate: 'MM/YYYY',
        endDate: 'MM/YYYY',
        description: 'Mô tả thành tích học tập...' 
      }];
      
      onChange({ ...content, items: newItems });
    };
    
    const removeEducationItem = (itemId) => {
      const newItems = items.filter(item => item.id !== itemId);
      onChange({ ...content, items: newItems });
    };
    
    const updateEducationItem = (itemId, field, value) => {
      const newItems = items.map(item => 
        item.id === itemId ? { ...item, [field]: value } : item
      );
      onChange({ ...content, items: newItems });
    };
    
    return (
      <div className="section-content timeline-section">
        {items.map((item, i) => (
          <div key={item.id} className="timeline-item">
            <div className="timeline-point" style={{ borderColor: themeColor }}></div>
            <div className="timeline-date">
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={e => updateEducationItem(item.id, 'startDate', e.target.innerText)}
                className="date-field"
              >
                {item.startDate}
              </span>
              <span className="date-separator">-</span>
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={e => updateEducationItem(item.id, 'endDate', e.target.innerText)}
                className="date-field"
              >
                {item.endDate}
              </span>
            </div>
            <div className="timeline-content">
              <div className="timeline-item-header">
                <div 
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={e => updateEducationItem(item.id, 'institution', e.target.innerText)}
                  className="organization-name"
                >
                  {item.institution}
                </div>
                <Button 
                  type="text" 
                  danger 
                  icon={<DeleteOutlined />}
                  onClick={() => removeEducationItem(item.id)}
                  className="remove-item-btn"
                />
              </div>
              <div 
                contentEditable
                suppressContentEditableWarning
                onBlur={e => updateEducationItem(item.id, 'degree', e.target.innerText)}
                className="job-title"
              >
                {item.degree} - {item.field}
              </div>
              <div 
                contentEditable
                suppressContentEditableWarning
                onBlur={e => updateEducationItem(item.id, 'description', e.target.innerText)}
                className="description"
              >
                {item.description}
              </div>
            </div>
          </div>
        ))}
        
        <Button 
          type="dashed" 
          onClick={addEducationItem}
          icon={<PlusOutlined />}
          className="add-timeline-btn"
        >
          Thêm mục học vấn
        </Button>
      </div>
    );
  };
  
  const renderLanguages = () => {
    const items = content.items || [];
    
    const addLanguageItem = () => {
      const newItems = [...items, { id: uuidv4(), name: 'Ngôn ngữ mới', level: 'Intermediate' }];
      onChange({ ...content, items: newItems });
    };
    
    const removeLanguageItem = (itemId) => {
      const newItems = items.filter(item => item.id !== itemId);
      onChange({ ...content, items: newItems });
    };
    
    const updateLanguageItem = (itemId, field, value) => {
      const newItems = items.map(item => 
        item.id === itemId ? { ...item, [field]: value } : item
      );
      onChange({ ...content, items: newItems });
    };
    
    return (
      <div className="section-content">
        <div className="skills-list">
          {items.map(item => (
            <div key={item.id} className="skill-item">
              <div 
                className="skill-name"
                contentEditable
                suppressContentEditableWarning
                onBlur={e => updateLanguageItem(item.id, 'name', e.target.innerText)}
              >
                {item.name}
              </div>
              <div className="skill-level">
                <span 
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={e => updateLanguageItem(item.id, 'level', e.target.innerText)}
                  style={{ color: themeColor }}
                >
                  {item.level}
                </span>
              </div>
              <Button 
                type="text" 
                danger
                icon={<DeleteOutlined />}
                onClick={() => removeLanguageItem(item.id)}
                className="remove-skill-btn"
              />
            </div>
          ))}
          
          <Button 
            type="dashed" 
            block 
            icon={<PlusOutlined />}
            onClick={addLanguageItem}
            className="add-skill-btn"
          >
            Thêm ngoại ngữ
          </Button>
        </div>
      </div>
    );
  };
  
  const renderSkills = () => {
    const items = content.items || [];
    
    const addSkillItem = () => {
      const newItems = [...items, { id: uuidv4(), name: 'Kỹ năng mới', level: 'Intermediate' }];
      onChange({ ...content, items: newItems });
    };
    
    const removeSkillItem = (itemId) => {
      const newItems = items.filter(item => item.id !== itemId);
      onChange({ ...content, items: newItems });
    };
    
    const updateSkillItem = (itemId, field, value) => {
      const newItems = items.map(item => 
        item.id === itemId ? { ...item, [field]: value } : item
      );
      onChange({ ...content, items: newItems });
    };
    
    return (
      <div className="section-content">
        <div className="skills-list">
          {items.map(item => (
            <div key={item.id} className="skill-item">
              <div 
                className="skill-name"
                contentEditable
                suppressContentEditableWarning
                onBlur={e => updateSkillItem(item.id, 'name', e.target.innerText)}
              >
                {item.name}
              </div>
              <div className="skill-level">
                <span 
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={e => updateSkillItem(item.id, 'level', e.target.innerText)}
                  style={{ color: themeColor }}
                >
                  {item.level}
                </span>
              </div>
              <Button 
                type="text" 
                danger
                icon={<DeleteOutlined />}
                onClick={() => removeSkillItem(item.id)}
                className="remove-skill-btn"
              />
            </div>
          ))}
          
          <Button 
            type="dashed" 
            block 
            icon={<PlusOutlined />}
            onClick={addSkillItem}
            className="add-skill-btn"
          >
            Thêm kỹ năng
          </Button>
        </div>
      </div>
    );
  };
  
  const renderReferences = () => {
    const items = content.items || [];
    
    const addReferenceItem = () => {
      const newItems = [...items, { 
        id: uuidv4(), 
        name: 'Tên người tham khảo', 
        position: 'Chức vụ',
        company: 'Công ty',
        email: 'email@example.com',
        phone: '0123456789' 
      }];
      onChange({ ...content, items: newItems });
    };
    
    const removeReferenceItem = (itemId) => {
      const newItems = items.filter(item => item.id !== itemId);
      onChange({ ...content, items: newItems });
    };
    
    const updateReferenceItem = (itemId, field, value) => {
      const newItems = items.map(item => 
        item.id === itemId ? { ...item, [field]: value } : item
      );
      onChange({ ...content, items: newItems });
    };
    
    return (
      <div className="section-content references-section">
        {items.map((item, i) => (
          <div key={item.id} className="reference-item" style={{ 
            padding: '15px',
            marginBottom: '15px',
            backgroundColor: `${themeColor}05`,
            borderRadius: '8px',
            borderLeft: `4px solid ${themeColor}`
          }}>
            <div className="reference-header">
              <div 
                contentEditable
                suppressContentEditableWarning
                onBlur={e => updateReferenceItem(item.id, 'name', e.target.innerText)}
                className="reference-name"
                style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '5px' }}
              >
                {item.name}
              </div>
              <Button 
                type="text" 
                danger
                icon={<DeleteOutlined />}
                onClick={() => removeReferenceItem(item.id)}
                className="remove-item-btn"
                style={{ position: 'absolute', right: '10px', top: '10px' }}
              />
            </div>
            <div 
              contentEditable
              suppressContentEditableWarning
              onBlur={e => updateReferenceItem(item.id, 'position', e.target.innerText)}
              style={{ marginBottom: '5px', fontStyle: 'italic' }}
            >
              {item.position}, {item.company}
            </div>
            <div className="reference-contacts">
              <div
                contentEditable
                suppressContentEditableWarning
                onBlur={e => updateReferenceItem(item.id, 'email', e.target.innerText)}
                style={{ marginBottom: '5px' }}
              >
                Email: {item.email}
              </div>
              <div
                contentEditable
                suppressContentEditableWarning
                onBlur={e => updateReferenceItem(item.id, 'phone', e.target.innerText)}
              >
                Điện thoại: {item.phone}
              </div>
            </div>
          </div>
        ))}
        
        <Button 
          type="dashed" 
          onClick={addReferenceItem}
          icon={<PlusOutlined />}
          block
          style={{ marginTop: '10px' }}
        >
          Thêm người tham khảo
        </Button>
      </div>
    );
  };
  
  const renderProjects = () => {
    const items = content.items || [];
    
    const addProjectItem = () => {
      const newItems = [...items, { 
        id: uuidv4(), 
        title: 'Tên dự án', 
        role: 'Vai trò của bạn',
        date: 'MM/YYYY - MM/YYYY',
        technologies: 'Công nghệ sử dụng',
        description: 'Mô tả dự án và đóng góp của bạn...' 
      }];
      onChange({ ...content, items: newItems });
    };
    
    const removeProjectItem = (itemId) => {
      const newItems = items.filter(item => item.id !== itemId);
      onChange({ ...content, items: newItems });
    };
    
    const updateProjectItem = (itemId, field, value) => {
      const newItems = items.map(item => 
        item.id === itemId ? { ...item, [field]: value } : item
      );
      onChange({ ...content, items: newItems });
    };
    
    return (
      <div className="section-content timeline-section">
        {items.map((item, i) => (
          <div key={item.id} className="timeline-item">
            <div className="timeline-point" style={{ borderColor: themeColor }}></div>
            <div className="timeline-date">
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={e => updateProjectItem(item.id, 'date', e.target.innerText)}
                className="date-field"
              >
                {item.date}
              </span>
            </div>
            <div className="timeline-content">
              <div className="timeline-item-header">
                <div 
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={e => updateProjectItem(item.id, 'title', e.target.innerText)}
                  className="company-name"
                >
                  {item.title}
                </div>
                <Button 
                  type="text" 
                  danger 
                  icon={<DeleteOutlined />}
                  onClick={() => removeProjectItem(item.id)}
                  className="remove-item-btn"
                />
              </div>
              <div 
                contentEditable
                suppressContentEditableWarning
                onBlur={e => updateProjectItem(item.id, 'role', e.target.innerText)}
                className="job-title"
              >
                {item.role} 
              </div>
              <div 
                contentEditable
                suppressContentEditableWarning
                onBlur={e => updateProjectItem(item.id, 'technologies', e.target.innerText)}
                style={{ 
                  marginBottom: '5px',
                  color: themeColor,
                  fontWeight: '500'
                }}
              >
                {item.technologies}
              </div>
              <div 
                contentEditable
                suppressContentEditableWarning
                onBlur={e => updateProjectItem(item.id, 'description', e.target.innerText)}
                className="description"
              >
                {item.description}
              </div>
            </div>
          </div>
        ))}
        
        <Button 
          type="dashed" 
          onClick={addProjectItem}
          icon={<PlusOutlined />}
          className="add-timeline-btn"
        >
          Thêm dự án
        </Button>
      </div>
    );
  };
  
  const renderAchievements = () => {
    const items = content.items || [];
    
    const addAchievementItem = () => {
      const newItems = [...items, { 
        id: uuidv4(), 
        title: 'Tên thành tựu', 
        date: 'MM/YYYY',
        description: 'Mô tả chi tiết thành tựu...' 
      }];
      onChange({ ...content, items: newItems });
    };
    
    const removeAchievementItem = (itemId) => {
      const newItems = items.filter(item => item.id !== itemId);
      onChange({ ...content, items: newItems });
    };
    
    const updateAchievementItem = (itemId, field, value) => {
      const newItems = items.map(item => 
        item.id === itemId ? { ...item, [field]: value } : item
      );
      onChange({ ...content, items: newItems });
    };
    
    return (
      <div className="section-content timeline-section">
        {items.map((item, i) => (
          <div key={item.id} className="timeline-item">
            <div className="timeline-point" style={{ borderColor: themeColor }}></div>
            <div className="timeline-date">
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={e => updateAchievementItem(item.id, 'date', e.target.innerText)}
                className="date-field"
              >
                {item.date}
              </span>
            </div>
            <div className="timeline-content">
              <div className="timeline-item-header">
                <div 
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={e => updateAchievementItem(item.id, 'title', e.target.innerText)}
                  className="company-name"
                >
                  {item.title}
                </div>
                <Button 
                  type="text" 
                  danger 
                  icon={<DeleteOutlined />}
                  onClick={() => removeAchievementItem(item.id)}
                  className="remove-item-btn"
                />
              </div>
              <div 
                contentEditable
                suppressContentEditableWarning
                onBlur={e => updateAchievementItem(item.id, 'description', e.target.innerText)}
                className="description"
              >
                {item.description}
              </div>
            </div>
          </div>
        ))}
        
        <Button 
          type="dashed" 
          onClick={addAchievementItem}
          icon={<PlusOutlined />}
          className="add-timeline-btn"
        >
          Thêm thành tựu
        </Button>
      </div>
    );
  };
  
  const renderCertificates = () => {
    const items = content.items || [];
    
    const addCertificateItem = () => {
      const newItems = [...items, { 
        id: uuidv4(), 
        name: 'Tên chứng chỉ', 
        date: 'MM/YYYY',
        issuer: 'Tổ chức cấp',
        description: 'Mô tả ngắn gọn về chứng chỉ' 
      }];
      onChange({ ...content, items: newItems });
    };
    
    const removeCertificateItem = (itemId) => {
      const newItems = items.filter(item => item.id !== itemId);
      onChange({ ...content, items: newItems });
    };
    
    const updateCertificateItem = (itemId, field, value) => {
      const newItems = items.map(item => 
        item.id === itemId ? { ...item, [field]: value } : item
      );
      onChange({ ...content, items: newItems });
    };
    
    return (
      <div className="section-content timeline-section">
        {items.map((item, i) => (
          <div key={item.id} className="timeline-item">
            <div className="timeline-point" style={{ borderColor: themeColor }}></div>
            <div className="timeline-date">
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={e => updateCertificateItem(item.id, 'date', e.target.innerText)}
                className="date-field"
              >
                {item.date}
              </span>
            </div>
            <div className="timeline-content">
              <div className="timeline-item-header">
                <div 
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={e => updateCertificateItem(item.id, 'name', e.target.innerText)}
                  className="certificate-name"
                  style={{ fontWeight: 'bold' }}
                >
                  {item.name}
                </div>
                <Button 
                  type="text" 
                  danger 
                  icon={<DeleteOutlined />}
                  onClick={() => removeCertificateItem(item.id)}
                  className="remove-item-btn"
                />
              </div>
              <div 
                contentEditable
                suppressContentEditableWarning
                onBlur={e => updateCertificateItem(item.id, 'issuer', e.target.innerText)}
                style={{ fontStyle: 'italic', marginBottom: '5px' }}
              >
                {item.issuer || 'Tổ chức cấp'}
              </div>
              <div 
                contentEditable
                suppressContentEditableWarning
                onBlur={e => updateCertificateItem(item.id, 'description', e.target.innerText)}
                className="description"
              >
                {item.description}
              </div>
            </div>
          </div>
        ))}
        
        <Button 
          type="dashed" 
          onClick={addCertificateItem}
          icon={<PlusOutlined />}
          className="add-timeline-btn"
        >
          Thêm chứng chỉ
        </Button>
      </div>
    );
  };
  
  const renderHobbies = () => {
    const items = content.items || ['Sở thích 1', 'Sở thích 2', 'Sở thích 3'];
    
    const addHobby = () => {
      const newItems = [...items, `Sở thích ${items.length + 1}`];
      onChange({ ...content, items: newItems });
    };
    
    const removeHobby = (index) => {
      const newItems = [...items];
      newItems.splice(index, 1);
      onChange({ ...content, items: newItems });
    };
    
    const updateHobby = (index, value) => {
      const newItems = [...items];
      newItems[index] = value;
      onChange({ ...content, items: newItems });
    };
    
    return (
      <div className="section-content">
        <div className="hobbies-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {items.map((hobby, i) => (
            <div 
              key={i} 
              style={{
                position: 'relative',
                backgroundColor: `${themeColor}15`,
                borderRadius: '16px',
                padding: '6px 12px',
                paddingRight: '32px',
                marginBottom: '8px',
                display: 'inline-block'
              }}
            >
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={e => updateHobby(i, e.target.innerText)}
                style={{ outline: 'none' }}
              >
                {hobby}
              </span>
              <Button 
                type="text" 
                danger
                icon={<DeleteOutlined />}
                onClick={() => removeHobby(i)}
                style={{
                  position: 'absolute',
                  right: '0',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  padding: '2px',
                  height: 'auto'
                }}
              />
            </div>
          ))}
        </div>
        
        <Button 
          type="dashed" 
          icon={<PlusOutlined />}
          onClick={addHobby}
          style={{ marginTop: '10px' }}
        >
          Thêm sở thích
        </Button>
      </div>
    );
  };
  
  const renderActivities = () => {
    const items = content.items || [];
    
    const addActivityItem = () => {
      const newItems = [...items, { 
        id: uuidv4(), 
        title: 'Tên hoạt động', 
        organization: 'Tổ chức',
        role: 'Vai trò của bạn',
        date: 'MM/YYYY - MM/YYYY',
        description: 'Mô tả về hoạt động và trách nhiệm của bạn...' 
      }];
      onChange({ ...content, items: newItems });
    };
    
    const removeActivityItem = (itemId) => {
      const newItems = items.filter(item => item.id !== itemId);
      onChange({ ...content, items: newItems });
    };
    
    const updateActivityItem = (itemId, field, value) => {
      const newItems = items.map(item => 
        item.id === itemId ? { ...item, [field]: value } : item
      );
      onChange({ ...content, items: newItems });
    };
    
    return (
      <div className="section-content timeline-section">
        {items.map((item, i) => (
          <div key={item.id} className="timeline-item">
            <div className="timeline-point" style={{ borderColor: themeColor }}></div>
            <div className="timeline-date">
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={e => updateActivityItem(item.id, 'date', e.target.innerText)}
                className="date-field"
              >
                {item.date}
              </span>
            </div>
            <div className="timeline-content">
              <div className="timeline-item-header">
                <div 
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={e => updateActivityItem(item.id, 'title', e.target.innerText)}
                  className="company-name"
                >
                  {item.title}
                </div>
                <Button 
                  type="text" 
                  danger 
                  icon={<DeleteOutlined />}
                  onClick={() => removeActivityItem(item.id)}
                  className="remove-item-btn"
                />
              </div>
              <div 
                contentEditable
                suppressContentEditableWarning
                onBlur={e => updateActivityItem(item.id, 'organization', e.target.innerText)}
                style={{ fontWeight: 'bold', marginBottom: '4px' }}
              >
                {item.organization}
              </div>
              <div 
                contentEditable
                suppressContentEditableWarning
                onBlur={e => updateActivityItem(item.id, 'role', e.target.innerText)}
                className="job-title"
              >
                {item.role}
              </div>
              <div 
                contentEditable
                suppressContentEditableWarning
                onBlur={e => updateActivityItem(item.id, 'description', e.target.innerText)}
                className="description"
              >
                {item.description}
              </div>
            </div>
          </div>
        ))}
        
        <Button 
          type="dashed" 
          onClick={addActivityItem}
          icon={<PlusOutlined />}
          className="add-timeline-btn"
        >
          Thêm hoạt động
        </Button>
      </div>
    );
  };
  
  const getDefaultSectionTitle = () => {
    switch (type) {
      case 'education': return 'HỌC VẤN';
      case 'languages': return 'NGOẠI NGỮ';
      case 'references': return 'NGƯỜI THAM KHẢO';
      case 'projects': return 'DỰ ÁN';
      case 'achievements': return 'THÀNH TỰU';
      case 'certificates': return 'CHỨNG CHỈ';
      case 'hobbies': return 'SỞ THÍCH';
      case 'skills': return 'KỸ NĂNG';
      case 'activities': return 'HOẠT ĐỘNG';
      default: return 'MỤC MỚI';
    }
  };
  
  return (
    <div 
      ref={ref}
      className="cv-section draggable-section" 
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: isDragging ? 'move' : 'default'
      }}
    >
      <div className="section-header">
        <div className="section-drag-handle" onClick={e => e.preventDefault()}>
          <DragOutlined />
        </div>
        <div className="section-title" style={{ borderBottomColor: themeColor }}>
          {getDefaultSectionTitle()}
        </div>
        <Button 
          type="text" 
          danger
          icon={<DeleteOutlined />}
          onClick={() => onRemove(id)}
          className="remove-section-btn"
        />
      </div>
      {renderSectionContent()}
    </div>
  );
};

export default CVSection;