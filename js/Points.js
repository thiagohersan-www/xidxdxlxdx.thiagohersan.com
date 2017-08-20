var Vector = {
  x: 0,
  y: 0,
  set: function(x, y) {
    this.x = x;
    this.y = y;
    return this;
  },
  setFromVector: function(ov) {
    this.x = ov.x;
    this.y = ov.y;
    return this;
  },
  add: function(ov) {
    this.x += ov.x;
    this.y += ov.y;
    return this;
  },
  sub: function(ov) {
    this.x -= ov.x;
    this.y -= ov.y;
    return this;
  },
  div: function(s) {
    this.x /= s;
    this.y /= s;
    return this;
  },
  distSq: function(ov) {
    return Math.pow((this.x - ov.x), 2) + Math.pow((this.y - ov.y), 2);
  }
}

var Points = {
  mPoints: [],
  length: 0,
  sumOfPoints: Object.create(Vector).set(0,0),
  averagePoint: Object.create(Vector).set(0,0),
  standardDeviation: Object.create(Vector).set(0,0),

  mQuadrants: [ [], [], [], [] ],
  quadrantMinDistance: [Object.create(Vector).set(0,0),
                        Object.create(Vector).set(0,0),
                        Object.create(Vector).set(0,0),
                        Object.create(Vector).set(0,0)],
  quadrantMaxDistance: [Object.create(Vector).set(0,0),
                        Object.create(Vector).set(0,0),
                        Object.create(Vector).set(0,0),
                        Object.create(Vector).set(0,0)],
  quadrantMedian: [Object.create(Vector).set(0,0),
                   Object.create(Vector).set(0,0),
                   Object.create(Vector).set(0,0),
                   Object.create(Vector).set(0,0)],

  mColors: ['#ff55ff', '#ffff55', '#55ff55', '#55ffff'],
  
  get: function(i) {
    return this.mPoints[i];
  },
  push: function(xy) {
    this.sumOfPoints.add(xy);
    this.mPoints.push(xy);
    this.length = this.mPoints.length;
    this.update();
  },
  remove: function(i) {
    this.sumOfPoints.sub(xy);
    this.mPoints.splice(i, 1);
    this.length = this.mPoints.length;
    this.update();
  },
  clear: function() {
    this.sumOfPoints.set(0,0);
    this.mPoints = [];
    this.length = this.mPoints.length;
    this.update;
  },
  isEmpty: function() {
    return (this.length < 1);
  },
  computeAverage: function() {
    var sum = Object.create(Vector).setFromVector(this.sumOfPoints);
    this.averagePoint.setFromVector(sum.div(this.mPoints.length));
  },
  computeStandardDeviation: function() {
    var variance = Object.create(Vector).set(0,0);
    for(var i=0; i<this.mPoints.length; i++) {
      var diff = Object.create(Vector).setFromVector(this.mPoints[i]);
      diff.sub(this.averagePoint);
      variance.add(Object.create(Vector).set(diff.x * diff.x, diff.y * diff.y));
    }
    variance.div(this.mPoints.length);
    this.standardDeviation.set(Math.sqrt(variance.x), Math.sqrt(variance.y));
  },
  addToQuadrant: function(v, quad) {
    this.mQuadrants[quad].push(v);

    var thisDistance = this.averagePoint.distSq(v);
    var currentMinDistance = this.averagePoint.distSq(this.quadrantMinDistance[quad]);
    var currentMaxDistance = this.averagePoint.distSq(this.quadrantMaxDistance[quad]);

    if (thisDistance < currentMinDistance) {
      this.quadrantMinDistance[quad].setFromVector(v);
    }
    if (thisDistance > currentMaxDistance) {
      this.quadrantMaxDistance[quad].setFromVector(v);
    }
  },
  splitIntoQuadrants: function() {
    for(var i=0; i<this.mQuadrants.length; i++) {
      this.mQuadrants[i] = [];
      this.quadrantMinDistance[i].set(1e6, 1e6);
      this.quadrantMaxDistance[i].setFromVector(this.averagePoint);
    }

    for(var i=0; i<this.mPoints.length; i++) {
      var v = this.mPoints[i];
      if ((v.x <= this.averagePoint.x) && (v.y <= this.averagePoint.y)) {
        this.addToQuadrant(v, 0);
      } else if ((v.x > this.averagePoint.x) && (v.y <= this.averagePoint.y)) {
        this.addToQuadrant(v, 1);
      } else if ((v.x <= this.averagePoint.x) && (v.y > this.averagePoint.y)) {
        this.addToQuadrant(v, 2);
      } else {
        this.addToQuadrant(v, 3);
      }
    }
  },
  computeQuadrantAverage: function(quad) {
    var sum = Object.create(Vector).set(0,0);
    var mQuad = this.mQuadrants[quad];
    for(var i=0; i<mQuad.length; i++) {
      sum.add(mQuad[i]);
    }
    return sum.div(mQuad.length);
  },
  computeQuadrantMedian: function(quad) {
    var median = Object.create(Vector).set(1e6, 1e6);
    var quadAvg = this.computeQuadrantAverage(quad);
    var mQuad = this.mQuadrants[quad];

    for(var i=0; i<mQuad.length; i++) {
      if(quadAvg.distSq(mQuad[i]) < quadAvg.distSq(median)) {
        median.setFromVector(mQuad[i]);
      }
    }

    this.quadrantMedian[quad].setFromVector(median);
  },
  computeAllQuadrantMedians: function() {
    for(var i=0; i<this.quadrantMedian.length; i++) {
      this.computeQuadrantMedian(i);
    }
  },
  update: function() {
    this.computeAverage();
    this.computeStandardDeviation();
    this.splitIntoQuadrants();
    this.computeAllQuadrantMedians();
  }
};