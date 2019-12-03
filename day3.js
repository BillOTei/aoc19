const fs = require("fs");

const part1 = () =>
  fs.readFile("./day3_input", "utf8", function(err, contents) {
    let pointsCount = new Map();
    const addCount = point => {
      const pointStr = point.join();
      pointsCount.get(pointStr)
        ? pointsCount.set(pointStr, pointsCount.get(pointStr) + 1)
        : pointsCount.set(pointStr, 1);
    };
    const toCoordinates = (acc, d) => {
      const direction = d.substring(0, 1);
      const amount = parseInt(d.substring(1), 10);
      const last = acc[acc.length - 1];
      switch (direction) {
        case "R":
          let allPointsR = [];
          for (let i = last[0] + 1; i <= last[0] + amount; i++) {
            const point = [last[0] + i, last[1]];
            allPointsR.push(point);
            addCount(point);
          }
          return [...acc, ...allPointsR];
        case "L":
          let allPointsL = [];
          for (let i = last[0] - 1; i >= last[0] - amount; i--) {
            const point = [i, last[1]];
            allPointsL.push(point);
            addCount(point);
          }
          return [...acc, ...allPointsL];
        case "U":
          let allPointsU = [];
          for (let i = last[1] + 1; i <= last[1] + amount; i++) {
            const point = [last[0], last[1] + i];
            allPointsU.push(point);
            addCount(point);
          }
          return [...acc, ...allPointsU];
        case "D":
          let allPointsD = [];
          for (let i = last[1] - 1; i >= last[1] - amount; i--) {
            const point = [last[0], i];
            allPointsD.push(point);
            addCount(point);
          }
          return [...acc, ...allPointsD];
      }
    };
    const [wire1, wire2] = contents.split("\n").map(l => l.split(","));
    wire1.reduce(toCoordinates, [[0, 0]]).slice(1);
    wire2.reduce(toCoordinates, [[0, 0]]).slice(1);

    console.log([...pointsCount].filter((p) => p[1] > 1));
  });

part1();
