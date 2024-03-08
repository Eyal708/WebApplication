import { useEffect, useState } from 'react';

export default function usePyodideLoader(setPythonScript, setPyodideLoaded) {
  useEffect(() => {
    const loadPyodideAndPackages = async () => {
      window.pyodide = await window.loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.18.1/full/'});
      await window.pyodide.loadPackage('numpy');
      await window.pyodide.loadPackage('scipy');
      await window.pyodide.loadPackage('micropip');
      await window.pyodide.runPythonAsync(`
import micropip
await micropip.install('population_structure')
      `);
      setPyodideLoaded(true);
      const response = await fetch('/pythonCode.py');
      console.log("Response:", response);
      const loadedScript = await response.text();
      console.log("Loaded script:", loadedScript);
      setPythonScript(String(loadedScript));
    };
    loadPyodideAndPackages();
  }, []);
  
}