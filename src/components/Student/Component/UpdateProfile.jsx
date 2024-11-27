import { EditOutlined } from "@ant-design/icons";
import styles from "./UpdateProfile.module.scss";
import React, { useEffect, useState } from "react";
import { Form, Input, Modal, Row, Col, Select, Radio, Space, DatePicker, InputNumber, message } from "antd";
import { apiService } from "../../../services/getAddressId";
import UploadAvatar from "./UploadAvatar.jsx";
import { getAllJobCategories, updateInforStudent } from "../../../services/apiService";
import { deleteImageFromCloudinaryByLink } from "../../../services/uploadCloudary.jsx";


const UpdateProfile = () => {
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const [dob, setDob] = useState(null);
    const gender = 0;
    const [imageUploaded, setImageUploaded] = useState(null);
    let [province, setProvince] = useState([]);
    let [currentProvinceId, setCurrentProvinceId] = useState(811);
    let [currentDistrictId, setCurrentDistrictId] = useState(81113);
    let [currentListDistrict, setCurrentListDistrict] = useState([]);
    let [currentListWard, setCurrentListWard] = useState([]);
    let [categories, setCategories] = useState([]);

    useEffect(() => {
        apiService.getAllProvince().then((res) => {
            setProvince(res.data.map((item) => {
                return {
                    value: +item.id,
                    label: item.name
                }
            }));
        });
        getAllJobCategories().then((res) => {
            setCategories(res.data.map((item) => {
                return {
                    value: +item.jobCategoryId,
                    label: item.jobCategoryName
                }
            }));
        });
    }, []);

    useEffect(() => {
        apiService.getDistrictByProvinceId(currentProvinceId).then((res) => {
            setCurrentListDistrict(res.data.map((item) => {
                return {
                    value: +item.id,
                    label: item.name
                }
            }));
        });
    }, [currentProvinceId]);

    useEffect(() => {
        apiService.getWardByDistrictId(currentDistrictId).then((res) => {
            setCurrentListWard(res.data.map((item) => {
                return {
                    value: +item.id,
                    label: item.name
                }
            }));
        });
    }, [currentDistrictId]);

    const handleUpdateProfile = (values) => {
        updateInforStudent({ ...values, dob }).then((res) => {
            res.status === "OK" ? message.success(res.message) : message.error(res.message);
        });
    };

    const onChange = (date, dateString) => {
        setDob(dateString);
    };
    const handleReset = async () => {
        imageUploaded && deleteImageFromCloudinaryByLink(imageUploaded).then((status) => {
            status === 200 ? message.success("Xoá ảnh thành công") : message.error("Xoá ảnh thất bại");
        });
        // Xoá ảnh đã upload lên Cloudinary nhưng không thực hiện cập nhật vào DB
        form.resetFields();
        setImageUploaded(null)
        setOpen(false)
    };

    return (
        <>
            <EditOutlined className={styles["icon"]} onClick={() => setOpen(true)} />
            <Modal width={750} centered title="Thông tin cơ bản" open={open} onCancel={handleReset} onOk={() => { form.submit() }} okText="Lưu" cancelText="Hủy">
                <Form
                    form={form}
                    onFinish={handleUpdateProfile}
                    size="large"
                    layout="vertical"
                    className={styles.modalForm} // Use the class from SCSS file
                    initialValues={{
                        gender,
                        email: "billbatri085@gmail.com",
                    }}
                >
                    <div className={styles.flexWrapper}>
                        <Row gutter={16}>
                            <div className={styles.avatarUploader}>
                                <Form.Item name="profileImage">
                                    <UploadAvatar
                                        src={"https://chiemtaimobile.vn/images/companies/1/%E1%BA%A2nh%20Blog/avatar-facebook-dep/Anh-avatar-hoat-hinh-de-thuong-xinh-xan.jpg?1704788263223"}
                                        setSrc={(url) => { form.setFieldsValue({ profileImage: url }); setImageUploaded(url) }} />
                                </Form.Item>
                            </div>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Tên" name="firstName" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
                                    <Input placeholder="Tên" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Họ" name="lastName" rules={[{ required: true, message: 'Vui lòng nhập họ!' }]}>
                                    <Input placeholder="Họ" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item name="gender" layout="horizontal" label="Giới tính">
                                    <Radio.Group className={styles.radioGroup}>
                                        <Space direction="horizontal">
                                            <Radio value={0}>Nam</Radio>
                                            <Radio value={1}>Nữ</Radio>
                                        </Space>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="dob" label="Ngày sinh" rules={[{ required: true, message: 'Vui lòng nhập ngày sinh!' }]}>
                                    <DatePicker className={styles.w100} onChange={onChange} format={"DD/MM/YYYY"} placeholder="Ngày sinh" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Số điện thoại" name="phoneNumber" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }, { pattern: new RegExp(/^(0[3|5|7|8|9])[0-9]{8}$/), message: 'Số điện thoại không hợp lệ!' }]}>
                                    <Input placeholder="Số điện thoại" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Email" name="email">
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item label="Email sinh viên" name="universityEmail" rules={[{ required: true, message: 'Vui lòng nhập email sinh viên!' }, { type: 'email', message: 'Email không hợp lệ!' }]}>
                                    <Input placeholder="Email sinh viên" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Địa chỉ" name="address">
                                    <Input placeholder="Địa chỉ" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item label="Tỉnh/Thành phố" name="provinceId" rules={[{ required: true, message: 'Vui lòng chọn tỉnh/thành phố!' }]}>
                                    <Select
                                        placeholder="Tỉnh/Thành phố"
                                        showSearch
                                        optionFilterProp="label"
                                        filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                                        onChange={(value) => {
                                            setCurrentProvinceId(value);
                                            form.setFieldsValue({ districtId: null, wardId: null });
                                            setCurrentDistrictId(null);
                                        }}
                                        options={province}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Quận/Huyện" name="districtId" rules={[{ required: true, message: 'Vui lòng chọn quận/huyện!' }]}>
                                    <Select
                                        placeholder="Quận/Huyện"
                                        showSearch
                                        optionFilterProp="label"
                                        filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                                        onChange={(value) => {
                                            setCurrentDistrictId(value);
                                            form.setFieldsValue({ wardId: null });
                                        }}
                                        options={currentListDistrict}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Phường/Xã" name="wardId" rules={[{ required: true, message: 'Vui lòng chọn phường/xã!' }]}>
                                    <Select
                                        placeholder="Phường/Xã"
                                        showSearch
                                        optionFilterProp="label"
                                        filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                                        onChange={() => { form.setFieldsValue({}) }}
                                        options={currentListWard}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item name="year" label="Năm thứ"
                                    rules={[{ required: true, message: "Vui lòng  nhập năm học" }]}>
                                    <InputNumber className="w-100" type="number" placeholder="Bạn là sinh viên năm mấy" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item>
                                    <Form.Item name="categoryId" label="Thuộc chuyên nghành">
                                        <Select
                                            placeholder="Thuộc chuyên môn"
                                            showSearch
                                            optionFilterProp="label"
                                            filterSort={(optionA, optionB) =>
                                                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                            }
                                            options={categories}
                                        />
                                    </Form.Item>
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>
                </Form>
            </Modal>
        </>
    );
};

export default UpdateProfile;
