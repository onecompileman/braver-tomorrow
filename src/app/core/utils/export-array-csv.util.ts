export function exportArrayCSV(arrObj, fileName) {
  const headers = Object.keys(arrObj[0]).filter(
    (key) =>
      typeof arrObj[0][key] == 'string' || typeof arrObj[0][key] == 'number'
  );
  let rows = arrObj.map((obj) =>
    headers.map((header) =>
      (obj[header] || '')
        .toString()
        .replace(/,/g, '')
        .replace(/(\r\n|\n|\r)/gm, '')
    )
  );
  console.log(rows);
  rows = [headers, ...rows];

  console.log(rows.map((e) => e.join(',')).join('\r\n'));

  const csvContent = rows.map((e) => e.join(',')).join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });

  const encodedUri = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', fileName);
  document.body.appendChild(link); // Required for FF

  link.click();
}
