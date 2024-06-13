import React from "react";
import { useState, useEffect } from 'react';
import './index.css';
import {TableCell, TableRow } from '@material-ui/core';
import {heatMapSize, FST_COLOR_BASE, MIGRATION_COLOR_BASE} from './constants';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';

function OutputMatrixCell({value, cellSize = 2, isDiag = false, isFst = true, displayValue = true, 
                          minValue, maxValue, hoverStats = null}) {
    //This is used to scale the color of the cell based on the max value (When the output matrix is migration).
    let normalizedValue = maxValue === minValue ? 1 : (value - minValue) / (maxValue - minValue);
    const colorScale = isFst ? `rgba(${FST_COLOR_BASE}, ${value})` : `rgba(${MIGRATION_COLOR_BASE}, 
                                                                            ${normalizedValue})`;
    const backgroundColor = isDiag ? "lightgray": colorScale;
    const cell = 
      displayValue ? <TableCell className="tableCell" id="myTableCellId" 
                      style={{backgroundColor:backgroundColor}}> {value} </TableCell>:
                          <TableCell className="tableCell" id="myTableCellId" 
                                     style = {{backgroundColor:backgroundColor, 
                                      width: `${cellSize}vmin` ,height:`${cellSize}vmin`}}>

        </TableCell>;

    const useStyles = makeStyles((theme) => ({
      tooltip: {
        fontSize: "2vmin", // adjust this value to make the tooltip text bigger
      },
    }));
    const classes = useStyles()

       return (
        hoverStats != null && !isDiag ? 
          <Tooltip title={`std: ${hoverStats}`} classes={{ tooltip: classes.tooltip }}>
             {cell}
          </Tooltip> :
          cell
      );
  }

  function OutputMatrix({outputMatrix, matrixSize, isFst = false, extraStats = []}) 
  {
    console.log(extraStats);
    let cellSize = heatMapSize / matrixSize;
    // if extrasStats in not null, double the cell size
    const [minValue, setMinValue] = useState(Infinity);
    const [maxValue, setMaxValue] = useState(-Infinity);
    // This use effect is used to update the min and max values in the output matrix at any given time.
    useEffect(() => {
      //if outputMatrix is not an array, return
      if (!Array.isArray(outputMatrix) || !outputMatrix.length) {
        return;
      }
      const min = outputMatrix.reduce((min, row) => Math.min(min, ...row), Infinity);
      const max = outputMatrix.reduce((max, row) => Math.max(max, ...row), -Infinity);
      setMinValue(min);
      setMaxValue(max);
    }, [outputMatrix]);

    const rows = Array.from({ length: matrixSize }, (_, rowIndex) => (
      <TableRow key={rowIndex} className="board_row">
        {Array.from({ length: matrixSize }, (_, colIndex) => (
          <OutputMatrixCell cellSize={cellSize} key={colIndex} value={outputMatrix[rowIndex]!==  undefined && 
                            outputMatrix[rowIndex][colIndex] !== undefined ? 
                            outputMatrix[rowIndex][colIndex] : 0}
            isDiag={rowIndex===colIndex} isFst = {isFst} displayValue = {matrixSize <= 10}
            minValue={minValue} maxValue={maxValue} hoverStats = {extraStats.length > 0 ?
            extraStats[rowIndex][colIndex] : null}/>
        ))}
      </TableRow>
    ));
  
    return (
      <React.Fragment>
        {rows}
      </React.Fragment>
    ); 
  } 
  export default OutputMatrix;