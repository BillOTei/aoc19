const fs = require("fs");

fs.readFile("./day8_input", "utf8", function(err, contents) {
  const width = 25;
  const height = 6;
  const step = width * height;
  const input = contents.match(new RegExp(".{1," + step + "}", "g"));

  // Part 1
  // const layersCount = input.length;
  // let zeros = 99999;
  // let r = 0;
  // input.forEach(l => {
  //   const count = (l.match(/0/g) || []).length;
  //   if (count <= zeros) {
  //     zeros = count;
  //     r = (l.match(/1/g) || []).length * (l.match(/2/g) || []).length
  //   }
  // });
  //
  // console.log(r);

  // Part 2
  let byPixels = [];
  for (let i = 0; i < step; i++) {
    byPixels.push([]);
  }
  input.forEach((l, lIdx) => {
    l.split("").forEach((p, pIdx) => {
      byPixels[pIdx][lIdx] = p;
    });
  });

  console.log(
    byPixels
      .map(pixels => {
        const [first0, first1] = [pixels.indexOf("0"), pixels.indexOf("1")];
        if (first1 === -1 && first0 === -1) return "2";
        else if (first1 !== -1 && first0 === -1) return "1";
        else if (first1 === -1 && first0 !== -1) return "0";

        return first0 < first1 ? "0" : first1 < first0 ? "1" : "2";
      })
      .join("")
      .match(/.{25}/g)
      .map(row =>
        row.split("").reduce((acc, p) => acc + (p === "0" ? " " : "."), " ")
      )
  );
});
