library(jsonlite)
library(R6)

Config <- R6Class(
  "ForecastsConfig",
  public = list(
    config = NULL,
    initialize = function(config.path) {
      self$config <- jsonlite::fromJSON(readLines(config.path), flatten = FALSE)
    },
    getModelSpec = function(complaint.type) {
      model_spec <- self$config[["model-spec"]][[complaint.type]]
      if(is.null(model_spec)) {
        stop(paste("Model spec is not present for complaint type:", complaint.type))
      }
      model_spec
    },
    getModelType = function(complaint.type) {
      self$getModelSpec(complaint.type)[["model"]]
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
    }
  )
)

path <- "~/workspaces/datakind-ws/analytics/eGovs_lib/forecasts/example_config.json"
config <- Config$new(path)