import React from 'react';
import {useFpe} from 'fpe-api';

const CustomUserContextHolder: React.FC<{children: any}> = (props) => {
  const useUserContext = useFpe((config) => {
    if (
      config?.components?.videoCall &&
      typeof config?.components?.videoCall === 'object' &&
      config?.components?.videoCall?.useUserContext &&
      typeof config?.components?.videoCall?.useUserContext === 'function'
    ) {
      return config?.components?.videoCall?.useUserContext;
    } else {
      return () => {};
    }
  });
  useUserContext();
  return props.children;
};
export default CustomUserContextHolder;
