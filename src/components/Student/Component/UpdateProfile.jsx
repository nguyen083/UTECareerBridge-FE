import { EditOutlined } from "@ant-design/icons";
import styles from "./UpdateProfile.module.scss";
import React, { useEffect, useState } from "react";
import { Form, Input, Modal, Row, Col, Select, Radio, Space, DatePicker, InputNumber, message } from "antd";
import { apiService } from "../../../services/getAddressId";
import UploadAvatar from "./UploadAvatar.jsx";
import { getAllJobCategories, updateInforStudent } from "../../../services/apiService";
import { deleteImageFromCloudinaryByLink } from "../../../services/uploadCloudary.jsx";
import { useDispatch, useSelector } from "react-redux";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { setInforStudent } from "../../../redux/action/studentSlice.jsx";
dayjs.extend(customParseFormat);


const UpdateProfile = () => {
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const infor = useSelector((state) => state.student);
    const [imageUploaded, setImageUploaded] = useState(null);
    let [province, setProvince] = useState([]);
    let [currentProvinceId, setCurrentProvinceId] = useState();
    let [currentDistrictId, setCurrentDistrictId] = useState();
    let [currentWardId, setCurrentWardId] = useState();
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
        console.log(categories);
    }, [categories]);
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
        deleteImageFromCloudinaryByLink(infor.profileImage)
        values.dob = values.dob.format("DD/MM/YYYY");
        updateInforStudent(values).then((res) => {
            res.status === "OK" ? message.success(res.message) : message.error(res.message);
            dispatch(setInforStudent(res.data));
            setOpen(false);
        });
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
    useEffect(() => {
        // Khi provinceId thay đổi, lấy quận/huyện
        if (infor.provinceId) {
            setCurrentProvinceId(infor.provinceId);
        }

        if (infor.districtId) {
            setCurrentDistrictId(infor.districtId);
        }

        if (infor.wardId) {
            setCurrentWardId(infor.wardId); // Tạo dữ liệu ward tương ứng với infor.wardId
        }
    }, [infor]);
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
                        gender: infor.gender,
                        email: infor.email,
                        dob: dayjs(infor.dob, "DD/MM/YYYY"),
                        provinceId: infor.provinceId,  // Gán giá trị cho tỉnh
                        districtId: infor.districtId,  // Gán giá trị cho quận/huyện
                        wardId: infor.wardId,          // Gán giá trị cho phường/xã
                        firstName: infor.firstName,
                        lastName: infor.lastName,
                        phoneNumber: infor.phoneNumber,
                        universityEmail: infor.universityEmail,
                        address: infor.address,
                        year: infor.year,
                        categoryId: infor.categoryId,
                        profileImage: infor.profileImage
                    }}
                >
                    <div className={styles.flexWrapper}>
                        <Row gutter={16}>
                            <div className={styles.avatarUploader}>
                                <Form.Item name="profileImage"
                                    valuePropName="src">
                                    <UploadAvatar
                                        src={""}
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
                                            <Radio value={false}>Nam</Radio>
                                            <Radio value={true}>Nữ</Radio>
                                        </Space>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="dob" label="Ngày sinh" rules={[{ required: true, message: 'Vui lòng nhập ngày sinh!' }]}>
                                    <DatePicker className={styles.w100} format={"DD/MM/YYYY"} placeholder="Ngày sinh" />
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
                                        onChange={(value) => {
                                            setCurrentProvinceId(value);
                                            form.setFieldsValue({ districtId: null, wardId: null });
                                            setCurrentDistrictId(null);
                                        }}
                                    >
                                        {province.map((item) => {
                                            return <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>;
                                        })}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Quận/Huyện" name="districtId" rules={[{ required: true, message: 'Vui lòng chọn quận/huyện!' }]}>
                                    <Select
                                        placeholder="Quận/Huyện"
                                        showSearch
                                        onChange={(value) => {
                                            setCurrentDistrictId(value);
                                            setCurrentWardId(null);
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
                                        options={currentListWard}
                                        onChange={(value) => {
                                            setCurrentWardId(value);
                                            form.setFieldsValue({ wardId: value });
                                        }
                                        }
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
                                        >
                                            {categories.map((item) => {
                                                return <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>;
                                            })}
                                        </Select>
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
