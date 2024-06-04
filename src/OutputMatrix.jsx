import React from "react";
import { useState, useEffect } from 'react';
import './index.css';
import {TableCell, TableRow } from '@material-ui/core';
import {heatMapSize} from './constants';

function OutputMatrixCell({value, cellSize = 2, isDiag = false, isFst = true, displayValue = true, 
                          minValue, maxValue}) {
    //This is used to scale the color of the cell based on the max value (When the output matrix is migration).
    let normalizedValue = maxValue === minValue ? 1 : (value - minValue) / (maxValue - minValue);
    const colorScale = isFst ? `rgba(0, 0, 255, ${value})` : `rgba(0, 255, 0, ${normalizedValue})`;
    const backgroundColor = isDiag ? "lightgray": colorScale;
    return (
      displayValue ? <TableCell className="tableCell" id="myTableCellId" 
                      style={{backgroundColor:backgroundColor}}> {value} </TableCell>:
                          <TableCell className="tableCell" id="myTableCellId" 
                                     style = {{backgroundColor:backgroundColor, 
                                      width: `${cellSize}vmin` ,height:`${cellSize}vmin`}}>

        </TableCell>   
    );
  }

  function OutputMatrix({outputMatrix, matrixSize, isFst = false}) 
  {
    const cellSize = heatMapSize / matrixSize;
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
            minValue={minValue} maxValue={maxValue}/>
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