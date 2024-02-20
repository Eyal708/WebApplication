import {useEffect, useState, useCallback } from 'react';
import React from "react";
import Papa from 'papaparse';

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
      <td style={{ border: '2px solid #000', width: '50px', height: '50px', verticalAlign:'middle',
              textAlign: 'center', padding: '10px', backgroundColor: 'lightgray', boxSizing: 'border-box'}}
      id="InMatrixCell"> <span style={{ fontWeight: '900', fontSize: 'small' }}>0</span>
      </td>
    );

  }
  return (
    <td style={{ border: '2px solid #000', width: '50px', height: '50px', verticalAlign:'middle',
      boxSizing: 'border-box'}}>
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
              style={{ 
                width: '100%', 
                height: '100%', 
                textAlign: 'center', 
                border: 'none',  // Change this line
                padding: '0',  // Change this line
                boxSizing: 'border-box', 
                backgroundColor: isSelectedCell || isHovered ? 'orange' : 'white',
                lineHeight: '50px' 
              }}
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
 
function InputMatrixForm({onSubmit})
{
  const [inputMatrix, setInputMatrix] = useState([
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]);
  const [matrixSize, setMatrixSize] = useState(3);
  const [matrixSizeInput, setMatrixSizeInput] = useState(3);
  const[shouldClearCells, setShouldClearCells] = useState(false);
  const [fileName, setFileName] = useState('No file chosen');
  

  const clearCells = useCallback(() => {
    if (shouldClearCells)
    {
      setInputMatrix(Array.from({ length: matrixSize }, () => Array.from({ length: matrixSize }, () => 0)));
    }
  }, [matrixSize, shouldClearCells]);
  
  useEffect(() => {clearCells()}, [clearCells]);  
  
  const handleSizeChange = () =>
  {
    const parsedMatrixSizeInput = Number(matrixSizeInput)
    if (!isNaN (parsedMatrixSizeInput) && Number.isInteger(parsedMatrixSizeInput) && 
       parsedMatrixSizeInput >= 2)
    {
      setMatrixSize(parsedMatrixSizeInput);     
      
      if (parsedMatrixSizeInput !== matrixSize)
      {
        setShouldClearCells(true);
      }

    }
    else{
      alert("Matrix size must be an integer greater than 2")
      
    }
  }

  const onClear = () =>
  {
    setShouldClearCells(true);
  }
  
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    
    if (!file) {
      return;
    }

    if (file.type !== 'text/csv') {
      alert('Invalid file type. Please upload a CSV file.');
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
  
    reader.onload = function(e) {
      const contents = e.target.result;
      Papa.parse(contents, {
        complete: function(results) {
          let matrix = results.data.map(row => row.map(Number));
          matrix = matrix.filter(row => !(row.length === 1 && row[0] === 0));
          
          if (matrix.length !== matrix[0].length) {
            alert('Matrix must be square');
            return;
          }
          setShouldClearCells(false);
          setMatrixSize(matrix.length);
          setInputMatrix(matrix);
        }
      });
    };
    reader.readAsText(file);
  };


  return (
    <div className="game">
      <div className='matrix'>
        <form onSubmit={(e)=>onSubmit(e, inputMatrix)}>
          <InputMatrix matrix={inputMatrix} setMatrix={setInputMatrix} matrixSize={matrixSize}/>
          <input type="submit" value="Submit Matrix" />
          <input id="file-upload" type="file" onChange={handleFileUpload} accept='.csv' />     
        </form>
      </div>
      <div className="game-board">    
      <label>
          <input type="number" step="1" min="2" value={matrixSizeInput} onChange={(e) => 
            setMatrixSizeInput(e.target.value)} />
        </label>
      <button type="button" onClick={handleSizeChange}>
        Change Matrix Size
      </button>
      </div>
      <div className="game-info">
        <button type='button' onClick={onClear}>
          Clear Matrix
        </button>
      </div>
    </div>
  );
}
export default InputMatrixForm;
