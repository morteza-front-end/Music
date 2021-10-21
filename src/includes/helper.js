export default {
  formatTime(time) {
    const mintues = Math.floor(time / 60) || 0;
    const seconds = Math.round(time - mintues * 60) || 0;
    return `${mintues}:${seconds < 10 ? '0' : ''}${seconds}`;
  },
};
