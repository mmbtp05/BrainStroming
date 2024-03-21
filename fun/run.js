const { spawn } = require('child_process');

function runCppCode(code, input, expectedOutput, timeLimitMillis) {
    return new Promise((resolve, reject) => {
        // Compile the C++ code
        const compileProcess = spawn('g++', ['-o', 'compiled_code', '-x', 'c++', '-']);
        let compileError = '';

        compileProcess.stderr.on('data', (data) => {
            compileError += data.toString();
        });

        compileProcess.on('close', (code) => {
            if (code !== 0) {
                reject(`Compilation error: ${compileError}`);
                return;
            }

            // Run the compiled program with input
            const executeProcess = spawn('./compiled_code', { timeout: timeLimitMillis });
            let programOutput = '';

            executeProcess.stdout.on('data', (data) => {
                programOutput += data.toString();
            });

            executeProcess.stderr.on('data', (data) => {
                reject(`Runtime error: ${data.toString()}`);
            });

            executeProcess.on('close', () => {
                // Compare output with expected output
                if (programOutput.trim() === expectedOutput.trim()) {
                    resolve('Accepted');
                } else {
                    reject('Wrong Answer');
                }
            });

            // Provide input to the program
            if (typeof input === 'string') {
                executeProcess.stdin.write(input);
            }
            executeProcess.stdin.end();
        });

        // Provide the C++ code to compile
        compileProcess.stdin.write(code);
        compileProcess.stdin.end();
    });
}
const cppCode = `
#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    cout << a + b << endl;
    return 0;
}`;

const input = '2 3\n';
const expectedOutput = '5\n';
const timeLimitMillis = 1000; // Time limit in milliseconds

runCppCode(cppCode, input, expectedOutput, timeLimitMillis)
    .then(result => console.log(result))
    .catch(error => console.error(error));


// Example usage:
