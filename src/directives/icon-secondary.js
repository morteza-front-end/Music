export default {
  beforeMount(el, binding) {
    let classIcon = `fa fa-${binding.value.icon}  text-green-400 text-2xl ml-3`;
    if (binding.arg === 'full') {
      classIcon = binding.value;
    }
    if (binding.value.right) {
      classIcon += ' float-right';
    }
    if (binding.value.left) {
      classIcon += ' float-left';
    }

    // eslint-disable-next-line no-param-reassign
    el.innerHTML += `<i  class="${classIcon}"></i>`;
  },
};
