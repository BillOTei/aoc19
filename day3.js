const fs = require("fs");

const part1 = () =>
  fs.readFile("./day3_input", "utf8", function(err, contents) {
    const [wire1, wire2] = contents.split("\n").map(l => l.split(","));

    const DX = { L: -1, R: 1, U: 0, D: 0 };
    const DY = { L: 0, R: 0, U: 1, D: -1 };
    const getCoordinates = wire => {
      let x = 0,
        y = 0,
        l = 0;
      let pointsCount = new Map();
      wire.forEach(d => {
        const direction = d.substring(0, 1);
        const amount = parseInt(d.substring(1), 10);
        for (let i = 0; i < amount; i++) {
          x += DX[direction];
          y += DY[direction];
          l += 1;
          !pointsCount.has(`${x},${y}`) && pointsCount.set(`${x},${y}`, l);
        }
      });

      return pointsCount;
    };

    const pointsLen2 = getCoordinates(wire2);
    const pointsLen1 = getCoordinates(wire1);
    const points1 = [...pointsLen1.keys()];
    const points2 = [...pointsLen2.keys()];
    const intersection = points1.filter(p1 => points2.indexOf(p1) !== -1);

    // console.log(
    //   Math.min(
    //     ...intersection.map(v =>
    //       v
    //         .split(",")
    //         .reduce(
    //           (x, y) => Math.abs(parseInt(x, 10)) + Math.abs(parseInt(y, 10))
    //         )
    //     )
    //   )
    // );
    console.log(Math.min(...intersection.map(v => pointsLen1.get(v) + pointsLen2.get(v))));
  });

part1();
