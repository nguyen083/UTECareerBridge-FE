import { Flex } from "antd";
import ProfileCard from "../../Component/UpdateProfile/ProfileCard";
import UpdateSkill from "../../Component/UpdateSkill/UpdateSkill";
import UploadCV from "../../Component/UploadCV/UploadCV";
import { useOutletContext } from "react-router-dom";
import { useEffect } from "react";

const ProfilePage = () => {
    const { infor, address, listResume, fetchCV } = useOutletContext();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <Flex vertical gap={16}>
            <ProfileCard infor={infor} address={address} />
            <UploadCV listResume={listResume} fetchCV={fetchCV} />
            <UpdateSkill />
        </Flex>
    )
}
export default ProfilePage;