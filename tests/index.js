var test = require('tape');
var createDebug =  require('debug');
const debug = createDebug('fl:test');
var floodFillPath = require('../index.js');

test('generates path from pixel data', (assert) => {
    // Some data structure that we'd like to flood fill.
    // var data = [
    //   [0, 0, 1],
    //   [0, 1, 1],
    //   [1, 1, 0]
    // ];
    // var data = [
    //   [0, 1, 1],
    //   [0, 1, 1],
    //   [1, 1, 1]
    // ];

    // Don't work properly...
    // var data = [
    //   [0, 0, 0, 0],
    //   [0, 1, 0, 0],
    //   [0, 1, 1, 0]
    //   [0, 0, 0, 0],
    // ];
    // var data = [
    //   [0, 0, 0, 0],
    //   [0, 1, 1, 0],
    //   [0, 0, 1, 0]
    //   [0, 0, 0, 0],
    // ];

    // // work:
    // var data = [
    //   [0, 0, 0, 0, 0],
    //   [0, 1, 1, 1, 0],
    //   [0, 0, 1, 1, 0],
    //   [0, 0, 0, 0, 0],
    // ];
    // var data = [
    //   [0, 0, 0, 0, 0],
    //   [0, 1, 1, 0, 0],
    //   [0, 1, 1, 1, 0],
    //   [0, 0, 1, 1, 0],
    //   [0, 0, 0, 0, 0],
    // ];
    var data = [
      [0, 0, 0, 0, 0],
      [0, 1, 0, 1, 0],
      [0, 1, 1, 1, 0],
      [0, 0, 1, 1, 0],
      [0, 0, 0, 0, 0],
    ];

    // Define our getter for accessing the data structure.
    var getter = function (x, y) {
      return data[y][x];
    };

    // Choose a start node.
    var seed = [1, 1];

    // Flood fill over the data structure.
    var path = floodFillPath({
      getter: getter,
      seed: seed
    });

	const actual = path;
	const expected = [ [ [ 1, 2 ], [ 1, 1 ], [ 3, 1 ], [ 3, 2 ], [ 3, 3 ], [ 2, 3 ] ] ];
	assert.deepEqual(actual, expected, 'should have create path');
	assert.end();
})


test.only('pixel data with hole', (assert) => {
    // Some data structure that we'd like to flood fill.
    // var data = [
    //   [0, 0, 0, 0, 0, 0, 0, 0],
    //   [0, 1, 1, 1, 1, 1, 1, 0],
    //   [0, 1, 1, 1, 1, 1, 1, 0],
    //   [0, 1, 1, 0, 0, 1, 1, 0],
    //   [0, 1, 1, 0, 0, 1, 1, 0],
    //   [0, 1, 1, 1, 1, 1, 1, 0],
    //   [0, 1, 1, 1, 1, 1, 1, 0],
    //   [0, 0, 0, 0, 0, 0, 0, 0],
    // ];
    // var data = [
    //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    //   [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    //   [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    //   [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    //   [0, 1, 1, 1, 0, 0, 1, 1, 1, 0],
    //   [0, 1, 1, 1, 0, 0, 1, 1, 1, 0],
    //   [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    //   [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    //   [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    //   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    // ];
    var data = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0],
      [0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0],
      [0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    var boundariesTest = data.concat();

    // Define our getter for accessing the data structure.
    var getter = function (x, y) {
      return data[y][x];
    };

    // Choose a start node.
    var seed = [1, 1];

    // Flood fill over the data structure.
    var path = floodFillPath({
      getter: getter,
      seed: seed,
      islandThreshold: 0,
      onBoundary: function(x, y) {
          console.log('onBoundary');
          boundariesTest[y][x] = 2;
      }
    });

	const actual = path;
	const expected = [];
	assert.deepEqual(actual, expected, 'should create 2 paths');
	assert.end();

    console.log('boundariesTest: \n', boundariesTest);


})
