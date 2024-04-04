import React from "react";
import './index.css';
import {TableCell, TableRow } from '@material-ui/core';
import {heatMapSize} from './constants';

function OutputMatrixCell({value, cellSize = 2, isDiag = false, isFst = true, displayValue = true,}) {
    const colorScale = isFst ? `rgba(0, 0, 255, ${value})` : `rgba(0, 255, 0, ${value})`;
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

  function OutputMatrix({ outputMatrix, matrixSize, isFst = false}) 
  {
    const cellSize = heatMapSize / matrixSize;
    const rows = Array.from({ length: matrixSize }, (_, rowIndex) => (
      <TableRow key={rowIndex} className="board_row">
        {Array.from({ length: matrixSize }, (_, colIndex) => (
          <OutputMatrixCell cellSize={cellSize} key={colIndex} value={outputMatrix[rowIndex]!==  undefined && 
                            outputMatrix[rowIndex][colIndex] !== undefined ? 
                            outputMatrix[rowIndex][colIndex] : 0}
            isDiag={rowIndex===colIndex} isFst = {isFst} displayValue = {matrixSize <= 10}
            // shouldDisplay={isFst? rowIndex <= colIndex: true}
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