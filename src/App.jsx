import {useState} from 'react';
import React from "react";
import { ClipLoader } from "react-spinners";
import {Button, Grid,  TextField, ButtonGroup} from '@material-ui/core';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import usePythonRunner from './pythonRunner';
import Papa from 'papaparse';
import InputMatrixForm from './InputMatrixForm';
import OutputMatrix from './OutputMatrix'
import './index.css';


export default function Game({isPyodideLoaded, pythonScript}) {
  const [submittedMatrix, setSubmittedMatrix] = useState('');
  const [outputMatrix, setOutputMatrix] = useState('');
  const [inputMatrixType, setInputMatrixType] = useState('Migration');
  const[inputMatrixSize, setInputMatrixSize] = useState(3);
  // const [isPythonRunnerDone, setIsPythonRunnerDone] = useState(false); 
  const [isIndirectMigration, setIsIndirectMigration] = useState(false);
  
  usePythonRunner(submittedMatrix, setOutputMatrix, inputMatrixType, isIndirectMigration, 
                isPyodideLoaded, pythonScript);

  
  const onSubmit = (event, matrix) =>
  {
    event.preventDefault();
    setOutputMatrix('');
    console.log(matrix);
    const newMatrix = matrix.map(row=>[...row]);
    setSubmittedMatrix(newMatrix);
    
  }
  
  const handleDropdownChange = (e) => {
      setInputMatrixType(e.target.value);
    }
  
    const handleIndirectChange = (event) => {
    setIsIndirectMigration(event.target.value === 'Indirect');
  };
    
  const downloadOutputMatrix = () => {
    const csv = Papa.unparse(outputMatrix);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'output_matrix.csv';
    link.href = url;
    link.click();
  }
    
  const displayCalculatingMatrix = 
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <ClipLoader color={"#123abc"} loading={true} size={50} />
      <p style={{ marginTop: '10px' }}>Calculating Matrix...</p>
    </div>;
  
  const displayOutputMatrix = 
  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2>Output Matrix</h2>
      <div style={{ borderCollapse: 'collapse', margin: '0 auto' }}>
        <OutputMatrix  outputMatrix={outputMatrix} matrixSize={submittedMatrix.length} /> 
        {submittedMatrix && <Button type='button' onClick={downloadOutputMatrix} variant='contained' 
                            size="small" startIcon={<CloudDownloadIcon/>} color="primary" component="label">
        Download CSV
        </Button>}
      </div>
  </div>;
  
  
  const displayOutput = (!outputMatrix && submittedMatrix) ? displayCalculatingMatrix: displayOutputMatrix;
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center',
       justifyContent: 'center', width: '500px' }}>
      
      <h4>Matrix Type</h4>
      <select value={inputMatrixType} onChange={handleDropdownChange} style={{ marginLeft: '10px' }}>
      <option value="Fst">Fst</option>
      <option value="Migration">Migration</option>
      </select>
      
      {inputMatrixType === 'Fst' && (
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: '10px' }}> 
      <h4>Inference Method</h4>
      <input type="radio" id="direct" name="method" value="Direct" checked={!isIndirectMigration}
       onChange={handleIndirectChange} /> 
      <label for="direct">Direct</label>
      <input type="radio" id="indirect" name="method" value="Indirect" checked={isIndirectMigration} 
      onChange={handleIndirectChange} />
      <label for="indirect">Indirect</label>
      </div>)}
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', width: '500px', alignItems: 'center' }}>
        <div style={{ borderCollapse: 'collapse' }}>
          <InputMatrixForm onSubmit={onSubmit} inputMatrixSize={inputMatrixSize} 
                          setInputMatrixSize={setInputMatrixSize}/>
        </div>
      </div>
      {displayOutput};
    </div>
  );
    
}