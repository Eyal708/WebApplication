async function pythonRunner(inputMatrix, inputMatrixType, isIndirectMigration, pythonScript, pyodide, 
                      multipleRuns, numRuns) {
  
  const runPythonCode = async () => {
    const matrixJson = JSON.stringify(inputMatrix);
    const pythonBool = !isIndirectMigration ? "True" : "False";
    const functionToRun = inputMatrixType === "Migration"? `transform_m_to_f('${matrixJson}')` : 
                            `transform_f_to_m('${matrixJson}', ${pythonBool})`;
const pythonCode = `
${pythonScript}
result = ${functionToRun}
result
`;
                // Run Python code in Pyodide
                try {
                    if (multipleRuns) {
                        const resultMatrices = [];
                        for (let i = 0; i < numRuns; i++) {
                            const result = JSON.parse(await pyodide.runPythonAsync(pythonCode.trim()));
                            resultMatrices.push(result.matrix);
                        }
                        return resultMatrices;
                    }
                    else {
                        const result = JSON.parse(await pyodide.runPythonAsync(pythonCode.trim()));
                        return result.matrix;
                        };
                } catch (error) {
                    return undefined;
                
                }
    }

    if (inputMatrix) {
        return await runPythonCode();
    }
}
        