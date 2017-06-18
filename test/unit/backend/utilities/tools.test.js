const test = require('tape');
const sinon = require('sinon');

const mongooseTypes = require('mongoose').Types;

const deepPropSearch = require('../../../../backend/utilities/tools').deepPropSearch;
const generateDiscussionsSlug = require('../../../../backend/utilities/tools').generateDiscussionSlug;

function getObj(obj = {
  prop1: 1,
  prop2: '2',
  prop3: {
    prop4: 4,
    prop5: [5]
  },
  prop6: [{
    prop7: '7'
  }]
}) {return obj}

test('deepPropSearch', t => {
  t.test('should not mutate original object', t => {
    const obj = getObj();
    const fn = () => {};

    //const fn = (prop, obj) => console.log(prop);
    const actual = deepPropSearch(obj, fn);

    // deeply equal, but copied by value
    t.notStrictEqual(actual, obj);
    t.deepEqual(actual, obj);

    t.end();
  });

  t.test('should call fn() for each prop', t => {
    const obj = getObj();
    const fn = sinon.spy();

    deepPropSearch(obj, fn);

    t.equal(fn.callCount, 7);
    t.end();
  });

  t.test('should allow mutation of copy with fn()', t => {
    const obj = getObj();
    const fn = (prop, o) => typeof o[prop] == 'number' ? o[prop]++ : o[prop];
    const expected = getObj({
      prop1: 2,
      prop2: '2',
      prop3: {
        prop4: 5,
        prop5: [5]
      },
      prop6: [{
        prop7: '7'
      }]
    });

    const actual = deepPropSearch(obj, fn);

    t.deepEqual(actual, expected);
    t.end();
  });
});

test('discussion slug', t => {
  const id = '594331b3e14d0e05aa176d1d';

  t.test('before', t => {
    sinon.stub(mongooseTypes, 'ObjectId').callsFake(() => id);
    t.end();
  });

  t.test('should work', t => {
    const actual = 'test';
    const expected = `test_${id}`;

    t.equal(generateDiscussionsSlug('test'), expected);
    t.end();
  });

  t.test('should allow only [^a-z0-9]', t => {
    const actual = [
      'EPIC',
      '%!@#',
      ' xx '
    ];
    const expected = [
      'epic',
      '____',
      '_xx_'
    ].map(title => `${title}_${id}`);

    actual.forEach((v, idx) => {
      t.equal(generateDiscussionsSlug(v), expected[idx]);
    });

    t.end();
  });

  t.test('after', t => {
    mongooseTypes.ObjectId.restore();

    t.end();
  });

  t.end();
});

