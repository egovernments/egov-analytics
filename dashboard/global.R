library(xts)
library(hash)
library(data.table)
library(dplyr)
library(dygraphs)
library(plotly)

df = fread("../data/coc.csv")
df$Complaint.Date <- as.Date(df$Complaint.Date, format = "%m/%d/%Y")
df$Resolution.Date <- as.Date(df$Resolution.Date, format = "%m/%d/%Y")
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