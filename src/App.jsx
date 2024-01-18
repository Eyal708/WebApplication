import {useEffect, useState, useCallback } from 'react';
import React from "react";
import { ClipLoader } from "react-spinners";
import usePythonRunner from './pythonRunner';

// const [matrix, setMatrix] = useState(initialMatrix);
function InputMatrixCell({onCellChange, value, isDiag = false, onClick, isSelectedCell = false}) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  if (isDiag)
  {
    return (
      <td style={{ border: '2px solid #000', width: '50px', height: '50px', 
              textAlign: 'center', lineHeight: '30px'}}
      id="InMatrixCell"> <span style={{ fontWeight: '900', fontSize: 'small' }}>0</span>
      </td>
    );

  }
  return (
    <td style={{ border: '2px solid #000', width: '50px', height: '50px' }}>
          <input
              type='number'
              id="MatrixCellInput"
              value={value}
              step="0.01"
              min='0'
               max='10'
              className='form-control'
              onChange={onCellChange}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={onClick}
              style={{ width: '100%', height: '100%', textAlign: 'center', border:"None", 
                    boxSizing: 'border-box', backgroundColor: isSelectedCell || isHovered ? 'orange' : 'white' }}

            />
    </td>
  )
};


function InputMatrix({matrix, setMatrix, matrixSize}) {
  // const [values, setValues] = useState(Array.from({ length: matrixSize }, () => 
  //                             Array.from({ length: matrixSize }, () => 0)));
  const [selectedCell, setSelectedCell] = useState({'rowIndex': -1, 'colIndex': -1});
  
  const handleCellChange = (row, col, value)  =>
  {
    const updatedMatrix = matrix.map((rowArray, rowIndex) =>
    rowIndex === row ? rowArray.map((cell, colIndex) => (colIndex === col ? 
      (!Number.isNaN(parseFloat(value)) ? parseFloat(value): 0)  : cell)): rowArray
      );
      setMatrix(updatedMatrix);
      
    }
  const onCellClick = (rowIndex, colIndex) =>
  {
    setSelectedCell({rowIndex, colIndex});

  }
    const rows = Array.from({ length: matrixSize }, (_, rowIndex) => (
      <tr key={rowIndex} className="board_row">
      {Array.from({ length: matrixSize }, (_, colIndex) => (
        <InputMatrixCell key={colIndex} value={matrix[rowIndex]!== undefined && 
          matrix[rowIndex][colIndex] !== undefined ? matrix[rowIndex][colIndex] : 0} 
          onCellChange={(e)=>handleCellChange(rowIndex, colIndex, e.target.value)} isDiag={rowIndex===colIndex}
          onClick={() => onCellClick(rowIndex, colIndex)} 
          isSelectedCell={rowIndex === selectedCell.rowIndex && colIndex === selectedCell.colIndex}/>
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
    <td style={{ border: '2px solid #000', padding: '10px', width: '30px', height: '30px', 
              textAlign: 'center', lineHeight: '30px'}}
    id="OutMatrixCell">
      {value}
    </td>
  )
}

function OutputMatrix({submittedMatrix, outputMatrix, setOutputMatrix, matrixSize, inputMatrixType}) 
{
  const [isPythonRunnerDone, setIsPythonRunnerDone] = useState(false); 
  usePythonRunner(submittedMatrix, setOutputMatrix, setIsPythonRunnerDone, inputMatrixType);

  if (!isPythonRunnerDone) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <ClipLoader color={"#123abc"} loading={true} size={50} />
        <p style={{ marginTop: '10px' }}>Loading Program...</p>
      </div>
    );
  }
  
  if(!outputMatrix && submittedMatrix)
  { //This causes the div to appear when the matrix is submitted but the python runner is not done,
    //so it won't appear before any matrix is submitted (first render)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <ClipLoader color={"#123abc"} loading={true} size={50} />
        <p style={{ marginTop: '10px' }}>Calculating Matrix...</p>
      </div>
    );
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
  
  const [submittedMatrix, setSubmittedMatrix] = useState('');
  const [outputMatrix, setoutputMatrix] = useState('');
  const [matrixType, setMatrixType] = useState('Migration');
  
  const onSubmit = (event, matrix) =>
  {
    event.preventDefault();
    setoutputMatrix('');
    console.log(matrix);
    const newMatrix = matrix.map(row=>[...row]);
    setSubmittedMatrix(newMatrix);
    
  }
  const handleDropdownChange = (e) => {
      setMatrixType(e.target.value);
    }
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          <h4>Matrix Type</h4>
          <select value={matrixType} onChange={handleDropdownChange} style={{ marginLeft: '10px' }}>
            <option value="Fst">Fst</option>
            <option value="Migration">Migration</option>
          </select>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <div style={{ borderCollapse: 'collapse', margin: '0 auto' }}>
            <InputMatrixForm onSubmit={onSubmit}/>
          </div>
        </div>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2>Output Matrix</h2>
          <div style={{ borderCollapse: 'collapse', margin: '0 auto' }}>
            <OutputMatrix submittedMatrix={submittedMatrix} outputMatrix={outputMatrix}
            setOutputMatrix={setoutputMatrix} matrixSize={submittedMatrix.length} inputMatrixType={matrixType}/> 
          </div>
        </div>
      </div>
    );
    
}