const UNIQUE_SPEAK_EVENT = {
  onboundary: 'onboundary',
  onend: 'onend',
  onerror: 'onerror',
  onmark: 'onmark',
  onpause: 'onpause',
  onresume: 'onresume',
  onstart: 'onstart',
};

const SPEAK_STATUS = {
  IDLE: 1, // Speaker is created but not prepared
  PLAYING: 2, // Speaker is playing media
  PAUSED: 3, // Speaker is paused
};
