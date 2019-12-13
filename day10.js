const fs = require("fs");

fs.readFile("./day10_input", "utf8", function(err, contents) {
  const flatten = arr => {
    return arr.reduce(function(flat, toFlatten) {
      if (!Array.isArray(toFlatten) && toFlatten.p === ".") return flat;

      return flat.concat(
        Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten
      );
    }, []);
  };
  const input = flatten(
    contents.split("\n").map((l, y) =>
      l.split("").map((p, x) => {
        return { x, y, p };
      })
    )
  );
  const visible = ({ asteroid, asteroids }) => {
    const jsonAsteroid = JSON.stringify({ x: 0, y: 0, p: "#" });
    const relativeAsteroids = asteroids
      .map(a => {
        return { ...a, x: a.x - asteroid.x, y: a.y - asteroid.y };
      })
      .filter(ast => jsonAsteroid !== JSON.stringify(ast));

    return [
      ...new Set(
        relativeAsteroids.map(
          a => Math.round(Math.atan2(a.y, a.x) * 1000000) / 1000000
        )
      )
    ].length;
  };
  const inRange = ({ asteroid, asteroids }) => {
    const jsonAsteroid = JSON.stringify({ x: 0, y: 0, p: "#" });
    const relativeAsteroids = asteroids
      .map(a => {
        return { ...a, x: a.x - asteroid.x, y: a.y - asteroid.y };
      })
      .filter(ast => jsonAsteroid !== JSON.stringify(ast));
    const asteroidsMap = new Map();
    relativeAsteroids.forEach(a => {
      const angle = Math.round(Math.atan2(a.y, a.x) * 1000000) / 1000000;
      const angleKey = angle.toString();
      if (asteroidsMap.has(angleKey))
        asteroidsMap.set(angleKey, [...asteroidsMap.get(angleKey), a]);
      else asteroidsMap.set(angleKey, [a]);
    });

    return { asteroid, asteroidsMap, length: asteroidsMap.size };
  };
  const distributedAsteroids = input.reduce(
    (acc, a) => [
      ...acc,
      {
        asteroid: { ...a },
        asteroids: [...input]
      }
    ],
    []
  );
  const distributedMap = distributedAsteroids.map(o => inRange(o));
  const { asteroid, asteroidsMap, length } = distributedMap.reduce(function(
    prev,
    current
  ) {
    return prev.length > current.length ? prev : current;
  });

  let shoot = true;
  let i = 0;
  let asteroidShot;
  while (shoot) {
    asteroidsMap.forEach(l => {
      if (l.length > 0) {
        asteroidShot = l.splice(0, 1);
        i++;
        if (i === 200) {
          shoot = false;
        }
      }
    });
  }

  console.log((asteroidShot[0].x + asteroid.x) * 100 + (asteroidShot[0].y + asteroid.y));
});
