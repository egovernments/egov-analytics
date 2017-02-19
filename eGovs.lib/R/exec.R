#' converts the series into a format that we can export
export.series <- function(series, split.times = T) {
  series.df <- ts.to.df(series)
  if(split.times) {
    series.df$Month <- lubridate::month(series.df$Time)
    series.df$Year <- lubridate::year(series.df$Time)
  }
  series.df
}




#' Execute the full loop for forecasts
#' @param configFilePath the path of the config file
executeForecasts <- function(configFilePath) {

  config <- ForecastsConfig$new(configFilePath)

  eData <- ComplaintsData$new(config$getDataPath())

  output <- list()
  for(complaint.type in config$getComplaintTypesToModel()) {
    print(paste0("Modeling '", complaint.type, "'"))
    series <- eData$getComplaintData(complaint.type)
    start.date <- config$getStartDate(complaint.type)
    print(paste0("Start Date '", start.date, "'"))
    if(!is.null(start.date)) {
      series <- window(series, start=c(lubridate::year(start.date), lubridate::month(start.date)))
    }
    params <- config$getModelParams(complaint.type)

    params[["series"]] <- series
    params[["ts_model"]] <- config$getModelType(complaint.type)
    params[["cleaned"]] <- config$isCleanOutliers(complaint.type)
    params[["stl_decompose"]] <- config$isSTLDecompose(complaint.type)

    output[[complaint.type]] <- list(
      "forecasts" = do.call(egovs_forecasts, params),
      "data" = export.series(series)
    )
  }

  return(output)
}

#' @param outputFilePath the path to write into. Will be overwritten if it already exists
executeAndWriteForecasts <- function(configFilePath, outputFilePath) {
  output <- executeForecasts(configFilePath)
  fileConn<-file(outputFilePath)
  writeLines(jsonlite::toJSON(output), fileConn)
  close(fileConn)
}


executeAnomalyDetection <- function(configFilePath, only_last = T) {

  detect_anoms <- function(series, config, only_last) {
    anom_det_func <- NULL
    if(only_last) {
      anom_det_func <- detect_anomalies_last
    } else {
      anom_det_func <- detect_anomalies
    }

    anoms <- tryCatch({
      anom_det_func(series,
                    model.alpha = config$alpha,
                    model.max_anoms = config$max_anoms)
    }, error = function(e) {
      # TODO = how do I fix this?
      warning(as.character(e), immediate. = T)
      NULL
    })

    if(is.null(anoms)) {
      anoms <- data.frame(Time=character(0))
    }

    list(
      "data" = export.series(series, split.times = F),
      "anomalies" = anoms$Time
    )
  }

  config <- AlertsConfig$new(configFilePath)
  alerts.data <- AlertsData$new(config$getDataPath())

  output <- list()

  # compute anomalies at city level
  output[["city"]] <- detect_anoms(alerts.data$cityLevel("hour"),
                                   config$getCityLevelConfig(),
                                   only_last)

  # compute anomalies at ward level
  output[["ward"]] <- list()
  for(ward in alerts.data$getWards()) {
    print(paste0("Finding anoms for ward ", ward))
    output[["ward"]][[ward]] <- detect_anoms(alerts.data$wardLevel(ward, "hour"),
                                             config$getWardLevelConfig(ward),
                                             only_last)
  }

  # compute anomalies at complaint level
  output[["complaint_type"]] <- list()
  for(complaint.type in alerts.data$getComplaintTypes()) {
    print(paste0("Finding anoms for ", complaint.type))
    output[["complaint_type"]][[complaint.type]] <- detect_anoms(alerts.data$complaintLevel(complaint.type, "hour"),
                                                                 config$getComplaintLevelConfig(complaint.type),
                                                                 only_last)
  }

  return(output)
}


executeAndWriteAnomalyDetection <- function(configFilePath, outputFilePath, only_last = T) {
  output <- executeAnomalyDetection(configFilePath, only_last)
  fileConn<-file(outputFilePath)
  writeLines(jsonlite::toJSON(output), fileConn)
  close(fileConn)
}


executeAndWriteEGovs <- function(configFilePath, outputFilePath, only_last = T) {
  output <- list()
  output[["forecasts"]] <- executeForecasts(configFilePath)
  output[["alerts"]] <- executeAnomalyDetection(configFilePath, only_last)

  fileConn<-file(outputFilePath)
  writeLines(jsonlite::toJSON(output), fileConn)
  close(fileConn)
}
