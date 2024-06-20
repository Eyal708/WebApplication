import {useState, useEffect} from 'react';
import OutputMatrix from './OutputMatrix';
import { Grid} from '@material-ui/core'
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import './index.css';
import LogoHeader from './LogoHeader';
import SideMenu from './SideMenu';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
function StatisticsPage({resultMatrices}){
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
    const [averageMatrix, setAverageMatrix] = useState([]);
    const [edgeMatrix, setEdgeMatrix] = useState([]); // Will show in how many matrices the edge exists
    const [edgeThreshold, setEdgeThreshold] = useState(0); // The minimun value for the edge to be considered
    const [standardDeviations, setStandardDeviations] = useState([]);
    const [buttonClicked, setButtonClicked] = useState(0);
    const [matrixIndex, setMatrixIndex] = useState(0); // The index of the matrix to show in the resultMatrices array
    const [reusltMatrixToShow, setResultMatrixToShow] = useState([]);
    const [statToShow, setStatToShow] = useState("");

    useEffect(() => {
        // Calculate the average matrix and standard deviations when the resultMatrices array changes
        // Use the setAverageMatrix and setStandardDeviations functions to update the state 
        // of the averageMatrix and standardDeviations variables
        if (resultMatrices.length === 0) return;
        let localAverageMatrix = [];
        let localStandardDeviations = [];
        //set localedgeMatrix as a matrix of zeros same size as the first matrix in result matrices
        let localEdgeMatrix = Array.from({length: resultMatrices[0].length}, () => 
                                        Array.from({length: resultMatrices[0][0].length}, () => 0));
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
        setAverageMatrix(localAverageMatrix);
        setStandardDeviations(localStandardDeviations);
        setEdgeMatrix(localEdgeMatrix);
    }, []);
    
    // This component should return a menu with a few buttons stacked on top of each other.
    // When a button is clicked, it changes color and decides which statsitc to show.
    // The buttons are: Average Matrix, Edge Matrix, Show Matrices. 
    const showAvgMatrix = <OutputMatrix outputMatrix={averageMatrix} matrixSize={averageMatrix.length} 
                                        isFst={false} extraStats={standardDeviations} />;
     
    const showEdgeMatrix = <OutputMatrix outputMatrix={edgeMatrix} matrixSize={edgeMatrix.length}
                            isFst={false}/>;
    
    const showResultMatrix = resultMatrices.length > 0 &&
                                            <OutputMatrix outputMatrix={reusltMatrixToShow} 
                                                          matrixSize={reusltMatrixToShow.length}/>

    const onStatClick = (buttonIndex) => {
        setButtonClicked(buttonIndex);
        if (buttonIndex === 0) {
            setStatToShow(showAvgMatrix);
        } else if (buttonIndex === 1) {
            setStatToShow(showEdgeMatrix);
        } else if (buttonIndex === 2) {
            setStatToShow(showResultMatrix);
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
    // This makes the component re render when average matrix is calculated
    useEffect(() => {
        setStatToShow(showAvgMatrix);
    }, [averageMatrix, standardDeviations]);

    useEffect(() => {
        setResultMatrixToShow(resultMatrices[matrixIndex]);
        setStatToShow(showResultMatrix);
    }, [matrixIndex]);
    return(
        <div>
            <LogoHeader/>
            <SideMenu/>
            <Grid container direction="row" justifyContent="center" alignItems="center" spacing={1}>
                <Grid item>
                    <Grid container direction="column" justifyContent="center" alignItems="center">
                        <Grid item>
                            <ButtonGroup orientation='vertical' size = "large" color="primary" variant='contained'>
                                <Button   disabled color="primary" style={{color:"black"}} > Statistics </Button>
                                <Button color = {buttonClicked===0 ? "success":"primary"} onClick={()=>onStatClick(0)}> 
                                        Average Matrix </Button>
                                <Button color = {buttonClicked===1 ? "success":"primary"} onClick={()=>onStatClick(1)}>
                                        Edge Matrix </Button>
                                <Button color = {buttonClicked===2 ? "success":"primary"} onClick={()=>onStatClick(2)}> 
                                        {`Show Matrices (${matrixIndex + 1})`} </Button>
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
                            {statToShow}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            
        </div>
        );
}
export default StatisticsPage;