import {useEffect, useState, useCallback } from 'react';
import React from "react";

function OutputMatrixCell({value, isDiag = false}) {
    return (
      <td style={{ border: '2px solid #000',  width: '50px', height: '50px', 
                textAlign: 'center', lineHeight: '50px',  backgroundColor: isDiag ? 'lightgray' : 'white' }}
      id="OutMatrixCell">
        {value}
      </td>
    )
  }
  
  function OutputMatrix({ outputMatrix, matrixSize}) 
  {
    const rows = Array.from({ length: matrixSize }, (_, rowIndex) => (
      <tr key={rowIndex} className="board_row">
        {Array.from({ length: matrixSize }, (_, colIndex) => (
          <OutputMatrixCell key={colIndex} value={outputMatrix[rowIndex]!== undefined && 
            outputMatrix[rowIndex][colIndex] !== undefined ? outputMatrix[rowIndex][colIndex] : 0}
            isDiag={rowIndex===colIndex} 
            />
        ))}
      </tr>
    ));
  
    return (
      <React.Fragment>
        {rows}
      </React.Fragment>
    ); 
  } 
  export default OutputMatrix;