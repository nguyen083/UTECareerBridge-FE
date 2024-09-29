import { Button, Flex, Form } from "antd";
import BoxContainer from "../../Generate/BoxContainer";
import PicturesWall from "../../Generate/Upload";

const BusinessCertificate = () => {
    const onFinish = (values) => {
        console.log(values);
    }
    return (
        <>
            <BoxContainer>
                <div className="title1">
                    Giấy chứng nhận kinh doanh
                </div>
            </BoxContainer>
            <BoxContainer>
                <Form onFinish={onFinish} layout="vertical" size="large">
                    <Form.Item name="businessCertificate" label="Ảnh giấy chứng nhận kinh doanh">
                        <PicturesWall listType={"text"} />
                    </Form.Item>

                    <Form.Item>
                        <Flex align='center' justify='end'>
                            <Button type='primary' htmlType='submit'>Lưu</Button>
                        </Flex>
                    </Form.Item>
                </Form>
            </BoxContainer>
        </>
    )
}
export default BusinessCertificate;