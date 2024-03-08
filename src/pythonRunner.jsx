import { useEffect, useState } from 'react';
function usePythonRunner(inputMatrix, setOutputMatrix, inputMatrixType,
    isIndirectMigration, isPyodideLoaded, pythonScript) {
  const [resultMatrix, setResultMatrix] = useState('');
  useEffect(() => {
    if (isPyodideLoaded && typeof pythonScript === 'string' && pythonScript.length > 0){
            //Pyodide packages and python script are loaded, so we can run the python code.
            const runPythonCode = async () => {
            // Define Python code
            const matrixJson = JSON.stringify(inputMatrix);
            const pythonBool = !isIndirectMigration ? "True" : "False";
            const functionToRun = inputMatrixType === "Migration"? `transform_m_to_f('${matrixJson}')` : 
                                    `transform_f_to_m('${matrixJson}', ${pythonBool})`;
            const pythonCode = `
${pythonScript}
print("I'm here")
result = ${functionToRun}
result
                            `;
            // Run Python code in Pyodide
            const result = JSON.parse(await window.pyodide.runPythonAsync(pythonCode.trim()));
            setResultMatrix(result.matrix);
            setOutputMatrix(result.matrix);
            console.log("This is the result matrix:")
            console.log(resultMatrix);
            };

            if (inputMatrix) {
                runPythonCode();
            }
            // setIsPythonRunnerDone(true);
        }
    }, [isPyodideLoaded, inputMatrix, pythonScript]);
    
 }
export default usePythonRunner;