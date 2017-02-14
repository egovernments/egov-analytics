

#' Execute the full loop for forecasts
#' @param configFilePath the path of the config file
#' @param outputFilePath the path to write into. Will be overwritten if it already exists
executeForecasts <- function(configFilePath, outputFilePath) {

  #' converts the series into a format that we can export
  export.series <- function(series) {
    series.df <- ts.to.df(series)
    series.df$Month <- lubridate::month(series.df$Time)
    series.df$Year <- lubridate::year(series.df$Time)
    series.df
  }

  config <- Config$new(configFilePath)

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


  fileConn<-file(outputFilePath)
  writeLines(jsonlite::toJSON(output), fileConn)
  close(fileConn)
}
