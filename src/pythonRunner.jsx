import { useEffect, useState } from 'react';

function usePythonRunner(inputMatrix, setOutputMatrix, inputMatrixType,
    isIndirectMigration, isPyodideLoaded, pythonScript, setResultMatrices, multipleRuns, numRuns) {
  const [resultMatrix, setResultMatrix] = useState('');
  useEffect(() => {
    if (isPyodideLoaded && typeof pythonScript === 'string' && pythonScript.length > 0){
            //Pyodide packages and python script are loaded, so we can run the python code.
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
                if (multipleRuns) {
                    const resultMatrices = [];
                    for (let i = 0; i < numRuns; i++) {
                        const result = JSON.parse(await window.pyodide.runPythonAsync(pythonCode.trim()));
                        resultMatrices.push(result.matrix);
                    }
                    setResultMatrices(resultMatrices);
                }
                else {
                    const result = JSON.parse(await window.pyodide.runPythonAsync(pythonCode.trim()));
                    setResultMatrix(result.matrix);
                    setOutputMatrix(result.matrix);
                    console.log("This is the result matrix:")
                    console.log(resultMatrix);
                    };
                }

            if (inputMatrix) {
                runPythonCode();
            }
        }
    }, [isPyodideLoaded, inputMatrix, pythonScript]);
    
 }
export default usePythonRunner;