## README
This script fetches data from the elastic-search servers and persists them locally, and exports it into a `.tsv` file.

It uses `sqlite3` to persist data locally, so data isn't fetched all over again every time it is run

**Note:** The first run might take a while, since it has to fetch data from 2012 onwards to the current day. It will be fast after the first run, as it only fetches data post the last complaint fetched.


### How to setup
- This script requires python 2.7.x to run
- (Optional)(Recommended) setup a virtualenv in the folder which contains the code: `virtualenv <Path>` and activate it `source bin/activate`
- `pip install -r requirements.txt` will install requirements. You might need to prefix the command with `sudo` if you're not using virtualenv
- You're done!


## How to run
To run it, you need to know the elastic-search instance's URL and port
- Run `python <esHost> <esPort> <outputPath>` where output path is where you want the file to be written

## Output format
The headers are as follows:

| id	| ComplaintType| 	Zone| 	Ward| 	Department| 	Date |
| --- | ---          | ---  | ---   | ---         | ---    |
|Complaint Id|One of 93 complaint types| The zone in which the complaint was posted | the ward in which the complaint was poster| the department assigned to tackle the complaint| the time stamp|
