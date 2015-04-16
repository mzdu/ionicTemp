module('module1');

var pwdMgr = require('./managePasswords');

QUnit.test( "hello test", function( assert ) {
  assert.ok( 1 == "1", "Passed!" );
});

test( "test foo", function() {
  ok(true);
});