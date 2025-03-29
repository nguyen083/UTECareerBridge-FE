import { useState, useEffect } from 'react';
import { List, Card, Flex, Typography, Empty } from 'antd';
import { getAllJobEmployer } from '../../services/apiService';
import { useNavigate, useParams } from 'react-router-dom';
import { IoIosBusiness } from 'react-icons/io';
import { FaMapLocationDot } from 'react-icons/fa6';
import { FaRegMoneyBillAlt } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
const { Title, Paragraph } = Typography;
const JobList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

 
  const fetchData = async (page, pageSize) => {
    setLoading(true);
    try {
      const params = {
        page: page - 1,      
        limit: pageSize,        
      };
      await getAllJobEmployer(id, params).then((res) => {

        if (res.status === 'OK' && res.data) {
          const data = res.data.jobResponses.map((item) => {
            return {
              jobId: item.jobId,
              logo: item.employerResponse.companyLogo,
              title: item.jobTitle,
              company: item.employerResponse.companyName,
              jobMinSalary: item.jobMinSalary,
              jobMaxSalary: item.jobMaxSalary,
              rejectionReason: item.rejectionReason,
              jobLocation: item.jobLocation,
             
            };
          });

          setData(data);
          setPagination({
            current: page,
            pageSize: pageSize,
            total: res.data.totalPages * pageSize
          });
        }
      });



    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(pagination.current, pagination.pageSize);
  }, [pagination.current, pagination.pageSize]);

  const handleListChange = (page, pageSize) => {
    setPagination({
      ...pagination,
      current: page,
      pageSize: pageSize
    });
  };
  const handleClick = (key) => {
    navigate('/job/' + key);

  }
  
  return (
    <div className="w-full p-4 mx-auto">
      <List
        grid={{ gutter: 16, xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 }}
        dataSource={data}
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: handleListChange,
          showSizeChanger: true
        }}
        locale={{
          emptyText: (
            <Empty description={t('student.layout.jobs.noJob')}></Empty>
          ),
        }}
        renderItem={(item) => (
          <List.Item className='w-full'>
            <Card
              hoverable
              className='cursor-default w-full rounded-[10px] overflow-hidden shadow '
              bodyStyle={{ padding: 16 }}
            >
              <Flex onClick={() => handleClick(item.jobId)} align='center' className='cursor-pointer'>
                <img
                  src={item.logo}
                  className='w-20 h-20 mr-3 rounded'
                />
                <div className='w-full'>
                  <Flex align='center' justify='space-between' >
                    <Title level={5}
                      className='m-0 whitespace-nowrap overflow-hidden text-ellipsis max-w-[80%]'>
                      {item.title}
                    </Title>
                  </Flex>
                  < Paragraph
                    className='m-0 flex gap-2 items-center !mb-2'
                    type='secondary'
                    ellipsis={{
                      rows: 1,
                      tooltip: true
                    }}
                  >
                    <IoIosBusiness />{item.company}
                  </Paragraph>
                  <Flex align='center' className='flex items-center gap-2 mx-0 my-2 text-sm text-red-500'>
                    <FaRegMoneyBillAlt /><div className='flex'>{item?.jobMinSalary?.toLocaleString('vi-VN')} - {item?.jobMaxSalary?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}  <div className='text-sm'>{t('common.month')}</div></div>
                  </Flex>

                  < Paragraph
                    type='secondary'
                    className='m-0 whitespace-nowrap overflow-hidden text-ellipsis max-w-[80%] gap-2 flex items-center !mb-0'>
                    <FaMapLocationDot />{item.jobLocation}</Paragraph>
                </div>
              </Flex>
            </Card>
          </List.Item>
        )}
      />
    </div >
  );
};

export default JobList;