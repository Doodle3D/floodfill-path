// make optional: allow boundary on outer pixels
//   have extra event for this? also use onBoundary for this?
// make translation to regular resolution easy?

var floodFill = require('n-dimensional-flood-fill');

module.exports = function (options) {
  var noop = function () {};
  var islandThreshold = options.islandThreshold || 10;
  var onBoundary = options.onBoundary || noop;
  var boundaries = [];
  var prevBoundary = [];
  options.onBoundary = function (x, y) {
    var boundary = [x, y];
    // ToDo handle hitting limits
    if (boundary[0] !== prevBoundary[0] ||
      boundary[1] !== prevBoundary[1]) {
      boundaries.push(boundary);
      prevBoundary = boundary;
    }
    if(onBoundary) onBoundary(x, y);
  };

  var result = floodFill(options);
  // console.log('floodFill.flooded: ', result.flooded);
  // console.log('floodFill.boundaries: ', result.boundaries);
  // console.log('boundaries: ', boundaries);

  // Convert the list of fill boundary points into an array of paths.
  // If you're filling a face, everything within it will be a new path,
  var paths = distanceSort(result.boundaries, islandThreshold);
  console.log('paths: ', paths);

  return paths;
};

// Sort an array of Points by distance, grouped by distance threshold.
function distanceSort(points, islandThreshold) {
  // Use an external function to find the most appropriate starting point.
  var startPointIndex = getFillStartID(points);
  var startPoint = points.splice(startPointIndex, 1);
  var out = [[startPoint[0]]];
  var cGroup = 0;

  // Loop through every point, adding the next closest point,
  // removing the previous points.
  while (points.length) {
    var lastPoint = out[cGroup][out[cGroup].length - 1];
    var nextPoint = closestPoint(lastPoint, points);

    // If the distance is further away than "normal", we must be jumping to a
    // sub path. Increment the group.
    if (nextPoint.dist > islandThreshold) {
      cGroup++;
      out[cGroup] = [];
    }

    out[cGroup].push(points.splice(nextPoint.id, 1)[0]);
  }

  return out;
}

// Given a list of points, find the one closest to the given point.
function closestPoint(point, list) {
  var closestID = 0;
  var closest = distance(point, list[0]);
  for(var i = 0; i < list.length; i++) {
    var p = list[i];
    var dist = distance(point, p);
    if (dist < closest) {
      closest = dist;
      closestID = i;
    }
  }
  return { id: closestID, dist: closest };
}

function distance(a, b) {
  var distX = a[0] - b[0];
  var distY = a[1] - b[1];
  return Math.sqrt(distX * distX + distY * distY);
}


// Find the most appropriate fill boundary starting point given an array of points.
function getFillStartID(points) {
  var bestID = 0;
  var lowestY = points[0].y;
  points.map(function (p, index) {
    if (p.y < lowestY) {
      lowestY = p.y;
      bestID = index;
    }
  });

  return bestID;
}
