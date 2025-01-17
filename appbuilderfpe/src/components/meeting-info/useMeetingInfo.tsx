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
import React, {createContext} from 'react';
import {createHook} from 'fpe-implementation';
import {UidType} from '../../../agora-rn-uikit';
export interface MeetingInfoContextInterface {
  isJoinDataFetched?: boolean;
  isHost: boolean;
  meetingTitle: string;
  meetingPassphrase: {
    attendee: string;
    host?: string;
    pstn?: {
      number: string;
      pin: string;
    };
  };
  isSeparateHostLink: boolean;
  channel?: string;
  uid?: UidType;
  token?: string;
  rtm?: string;
  secret?: string;
  screenShareUid?: string;
  screenShareToken?: string;
}

export const MeetingInfoDefaultValue: MeetingInfoContextInterface = {
  isJoinDataFetched: false,
  isHost: false,
  meetingTitle: '',
  meetingPassphrase: {
    attendee: '',
  },
  isSeparateHostLink: true,
};

const MeetingInfoContext = createContext(MeetingInfoDefaultValue);

interface MeetingInfoProviderProps {
  children: React.ReactNode;
  value: MeetingInfoContextInterface;
}

const MeetingInfoProvider = (props: MeetingInfoProviderProps) => {
  return (
    <MeetingInfoContext.Provider value={{...props.value}}>
      {props.children}
    </MeetingInfoContext.Provider>
  );
};
const useMeetingInfo = createHook(MeetingInfoContext);

export {MeetingInfoProvider, useMeetingInfo};
