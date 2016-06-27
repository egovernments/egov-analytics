DATA="/home/samarth/workspaces/datakind-workspace/cocCombined.csv"
library(xts)
library(hash)
library(data.table)
library(dplyr)
library(dygraphs)
library(plotly)
library(forecast)
library(lubridate)

raw <- fread(DATA, stringsAsFactors = F)
raw$Complaint.Date <- as.Date(raw$Complaint.Date, format = "%m/%d/%Y")
raw$Resolution.Date <- as.Date(raw$Resolution.Date, format = "%m/%d/%Y")

# get data only from 2012 onwards
df <- raw[raw$Complaint.Date >= as.Date("01/01/2012", format = "%m/%d/%Y"), ] 
head(df$Complaint.Date)
df$NumComplaints <- 1

choicesForTime <- c("Daily", "Weekly", "Monthly", "Quarterly")
choicesMapping <- hash("Daily" = "day", "Weekly" = "week", 
                       "Monthly" = "month", "Quarterly" = "quarter")

minDate <- min(df$Complaint.Date)
maxDate <- max(df$Complaint.Date)

topComplaintTypes <- data.frame(table(df$Complaint.Type))
topComplaintTypes <- topComplaintTypes[order(-topComplaintTypes$Freq),]
topComplaintTypes <- topComplaintTypes[1:10, ]
topComplaintTypes <- as.character(topComplaintTypes$Var1)