library(jsonlite)
library(R6)


Constants <- list(
  allowed_params = c("arima.p", "arima.d", "arima.q", "ets.model", "ets.damped", "lambda")
)


Config <- R6Class(
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
      model_spec <- self$config[["model-spec"]][[complaint.type]]
      if(is.null(model_spec)) {
        stop(paste("Model spec is not present for complaint type:", complaint.type))
      }
      model_spec
    }, getComplaintTypesToModel = function() {
      names(self$config[["model-spec"]])
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

path <- "~/workspaces/datakind-ws/analytics/eGovs_lib/forecasts/example_config.json"
config <- Config$new(path)