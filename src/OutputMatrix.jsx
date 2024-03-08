import React from "react";
import './index.css';
import {TableCell, TableRow } from '@material-ui/core';

function OutputMatrixCell({value, isDiag = false}) {
    const backgroundColor = isDiag ? "lightgray": "white";
    return (
      <TableCell className="tableCell" id="myTableCellId" style={{backgroundColor:backgroundColor}}>
        {value}
      </TableCell>
    )
  }
  
  function OutputMatrix({ outputMatrix, matrixSize}) 
  {
    const rows = Array.from({ length: matrixSize }, (_, rowIndex) => (
      <TableRow key={rowIndex} className="board_row">
        {Array.from({ length: matrixSize }, (_, colIndex) => (
          <OutputMatrixCell key={colIndex} value={outputMatrix[rowIndex]!== undefined && 
            outputMatrix[rowIndex][colIndex] !== undefined ? outputMatrix[rowIndex][colIndex] : 0}
            isDiag={rowIndex===colIndex} 
            />
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