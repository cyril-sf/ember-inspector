import { Promise } from 'rsvp';
import { get } from '@ember/object';
import Route from '@ember/routing/route';

export default Route.extend({
  controllerName: 'container-type',

  setupController(controller) {
    controller.setProperties({
      search: '',
      searchVal: ''
    });
    this._super(...arguments);
  },
  model(params) {
    const containerType = params.type_id;
    const port = this.get('port');
    let containerRef = this.modelFor('containers.container');
    return new Promise((resolve, reject) => {
      port.one('container:instances', message => {
        if (message.status === 200) {
          resolve(message.instances);
        } else {
          reject(message);
        }
      });
      containerRef = containerRef.container_type_id+':'+containerRef.container_instance_id;
      port.send('container:getInstances', { containerRef, containerType });
    });
  },


  actions: {
    error(err) {
      if (err && err.status === 404) {
        this.transitionTo('containers.container.containers-types.container-type.index');
        return false;
      }
    },
    sendInstanceToConsole(obj) {
      this.get('port').send('container:sendInstanceToConsole', { name: get(obj, 'fullName') });
    }
  }
});
