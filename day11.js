const fs = require("fs");

fs.readFile("./day11_input", "utf8", function(err, contents) {
  const input = contents.split(",").map(x => parseInt(x, 10));

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

  const intCodeComputer = (input, userInput = 0) => {
    const intCode = [...input];
    let loopLength = 1;
    let solution = [];
    let relativeBase = 0;
    let parameters = {};
    let error = false;

    for (let index = 0; index < intCode.length && !error; index += loopLength) {
      const operation = getOpCodeAndMode(intCode[index].toString());
      const opCode = parseInt(operation[0]);
      if (opCode === 99) {
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
          intCode[
            applyModWrite(intCode, modParams[0], index + 1, relativeBase)
          ] = userInput;
          loopLength = 2;
          break;
        case 4:
          parameters = {
            first: applyMod(intCode, modParams[0], index + 1, relativeBase)
          };

          solution.push(parameters.first);
          loopLength = 2;
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
        case 9:
          parameters = {
            first: applyMod(intCode, modParams[0], index + 1, relativeBase)
          };

          relativeBase += parameters.first;
          loopLength = 2;
          break;

        default:
          console.log(`Operation code ${opCode} not valid!`);
          error = true;
          break;
      }
    }

    return solution;
  };

  let colorsMap = new Map();
  let point = [0, 0];
  colorsMap.set(point.join(), { color: 0, paintsCount: 0 });
  let run = true;
  let direction = "up";
  const nextPoint = (currDirection, directionCommand, current) => {
    switch (currDirection) {
      case "up":
        return directionCommand === 0
          ? [current[0] - 1, current[1]]
          : [current[0] + 1, current[1]];
      case "left":
        return directionCommand === 0
          ? [current[0], current[1] - 1]
          : [current[0], current[1] + 1];
      case "down":
        return directionCommand === 0
          ? [current[0] + 1, current[1]]
          : [current[0] - 1, current[1]];
      case "right":
        return directionCommand === 0
          ? [current[0], current[1] + 1]
          : [current[0], current[1] - 1];
    }
  };
  let expectedOutputNb = 1;
  let color;
  while (run) {
    const currPoint = colorsMap.get(point.join());
    if (expectedOutputNb === 1) {
      color = intCodeComputer(input, currPoint.color);
      colorsMap.set(point.join(), {
        color,
        paintsCount: currPoint.paintsCount + 1
      });
      expectedOutputNb = 2;
    } else {
    }
  }

  console.log(intCodeComputer(input, 2));
});
