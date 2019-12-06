const fs = require("fs");

const part1 = () =>
  fs.readFile("./day5_input", "utf8", function(err, contents) {
    let program = contents.split(",");
    const l = program.length;
    let i = 0;
    let r = [];
    const getValue = (idx, paramNb, mode) => {
      if (mode === 0) {
        const address = parseInt(program[idx + paramNb], 10);
        return parseInt(program[address], 10);
      } else {
        return parseInt(program[idx + paramNb], 10);
      }
    };
    while (i < l) {
      const instruction = program[i].toString();
      if (instruction.length > 1) {
        const op = parseInt(instruction.substr(-2), 10);
        if (op === 99) {
          break;
        } else if (op === 1 || op === 2) {
          const modes = instruction
            .substring(0, instruction.length - 2)
            .split("")
            .map(m => parseInt(m, 10))
            .reverse();
          const modeValues = modes.map((mode, paramNb) =>
            getValue(i, paramNb + 1, mode)
          );
          modeValues.push(parseInt(program[i + 3], 10));

          program[modeValues[2]] =
            op === 1
              ? modeValues[0] + modeValues[1]
              : modeValues[0] * modeValues[1];
          i = i + 4;
        } else if (op === 4) {
          r.push(program[parseInt(program[i + 1], 10)]);
          i = i + 2;
        } else {
          console.error("wtf", instruction);
          break;
        }
      } else {
        const op = parseInt(instruction, 10);
        if (op === 1 || op === 2) {
          const address1 = parseInt(program[i + 1], 10);
          const address2 = parseInt(program[i + 2], 10);
          const pos = parseInt(program[i + 3], 10);
          program[pos] =
            op === 1
              ? parseInt(program[address1], 10) + parseInt(program[address2], 10)
              : parseInt(program[address1], 10) * parseInt(program[address2], 10);
          i = i + 4;
        } else if (op === 3) {
          program[parseInt(program[i + 1], 10)] = 1;
          i = i + 2;
        } else if (op === 4) {
          r.push(program[parseInt(program[i + 1], 10)]);
          i = i + 2;
        } else {
          console.error("wtf2", instruction);
          break;
        }
      }
    }

    console.log(r);
  });

part1();
