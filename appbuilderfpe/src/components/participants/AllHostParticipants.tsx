import React from 'react';
import MeParticipant from './MeParticipant';
import ScreenshareParticipants from './ScreenshareParticipants';
import RemoteParticipants from './RemoteParticipants';
import {useString} from '../../utils/useString';
import useUserList from '../../utils/useUserList';
import {UidType, useLocalUid} from '../../../agora-rn-uikit';

export default function AllHostParticipants(props: any) {
  const {p_style, isHost} = props;
  const localUid = useLocalUid();
  //commented for v1 release
  //const remoteUserDefaultLabel = useString('remoteUserDefaultLabel')();
  const remoteUserDefaultLabel = 'User';
  const {renderList, renderPosition} = useUserList();
  const getParticipantName = (uid: UidType) => {
    return renderList[uid]?.name || remoteUserDefaultLabel;
  };

  return (
    <>
      {/* User should see his name first */}
      {renderPosition.filter((uid) => uid === localUid).length > 0 && (
        <MeParticipant
          name={getParticipantName(localUid)}
          p_style={p_style}
          key={localUid}
        />
      )}
      {/* Others Users in the call */}
      {renderPosition
        .filter((uid) => uid !== localUid)
        .map((uid) =>
          renderList[uid]?.type === 'screenshare' ? (
            <ScreenshareParticipants
              name={getParticipantName(uid)}
              p_styles={p_style}
              key={uid}
            />
          ) : (
            <RemoteParticipants
              name={getParticipantName(uid)}
              p_styles={p_style}
              user={renderList[uid]}
              showControls={renderList[uid]?.type === 'rtc'}
              isHost={isHost}
              key={uid}
            />
          ),
        )}
    </>
  );
}
