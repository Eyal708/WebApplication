import { useEffect, useState } from 'react';
import {useScript} from 'usehooks-ts'

export default function usePyodideLoader(setPythonScript, setPyodideLoaded) {
  const [pyodide, setPyodide] = useState(null);
  const pyodideStatus = useScript("https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js", {
    removeOnUnmount: false,
  })

  // load python packages and script when pyodide is ready
  useEffect(() => {
    const loadPyodideAndPackages = async () => {
      if (pyodideStatus !== 'ready') return; // Check pyodideAvailable
      const indexUrl = `https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js`;
      const loadedPyodide = await globalThis.loadPyodide({indexUrl});
      setPyodide(loadedPyodide);
      await loadedPyodide.loadPackage(['numpy', 'scipy', 'micropip']);
      await loadedPyodide.runPythonAsync(`
import micropip
await micropip.install('population_structure')
import population_structure
import numpy
import scipy
print("Installed population_structure package, version: " + population_structure.__version__)
print("Installed numpy package, version: " + numpy.__version__)
print("Installed scipy package, version: " + scipy.__version__)
      `);
      setPyodideLoaded(true);
      const response = await fetch('/pythonCode.py');
      const loadedScript = await response.text();
      setPythonScript(String(loadedScript));
    };
    loadPyodideAndPackages();
  }, [pyodideStatus]);

  return pyodide;
}