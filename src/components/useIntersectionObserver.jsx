import { useEffect, useState } from 'react';

const useIntersectionObserver = (reference) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleIntersect = (entries, observer) => {
      if (entries[0].isIntersecting) {
        // console.log(entries[0].target, ' is intersecting');

        setIsVisible(true);
        observer.unobserve(entries[0].target);
        observer.disconnect();
      }
    };

    // create the observer
    const observer = new IntersectionObserver(handleIntersect);

    // if we have a ref value, start observing it
    if (reference) {
      observer.observe(reference.current);
    }

    // if unmounting
    return () => observer.disconnect();
  }, [reference]);

  return isVisible;
};

export default useIntersectionObserver;
