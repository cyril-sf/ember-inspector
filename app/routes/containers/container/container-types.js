import Route from '@ember/routing/route';
import { Promise } from 'rsvp';

export default Route.extend({
  controllerName: 'container-types',

  model() {
    let containerRef = this.modelFor('containers.container');
    const port = this.get('port');
    return new Promise(resolve => {
      port.one('container:types', function(message) {
        resolve(message.types);
      });
      containerRef = containerRef.container_type_id+':'+containerRef.container_instance_id;
      port.send('container:getTypes', { containerRef });
    });
  },
  actions: {
    reload() {
      this.refresh();
    }
  }
});
