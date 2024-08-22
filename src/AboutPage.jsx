import React from 'react';
import './About.css'; // Update the CSS file name if necessary
import { Grid, Typography } from '@mui/material';
import LogoHeader from './LogoHeader'; // Assuming this is a component
import SideMenu from './SideMenu'; // Assuming this is a component
import {fst, rightArrow} from './constants'; 
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ScrollMenu from './ScrollMenu';
const boldFst = <InlineMath math="\boldsymbol{F_{st}}" />;
// Create a theme instance and set the typography's font family
const theme = createTheme({

  typography: {
    fontFamily: [
      'Roboto',
      'sans-serif',
    ].join(','),
    fontSize: 16,

  },
});

// Wrap your component tree with the ThemeProvider and pass your theme
const About = () => {
  return (
    <div style={{ paddingBottom: '8vmin' }}>
      <ThemeProvider theme={theme}>
        <div>
          <LogoHeader />
          <SideMenu />
          <ScrollMenu />
          <Grid container spacing={2} className="about-container" direction="column" paddingLeft="15vmin" 
                paddingTop="8vmin">
            <Grid item>
              <Typography variant="h3" color="GrayText">About This Software</Typography>
            </Grid>
            <Grid item>
              <Typography color="darkslategrey" style={{maxWidth:"70%", wordWrap:"break-word"}}>
                {`This document describes the scientific background of this software and how it can be used to explore 
                the connection between pairwise`} {fst} {`and Migration in populations.`}
   
              </Typography>
            </Grid>
            <Grid item> 
              <Typography variant="h4" id="setting" color="GrayText">Setting</Typography>
            </Grid>
            <Grid item>
              <Typography color="darkslategrey" style={{maxWidth:"70%", wordWrap:"break-word"}}>
                  {`In our model, we consider a set of`} <InlineMath math = "n"/> {`subpopulations, each with the same number of individuals.
                   For a set of subpopulations, we can construct three matrices:`}
                  <ol>
                    <li style={{marginBottom:"1vmin"}}>
                      {"A pairwise"} <InlineMath math="F_{st}"/> 
                      {" matrix ("}<InlineMath math="F" />{"), which is a squared symmetric matrix with "}  
                      {"zeros on the diagonal, in which entry ["}<InlineMath math = "i, j"/>{"] "} 
                      {`represents the`} <InlineMath math="F_{st}"/> {`value between subpopulation`} <InlineMath math = "i" /> 
                      {" and subpopulation"} <InlineMath math = "j" />{"."} 
                    </li>
                    <li style={{marginBottom:"1vmin"}}>
                      {"A pairwise coalescence times matrix ("}<InlineMath math="T"/>{") which is a squared, "} 
                      {"non-negative, symmetrical matrix in which entry ["}<InlineMath math="i, j"/>
                      {"] is the expected coalescence time of a randomly sampled individual allele from subpopulation "}
                      <InlineMath math ="i"/> {" and a randomly sampled individual allele from subpopulation"} <InlineMath math="j"/>{"."}
                       {" The diagonal entries ["}<InlineMath math="i, i"/>{"] are the expected coalescence time of two"} 
                       {" randomly sampled individual alleles from subpopulation"} <InlineMath math="i"/>{"."}
                    </li>
                    <li>
                      {"A migration matrix, which is a squared, non-negative matrix with zeros on the diagonal ("}
                      <InlineMath math="M"/>{"), where entry ["}<InlineMath math="i, j"/>{"] represents the"}
                      {" number of individuals that migrate from subpopulation "}<InlineMath math="j"/>
                      {" to subpopulation"} <InlineMath math="i"/>{" in each generation. The "}
                       <InlineMath math="M"/>{" matrix is not necessarily symmetric, because migration may be"}
                       {" asymmetrical (e.g., more migration from "}<InlineMath math="i"/>{" to "}<InlineMath math="j"/>
                       {" than the other way around). To comply with the equations from Wilkinson-Herbots (2003), our model assumes the migration matrix is conservative, "} 
                       {"meaning the overall incoming and outgoing migration is equal for each subpopulation. "}
                       {"In other words, we assume that for each "}<InlineMath math="i"/>
                       {", the sum of the entries in row "}<InlineMath math="i"/>{" is equal to the sum of the entries in column "}
                        <InlineMath math="i"/>{"."}
                    </li>
                  </ol>
                  {"Under our model, the connection between "}<InlineMath math="M"/>{" and "}<InlineMath math="T"/>
                  {" is given by a linear system of equations developed by "} 
                  <a href="https://www.cambridge.org/core/journals/advances-in-applied-probability/article/abs/coalescence-times-and-fst-values-in-subdivided-populations-with-symmetric-structure/62A13681772FA4282808954FB45F16AA" target="_blank" rel="noopener noreferrer">Wilkinson-Herbots</a> 
                  {" [1] and the connection between "}<InlineMath math="T"/>{" and "}<InlineMath math="F"/>
                  {" is given by a nonlinear system of equations developed by "}
                  <a href="https://www.cambridge.org/core/journals/genetics-research/article/inbreeding-coefficients-and-coalescence-times/FCC418CBC6F021B741C83FDE6A0E7558" target="_blank" rel="noopener noreferrer">Slatkin</a>  
                  {" [2]. Combining these two systems of equations, we can compute the "}<InlineMath math="F_{st}"/>
                  {" matrix given the migration matrix. However, given an "}<InlineMath math="F_{st}"/>
                  {" matrix there are most often infinite possible corresponding migration matrices [3]. Our software "}
                  {"offers two different tools:"} 
                  <b> Migration {rightArrow} {boldFst} </b> 
                  {",  which takes as input a migration matrix and gives the corresponding unique "}{fst}{" matrix, and"}
                  <b> {boldFst} {rightArrow} Migration</b>{", which takes as input an "}{fst}{" matrix and gives possible corresponding migration matrices and summary statistics for the results "}
                  {" if multiple possible matrices are inferred."}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h4" id="migrationToFst" color="GrayText">
                <>Migration {rightArrow} <InlineMath math="F_{st}"/></>
              </Typography>
            </Grid>
            <Grid item>
              <Typography color="darkslategrey" style={{maxWidth:"70%", wordWrap:"break-word"}}>
                {`This tool generates the (unique) pairwise`} {fst} {` matrix that corresponds to an input migration matrix. The`}
                {` matrix is computed by first solving the linear system of migration → coalescence equations (Wilkinson-Herbots, 2003), which results the corresponding coalescence times matrix,`}
                {` and then solving the nonlinear system of coalescence →`} {fst} {` equations (Slatkin, 1991) with the coalescence times matrix.`}
                {` A solution is guaranteed only if the migration matrix is conservative! Providing a non-conservative migration matrix violates the assumptions of our model and might cause an error.`}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h4" id="fstToMigration" color="GrayText">
                {<><InlineMath math="F_{st}"/> {rightArrow} Migration</>}
              </Typography>
            </Grid>
            <Grid item>
              <Typography color="darkslategrey" style={{maxWidth:"70%", wordWrap:"break-word"}}>
                {`This tool generates migration matrices that correspond to an input pairwise`} {fst} {` matrix. The `} {fst} {rightArrow} {` migration transformation is done by reversing `} 
                {` coalescence `} {rightArrow} {fst} {` equations (Slatkin, 1991), and then reversing migration `} {rightArrow} {` coalescence equations (Wilkinson-Herbots, 2003). `} 
                {` Two options for utilizing these equations are available: (i) 'Direct', in which the reverse transformation `} {fst} {rightArrow} {` migration is directly solved numerically, randomly selecting a starting point for the numerical solution; `}
                {` (ii) 'Indirect'- first the `} {fst} {rightArrow} {` coalescence transformation is solved numerically with a random starting point, and then the  coalescence `} {rightArrow} {` migration transformation is solved analytically. `} 
                {` By selecting 'Multiple Runs', you can run the selected method on your input `} {fst} {` matrix multiple times, using different starting points for the numerical solution, generating several possible migration matrices. `} 
                {"Summary statistics of multiple matrices can be viewed and downloaded on the `statistics page’."} <br></br> {"Note that for both methods, the result migration matrix might not be conservative (even if the input"} {fst} {" matrix originated from a conservative migration matrix), "}
                {"because the solution is not guaranteed to be optimal for a given "} {fst} {" matrix."}
                </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h4" id="code" color="GrayText">
                Code
              </Typography>
            </Grid>
            
            <Grid item>
              <Typography color="darkslategrey" style={{maxWidth:"70%", wordWrap:"break-word"}}>
                The software is based on code available as a 
                <a href="https://pypi.org/project/population-structure/" target="_blank" rel="noopener noreferrer"> Python package.</a> You can also
                find the code in a <a href="https://github.com/Eyal708/population_structure_package" target="_blank" rel="noopener noreferrer">GitHub repository.</a>
              </Typography>
            </Grid>

            <Grid item>
              <Typography variant="h4" id="references" color="GrayText">
                References
              </Typography>
            </Grid>

            <Grid item>
              <Typography color="darkslategrey" style={{maxWidth:"70%", wordWrap:"break-word"}}>
                <ol>
                  <li>
                  Wilkinson-Herbots, HM  (2003). Coalescence times and F<sub>ST</sub> values in subdivided populations with symmetric structure. <i>Advances in Applied Probability</i>, 35(2), 474-491. 
                  </li>
                  <li>
                    Slatkin, M (1991). Inbreeding coefficients and coalescence times. <i>Genetic Research</i>, 58(2), 167-175. 
                  </li>
                  <li>
                    Liu X, Rosenberg NA, Greenbaum G (in prep) Can a migration matrix be inferred from a matrix of pairwise FST values? 
                  </li>
                </ol>
              </Typography>
            </Grid>

            <Grid item>
              <Typography variant="h4" id="credits" color="GrayText">
                Credits
              </Typography>
            </Grid>
            <Grid item>
              <Typography color="darkslategrey" style={{maxWidth:"70%", wordWrap:"break-word"}}>
                This software was developed at <a href="https://greenbaumlab.com" target="_blank" rel="noopener noreferrer">Greenbaum Lab</a> by
                Eyal Haluts, with the assistance of Keith Harris. <br/>
                For any questions, please send inquiries to: <a href="mailto:eyal.haluts@mail.huji.ac.il">eyal.haluts@mail.huji.ac.il</a>.
              </Typography>
            </Grid>
          </Grid>
        </div>
      </ThemeProvider>
    </div>
  );
};

export default About;