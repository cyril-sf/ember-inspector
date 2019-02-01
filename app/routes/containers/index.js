import Route from '@ember/routing/route';

export default Route.extend({
  beforeModel() {
    let containers = this.modelFor('containers');
    if (containers) {
      this.transitionTo('containers.container', containers[0]);
    }
  }
});

