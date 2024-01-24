import {useEffect, useState, useCallback } from 'react';
import React from "react";
import { ClipLoader } from "react-spinners";
import usePythonRunner from './pythonRunner';
import Papa from 'papaparse';

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

function OutputMatrix({ outputMatrix, matrixSize}) 
{
  // const [isPythonRunnerDone, setIsPythonRunnerDone] = useState(false); 
  // usePythonRunner(submittedMatrix, setOutputMatrix, setIsPythonRunnerDone, inputMatrixType);

  // if (!isPythonRunnerDone) {
  //   return (
  //     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
  //       <ClipLoader color={"#123abc"} loading={true} size={50} />
  //       <p style={{ marginTop: '10px' }}>Loading Program...</p>
  //     </div>
  //   );
  // }
  
  // if(!outputMatrix && submittedMatrix)
  // { //This causes the div to appear when the matrix is submitted but the python runner is not done,
  //   //so it won't appear before any matrix is submitted (first render)
  //   return (
  //     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
  //       <ClipLoader color={"#123abc"} loading={true} size={50} />
  //       <p style={{ marginTop: '10px' }}>Calculating Matrix...</p>
  //     </div>
  //   );
  // }
  
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
      // setMatrixSizeInput('');

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

export default function Game() {
  
  const [submittedMatrix, setSubmittedMatrix] = useState('');
  const [outputMatrix, setOutputMatrix] = useState('');
  const [inputMatrixType, setInputMatrixType] = useState('Migration');
  const [isPythonRunnerDone, setIsPythonRunnerDone] = useState(false); 
  
  usePythonRunner(submittedMatrix, setOutputMatrix, setIsPythonRunnerDone, inputMatrixType);

  if (!isPythonRunnerDone) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
      height: '100vh' }}>
      <ClipLoader color={"#123abc"} loading={true} size={150} />
      <p style={{ marginTop: '10px' , fontSize: '20px' }}>Loading Program...</p>
    </div>
    );
  }
  
  
  const onSubmit = (event, matrix) =>
  {
    event.preventDefault();
    setOutputMatrix('');
    console.log(matrix);
    const newMatrix = matrix.map(row=>[...row]);
    setSubmittedMatrix(newMatrix);
    
  }
  
  const handleDropdownChange = (e) => {
      setInputMatrixType(e.target.value);
    }
    
  const downloadOutputMatrix = () => {
    const csv = Papa.unparse(outputMatrix);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'output_matrix.csv';
    link.href = url;
    link.click();
  }
    
  const displayCalculatingMatrix = 
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <ClipLoader color={"#123abc"} loading={true} size={50} />
      <p style={{ marginTop: '10px' }}>Calculating Matrix...</p>
    </div>;
  
  const displayOutputMatrix = 
  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2>Output Matrix</h2>
        <div style={{ borderCollapse: 'collapse', margin: '0 auto' }}>
          <OutputMatrix  outputMatrix={outputMatrix} matrixSize={submittedMatrix.length} /> 
          {submittedMatrix && <button onClick={downloadOutputMatrix}>Download Output Matrix</button>}
        </div>
        </div>;
  
  
  const displayOutput = (!outputMatrix && submittedMatrix) ? displayCalculatingMatrix: displayOutputMatrix;
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <h4>Matrix Type</h4>
        <select value={inputMatrixType} onChange={handleDropdownChange} style={{ marginLeft: '10px' }}>
          <option value="Fst">Fst</option>
          <option value="Migration">Migration</option>
        </select>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <div style={{ borderCollapse: 'collapse', margin: '0 auto' }}>
          <InputMatrixForm onSubmit={onSubmit}/>
        </div>
      </div>
      {displayOutput};
    </div>
  );
    
}