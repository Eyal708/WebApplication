import {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import OutputMatrix from './OutputMatrix';
import { Grid} from '@material-ui/core'
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import './index.css';
import LogoHeader from './LogoHeader';
import SideMenu from './SideMenu';
import ArrowRightIcon from '@mui/icons-material/SkipNext';
import ArrowLeftIcon from '@mui/icons-material/SkipPrevious';
import IconButton from '@mui/material/IconButton';
import DownloadIcon from '@mui/icons-material/Download';
import Tooltip from '@material-ui/core/Tooltip';
import Papa from 'papaparse';
import JSZip from 'jszip';
import {CLIP_LOADER} from './constants';
import Typography from '@material-ui/core/Typography';
function StatisticsPage(){
    
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
        setResultMatrices(resultMatrices);
        localStorage.removeItem(uniqueId);

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
        console.log(localAverageMatrix);
        setAverageMatrix(localAverageMatrix);
        setStandardDeviations(localStandardDeviations);
        setEdgeMatrix(localEdgeMatrix);
        setResultMatrixToShow(resultMatrices[matrixIndex]);
        console.log("Ended calculation!");
    }, []);
   
    const determineStatToShow = () => {
        console.log("Determining stat to show");
        if (!averageMatrix || !edgeMatrix || !resultMatrixToShow) return CLIP_LOADER;
        switch (statToShow) {
            case "average":
                return averageMatrix && <OutputMatrix outputMatrix={averageMatrix} 
                                        matrixSize={averageMatrix.length} extraStats={standardDeviations} />;
            case "edge":
                return edgeMatrix && <OutputMatrix outputMatrix={edgeMatrix} matrixSize={edgeMatrix.length} />;
            case "result":
                return resultMatrixToShow && <OutputMatrix outputMatrix={resultMatrixToShow} 
                                                           matrixSize={resultMatrixToShow.length} />;
            default:
                return CLIP_LOADER; 
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
        menu: {
            position: 'fixed',
            top: '9vmin', 
            left: '1vmin',
            display: 'flex',
            minWidth: '23vw',
            maxWidth: '23vw',
            flexDirection: 'column',
            backgroundColor: 'white', // Optional: Add background color to the menu for better visibility
            padding: theme.spacing(2), // Optional: Add some padding around the menu items
            borderRadius: theme.shape.borderRadius, // Optional: Round the corners of the menu
            boxShadow: theme.shadows[6], // Optional: Add shadow to the menu for a lifted effect
        },

        title: {
            marginBottom: theme.spacing(2), // Space between title and first menu item
            fontSize: '6.5vmin', // Increase font size for bigger headline
            color: 'black', // Change color, example uses Material-UI's primary color
            fontFamily: 'Roboto, sans-serif', // Correct font family
            align:"center"
        },
        
        menuItem: {
            margin: theme.spacing(2),
            fontSize: '3.5vmin', // Correct font size
            fontFamily: 'Roboto, sans-serif', // Correct font family
            '&:hover': {
            cursor: 'pointer',
            textDecoration: 'underline',
            },
        },

        tooltip: {
            fontSize: "2vmin",
        },
    }));

    const classes = useStyles();
    
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <LogoHeader />
            <SideMenu />
            <Grid container direction="column" justifyContent="center" alignItems="center" 
                        alignContent='center' spacing={1} style={{paddingLeft:"5vmin"}}>
                <Grid item style={{ borderCollapse: 'collapse', margin: '0 auto' }}>
                    {determineStatToShow()}
                </Grid>

                <Grid item>
                {buttonClicked === 2 && (
                <ButtonGroup disableElevation orientation="horizontal" color="success" variant="text" size="small" style={{ border: 'none' }}>
                    <Button onClick={() => onLeftClick()} startIcon={<ArrowLeftIcon style={{ fontSize: "8vmin" }} />} style={{ borderRight: 'none', padding:'0px' }} />
                    <Button onClick={() => onRightClick()} startIcon={<ArrowRightIcon style={{ fontSize: "8vmin" }} />} style={{ borderLeft: 'none', padding:'0px' }} />
                </ButtonGroup>
            )}
                </Grid>
            </Grid>
            
            <div className={classes.menu}>
                <Grid container direction='column' alignItems='center'>
                    <Grid item>
                        <Typography variant="h6" className = {classes.title} >
                            Statistics
                        </Typography>
                    </Grid>
                    <Grid item container direction='column'>
                        <Tooltip
                            title="Each cell shows the average value of the edge across all matrices. Hover over a cell to see the standard deviation."
                            placement="right"
                            classes={{ tooltip: classes.tooltip }}>
                            <Button
                                className={classes.menuItem}
                                color={buttonClicked === 0 ? "success" : "primary"}
                                onClick={() => onStatClick(0)}
                                style={{ textTransform:'none', fontSize:'3.5vmin'}}>
                                Average Matrix
                            </Button>
                        </Tooltip>  
                        <Tooltip
                            title="Each cell shows the fraction of matrices in which the edge exists (meaning its value is greater than 0)."
                            placement="right"
                            classes={{ tooltip: classes.tooltip }}>
                            <Button
                                className={classes.menuItem}
                                color={buttonClicked === 1 ? "success" : "primary"}
                                onClick={() => onStatClick(1)}
                                style={{ textTransform:'none', fontSize:"3.5vmin"}}>
                                Edge Matrix
                            </Button>
                        </Tooltip>
                        <Tooltip title="Toggle between result matrices." placement="right" classes={{ tooltip: classes.tooltip }}>
                            <Button className={classes.menuItem}
                                color={buttonClicked === 2 ? "success" : "primary"}
                                onClick={() => onStatClick(2)}
                                style={{ textTransform : 'none', fontSize:"3.5vmin" }}>
                                {`Show Result Matrices (${matrixIndex + 1})`}
                            </Button>
                        </Tooltip>
                        <Tooltip
                            title="Download statistics as a zip file."
                            classes={{ tooltip: classes.tooltip }}
                            placement="right">
                            <IconButton color="default" onClick={downloadStatistics}>
                                <DownloadIcon style={{ fontSize: "7.5vmin" }} />
                            </IconButton>
                        </Tooltip>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
}
export default StatisticsPage;