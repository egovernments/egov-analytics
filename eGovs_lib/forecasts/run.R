library(optparse)
suppressPackageStartupMessages(source("./config.R"))
suppressPackageStartupMessages(source("./data_prep.R"))
suppressPackageStartupMessages(source("./egovs_forecast.R"))


option_list = list(
  make_option(c("-c", "--config"), type="character", default=NULL, 
              help="Config file location", metavar="character"),
  make_option(c("-o", "--output"), type="character", default=NULL, 
              help="Output file location", metavar="character")
)

opt_parser = OptionParser(option_list=option_list)
opt = parse_args(opt_parser)


config <- Config$new(opt$config)

eData <- ComplaintsData$new(config$getDataPath())

output <- list()

for(complaint.type in config$getComplaintTypesToModel()) {
  print(paste0("Modeling '", complaint.type, "'"))
  series <- eData$getComplaintData(complaint.type)
  start.date <- config$getStartDate(complaint.type)
  print(paste0("Start Date '", start.date, "'"))
  if(!is.null(start.date)) {
    series <- window(series, start=c(year(start.date), month(start.date)))
  }
  params <- config$getModelParams(complaint.type)
  
  params[["series"]] <- series
  params[["ts_model"]] <- config$getModelType(complaint.type)
  params[["cleaned"]] <- config$isCleanOutliers(complaint.type)
  params[["stl_decompose"]] <- config$isSTLDecompose(complaint.type)
  
  output[[complaint.type]] <- do.call(egovs_forecasts, params)
}


fileConn<-file(opt$output)
writeLines(jsonlite::toJSON(output), fileConn)
close(fileConn)
