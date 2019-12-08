const fs = require("fs");

const part2 = () =>
  fs.readFile("./day5_input", "utf8", function(err, contents) {
    let program = contents.split(",").map(v => parseInt(v, 10));
    const l = program.length;
    let i = 0;
    let r = [];
    const getValue = (idx, paramNb, mode) => {
      if (mode === 0) {
        const address = program[idx + paramNb];
        return program[address];
      } else {
        return program[idx + paramNb];
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
          modes.length < 2 && modes.push(0);
          const modeValues = modes.map((mode, paramNb) =>
            getValue(i, paramNb + 1, mode)
          );
          modeValues.push(program[i + 3]);

          program[modeValues[2]] =
            op === 1
              ? modeValues[0] + modeValues[1]
              : modeValues[0] * modeValues[1];
          i = i + 4;
        } else if (op === 4) {
          r.push(program[i + 1]);
          i = i + 2;
        } else if (op === 5) {
          program[i + 1] !== 0 ? (i = program[i + 2]) : (i = i + 3);
        } else if (op === 6) {
          program[i + 1] === 0 ? (i = program[i + 2]) : (i = i + 3);
        } else if (op === 7) {
          program[i + 1] < program[i + 2]
            ? (program[program[i + 3]] = 1)
            : (program[program[i + 3]] = 0);
        } else if (op === 8) {
          program[i + 1] === program[i + 2]
            ? (program[program[i + 3]] = 1)
            : (program[program[i + 3]] = 0);
        } else {
          console.error("wtf", instruction);
          break;
        }
      } else {
        const op = parseInt(instruction, 10);
        if (op === 1 || op === 2) {
          const address1 = program[i + 1];
          const address2 = program[i + 2];
          const pos = program[i + 3];
          program[pos] =
            op === 1
              ? program[address1] + program[address2]
              : program[address1] * program[address2];
          i = i + 4;
        } else if (op === 3) {
          program[program[i + 1]] = 8;
          i = i + 2;
        } else if (op === 4) {
          r.push(program[program[i + 1]]);
          i = i + 2;
        } else if (op === 5) {
          program[i + 1] !== 0 ? (i = program[i + 2]) : (i = i + 3);
        } else if (op === 6) {
          program[i + 1] === 0 ? (i = program[i + 2]) : (i = i + 3);
        } else if (op === 7) {
          program[i + 1] < program[i + 2]
            ? (program[program[i + 3]] = 1)
            : (program[program[i + 3]] = 0);
        } else if (op === 8) {
          program[i + 1] === program[i + 2]
            ? (program[program[i + 3]] = 1)
            : (program[program[i + 3]] = 0);
        } else {
          console.error("wtf2", instruction);
          break;
        }
      }
    }

    console.log(r);
  });

part2();
