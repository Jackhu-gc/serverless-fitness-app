import csv
import json

def csv_to_json(csvFilePath, jsonFilePath):
    jsonArray = []
      
    #read csv file
    with open(csvFilePath, encoding='utf-8') as csvf: 
        #load csv file data using csv library's dictionary reader
        csvReader = csv.DictReader(csvf) 
        for row in csvReader:
            row['workoutDetails'] = row['workoutDetails'].replace('\\n', '\n')
            #add this python dict to json array
            jsonArray.append(row)
    #convert python jsonArray to JSON String and write to file
    with open(jsonFilePath, 'w', encoding='utf-8') as jsonf: 
        jsonString = json.dumps(jsonArray, indent=4)
        jsonf.write(jsonString)
          
csvFilePath = r'benchmark_add_equip.csv'
jsonFilePath = r'benchmark_add_eq.json'
csv_to_json(csvFilePath, jsonFilePath)