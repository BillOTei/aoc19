const fs = require("fs");

fs.readFile("day6_input", "utf8", function(err, contents) {
  const orbits = contents.split("\n");
  let objMap = new Map();
  orbits.forEach(v => {
    const [center, obj] = v.split(")");
    !objMap.has(obj) && objMap.set(obj, center);
  });
  const countOrbits = (obj, map, count) =>
    map.has(obj) ? countOrbits(map.get(obj), map, count + 1) : count;

  console.log(
    [...objMap.keys()].reduce(
      (acc, obj) => acc + countOrbits(obj, objMap, 0),
      0
    )
  );
});
