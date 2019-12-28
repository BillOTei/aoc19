const fs = require("fs");

fs.readFile("./day12_input", "utf8", function(err, contents) {
  const moons = contents.split("\n").map((m, i) => {
    const [x, y, z] = m
      .split(", ")
      .map(coord => parseInt(coord.match(/-?\d+/)[0], 10));

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
  const l = moons.length;

  const gravitate = ([m1, m2]) => {
    const { x1, y1, z1, v1 } = { x1: m1.x, y1: m1.y, z1: m1.z, v1: m1.v };
    const { x2, y2, z2, v2 } = { x2: m2.x, y2: m2.y, z2: m2.z, v2: m2.v };
    const pushOrPull = (a1, a2) => (a1 > a2 ? -1 : a1 === a2 ? 0 : 1);
    const newV1 = Object.keys(v1).map(
      k =>
        v1[k] +
        (k === "x"
          ? pushOrPull(x1, x2)
          : k === "y"
          ? pushOrPull(y1, y2)
          : pushOrPull(z1, z2))
    );
    const newV2 = Object.keys(v2).map(
      k =>
        v2[k] +
        (k === "x"
          ? pushOrPull(x2, x1)
          : k === "y"
          ? pushOrPull(y2, y1)
          : pushOrPull(z2, z1))
    );

    return [
      { x: newV1[0], y: newV1[1], z: newV1[2] },
      { x: newV2[0], y: newV2[1], z: newV2[2] }
    ];
  };
  const run = true;
  let t = 0;
  while (run) {
    moonPairs.forEach(pair => {
      const [i1, i2] = pair;
      const [v1, v2] = gravitate([moons[i1], moons[i2]]);
      moons[i1].v = v1;
      moons[i2].v = v2;
    });
    for (let i = 0; i < l; i++) {
      moons[i].x += moons[i].v.x;
      moons[i].y += moons[i].v.y;
      moons[i].z += moons[i].v.z;
    }
    t += 1;
    if (t === 10) break;
  }

  console.log(moons);
});
