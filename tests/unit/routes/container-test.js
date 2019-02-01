import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | container', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:container');
    assert.ok(route);
  });
});
