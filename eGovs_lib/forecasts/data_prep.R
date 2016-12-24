library(dplyr)
library(lubridate)
library(xts)
library(R6)

ComplaintsData <- R6Class("ComplaintsData",
    public = list(
      data = NULL,
      initialize = function(data.path) {
        if(is.null(data.path) || is.na(data.path)) {
          stop("Data path is NULL or NA")
        }
        
        if(!file.exists(data.path)) {
          stop(paste0(data.path, " is not a file or doesn't exist"))
        }
        
        df <- read.csv(data.path, stringsAsFactors = F)
        df <- select(df, Ward, Complaint.Date, Complaint.Type) %>% 
          mutate(Complaint.Date = as.POSIXct(Complaint.Date, format = "%m/%d/%Y %H:%M:%S")) %>%
          mutate(NumComplaints=1)
        
        self$data <- df
      }, 
      getComplaintFrequencyByType = function() {
        self$data %>% 
          group_by(Complaint.Type) %>%
          summarise(NumComplaints = sum(NumComplaints)) %>%
          arrange(-NumComplaints)
      },
      getComplaintData = function(complaint.type, rollup="month") {
        if(!rollup %in% c("month")) {
          stop("invalid value for rollup")
        }
        df <- self$data %>%
          filter(Complaint.Type == complaint.type)
        
        if(nrow(df) == 0) {
          stop("No rows in the data")
        }
        
        series <- xts(df$NumComplaints, df$Complaint.Date)
        if(rollup == "month") {
          series <- apply.monthly(series, FUN=sum)
        }
        series
      }
    )
) 