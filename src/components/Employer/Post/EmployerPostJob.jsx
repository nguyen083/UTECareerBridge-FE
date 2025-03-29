import { Button, Col, Collapse, DatePicker, Descriptions, Flex, Form, Input, InputNumber, message, Row, Select } from 'antd';
import BoxContaier from '../../Generate/BoxContainer';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import CustomizeQuill from '../../Generate/CustomizeQuill';
import { useEffect, useState } from 'react';
import { getAllJobCategories, getAllJobLevels, getAllSkills, getJobPackage, postJob } from '../../../services/apiService';
import { useTranslation } from 'react-i18next';

const format = (value) => {
    if (!value) return '';
    const stringValue = `${value}`;
    const absoluteValue = stringValue.replace('-', '').replace('.', '');
    const formattedValue = absoluteValue.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return formattedValue;
}

const EmployerPostJob = () => {
    const { t } = useTranslation();
    const [categories, setCategories] = useState([]);
    const [skills, setSkills] = useState([]);
    const [levels, setLevels] = useState([]);
    const [packages, setPackages] = useState([]);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const packageId = Form.useWatch('packageId', form);
    const handlePackageChanged = (pkgId) => {
        const selectedPkg = packages.find(pkg => pkg.packageResponse.packageId === pkgId);
        setSelectedPackage(selectedPkg);
    };

    const form1 = (
        <BoxContaier>
            <Row gutter={[16]}>
                <Col span={24}>
                    <Form.Item name="jobTitle" label={<span>{t('employer.job.title')} <span className='text-red-500'> *</span></span>}
                        rules={[
                            { required: true, message: t('employer.job.titleRequired') },
                        ]} validateFirst validateTrigger={['onChange', 'onBlur']}>
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={14}>
                    <Form.Item name="jobLocation" label={<span>{t('employer.job.location')} <span className='text-red-500'> *</span></span>}
                        rules={[
                            { required: true, message: t('employer.job.locationRequired') },
                        ]} validateFirst validateTrigger={['onChange', 'onBlur']}>
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={10}>
                    <Form.Item name="jobCategoryId" label={<span>{t('employer.job.category')} <span className='text-red-500'> *</span></span>}
                        rules={[
                            {
                                required: true,
                                message: t('employer.job.categoryRequired'),
                            },
                            () => ({
                                validator(_, value) {
                                    if (value === 0) {
                                        return Promise.reject(new Error(t('employer.job.categoryRequired')));
                                    }
                                    return Promise.resolve();
                                },
                            }),
                        ]} validateTrigger={['onChange', 'onBlur']}>
                        <Select defaultValue={0}>
                            <Select.Option value={0}>{t('employer.job.categoryPlaceholder')}</Select.Option>
                            {categories.map(category => (
                                <Select.Option key={category.value} value={category.value}>
                                    {category.label}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>

                <Col span={8}>
                    <Form.Item name="jobMinSalary" label={<span>{t('employer.job.minSalary')} <span className='text-red-500'> *</span></span>}
                        rules={[
                            { required: true, message: t('employer.job.minSalaryRequired') },
                        ]} validateFirst validateTrigger={['onChange', 'onBlur']}>
                        <InputNumber addonAfter="VNĐ" className='w-full'
                            formatter={value => format(value)}
                            parser={value => value.replace(/\s/g, '')} />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name="jobMaxSalary" label={<span>{t('employer.job.maxSalary')} <span className='text-red-500'> *</span></span>}
                        rules={[
                            { required: true, message: t('employer.job.maxSalaryRequired') },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('jobMinSalary') <= value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error(t('employer.job.salaryError')));
                                },
                            }),
                        ]} validateFirst validateTrigger={['onChange', 'onBlur']}>
                        <InputNumber addonAfter="VNĐ" className='w-full'
                            formatter={value => format(value)}
                            parser={value => value.replace(/\s/g, '')} />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item name="jobDeadline" label={<span>{t('employer.job.deadline')} <span className='text-red-500'> *</span></span>} rules={[
                        {
                            required: true,
                            message: t('employer.job.deadlineRequired'),
                        },
                    ]} validateTrigger={['onChange']}>
                        <DatePicker className='w-full' format={"DD/MM/YYYY"} placeholder={t('employer.job.deadlinePlaceholder')} />
                    </Form.Item>

                </Col>

            </Row>
        </BoxContaier >
    );
    const form2 = (
        <BoxContaier>
            <Row gutter={[16]}>
                <Col span={6}>
                    <Form.Item name="amount" label={<span>{t('employer.job.quantity')} <span className='text-red-500'> *</span></span>}
                        rules={[
                            { required: true, message: t('employer.job.quantityRequired') },
                        ]} validateFirst validateTrigger={['onChange', 'onBlur']}>
                        <InputNumber className='w-full'
                            formatter={value => format(value)}
                            parser={value => value.replace(/\s/g, '')} />
                    </Form.Item>
                </Col>
                <Col span={18}>
                    <Form.Item name="jobLevelId" label={<span>{t('employer.job.level')} <span className='text-red-500'> *</span></span>}
                        rules={
                            [( ) => ({
                                validator(_, value) {
                                    if (value === 0) {
                                        return Promise.reject(new Error(t('employer.job.levelRequired')));
                                    }
                                    return Promise.resolve();
                                },
                            }),]
                        }>
                        <Select defaultValue={0}>
                            <Select.Option value={0}>{t('employer.job.levelPlaceholder')}</Select.Option>
                            {levels.map(level => (<Select.Option key={level.value} value={level.value}>{level.label}</Select.Option>))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item name="skillIds" label={t('employer.job.skills')}
                        rules={[
                            {
                                required: true,
                                message: t('employer.job.skillsRequired'),
                            },
                        ]} validateFirst validateTrigger={['onBlur', 'onChange']}>
                        <Select
                            mode="multiple"
                            size="large"
                            placeholder={t('employer.job.skillsPlaceholder')}
                            options={skills}
                            filterOption={(input, option) => option.label.toLowerCase().includes(input.toLowerCase())}
                        />
                    </Form.Item>
                </Col>
                <Form.Item name="jobRequirements" className="w-full mt-0 " label={t('employer.job.requirements')}>
                    <CustomizeQuill />
                </Form.Item>
                <Form.Item name="jobDescription" className="w-full mt-0 " label={t('employer.job.description')}>
                    <CustomizeQuill />
                </Form.Item>
            </Row>
        </BoxContaier>
    );
    const form3 = (
        <BoxContaier>
            <div className="grid gap-3 form-group">
                <Form.Item className='w-full mt-0' name="packageId" label={t('employer.dashboard.servicePackage.title')}
                >
                    <Select placeholder={t('employer.job.packagePlaceholder')} onChange={handlePackageChanged} allowClear>
                        {packages.map(pkg => (
                            <Select.Option key={pkg.packageResponse.packageId} value={pkg.packageResponse.packageId} >
                                {pkg.packageResponse.packageName} ({pkg.packageResponse.amount})
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                {packageId && <Descriptions className='px-5 ' title={t('employer.job.packageDetailTitle')} layout="vertical" column={2}>
                    <Descriptions.Item label={t('admin.servicePackage.form.packageName.label')}>
                        <span>{selectedPackage?.packageResponse.packageName}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label={t('admin.servicePackage.list.feature')}>
                        <span>{selectedPackage?.packageResponse.featureName}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label={t('admin.servicePackage.form.description.label')}>
                        <span>{selectedPackage?.packageResponse.description}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label={t('employer.job.packageRemainingAmount')}>
                        <span>{selectedPackage?.amount}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label={t('employer.job.packageDuration')}>
                        <span>{selectedPackage?.packageResponse.duration} {t('admin.servicePackage.list.months')}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label={t('employer.dashboard.servicePackage.table.expiredAt')}>
                        <span>{selectedPackage?.expiredAt}</span>
                    </Descriptions.Item>

                </Descriptions>}
            </div>
        </BoxContaier >
    );
    const itemsCollapse1 = [
        {
            key: '1',
            label: <span className='title2 card-title'>{t('employer.job.basicInfo')}</span>,
            children: form1,
        }];
    const itemsCollapse2 = [
        {
            key: '1',
            label: <span className='title2 card-title'>{t('employer.job.requirementsInfo')}</span>,
            children: form2,
        },
    ];
    const itemsCollapse3 = [
        {
            key: '1',
            label: <span className='title2 card-title'>{t('employer.job.selectPackage')}</span>,
            children: form3,
        }
    ];

    useEffect(() => {
        window.scrollTo(0, 0);
        getAllJobCategories().then((res) => {
            const filteredOptions = res.data
                .filter(item => item.active === true)
                .map(item => {
                    return { value: item.jobCategoryId, label: item.jobCategoryName };
                });
            setCategories(filteredOptions);
        });
        getAllJobLevels().then((res) => {
            const filteredOptions = res.data
                .filter(item => item.active === true)
                .map(item => {
                    return { value: item.jobLevelId, label: item.nameLevel };
                });
            setLevels(filteredOptions);
        });
        getAllSkills().then((res) => {
            const filteredOptions = res.data
                .filter(item => item.active === true)
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
                <div className='title1'>{t('employer.job.postJob')}</div>
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

                            <Button type="default" htmlType='reset'>{t('common.cancel')}</Button>
                            <Button loading={loading} type="primary" htmlType="submit">{t('employer.job.post')}</Button>
                        </Flex>
                    </Flex>
                </Form>
            </BoxContaier>
        </>
    );
};

export default EmployerPostJob;