library(R6)
library(AnomalyDetection)
library(dygraphs)
library(dplyr)
library(xts)
	
periodicity_ <- function(complaints.frame, periodicity) {
  stopifnot(nrow(complaints.frame) > 0)
  stopifnot(periodicity %in% c("hour", "day"))
  series <- xts(complaints.frame$NumComplaints, complaints.frame$Complaint.Date)
  if(periodicity == "hour") {
    series <- period.apply(series, endpoints(series, "hours"), FUN = sum)
  } else if (periodicity == "day") {
    series <- apply.daily(series, FUN = sum)
  }
  series
}

alerts_data <- R6Class("alerts_data",
	public = list(
		complaints.data = NULL,
		initialize = function(data_path){
		
		  raw <- read.csv(data_path, stringsAsFactors = F)
		  raw <- select(raw, Ward, Complaint.Type, Complaint.Date)
		  raw$Complaint.Date <- as.POSIXct(raw$Complaint.Date, format = "%m/%d/%Y %H:%M:%S")
		  complaints.data <- raw[raw$Complaint.Date >= strptime("01/01/2012 00:00:00", format = "%m/%d/%Y %H:%M:%S"), ] 
		  complaints.data$NumComplaints <- 1
		  self$complaints.data <- complaints.data
		},
		
		cityLevel = function(periodicity) {
		  periodicity_(self$complaints.data, periodicity)
		},
		
		complaintLevel = function(complaint.type, periodicity) {
		  df <- filter(self$complaints.data, Complaint.Type == complaint.type)
		  periodicity_(df, periodicity)
		},
		
		wardLevel = function(ward, periodicity) {
		  df <- filter(self$complaints.data, Ward == ward)
		  periodicity_(df, periodicity)
		}))