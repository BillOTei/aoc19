const fs = require("fs");

fs.readFile("./day13_input", "utf8", function(err, contents) {
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

  const outputToTile = output => {
    switch (output) {
      case 0:
        return " ";
      case 1:
        return "|";
      case 2:
        return "#";
      case 3:
        return "_";
      case 4:
        return "O";
      default:
        return "error";
    }
  };

  const intCodeComputer = (input, userInput = [], cache) => {
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
          if (userInput.length === 0) {
            cache.saveCache(intCode, opCode, index, relativeBase);
            waiting = true;
          } else {
            const position = applyModWrite(
              intCode,
              modParams[0],
              index + 1,
              relativeBase
            );
            intCode[position] = userInput.shift();
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

  let arcadeCabinet = {
    intCode: input,
    opCode: 0,
    position: 0,
    relativeBase: 0,
    output: [],
    halt: function(opCode, input) {
      if (opCode === 99) return true;
      if (opCode === 3 && input === undefined) return true;
      return opCode === 4 && this.output.length > 2;
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

  let blocksCount = 0;
  let screen = [];
  while (arcadeCabinet.opCode !== 99) {
    arcadeCabinet = intCodeComputer(arcadeCabinet.intCode, [], arcadeCabinet);
    if (
      arcadeCabinet.opCode !== 99 &&
      arcadeCabinet.opCode !== 3 &&
      arcadeCabinet.output.length > 2
    ) {
      if (arcadeCabinet.output[2] === 2) blocksCount += 1;
      if (!screen[arcadeCabinet.output[1]]) {
        screen[arcadeCabinet.output[1]] = [];
      }
      screen[arcadeCabinet.output[1]][arcadeCabinet.output[0]] = outputToTile(
        arcadeCabinet.output[2]
      );

      arcadeCabinet.resetOutput();
    }
  }

  console.log(blocksCount);
});
