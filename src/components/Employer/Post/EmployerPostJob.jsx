import { Button, Collapse, DatePicker, Descriptions, Flex, Form, Input, InputNumber, message, Select, Tooltip } from 'antd';
import BoxContaier from '../../Generate/BoxContainer';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import CustomizeQuill from '../../Generate/CustomizeQuill';
import { useEffect, useState } from 'react';
import { getAllJobCategories, getAllJobLevels, getAllSkills, getJobPackage, postJob } from '../../../services/apiService';

const format = (value) => {
    if (!value) return '';
    const stringValue = `${value}`;
    const absoluteValue = stringValue.replace('-', '').replace('.', '');
    const formattedValue = absoluteValue.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return formattedValue;
}






const EmployerPostJob = () => {
    const [categories, setCategories] = useState([]);
    const [skills, setSkills] = useState([]);
    const [levels, setLevels] = useState([]);
    const [packages, setPackages] = useState([]);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handlePackageChanged = (pkgId) => {
        const selectedPkg = packages.find(pkg => pkg.packageResponse.packageId === pkgId);
        setSelectedPackage(selectedPkg);
    };

    const form1 = (
        <BoxContaier>
            <div className="form-group row g-3">
                <Form.Item className='col-12 mt-0' name="jobTitle" label="Tiêu đề"
                    rules={[
                        { required: true, message: 'Vui lòng nhập tiêu đề' },
                    ]} validateFirst validateTrigger={['onChange', 'onBlur']}>
                    <Input />
                </Form.Item>
                <Form.Item className='col-12 col-md-7 mt-0' name="jobLocation" label="Địa điểm làm việc"
                    rules={[
                        { required: true, message: 'Vui lòng nhập địa điểm làm việc' },
                    ]} validateFirst validateTrigger={['onChange', 'onBlur']}>
                    <Input />
                </Form.Item>
                <Form.Item name="jobCategoryId" className="col-12 col-md-5 mt-0" label="Lĩnh vực"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng chọn lĩnh vực của công ty',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (value === 0) {
                                    return Promise.reject(new Error('Vui lòng chọn lĩnh vực của công ty'));
                                }
                                return Promise.resolve();
                            },
                        }),
                    ]} validateTrigger={['onChange', 'onBlur']}>
                    <Select placeholder="Vui lòng chọn lĩnh vực">
                        {categories.map(category => (
                            <Select.Option key={category.value} value={category.value}>
                                {category.label}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Flex gap="large" className="col-7 mt-0">
                    <Form.Item name="jobMinSalary" label="Lương tối thiểu"
                        rules={[
                            { required: true, message: 'Vui lòng nhập lương tối thiểu' },
                        ]} validateFirst validateTrigger={['onChange', 'onBlur']}>
                        <InputNumber addonAfter="VNĐ"
                            formatter={value => format(value)}
                            parser={value => value.replace(/\s/g, '')} />
                    </Form.Item>
                    <Form.Item name="jobMaxSalary" label="Lương tối đa"
                        rules={[
                            { required: true, message: 'Vui lòng nhập lương tối đa' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('jobMinSalary') <= value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Lương tối đa phải lớn hơn lương tối thiểu'));
                                },
                            }),
                        ]} validateFirst validateTrigger={['onChange', 'onBlur']}>
                        <InputNumber addonAfter="VNĐ"
                            formatter={value => format(value)}
                            parser={value => value.replace(/\s/g, '')} />
                    </Form.Item>
                </Flex>
                <Form.Item name="jobDeadline" className="col-12 col-md-5 mt-0" label="Ngày hết hạn" rules={[
                    {
                        required: true,
                        message: 'Vui lòng nhập thời gian hết hạn nộp hồ sơ',
                    },
                ]} validateTrigger={['onChange']}>
                    <DatePicker className='form-control' format={"DD/MM/YYYY"} placeholder='Vui lòng chọn ngày' />
                </Form.Item>
            </div>
        </BoxContaier >
    );
    const form2 = (
        <BoxContaier>
            <div className="form-group row g-3">
                <Form.Item className='col-12 col-md-6 mt-0' name="amount" label="Số lượng tuyển dụng"
                    rules={[
                        { required: true, message: 'Vui lòng nhập số lượng tuyển dụng' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (value <= 0) {
                                    return Promise.reject(new Error('Số lượng tuyển dụng phải lớn hơn 0'));
                                }
                                return Promise.resolve();
                            },
                        })
                    ]} validateFirst validateTrigger={['onChange', 'onBlur']}>
                    <InputNumber style={{ width: 200 }}
                        formatter={value => format(value)}
                        parser={value => value.replace(/\s/g, '')} />
                </Form.Item>
                <Form.Item className='col-12 col-md-6 mt-0' name="jobLevelId" label="Cấp bậc" placeholder="Vui lòng chọn cấp bậc"
                    rules={
                        [{ required: true, message: 'Vui lòng chọn cấp bậc' }]
                    }>
                    <Select placeholder="Vui lòng chọn cấp bậc">
                        {levels.map(level => (<Select.Option key={level.value} value={level.value}>{level.label}</Select.Option>))}
                    </Select>
                </Form.Item>
                <Form.Item className="col-12 mt-0" name="skillIds" label="Kĩ năng yêu cầu"
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng chọn ít nhất một kĩ năng',
                        },
                    ]} validateFirst validateTrigger={['onBlur', 'onChange']}>
                    <Select
                        mode="multiple"
                        size="large"
                        placeholder="Vui lòng chọn kĩ năng"
                        options={skills}
                        filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
                    />
                </Form.Item>
                <Form.Item name="jobRequirements" className="col-12 mt-0 " label="Yêu cầu tuyển dụng">
                    <CustomizeQuill />
                </Form.Item>
                <Form.Item name="jobDescription" className="col-12 mt-0 " label="Mô tả công việc">
                    <CustomizeQuill />
                </Form.Item>
            </div>
        </BoxContaier>
    );
    const form3 = (
        <BoxContaier>
            <div className="form-group row g-3">
                <Form.Item className='col-12 mt-0' name="packageId" label="Gói dịch vụ"
                    rules={[
                        { required: true, message: 'Vui lòng chọn gói dịch vụ trước khi đăng tuyển' },
                    ]} validateFirst validateTrigger={['onChange', 'onBlur']}>
                    <Select placeholder="Vui lòng chọn gói dịch vụ" onChange={handlePackageChanged} allowClear>
                        {packages.map(pkg => (
                            <Select.Option key={pkg.packageResponse.packageId} value={pkg.packageResponse.packageId} >
                                {pkg.packageResponse.packageName} ({pkg.packageResponse.amount})
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                {selectedPackage && <Descriptions className='px-5 ' title="Chi tiết gói dịch vụ" layout="vertical" column={2}>
                    <Descriptions.Item label="Tên gói dịch vụ">
                        <span>{selectedPackage?.packageResponse.packageName}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label="Đặc điểm">
                        <span>{selectedPackage?.packageResponse.featureName}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label="Mô tả">
                        <span>{selectedPackage?.packageResponse.description}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label="Số lượng còn lại">
                        <span>{selectedPackage?.amount}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label="Thời gian đăng tuyển">
                        <span>{selectedPackage?.packageResponse.duration} tháng</span>
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày hết hạn">
                        <span>{selectedPackage?.expiredAt}</span>
                    </Descriptions.Item>

                </Descriptions>}
            </div>
        </BoxContaier>
    );
    const itemsCollapse1 = [
        {
            key: '1',
            label: <span className='title2'>Thông tin tuyển dụng</span>,
            children: form1,
        }];
    const itemsCollapse2 = [
        {
            key: '1',
            label: <span className='title2'>Yêu cầu tuyển dụng</span>,
            children: form2,
        },
    ];
    const itemsCollapse3 = [
        {
            key: '1',
            label: <span className='title2'>Chọn gói dịch vụ</span>,
            children: form3,
        }
    ];

    useEffect(() => {
        window.scrollTo(0, 0);
        getAllJobCategories().then((res) => {
            const filteredOptions = res.data
                .filter(item => item.active === true) // Lọc các mục có thuộc tính active là true
                .map(item => {
                    return { value: item.jobCategoryId, label: item.jobCategoryName };
                });
            setCategories(filteredOptions);
        });
        getAllJobLevels().then((res) => {
            const filteredOptions = res.data
                .filter(item => item.active === true) // Lọc các mục có thuộc tính active là true
                .map(item => {
                    return { value: item.jobLevelId, label: item.nameLevel };
                });
            setLevels(filteredOptions);
        });
        getAllSkills().then((res) => {
            const filteredOptions = res.data
                .filter(item => item.active === true) // Lọc các mục có thuộc tính active là true
                .map(item => {
                    return { value: item.skillId, label: item.skillName };
                });
            setSkills(filteredOptions);
        });
        getJobPackage().then((res) => {
            if (res.status === 'OK') {
                setPackages(res.data);
            }
        });
    }, []);
    const [form] = Form.useForm();

    const onFinish = (values) => {
        setLoading(true);
        dayjs.extend(customParseFormat);
        values.jobDeadline = dayjs(values.jobDeadline, 'YYYY-MM-DD').format('DD/MM/YYYY');
        console.log(values);
        postJob(values).then((res) => {
            if (res.status === 'OK') {
                message.success(res.message);
            }
            else {
                message.error(res.message);
            }
        }).catch((err) => {
            message.error(err.message);
        }).finally(() => {
            setLoading(false);
        });
    }
    const onFinishFailed = (errorInfo) => { };
    const onReset = () => { };

    return (
        <>
            <BoxContaier>
                <div className='title1'>Đăng bài tuyển dụng</div>
            </BoxContaier>
            <BoxContaier>
                <Form
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    onReset={onReset}
                    form={form}
                    size='large'
                    autoComplete="off"
                    layout='vertical'>
                    <Flex vertical gap="middle">
                        <Collapse className='box_shadow' collapsible='false' expandIconPosition='end' defaultActiveKey={['1']} items={itemsCollapse1} bordered={false} />
                        <Collapse className='box_shadow' collapsible='false' expandIconPosition='end' defaultActiveKey={['1']} items={itemsCollapse2} bordered={false} />
                        <Collapse className='box_shadow' collapsible='false' expandIconPosition='end' defaultActiveKey={['1']} items={itemsCollapse3} bordered={false} />
                        <Flex gap="middle" justify="end">
                            <Button loading={loading} type="primary" htmlType="submit">Đăng bài</Button>
                            <Button type="default" htmlType='reset'>Hủy</Button>
                        </Flex>
                    </Flex>
                </Form>
            </BoxContaier>
        </>
    );
};

export default EmployerPostJob;