import { useEffect, useRef, useState } from 'react';
import  {API_URL}  from '../../key';


const useScreenTime = ({ slideIndex, tabName, userUUID, sessionId, isActive = true }) => {
  const startRef = useRef(null);
  const [totalWatchTime, setTotalWatchTime] = useState(0);

  useEffect(() => {
    if (!isActive || !userUUID || !sessionId) return;
    startRef.current = Date.now();

    return () => {
      if (startRef.current) {
        const end = Date.now();
        const watchTime = end - startRef.current;
        if (watchTime > 1000) {
          fetch(`${API_URL}/api/track/slide`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-User-UUID': userUUID,
              'X-Session-ID': sessionId
            },
            body: JSON.stringify({
              slideIndex,
              tabName,
              watchTime,
              startTime: startRef.current,
              endTime: end
            })
          });
          setTotalWatchTime(prev => prev + watchTime);
        }
      }
    };
  }, [slideIndex, tabName, isActive, userUUID, sessionId]);

  return { totalWatchTime };
};

export default useScreenTime;
