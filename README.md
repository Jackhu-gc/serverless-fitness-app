# Workout Planner Services

Listed are the services for Workout Planner Android app 
- workout 
- import reference data

## workout.service

### Get workouts

#### Request

`GET /workout/{category}?anyinTable`

**Required** _category(Case sensitive): "Open", "Hero", "Home", "Benchmark"_

    curl -i -H 'Accept: application/json' https://08ob74o7ol.execute-api.ap-southeast-2.amazonaws.com/prd/workout/Open?anyinTable=handstand

#### Response

    HTTP/2 200
    content-type: application/json
    content-length: 11818
    date: Sat, 19 Jun 2021 12:23:00 GMT
    x-amzn-requestid: 4027e5a8-691c-4eaf-8864-439acefe8594
    x-amz-apigw-id: BLAxYEzeywMFxSg=
    x-amzn-trace-id: Root=1-60cde1a2-324d8f2a778aac5102512083;Sampled=0
    x-cache: Miss from cloudfront
    via: 1.1 0d4a1bdae731fb62210dd49c40f0b8f7.cloudfront.net (CloudFront)
    x-amz-cf-pop: SYD1-C1
    x-amz-cf-id: dP1NuobQpzOKsB8A3_UxIMDEeq0joyK76gQpxf1RLxzC9kYQqE6c1g==

    {
        "workout": [
            {
                "category": "Open",
                "workoutDetails": "21 deadlifts; 225 lb.\n21 handstand push-ups\n15 deadlifts; 225 lb.\n15 handstand push-ups\n9 deadlifts; 225 lb.\n9 handstand push-ups\n21 deadlifts; 315 lb.\n50-ft. handstand walk\n15 deadlifts; 315 lb.\n50-ft. handstand walk\n9 deadlifts; 315 lb.\n50-ft. handstand walk",
                "Id": "290efcc7-8fc8-453b-9110-35b25cc76ad8",
                "equipment": "BARBELL",
                "workoutTime": "Time cap: 9 min",
                "workoutName": "18.4"
            }
        ]
    }

#### Request

`GET /workout/all?equipment`

    curl -i -H 'Accept: application/json' https://08ob74o7ol.execute-api.ap-southeast-2.amazonaws.com/prd/workout/all?equipment=MED BALL

#### Response

    HTTP/2 200
    content-type: application/json
    content-length: 5199
    date: Sat, 19 Jun 2021 12:38:53 GMT
    x-amzn-requestid: 106bd982-6633-4d4c-acb2-48f3b90fbb63
    x-amz-apigw-id: BLDGnFz7ywMFY4Q=
    x-amzn-trace-id: Root=1-60cde55d-55a2ffd065b01fc0782adf82;Sampled=0
    x-cache: Miss from cloudfront
    via: 1.1 4bf8b888ab09c75583ef96928f051bfc.cloudfront.net (CloudFront)
    x-amz-cf-pop: SYD1-C1
    x-amz-cf-id: RlvJoDKzp1kQB9zOPlWgAU-izFNWa6Mb6ttfKOyMguSGiGi3H2LKxQ==

    {
        "workout": [{
                "category": "Hero",
                "workoutDetails": "10 Handstand push-ups\n250 lbs Deadlift; 15 reps\n25 Box jumps; 30 inch box\n50 Pull-ups\n100 Wallball shots; 20 lbss; 10ft\n200 Double-unders\nRun 400 meters with a 45lb plate",
                "Id": "1aa06f0e-c9ae-4ed5-9052-462d8bec6ccb",
                "equipment": "SKIPPING ROPE, BARBELL, BOX, PULL UP BAR, MED BALL",
                "workoutTime": "For Time",
                "workoutName": "NUTTS"
            },...]

    }
