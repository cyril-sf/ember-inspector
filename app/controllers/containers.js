import Controller from '@ember/controller';
import { sort } from '@ember/object/computed';

export default Controller.extend({
  sortProperties: ['container_type_id', 'container_instance_id'],
  sorted: sort('model', 'sortProperties')
});
