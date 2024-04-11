import {useState, useEffect, useRef} from 'react';
import React from "react";
import { ClipLoader } from "react-spinners";
import {Button, Grid} from '@material-ui/core';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import usePythonRunner from './pythonRunner';
import SideMenu from './SideMenu';
import Papa from 'papaparse';
import JSZip from 'jszip';
import InputMatrixForm from './InputMatrixForm';
import OutputMatrix from './OutputMatrix'
import './index.css';
import {buttonStyle} from './constants';
import LogoHeader from './LogoHeader';
import ExplanationCard from './ExplanationCard';
import { makeStyles } from '@material-ui/core/styles';

export default function TransformationPage({isPyodideLoaded, pythonScript, inputMatrixType, 
                                            isIndirectMigration, cardTitle, cardDescription, cardImage,
                                            showInferenceMethod = false, radioButton}){
  const [submittedMatrix, setSubmittedMatrix] = useState('');
  const [outputMatrix, setOutputMatrix] = useState('');
  const [resultMatrices, setResultMatrices] = useState([]);
  const [margin, setMargin] = useState('8vh');
  const[inputMatrixSize, setInputMatrixSize] = useState(3);
  const [multipleRuns, setMultipleRuns] = useState(false);
  const [numRuns, setNumRuns] = useState(2);
  const [submittedNumRuns, setSubmittedNumRuns] = useState(2);
  const [submittedMultipleRuns, setSubmittedMultipleRuns] = useState(false);
  const outputRef = useRef(null); // Create a ref for the output matrix
  const inputRef = useRef(null) ; 

  useEffect(() => {
    if (outputMatrix && outputRef.current) {
      outputRef.current.scrollIntoView({ behavior: 'smooth' }); // Scroll to the output matrix when it's displayed
    }
  }, [outputMatrix]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRef.current) {
        const bottomInVh = ((inputRef.current.offsetTop + inputRef.current.offsetHeight) 
                            / window.innerHeight) * 100;
        setMargin(`${bottomInVh + 2}vh`);
      }
    }, 0);
  
    return () => clearTimeout(timer);
  }, [inputMatrixSize, outputMatrix]);

  
  usePythonRunner(submittedMatrix, setOutputMatrix, inputMatrixType, isIndirectMigration, 
                isPyodideLoaded, pythonScript, setResultMatrices, submittedMultipleRuns, submittedNumRuns);

  
  const onSubmit = (event, matrix) =>
  {
    event.preventDefault();
    setOutputMatrix('');
    setResultMatrices([]);
    setSubmittedMultipleRuns(multipleRuns);
    setSubmittedNumRuns(numRuns);
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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <ClipLoader color={"#123abc"} loading={true} size = {`${10}vmin`} />
    </div>;
  
  const useStyles = makeStyles({
    button: buttonStyle,
  });
  const classes = useStyles();
  
  const displayOutputMatrix = 
  <Grid container direction='column' spacing={1}
        style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', 
        marginTop: "2vmin"}}>
        <Grid item ref={outputRef} style={{ borderCollapse: 'collapse', margin: '0 auto'}}>
            <OutputMatrix outputMatrix={outputMatrix} matrixSize={submittedMatrix.length}
                           isFst={inputMatrixType !== "Fst"} /> 
        </Grid>
        <Grid item>
            {submittedMatrix && <Button type='button' className = {classes.button} 
                                onClick={downloadOutputMatrix} variant='contained' 
                                startIcon={<CloudDownloadIcon style = {{fontSize:"3vmin"}}/>} 
                                          color="primary" component="label">
            Download CSV 
            </Button>}
       </Grid>
  </Grid>;

  const displayDownloadZip = 
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  marginTop:'2vh'}}>
        <Button type='button' className={classes.button} 
                onClick={downloadOutputMatrices} variant='contained' 
                startIcon={<CloudDownloadIcon style = {{fontSize:"3vmin"}}/>} color="primary" 
                component="label">
                Download Zip ({submittedNumRuns} files)
        </Button>
    </div>;
  
  const displayOutput = submittedMultipleRuns && submittedMatrix && resultMatrices.length == submittedNumRuns? 
  displayDownloadZip : (!outputMatrix && submittedMatrix) ? displayCalculatingMatrix: displayOutputMatrix;
  
  return (
    <div>
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
        <Grid item style={{ position:'absolute', top: margin, 
        width: '100%' }}>{displayOutput}
      </Grid>
    </Grid>
    </div>
  );
}
