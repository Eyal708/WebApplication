import {useState, useEffect, useRef} from 'react';
import React from "react";
import { ClipLoader } from "react-spinners";
import {Button, Grid} from '@material-ui/core';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import usePythonRunner from './pythonRunner';
import SideMenu from './SideMenu';
import Papa from 'papaparse';
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
  const [margin, setMargin] = useState('8vh');
  const[inputMatrixSize, setInputMatrixSize] = useState(3);
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
                                startIcon={<CloudDownloadIcon/>} color="primary" component="label">
            Download CSV
            </Button>}
       </Grid>
  </Grid>;
  
  const displayOutput = (!outputMatrix && submittedMatrix) ? displayCalculatingMatrix: displayOutputMatrix;
  
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
        setInputMatrixSize={setInputMatrixSize} isFst={inputMatrixType === "Fst"}/>
      </Grid>
        <Grid item style={{ position:'absolute', top: margin, 
        width: '100%' }}>{displayOutput}
      </Grid>
    </Grid>
    </div>
  );
}
