import { EditOutlined } from "@ant-design/icons";
import styles from "./UpdateProfile.module.scss";
import { useEffect, useState } from "react";
import {
  Form,
  Input,
  Modal,
  Row,
  Col,
  Select,
  Radio,
  Space,
  DatePicker,
  InputNumber,
  message,
} from "antd";
import { apiService } from "../../../services/getAddressId";
import { UploadAvatar } from "./UploadAvatar.jsx";
import {
  getAllJobCategories,
  updateInforStudent,
} from "../../../services/apiService";
import { deleteImageFromCloudinaryByLink } from "../../../services/uploadCloudary.jsx";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { setInforStudent } from "../../../redux/action/studentSlice.jsx";
import { useTranslation } from "react-i18next";
dayjs.extend(customParseFormat);

const UpdateProfile = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const infor = useSelector((state) => state.student);
  const [imageUploaded, setImageUploaded] = useState(null);
  let [province, setProvince] = useState([]);
  let [currentProvinceId, setCurrentProvinceId] = useState();
  let [currentDistrictId, setCurrentDistrictId] = useState();
  let [currentListDistrict, setCurrentListDistrict] = useState([]);
  let [currentListWard, setCurrentListWard] = useState([]);
  let [categories, setCategories] = useState([]);

  useEffect(() => {
    apiService.getAllProvince().then((res) => {
      setProvince(
        res.data.data.map((item) => {
          return {
            value: +item.id,
            label: item.full_name,
          };
        })
      );
    });
    getAllJobCategories().then((res) => {
      setCategories(
        res.data.map((item) => {
          return {
            value: +item.jobCategoryId,
            label: item.jobCategoryName,
          };
        })
      );
    });
  }, []);
  useEffect(() => {
    console.log(categories);
  }, [categories]);
  useEffect(() => {
    apiService.getDistrictByProvinceId(currentProvinceId).then((res) => {
      setCurrentListDistrict(
        res.data.data.map((item) => {
          return {
            value: +item.id,
            label: item.full_name,
          };
        })
      );
    });
  }, [currentProvinceId]);

  useEffect(() => {
    apiService.getWardByDistrictId(currentDistrictId).then((res) => {
      setCurrentListWard(
        res.data.data.map((item) => {
          return {
            value: +item.id,
            label: item.full_name,
          };
        })
      );
    });
  }, [currentDistrictId]);

  const handleUpdateProfile = (values) => {
    values.dob = values.dob.format("DD/MM/YYYY");
    updateInforStudent(values).then((res) => {
      res.status === "OK"
        ? message.success(res.message)
        : message.error(res.message);
      dispatch(setInforStudent(res.data));
      setOpen(false);
    });
  };

  const handleReset = async () => {
    imageUploaded &&
      deleteImageFromCloudinaryByLink(imageUploaded).then((status) => {
        status === 200
          ? message.success(t("student.updateProfile.avatar.deleteSuccess"))
          : message.error(t("student.updateProfile.avatar.deleteError"));
      });

    form.resetFields();
    setImageUploaded(null);
    setOpen(false);
  };
  useEffect(() => {
    if (infor.provinceId) {
      setCurrentProvinceId(infor.provinceId);
    }

    if (infor.districtId) {
      setCurrentDistrictId(infor.districtId);
    }
  }, [infor]);
  return (
    <>
      <EditOutlined className={styles["icon"]} onClick={() => setOpen(true)} />
      <Modal
        className={styles.modalUpdateProfile}
        width={750}
        centered
        title={t("student.updateProfile.title")}
        open={open}
        onCancel={handleReset}
        onOk={() => {
          form.submit();
        }}
        okText={t("student.updateProfile.save")}
        cancelText={t("student.updateProfile.cancel")}
      >
        <Form
          form={form}
          onFinish={handleUpdateProfile}
          size="large"
          layout="vertical"
          className={styles.modalForm}
          initialValues={{
            gender: infor.gender,
            email: infor.email,
            dob: dayjs(infor.dob, "DD/MM/YYYY"),
            provinceId: infor.provinceId,
            districtId: infor.districtId,
            wardId: infor.wardId,
            firstName: infor.firstName,
            lastName: infor.lastName,
            phoneNumber: infor.phoneNumber,
            universityEmail: infor.universityEmail,
            address: infor.address,
            year: infor.year,
            categoryId: infor.categoryId,
            profileImage: infor.profileImage,
          }}
        >
          <div className={styles.flexWrapper}>
            <Row gutter={16}>
              <div className={styles.avatarUploader}>
                <Form.Item name="profileImage" valuePropName="src">
                  <UploadAvatar
                    src={""}
                    setSrc={(url) => {
                      form.setFieldsValue({ profileImage: url });
                      setImageUploaded(url);
                    }}
                  />
                </Form.Item>
              </div>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label={t("student.updateProfile.firstName.label")}
                  name="firstName"
                  rules={[
                    {
                      required: true,
                      message: t("student.updateProfile.firstName.required"),
                    },
                  ]}
                >
                  <Input
                    placeholder={t(
                      "student.updateProfile.firstName.placeholder"
                    )}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={t("student.updateProfile.lastName.label")}
                  name="lastName"
                  rules={[
                    {
                      required: true,
                      message: t("student.updateProfile.lastName.required"),
                    },
                  ]}
                >
                  <Input
                    placeholder={t(
                      "student.updateProfile.lastName.placeholder"
                    )}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="gender"
                  layout="horizontal"
                  label={t("student.updateProfile.gender.label")}
                >
                  <Radio.Group className={styles.radioGroup}>
                    <Space direction="horizontal">
                      <Radio value={false}>
                        {t("student.updateProfile.gender.male")}
                      </Radio>
                      <Radio value={true}>
                        {t("student.updateProfile.gender.female")}
                      </Radio>
                    </Space>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="dob"
                  label={t("student.updateProfile.dob.label")}
                  rules={[
                    {
                      required: true,
                      message: t("student.updateProfile.dob.required"),
                    },
                  ]}
                >
                  <DatePicker
                    className={styles.w100}
                    format={"DD/MM/YYYY"}
                    placeholder={t("student.updateProfile.dob.placeholder")}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label={t("student.updateProfile.phone.label")}
                  name="phoneNumber"
                  rules={[
                    {
                      required: true,
                      message: t("student.updateProfile.phone.required"),
                    },
                    {
                      pattern: new RegExp(/^(0[3|5|7|8|9])[0-9]{8}$/),
                      message: t("student.updateProfile.phone.invalid"),
                    },
                  ]}
                >
                  <Input
                    placeholder={t("student.updateProfile.phone.placeholder")}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={t("student.updateProfile.email.label")}
                  name="email"
                >
                  <Input disabled />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label={t("student.updateProfile.universityEmail.label")}
                  name="universityEmail"
                  rules={[
                    {
                      required: true,
                      message: t(
                        "student.updateProfile.universityEmail.required"
                      ),
                    },
                    {
                      type: "email",
                      message: t(
                        "student.updateProfile.universityEmail.invalid"
                      ),
                    },
                  ]}
                >
                  <Input
                    placeholder={t(
                      "student.updateProfile.universityEmail.placeholder"
                    )}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={t("student.updateProfile.address.label")}
                  name="address"
                >
                  <Input
                    placeholder={t("student.updateProfile.address.placeholder")}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  label={t("student.updateProfile.province.label")}
                  name="provinceId"
                  rules={[
                    {
                      required: true,
                      message: t("student.updateProfile.province.required"),
                    },
                  ]}
                >
                  <Select
                    placeholder={t(
                      "student.updateProfile.province.placeholder"
                    )}
                    showSearch
                    onChange={(value) => {
                      setCurrentProvinceId(value);
                      form.setFieldsValue({ districtId: null, wardId: null });
                      setCurrentDistrictId(null);
                    }}
                  >
                    {province.map((item) => {
                      return (
                        <Select.Option key={item.value} value={item.value}>
                          {item.label}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label={t("student.updateProfile.district.label")}
                  name="districtId"
                  rules={[
                    {
                      required: true,
                      message: t("student.updateProfile.district.required"),
                    },
                  ]}
                >
                  <Select
                    placeholder={t(
                      "student.updateProfile.district.placeholder"
                    )}
                    showSearch
                    onChange={(value) => {
                      setCurrentDistrictId(value);
                      form.setFieldsValue({ wardId: null });
                    }}
                    options={currentListDistrict}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label={t("student.updateProfile.ward.label")}
                  name="wardId"
                  rules={[
                    {
                      required: true,
                      message: t("student.updateProfile.ward.required"),
                    },
                  ]}
                >
                  <Select
                    placeholder={t("student.updateProfile.ward.placeholder")}
                    showSearch
                    options={currentListWard}
                    onChange={(value) => {
                      form.setFieldsValue({ wardId: value });
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="year"
                  label={t("student.updateProfile.year.label")}
                  rules={[
                    {
                      required: true,
                      message: t("student.updateProfile.year.required"),
                    },
                  ]}
                >
                  <InputNumber
                    className="w-full"
                    type="number"
                    placeholder={t("student.updateProfile.year.placeholder")}
                    min={1}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item>
                  <Form.Item
                    name="categoryId"
                    label={t("student.updateProfile.category.label")}
                  >
                    <Select
                      placeholder={t(
                        "student.updateProfile.category.placeholder"
                      )}
                      showSearch
                    >
                      {categories.map((item) => {
                        return (
                          <Select.Option key={item.value} value={item.value}>
                            {item.label}
                          </Select.Option>
                        );
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
