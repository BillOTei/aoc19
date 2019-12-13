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

  console.log(Math.max(...distributedAsteroids.map(o => visible(o))));
});
