import { ClipLoader } from "react-spinners";
export const rightArrow =  "\u2192";
export const fst = "F\u209B\u209C"; 
export const migrationExplanation = `This tool allows you to get the corresponding ${fst} matrix for a 
given migration matrix, according to Wilkinsion-Herbots (2003) and Slatkin (1991). The migration matrix
must be a squared, positive matrix with zeroes on the diagonal. The migration matrix must also be conservative,
meaning the sum of row i is equal to the sum of column i, for i = 1, 2, ..., n. If the migration matrix is not
conservative, a solution is not gurnateed! Go to "About Our Software" from the main menu for more information.`;
export const buttonStyle = {
      fontSize: '2vmin', // Adjust the text size according to the window size
      padding: '1vmin', // Add some padding to make the buttons larger than the text
    };
export const manualInputInfo = "You can manually enter a matrix of size 2-10. For larger matrices, please upload a csv file."
export const heatMapSize = 44;
export const FST_COLOR_BASE = '6, 107, 170';
export const MIGRATION_COLOR_BASE = '100, 180, 80';
export const MIGRATION_MATRIX = 'migrationMatrix';
export const CLIP_LOADER = <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', 
                                justifyContent: 'center' }}> <ClipLoader color={"#123abc"} loading={true} 
                                size = {`${10}vmin`} />
                          </div>;
