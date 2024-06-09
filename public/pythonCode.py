import numpy as np
import json
import population_structure.utils as psu

def json_to_np_array(json_matrix) -> np.ndarray:
    """
    Convert a JSON string representing a 2D matrix to a numpy array.
    param: json_matrix: JSON string representing a 2D matrix.
    return: json_matrix as 2d numpy array 
    """
    matrix_list = json.loads(json_matrix)
    matrix = np.array(matrix_list, dtype=float)
    return matrix 

def np_array_to_json(matrix) -> str:
    """
    Convert a 2D numpy array to a JSON string.
    param: matrix: 2D numpy array.
    return: matrix as a JSON string
    """
    matrix_list = matrix.tolist()
    result_json = {'matrix': matrix_list}
    return json.dumps(result_json)

def transform_m_to_f(matrix_json) -> str:
    """
    Takes a json representation of a migration matrix and returns a json representation of the corresponding 
    fst matrix.
    param: matrix_json: json representation of a migration matrix.
    return: json representation of the corresponding fst matrix.
    """
    ##!!!this function might fail if the matrix is not conservative!!! this will cause unexpected results.
    # Convert JSON to numpy array
    matrix = json_to_np_array(matrix_json)
    print("Using my package!")
    result_matrix = np.round(psu.m_to_f(matrix), decimals=2)
    # Convert numpy array back to JSON
    result_json = np_array_to_json(result_matrix)
    return result_json

def transform_f_to_m(matrix_json, direct=True):
    """
    Takes a json representation of an fst matrix and returns a json representation of a possible corresponding
    migration matrix.
    param: matrix_json: json representation of an fst matrix.
    param: direct: boolean, if True, use direct appraoch, else use indirect appraoch
    return: json representation of the corresponding migration matrix.
    """
    # Convert JSON to numpy array
    matrix = json_to_np_array(matrix_json)
    if direct:
        #run Xiran's method
        print("direct appraoch")
        result_matrix = np.round(psu.f_to_m(matrix, indirect=False, bounds_m = (0, np.inf))[0], 2)
    else:
        #run Eyal's metohd
        result_matrix = np.round(psu.f_to_m(matrix, constraint=True)[0], 2)
    result_json = np_array_to_json(result_matrix)
    return result_json

