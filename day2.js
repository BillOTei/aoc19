const fs = require("fs");

fs.readFile("./day2_input", "utf8", function(err, contents) {
  let program = contents.split(",");
  const l = program.length;
  let i = 0;
  while (i < l) {
    const op = parseInt(program[i], 10);
    if (op === 99) break;
    const input1 = parseInt(program[i + 1], 10);
    const input2 = parseInt(program[i + 2], 10);
    const pos = parseInt(program[i + 3], 10);
    program[pos] =
      op === 1
        ? parseInt(program[input1], 10) + parseInt(program[input2], 10)
        : parseInt(program[input1], 10) * parseInt(program[input2], 10);
    i = i + 4;
  }

  console.log(program[0]);
});
