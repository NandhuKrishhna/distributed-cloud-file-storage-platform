//Purpose : Return Initial HTML of the page;

const generateBoilerPlate = (files, prefix = '') => {
  console.log("Files", files)

  const dynamicPath = prefix ? `/view/${prefix}` : `/view`
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>File Manager</title>
</head>
<body>
    <h1>My Files</h1>
    <ul>
       ${files
         .map(
           (file) => `
         <li style="margin-bottom: 10px; font-family: sans-serif;">
          <span style="font-weight: bold; font-size: 18px;">${file.name}</span>
          <a href="${dynamicPath}/${file.name}" style="margin-left: 10px;">Open</a>
          ${!file.isDirectory() ? `<a href="${dynamicPath}/${file.name}?download=true" style="margin-left: 10px; color: green;">Download</a>` : ''}
         </li>`
         )
         .join('')}
    </ul>
</body>
</html>`
}
export default generateBoilerPlate
