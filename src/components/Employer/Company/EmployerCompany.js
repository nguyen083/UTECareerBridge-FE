import { Button, Flex, Form, Input, Select } from 'antd';
import BoxContainer from '../../Generate/BoxContainer';
import './EmployerCompany.scss';
import { useEffect, useState } from 'react';
import { IoMdTrash } from "react-icons/io";
import { getAllBenefit, getAllIndustry } from '../../../services/apiService';
import { PlusCircleFilled } from '@ant-design/icons';
import CustomizeQuill from '../../Generate/CustomizeQuill';
import PicturesWall from '../../Generate/Upload';


const EmployerCompany = () => {

    const [form] = Form.useForm();
    const [industries, setIndustries] = useState([]);
    const [benefits, setBenefits] = useState([]);
    const [countBenefit, setCountBenefit] = useState(1);
    const { TextArea } = Input;
    const infor = {
        companyName: "",
        companyAddress: "",
        industryId: 0,
        companySize: "",
        companyDescription: "",
    };
    const handleReset = () => {
        form.resetFields();
    }
    const handleSubmit = (values) => {
        console.log(values);
    }
    useEffect(() => {
        getAllIndustry().then(res => {
            setIndustries(res.data);
        }).catch(err => {
            console.log(err);
        })
        getAllBenefit().then(res => {
            setBenefits(res.data);
        }).catch(err => {
            console.log(err);
        })
    }, [])
    return (
        <>
            <BoxContainer>
                <div className="title1">
                    Thông tin công ty
                </div>
            </BoxContainer>
            <BoxContainer>
                <Form onFinish={handleSubmit} form={form} size='large' layout='vertical' requiredMark={false} autoComplete='false'
                    initialValues={infor}>
                    <div className="div-form-company form-group row g-3">
                        <Form.Item name="companyName" className="col-12 col-md-7 mt-0" label={<span>Tên công ty <span style={{ color: "red" }}> *</span></span>}
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên',
                                },
                            ]} validateTrigger={['onChange', 'onBlur']}>
                            <Input allowClear />
                        </Form.Item>
                        <Form.Item name="companyAddress" className="col-12 col-md-7 mt-0" label={<span>Địa chỉ công ty <span style={{ color: "red" }}> *</span></span>}
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập địa chỉ',
                                },
                            ]} validateTrigger={['onChange', 'onBlur']}>
                            <Input allowClear placeholder='Ví dụ: 130 Sương Nguyệt Anh, Phường Bến Thành, Quận 1' />
                        </Form.Item>
                        <Form.Item name="companySize" className='col-6 col-md-5 mt-0' label="Quy mô công ty">
                            <Select>
                                <Select.Option value="">Vui lòng chọn</Select.Option>
                                <Select.Option value="Ít hơn 10"></Select.Option>
                                <Select.Option value="10-24">10&#8722;24</Select.Option>
                                <Select.Option value="25-99">25&#8722;99</Select.Option>
                                <Select.Option value="100-499">100&#8722;499</Select.Option>
                                <Select.Option value="500-999">500&#8722;999</Select.Option>
                                <Select.Option value="1.000-4.999">1.000&#8722;4.999</Select.Option>
                                <Select.Option value="5.000-9.999">5.000&#8722;9.999</Select.Option>
                                <Select.Option value="10.000-19.999">10.000&#8722;19.999</Select.Option>
                                <Select.Option value="20.000-49.999">20.000&#8722;49.999</Select.Option>
                                <Select.Option value="Hơn 50.000">Hơn 50.000</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="industryId" className="col-12 mt-0" label={<span>Lĩnh vực công ty <span style={{ color: "red" }}> *</span></span>}
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
                            <Select>
                                {industries.map(industry => (
                                    <Select.Option value={industry.industryId}>
                                        {industry.industryName}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item className="col-12 mt-0" label="Phúc lợi công ty">
                            <Flex gap="middle">
                                <Form.Item name="benefitDetails[0].benefitId" className="col-3">
                                    <Select>
                                        {benefits.map(benefit => (
                                            <Select.Option value={benefit.benefitId}>
                                                {/* {benefit.benefitIcon} */}
                                                {benefit.benefitName}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item name="benefitDetails[0].description" className="col-8">
                                    <TextArea rows={3} allowClear />
                                </Form.Item>
                                <Button disabled={countBenefit === 1} onClick={() => setCountBenefit(countBenefit - 1)}><IoMdTrash /></Button>
                            </Flex>
                            <Button onClick={() => { }} icon={<PlusCircleFilled style={{ color: "#4096FF" }} />} type='text'>Thêm phúc lợi</Button>
                        </Form.Item>
                        <Form.Item name="companyDescription" className="col-12 mt-0 " label="Mô tả công ty">
                            <CustomizeQuill />
                        </Form.Item>
                        <Form.Item name="companyLogo" className='col-12 mt-5' label="Logo công ty">
                            <PicturesWall listType={"text"} />
                        </Form.Item>
                        <Form.Item name="backgroundImage" className='col-12 mt-0' label="Hình Ảnh Công Ty">
                            <PicturesWall listType={"text"} />
                        </Form.Item>
                        <Form.Item name="companyWebsite" className='col-12 mt-0' label="Website công ty">
                            <Input allowClear placeholder='Địa chỉ website công ty' />
                        </Form.Item>
                        <Form.Item name="videoIntroduction" className='col-12 mt-0' label="Video công ty">
                            <Input allowClear placeholder='Sao chép và dán từ liên kết Youtube của bạn vào đây' />
                        </Form.Item>
                    </div>
                    <Flex gap={"1rem"} align='center' justify='end'>
                        <Button type='default' onClick={handleReset}>Hủy</Button>
                        <Button type='primary' htmlType='submit'>Lưu</Button>
                    </Flex>
                </Form>
            </BoxContainer>
        </>
    );
}

export default EmployerCompany;