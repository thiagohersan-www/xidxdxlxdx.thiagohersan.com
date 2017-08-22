function svgEllipse(svgId, center, radius) {
  var tEllipse = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
  var radius = Math.min(radius.x, radius.y);
  tEllipse.setAttributeNS(null, "cx", center.x);
  tEllipse.setAttributeNS(null, "cy", center.y);
  tEllipse.setAttributeNS(null, "rx", radius);
  tEllipse.setAttributeNS(null, "ry", radius);
  tEllipse.setAttributeNS(null, "style", GLYPH_STYLE);
  document.getElementById(svgId).appendChild(tEllipse);
}

function svgLine(svgId, p0, p1) {
  var tLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
  tLine.setAttributeNS(null, "x1", p0.x);
  tLine.setAttributeNS(null, "y1", p0.y);
  tLine.setAttributeNS(null, "x2", p1.x);
  tLine.setAttributeNS(null, "y2", p1.y);
  tLine.setAttributeNS(null, "style", GLYPH_STYLE);
  document.getElementById(svgId).appendChild(tLine);
}

function svgBezier(svgId, p0, p1, p2, p3, p4) {
  var tPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  var d = "M"+p0.x+" "+p0.y+ " Q "+p1.x+" "+p1.y+", "+p2.x+" "+p2.y;
  d += " T "+p3.x+" "+p3.y+" T "+p4.x+" "+p4.y;
  tPath.setAttributeNS(null, "d", d);
  tPath.setAttributeNS(null, "style", GLYPH_STYLE);
  document.getElementById(svgId).appendChild(tPath);
}

function svgArc(svgId, p0, p1) {
  var tPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  var angle = 180 * Math.random();
  var dist = Math.sqrt(p0.distSq(p1));
  rx = dist/(1.5 + 0.5*Math.random());
  ry = dist/(1.5 + 0.5*Math.random());
  var d = "M"+p0.x+" "+p0.y+" A "+rx+" "+ry+" "+angle+" 0 0 "+p1.x+" "+p1.y;
  tPath.setAttributeNS(null, "d", d);
  tPath.setAttributeNS(null, "style", GLYPH_STYLE);
  document.getElementById(svgId).appendChild(tPath);
}