const fs = require("fs");

const part1 = () =>
  fs.readFile("./day2_input", "utf8", function(err, contents) {
    let program = contents.split(",");
    const l = program.length;
    let i = 0;
    while (i < l) {
      const op = parseInt(program[i], 10);
      if (op === 99) break;
      const address1 = parseInt(program[i + 1], 10);
      const address2 = parseInt(program[i + 2], 10);
      const pos = parseInt(program[i + 3], 10);
      program[pos] =
        op === 1
          ? parseInt(program[address1], 10) + parseInt(program[address2], 10)
          : parseInt(program[address1], 10) * parseInt(program[address2], 10);
      i = i + 4;
    }

    console.log(program[0]);
  });

const part2 = () =>
  fs.readFile("./day2_input", "utf8", function(err, contents) {
    const mem = contents.split(",").map(v => parseInt(v, 10));
    const l = mem.length;
    for (let x1 = 0; x1 < l; x1++) {
      for (let x2 = 0; x2 < l; x2++) {
        let program = [...mem];
        program[1] = x1;
        program[2] = x2;
        let i = 0;
        while (i < l) {
          const op = program[i];
          if (op === 99) break;
          const address1 = program[i + 1];
          const address2 = program[i + 2];
          const pos = program[i + 3];
          program[pos] =
            op === 1
              ? program[address1] + program[address2]
              : program[address1] * program[address2];
          i = i + 4;
        }
        if (program[0] === 19690720) {
          console.log(x1, x2);
        }
      }
    }
  });

part2();
