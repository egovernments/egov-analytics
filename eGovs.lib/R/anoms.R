# TODO: Need to confirm this works as intended

construct.frame <- function(xtsobj) {
  data.frame(time=zoo::index(xtsobj), values=zoo::coredata(xtsobj))
}

#' Detect anomalies in a given series
#' @param series, a time-series
#' @param start_date (optional) the start date to consider when detecting anoms
#' @param end_date (optional) the end date to consider when detecting anoms
#' @param model.alpha (optional) alpha param to pass to the algorithm
#' @param model.max_anoms (optional) max_anoms param to pass to the algorithm
#' @export
detect_anomalies = function(series,
                            start_date=NULL,
                            end_date=NULL,
                            model.alpha = 0.05,
                            model.max_anoms = 0.1) {
  if(!is.null(start_date)) {
    series <- window(series, start=paste0(start_date," 00:00:00"))
  }
  if(!is.null(end_date)) {
    series <- window(series, end=paste0(end_date," 23:59:59"))
  }
  anomalies <- AnomalyDetection::AnomalyDetectionVec(drop(zoo::coredata(series)),
                                                     period=24, plot=F,
                                                     direction = "pos",
                                                     alpha = model.alpha,
                                                     max_anoms = model.max_anoms)
  if(nrow(anomalies$anoms) == 0) {
    warning("No anomalies found!", immediate. = T)
    return(NULL)
  } else {
    out_subset <- data.frame(Count = series[anomalies$anoms$index,])
    out_subset$Time <- row.names(out_subset)
    row.names(out_subset) <- NULL
  }

  return(out_subset)
}

#' Detect anomalies in the date specified
#' @param series the time series
#' @param date (optional) a Date object. If a date is not specified, the last day is chosen. Create with as.Date("2010/11/23")
#' @param window.size (optional) the time period to consider while computing the anomalies
#' @param model.alpha (optional) alpha param to pass to the algorithm
#' @param model.max_anoms (optional) max_anoms param to pass to the algorithm
#'
detect_anomalies_last <- function(series,
                                  date = NULL,
                                  window.size=60,
                                  model.alpha = 0.05,
                                  model.max_anoms = 0.1) {
  if(is.null(date)) {
    date <- as.Date(zoo::index(series)[length(series)])
  }

  end_time <- date
  start_time <- date - (24 * 60 * 60 *  window.size)
  series <- window(series, start=start_time, end=end_time)

  anomalies <- AnomalyDetection::AnomalyDetectionVec(drop(zoo::coredata(series)),
                                                     period=24, plot=F,
                                                     only_last = T,
                                                     direction = "pos",
                                                     alpha = model.alpha,
                                                     max_anoms = model.max_anoms)
  if(nrow(anomalies$anoms) == 0) {
    warning("No anomalies found!", immediate. = T)
    return(NULL)
  } else {
    out_subset <- data.frame(Count = series[anomalies$anoms$index,])
    out_subset$Time <- row.names(out_subset)
    row.names(out_subset) <- NULL
  }

  return(out_subset)
}
