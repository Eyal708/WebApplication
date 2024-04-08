import React, {useState} from "react";
import {Grid} from '@material-ui/core';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import './index.css';
import {fst, rightArrow, migrationExplanation} from './constants';
import MigrationImage from './Images/DNA.jpg';
import TransformationPage from './TransformationPage';

export default function MigrationToFst({isPyodideLoaded, pythonScript}) {
  const [inferenceMethod, setInferenceMethod] = useState('Direct');
  const handleMethodChange = (event) => {
      setInferenceMethod(event.target.value);
    };
  const cardTitle = fst + " " + rightArrow + " " +  "Migration";
  const radioButton = <FormControl>
      <FormLabel id="inference-method">Inference Method</FormLabel>
      <RadioGroup
        row
        aria-labelledby="inference-method"
        name="row-radio-buttons-group"
        fontSize="5vmin"
        value = {inferenceMethod}
        onChange={handleMethodChange}
      >
        <FormControlLabel value="Direct" control={<Radio />} label="Direct"/>
        <FormControlLabel value="Indirect" control={<Radio />} label="Indirect" />
      </RadioGroup>
    </FormControl>
return (
  <Grid container direction = "column" 
  style={{ minHeight: '50vh', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flrx-end'}}>
      <Grid item> {radioButton} </Grid>
      <Grid item> 
        <TransformationPage isPyodideLoaded={isPyodideLoaded} pythonScript={pythonScript} 
        inputMatrixType="Fst" cardTitle = {cardTitle} cardImage = {MigrationImage}
        cardDescription={migrationExplanation} isIndirectMigration={inferenceMethod==="Indirect"}
        showInferenceMethod = {true} radioButton = {radioButton} /> 
      </Grid>
  </Grid>);
}
