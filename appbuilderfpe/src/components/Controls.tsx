/*
********************************************
 Copyright © 2021 Agora Lab, Inc., all rights reserved.
 AppBuilder and all associated components, source code, APIs, services, and documentation 
 (the “Materials”) are owned by Agora Lab, Inc. and its licensors. The Materials may not be 
 accessed, used, modified, or distributed for any purpose without a license from Agora Lab, Inc.  
 Use without a license or in violation of any license terms and conditions (including use for 
 any purpose competitive to Agora Lab, Inc.’s business) is strictly prohibited. For more 
 information visit https://appbuilder.agora.io. 
*********************************************
*/
import React, {useState, useContext} from 'react';
import {View, Dimensions, StyleSheet} from 'react-native';
import {PropsContext} from '../../agora-rn-uikit';
import LocalAudioMute, {
  LocalAudioMuteProps,
} from '../subComponents/LocalAudioMute';
import LocalVideoMute, {
  LocalVideoMuteProps,
} from '../subComponents/LocalVideoMute';
import Recording, {RecordingButtonProps} from '../subComponents/Recording';
import LocalSwitchCamera, {
  LocalSwitchCameraProps,
} from '../subComponents/LocalSwitchCamera';
import ScreenshareButton, {
  ScreenshareButtonProps,
} from '../subComponents/screenshare/ScreenshareButton';
import {controlsHolder} from '../../theme.json';
import isMobileOrTablet from '../utils/isMobileOrTablet';
import {ClientRole} from '../../agora-rn-uikit';
import LiveStreamControls, {
  LiveStreamControlsProps,
} from './livestream/views/LiveStreamControls';
import {isIOS, isWeb} from '../utils/common';
import {useMeetingInfo} from './meeting-info/useMeetingInfo';
import LocalEndcall, {LocalEndcallProps} from '../subComponents/LocalEndCall';

const Controls = () => {
  const {rtcProps} = useContext(PropsContext);

  let onLayout = (e: any) => {
    setDim([e.nativeEvent.layout.width, e.nativeEvent.layout.height]);
  };
  const [dim, setDim] = useState([
    Dimensions.get('window').width,
    Dimensions.get('window').height,
    Dimensions.get('window').width > Dimensions.get('window').height,
  ]);
  const isDesktop = dim[0] > 1224;
  const {isHost} = useMeetingInfo();

  return (
    <View
      style={[
        style.controlsHolder,
        {
          paddingHorizontal: isDesktop ? '25%' : '1%',
          backgroundColor: $config.SECONDARY_FONT_COLOR + 80,
        },
      ]}
      onLayout={onLayout}>
      {$config.EVENT_MODE && rtcProps.role == ClientRole.Audience ? (
        <LiveStreamControls showControls={true} />
      ) : (
        <>
          {/**
           * In event mode when raise hand feature is active
           * and audience is promoted to host, the audience can also
           * demote himself
           */}
          {$config.EVENT_MODE && (
            <LiveStreamControls
              showControls={rtcProps?.role == ClientRole.Broadcaster && !isHost}
            />
          )}
          <View style={{alignSelf: 'center'}}>
            <LocalAudioMute />
          </View>
          <View style={{alignSelf: 'center'}}>
            <LocalVideoMute />
          </View>
          {isMobileOrTablet() && (
            <View style={{alignSelf: 'center'}}>
              <LocalSwitchCamera />
            </View>
          )}
          {$config.SCREEN_SHARING && !isMobileOrTablet() && (
            <View style={{alignSelf: 'center'}}>
              <ScreenshareButton />
            </View>
          )}
          {isHost && $config.CLOUD_RECORDING && (
            <View style={{alignSelf: 'center'}}>
              <Recording />
            </View>
          )}
        </>
      )}
      <View style={{alignSelf: 'center'}}>
        <LocalEndcall />
      </View>
    </View>
  );
};

export const ControlsComponentsArray: [
  (props: LocalAudioMuteProps) => JSX.Element,
  (props: LocalVideoMuteProps) => JSX.Element,
  (props: LocalSwitchCameraProps) => JSX.Element,
  (props: ScreenshareButtonProps) => JSX.Element,
  (props: RecordingButtonProps) => JSX.Element,
  (props: LocalEndcallProps) => JSX.Element,
  (props: LiveStreamControlsProps) => JSX.Element,
] = [
  LocalAudioMute,
  LocalVideoMute,
  LocalSwitchCamera,
  ScreenshareButton,
  Recording,
  LocalEndcall,
  LiveStreamControls,
];

const style = StyleSheet.create({
  // @ts-ignore
  controlsHolder: {
    flex: isWeb ? 1.3 : 1.6,
    ...controlsHolder,
  },
  chatNotification: {
    width: 20,
    height: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: $config.PRIMARY_COLOR,
    color: $config.SECONDARY_FONT_COLOR,
    fontFamily: isIOS ? 'Helvetica' : 'sans-serif',
    borderRadius: 10,
    position: 'absolute',
    left: 25,
    top: -10,
  },
});

export default Controls;
