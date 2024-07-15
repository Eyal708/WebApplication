
importScripts("pythonRunner.js");
importScripts("https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js");

let pyodideReady = (async () => {
    self.pyodide = await loadPyodide();
    await self.pyodide.loadPackage(['numpy', 'scipy', 'micropip']);
    await self.pyodide.runPythonAsync(`
  import micropip
  await micropip.install('population_structure')
  import population_structure
  import numpy
  import scipy
  print("Installed population_structure package, version: " + population_structure.__version__)
  print("Installed numpy package, version: " + numpy.__version__)
  print("Installed scipy package, version: " + scipy.__version__)
      `); 
      // Fetch and store the Python script
      const response = await fetch('/pythonCode.py');
      pythonScript = await response.text();
  })();
  
  self.onmessage = async (e) => {
    await pyodideReady; // Wait for Pyodide to be ready
    const request = e.data;
    const result = await pythonRunner(request.inputMatrix, request.inputMatrixType, 
                                      request.isIndirectMigration, pythonScript, pyodide, 
                                      request.multipleRuns, request.numRuns);
    const request_id = request.request_id;
    self.postMessage({ request_id, result });
  };