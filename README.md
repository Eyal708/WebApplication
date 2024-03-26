# Web application for running transformations between Fst and Migration matrices.
This is an interface implementation for the population_structure package: https://pypi.org/project/population-structure/
All the code for computing the transormations is ran locally on the user's browser.
## Migration -> Fst
The user is able to enter manually or upload as csv a **consrvative** migration matrix and get its corresponsing migration matrix 
according to Wilkinson-Herbots' equations (2003) and Slatkin's equations (1991).
## Fst -> Migration
The user is able to enter manually or upload as csv an Fst matrix. An Fst matrix could have a space of possible corresponding migration matrices,
so a **potential** corresponding migration matrix will be displayed. 
The user is able to choose between two methods for inferring a migration matrix: direct and indiect. The indirect method uses an intermediate step 
of finding a possible coalescence matrix (according to Slatkin's equations) and then use W.H set of linear equations to get the corresponding migration matrix.
The direct approach is an implementation of Xiran Liu's and Gili Greenbaum's paper, and it combines Slatkin's and W.H to one set of euqtions and infers a migration
matrix directly from the fst values.
Note that due to the random choice of a starting point for the numerical solver used for both methods, a different matrix will be displayed each time
for the same Fst matrix.
## A screen shot of the browser based application
![Screenshot 2024-02-20 220919](https://github.com/Eyal708/WebApplication/assets/101056608/eb1b5f20-8d30-4d37-9e2d-a71e2cd4fc65)



