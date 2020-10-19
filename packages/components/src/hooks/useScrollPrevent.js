import { useCallback, useEffect, useState } from 'react';


// Based on https://stackoverflow.com/a/4770179
/**
 * Hook that provides the basic functionality for 
 * enabling and disabling scroll on various devices.
 */
export default function useScrollPrevent() {
  // left: 37, up: 38, right: 39, down: 40,
  // spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
  const keys = { 37: true, 38: true, 39: true, 40: true};
  const [supportsPassive, setSupportsPassive] = useState(false);

  const preventDefault = useCallback((event) => {
    event.preventDefault();
  }, []);
  const preventDefaultKeys = useCallback((event) => {
    if (keys[event.keyCode]) {
      event.preventDefault();
      return false;
    }
  }, []);

  useEffect(() => {
    try {
      window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
        get: function () { setSupportsPassive(true); } 
      }));
    } catch(ex) {}
  }, []);

  const wheelOpt = supportsPassive ? { passive: false } : false;
  const wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

  const disableScroll = useCallback(() => {
    window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
    window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
    window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
    window.addEventListener('keydown', preventDefaultKeys, false);

    window.document.body.style.overflow = 'hidden';
    window.document.body.style.touchAction = 'none';
  }, [preventDefault, preventDefaultKeys]);

  const enableScroll = useCallback(() => {
    window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.removeEventListener(wheelEvent, preventDefault, wheelOpt); 
    window.removeEventListener('touchmove', preventDefault, wheelOpt);
    window.removeEventListener('keydown', preventDefaultKeys, false);

    window.document.body.style.overflow = 'initial';
    window.document.body.style.touchAction = 'initial';
  }, []);

  return {
    disableScroll,
    enableScroll,
  }
}