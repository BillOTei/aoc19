const fs = require("fs");

const toFuel = mass => Math.floor(mass / 3) - 2;
const recurseToFuel = (acc, mass) => {
  const fuel = toFuel(mass);
  if (fuel <= 0) {
    return acc;
  } else {
    return recurseToFuel(acc + fuel, fuel);
  }
};

fs.readFile("./day1_input", "utf8", function(err, contents) {
  const masses = contents.split("\n");

  console.log(masses.reduce((acc, mass) => acc + toFuel(mass), 0)); // Part 1
  console.log(masses.reduce((acc, mass) => acc + recurseToFuel(0, mass), 0)); // Part 2
});
