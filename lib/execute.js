const { exec } = require('child_process');
const child = exec(process.argv[2], { 
    detached: false, 
    shell: true, 
    maxBuffer: 15000 * 1024,
    cwd: '/home/' + process.env.USER
});

/** Child process stream hooks */
child.stdout.on('data', console.log);
child.stderr.on('data', console.log);
child.on('exit', (code, signal) => {
    console.log(`child process exited with code ${code} and signal ${signal}`);
    child = null;
});

/** Exit handler & cleanup */
const exitHandler = (options, exitCode) => {
    if (child) child.kill();
    if (options.exit) process.exit();
}

/** Executor process stream hooks */
process.on('exit', exitHandler.bind(null,{cleanup:true}));
process.on('SIGINT', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
