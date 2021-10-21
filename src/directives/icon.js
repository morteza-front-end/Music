export default {
  beforeMount(el, binding) {
    let classIcon = `fa fa-${binding.value}   text-2xl ml-3`;
    if (binding.arg === 'full') {
      classIcon = binding.value;
    }
    if (binding.modifiers.right) {
      classIcon += ' float-right';
    }
    if (binding.modifiers.left) {
      classIcon += ' float-left';
    }
    if (binding.modifiers.yellow) {
      classIcon += ' text-yellow-400';
    } else {
      classIcon += ' text-green-400';
    }
    // eslint-disable-next-line no-param-reassign
    el.innerHTML += `<i  class="${classIcon}"></i>`;
  },
};
