DATA="../../../cocUptoJuly2016.csv"
library(xts)
library(hash)
library(plotly)
library(forecast)
library(lubridate)
library(htmlwidgets)
library(AnomalyDetection)
library(dplyr)
library(dygraphs)

raw <- read.csv(DATA, stringsAsFactors = F)
head(raw)
raw$Complaint.Date <- as.POSIXct(raw$Complaint.Date, format = "%m/%d/%Y %H:%M:%S")
raw$Resolution.Date <- as.POSIXct(raw$Resolution.Date, format = "%m/%d/%Y %H:%M:%S")

raw <- select(raw, Ward, Complaint.Type, Complaint.Date)

# get data only from 2012 onwards
df <- raw[raw$Complaint.Date >= strptime("01/01/2012 00:00:00", format = "%m/%d/%Y %H:%M:%S"), ] 
df$NumComplaints <- 1

choicesForTime <- c("Hourly", "Daily", "Weekly", "Monthly", "Quarterly")

minDate <- min(df$Complaint.Date)
maxDate <- max(df$Complaint.Date)

topComplaintTypes <- data.frame(table(df$Complaint.Type), stringsAsFactors = F)
topComplaintTypes <- topComplaintTypes[order(-topComplaintTypes$Freq),]
topComplaintTypes <- topComplaintTypes[1:5, ]
topComplaintTypes <- as.character(topComplaintTypes$Var1)


anomalies.around <- function(xtsobj, date, window.size=60) {
  end_time <- date
  start_time <- date - (24 * 60 * 60 * window.size)
  subset <- window(xtsobj, start=start_time, end=end_time)
  AnomalyDetectionVec(drop(coredata(subset)),period=24, plot=T, only_last = T)
}
