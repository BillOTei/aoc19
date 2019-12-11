const fs = require("fs");

fs.readFile("./day8_input", "utf8", function(err, contents) {
  const width = 25;
  const height = 6;
  const step = width * height;
  const input = contents.match(new RegExp(".{1," + step + "}", "g"));

  let zeros = 99999;
  let r = 0;
  input.forEach(l => {
    const count = (l.match(/0/g) || []).length;
    if (count <= zeros) {
      zeros = count;
      r = (l.match(/1/g) || []).length * (l.match(/2/g) || []).length
    }
  });

  console.log(r);
});
