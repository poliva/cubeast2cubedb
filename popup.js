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
            const text = cells[j+1].textContent.replace("-"," ").trim();
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
        const url = `https://www.cubedb.net/?puzzle=3&${params}`;
        chrome.tabs.create({ url: url });
      } else {
        console.log('Scramble element not found');
      }
    }
  );
});
