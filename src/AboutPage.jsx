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
            <Typography variant="h3" color="GrayText">About Our Software</Typography>
          </Grid>
          <Grid item>
            <Typography color="darkslategrey" style={{maxWidth:"70%", wordWrap:"break-word"}}>
              {`This document describes the scientfic background of our software and how it can be used to explore the \
                connection between`} <InlineMath math="F_{st}"/> {`and Migration in subpopultaions of wild species.`}   
            </Typography>
          </Grid>
          <Grid item> 
            <Typography variant="h4" id="setting" color="GrayText">Setting</Typography>
          </Grid>
          <Grid item>
            <Typography color="darkslategrey" style={{maxWidth:"70%", wordWrap:"break-word"}}>
                {`In our model, we consider a set of subpopulations of size`} <InlineMath math = 
                "n \in \mathbf {N}"/>{", each of size"} <InlineMath math = "N"/> 
                {` diploid individuals. For a set of subpopulations, we can construct three matrices: `} 
                <ol>
                  <li style={{marginBottom:"1vmin"}}>
                    {"A pariwiswe"} <InlineMath math="F_{st}"/> 
                    {" matrix ("}<InlineMath math="F" />{"), which is a is a squared symmetrical matrix with "}  
                    {"zeroes on the diagonal, in which entry ["}<InlineMath math = "i, j"/>{"] "} 
                    {`represenets the`} <InlineMath math="F_{st}"/> {`value between subpopulation`} <InlineMath math = "i" /> 
                    {" and subpopulation"} <InlineMath math = "j" />{"."} 
                  </li>
                  <li style={{marginBottom:"1vmin"}}>
                    {"A pairwise coalescence times matrix ("}<InlineMath math="T"/>{") which is a squared, "} 
                    {"non-negative, symmetrical matrix in which entry ["}<InlineMath math="i, j"/>
                    {"] is the expected coalescence time of a randomly sampled gene lineage from subpopulation "}
                    <InlineMath math ="i"/> {" and a randomly sampled gene lineage from subpopulation"} <InlineMath math="j"/>
                     {" and entry ["}<InlineMath math="i, i"/>{"] is the expected coalescence time of two"} 
                     {" randomly sampled gene lineages from subpopulation"} <InlineMath math="i"/>{"."}
                  </li>
                  <li>
                    {"A migration matrix, which is a squared, non-negative matrix with zeroes on the diagonal ("}
                    <InlineMath math="M"/>{"), where entry ["}<InlineMath math="i, j"/>{"] represents the"}
                    {" average number of individuals that migrate from subpopulation "}<InlineMath math="j"/>
                    {" to subpopulation"} <InlineMath math="i"/>{" in each generation. The "}
                     <InlineMath math="M"/>{" matrix is not necessarily symmetrical, because migration may be"}
                     {" asymmetrical (e.g., more migration from "}<InlineMath math="i"/>{" to "}<InlineMath math="j"/>
                     {" than the other way around). Our model assumes the migration matrix is conservative, "}
                     {"meaning the overall incoming and outgoing migration is equal for each subpopulation. "}
                     {"In other words, we assume that for each "}<InlineMath math="i \in n"/>
                     {", the sum of the entries in row "}<InlineMath math="i"/>{" is equal to the sum of the entries in column "}
                      <InlineMath math="i"/>{"."}
                  </li>
                </ol>
                {"Under our model, the connection between "}<InlineMath math="M"/>{" and "}<InlineMath math="T"/>
                {" is given by a linear system of equations developed by "} 
                <a href="https://www.cambridge.org/core/journals/advances-in-applied-probability/article/abs/coalescence-times-and-fst-values-in-subdivided-populations-with-symmetric-structure/62A13681772FA4282808954FB45F16AA" target="_blank" rel="noopener noreferrer">Wilkinson-Herbots (2003)</a> 
                {" and the connection between "}<InlineMath math="T"/>{" and "}<InlineMath math="F"/>
                {" is given by a non-linear system of equations developed by "}
                <a href="https://www.cambridge.org/core/journals/genetics-research/article/inbreeding-coefficients-and-coalescence-times/FCC418CBC6F021B741C83FDE6A0E7558" target="_blank" rel="noopener noreferrer">Slatkin (1991)</a>  
                {". Combining these two systems of equations, we can calculate the "}<InlineMath math="F_{st}"/>
                {" matrix given the migration matrix. However, given an "}<InlineMath math="F_{st}"/>
                {" matrix there are usually infinte possible corresponding migration matrices. Our software "}
                {"offers two different tools: one takes as input a migration matrix and gives the corresponding "}
                {"distinct "}<InlineMath math="F_{st}"/>{" matrix, and the other takes as input an "}<InlineMath math="F_{st}"/>
                {" matrix and gives possible corresponding migration matrices and summary statistics "}
                {"for the results."}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h4" id="migrationToFst" color="GrayText">
              <>Migration {rightArrow} <InlineMath math="F_{st}"/></>
            </Typography>
          </Grid>
          <Grid item>
            <Typography color="darkslategrey" style={{maxWidth:"70%", wordWrap:"break-word"}}>
              {`This tool takes as input a conservative migration matrix and gives the corresponding distinct `} 
              <InlineMath math="F_{st}"/> {` matrix. The `} 
              <InlineMath math="F_{st}"/> {` matrix is calculated by first solving the linear system of equations developed by Wilkinson-Herbots (2003)`}
              {", which results the corresponding coalescnce times matrix, and then solving the non-linear system of equations developed by Slatkin (1991) "}
              {" with the coalescence times matrix. A solution is guranteed only if the migration matrix is conservative!"}
              {" Providing a non-conservative migration matrix violates the assumptions of our model and might cause an error."}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h4" id="fstToMigration" color="GrayText">
              {<><InlineMath math="F_{st}"/> {rightArrow} Migration</>}
            </Typography>
          </Grid>
          <Grid item>
            <Typography color="darkslategrey" style={{maxWidth:"70%", wordWrap:"break-word"}}>
              {`This tool takes as input an `}<InlineMath math="F_{st}"/> {` matrix and gives possible corresponding migration matrices and summary statistics for the results. `}
              {"The migration matrices can be inferred using two different methods: the 'Direct' method constructs "}
              {"the full reverse transfomration from "}<InlineMath math="F_{st}"/> {"to migration and solves "}
              {"this non-linear system of equations numerically. Each run results a different solution becuase"}
              {" a random starting point is given to the numerical solver. The 'Indirect' method first constructs "}
              {"the reverse transformation from"} <InlineMath math="F_{st}"/> {"to coalescence times and solves "}
              {"this non-linear system of equations numerically. Then, the migration matrix is calculated analitcally from the "}
              {"coalescence times matrix using the reverse transformation from coalescence times to migration, "}
              {"with the addition of equations to enforce conservative migration. Each run results a different solution becuase"}
              {" a random starting point is given to the numerical solver when solving the transformation from"} <InlineMath math="F_{st}"/> {"to coalescence times."}
              {" Note that for both methods, the result migration matrix might not be conservarive (even if the input "}
              <InlineMath math="F_{st}"/> {" matrix originated from a conservative migration matrix), "} 
              {" becuase the solution is not guranteed to be optimal "}
              {" for the given "}<InlineMath math="F_{st}"/> {" matrix."}
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
        Wilkinson-Herbots, H.M. (2003). Coalescence times and F<sub>ST</sub> values in subdivided populations with symmetric structure. <i>Advances in Applied Probability</i>, 35(2), 474-491. Available at: <a href="https://www.cambridge.org/core/journals/advances-in-applied-probability/article/abs/coalescence-times-and-fst-values-in-subdivided-populations-with-symmetric-structure/62A13681772FA4282808954FB45F16AA" target="_blank" rel="noopener noreferrer">Cambridge University</a>
      </li>
      <li>
        Slatkin, M. (1991). Inbreeding coefficients and coalescence times. <i>Genetic Research</i>, 58(2), 167-175. Available at: <a href="https://www.cambridge.org/core/journals/genetics-research/article/inbreeding-coefficients-and-coalescence-times/FCC418CBC6F021B741C83FDE6A0E7558" target="_blank" rel="noopener noreferrer">Cambridge University</a>
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
    This software was developed at <a href="https://greenbaumlab.com" target="_blank" rel="noopener noreferrer">Greenbaum Lab</a> by:
    <ul>
      <li>Eyal Haluts</li>
      <li>Keith Harris</li>
      <li>Gili Greenbaum</li>
    </ul>
    For any questions, you can send an email to: <a href="mailto:eyal.haluts@mail.huji.ac.il">eyal.haluts@mail.huji.ac.il</a>
  </Typography>
</Grid>
        </Grid>
      </div>
    </ThemeProvider>
    </div>
  );
};

export default About;