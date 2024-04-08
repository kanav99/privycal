from nada_dsl import *

def initialize_parties(nr_parties):
    parties = []
    for i in range(nr_parties):
        parties.append(Party(name="Party" + str(i)))

    return parties

def input_calenders(nr_days, nr_hours, nr_parties, parties):
    calenders = []
    for i in range(nr_parties):
        calenders.append([])
        for j in range(nr_days*nr_hours):
            calenders[i].append(SecretInteger(Input(name="calender_p" + str(i) + "_h" + str(j), party=parties[i])) - Integer(1))

    return calenders

max_preference = 5

def validate_calenders(calenders, nr_days, nr_hours, nr_parties):
    bit = Integer(1)
    for i in range(nr_parties):
        for j in range(nr_days*nr_hours):
            bit = bit * (calenders[i][j] < Integer(max_preference)).if_else(Integer(1), Integer(0))
            bit = bit * (calenders[i][j] >= Integer(0)).if_else(Integer(1), Integer(0))
    return bit

def elementwise_mul(a, b):
    result = []
    for i in range(len(a)):
        result.append(a[i] * b[i])
    return result

def elementwise_mul_all(vectors):
    result = vectors[0]
    for i in range(1, len(vectors)):
        result = elementwise_mul(result, vectors[i])
    return result

def max_vector(v):
    if len(v) == 1:
        return v[0], Integer(0)
    
    left_v, left_idx = max_vector(v[:len(v)//2])
    right_v, right_idx = max_vector(v[len(v)//2:])
    right_idx = right_idx + Integer(len(v)//2)
    compare = (left_v > right_v)
    max_v = compare.if_else(left_v, right_v)
    max_idx = compare.if_else(left_idx, right_idx)
    return max_v, max_idx

def nada_main():
    nr_parties = 2
    nr_days = 1
    nr_hours = 8

    parties = initialize_parties(2)
    calenders = input_calenders(nr_days, nr_hours, nr_parties, parties)
    valid_bit = validate_calenders(calenders, nr_days, nr_hours, nr_parties)

    mul_calender = elementwise_mul_all(calenders)
    max_pref, max_date = max_vector(mul_calender)

    return [
        Output(valid_bit, "valid_bit", parties[0]), 
        Output(max_date, "max_date", parties[0]),
    ]
