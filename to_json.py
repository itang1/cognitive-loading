import csv
import json
with open('inputs/test_ratings.csv', 'r') as f:
    reader = csv.reader(f, delimiter=',')
    data_list = list()
    for row in reader:
        data_list.append(row)
data = [dict(zip(data_list[0],row)) for row in data_list]
data.pop(0)
s = json.dumps(data)
print (s)
output = open('inputs/test_ratings.json', 'w')
output.write(s)
output.close()
