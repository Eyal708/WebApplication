import { useEffect, useState } from 'react';

function usePythonRunner(inputMatrix, setOutputMatrix ,setIsPythonRunnerDone, inputMatrixType) {
  const [pyodideLoaded, setPyodideLoaded] = useState(false);
  const [resultMatrix, setResultMatrix] = useState('');
  const [pythonScript, setPythonScript] = useState('');

  useEffect(() => {
    const loadPyodideAndPackages = async () => {
      window.pyodide = await window.loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.18.1/full/'});
      await window.pyodide.loadPackage('numpy');
      await window.pyodide.loadPackage('scipy');
      const response = await fetch('/pythonCode.py');
      const loadedScript = await response.text();
      setPythonScript(loadedScript);
      setPyodideLoaded(true);
    };
    
    if (!pyodideLoaded) {
        loadPyodideAndPackages();
    }
}, [pyodideLoaded]);

    useEffect(() => {
        if (pyodideLoaded) {
            //Pyodide packages and python script are loaded
            const runPythonCode = async () => {
            // Define Python code

            const functionToRun = inputMatrixType === "Migration"? "transform_m_to_f" : "transform_f_to_m";
            const pythonCode = `
${pythonScript}
matrixJson = '${JSON.stringify(inputMatrix)}'
print("I'm here")
result = ${functionToRun}(matrixJson)
result
                            `;
            // Run Python code in Pyodide
            const result = JSON.parse(await window.pyodide.runPythonAsync(pythonCode.trim()));
            setResultMatrix(result.matrix);
            setOutputMatrix(result.matrix);
            console.log("This is the result matrix:")
            console.log(resultMatrix);
            };

            runPythonCode();
            setIsPythonRunnerDone(true);
        }
    }, [pyodideLoaded, inputMatrix, pythonScript]);
    
}
export default usePythonRunner;
