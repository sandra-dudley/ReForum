const test = require('tape');
const sinon = require('sinon');
require('sinon-mongoose');

const mongoose = require('mongoose');
mongoose.Promise = Promise;

const controller = require('../../../../../backend/entities/user/controller');
const users = require('../../../../../backend/mockData/users');

require('../../../../../backend/entities/user/model');
require('../../../../../backend/entities/discussion/model');
require('../../../../../backend/entities/opinion/model');

const User = mongoose.model('user');
const Discussion = mongoose.model('discussion');
const Opinion = mongoose.model('opinion');

const {
  signInViaGithub,
  getUser,
  getFullProfile
} = controller;

const setup = () => {
  //sinon.stub(Model, 'findOne');
  sinon.mock(User).expects('findOne').chain('lean').chain('exec').yields(null, 'hi');
  //sinon.mock(User).expects('findOne').chain('lean').chain('exec').yields(null, 'hi');
  //sinon.mock(User).expects('findOne').chain('lean').chain('exec').yields(null, 'hi');
};

const teardown = () => {
  User.findOne.restore();
};

test('getUser', t => {

  t.test('should reject Promise on mongoose error', t => {
    sinon.mock(User).expects('findOne').yields(new Error());

    const logg = console.log;
    const fn = sinon.spy((error) => {
      t.equal(fn.called, true);
      console.log = logg;
      t.end();
    });

    console.log = function() {}
    getUser(1234).then(null, fn);

    User.findOne.restore();
  });

  t.test('should return a user by id', t => {
    sinon.mock(User).expects('findOne').yields(null, users[0]);

    const fn = sinon.spy((result) => {
      t.equal(fn.called, true);
      t.deepEqual(result, users[0]);
      t.end();
    });

    getUser(1234).then(fn);

    User.findOne.restore();
  });

  t.end();
});

test('getFullProfile', t => {

  // controller.js calls console.log(error)
  t.test('should reject Promise on mongoose error', t => {
    sinon.mock(User).expects('findOne').chain('lean').chain('exec').yields(new Error());

    const logg = console.log;
    const fn = sinon.spy((error) => {
      t.equal(fn.called, true);
      console.log = logg;
      t.end();
    });

    console.log = function() {}
    getFullProfile('someUsername').then(null, fn);

    User.findOne.restore();
  });

  t.test('should return not_found on missing user', t => {
    sinon.mock(User).expects('findOne').chain('lean').chain('exec').yields(null, null);
    const fn = sinon.spy((result) => {
      t.equal(fn.called, true);
      t.equal(result, 'not_found');
      t.end();
    });
    getFullProfile('someUsername').then(null, fn);
    User.findOne.restore();
  });

  t.skip('should return a profile', async t => {
    setup();

    //sinon.mock(Model).expects('findOne').resolves('hi');
    //Model.findOne.yields(null, users[0]);

    try {
      const v = await getFullProfile('someUsername');
      console.log(v);
    }
    catch(e) {
      console.log(e);
    }

    teardown();
    t.end();
  });

  t.end();
});
