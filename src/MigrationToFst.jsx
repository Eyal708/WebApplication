import {useState, useEffect, useRef} from 'react';
import React from "react";
import { ClipLoader } from "react-spinners";
import {Button, Grid} from '@material-ui/core';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import usePythonRunner from './pythonRunner';
import Papa from 'papaparse';
import InputMatrixForm from './InputMatrixForm';
import OutputMatrix from './OutputMatrix'
import './index.css';


export default function MigrationToFst({isPyodideLoaded, pythonScript}) {
  const [submittedMatrix, setSubmittedMatrix] = useState('');
  const [outputMatrix, setOutputMatrix] = useState('');
  const [margin, setMargin] = useState('100px');
  const [loadOutputMatrix, setLoadOutputMatrix] = useState(true);
  const[inputMatrixSize, setInputMatrixSize] = useState(3);
  const [inputMatrixType, setInputMatrixType] = useState('Migration');
  const [isIndirectMigration, setIsIndirectMigration] = useState(false);
  const outputRef = useRef(null); // Create a ref for the output matrix

  useEffect(() => {
    if (outputMatrix) {
      outputRef.current.scrollIntoView({ behavior: 'smooth' }); // Scroll to the output matrix when it's displayed
    }
  }, [outputMatrix]);

  useEffect(() => {
    setLoadOutputMatrix(false);
    setMargin((inputMatrixSize * 50) / 2 + 70);
    setLoadOutputMatrix(true);
}, [inputMatrixSize]);

  
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
    </div>;
  
  const displayOutputMatrix = 
  <Grid container direction='column' spacing={1}
        style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', 
        marginTop: "2rem"}}>
        <Grid item ref={outputRef} style={{ borderCollapse: 'collapse', margin: '0 auto'}}>
            <OutputMatrix  outputMatrix={outputMatrix} matrixSize={submittedMatrix.length} /> 
        </Grid>
        <Grid item>
            {submittedMatrix && <Button type='button' onClick={downloadOutputMatrix} variant='contained' 
                                size="small" startIcon={<CloudDownloadIcon/>} color="primary" component="label">
            Download CSV
            </Button>}
       </Grid>
  </Grid>;
  
  const displayOutput = (!outputMatrix && submittedMatrix) ? displayCalculatingMatrix: displayOutputMatrix;
  
  return (
    <Grid container direction="column" justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
      <Grid item>
        <InputMatrixForm onSubmit={onSubmit} inputMatrixSize={inputMatrixSize} 
                        setInputMatrixSize={setInputMatrixSize}/>
      </Grid>
        {loadOutputMatrix && <Grid item style={{ position: 'absolute', top: `calc(50% + ${margin}px)`, 
        width: '100%' }}>{displayOutput}
      </Grid>}
    </Grid>
  );
}
