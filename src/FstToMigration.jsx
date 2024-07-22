import React, {useState} from "react";
import {Typography} from '@material-ui/core';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import './index.css';
import {fst, rightArrow, fstExplanation} from './constants';
import MigrationImage from './Images/DNA.jpg';
import TransformationPage from './TransformationPage';
import { InlineMath } from "react-katex";

export default function FstToMigration({ resultMatrices, setResultMatrices}) {
  const [inferenceMethod, setInferenceMethod] = useState('Direct');
  const handleMethodChange = (event) => {
      setInferenceMethod(event.target.value);
    };
    
  const cardTitle = (
    <>
      <InlineMath math="F_{st}" />
      <span style={{ marginLeft: '5px' }}></span>
      {rightArrow}
      <span style={{ marginRight: '5px' }}></span>
      Migration 
    </>
  );

  const radioButton = <FormControl>
      <FormLabel id="inference-method" style={{fontSize:"2vmin"}}>Inference Method</FormLabel>
      <RadioGroup
        row aria-labelledby="inference-method"
        name="row-radio-buttons-group"
        fontSize="5vmin"
        value = {inferenceMethod}
        onChange={handleMethodChange}
      >
        <FormControlLabel value="Direct" control={<Radio sx={{
          '& .MuiSvgIcon-root': {fontSize: "3vmin",},}}/>} style = {{fontSize :"2vmin"}} 
          label={<Typography style={{fontSize: "2vmin"}}>Direct</Typography>}/>
        <FormControlLabel value="Indirect" control={<Radio sx={{
          '& .MuiSvgIcon-root': {fontSize: "3vmin",},}}/>}
          label={<Typography style={{fontSize: "2vmin"}}>Indirect</Typography>}/>
      </RadioGroup>
    </FormControl>
return (
        <TransformationPage inputMatrixType="Fst" cardTitle = {cardTitle} cardImage = {MigrationImage}
        cardDescription={fstExplanation} isIndirectMigration={inferenceMethod==="Indirect"}
        showInferenceMethod = {true} radioButton = {radioButton} resultMatrices = {resultMatrices}
        setResultMatrices = {setResultMatrices} /> 
  );
}
