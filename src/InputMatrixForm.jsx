import {useEffect, useState, useCallback } from 'react';
import React from "react";
import Papa from 'papaparse';
import './index.css';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import {Button, Grid,  TextField, ButtonGroup} from '@material-ui/core';
import InputMatrix from './InputMatrix';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { makeStyles } from '@material-ui/core/styles';
import { Tooltip, IconButton} from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import PlayIcon from '@mui/icons-material/PlayCircle';
import ClearIcon from '@mui/icons-material/Clear';
import ChangeIcon from '@mui/icons-material/ChangeCircle';
import { Typography } from '@material-ui/core';
import { buttonStyle, manualInputInfo } from './constants';

function InputMatrixForm({onSubmit, inputMatrixSize, setInputMatrixSize, isFst, multipleRuns, setMultipleRuns,
                          numRuns, setNumRuns})
{
  const [inputMatrix, setInputMatrix] = useState([
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]);
  const [matrixSizeInput, setMatrixSizeInput] = useState(3);
  const[shouldClearCells, setShouldClearCells] = useState(false);
  const [fileName, setFileName] = useState('No file chosen');
  const handleMultipleRunsChange = (event) => {
    setMultipleRuns(event.target.checked);
  };
  
  const handleNumRunsChange = (event) => {
    const value = event.target.value;
    if (value >= 2 && value <= 50) {
      setNumRuns(value);
    }
  };
  const useStyles = makeStyles({
    button: buttonStyle,
    checkboxLabel: {fontSize: '2.5vmin', paddingLeft: '1vw'},
  });

  const classes = useStyles();
  
  const clearCells = useCallback(() => {
    if (shouldClearCells && inputMatrixSize <= 10)
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
          // check if matrix size is 2 or more
          if (matrix.length < 2) {
            alert('Matrix size must be at least 2');
            return;
          }
          setFileName(file.name);
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
      <Grid container direction='column' justifyContent="center" alignItems="center">
        <form onSubmit={(e)=> onSubmit(e, inputMatrix)}> 
          <Grid container direction='column' alignItems='center' spacing={1}>
            <Grid item> 
              {inputMatrixSize <=10 ? <InputMatrix matrix={inputMatrix} setMatrix={setInputMatrix}  
                matrixSize={inputMatrixSize} isFst = {isFst}/> : 
                <Typography style = {{fontSize:"3vmin"}}> Uploaded file {fileName} </Typography>}
            </Grid>
            <Grid item style = {{marginTop:"0.5vmin"}}>  
              <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group" 
                size="small">
                <Button Button className={classes.button} type="submit" startIcon={<PlayIcon 
                        style={{ fontSize: '3vmin' }} />}>Run</Button>
                <Button Button className={classes.button} type='button' startIcon = {<ClearIcon
                        style={{ fontSize: '3vmin' }}/>} 
                  onClick={onClear}>Clear</Button>
                <Button Button className={classes.button} variant="contained" color="primary" 
                        component="label" startIcon={<CloudUploadIcon 
                        style={{ fontSize: '3vmin' }}/>}>
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
        <Grid item style = {{marginTop:"1vmin"}}>
          <Grid container direction="row" justify="space-between" alignItems="flex-end">
          {isFst && (<FormControlLabel
                  control={
                    <Checkbox className={classes.button}
                      checked={multipleRuns}
                      onChange={handleMultipleRunsChange}
                      name="multipleRuns"
                      color="primary"
                      style={{ border: 'none', marginLeft: '1.3vw', size: 'medium' }}
                    />
                  }
                  label="Multiple Runs"
                  classes={{ label: classes.checkboxLabel }}
                  
                />)}
          {multipleRuns && (
              <TextField
                label=""
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value={numRuns}
                style={{ width: '5.5vw'}}
                inputProps={{ 
                  style: { fontSize: '3vmin', height:'1vh', textAlign: 'center', padding: '2vmin'}
                }}
                onChange={handleNumRunsChange}
              />
            )}
        </Grid>
        <Grid item style = {{marginTop:"1vmin"}}>
          <Grid direction="row" container spacing='8vmin' alignItems="center">
              <Grid item>
                <Tooltip title={
                  <Typography style = {{fontSize:"2vmin"}}>
                      {manualInputInfo}
                  </Typography>
                }>
                  <IconButton>
                    <InfoOutlinedIcon style={{ fontSize: '4vmin' }} />
                  </IconButton>
              </Tooltip>  
            </Grid>
            <Grid item style={{ marginLeft: '0vw' }}>
              <Button className={classes.button} type="button" onClick={handleSizeChange} variant="contained"
                      startIcon = {<ChangeIcon style={{ fontSize: '3vmin' }}/>}  color="primary">
                Change Size
              </Button>
            </Grid>
            <Grid item style={{ marginLeft: '2vmin' }}>
              <TextField 
                type="number" 
                step="1" 
                min={2} 
                max={10} 
                value={matrixSizeInput} 
                onBlur={(e) => {
                  const newValue = e.target.value;
                  if (newValue < 2) {
                    setMatrixSizeInput(2); // Reset to minimum value or any default value
                  }
                  if (newValue > 10) {
                    setMatrixSizeInput(10); // Reset to maximum value
                  }
                }} 
                onChange={(e) => setMatrixSizeInput(e.target.value)} 
                variant="outlined"
                style={{ width: '5.5vw'}}
                inputProps={{ 
                  style: { fontSize: '3vmin', height:'1vh', textAlign: 'center', padding: '2vmin'}
                }}
                />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  </div>
  );
}
export default InputMatrixForm;
