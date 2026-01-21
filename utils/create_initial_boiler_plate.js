//Purpose : Return Initial HTML of the page;

const generateBoilerPlate = (files, prefix = '') => {
  const dynamicPath = prefix ? `/view/${prefix}` : `/view`
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>My Files</h1>
    <ul>
       ${files
         .map(
           (file) => `
        <li style="cursor: pointer; font-weight: bold; font-size: 20px;">
         <a href="${dynamicPath}/${file}" style="text-decoration: none;">${file}</a>
        </li>
        `
         )
         .join('')}
    </ul>
</body>
</html>`
}
export default generateBoilerPlate
