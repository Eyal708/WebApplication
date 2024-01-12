import json
import numpy as np
from Transformations import m_to_f, m_to_t

def transform_matrix(matrix_json):
    # Convert JSON to numpy array
    matrix = np.array(json.loads(matrix_json))

    # Call some function on the matrix
    # For this example, let's just multiply the matrix by 2
    result_matrix = m_to_f(matrix)

    # Convert numpy array back to JSON
    result_json = json.dumps(result_matrix.tolist())

    return result_json