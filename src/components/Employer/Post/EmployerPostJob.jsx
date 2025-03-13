import { Button, Col, Collapse, DatePicker, Descriptions, Flex, Form, Input, InputNumber, message, Row, Select } from 'antd';
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
    const [form] = Form.useForm();
    const packageId = Form.useWatch('packageId', form);
    useEffect(() => {
        console.log("packageId: ", packageId);
    }, [packageId]);
    const handlePackageChanged = (pkgId) => {
        const selectedPkg = packages.find(pkg => pkg.packageResponse.packageId === pkgId);
        setSelectedPackage(selectedPkg);
    };

    const form1 = (
        <BoxContaier>
            <Row gutter={[16]}>
                <Col span={24}>
                    <Form.Item name="jobTitle" label={<span>Tiêu đề <span className='text-red-500'> *</span></span>}
                        rules={[
                            { required: true, message: 'Vui lòng nhập tiêu đề' },
                        ]} validateFirst validateTrigger={['onChange', 'onBlur']}>
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={14}>
                    <Form.Item name="jobLocation" label={<span>Địa điểm làm việc <span className='text-red-500'> *</span></span>}
                        rules={[
                            { required: true, message: 'Vui lòng nhập địa điểm làm việc' },
                        ]} validateFirst validateTrigger={['onChange', 'onBlur']}>
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={10}>
                    <Form.Item name="jobCategoryId" label={<span>Lĩnh vực <span className='text-red-500'> *</span></span>}
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
                        <Select defaultValue={0}>
                            <Select.Option value={0}>Vui lòng chọn</Select.Option>
                            {categories.map(category => (
                                <Select.Option key={category.value} value={category.value}>
                                    {category.label}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>

                <Col span={8}>
                    <Form.Item name="jobMinSalary" label={<span>Lương tối thiểu <span className='text-red-500'> *</span></span>}
                        rules={[
                            { required: true, message: 'Vui lòng nhập lương tối thiểu' },
                        ]} validateFirst validateTrigger={['onChange', 'onBlur']}>
                        <InputNumber addonAfter="VNĐ" className='w-full'
                            formatter={value => format(value)}
                            parser={value => value.replace(/\s/g, '')} />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name="jobMaxSalary" label={<span>Lương tối đa <span className='text-red-500'> *</span></span>}
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
                        <InputNumber addonAfter="VNĐ" className='w-full'
                            formatter={value => format(value)}
                            parser={value => value.replace(/\s/g, '')} />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name="jobDeadline" label={<span>Ngày hết hạn <span className='text-red-500'> *</span></span>} rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập thời gian hết hạn nộp hồ sơ',
                        },
                    ]} validateTrigger={['onChange']}>
                        <DatePicker className='w-full' format={"DD/MM/YYYY"} placeholder='Vui lòng chọn ngày' />
                    </Form.Item>

                </Col>

            </Row>
        </BoxContaier >
    );
    const form2 = (
        <BoxContaier>
            <Row gutter={[16]}>
                <Col span={6}>
                    <Form.Item name="amount" label={<span>Số lượng tuyển dụng <span className='text-red-500'> *</span></span>}
                        rules={[
                            { required: true, message: 'Vui lòng nhập số lượng tuyển dụng' },
                        ]} validateFirst validateTrigger={['onChange', 'onBlur']}>
                        <InputNumber className='w-full'
                            formatter={value => format(value)}
                            parser={value => value.replace(/\s/g, '')} />
                    </Form.Item>
                </Col>
                <Col span={18}>
                    <Form.Item name="jobLevelId" label={<span>Cấp bậc <span className='text-red-500'> *</span></span>}
                        rules={
                            [({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (value === 0) {
                                        return Promise.reject(new Error('Vui lòng chọn cấp bậc cần tuyển dụng'));
                                    }
                                    return Promise.resolve();
                                },
                            }),]
                        }>
                        <Select defaultValue={0}>
                            <Select.Option value={0}>Vui lòng chọn</Select.Option>
                            {levels.map(level => (<Select.Option key={level.value} value={level.value}>{level.label}</Select.Option>))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item name="skillIds" label="Kĩ năng yêu cầu"
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
                </Col>
                <Form.Item name="jobRequirements" className="w-full mt-0 " label="Yêu cầu tuyển dụng">
                    <CustomizeQuill />
                </Form.Item>
                <Form.Item name="jobDescription" className="w-full mt-0 " label="Mô tả công việc">
                    <CustomizeQuill />
                </Form.Item>
            </Row>
        </BoxContaier>
    );
    const form3 = (
        <BoxContaier>
            <div className="form-group grid gap-3">
                <Form.Item className='w-full mt-0' name="packageId" label="Gói dịch vụ"
                >
                    <Select placeholder="Vui lòng chọn gói dịch vụ" onChange={handlePackageChanged} allowClear>
                        {packages.map(pkg => (
                            <Select.Option key={pkg.packageResponse.packageId} value={pkg.packageResponse.packageId} >
                                {pkg.packageResponse.packageName} ({pkg.packageResponse.amount})
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                {packageId && <Descriptions className='px-5 ' title="Chi tiết gói dịch vụ" layout="vertical" column={2}>
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
        </BoxContaier >
    );
    const itemsCollapse1 = [
        {
            key: '1',
            label: <span className='title2 card-title'>Thông tin tuyển dụng</span>,
            children: form1,
        }];
    const itemsCollapse2 = [
        {
            key: '1',
            label: <span className='title2 card-title'>Yêu cầu tuyển dụng</span>,
            children: form2,
        },
    ];
    const itemsCollapse3 = [
        {
            key: '1',
            label: <span className='title2 card-title'>Chọn gói dịch vụ</span>,
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


    const onFinish = (values) => {
        setLoading(true);
        dayjs.extend(customParseFormat);
        values.jobDeadline = dayjs(values.jobDeadline, 'YYYY-MM-DD').format('DD/MM/YYYY');
        console.log(values);
        postJob(values).then((res) => {
            if (res.status === 'OK') {
                message.success(res.message);
                form.resetFields();
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


    return (
        <>
            <BoxContaier className='shadow-md'>
                <div className='title1'>Đăng bài tuyển dụng</div>
            </BoxContaier>
            <BoxContaier className='shadow-md'>
                <Form
                    onFinish={onFinish}
                    form={form}
                    size='large'
                    requiredMark={false}
                    autoComplete="off"
                    layout='vertical'>
                    <Flex vertical gap="middle">
                        <Collapse className='shadow-md' collapsible='false' expandIconPosition='end' defaultActiveKey={['1']} items={itemsCollapse1} bordered={false} />
                        <Collapse className='shadow-md' collapsible='false' expandIconPosition='end' defaultActiveKey={['1']} items={itemsCollapse3} bordered={false} />
                        <Collapse className='shadow-md' collapsible='false' expandIconPosition='end' defaultActiveKey={['1']} items={itemsCollapse2} bordered={false} />
                        <Flex gap="middle" justify="end">

                            <Button type="default" htmlType='reset'>Hủy</Button>
                            <Button loading={loading} type="primary" htmlType="submit">Đăng bài</Button>
                        </Flex>
                    </Flex>
                </Form>
            </BoxContaier>
        </>
    );
};

export default EmployerPostJob;