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
    'FB_IAB', // Facebook In-App Browser
    'Messenger',
    'Twitter',
    'LinkedIn',
    'WhatsApp',
    'Line',
    'Snapchat',
    'TikTok',
    'musical_ly', // TikTok old name
    'Pinterest',
    'Telegram',
    'Discord',
    'Reddit',
    'Tumblr',
    'YouTube', // YouTube app browser
    'GSA', // Google Search App
    'DuckDuckGo', // DuckDuckGo browser
    'Flipboard',
    'Skype',
    'Viber',
    'WeChat',
    'MicroMessenger', // WeChat
    'QQ', // QQ Browser
    'UCBrowser',
    'SamsungBrowser', // Samsung Internet in-app
    'Huawei', // Huawei browser
    'MiuiBrowser', // Xiaomi browser
    'OPiOS', // 1Password
    'CriOS', // Chrome iOS (sometimes in-app)
    'FxiOS', // Firefox iOS (sometimes in-app)
    'EdgiOS', // Edge iOS (sometimes in-app)
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
