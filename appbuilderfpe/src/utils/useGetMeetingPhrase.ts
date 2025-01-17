import {useContext} from 'react';
import {gql} from '@apollo/client';
import {MeetingInfoContextInterface} from '../components/meeting-info/useMeetingInfo';
import {useSetMeetingInfo} from '../components/meeting-info/useSetMeetingInfo';
import {GraphQLContext} from '../components/GraphQLProvider';

const SHARE = gql`
  query share($passphrase: String!) {
    share(passphrase: $passphrase) {
      passphrase {
        host
        view
      }
      channel
      title
      pstn {
        number
        dtmf
      }
    }
  }
`;

export default function useGetMeetingPhrase() {
  const {setMeetingInfo} = useSetMeetingInfo();
  const {client} = useContext(GraphQLContext);
  return async (phrase: string) => {
    const response = await client.query({
      query: SHARE,
      variables: {
        passphrase: phrase,
      },
    });
    if (response.error) {
      throw response.error;
    } else {
      try {
        if (response && response.data) {
          let data = response.data;
          let meetingPassphrase: MeetingInfoContextInterface['meetingPassphrase'] =
            {
              attendee: '',
            };
          if (data?.share?.passphrase?.view) {
            meetingPassphrase.attendee = data.share.passphrase.view;
          }
          if (data?.share?.passphrase?.host) {
            meetingPassphrase.host = data.share.passphrase.host;
          }
          if (data?.share?.pstn) {
            meetingPassphrase.pstn = {
              number: data.share.pstn.number,
              pin: data.share.pstn.dtmf,
            };
          }
          setMeetingInfo((prevState) => {
            return {
              ...prevState,
              meetingPassphrase,
            };
          });
        }
      } catch (error) {
        throw new Error('An error occurred in parsing the channel data.');
      }
    }
  };
}
