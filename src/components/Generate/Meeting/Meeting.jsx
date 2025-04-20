import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const VideoCall = () => {
  const rootRef = useRef(null);
  const { roomID } = useParams();
  // const [permissionGranted, setPermissionGranted] = useState(false);
  const { t } = useTranslation();
  
  // useEffect(()=>{
  //   const requestMediaPermissions = async () => {
  //     try {
  //       const stream = await navigator.mediaDevices.getUserMedia({ 
  //         video: true, 
  //         audio: true 
  //       });
        
  //       setPermissionGranted(true);
        
  //       stream.getTracks().forEach(track => track.stop());
        
  //       console.log(t('meeting.permissions_granted'));
  //     } catch (error) {
  //       console.error(t('meeting.permission_error'), error);
  //       alert(t('meeting.permission_alert'));
  //     }
  //   };
    
  //   requestMediaPermissions();
  // },[t])
  
  useEffect(() => {
    // if (!permissionGranted) return;
    
    const userID = Math.floor(Math.random() * 10000).toString();
    const userName = 'userName' + userID;
    const appID = Number(import.meta.env.VITE_APP_ID);
    const serverSecret = import.meta.env.VITE_SERVER_SECRET;

    const kitToken = window.ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomID, userID, userName);

    const zp = window.ZegoUIKitPrebuilt.create(kitToken);
    zp.joinRoom({
      container: rootRef.current,
      sharedLinks: [{
        name: t('meeting.join_link'),
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
  }, [roomID, t]);

  return (
    <>
      {/* {!permissionGranted ? (
        <div style={{ 
          width: '100vw', 
          height: '100vh', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          flexDirection: 'column',
          backgroundColor: '#f8f9fa'
        }}>
          <h2>{t('meeting.permission_required')}</h2>
          <p>{t('meeting.permission_instruction')}</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '20px'
            }}
          >
            {t('meeting.try_again')}
          </button>
        </div>
      ) : ( */}
        <div ref={rootRef} style={{ width: '100vw', height: '100vh' }} />
      {/* )} */}
    </>
  );
};

export default VideoCall;
