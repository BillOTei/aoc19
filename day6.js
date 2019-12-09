const fs = require("fs");

// fs.readFile("day6_input", "utf8", function(err, contents) {
//   const orbits = contents.split("\n");
//   let objMap = new Map();
//   orbits.forEach(v => {
//     const [center, obj] = v.split(")");
//     !objMap.has(obj) && objMap.set(obj, center);
//   });
//   const countOrbits = (obj, map, count) =>
//     map.has(obj) ? countOrbits(map.get(obj), map, count + 1) : count;
//
//   console.log(
//     [...objMap.keys()].reduce(
//       (acc, obj) => acc + countOrbits(obj, objMap, 0),
//       0
//     )
//   );
// });

fs.readFile("day6_input", "utf8", function(err, contents) {
  const orbits = contents.split("\n");
  let objMap = new Map();
  let youCenter, sanCenter;
  orbits.forEach(v => {
    const [center, obj] = v.split(")");
    !objMap.has(obj) && objMap.set(obj, center);
    if (obj === "YOU") youCenter = center;
    if (obj === "SAN") sanCenter = center;
  });
  const countOrbits = (obj, trackedObj, map, path, transferring) => {
    if (map.has(obj) && obj === trackedObj) {
      return countOrbits(map.get(obj), trackedObj, map, [...path, obj], true);
    } else if (transferring) {
      if (obj !== "COM")
        return countOrbits(map.get(obj), trackedObj, map, [...path, obj], true);
      else return path;
    } else return path;
  };
  const objKeys = [...objMap.keys()];
  const youPath = objKeys
    .reduce(
      (acc, obj) => acc + countOrbits(obj, youCenter, objMap, [], false),
      []
    )
    .split(",");
  const sanPath = objKeys
    .reduce(
      (acc, obj) => acc + countOrbits(obj, sanCenter, objMap, [], false),
      []
    )
    .split(",");
  const firstCommonObj = youPath.filter(o => sanPath.indexOf(o) !== -1)[0];

  console.log(
    youPath.indexOf(firstCommonObj) + sanPath.indexOf(firstCommonObj)
  );
});
