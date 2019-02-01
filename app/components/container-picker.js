import Component from '@ember/component';

export default Component.extend({
  containers: null,

  actions: {
    onSelect(containerId) {
      this.sendAction('selectContainer', containerId);
    }
  }
});
