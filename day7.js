const fs = require("fs");

fs.readFile("./day7_input", "utf8", function(err, contents) {
  const input = contents.split(",").map(v => parseInt(v, 10));
  const perms = xs => {
    let ret = [];
    for (let i = 0; i < xs.length; i = i + 1) {
      let rest = perms(xs.slice(0, i).concat(xs.slice(i + 1)));
      if (!rest.length) {
        ret.push([xs[i]]);
      } else {
        for (let j = 0; j < rest.length; j = j + 1) {
          ret.push([xs[i]].concat(rest[j]));
        }
      }
    }
    return ret;
  };
  const applyMod = (intCode, modParam, index, relativeBase) => {
    switch (modParam) {
      case 0:
        return intCode[intCode[index]];
      case 1:
        return intCode[index];
      case 2:
        return intCode[intCode[index] + relativeBase];
      default:
        console.log(`Mod parameter ${modParam} not valid!`);
        return -1;
    }
  };

  const applyModWrite = (intCode, modParam, index, relativeBase) => {
    switch (modParam) {
      case 0:
      case 1:
        return intCode[index];
      case 2:
        return intCode[index] + relativeBase;
      default:
        console.log(`Mod parameter ${modParam} not valid!`);
        return -1;
    }
  };

  const getOpCodeAndMode = op => {
    const opCode =
      op.length === 1 ? 0 + op : op[op.length - 2] + op[op.length - 1];
    const mode = op.substring(0, op.length - 2);
    return [
      opCode,
      mode
        .split("")
        .reverse()
        .join("")
    ];
  };

  /**
   * Taken from https://github.com/Jedi-Fullstack-Avengers/AdventOfCode/blob/master/7/player.dasta.js#L42
   * @param input
   * @param userInput
   * @param phaseSetting
   * @param start
   * @returns {[]}
   */
  const intCodeComputer = (input, userInput = 1, phaseSetting, start = 0) => {
    const intCode = [...input];
    let loopLength = 1;
    let solution = [];
    let relativeBase = 0;
    let parameters = {};
    let error = false;
    let end = false;
    let inputsConsumed = false;
    let opCode99Encountered = false;

    for (
      let index = start;
      index < intCode.length && !error;
      index += loopLength
    ) {
      const operation = getOpCodeAndMode(intCode[index].toString());
      const opCode = parseInt(operation[0]);
      if (opCode === 99 || end) {
        opCode99Encountered = opCode === 99;
        break;
      }
      const modParams = [
        parseInt(operation[1][0] === undefined ? 0 : operation[1][0]),
        parseInt(operation[1][1] === undefined ? 0 : operation[1][1]),
        parseInt(operation[1][2] === undefined ? 0 : operation[1][2])
      ];

      switch (opCode) {
        case 1:
          parameters = {
            first: applyMod(intCode, modParams[0], index + 1, relativeBase),
            second: applyMod(intCode, modParams[1], index + 2, relativeBase),
            result: applyModWrite(
              intCode,
              modParams[2],
              index + 3,
              relativeBase
            )
          };

          intCode[parameters.result] = parameters.first + parameters.second;
          loopLength = 4;
          break;
        case 2:
          parameters = {
            first: applyMod(intCode, modParams[0], index + 1, relativeBase),
            second: applyMod(intCode, modParams[1], index + 2, relativeBase),
            result: applyModWrite(
              intCode,
              modParams[2],
              index + 3,
              relativeBase
            )
          };

          intCode[parameters.result] = parameters.first * parameters.second;
          loopLength = 4;
          break;
        case 3:
          if (inputsConsumed) {
            end = true;
            break;
          } else if (phaseSetting === -1) {
            intCode[
              applyModWrite(intCode, modParams[0], index + 1, relativeBase)
            ] = userInput;
            inputsConsumed = true;
          } else {
            intCode[
              applyModWrite(intCode, modParams[0], index + 1, relativeBase)
            ] = phaseSetting;
            phaseSetting = -1;
          }
          loopLength = 2;
          break;
        case 4:
          parameters = {
            first: applyMod(intCode, modParams[0], index + 1, relativeBase)
          };

          loopLength = 2;
          solution = parameters.first;
          break;
        case 5:
          parameters = {
            first: applyMod(intCode, modParams[0], index + 1, relativeBase),
            second: applyMod(intCode, modParams[1], index + 2, relativeBase)
          };

          if (parameters.first !== 0) {
            index = parameters.second;
            loopLength = 0;
          } else {
            loopLength = 3;
          }
          break;
        case 6:
          parameters = {
            first: applyMod(intCode, modParams[0], index + 1, relativeBase),
            second: applyMod(intCode, modParams[1], index + 2, relativeBase)
          };

          if (parameters.first === 0) {
            index = parameters.second;
            loopLength = 0;
          } else {
            loopLength = 3;
          }
          break;
        case 7:
          parameters = {
            first: applyMod(intCode, modParams[0], index + 1, relativeBase),
            second: applyMod(intCode, modParams[1], index + 2, relativeBase),
            result: applyModWrite(
              intCode,
              modParams[2],
              index + 3,
              relativeBase
            )
          };

          intCode[parameters.result] =
            parameters.first < parameters.second ? 1 : 0;
          loopLength = 4;
          break;
        case 8:
          parameters = {
            first: applyMod(intCode, modParams[0], index + 1, relativeBase),
            second: applyMod(intCode, modParams[1], index + 2, relativeBase),
            result: applyModWrite(
              intCode,
              modParams[2],
              index + 3,
              relativeBase
            )
          };

          intCode[parameters.result] =
            parameters.first === parameters.second ? 1 : 0;
          loopLength = 4;
          break;

        default:
          console.log(`Operation code ${opCode} not valid!`);
          error = true;
          break;
      }
    }

    return { solution, opCode99Encountered };
  };
  const runAmpCtrlSoftware = (phase, inputSignal) =>
    intCodeComputer(input, inputSignal, phase);
  const initPhases = [5, 6, 7, 8, 9];
  const allPhases = perms(initPhases);
  // const signal = phases => {
  //   return phases.reduce(
  //     (prevOutput, phase) => runAmpCtrlSoftware(phase, prevOutput),
  //     0
  //   );
  // };
  // const allSignals = allPhases.map(phases => signal(phases));
  //
  // console.log(Math.max(...allSignals)); // Part 1

  const signal = phases => {
    let i = 0;
    let prevOutput = 0;
    let ampInput;
    const run = true;
    const l = phases.length;
    let phasesConsumed = false;
    while (run) {
      if (!phasesConsumed) {
        ampInput = phases[i];
      } else {
        ampInput = prevOutput;
      }
      const { solution, opCode99Encountered } = runAmpCtrlSoftware(
        ampInput,
        prevOutput
      );
      prevOutput = solution;
      if (i === 4) {
        phasesConsumed = true;
      }
      if (opCode99Encountered && i === 4) {
        break;
      }
      i = (i + 1) % l;
    }

    return prevOutput;
  };

  console.log(signal([9, 8, 7, 6, 5]));
});
