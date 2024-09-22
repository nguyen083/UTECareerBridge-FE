import { Button, Divider, Flex, Form, Input } from 'antd';
import BoxContainer from '../../Generate/BoxContainer';
import { useState } from 'react';

const EmployerProfile = () => {
    const regChar = new RegExp(/^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]*$/);
    const [enableEdit, setEnableEdit] = useState(true);
    const [form] = Form.useForm();

    // Get data in redux
    const infor = {
        fist_name: "Nguyên",
        last_name: "Nguyễn Huỳnh"
    }
    const handleReset = () => {
        setEnableEdit(true);
        form.resetFields();
    }
    return (<>
        <BoxContainer>
            <div className="title1">
                Thông tin cá nhân
            </div>
        </BoxContainer>
        <BoxContainer>
            <Flex align='center' justify='space-between'>
                <span className='title2'>Thông tin chung</span>
                <Button disabled={!enableEdit} onClick={() => { setEnableEdit(false) }}>Chỉnh sửa</Button>
            </Flex>
            <Divider />
            <Form form={form} size='large' layout='horizontal' requiredMark={false} autoComplete='false' disabled={enableEdit}
                initialValues={infor}>
                <div className="form-group row g-3">
                    <Form.Item name="fist_name" className=" col-12 col-md-4 mt-0" label={<span>Tên <span style={{ color: "red" }}> *</span></span>}
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập tên',
                            },
                            {
                                pattern: regChar,
                                message: 'Tên không hợp lệ',
                            }
                        ]} validateTrigger={['onChange']}>
                        <Input allowClear />
                    </Form.Item>


                    <Form.Item name="last_name" className="col-12 col-md-4 mt-0" label={<span>Họ <span style={{ color: "red" }}> *</span></span>}
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập họ',
                            },
                            {
                                pattern: regChar,
                                message: 'Họ không hợp lệ',
                            }
                        ]} validateTrigger={['onChange']}>
                        <Input allowClear />
                    </Form.Item>
                    <Flex gap={"1rem"} align='center' justify='end' hidden={enableEdit}>
                        <Button type='default' onClick={handleReset}>Hủy</Button>
                        <Button type='primary' htmlType='submit'>Lưu</Button>
                    </Flex>
                </div>
            </Form>
        </BoxContainer>
    </>
    );
}

export default EmployerProfile;