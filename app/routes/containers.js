import TabRoute from "ember-inspector/routes/tab";

export default TabRoute.extend({
  model() {
    const port = this.get('port');
    return new Promise(resolve => {
      port.one('container:all', function(message) {
        let container_type_id, container_instance_id, containers;
        containers = message.containers.map(function(containerRef) {
          [container_type_id, container_instance_id] = containerRef.split(':');
          return {
            container_type_id,
            container_instance_id
          }
        });
        resolve(containers);
      });
      port.send('container:all');
    });
  },

  actions: {
    selectContainer(containerIndex) {
      let containerRef;
      containerRef = this.get('controller.model').objectAt(containerIndex);
      this.transitionTo('containers.container', containerRef);
    }
  }
});
