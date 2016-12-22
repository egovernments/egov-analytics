library(dplyr)
library(lubridate)
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

AlertsData <- function(dataPath)
{
  
  ## Get the environment for this
  ## instance of the function.
  thisEnv <- environment()
  
  raw <- read.csv(dataPath, stringsAsFactors = F)
  raw <- select(raw, Ward, Complaint.Type, Complaint.Date)
  raw$Complaint.Date <- as.POSIXct(raw$Complaint.Date, format = "%m/%d/%Y %H:%M:%S")
  complaints.data <- raw[raw$Complaint.Date >= strptime("01/01/2012 00:00:00", format = "%m/%d/%Y %H:%M:%S"), ] 
  complaints.data$NumComplaints <- 1
  
  # free up some memory
  rm(raw)
  
  ## Create the list used to represent an
  ## object for this class
  me <- list(
    
    ## Define the environment where this list is defined so
    ## that I can refer to it later.
    thisEnv = thisEnv,
    
    ## Define the accessors for the data fields.
    getEnv = function()
    {
      return(get("thisEnv",thisEnv))
    },
    
    cityLevel = function(periodicity) {
      complaints.data <- get("complaints.data", thisEnv)
      periodicity_(complaints.data, periodicity)
    },
    
    complaintLevel = function(complaint.type, periodicity) {
      complaints.data <- get("complaints.data", thisEnv)
      df <- filter(complaints.data, Complaint.Type == complaint.type)
      periodicity_(df, periodicity)
    },
    
    wardLevel = function(ward, periodicity) {
      complaints.data <- get("complaints.data", thisEnv)
      df <- filter(complaints.data, Ward == ward)
      periodicity_(df, periodicity)
    }
  )
  
  ## Define the value of the list within the current environment.
  assign('this', me, envir=thisEnv)
  
  ## Set the name for the class
  class(me) <- append(class(me),"AlertsData")
  return(me)
}


