
#' @import dplyr
#' @import forecast
#' @import ggplot2
#' @import AnomalyDetection
#' @importFrom magrittr "%>%"
NULL

ideal__ <- function(minYear, maxYear) {
  ideal <- data.frame(Month=character(), Year=integer(), stringsAsFactors=F)
  for(year in seq(from=minYear, to=maxYear)) {
    for(month in month.abb) {
      r <- nrow(ideal)
      month <- as.character(month)
      ideal[nrow(ideal)+1,] <- c(month, year)
    }
  }
  ideal
}

#' \code{R6Class} for getting complaints data in a \code{ts} object
#' @examples
#' complaints.data <- ComplaintsData$new("~/workspaces/datakind-ws/cocUptoJuly2016.csv")
#  series <- complaints.data$getComplaintData("Mosquito menace ")
#' @export
ComplaintsData <- R6Class(
  "ComplaintsData",
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

      series <- xts::xts(df$NumComplaints, df$Complaint.Date)
      if(rollup == "month") {
        series <- xts::apply.monthly(series, FUN=sum)
      }

      monthlyData <- data.frame(Date=zoo::index(series), Complaints=zoo::coredata(series))
      # create columns for join
      monthlyData$Month <- month.abb[lubridate::month(monthlyData$Date)]
      monthlyData$Year <- lubridate::year(monthlyData$Date)
      ideal <- ideal__(min(monthlyData$Year), max(monthlyData$Year))
      joined <- merge(x = ideal, y = monthlyData, by = c("Month", "Year"), sort=F, all= T)
      joined$Date <- NULL

      # sort it by year-month
      joined <- joined[order(zoo::as.yearmon(paste0(joined$Year, "-", joined$Month), "%Y-%b")), ]
      joined[is.na(joined$Complaints), ]$Complaints <- 0
      series_ts <- ts(joined$Complaints, start = c(min(as.numeric(joined$Year)),1), frequency = 12)
      max_date <- max(self$data$Complaint.Date)
      window(series_ts, end=c(lubridate::year(max_date), lubridate::month(max_date)))
    }
  )
)


periodicity_ <- function(complaints.frame, periodicity) {
  stopifnot(nrow(complaints.frame) > 0)
  stopifnot(periodicity %in% c("hour", "day"))
  series <- xts::xts(complaints.frame$NumComplaints, complaints.frame$Complaint.Date)
  if(periodicity == "hour") {
    series <- xts::period.apply(series, xts::endpoints(series, "hours"), FUN = sum)
  } else if (periodicity == "day") {
    series <- xts::apply.daily(series, FUN = sum)
  }
  series
}

AlertsData <- R6Class("AlertsData",
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
   },
   get = function(data_level, periodicity) {
     data_level <- toupper(data_level)
     stopifnot(data_level %in% c("CITY","COMPLAINT","WARD"))

     if(data_level == "WARD"){
       subset_data <- self$wardLevel(ward,periodicity)
     }else if(data_level == "COMPLAINT"){
       subset_data <- self$complaintLevel(complaint.type,periodicity)
     }else{
       subset_data <- self$cityLevel(periodicity)
     }
   }
  )
)


