
#' @import dplyr
#' @import forecast
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

# Example
# complaints.data <- ComplaintsData$new("~/workspaces/datakind-ws/cocUptoJuly2016.csv")
# series <- complaints.data$getComplaintData("Mosquito menace ")
