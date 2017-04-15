# Alerts Dashboard

## Requirements
* `eGovs.lib`
* A CSV export from the PGR system. Change the `DATA` variable in `global.R` to the path of this csv file.

## How to launch
* Execute: `Rscript run.R`
* Click on the URL printed in the bottom

OR
* If you have RStudio installed, open `global.R` in RStudio and click on `Run App`


## How to use

This dashboard allows you to explore complaints rolled up hourly or daily, at all levels: city, complaint types, ward or a combination of a selected ward and complaint type.

The controls in the left panel allow you to select the level, range and periodicity of data you want, and the right panel allows you to explore it.

If you want to see if any anomalies will be detected in a certain data, select the date in the `Select Date` date drop down, and check `Detect Anomalies?`. The corresponding plot will show up on the right (might not be immediate)
