const fs = require("fs");

fs.readFile("./day12_input", "utf8", function(err, contents) {
  const moons = contents.split("\n").map((m, i) => {
    const [x, y, z] = m
      .split(", ")
      .map(coord => parseInt(coord.match(/\d+/)[0], 10));

    return { i, x, y, z, v: { x: 0, y: 0, z: 0 } };
  });
  const perms = array =>
    array.reduce(
      (acc, val, i1) => [
        ...acc,
        ...new Array(array.length - 1 - i1)
          .fill(0)
          .map((v, i2) => [array[i1], array[i1 + 1 + i2]])
      ],
      []
    );
  let moonPairs = perms([0, 1, 2, 3]);
  const l = moonPairs.length;

  const gravitate = ([m1, m2]) => {
    const { x1, y1, z1, v1 } = { x1: m1.x, y1: m1.y, z1: m1.z, v1: m1.v };
    const { x2, y2, z2, v2 } = { x2: m2.x, y2: m2.y, z2: m2.z, v2: m2.v };
    const pushOrPull = (a1, a2) => (a1 > a2 ? 1 : a1 === a2 ? 0 : -1);
    const newV1 = v1.map((vel1, i) =>
      vel1 + i === 0
        ? pushOrPull(x1, x2)
        : i === 1
        ? pushOrPull(y1, y2)
        : pushOrPull(z1, z2)
    );
    const newV2 = v2.map((vel2, i) =>
      vel2 + i === 0
        ? pushOrPull(x2, x1)
        : i === 1
        ? pushOrPull(y2, y1)
        : pushOrPull(z2, z1)
    );

    return [newV1, newV2];
  };
  const applyGravity = moonPairs => {
    for (let i = 0; i < l; i++) {
      moonPairs[i] = gravitate(moonPairs[i]);
    }
  };
  const applyVelocity = ([m1, m2]) => {
    const { x1, y1, z1, v1 } = { x1: m1.x, y1: m1.y, z1: m1.z, v1: m1.v };
    const { x2, y2, z2, v2 } = { x2: m2.x, y2: m2.y, z2: m2.z, v2: m2.v };

    return [
      { x: x1 + v1.x, y: y1 + v1.y, z: z1 + v1.z, v: { ...v1 } },
      { x: x2 + v2.x, y: y2 + v2.y, z: z2 + v2.z, v: { ...v2 } }
    ];
  };
  const run = true;
  let t = 0;

  while (run) {
    for (let i = 0; i < l; i++) {

    }
    t += 1;
  }

  console.log(moonPairs);
});
