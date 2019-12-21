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

  const intCodeComputer = (input, userInput, cache) => {
    const intCode = [...input];
    let loopLength = 1;
    let relativeBase = cache !== undefined ? cache.relativeBase : 0;
    let parameters = {};
    let error = false;
    let waiting = false;

    for (
      let index = cache !== undefined ? cache.position : 0;
      index < intCode.length && !error && !waiting;
      index += loopLength
    ) {
      const operation = getOpCodeAndMode(intCode[index].toString());
      const opCode = parseInt(operation[0]);
      if (opCode === 99) {
        cache.saveCache(intCode, opCode, index, relativeBase);
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
          loopLength = 2;
          if (userInput === undefined) {
            if (cache.halt(opCode, userInput)) {
              cache.saveCache(
                intCode,
                opCode,
                index + loopLength,
                relativeBase
              );
              waiting = true;
            } else {
              intCode[
                applyModWrite(intCode, modParams[0], index + 1, relativeBase)
              ] = userInput;
            }
          } else {
            intCode[
              applyModWrite(intCode, modParams[0], index + 1, relativeBase)
            ] = userInput;
          }
          break;
        case 4:
          parameters = {
            first: applyMod(intCode, modParams[0], index + 1, relativeBase)
          };

          loopLength = 2;
          cache.output.push(parameters.first);
          if (cache.halt(opCode, userInput)) {
            cache.saveCache(intCode, opCode, index + loopLength, relativeBase);
            waiting = true;
          }
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

    return cache;
  };

  let hullPaintingRobot = {
    intCode: input,
    opCode: 0,
    position: 0,
    relativeBase: 0,
    output: [],
    halt: function(opCode, input) {
      if (opCode === 99) return true;
      if (opCode === 3 && input === undefined) return true;
      return opCode === 4 && this.output.length > 1;
    },
    saveCache: function(intCode, opCode, position, relativeBase) {
      this.intCode = intCode;
      this.opCode = opCode;
      this.position = position;
      this.relativeBase = relativeBase;
    },
    resetOutput: function() {
      this.output = [];
    }
  };
  let colorsMap = new Map();
  let point = [0, 0];
  const setPoint = p => colorsMap.set(p.join(), { color: 0, paintsCount: 0 });
  setPoint(point);
  let direction = "up";
  const nextPoint = (currDirection, directionCommand, current) => {
    switch (currDirection) {
      case "up":
        return directionCommand === 0
          ? [[current[0] - 1, current[1]], "left"]
          : [[current[0] + 1, current[1]], "right"];
      case "left":
        return directionCommand === 0
          ? [[current[0], current[1] - 1], "down"]
          : [[current[0], current[1] + 1], "up"];
      case "down":
        return directionCommand === 0
          ? [[current[0] + 1, current[1]], "right"]
          : [[current[0] - 1, current[1]], "left"];
      case "right":
        return directionCommand === 0
          ? [[current[0], current[1] + 1], "up"]
          : [[current[0], current[1] - 1], "down"];
    }
  };

  while (hullPaintingRobot.opCode !== 99) {
    const currPoint = colorsMap.get(point.join());
    hullPaintingRobot = intCodeComputer(
      hullPaintingRobot.intCode,
      currPoint.color,
      hullPaintingRobot
    );
    if (
      hullPaintingRobot.opCode !== 99 &&
      hullPaintingRobot.opCode !== 3 &&
      hullPaintingRobot.output.length > 1
    ) {
      colorsMap.set(point.join(), {
        color: hullPaintingRobot.output[0],
        paintsCount: currPoint.paintsCount + 1
      });
      [point, direction] = nextPoint(
        direction,
        hullPaintingRobot.output[1],
        point
      );
      !colorsMap.has(point.join()) && setPoint(point);
      hullPaintingRobot.resetOutput();
    }
  }

  console.log(colorsMap.size); // Part 1
});
