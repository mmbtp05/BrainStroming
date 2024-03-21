const {spawnSync} = require('child_process');
function testCppCode(userCode, input, expectedOutput, timeLimitMillis){
  console.log(userCode);
    // Step 1: Compilation
    const compileResult = spawnSync('g++', ['-o', 'compiled_code', '-x', 'c++', '-'], { input: userCode, encoding: 'utf-8' });
  
    if (compileResult.status !== 0) {
      console.error('Compilation Error:', compileResult.stderr);
      return 'Compilation Error';
    }
  
    // Step 2: Runtime Execution
    const executeCommand = `./compiled_code`;
    const executeResult = spawnSync(executeCommand, { input, encoding: 'utf-8', timeout: timeLimitMillis });
  
    if (executeResult.error && executeResult.error.code === 'ETIMEDOUT') {
      console.error('Time Limit Exceeded');
      return 'Time Limit Exceeded';
    } else if (executeResult.error) {
      // console.error('Runtime Error:', executeResult.error);
      console.log('Run Time Error');
      return 'Runtime Error';
    } else if (executeResult.status !== 0) {
      const runtimeErrorOutput = executeResult.stderr;
  
      if (runtimeErrorOutput.includes('Segmentation fault')) {
        console.error('Runtime Error: Segmentation fault');
      } else if (runtimeErrorOutput.includes('Floating point exception')) {
        console.error('Runtime Error: Floating point exception');
      } else {
        // console.error('Runtime Error:', runtimeErrorOutput);
        console.log('Run Time Error');
      }
  
      return 'Runtime Error';
    }
  
    // Step 3: Compare Output
    const actualOutput = executeResult.stdout;
    const actualOutputTrimmed = actualOutput.replace(/\s+/g, ' ').trim();
    const expectedOutputTrimmed = expectedOutput.replace(/\s+/g, ' ').trim();
    console.log(actualOutputTrimmed);
    console.log(actualOutputTrimmed);

    if (actualOutputTrimmed == expectedOutputTrimmed) {
      console.log('Accepted');
      return 'Accepted';
    } else {
      console.log('Wrong Answer');
      console.log(actualOutputTrimmed);
      console.log("actualOutput");
  
      console.log(expectedOutputTrimmed);
      return 'Wrong Answer';
    }
  }

module.exports={
    testCppCode
};