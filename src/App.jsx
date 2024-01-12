import {useEffect, useState, useCallback } from 'react';
import React from "react";
import usePythonRunner from './pythonRunner';

// const [matrix, setMatrix] = useState(initialMatrix);
function InputMatrixCell({onCellChange, value}) {
  return (
    <td>
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


function InputMatrix({matrix, setMatrix, matrixSize}) {
  // const [values, setValues] = useState(Array.from({ length: matrixSize }, () => 
  //                             Array.from({ length: matrixSize }, () => 0)));
  const handleCellChange = (row, col, value)  =>
  {
    const updatedMatrix = matrix.map((rowArray, rowIndex) =>
    rowIndex === row ? rowArray.map((cell, colIndex) => (colIndex === col ? 
      (!Number.isNaN(parseFloat(value)) ? parseFloat(value): 0)  : cell)): rowArray
      );
      setMatrix(updatedMatrix);
      
    }
    const rows = Array.from({ length: matrixSize }, (_, rowIndex) => (
      <tr key={rowIndex} className="board_row">
      {Array.from({ length: matrixSize }, (_, colIndex) => (
        <InputMatrixCell key={colIndex} value={matrix[rowIndex]!== undefined && 
          matrix[rowIndex][colIndex] !== undefined ? matrix[rowIndex][colIndex] : 0} 
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
function OutputMatrixCell({value}) {
  return (
    <td style={{ border: '1px solid black', padding: '10px', textAlign:'center'} }
    id="OutMatrixCell">
      {value}
    </td>
  )
}

function OutputMatrix({submittedMatrix, outputMatrix, setOutputMatrix, matrixSize}) 
{
  const [isPythonRunnerDone, setIsPythonRunnerDone] = useState(false); 
  usePythonRunner(submittedMatrix, setOutputMatrix, setIsPythonRunnerDone);

  if (!isPythonRunnerDone) {
    return <div>Loading...</div>; // or return null or some loading spinner
  }
  const rows = Array.from({ length: matrixSize }, (_, rowIndex) => (
    <tr key={rowIndex} className="board_row">
      {Array.from({ length: matrixSize }, (_, colIndex) => (
        <OutputMatrixCell key={colIndex} value={outputMatrix[rowIndex]!== undefined && 
          outputMatrix[rowIndex][colIndex] !== undefined ? outputMatrix[rowIndex][colIndex] : 0} 
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

function InputMatrixForm({onSubmit})
{
  const [inputMatrix, setInputMatrix] = useState([
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]);
  const [matrixSize, setMatrixSize] = useState(3);
  const [matrixSizeInput, setMatrixSizeInput] = useState(3);
  
  const clearCells = useCallback(() => {
    setInputMatrix(Array.from({ length: matrixSize }, () => Array.from({ length: matrixSize }, () => 0)));
  }, [matrixSize]);
  
  useEffect(() => {clearCells()}, [clearCells]);  
  
  const updateMatrixSize = () =>
  {
    const parsedMatrixSizeInput = Number(matrixSizeInput)
    if (!isNaN (parsedMatrixSizeInput) && Number.isInteger(parsedMatrixSizeInput) && 
       parsedMatrixSizeInput >= 2)
    {
      setMatrixSize(parsedMatrixSizeInput);     
      // setMatrixSizeInput('');

    }
    else{
      alert("Matrix size must be an integer greater than 2")
      
    }
  }

  const onClear = () =>
  {
    clearCells();
  }

  return (
    <div className="game">
      <div className='matrix'>
        <form onSubmit={(e)=>onSubmit(e, inputMatrix)}>
          <InputMatrix matrix={inputMatrix} setMatrix={setInputMatrix} matrixSize={matrixSize}/>
          <input type="submit" value="Submit matrix" />
        </form>
      </div>
      <div className="game-board">    
      <label>
          <input type="number" step="1" min="2" value={matrixSizeInput} onChange={(e) => 
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

export default function Game() {
  // const [inputMatrix, setInputMatrix] = useState([
  //   [0, 0, 0],
  //   [0, 0, 0],
  //   [0, 0, 0],
  // ]);
  const [submittedMatrix, setSubmittedMatrix] = useState([
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]);
  const [outputMatrix, setoutputMatrix] = useState([
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]);
  // const [matrixSize, setMatrixSize] = useState(3);
  // const [matrixSizeInput, setMatrixSizeInput] = useState(3);
  // const [outputMatrix, setOutputMatrix] = useState('');
  
  // const clearCells = useCallback(() => {
  //   setInputMatrix(Array.from({ length: matrixSize }, () => Array.from({ length: matrixSize }, () => 0)));
  // }, [matrixSize]);
  
  // useEffect(() => {clearCells()}, [clearCells]);  
  
  // const updateMatrixSize = () =>
  // {
  //   const parsedMatrixSizeInput = Number(matrixSizeInput)
  //   if (!isNaN (parsedMatrixSizeInput) && Number.isInteger(parsedMatrixSizeInput) && 
  //      parsedMatrixSizeInput >= 2)
  //   {
  //     setMatrixSize(parsedMatrixSizeInput);     
  //     // setMatrixSizeInput('');

  //   }
  //   else{
  //     alert("Matrix size must be an integer greater than 2")
      
  //   }
     
  // }
  const onSubmit = (event, matrix) =>
  {
    event.preventDefault();
    console.log(matrix);
    const newMatrix = matrix.map(row=>[...row]);
    setSubmittedMatrix(newMatrix);
    
  }
  // const onClear = () =>
  // {
  //   clearCells();
  // }

  return (
  //   <div className="game">
  //     <div className='matrix'>
  //       <form onSubmit={onSubmit}>
  //         <InputMatrix matrix={inputMatrix} setMatrix={setInputMatrix} matrixSize={matrixSize}/>
  //         <input type="submit" value="Submit matrix" />
  //       </form>
  //     </div>
  //     <div className="game-board">    
  //     <label>
  //         <input type="number" step="1" min="2" value={matrixSizeInput} onChange={(e) => 
  //           setMatrixSizeInput(e.target.value)} />
  //       </label>
  //     <button type="button" onClick={updateMatrixSize}>
  //       Change Matrix Size
  //     </button>
  //     </div>
  //     <div className="game-info">
  //       <button type='button' onClick={onClear}>
  //         Clear matrix
  //       </button>
  //     </div>
  //   </div>
  <div>
  <InputMatrixForm onSubmit={onSubmit}/>
  Output Matrix:
  <OutputMatrix submittedMatrix={submittedMatrix} outputMatrix={outputMatrix} setOutputMatrix={setoutputMatrix} 
                matrixSize={submittedMatrix.length}/> 
    </div>
  );
}
