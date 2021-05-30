import csv
import json

def csv_to_json(csvFilePath, jsonFilePath):
    jsonArray = []
      
    #read csv file
    with open(csvFilePath, encoding='utf-8') as csvf: 
        #load csv file data using csv library's dictionary reader
        csvReader = csv.DictReader(csvf) 
        # csvReader = csv.reader(csvf, delimiter=',', lineterminator= '\r\n')
        # csvReader = csv.reader(csvf, dialect='excel')

        #convert each csv row into python dict
        for row in csvReader:
            row['workoutDetails'] = row['workoutDetails'].replace('\\n', '\n')
            #add this python dict to json array
            jsonArray.append(row)
    #convert python jsonArray to JSON String and write to file
    with open(jsonFilePath, 'w', encoding='utf-8') as jsonf: 
        jsonString = json.dumps(jsonArray, indent=4)
        jsonf.write(jsonString)
          
csvFilePath = r'new/benchmark.csv'
jsonFilePath = r'benchmark.json'
csv_to_json(csvFilePath, jsonFilePath)