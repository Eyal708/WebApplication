import {useState, useEffect} from 'react';
import OutputMatrix from './OutputMatrix';
import { Grid } from '@material-ui/core'
import './index.css';
import LogoHeader from './LogoHeader';
import SideMenu from './SideMenu';

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
    const [standardDeviations, setStandardDeviations] = useState([]);
    useEffect(() => {
        // Calculate the average matrix and standard deviations when the resultMatrices array changes
        // Use the setAverageMatrix and setStandardDeviations functions to update the state 
        // of the averageMatrix and standardDeviations variables
        if (resultMatrices.length === 0) return
        let localAverageMatrix = [];
        let localStandardDeviations = [];
        for (let i = 0; i < resultMatrices[0].length; i++) {;
            localAverageMatrix.push([]);
            localStandardDeviations.push([]);
            for (let j = 0; j < resultMatrices[0][0].length; j++) {
                let sum = 0;
                for (let k = 0; k < resultMatrices.length; k++) {
                    sum += resultMatrices[k][i][j];
                }
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
    }, []);
    
    return(
        <div>
            <LogoHeader/>
            <SideMenu/>
            <Grid container direction="column" justifyContent="center" alignItems="center" 
                style={{ minHeight: '100vh', display: 'flex' }}>
                <Grid item style={{ borderCollapse: 'collapse', margin: '0 auto'}}>
                <OutputMatrix outputMatrix={averageMatrix} matrixSize={averageMatrix.length} isFst={false}
                            extraStats={standardDeviations} /> 
                </Grid>
            </Grid>
        </div>
        );
}
export default StatisticsPage;