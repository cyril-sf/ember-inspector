import Route from '@ember/routing/route';

export default Route.extend({
  afterModel() {
    let containerType = this.modelFor('containers.container.container-types').firstObject;
    return this.transitionTo('containers.container.container-types.container-type', containerType.name);
  }
});
