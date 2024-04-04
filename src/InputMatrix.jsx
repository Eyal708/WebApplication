import { useState, useEffect } from 'react';
import React from "react";
import { TextField, TableCell, TableRow } from '@material-ui/core';
import './index.css';

function InputMatrixCell({ onCellChange, value, isDiag = false, onClick, isSelectedCell = false, 
                           isFst = false}) {

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
  const colorScale = isFst ? `rgba(0, 0, 255, ${value})` : `rgba(0, 255, 0, ${value})`;
  return (
    <TableCell className="tableCell" id="myTableCellId">
      <TextField
        type='number'
        id="MatrixCellInput"
        value={value}
        InputProps={{
          inputProps: { min: 0, max: 10, step: 0.01 },
          disableUnderline: true, 
          style: { textAlign: 'center', padding: 0, fontSize: '3vmin' } 
        }}
        className='form-control matrix-input'
        onChange={onCellChange}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        style={{
          width: '8vmin',
          height: '8vmin',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          border: 'none',
          padding: '0',
          backgroundColor: isSelectedCell || isHovered ? 'orange' : colorScale,
          margin: 0
        }} />
    </TableCell>
  );
}

function InputMatrix({ matrix, setMatrix, matrixSize, isFst = false }) {
  const [selectedCell, setSelectedCell] = useState({ 'rowIndex': -1, 'colIndex': -1 });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.inputMatrix')) {
        setSelectedCell({ 'rowIndex': -1, 'colIndex': -1 });
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [])

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
    <TableRow key={rowIndex} className = "inputMatrix" >
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