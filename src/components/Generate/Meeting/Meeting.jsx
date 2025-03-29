import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
const VideoCall = () => {
  const rootRef = useRef(null);
  const { roomID } = useParams();
  useEffect(() => {
    const userID = Math.floor(Math.random() * 10000).toString();
    const userName = 'userName' + userID;
    const appID = Number(import.meta.env.VITE_APP_ID);
    const serverSecret = import.meta.env.VITE_SERVER_SECRET;

    const kitToken = window.ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID, userID, userName);

    const zp = window.ZegoUIKitPrebuilt.create(kitToken);
    zp.joinRoom({
      container: rootRef.current,
      sharedLinks: [{
        name: 'Join Meeting link',
        url: window.location.protocol + '//' + window.location.host  + window.location.pathname,
      }],
      scenario: {
        mode: window.ZegoUIKitPrebuilt.VideoConference,
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
    });

    return () => {
      zp.leaveRoom();
    };
  }, [roomID]);

  return (
    <div ref={rootRef} style={{ width: '100vw', height: '100vh' }} />
  );
};

export default VideoCall;
