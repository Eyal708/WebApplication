import { ClipLoader } from "react-spinners";
import { InlineMath } from "react-katex";
export const rightArrow =  "\u2192";
export const fst = <InlineMath math="F_{st}" />
const i = <InlineMath math="i" />
export const migrationExplanation = <> This tool generates the (unique) pairwise {fst} matrix that corresponds to an input migration matrix. The migration {rightArrow} {fst} transformation 
is done by using migration {rightArrow} coalescence equations (Wilkinson-Herbots, 2003), and then applying coalescence {rightArrow} {fst} equations (Slatkin, 1991). 
The migration matrix must be a squared, positive matrix with zeros on the diagonal. The migration matrix must also be conservative, meaning the sum of row {i} is equal to the sum of 
column {i} for {<InlineMath math="i=1,2,...,n"/>}. If the migration matrix is not conservative, a solution is not guaranteed! More information in `About This Software’.</>;

export const fstExplanation = <>This tool generates migration matrices that correspond to an input pairwise {fst} matrix. The {fst} {rightArrow} migration transformation is done by reversing 
coalescence {rightArrow} {fst} equations (Slatkin, 1991), and then reversing migration {rightArrow} coalescence equations (Wilkinson-Herbots, 2003). 
Two options for utilizing these equations are available: (i) 'Direct', in which the reverse transformation {fst} {rightArrow} migration is directly solved numerically, randomly selecting a starting point for the numerical solution;
(ii) 'Indirect'- first the {fst}  {rightArrow} coalescence transformation is solved numerically with a random starting point, and then the  coalescence {rightArrow} migration transformation is solved analytically. 
By selecting 'Multiple Runs', you can run the selected method on your input {fst} matrix multiple times, using different starting points for the numerical solution, generating several possible migration matrices. 
Summary statistics of multiple matrices can be viewed and downloaded on the `statistics page’. More information in `About This Software’. </>;
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
