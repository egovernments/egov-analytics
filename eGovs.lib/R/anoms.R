# TODO: Need to confirm this works as intended

construct.frame <- function(xtsobj) {
  data.frame(time=zoo::index(xtsobj), values=zoo::coredata(xtsobj))
}

#' Detect anomalies in a given series
#' @param series, a time-series
#' @param start_date (optional) the start date to consider when detecting anoms
#' @param end_date (optional) the end date to consider when detecting anoms
#' @export
detect_anomalies = function(series, start_date=NULL, end_date=NULL) {
  if(!is.null(start_date)) {
    series <- window(series, start= paste0(start_date," 00:00:00"))
  }
  if(!is.null(end_date)) {
    series <- window(series, end= paste0(end_date," 23:59:59"))
  }

  series <- construct.frame(series)
  anomaly <- AnomalyDetectionTs(series, plot=F)
  anomaly$anoms
}


anomalies.around <- function(xtsobj, date, window.size=60) {
  end_time <- date
  start_time <- date - (24 * 60 * 60 *  window.size)
  subset_data <- window(xtsobj, start=start_time, end=end_time)

  tryCatch({
    if(!"anomalies" %in% ls()) rm(anomalies)
    anomalies <- AnomalyDetectionVec(drop(zoo::coredata(subset_data)),period=24, plot=T, only_last = T, direction = param.direction,
                                     alpha = param.alpha, max_anoms = param.max_anoms)

    out_subset <- data.frame(Anom_points = subset_data[anomalies$anoms$index,])

    if(nrow(out_subset) == 0){
      out_subset <- data.frame(Anom_points = numeric(0))
    }


  },error = function(e){
    if(grepl("detection needs at least 2 periods worth of data",as.character(e))){
      out_subset <- data.frame(Anom_points = numeric(0))

    }else{
      print("Error: Unable to detect anomalies")
      out_subset <- NULL
    }

    anomalies <- NULL


  },finally = {

    if(!"anomalies" %in% ls()) anomalies <- numeric(0)
    anom_list <- list(anomalies = anomalies,anomaly_points = out_subset)
    anom_list
  })

  return(anom_list)

}


#' Detecting anomaly for a particular day.
#' @param series Hourly data
#' @export
detect_anomalies_1_day = function(subset_data,
                                  data_level,
                                  input_date,
                                  ...) {
  in_arguments <- list(...)

  ifelse("param.alpha" %in% names(in_arguments),
         param.alpha <- in_arguments$param.alpha,
         param.alpha <- 0.05)

  ifelse("param.direction" %in% names(in_arguments),
         param.direction <- in_arguments$param.direction,
         param.direction <- "pos")

  ifelse("param.max_anoms" %in% names(in_arguments),
         param.max_anoms <- in_arguments$param.max_anoms,
         param.max_anoms <- 0.1)


  anoms <- anomalies.around(subset_data, as.POSIXct(paste0(input_date," 23:59:59")))

  anom_pts <- anoms$anomaly_points
  anom_pts$Time_period <- row.names(anom_pts)
  row.names(anom_pts) <- NULL
  if(!is.null(anom_pts)){
    if(nrow(anom_pts) == 0){
      plot.new()
    }else{
      plot(anoms$anomalies$plot)
    }
  }
  anom_pts
}
