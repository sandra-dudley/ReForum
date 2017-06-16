const test = require('tape');
const sinon = require('sinon');

const mongooseTypes = require('mongoose').Types;

const deepPropSearch = require('../../../backend/utilities/tools').deepPropSearch;
const generateDiscussionsSlug = require('../../../backend/utilities/tools').generateDiscussionSlug;

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

