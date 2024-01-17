import numpy as np
import scipy as sp
import json
import math
from scipy.optimize import least_squares, minimize
from collections import deque

class Migration:
    def __init__(self, matrix: np.ndarray) -> None:
        """
        Initialize a migration matrix object
        :param matrix: input migration matrix
        """
        self.matrix = matrix
        self.shape = matrix.shape[0]

    def produce_coalescence(self) -> np.ndarray:
        """
        produces and returns the corresponding coalescence matrix
        :return: The corresponding coalescence matrix
        """
        A = self.produce_coefficient_matrix()
        b = self.produce_solution_vector()
        x = np.linalg.solve(A, b)
        T_mat = np.zeros((self.shape, self.shape))
        cur_ind = 0
        for i in range(self.shape):
            for j in range(i, self.shape):
                T_mat[i, j] = x[cur_ind]
                T_mat[j, i] = x[cur_ind]
                cur_ind += 1
        return T_mat

    def calculate_first_coefficients(self, j: int, i: int, same_pop: int, lower_bound: int, upper_bound: int,
                                     p_list: list, counter: list) -> float:
        """
        calculates the coefficients for the first n equations
        :param j: column of coefficient matrx
        :param i: row of coefficient matrix
        :param same_pop: The column corresponding to T(i,i)
        :param lower_bound: j values in range [lower_bound, upper_bound] correspond to coefficient -M(i,i+counter)
        :param upper_bound: j values in range [lower_bound, upper_bound] correspond to coefficient -M(i,i+counter)
        :param p_list: all values that are smaller than i
        :param counter: counts the number of time j was in the interval [lower_bound,upper_bound]
        :return: The coefficient in place [i,j], for i in [n-1]
        """
        n = self.matrix.shape[0]
        if j == same_pop:
            return 1 + np.sum(self.matrix[i, :])
        if lower_bound <= j <= upper_bound:
            counter[0] += 1
            return -1 * self.matrix[i, i + counter[0] - 1]
        for p in p_list:
            if j == (i - p) + np.sum([n - k for k in range(p)]):
                return -1 * self.matrix[i, p]
        return 0

    def calculate_last_coefficients(self, j, cur_pop, other_pop) -> float:
        """
        calculates the coefficients for the last (n choose 2) rows in the coefficient matrx
        :param j: the column in the coefficient matrix
        :param cur_pop: the index of the population that corresponds to the current value
        :param other_pop: the index of the other population that corresponds to the current value
        :return: The coefficient in the coefficient matrix according to certain conditions deduced from
        Wilkinson-Herbots' equations.
        """
        n = self.matrix.shape[0]
        if j == np.sum([n - k for k in range(other_pop)]) + (cur_pop - other_pop):
            return float(np.sum(self.matrix[[cur_pop, other_pop], :]))
        for p in range(n):
            for t in [other_pop, cur_pop]:
                if t == other_pop:
                    not_t = cur_pop
                else:
                    not_t = other_pop
                if p != not_t:
                    min_t_p = min(t, p)
                    max_t_p = max(t, p)
                    if j == np.sum([n - k for k in range(min_t_p)]) + max_t_p - min_t_p:
                        return -1 * self.matrix[not_t, p]
        return 0

    def produce_coefficient_matrix(self) -> np.ndarray:
        """
        produce and return the coefficient matrix used to calculate the T matrix(coalescence).
        :return: Coefficient matrix corresponding to object's migration matrix
        """
        n = self.shape
        n_last_equations = comb(n, 2)
        n_first_equations = n
        mat_size = n_first_equations + n_last_equations
        coefficient_mat = np.zeros((mat_size, mat_size))
        for i in range(n_first_equations):
            same_population = int(np.sum([n - k for k in range(i)]))
            lower_bound = same_population + 1
            upper_bound = np.sum([n - k for k in range(i + 1)]) - 1
            smaller_ind_lst = [p for p in range(i)]
            counter = [1]
            for j in range(mat_size):
                coefficient_mat[i, j] = self.calculate_first_coefficients(j, i, same_population, lower_bound,
                                                                          upper_bound, smaller_ind_lst, counter)
        cur_population = 1
        other_population = 0
        for i in range(n_last_equations):
            if other_population == cur_population:
                other_population = 0
                cur_population += 1
            for j in range(mat_size):
                coefficient_mat[n + i, j] = self.calculate_last_coefficients(j, cur_population, other_population)
            other_population += 1

        return coefficient_mat

    def produce_solution_vector(self):
        """
        produce the solution vector(b), according to Wilkinson-Herbot's equations
        :return: solution vector b
        """
        n = self.shape
        n_first = np.repeat(1, n)
        n_last = np.repeat(2, comb(n, 2))
        return np.hstack((n_first, n_last))

class Coalescence:
    def __init__(self, matrix: np.ndarray) -> None:
        """
        Initialize a coalescence times matrix object
        :param matrix: input Coalescence time matrix
        """
        self.matrix = matrix
        self.shape = matrix.shape[0]

    def produce_fst(self) -> np.ndarray:
        """
        produces and returns the corresponding Fst matrix
        :return: The corresponding Fst matrix
        """
        F_mat = np.zeros((self.shape, self.shape))
        for i in range(self.shape):
            for j in range(i + 1, self.shape):
                t_S = (self.matrix[i, i] + self.matrix[j, j]) / 2
                t_T = (self.matrix[i, j] + t_S) / 2
                if np.isinf(t_T):
                    F_i_j = 1
                else:
                    F_i_j = (t_T - t_S) / t_T
                F_mat[i, j], F_mat[j, i] = F_i_j, F_i_j
        return F_mat

    def produce_migration(self, bounds=(0, 2)) -> tuple:
        """
        produce and return the migration matrix induced by the coefficient matrix A(which is induced by T).
        :param bounds: bounds for each individual variable. default is 0 < x < 2. bounds should be given as a tuple
        of 2 arrays of size n**2-n (where n is the number of populations). first array represents lower bounds, second
        array represents upper bounds. if a tuple with 2 scalars is given instead, they will be the bounds for each
        variable.
        :return: (Migration matrix corresponding to object's Coalescence matrix, output of scipy.optimize.lsq_linear).
        """
        n = self.shape
        M = np.zeros((n, n))
        A = self.produce_coefficient_mat()
        b = self.produce_solution_vector()
        ls_sol = sp.optimize.lsq_linear(A, b, bounds=(bounds[0], bounds[1]), max_iter=1000)
        x = ls_sol.x
        # norm = 0.5 * np.linalg.norm(A @ x - b, ord=2) ** 2
        for i in range(n):
            start_ind = i * (n - 1)
            M[i, 0:i] = x[start_ind:start_ind + i]
            M[i, i + 1:n] = x[start_ind + i:start_ind + n - 1]
        return M, ls_sol

    def produce_coefficient_mat(self) -> np.ndarray:
        """
        produces and returns the corresponding coefficient matrix, taking into consideration the assumption of
        conservative migration.
         :return: The corresponding coefficient matrix (A)
         """
        n = self.shape
        n_rows = 2 * n + comb(n, 2)  # number of equations
        n_cols = n ** 2 - n  # number of unknowns
        A = np.zeros((n_rows, n_cols))
        for i in range(n):
            s_i, e_i, v_i = self.s(i), self.e(i), self.v(i)
            A[v_i, s_i:e_i + 1] = 1
            counter = 0
            for j in range(n):
                if j != i:
                    A[i, s_i + counter] = self.matrix[i, i] - self.matrix[i, j]
                    counter += 1
                if j < i:
                    A[v_i, j * (n - 1) + i - 1] = -1
                if j > i:
                    A[v_i, j * (n - 1) + i] = -1

            if i != 0:
                for j in range(i):
                    counter_i, counter_j = 0, 0
                    w_i_j = self.w(i, j)
                    s_j = self.s(j)
                    for k in range(n):
                        if k != j:
                            A[w_i_j, s_j + counter_j] = self.matrix[i, j] - self.matrix[i, k]
                            counter_j += 1
                        if k != i:
                            A[w_i_j, s_i + counter_i] = self.matrix[i, j] - self.matrix[j, k]
                            counter_i += 1
        return A

    def s(self, i):
        return i * (self.shape - 1)

    def e(self, i):
        return (i + 1) * (self.shape - 1) - 1

    def w(self, i, j):
        return int(self.shape + ((i * (i - 1)) / 2) + j)

    def v(self, i):
        return self.shape + comb(self.shape, 2) + i

    def produce_solution_vector(self) -> np.ndarray:
        """
        produce the solution vector(b), according to Wilkinson-Herbot's equations
        :return: solution vector b
        """
        n = self.shape
        nC2 = comb(n, 2)
        b = np.zeros((2 * n + nC2))
        b[0:n] = 1 - self.matrix.diagonal()
        b[n: n + nC2] = 2
        return b

class Fst:
    def __init__(self, matrix: np.ndarray) -> None:
        """
        Initialize Fst matrix object
        :param matrix: input Fst matrix
        """
        self.matrix = matrix
        self.shape = matrix.shape[0]

    def produce_coalescence(self, x0=None, constraint=False, bounds=(0, np.inf)) -> np.ndarray:
        """
        generates a possible corresponding coalescence times matrix and returns it.
        :param constraint: indicated whether the T matrix produced should be 'good'. default is False
        :param bounds: bounds for each variable T(i,j), default is (0, inf). bounds should be a tuple of two arrays,
        first is lower bounds for each variable, second is upper bounds for each variable. If bounds is a tuple of
        two scalars, the same bounds are applied for each variable.
        :param x0: initial guess for the variables, default is a random vector with bounds (0,2*n), where n is the
        size of the matrix (number of populations).
        :return: A possible corresponding Coalescence time matrix- T.
        """
        n, nc2 = self.shape, comb(self.shape, 2)
        if x0 is None:
            x0 = np.random.uniform(low=0, high=2 * n, size=(n + nc2,))
        T = np.zeros((n, n))
        f_values = self.matrix[np.triu_indices(n, 1)]
        # add constraints
        constraints = None
        if constraint:
            constraints = []
            row, col = 0, 1
            for i in range(nc2):
                constraint_1 = constraint_generator(i, nc2 + row)
                constraint_2 = constraint_generator(i, nc2 + col)
                col += 1
                constraints.append({"type": "ineq", "fun": constraint_1})
                constraints.append({"type": "ineq", "fun": constraint_2})
                if col == n:  # move to next row
                    row += 1
                    col = row + 1
        # constraints = [{'type': 'ineq', 'fun': lambda x: x[0] - x[6]},
        #                {'type': 'ineq', 'fun': lambda x: x[0] - x[7]},
        #                {'type': 'ineq', 'fun': lambda x: x[1] - x[6]},
        #                {'type': 'ineq', 'fun': lambda x: x[1] - x[8]},
        #                {'type': 'ineq', 'fun': lambda x: x[2] - x[6]},
        #                {'type': 'ineq', 'fun': lambda x: x[2] - x[9]},
        #                {'type': 'ineq', 'fun': lambda x: x[3] - x[7]},
        #                {'type': 'ineq', 'fun': lambda x: x[3] - x[8]},
        #                {'type': 'ineq', 'fun': lambda x: x[4] - x[7]},
        #                {'type': 'ineq', 'fun': lambda x: x[4] - x[9]},
        #                {'type': 'ineq', 'fun': lambda x: x[5] - x[8]},
        #                {'type': 'ineq', 'fun': lambda x: x[5] - x[9]}]

        solution = minimize(compute_coalescence, x0=x0, args=(f_values, n), bounds=(n + nc2) * [(bounds[0], bounds[1])],
                            constraints=constraints)
        x = solution.x
        np.fill_diagonal(T, x[nc2:])
        row_indices, col_indices = np.triu_indices(n, 1)
        T[(row_indices, col_indices)] = x[0:nc2]
        T[(col_indices, row_indices)] = x[0:nc2]
        # T[np.triu_indices(n, 1)] = x[0:nc2]
        # T[np.tril_indices(n, -1)] = x[0:nc2]
        return T

    def produce_migration(self, x0=None, bounds=(0, 2), conservative=True) -> tuple:
        """
        generates a possible corresponding migration matrix according to Xiran's paper and returns it,
        and details about the numerical solution used to solve it (using Scipy's minimize function).
        returns: tuple (M, solution). M is the migration matrix, and solution is a variable containing 
        details about the solution found by the minimize algorithm of Scipy library."""
        n, nc2 = self.shape, comb(self.shape, 2)
        if x0 is None:
            x0 = np.random.uniform(low=0, high=2 * n, size=(n ** 2,))
        M = np.zeros((n, n))
        f_values = self.matrix.flatten()
        constraints = None
        if conservative:
            constraints = []
            for i in range(n):
                constraint = cons_migration_constraint_generator(n, i)
                constraints.append({"type": "eq", "fun": constraint})
        bnds = (n ** 2 - n) * [(bounds[0], bounds[1])] + n * [(0, np.inf)]
        solution = minimize(f_to_m, x0=x0, args=(f_values, n), method="SLSQP",
                            bounds=bnds, constraints=constraints)
        x = solution.x
        for i in range(n):
            start_ind = i * (n - 1)
            M[i, 0:i] = x[start_ind:start_ind + i]
            M[i, i + 1:n] = x[start_ind + i:start_ind + n - 1]
        return M, solution
# 2.70993953
def find_fst(m: np.ndarray) -> np.ndarray:
    """
    Receives a migration matrix with one connected component(a squared, positive matrix with zeroes on the diagonal),
    and returns its corresponding Fst matrix according to Wilkinson-Herbot's equations and Slatkin's equations.
    :param m: Migration matrix- squared, positive, with zeroes on the diagonal.
    :return: Corresponding Fst matrix according to Wilkinson-Herbot's equations. If there is no solution, an error will
    occur.
    """
    if m.shape[0] == 1:
        return np.array([[0]])
    M = Migration(m)
    t = M.produce_coalescence()
    T = Coalescence(t)
    return T.produce_fst()


def find_coalescence(m: np.ndarray) -> np.ndarray:
    """
       Receives a migration matrix with one connected component
       (a squared, positive matrix with zeroes on the diagonal), and returns its corresponding Coalescent times
       (T) matrix according to Wilkinson-Herbot's equations.
       :param m: Migration matrix- squared, positive, with zeroes on the diagonal.
       :return: Corresponding T matrix according to Wilkinson-Herbot's equations. If there is no solution,
       an error will occur.
       """
    if m.shape[0] == 1:
        return np.array([[1]])
    M = Migration(m)
    return M.produce_coalescence()


def m_to_f(m: np.ndarray) -> np.ndarray:
    """
    Receives a migration matrix(a squared, positive matrix with zeroes on the diagonal) with any number
    of connected components, and returns its corresponding Fst matrix according to Wilkinson-Herbot's equations and
    Slatkin's equations.
    :param m: Migration matrix- squared, positive, with zeroes on the diagonal.
    :return: Corresponding Fst matrix according to Wilkinson-Herbot's equations. If there is no solution, an error will
    occur.
    """
    split = split_migration(m)
    sub_matrices, components = split[0], split[1]
    f_matrices = []
    for matrix in sub_matrices:
        f_matrices.append(find_fst(matrix))
    return reassemble_matrix(f_matrices, components, "fst")


def m_to_t(m: np.ndarray) -> np.ndarray:
    """
       Receives a migration matrix(a squared, positive matrix with zeroes on the diagonal) with any number
       of connected components, and returns its corresponding Coalescent times (T) matrix according to
       Wilkinson-Herbot's equations.
       :param m: Migration matrix- squared, positive, with zeroes on the diagonal.
       :return: Corresponding T matrix according to Wilkinson-Herbot's equations. If there is no solution,
       an error will occur.
       """
    split = split_migration(m)
    sub_matrices, components = split[0], split[1]
    t_matrices = []
    for matrix in sub_matrices:
        t_matrices.append(find_coalescence(matrix))
    return reassemble_matrix(t_matrices, components, "coalescence")


def m_to_t_and_f(m: np.ndarray) -> tuple:
    """
       Receives a migration matrix (a squared, positive matrix with zeroes on the diagonal) with any number
       of connected components, and returns its corresponding Coalescent times (T) matrix according to
       Wilkinson-Herbot's equations, and it's corresponding Fst matrix(F) according to Slatkin equations.
       :param m: Migration matrix- squared, positive, with zeroes on the diagonal.
       :return:  A tuple (T,F). Corresponding T matrix according to Wilkinson-Herbot's equations,
       Corresponding F matrix according to Slatkin equations.
       If there is no solution, an error will occur.
       """
    split = split_migration(m)
    sub_matrices, components = split[0], split[1]
    t_matrices = []
    f_matrices = []
    for matrix in sub_matrices:
        t_matrix = find_coalescence(matrix)
        t_matrices.append(t_matrix)
        T = Coalescence(t_matrix)
        f_matrices.append(T.produce_fst())
    return reassemble_matrix(t_matrices, components, "coalescence"), reassemble_matrix(f_matrices, components, "fst")

def comb(n: int, k: int) -> int:
    """
    calculate and return n Choose k
    :param n: number of objects
    :param k: number of selected objects
    :return: n Choose k
    """
    return int(math.factorial(n) / (math.factorial(k) * math.factorial(n - k)))


def compute_coalescence(t: np.ndarray, f: np.ndarray, n: int) -> float:
    """
    returns the equations that describe the connection between coalescent times and Fst
    of all populations 1,2...n (Slatkin). These are the equations to minimize in order to find possible T matrices.
    :param t: an array representing [T(1,2),T(1,3)...,T(1,n),T(2,3)...,T(2,n),...T(1,1),T(2,2),...,T(n,n)], which are
    the variables to solve. Size of the array(number of unknowns) in nC2 + n.
    :param f: array of Fst values [F(1,2),F(1,3),,,,F(1,n),F(2,3),...F(2,n),...F(n-1,n)]. Array size is nC2.
    :param n: number of populations.
    :return: A list of all the equations that describe the connection between coalescent times and Fst
    of all populations 1,2...n (Slatkin).
    """
    # added_eqs = 0
    eqs_lst = []
    nC2 = comb(n, 2)
    k = 0
    for i in range(nC2):
        for j in range(i + 1, n):
            eq = t[k] - (0.5 * (t[nC2 + i] + t[nC2 + j]) * ((1 + f[k]) / (1 - f[k])))
            eqs_lst.append(eq)
            # if added_eqs < n:
            #     eqs_lst.append(eq)
            #     added_eqs += 1
            k += 1
    # return np.repeat(t[0] - (0.5 * (t[1] + t[2]) * ((1 + f) / (1 - f))), 3)
    return np.linalg.norm(eqs_lst)


def f_to_m(u: np.ndarray, f: np.ndarray, n: int) -> float:
    """
    Function to minimize in order to solve F->M directly (Xiran's paper).
    :param f: vector of Fst values (parameters) of size nC2.
    :param u: vector of unknown T and M values of size n^2.
    :param n: number of populations.
    :return: value of function at point u.
    """
    equation_lst = []
    m = u[:n ** 2 - n]  # M values
    t = u[n ** 2 - n:]  # T values
    for i in range(n):
        incoming_migrants_i = m[(n - 1) * i: (n - 1) * i + n - 1]  # only unknowns of kind M_{i,k}
        m_i = np.sum(incoming_migrants_i)
        other_t = np.concatenate((t[:i], t[i + 1:]))  # only unknowns of kind T_{k,k} where k!=i
        f_i_values = np.concatenate((f[n * i: n * i + i],
                                     f[n * i + 1 + i: n * i + n]))  # only f value of kind F_{i,k} where k!=i
        ones = np.ones(n - 1)
        f_i_vector = (ones + f_i_values) / (ones - f_i_values)
        equation_lst.append(((1 + m_i) * t[i] - 0.5 * (incoming_migrants_i @ ((other_t + t[i]) * f_i_vector))) - 1)
        for j in range(i):
            incoming_migrants_j = m[(n - 1) * j: (n - 1) * j + n - 1]
            m_j = np.sum(incoming_migrants_j)
            f_j_values = np.concatenate((f[n * j: n * j + i],
                                         f[n * j + 1 + i: n * j + n]))
            f_i_new_values = np.concatenate((f[n * i: n * i + j],
                                             f[n * i + 1 + j: n * i + n]))
            f_j_vector = (ones + f_j_values) / (ones - f_j_values)
            f_i_new_vector = (ones + f_i_new_values) / (ones - f_i_new_values)
            t_vals_no_j = np.concatenate((t[:j], t[j + 1:]))
            equation_lst.append(0.25 * (((m_i + m_j) * (t[i] + t[j]) * ((1 + f[(n * i + j)]) / (1 - f[(n * i + j)]))) -
                                        (incoming_migrants_i @ ((other_t + t[j]) * f_j_vector))
                                        - (incoming_migrants_j @ ((t_vals_no_j + t[i]) * f_i_new_vector))) - 1)
    return np.linalg.norm(equation_lst)


def constraint_generator(i: int, j: int) -> callable:
    """
    creates and returns a constraint function for the minimize algorithm used in F->T.
    :return: A callable which is a constraint function
    """

    def constraint(x: np.ndarray):
        return x[i] - x[j]

    return constraint


def cons_migration_constraint_generator(n: int, i: int) -> callable:
    """
    creates and returns a constraint function for the minimize algorithm used to directly solve F->M. this constraints
    are to assure conservative migration.
    :param n: total number of populations
    :param i: population number
    :return: A callable which is the conservative migration constraint for population i
    """

    def constraint(x: np.ndarray):
        m_values = x[:n ** 2 - n]
        indices = np.vstack(np.indices((n, n))).reshape(2, -1).T
        mask = indices[:, 0] != indices[:, 1]  # Off-diagonal mask
        m = np.zeros((n, n))
        m[tuple(indices[mask].T)] = m_values
        return np.sum(m[i, :]) - np.sum(m[:, i])

    return constraint


def check_constraint(t: np.ndarray) -> bool:
    """
    gets a T matrix and returns True if it follows the within < inbetween constraint.
    :param t: Coalescence times matrix.
    :return: True if t follows the constraint, False otherwise.
    """
    min_indices = t.argmin(axis=1)
    diag_indices = np.diag_indices(t.shape[0])[0]
    return not np.any(min_indices != diag_indices)


def check_conservative(m: np.ndarray):
    m = np.round(m, decimals=2)
    for i in range(m.shape[0]):
        if np.sum(m[i, :]) != np.sum(m[:, i]):
            return False
    return True


def matrix_distance(a: np.ndarray, b: np.ndarray) -> float:
    """
    Calculates the distance between two matrices. Matrices must be of the same shape.
    :param a: first matrix.
    :param b: second matrix.
    :return: The distance between a and b.
    """
    n = a.shape[0]
    c = np.abs(a - b)
    return float(np.sum(c)) / (n ** 2 - n)


def diameter(mats: list) -> float:
    """
    Calculates the diameter for a given set of matrices.
    :param mats: list containing a set of matrices of the same shape.
    :return: The diameter (maximum pair-wise distance) of the set of matrices 'mats'.
    """
    max_diam = 0
    for i in range(len(mats)):
        for j in range(i):
            max_diam = max(max_diam, matrix_distance(mats[i], mats[j]))
    return max_diam


def matrix_mean(mats: list) -> np.ndarray:
    """
    returns matrix which is the mean of a set of matrices, meaning each entry of the matrix is the mean of the entry
    across all matrices.
    :param mats: a set of matrices.
    :return: matrix mean.
    """
    return np.sum(mats, axis=0) / len(mats)


def find_components(matrix: np.ndarray) -> dict:
    """
    Find connected components in a directed graph represented by adjacency matrix.
    :param matrix: adjacency matrix representing a directed graph
    :return:something
    """
    components = 1
    n = matrix.shape[0]
    queue = deque()
    visited = set()
    not_visited = set([i for i in range(1, n)])
    visited.add(0)
    comp_dict = {components: [0]}
    queue.append(0)
    while len(not_visited) != 0:
        while len(queue) != 0:
            cur_vertex = queue.popleft()
            for i in range(n):
                if i not in visited and (matrix[cur_vertex, i] != 0 or matrix[i, cur_vertex] != 0):
                    queue.append(i)
                    visited.add(i)
                    not_visited.remove(i)
                    comp_dict[components].append(i)
        for vertex in not_visited:
            components += 1
            queue.append(vertex)
            visited.add(vertex)
            not_visited.remove(vertex)
            comp_dict[components] = [vertex]
            break
    return comp_dict


def split_migration_matrix(migration_matrix: np.ndarray, connected_components: list) -> list:
    """
    Splits a migration matrix to sub-matrices according to it's connected components.
    :param migration_matrix: A valid migration matrix.
    :param connected_components: list of lists, where each list represents a connected component's vertices
    (populations).
    :return: A list of sub-matrices, where each sun-matrix is the migration matrix of a connected component. Note that
    in order to interpret which populations are described in each sub matrix the connected components list is needed.
    """
    sub_matrices = []
    for component in connected_components:
        sub_matrix = migration_matrix[np.ix_(component, component)]
        sub_matrices.append(sub_matrix)

    return sub_matrices


def split_migration(migration_matrix: np.ndarray) -> tuple:
    """
    Finds a migration matrix connected components, and splits the matrix to it's connected components.
    :param migration_matrix: A valid migration matrix.
    :return: A tuple (sub_matrices, components). Sub matrices is a list of numpy arrays, where each array is a
    component's migration matrix. components is a list of lists, where each list represents a component vertices
    (populations). The order of the components corresponds to the order of the sub-matrices.
    """
    components = list(find_components(migration_matrix).values())
    sub_matrices = split_migration_matrix(migration_matrix, components)
    return sub_matrices, components


def reassemble_matrix(sub_matrices: list, connected_components: list, which: str) -> np.ndarray:
    """
    Reassembles an Fst/Coalescence matrix according to sub-matrices and the connected components.
    :param sub_matrices: The sub matrices from which to assemble the matrix. A list of 2-D numpy arrays.
    :param connected_components: A list of lists, where each list is the connected components. Inidcates how the matrix
    should be assembled.
    :param which: Either "fst" or "coalescence". Indicated whether the assembled matrix is an Fst matrix or a
    coalescence matrix. This is important for initialization of the returned matrix.
    :return: The assembled Fst or Coalescence matrix.
    """
    num_nodes = sum(len(component) for component in connected_components)
    if which == "fst":
        adjacency_matrix = np.ones((num_nodes, num_nodes), dtype=float)
    else:
        adjacency_matrix = np.full((num_nodes, num_nodes), np.inf)

    for component, sub_matrix in zip(connected_components, sub_matrices):
        indices = np.array(component)
        adjacency_matrix[np.ix_(indices, indices)] = sub_matrix

    return adjacency_matrix

def fst_to_migration(f:np.ndarray) -> np.ndarray:
    """
    Receives a Fst matrix(a squared, positive matrix with zeroes on the diagonal) and returns
    a possible corresping migration matrix according to Xiran's paper."""
    F = Fst(f)
    return F.produce_migration()[0]

def transform_m_to_f(matrix_json):
    # Convert JSON to numpy array
    matrix_list = json.loads(matrix_json)
    matrix = np.array(matrix_list, dtype=float)
    result_matrix = np.round(m_to_f(matrix), decimals=2)
    # Convert numpy array back to JSON
    result_list = result_matrix.tolist()
    result_json = {'matrix':result_list}
    return json.dumps(result_json)

def transform_f_to_m(matrix_json):
    # Convert JSON to numpy array
    matrix_list = json.loads(matrix_json)
    matrix = np.array(matrix_list, dtype=float)
    result_matrix = np.round(fst_to_migration(matrix), decimals=2)
    # Convert numpy array back to JSON
    result_list = result_matrix.tolist()
    result_json = {'matrix':result_list}
    return json.dumps(result_json)