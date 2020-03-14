import { useRef, useEffect } from 'react';

const useIsMounted = () => {
  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = true;
    return () => (isMounted.current = false); // eslint-disable-line no-return-assign
  }, []);
  return isMounted.current;
};

export default useIsMounted;
