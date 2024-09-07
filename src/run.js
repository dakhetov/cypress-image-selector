const path = require('path');

(async () => {
    const { PythonShell } = require('python-shell');
    //you can use error handling to see if there are any errors
    const result = await PythonShell.run(
        path.join(__dirname, 'searchImage.py'),
        {
            args: [
                process.env.innerImagePath,
                process.env.outerImagePath,
                process.env.viewportWidth,
                process.env.viewportHeight,
            ],
        }
    );
    console.log(result);
    //return JSON.stringify(result);
})();
