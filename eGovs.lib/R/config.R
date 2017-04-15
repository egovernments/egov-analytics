library(R6)

#' A list of 'Constants'
Constants <- list(
  allowed_params = c("arima.p", "arima.d", "arima.q", "ets.model", "ets.damped", "lambda", "stl.period")
)


AlertsConfig <- R6Class(
  "AlertsConfig",
  public = list(
    config = NULL,
    params = NULL,
    initialize = function(config.path) {
      self$config <- suppressWarnings(jsonlite::fromJSON(readLines(config.path), flatten = FALSE))
      self$params <- c("alpha", "max_anoms")
    },
    getCityLevelConfig = function() {
      self$config[["alerts"]][["city_level"]]
    },
    getDefaultWardLevelConfig = function() {
      self$config[["alerts"]][["ward_level"]][["defaults"]]
    },
    getDefaultComplaintLevelConfig = function() {
      self$config[["alerts"]][["complaint_level"]][["defaults"]]
    },
    getDataPath = function() {
      self$config[["data"]][["path"]]
    },
    getComplaintLevelConfig = function(complaint.type) {
      c <- self$config[["alerts"]][["complaint_level"]][["complaints"]]
      if(complaint.type %in% names(c)) {
        return(c[[complaint.type]])
      }
      self$getDefaultComplaintLevelConfig()
    },
    getWardLevelConfig = function(ward) {
      c <- self$config[["alerts"]][["ward_level"]][["wards"]]
      if(ward %in% names(c)) {
        return(c[[ward]])
      }
      self$getDefaultWardLevelConfig()
    }
  )
)


ForecastsConfig <- R6Class(
  "ForecastsConfig",
  public = list(
    config = NULL,
    initialize = function(config.path) {
      self$config <- suppressWarnings(jsonlite::fromJSON(readLines(config.path), flatten = FALSE))
    },
    getDataPath = function() {
      self$config[["data"]][["path"]]
    },
    getModelSpec = function(complaint.type) {
      model_spec <- self$config[["forecasts"]][["model-spec"]][[complaint.type]]
      if(is.null(model_spec)) {
        stop(paste("Model spec is not present for complaint type:", complaint.type))
      }
      model_spec
    }, getComplaintTypesToModel = function() {
      names(self$config[["forecasts"]][["model-spec"]])
    },
    getModelType = function(complaint.type) {
      self$getModelSpec(complaint.type)[["model"]]
    },
    getStartDate = function(complaint.type) {
      start.date <- self$getModelSpec(complaint.type)[["start-date"]]
      if(is.null(start.date)) {
        return(NULL)
      }
      as.POSIXct(start.date, format = "%m/%d/%Y")
    },
    isCleanOutliers = function(complaint.type) {
      model_spec <- self$getModelSpec(complaint.type)
      if(!("clean-outliers" %in% names(model_spec))) {
        return(FALSE)
      }
      if(model_spec[["clean-outliers"]] == FALSE) {
        return(FALSE)
      }
      return(TRUE)
    },
    isSTLDecompose = function(complaint.type) {
      model_spec <- self$getModelSpec(complaint.type)
      if(!("stl" %in% names(model_spec))) {
        return(FALSE)
      }
      if(model_spec[["stl"]] == FALSE) {
        return(FALSE)
      }
      return(TRUE)
    },
    getModelParams = function(complaint.type) {
      model_spec <- self$getModelSpec(complaint.type)
      paramList <- list()
      for(p in Constants$allowed_params) {
        if(p %in% names(model_spec)) {
          paramList[[p]] = model_spec[[p]]
        }
      }

      paramList
    }
  )
)
