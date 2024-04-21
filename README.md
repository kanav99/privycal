## Motivation

Ability to schedule meetings is a fundamental requirement of any organisation. This involves finding a time slot when everyone is available.  Solutions like Google Calendar require you to reveal your entire calendar to everyone in the organisation - which is a grave breach of privacy.

## Solution

I built PrivyCal - a privacy preserving solution to the problem of calendar matching. It uses Nillion's blind computation to calculate the intersection of all parties' calendars. You can find the demo of the application on [ETHGlobal](https://ethglobal.com/showcase/privycal-i1gub). Source code is available on [GitHub](https://github.com/kanav99/privycal).

## How it works?

1. Each parties encodes there calendar as a one-hot encoding and inputs to the blind computation. Support there are 8 1-hour slots in a day (9am - 5pm) and the party is only available between 10am-11am and 12am-1pm, they encode their calendar into (0,1,0,1,0,0,0,0) and inputs to the computation. Since Nillion uses multiplicative blinding, we also add 1 to the entire vector. In the blind computation, we then need to subtract 1 privately.

In real life we also prefer some time slots more than others. So instead of just inputting 1, we also allow inputting integers between 0-5 to allow for showing how much you prefer a particular timeslot.

```py
def input_calenders(nr_days, nr_hours, nr_parties, parties):
    calenders = []
    for i in range(nr_parties):
        calenders.append([])
        for j in range(nr_days*nr_hours):
            calenders[i].append(SecretInteger(Input(name="calender_p" + str(i) + "_h" + str(j), party=parties[i])) - Integer(1))

    return calenders
```

2. Then for each party, we validate if the calendar they have are "valid". By valid, we mean that the calendars should be between 0 and the configured max value.

```py
def validate_calenders(calenders, nr_days, nr_hours, nr_parties):
    bit = Integer(1)
    for i in range(nr_parties):
        for j in range(nr_days*nr_hours):
            bit = bit * (calenders[i][j] < Integer(max_preference)).if_else(Integer(1), Integer(0))
            bit = bit * (calenders[i][j] >= Integer(0)).if_else(Integer(1), Integer(0))
    return bit
```

3. Then, we element wise multiply all calendars. If for a particular slot, one party is not available (i.e. inputs 0), then the resulting vector item is 0, representing that the slot is not a valid slot. However for non zero slots, the slot which contains the largest magnitude would be the slot which most parties thought was good.

```py
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
```

4. All it now remains is the find the slot with largest magnitude. We implement a argmax function with log-depth.

```py
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
```

## Limitations
1. Frontend currently only supports two parties, even though the backend code supports arbitrary number of parties.
6. Scheduling meetings only 1 day in advanced is only possible for now, as scheduling multiple days requires a larger compute which errors out.

## Good-to-have features
1. Ability to automatically fetch available slots from Google Calendar.
2. Replace signalling server with a smart contract.
