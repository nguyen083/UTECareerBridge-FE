import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { ZegoSuperBoardManager } from "zego-superboard-web";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import meeting from "../../../services/api/meeting";

const VideoCall = () => {
  const rootRef = useRef(null);
  const { roomID } = useParams();
  const { t } = useTranslation();
  const user = useSelector((state) => state.user);
  const student = useSelector((state) => state.student);
  const employer = useSelector((state) => state.employer);
  const navigate = useNavigate();
  const getUserAvatar = () => {
    if (user.role === "student") {
      return student.profileImage;
    } else if (user.role === "employer") {
      return employer.companyLogo;
    } else {
      return "https://res.cloudinary.com/utejobhub/image/upload/v1745056474/UTE-removebg-preview_dz3ykb.png";
    }
  };

  const getUserName = () => {
    if (user.role === "student") {
      return student.firstName + " " + student.lastName;
    } else if (user.role === "employer") {
      return employer.companyName;
    } else {
      return "UserName_" + Math.floor(Math.random() * 10000);
    }
  };

  const URLToRedirect = () => {
    if (user.role === "student") {
      return navigate("/my-job");
    } else if (user.role === "employer") {
      return navigate("/employer/profile");
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    const userID = user.userId.toString();
    const userName = getUserName();
    const appID = Number(import.meta.env.VITE_APP_ID);
    meeting
      .getToken({ userId: parseInt(userID), roomId: roomID })
      .then(({ token }) => {
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
          appID,
          token,
          roomID,
          userID,
          userName
        );
        const zp = ZegoUIKitPrebuilt.create(kitToken);
        zp.addPlugins({ ZegoSuperBoardManager });
        zp.joinRoom({
          container: rootRef.current,
          sharedLinks: [
            {
              name: t("meeting.join_link"),
              url:
                window.location.protocol +
                "//" +
                window.location.host +
                window.location.pathname,
            },
          ],
          onUserAvatarSetter: (userList) => {
            userList.forEach((user) => {
              user.setUserAvatar(getUserAvatar());
            });
          },
          scenario: {
            mode: ZegoUIKitPrebuilt.VideoConference,
          },
          turnOnMicrophoneWhenJoining: false,
          turnOnCameraWhenJoining: false,
          showMyCameraToggleButton: true,
          showMyMicrophoneToggleButton: true,
          showAudioVideoSettingsButton: true,
          showScreenSharingButton: true,
          showTextChat: true,
          showUserList: true,
          maxUsers: 50,
          layout: "Auto",
          showLayoutButton: true,
          onLeaveRoom: () => {
            URLToRedirect();
          },
        });
      });
  }, [roomID, t]);

  return (
    <>
      <div ref={rootRef} style={{ width: "100vw", height: "100vh" }} />
    </>
  );
};

export default VideoCall;
