import React, {useEffect, useContext, useRef} from 'react';
import RtcEngine from 'react-native-agora';
import {RenderStateInterface, DispatchType} from '../Contexts/RtcContext';
import PropsContext, {ToggleState} from '../Contexts/PropsContext';
import {Platform} from 'react-native';

const Join: React.FC<{
  children: React.ReactNode;
  precall: boolean;
  engineRef: React.MutableRefObject<RtcEngine>;
  uidState: RenderStateInterface;
  dispatch: DispatchType;
}> = ({children, precall, engineRef, uidState, dispatch}) => {
  let joinState = useRef(false);
  const {rtcProps} = useContext(PropsContext);
  //commented for v1 release
  // const beforeJoin = rtcProps?.lifecycle?.useBeforeJoin
  //   ? rtcProps.lifecycle.useBeforeJoin()
  //   : null;

  useEffect(() => {
    const engine = engineRef.current;
    async function leave() {
      try {
        console.log('Leaving channel');
        engine.leaveChannel();
        joinState.current = false;
      } catch (err) {
        console.error('Cannot leave the channel:', err);
      }
    }
    const {renderList, renderPosition} = uidState;
    const [maxUid] = renderPosition;
    const videoState = renderList[maxUid].video;
    async function join() {
      if (
        rtcProps.encryption &&
        rtcProps.encryption.key &&
        rtcProps.encryption.mode
      ) {
        console.log('using channel encryption', rtcProps.encryption);
        await engine.enableEncryption(true, {
          encryptionKey: rtcProps.encryption.key,
          encryptionMode: rtcProps.encryption.mode,
        });
      }
      if (videoState === ToggleState.enabled && Platform.OS === 'ios') {
        dispatch({
          type: 'LocalMuteVideo',
          value: [ToggleState.disabling],
        });
        await engine.muteLocalVideoStream(true);
        dispatch({
          type: 'LocalMuteVideo',
          value: [ToggleState.disabled],
        });
      }
      //commented for v1 release
      // try {
      //   if (beforeJoin) {
      //     await beforeJoin();
      //   }
      // } catch (error) {
      //   console.error('FPE:Error on executing useBeforeJoin', error);
      // }

      await engine.joinChannel(
        rtcProps.token || null,
        rtcProps.channel,
        null,
        rtcProps.uid || 0,
      );
      if (videoState === ToggleState.enabled && Platform.OS === 'ios') {
        dispatch({
          type: 'LocalMuteVideo',
          value: [ToggleState.enabling],
        });
        await engine.muteLocalVideoStream(false);
        dispatch({
          type: 'LocalMuteVideo',
          value: [ToggleState.enabled],
        });
      }
    }
    async function init() {
      if (!precall) {
        if (!joinState.current) {
          await join();
          joinState.current = true;
        } else {
          await leave();
          await join();
        }
        console.log('Attempted join: ', rtcProps.channel);
      } else {
        console.log('In precall - waiting to join');
      }
    }
    init();
    return () => {
      if (!precall) {
        leave();
      }
    };
  }, [
    rtcProps.channel,
    rtcProps.uid,
    rtcProps.token,
    precall,
    rtcProps.encryption,
  ]);

  return <>{children}</>;
};

export default Join;
