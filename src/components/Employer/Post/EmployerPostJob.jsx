import { Button, Collapse, DatePicker, Flex, Form, Input, InputNumber, Select } from 'antd';
import BoxContaier from '../../Generate/BoxContainer';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import CustomizeQuill from '../../Generate/CustomizeQuill';
import { useEffect, useState } from 'react';
import { getAllJobCategories, getAllJobLevels, getAllSkills, postJob } from '../../../services/apiService';
import { toast } from 'react-toastify';

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
    const form1 = (
        <BoxContaier>
            <div className="form-group row g-3">
                <Form.Item className='col-12 mt-0' name="jobTitle" label={<span>Tiêu đề <span style={{ color: "red" }}> *</span></span>}
                    rules={[
                        { required: true, message: 'Vui lòng nhập tiêu đề' },
                    ]} validateFirst validateTrigger={['onChange', 'onBlur']}>
                    <Input />
                </Form.Item>
                <Form.Item className='col-12 col-md-7 mt-0' name="jobLocation" label={<span>Địa điểm làm việc <span style={{ color: "red" }}> *</span></span>}
                    rules={[
                        { required: true, message: 'Vui lòng nhập địa điểm làm việc' },
                    ]} validateFirst validateTrigger={['onChange', 'onBlur']}>
                    <Input />
                </Form.Item>
                <Form.Item name="jobCategoryId" className="col-12 col-md-5 mt-0" label={<span>Lĩnh vực <span style={{ color: "red" }}> *</span></span>}
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
                <Flex gap="large" className="col-7 mt-0">
                    <Form.Item name="jobMinSalary" label={<span>Lương tối thiểu <span style={{ color: "red" }}> *</span></span>}
                        rules={[
                            { required: true, message: 'Vui lòng nhập lương tối thiểu' },
                        ]} validateFirst validateTrigger={['onChange', 'onBlur']}>
                        <InputNumber addonAfter="VNĐ"
                            formatter={value => format(value)}
                            parser={value => value.replace(/\s/g, '')} />
                    </Form.Item>
                    <Form.Item name="jobMaxSalary" label={<span>Lương tối đa <span style={{ color: "red" }}> *</span></span>}
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
                <Form.Item name="jobDeadline" className="col-12 col-md-5 mt-0" label={<span>Ngày hết hạn <span style={{ color: "red" }}> *</span></span>} rules={[
                    {
                        required: true,
                        message: 'Vui lòng nhập thời gian hết hạn nộp hồ sơ',
                    },
                ]} validateTrigger={['onChange']}>
                    <DatePicker className='form-control' format={"DD/MM/YYYY"} placeholder='Vui lòng chọn ngày' />
                </Form.Item>
            </div>
        </BoxContaier>
    );
    const form2 = (
        <BoxContaier>
            <div className="form-group row g-3">
                <Form.Item className='col-12 col-md-6 mt-0' name="amount" label={<span>Số lượng tuyển dụng <span style={{ color: "red" }}> *</span></span>}
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
                <Form.Item className='col-12 col-md-6 mt-0' name="jobLevelId" label={<span>Cấp bậc <span style={{ color: "red" }}> *</span></span>}
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
        }];

    useEffect(() => {
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
    }, []);
    const [form] = Form.useForm();

    const onFinish = (values) => {
        dayjs.extend(customParseFormat);
        values.jobDeadline = dayjs(values.jobDeadline, 'YYYY-MM-DD').format('DD/MM/YYYY');
        console.log(values);
        postJob(values).then((res) => {
            if (res.status === 'OK') {
                toast.success(res.message);
            }
            else {
                toast.error(res.message);
            }
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
                    requiredMark={false}
                    form={form}
                    size='large'
                    autoComplete="off"
                    layout='vertical'>
                    <Flex vertical gap="middle">
                        <Collapse collapsible='false' expandIconPosition='end' defaultActiveKey={['1']} items={itemsCollapse1} bordered={false} />
                        <Collapse expandIconPosition='end' defaultActiveKey={['1']} items={itemsCollapse2} bordered={false} />
                        <Flex gap="middle" justify="end">
                            <Button type="primary" htmlType="submit">Đăng bài</Button>
                            <Button type="default" htmlType='reset'>Hủy</Button>
                        </Flex>
                    </Flex>
                </Form>
            </BoxContaier>
        </>
    );
};

export default EmployerPostJob;