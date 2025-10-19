//core module
const path = require('path')


module.exports =   path.dirname(require.main.filename)


/*
res.sendFile("/Users/rohit/project/views/addHome.html");  // works
But if you hardcode it like this, it will only work on your machine.
On Windows or another folder, the path is different.

That’s why we use Node’s built-in path module, which automatically builds the correct path for any OS.
In every Node.js file, __dirname means “the folder where this file lives”.

*/