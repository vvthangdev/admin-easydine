export const animations = {
  duration: {
    shortest: 150,
    shorter: 200,
    short: 250,
    standard: 300,
    complex: 375,
    enteringScreen: 225,
    leavingScreen: 195,
  },
  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  },
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  fade: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  slide: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  scale: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  hover: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  tableHover: 'background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  buttonHover: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
};