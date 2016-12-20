DATA="../../../cocUptoJuly2016.csv"
library(xts)
library(hash)
library(plotly)
library(forecast)
library(lubridate)
library(htmlwidgets)
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