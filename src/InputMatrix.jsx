import { useState } from 'react';
import React from "react";
import { TextField, TableCell, TableRow } from '@material-ui/core';
import './index.css';

function InputMatrixCell({ onCellChange, value, isDiag = false, onClick, isSelectedCell = false }) {

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  if (isDiag) {
    return (
      <TableCell className="tableCell" id="myTableCellId" style={{backgroundColor:"lightgray"}}>
        0
      </TableCell>
    );
  }
  
  return (
    <TableCell style={{
      border: '2px solid #000', width: '50px', height: '50px', verticalAlign: 'middle',
      boxSizing: 'border-box', padding: 0, marginL: 0, marginR: 0 
    }}>
      <TextField
        type='number'
        id="MatrixCellInput"
        value={value}
        InputProps={{
          inputProps: { min: 0, max: 10, step: 0.01 },
          disableUnderline: true, // Add this line to remove the underline
          style: { textAlign: 'center', padding: 0, fontSize: '1.2rem' } // Adjust the font size
        }}
        className='form-control matrix-input'
        onChange={onCellChange}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        style={{
          width: '100%', // Adjust width considering padding
          height: '100%', // Adjust height considering padding
          textAlign: 'center',
          border: 'none',
          padding: '0',
          boxSizing: 'border-box',
          backgroundColor: isSelectedCell || isHovered ? 'orange' : 'white',
          lineHeight: '50px',
          margin: 0
        }} />
    </TableCell>
  );
}

function InputMatrix({ matrix, setMatrix, matrixSize }) {
  const [selectedCell, setSelectedCell] = useState({ 'rowIndex': -1, 'colIndex': -1 });

  const handleCellChange = (row, col, value) => {
    const updatedMatrix = matrix.map((rowArray, rowIndex) => rowIndex === row ? rowArray.map((cell, colIndex) => (colIndex === col ?
      (!Number.isNaN(parseFloat(value)) ? parseFloat(value) : 0) : cell)) : rowArray
    );
    setMatrix(updatedMatrix);
  };
  const onCellClick = (rowIndex, colIndex) => {
    setSelectedCell({ rowIndex, colIndex });
  };

  const rows = Array.from({ length: matrixSize }, (_, rowIndex) => (
    <TableRow key={rowIndex} className="board_row">
      {Array.from({ length: matrixSize }, (_, colIndex) => (
        <InputMatrixCell key={colIndex} value={matrix[rowIndex] !== undefined &&
          matrix[rowIndex][colIndex] !== undefined ? matrix[rowIndex][colIndex] : 0}
          onCellChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)} isDiag={rowIndex === colIndex}
          onClick={() => onCellClick(rowIndex, colIndex)}
          isSelectedCell={rowIndex === selectedCell.rowIndex && colIndex === selectedCell.colIndex} />
      ))}
    </TableRow>
  ));
  return (
    <React.Fragment>
      {rows}
    </React.Fragment>
  );
}
export default InputMatrix;