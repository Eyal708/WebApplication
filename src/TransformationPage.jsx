import {useState, useEffect, useRef} from 'react';
import React from "react";
import {Grid} from '@material-ui/core';
import Button from '@mui/material/Button';
import CloudDownloadIcon from '@mui/icons-material/Download';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import ReportIcon from '@mui/icons-material/Report';
import SideMenu from './SideMenu';
import Papa from 'papaparse';
import JSZip from 'jszip';
import InputMatrixForm from './InputMatrixForm';
import OutputMatrix from './OutputMatrix'
import './index.css';
import {buttonStyle, CLIP_LOADER} from './constants';
import LogoHeader from './LogoHeader';
import ExplanationCard from './ExplanationCard';
import { makeStyles } from '@material-ui/core/styles';

export default function TransformationPage({inputMatrixType, isIndirectMigration, cardTitle, cardDescription, 
                                            cardImage, showInferenceMethod = false, radioButton, 
                                            resultMatrices = [], setResultMatrices = ()=>{}}){
  const [submittedMatrix, setSubmittedMatrix] = useState('');
  const [outputMatrix, setOutputMatrix] = useState('');
  const [margin, setMargin] = useState('8vh');
  const[inputMatrixSize, setInputMatrixSize] = useState(3);
  const [multipleRuns, setMultipleRuns] = useState(false);
  const [numRuns, setNumRuns] = useState(2);
  const [submittedNumRuns, setSubmittedNumRuns] = useState(2);
  const [submittedMultipleRuns, setSubmittedMultipleRuns] = useState(false);
  const [running, setRunning] = useState(false); // State to track if the worker is running
  const [error, setError] = useState(false); // Indicates if there was an error in the worker when running the Python code
  const inputRef = useRef(null) ; 
  const hasMountedRef = useRef(false);
  const workerRef = useRef (null);

  useEffect(() => { // Create a new worker when the component mounts
    workerRef.current = new Worker('/pythonWorker.js');
    return () => { // Terminate the worker when the component unmounts
        workerRef.current.terminate();
    }
    }, []);

  useEffect(() => {
    // scroll to the vey bottom of the page when a calculation is done
    if (hasMountedRef.current) {
      if (!running) {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }
    } else {
      hasMountedRef.current = true;
    }
  }, [running]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRef.current) {
        const bottomInVh = ((inputRef.current.offsetTop + inputRef.current.offsetHeight) 
                            / window.innerHeight) * 100;
        setMargin(`${bottomInVh + 5}vh`);
      }
    }, 0);
  
    return () => clearTimeout(timer);
  }, [inputMatrixSize, outputMatrix]);

  useEffect(() => {
    if (!submittedMatrix) return;
    const request_id = Date.now();
    const handleMessage = (e) => {
        const { request_id: response_id, result } = e.data;
        if (response_id === request_id) {
          if (result === undefined) {
            setError(true);
          } 
          if (multipleRuns) {
            setResultMatrices(result);
          } else {
            setOutputMatrix(result);
          }
          setRunning(false); // Set running to false after receiving the response
          workerRef.current.removeEventListener('message', handleMessage);
        }
      };
    
      // Assign the event listener to the worker
    workerRef.current.addEventListener('message', handleMessage);
    
    const request = {
        inputMatrix: submittedMatrix,
        inputMatrixType: inputMatrixType,
        isIndirectMigration: isIndirectMigration,
        multipleRuns: multipleRuns,
        numRuns: numRuns,
        request_id: request_id
    };
    workerRef.current.postMessage(request);
    
  }, [submittedMatrix]);

  
  const onSubmit = (event, matrix) =>
  {
    event.preventDefault();
    if (running) return; // Prevent multiple submissions
    setOutputMatrix('');
    setSubmittedMultipleRuns(multipleRuns);
    setSubmittedNumRuns(numRuns);
    setResultMatrices([]);
    const newMatrix = matrix.map(row=>[...row]);
    setSubmittedMatrix(newMatrix);
    setError(false);
    setRunning(true);
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

  const downloadOutputMatrices = () => {
    const zip = new JSZip();
    // Add each output matrix to the zip file
    resultMatrices.forEach((matrix, index) => {
      const csv = Papa.unparse(matrix);
      zip.file(`output_matrix_${index + 1}.csv`, csv);
    });
    // Generate the zip file and trigger the download
    zip.generateAsync({ type: 'blob' }).then(blob => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = 'output_matrices.zip';
      link.href = url;
      link.click();
    });
  };
    
  const displayCalculatingMatrix = 
    CLIP_LOADER;

  // This should be an error message diaplyed when an error occurs in the worker.
  //font should br Roboto, color red, font size 2.5vmin and text should appear at the center of the page.
  const displayError = <div style={{fontFamily: 'Roboto', color: 'red', fontSize: '3vmin', 
                            textAlign: 'center', marginTop: '2vh'}}>
                          <ReportIcon style={{fontSize: '8vmin', color:'red'}}/> <br/>
                          An error occurred while calculating the output matrix. 
                          Make sure the input matrix is valid.
                      </div>;
  
  const useStyles = makeStyles({
    button: buttonStyle,
      checkboxLabel: {fontSize: '2.5vmin', paddingLeft: '1vw'},
  });
  const classes = useStyles();
 
  // Store the result matrices in local storage so that they can be accessed by the statistics page.
  const storeResultMatrices = (resultMatrices) => {
    const uniqueId = `${Date.now()}`; // Generate a unique ID for the result matrices
    localStorage.setItem(uniqueId, JSON.stringify(resultMatrices));
    return uniqueId;
    }

  const onStatisticsClick = () => {
    const uniqueId = storeResultMatrices(resultMatrices);
    const statisticPageUrl = `/Statistics?data=${uniqueId}`;
    window.open(statisticPageUrl, '_blank');
  }

  const displayDownloadZip = 
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  marginTop:'2vh'}}>
      <Grid container direction='row' spacing={1} alignContent='center' justifyContent='center'>
        <Grid item>
          <Button  className={classes.button} variant='contained' color="success" size="med"
                  onClick={downloadOutputMatrices}  style={{ fontSize: '3vmin' }}
                  startIcon={<CloudDownloadIcon style = {{fontSize:"4vmin"}}/>}  
                  component="label">
                  Download Zip ({submittedNumRuns} files)
          </Button>
        </Grid>
        <Grid item>
          <Button className={classes.button} variant="contained" style={{ fontSize: '3vmin' }} color="success" size="med"
                  startIcon = {<QueryStatsIcon style = {{fontSize:"4vmin"}}/>} 
                  onClick={onStatisticsClick}>
                  Summary Statistics 
          </Button>
        </Grid>
      </Grid>
    </div>;
    
  const displayOutputMatrix = 
    <Grid container direction='column' spacing={1}
          style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', 
          marginTop: "2vmin"}}>
          <Grid item style={{ borderCollapse: 'collapse', margin: '0 auto'}}>
              <OutputMatrix outputMatrix={outputMatrix} matrixSize={submittedMatrix.length}
                              isFst={inputMatrixType !== "Fst"} /> 
          </Grid>
          <Grid item>
              {submittedMatrix && <Button type='button' className = {classes.button} 
                                  onClick={downloadOutputMatrix} variant='contained' style={{ fontSize: '2.5vmin' }} 
                                  startIcon={<CloudDownloadIcon style = {{fontSize:"3vmin"}}/>} 
                                  color={inputMatrixType==="Fst"? "success":"primary"} 
                                  component="label" size="med">
                Download CSV 
                </Button>}
          </Grid>    
    </Grid>;

  const displayOutput = 
                        error ? displayError : 
                        submittedMultipleRuns && submittedMatrix && resultMatrices.length == submittedNumRuns ? 
                        displayDownloadZip : running ? displayCalculatingMatrix: displayOutputMatrix
  
  return (
    <div style={{marginTop:"3vmin", marginBottom:"3vmin"}}>
      <ExplanationCard title={cardTitle} image = {cardImage} description = {cardDescription}/>
      <SideMenu/>
      <LogoHeader/>
      <Grid container direction="column" justifyContent="center" alignItems="center" 
                      style={{ minHeight: '100vh', display: 'flex' }}>
        {showInferenceMethod && <Grid item>{radioButton}</Grid>}
        <Grid item ref={inputRef} style = {{marginBottom:"1vmin"}}>
          <InputMatrixForm onSubmit={onSubmit} inputMatrixSize={inputMatrixSize} 
          setInputMatrixSize={setInputMatrixSize} isFst={inputMatrixType === "Fst"} 
          multipleRuns={multipleRuns} setMultipleRuns={setMultipleRuns} numRuns={numRuns}
          setNumRuns={setNumRuns}/>
        </Grid>
          <Grid item style={{ top: margin,  width: '100%'}}>{displayOutput}
        </Grid>
      </Grid>
    </div>
  );
}
