import {useEffect, useState, useCallback } from 'react';
import React from "react";
import Papa from 'papaparse';
import './index.css';
import {Button, Grid,  TextField, ButtonGroup} from '@material-ui/core';
import InputMatrix from './InputMatrix';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

function InputMatrixForm({onSubmit, inputMatrixSize, setInputMatrixSize})
{
  const [inputMatrix, setInputMatrix] = useState([
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]);
  const [matrixSizeInput, setMatrixSizeInput] = useState(3);
  const[shouldClearCells, setShouldClearCells] = useState(false);
  const [fileName, setFileName] = useState('No file chosen');
  
  const clearCells = useCallback(() => {
    if (shouldClearCells)
    {
      setShouldClearCells(false);
      setInputMatrix(Array.from({ length: inputMatrixSize }, () => Array.from({ length: inputMatrixSize }, 
                    () => 0)));
      console.log("clearing cells");
    }
  }, [inputMatrixSize, shouldClearCells]);
  
  useEffect(() => {clearCells()}, [clearCells]);  
  
  const handleSizeChange = () =>
  {
    const parsedMatrixSizeInput = Number(matrixSizeInput)
    if (!isNaN (parsedMatrixSizeInput) && Number.isInteger(parsedMatrixSizeInput) && 
       parsedMatrixSizeInput >= 2 && parsedMatrixSizeInput <= 10)
    {
      setInputMatrixSize(parsedMatrixSizeInput);
      
      if (parsedMatrixSizeInput !== inputMatrixSize)
      {
        setShouldClearCells(true);
      }

    }
    else{
      alert("Manual matrix size must be an integer in range [2,10]")
      
    }
  }

  const onClear = () =>
  {
    console.log("in onClear");
    setShouldClearCells(true);
  }
  
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    
    if (!file) {
      return;
    }

    if (file.type !== 'text/csv') {
      alert('Invalid file type. Please upload a CSV file.');
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
  
    reader.onload = function(e) {
      const contents = e.target.result;
      Papa.parse(contents, {
        complete: function(results) {
          let matrix = results.data.map(row => row.map(Number));
          matrix = matrix.filter(row => !(row.length === 1 && row[0] === 0));
          
          if (matrix.length !== matrix[0].length) {
            alert('Matrix must be square');
            return;
          }
          setShouldClearCells(false);
          setInputMatrixSize(matrix.length);
          setInputMatrix(matrix);
        }
      });
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ borderCollapse: 'collapse' }}>
    <Grid container direction='column' justifyContent="center" alignItems="center" spacing={1}>
      <form onSubmit={(e)=> onSubmit(e, inputMatrix)}>
        <Grid container direction='column' alignItems='center'spacing={1}>
          <Grid item>
            <InputMatrix matrix={inputMatrix} setMatrix={setInputMatrix} matrixSize={inputMatrixSize}/>
          </Grid>
          <Grid item>  
            <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group" 
                        size="small">
              <Button type="submit">Submit</Button>
              <Button type='button' onClick={onClear}>Clear</Button>
              <Button variant="contained" color="primary" component="label"  startIcon={<CloudUploadIcon />}>
                Upload CSV 
                <input 
                  id="file-upload" 
                  type="file" 
                  onChange={handleFileUpload} 
                  accept='.csv' 
                  style={{ display: 'none' }} 
                  />
              </Button>
            </ButtonGroup>
          </Grid>
        </Grid>
      </form>
      <Grid item>
        <Grid direction="row" container spacing={1} alignItems="center">
          <Grid item>
            <TextField 
              type="number" 
              step="1" 
              min={2} 
              max={10} 
              value={matrixSizeInput} 
              onChange={(e) => setMatrixSizeInput(e.target.value)} 
              variant="outlined"
              size="small"
              fontSize="small"
              style={{ width: '70px'}}
              />
          </Grid>
          <Grid item>
            <Button type="button" onClick={handleSizeChange} variant="contained" color="primary" size="small">
              Change Size
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  </div>
  );
}
export default InputMatrixForm;
