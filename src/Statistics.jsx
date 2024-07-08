import {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import OutputMatrix from './OutputMatrix';
import { Grid} from '@material-ui/core'
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import './index.css';
import LogoHeader from './LogoHeader';
import SideMenu from './SideMenu';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';
import Tooltip from '@material-ui/core/Tooltip';
import Papa from 'papaparse';
import JSZip from 'jszip';
import {CLIP_LOADER} from './constants';
function StatisticsPage(){
    //result matrices is any array of 2d arrays representing squared matrices. 
    // This page should disaply the matrix which is the average of all the matrices in the array.
    // When hovered over a cell, the user should see the standard deviation of the values in that cell.
    // The user should also be able to download the average matrix as a csv file.

    // The average matrix should be calculated as follows:
    // For each cell in the matrix, calculate the average of the values in that cell across all matrices 
    // in the array.
    // The standard deviation of the values in a cell should be calculated as follows:
    // For each matrix in the array, calculate the difference between the value in the cell and the average
    // value in that cell. Square this difference. Sum all these squared differences. Divide by the number of
    // matrices in the array. Take the square root of this value.
    // The standard deviation should be displayed to 2 decimal places.
    // The average matrix should be displayed to 2 decimal places.
    const [resultMatrices, setResultMatrices] = useState([]); // An array of 2d arrays representing squared matrices
    const [averageMatrix, setAverageMatrix] = useState([]);
    const [edgeMatrix, setEdgeMatrix] = useState([]); // Will show in how many matrices the edge exists
    const [edgeThreshold, setEdgeThreshold] = useState(0); // The minimun value for the edge to be considered
    const [standardDeviations, setStandardDeviations] = useState([]);
    const [buttonClicked, setButtonClicked] = useState(0);
    const [matrixIndex, setMatrixIndex] = useState(0); // The index of the matrix to show in the resultMatrices array
    const [resultMatrixToShow, setResultMatrixToShow] = useState([]);
    const [statToShow, setStatToShow] = useState("average");

    useEffect(() => {
        // Calculate the average matrix and standard deviations when the resultMatrices array changes
        // Use the setAverageMatrix and setStandardDeviations functions to update the state 
        // of the averageMatrix and standardDeviations variables
        const queryParams = new URLSearchParams(window.location.search);
        const uniqueId = queryParams.get('data')

        if (!uniqueId) return;

        // Retrieve the stored data using the unique ID
        const storedData = localStorage.getItem(uniqueId);
        const resultMatrices = storedData ? JSON.parse(storedData) : [];
        console.log("Result matrices after loading from storage", resultMatrices);
        setResultMatrices(resultMatrices);
        localStorage.removeItem(uniqueId);

        if (resultMatrices.length === 0) return;
        console.log("Result matrices after checking length", resultMatrices);
        
        let localAverageMatrix = [];
        let localStandardDeviations = [];
        //set localedgeMatrix as a matrix of zeros same size as the first matrix in result matrices
        let localEdgeMatrix = Array.from({length: resultMatrices[0].length}, () => 
                                        Array.from({length: resultMatrices[0][0].length}, () => 0));
        console.log("Result matrices after cheking ResultMatrices[0].length", resultMatrices);
        for (let i = 0; i < resultMatrices[0].length; i++) {
            localAverageMatrix.push([]);
            localStandardDeviations.push([]);
            for (let j = 0; j < resultMatrices[0][0].length; j++) {
                let sum = 0;
                for (let k = 0; k < resultMatrices.length; k++) {
                    sum += resultMatrices[k][i][j];
                    if (resultMatrices[k][i][j] > edgeThreshold) {
                        localEdgeMatrix[i][j] += 1;
                    }
                }
                //calculate the fraction of matrices in which the edge exists
                localEdgeMatrix[i][j] = Math.round((localEdgeMatrix[i][j] / resultMatrices.length) * 100) / 100;
                //round to two digits
                localAverageMatrix[i].push(Math.round((sum / resultMatrices.length) * 100) / 100);
                let squaredDifferences = 0;
                for (let k = 0; k < resultMatrices.length; k++) {
                    squaredDifferences += Math.pow(resultMatrices[k][i][j] - localAverageMatrix[i][j], 2);
                }
                localStandardDeviations[i].push(Math.round(Math.sqrt
                                                (squaredDifferences / resultMatrices.length) * 100) / 100);
            }
        }
        console.log(localAverageMatrix);
        setAverageMatrix(localAverageMatrix);
        setStandardDeviations(localStandardDeviations);
        setEdgeMatrix(localEdgeMatrix);
        setResultMatrixToShow(resultMatrices[matrixIndex]);
        console.log("Ended calculation!");
    }, []);
   
    const determineStatToShow = () => {
        if (!averageMatrix || !edgeMatrix || !resultMatrixToShow) return CLIP_LOADER;
        switch (statToShow) {
            case "average":
                return averageMatrix && <OutputMatrix outputMatrix={averageMatrix} 
                                        matrixSize={averageMatrix.length} extraStats={standardDeviations} />;
            case "edge":
                return edgeMatrix && <OutputMatrix outputMatrix={edgeMatrix} matrixSize={edgeMatrix.length} />;
            case "result":
                return resultMatrixToShow && <OutputMatrix outputMatrix={resultMatrixToShow} matrixSize={resultMatrixToShow.length} />;
            default:
                return CLIP_LOADER; // Assuming clipLoader is defined elsewhere as a loading indicator
        }
    };

    const onStatClick = (buttonIndex) => {
        setButtonClicked(buttonIndex);
        if (buttonIndex === 0) {
            setStatToShow("average");
        } else if (buttonIndex === 1) {
            setStatToShow("edge");
        } else if (buttonIndex === 2) {
            setStatToShow("result");
        }
    }
    
    const onLeftClick = () => {
        let newMatrixIndex = matrixIndex
        if (matrixIndex > 0) {
            newMatrixIndex = matrixIndex - 1;
        }
        else{
            newMatrixIndex = resultMatrices.length - 1;
        }
        setMatrixIndex(newMatrixIndex);
        setResultMatrixToShow(resultMatrices[newMatrixIndex])
    }

    const onRightClick = () => {
        let newMatrixIndex = matrixIndex 
        if (matrixIndex < resultMatrices.length - 1) {
            newMatrixIndex = matrixIndex + 1;
        }
        else{
            newMatrixIndex = 0;
        }
        setMatrixIndex(newMatrixIndex);
        setResultMatrixToShow(resultMatrices[newMatrixIndex])
    }

    const downloadStatistics = () => {
        const zip = new JSZip();
        const avg_matrix_csv = Papa.unparse(averageMatrix);
        const std_matrix_csv = Papa.unparse(standardDeviations);
        const edge_matrix_csv = Papa.unparse(edgeMatrix);
        zip.file('average_matrix.csv', avg_matrix_csv);
        zip.file('std_matrix.csv', std_matrix_csv);
        zip.file('edge_matrix.csv', edge_matrix_csv);
        
        // Generate the zip file and trigger the download
        zip.generateAsync({ type: 'blob' }).then(blob => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = 'statistics.zip';
          link.href = url;
          link.click();
        });
      };

    const useStyles = makeStyles((theme) => ({
        tooltip: {
          fontSize: "2vmin", // adjust this value to make the tooltip text bigger
        },
      }));
    
    const classes = useStyles()
    
    return(
        <div>
            <LogoHeader/>
            <SideMenu/>
            <Grid container direction="row" justifyContent="center" alignItems="center" spacing={10}>
                <Grid item>
                    <Grid container direction="column" justifyContent="center" alignItems="center">
                        <Grid item>
                            <ButtonGroup orientation='vertical' size = "large" color="primary" variant='contained'>
                                <ButtonGroup orientation='horizontal' size = 'large' color="primary" 
                                                variant='contained'>
                                <Button disabled color="primary" style={{color:"black", fontSize:"5vmin"}} >
                                                        Statistics</Button>
                                <Tooltip title="Download statistics as a zip file" 
                                        classes={{ tooltip: classes.tooltip }} placement='top-left'> 
                                    <IconButton color = "primary" onClick={downloadStatistics}>
                                                <DownloadIcon style={{fontSize:"7vmin"}}/>
                                    </IconButton>
                                </Tooltip>
                                </ButtonGroup>
                                <Tooltip title="Each cell shows the average value of the edge across 
                                                all matrices. Hover on cell to see standard deviation"
                                                placement='left-end'
                                                 classes={{ tooltip: classes.tooltip }}>
                                    <Button color = {buttonClicked===0 ? "success":"primary"}
                                            onClick={()=>onStatClick(0)} style={{fontSize:"3vmin"}}> 
                                            Average Matrix </Button>
                                </Tooltip>

                                <Tooltip title="Each cell shows the fraction of matrices in 
                                                which the edge exists (meaning its value is greater than 0)"
                                                placement='left-end'
                                                classes={{ tooltip: classes.tooltip }}>
                                    <Button color = {buttonClicked===1 ? "success":"primary"} 
                                            onClick={()=>onStatClick(1)} style={{fontSize:"3vmin"}}>
                                            Edge Matrix </Button>
                                </Tooltip>

                                <Tooltip title="Toggle between matrices" placement="left-end" 
                                         classes={{ tooltip: classes.tooltip }}>
                                    <Button color = {buttonClicked===2 ? "success":"primary"} 
                                            onClick={()=>onStatClick(2)} style ={{fontSize:"3vmin"}}> 
                                            {`Show Matrices (${matrixIndex + 1})`} </Button>
                                </Tooltip>
                            </ButtonGroup>
                        </Grid>
                        <Grid item>
                            {buttonClicked === 2 && <ButtonGroup disableElevation orientation='horizontal' 
                                                    color="primary" variant = "text" size="small">
                                <Button onClick = {()=>onLeftClick()} 
                                        startIcon = {<ArrowLeftIcon style={{fontSize:"5vmin"}}/>}>  </Button>
                                <Button onClick={()=>onRightClick()}  
                                        startIcon = {<ArrowRightIcon style={{fontSize:"5vmin"}}/>}>  </Button>
                                </ButtonGroup>}
                        </Grid>  
                    </Grid>
                </Grid>
                <Grid item>
                    <Grid container direction="column" justifyContent="center" alignItems="center" 
                        style={{ minHeight: '100vh', display: 'flex' }}>
                        <Grid item style={{ borderCollapse: 'collapse', margin: '0 auto'}}>
                            {determineStatToShow()}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            
        </div>
        );
}
export default StatisticsPage;