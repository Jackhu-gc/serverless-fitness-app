##Create workout table
CREATE TABLE IF NOT EXISTS openWorkout (
    no int(5) NOT NULL AUTO_INCREMENT,
    workoutName varchar(255) NOT NULL,
    workoutTime varchar(255) NOT NULL,
    workoutDetails varchar(255) NOT NULL,
    PRIMARY KEY(no)
    );

##Create other table
CREATE TABLE IF NOT EXISTS user (
    UID varchar(255) NOT NULL,
    PRIMARY KEY(UID)
);

##Create postWorkout table
CREATE TABLE IF NOT EXISTS postWorkout (
    workoutId int(5) NOT NULL,
    workoutDetails varchar(255) NOT NULL,
    usrId varchar(255) NOT NULL,
    PRIMARY KEY(UID),
    FOREIGN KEY(usrId)
);



###Load data in table
LOAD DATA LOCAL INFILE '/home/ubuntu/open_workout.csv'
INTO TABLE openWorkout
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\r'
IGNORE 1 ROWS (no, workoutName, workoutTime, workoutDetails);

##Add column with default value
ALTER TABLE heroWorkout ADD category VARCHAR(255) NULL DEFAULT 'Hero';


/**
*Change primary key from auto_increment int to uuid with auto generate trigger
*/
##add a column to put uuid
alter table openWorkout add column pk varchar(60);
##fill the column with new uuid
update openWorkout set pk = uuid();
##remove auto_increment from previous primary key column 
alter table openWorkout drop primary key, change `no` `no` int(10);
##add uuid to be primary key
alter table openWorkout add constraint primary key (pk);
##drop previous primary key column
alter table openWorkout drop no;
##create a trigger to auto generate uuid upon insert
CREATE TRIGGER before_insert_opentable
  BEFORE INSERT ON openWorkout
  FOR EACH ROW
  SET new.pk = uuid();
  

/**
* add timestamp
*/
alter table sensorInfo add column timestamp 
timestamp not null 
default current_timestamp on update current_timestamp;