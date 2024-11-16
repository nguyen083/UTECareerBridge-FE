import { Button, Flex, Form, Input, Select } from 'antd';
import BoxContainer from '../../Generate/BoxContainer';
import './EmployerCompany.scss';
import { useEffect, useState } from 'react';
import { IoMdTrash } from "react-icons/io";
import { getAllBenefit, getAllIndustry, updateEmployerCompanyProfile } from '../../../services/apiService';
import { PlusCircleFilled } from '@ant-design/icons';
import CustomizeQuill from '../../Generate/CustomizeQuill';
import PicturesWall from '../../Generate/Upload';
import { useSelector, useDispatch } from 'react-redux';
import { setInfor } from '../../../redux/action/employerSlice';
import { toast } from 'react-toastify';
import IconLoading from "../../Generate/IconLoading";
import React from 'react';

const EmployerCompany = () => {

    const [form] = Form.useForm();
    const [industries, setIndustries] = useState([]);
    const [benefits, setBenefits] = useState([]);
    const dispatch = useDispatch();
    const { TextArea } = Input;
    const [loading, setLoading] = useState(false);
    const [benefitDetails, setBenefitDetails] = useState(null);
    const defaultLogo = useSelector(state => state.employer.companyLogo);
    const defaultBackground = useSelector(state => state.employer.backgroundImage);

    const infor = {
        ...useSelector(state => state.employer),
        companyLogo: new File([], ""),
        backgroundImage: new File([], ""),
    };
    const handleReset = () => {
        form.resetFields();
    }
    const handleSubmit = (values) => {

        //map lại benefitDetails
        const keyValueObject = {};
        values.benefitArray.forEach((item, index) => {
            keyValueObject[`benefitDetails[${index}].benefitId`] = item.benefitId;
            keyValueObject[`benefitDetails[${index}].description`] = item.description;
        });
        const { benefitArray, ...rest } = values;
        values = { ...rest, ...keyValueObject };
        setLoading(true);
        try {
            updateEmployerCompanyProfile(values).then(res => {
                if (res.status === 'OK') {
                    toast.success(res.message);
                    // cập nhật lại redux
                    dispatch(setInfor(res.data));
                }
                else {
                    toast.error(res.message);
                }
            });
        } catch (err) {
            console.log(err);
        }
        finally {
            setLoading(false);
        }
        // console.log(values);

    }

    useEffect(() => {
        setBenefitDetails(infor.benefitArray)
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
    useEffect(() => {
        console.log("benefitDetails", benefitDetails);
    }, [benefitDetails])
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
                        <Form.Item name="companySize" className='col-12 col-md-5 mt-0' label="Quy mô công ty">
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
                        <Form.Item name="companyEmail" className="col-12 col-md-7 mt-0" label={<span>Email <span style={{ color: "red" }}> *</span></span>}
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập email của bạn',
                                },
                                {
                                    type: 'email',
                                    message: 'Email không hợp lệ',
                                }
                            ]}
                            validateTrigger={['onBlur']}>
                            <Input allowClear />
                        </Form.Item>
                        <Form.Item name="industryId" className="col-12 col-md-5 mt-0" label={<span>Lĩnh vực công ty <span style={{ color: "red" }}> *</span></span>}
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
                                <Select.Option value={0}>Vui lòng chọn</Select.Option>
                                {industries.map(industry => (
                                    <Select.Option value={industry.industryId}>
                                        {industry.industryName}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item className="col-12 mt-0" label={<span>Phúc lợi công ty <span style={{ color: "red" }}> *</span></span>}>
                            <Form.List name="benefitArray" >
                                {(fields, { add, remove }) => (
                                    <div>
                                        {fields.map((field) => (
                                            <Flex gap="middle">
                                                <Form.Item name={[field.name, 'benefitId']} className="col-3">
                                                    <Select>
                                                        {benefits.map(benefit => (
                                                            <Select.Option value={benefit.benefitId}>
                                                                {benefit.benefitName}
                                                            </Select.Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                                <Form.Item name={[field.name, 'description']} className="col-8">
                                                    <TextArea
                                                        rows={3}
                                                        allowClear
                                                        placeholder='Nhập mô tả phúc lợi'
                                                    />
                                                </Form.Item>
                                                <Button danger disabled={fields.length === 1} onClick={() => { remove(field.name); }}>
                                                    <IoMdTrash />
                                                </Button>
                                            </Flex>
                                        ))}
                                        <Button hidden={fields.length === 3} className='mt-3' onClick={() => add()} icon={<PlusCircleFilled style={{ color: "#4096FF" }} />} type='text'>
                                            Thêm phúc lợi
                                        </Button>
                                    </div>
                                )}
                            </Form.List>
                        </Form.Item>
                        <Form.Item name="companyDescription" className="col-12 mt-0 " label="Mô tả công ty">
                            <CustomizeQuill />
                        </Form.Item>
                        <Form.Item name="companyLogo" className='col-12 mt-0' label="Logo công ty">
                            <PicturesWall listType={"text"} defaultImage={defaultLogo} />
                        </Form.Item>
                        <Form.Item name="backgroundImage" className='col-12 mt-0' label="Hình Ảnh Công Ty">
                            <PicturesWall listType={"text"} defaultImage={defaultBackground} />
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
                        <Button type='primary' htmlType='submit' disabled={loading}><IconLoading loading={loading} setLoading={setLoading} />Lưu</Button>
                    </Flex>
                </Form>
            </BoxContainer>
        </>
    );
}

export default EmployerCompany;