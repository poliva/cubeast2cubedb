chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  chrome.scripting.executeScript(
    {
      target: { tabId: tabs[0].id },
      function: () => {
        const scrambleElement = document.querySelector('.scramble');
        let solution = "";
        const table = document.querySelector(".clickable > tbody.ng-star-inserted")
        const rows = table.getElementsByTagName("tr");
        for (let i = 0; i < rows.length; i++) {
          const cells = rows[i].getElementsByTagName("td");
          for (let j = 0; j < cells.length; j+=2) {
            const comment = cells[j].textContent;
            let text = cells[j+1].textContent.replace("-"," ").trim();
            text=text.replace("U U ","U2 ");
            text=text.replace("D D ","D2 ");
            text=text.replace("L L ","L2 ");
            text=text.replace("R R ","R2 ");
            text=text.replace("F F ","F2 ");
            text=text.replace("B B ","B2 ");
            text=text.replace("U' U' ","U2' ");
            text=text.replace("D' D' ","D2' ");
            text=text.replace("L' L' ","L2' ");
            text=text.replace("R' R' ","R2' ");
            text=text.replace("F' F' ","F2' ");
            text=text.replace("B' B' ","B2' ");
            if (comment=="EOLL" || comment=="OLL") {
              // fix wide move in "hook" EOLL: f(R U R' U')f'
              text=text.replace("B U L U' L' B'","f R U R' U' f'");
              text=text.replace("R U B U' B' R'","l F U F' U' l'");
              text=text.replace("F U R U' R' F'","b L U L' U' b'");
              text=text.replace("L U F U' F' L'","r B U B' U' r'");
            }
            if (comment=="OCLL" || comment=="OLL") {
              // fix wide move in OLL-24 "Chamaleon" OCLL: r(U R' U')r' (F R F')
              text=text.replace("L F R' F' L' F R F'","r U R' U' r' F R F'");
              text=text.replace("B L F' L' B' L F L'","f U F' U' f' L F L'");
              text=text.replace("R B L' B' R' B L B'","l U L' U' l' B L B'");
              text=text.replace("F R B' R' F' R B R'","b U B' U' b' R B R'");
              // fix wide move in OLL-25 "Bowtie" OCLL: F' r(U R' U')r' F R
              text=text.replace("F' L F R' F' L' F R","F' r U R' U' r' F R");
              text=text.replace("L' B L F' L' B' L F","L' f U F' U' f' L F");
              text=text.replace("B' R B L' B' R' B L","B' l U L' U' l' B L");
              text=text.replace("R' F R B' R' F' R B","R' b U B' U' b' R B");
            }
            if (comment=="CPOLL" || comment=="PLL") {
              // fix x-rotation in Aa perm
              text=text.replace("R' F R' B2 R F' R' B2 R2","x R' U R' D2 R U' R' D2 R2 x'");
              text=text.replace("F' L F' R2 F L' F' R2 F2","z F' U F' D2 F U' F' D2 F2 z'");
              text=text.replace("L' B L' F2 L B' L' F2 L2","x' L' U L' D2 L U' L' D2 L2 x");
              text=text.replace("B' R B' L2 B R' B' L2 B2","z' B' U B' D2 B U' B' D2 B2 z");
              // fix U'+D rotation in Ga perm
              text=text.replace("E' F' U F","D U' R' U R");
              text=text.replace("E' L' U L","D U' F' U F");
              text=text.replace("E' B' U B","D U' L' U L");
              text=text.replace("E' R' U R","D U' B' U B");
              // fix wide f move in V perm:
              text=text.replace("B' R' D R2' D' R' D R' D' B","f' U' R U2 R' U' R U' R' f");
              text=text.replace("R' F' D F2' D' F' D F' D' R","l' U' F U2 F' U' F U' F' l");
              text=text.replace("F' L' D L2' D' L' D L' D' F","b' U' L U2 L' U' L U' L' b");
              text=text.replace("L' B' D B2' D' B' D B' D' L","r' U' B U2 B' U' B U' B' r");
            }
            if (text != "") solution+=text+" //"+comment+"%0A";
          }
        }
        if (scrambleElement) {
          return "scramble=" + scrambleElement.textContent + "&alg=" + solution;
        } else {
          return null;
        }
      },
    },
    (result) => {
      if (result[0] !== null) {
        const params = result[0].result;
        const url = `https://www.cubedb.net/?puzzle=3&crosscolor=white&${params}`;
        chrome.tabs.create({ url: url });
      } else {
        console.log('Scramble element not found');
      }
    }
  );
});
