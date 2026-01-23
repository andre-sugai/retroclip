/**
 * Detects if the current browser is an in-app browser (Instagram, Facebook, etc.)
 */
export const isInAppBrowser = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
  
  // Rules for detecting in-app browsers
  const rules = [
    'Instagram',
    'FBAN', // Facebook for Android
    'FBAV', // Facebook for iOS
    'Messenger',
    'Twitter',
    'LinkedIn',
    'WhatsApp',
    'Line',
    'Snapchat', // SnapChat
  ];

  return rules.some((rule) => ua.includes(rule));
};

/**
 * Gets the current operating system
 */
export const getMobileOS = (): 'android' | 'ios' | 'unknown' => {
  const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
  
  if (/android/i.test(ua)) {
      return 'android';
  }

  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  if (/iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream) {
      return 'ios';
  }

  return 'unknown';
};
