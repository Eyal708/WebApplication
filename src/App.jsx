import {useEffect, useState, useCallback } from 'react';
import React from "react";

// const [matrix, setMatrix] = useState(initialMatrix);
function MatrixCell({onCellChange, value}) {
  return (
    <td>
      <label> Value: </label>
          <input
              type='number'
              id="MatrixCellInput"
              value={value}
              step="0.01"
              min='0'
              max='1'
              className='form-control'
              onChange={onCellChange}

            />
    </td>
  )
};

 function Matrix({matrix, setMatrix, matrixSize}) {
  // const [values, setValues] = useState(Array.from({ length: matrixSize }, () => 
  //                             Array.from({ length: matrixSize }, () => 0)));
  const handleCellChange = (row, col, value)  =>
  {
    const updatedMatrix = matrix.map((rowArray, rowIndex) =>
    rowIndex === row ? rowArray.map((cell, colIndex) => (colIndex === col ? 
                       parseFloat(value) : cell)): rowArray
  );
  setMatrix(updatedMatrix);
    
  }
  const rows = Array.from({ length: matrixSize }, (_, rowIndex) => (
    <tr key={rowIndex} className="board_row">
      {Array.from({ length: matrixSize }, (_, colIndex) => (
        <MatrixCell key={colIndex} value={matrix[rowIndex] && matrix[rowIndex][colIndex] !== undefined ? 
          matrix[rowIndex][colIndex] : 0} 
          onCellChange={(e)=>handleCellChange(rowIndex, colIndex, e.target.value)} />
      ))}
    </tr>
  ));
  return (
    <React.Fragment>
      {rows}
    </React.Fragment>
  );

  
}

export default function Game() {
  const [matrix, setMatrix] = useState([
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]);
  const [matrixSize, setMatrixSize] = useState(3);
  const [matrixSizeInput, setMatrixSizeInput] = useState('');
  
  const clearCells = useCallback(() => {
    setMatrix(Array.from({ length: matrixSize }, () => Array.from({ length: matrixSize }, () => 0)));
  }, [matrixSize]);
  
  useEffect(() => {clearCells()}, [clearCells]);  
  
  const updateMatrixSize = () =>
  {
    const parsedMatrixSizeInput = Number(matrixSizeInput)
    if (!isNaN (parsedMatrixSizeInput) && Number.isInteger(parsedMatrixSizeInput) && 
       parsedMatrixSizeInput >= 2)
    {
      setMatrixSize(parsedMatrixSizeInput);     
      setMatrixSizeInput('');

    }
    else{
      alert("Matrix size must be an integer greater than 2")
      
    }
     
  }
  const onSubmit = (event) =>
  {
    event.preventDefault();
    console.log(matrix);
    
  }
  const onClear = () =>
  {
    clearCells();
  }

  return (
    <div className="game">
      <div className='matrix'>
        <form onSubmit={onSubmit}>
          <Matrix matrix={matrix} setMatrix={setMatrix} matrixSize={matrixSize}/>
          <input type="submit" value="Submit matrix" /> 
        </form>
      </div>
      <div className="game-board">    
      <label>
          <input type="number" step="1" min={"2" } value={matrixSizeInput} onChange={(e) => 
            setMatrixSizeInput(e.target.value)} />
        </label>
      <button type="button" onClick={updateMatrixSize}>
        Change Matrix Size
      </button>
      </div>
      <div className="game-info">
        <button type='button' onClick={onClear}>
          Clear matrix
        </button>
      </div>
    </div>
  );
}
