library(xts)
library(forecast)
library(fpp)
library(rucm)
DATA_FOLDER <- "/home/samarth/workspaces/datakind-workspace/analytics/time-series/data/topNComplaints"
RESULTS_FOLDER <- "/home/samarth/workspaces/datakind-workspace/analytics/time-series/results/topNComplaints/final"
dataStart <- c(2012, 1)
dataEnd <- c(2016, 6)
trainStart <- c(2012, 1)
trainEnd <- c(2015, 6)
testStart <- c(2015, 7)
testEnd <- c(2016, 6)
predictionInterval <- 12

loadData <- function(dataFolder) {
  files <- list.files(dataFolder)
  data <- list()
  for(file in files) {    
    df <- read.csv(paste0(dataFolder, "/", file), stringsAsFactors=F)    
    minYear <- min(df$Year)
    complaintType <- substr(file,1,(nchar(file))-4)    
    tsObject <- ts(df$Complaints, start=c(minYear, 1), frequency = 12)        
    data[[complaintType]] <- window(tsObject, start=dataStart,end=dataEnd)
  }
  data
}
data <- loadData(DATA_FOLDER)
complaintTypes <- names(data)
data[[complaintTypes[1]]]

methods <- list()

# ARIMA
methods[["ARIMA"]] <- function() {
  grid <- expand.grid(p=seq(1,12), 
                      q=seq(1,12), 
                      d=c(1,2), 
                      lambda=c(NULL, 0, .25, .5, 1), 
                      complaintTypes=complaintTypes,
                      stringsAsFactors=F)
  resultsDf <- data.frame(
    complaintType=c(),
    method=c(),
    parameters=c(),
    TrainMAPE=c(),
    TrainRMSE=c(),
    TestMAPE=c(),
    TestRMSE=c()
  )
  
  for(i in 1:nrow(grid)) {
    params <- grid[i,]
    complaintType <- params$complaintType
    monthly <- data[[complaintType]]        
    trainData <- window(monthly, start=trainStart, end=trainEnd)
    testData <- window(monthly, start=testStart, end=testEnd)        
    fit <- tryCatch(
      Arima(trainData, order=c(params$p, params$d, params$q), lambda=params$lambda),
      error=function(e) e
    )
    if(inherits(fit, "error")) next
    acc <- accuracy(forecast(fit, h=predictionInterval, lambda=params$lambda), testData)                
    paramDesc <- paste0("(p, d, q, lambda) = (", params$p, ", ", params$d, ", ", params$q, ", ", params$lambda, ")")
    resultRow <- data.frame(
      complaintType=c(complaintType),
      method=c("ARIMA"),
      parameters=c(paramDesc),
      TrainMAPE=c(acc[1,5]),
      TrainRMSE=c(acc[1,2]),
      TestMAPE=c(acc[2,5]),
      TestRMSE=c(acc[2,2])
    )
    resultsDf <- rbind(resultsDf, resultRow)
  }    
  return(resultsDf)    
}


methods[["SARIMA"]] <- function() {
  
  grid <- expand.grid(p=seq(1,6), 
                      q=seq(1,3), 
                      d=c(1), 
                      P=seq(1,6),
                      Q=seq(1,3),
                      D=c(1),
                      lambda=c(NULL, 0, .25, .5, 1), 
                      complaintTypes=complaintTypes,
                      stringsAsFactors=F)
  resultsDf <- data.frame(
    complaintType=c(),
    method=c(),
    parameters=c(),
    TrainMAPE=c(),
    TrainRMSE=c(),
    TestMAPE=c(),
    TestRMSE=c()
  )
  
  for(i in 1:nrow(grid)) {
    params <- grid[i,]
    complaintType <- params$complaintType
    monthly <- data[[complaintType]]        
    trainData <- window(monthly, start=trainStart, end=trainEnd)
    testData <- window(monthly, start=testStart, end=testEnd)        
    fit <- tryCatch(
      Arima(trainData, order=c(params$p, params$d, params$q), 
            seasonal=c(params$P, params$D, params$Q),
            lambda=params$lambda),
      error=function(e) e
    )
    if(inherits(fit, "error")) next
    acc <- accuracy(forecast(fit, h=predictionInterval, lambda=params$lambda), testData)                
    paramDesc <- paste0("(p, d, q, P, D, Q, lambda) = (", 
                        params$p, ", ", 
                        params$d, ", ", 
                        params$q, ", ", 
                        params$P, ", ", 
                        params$D, ", ", 
                        params$Q, ", ", 
                        params$lambda, ")")
    resultRow <- data.frame(
      complaintType=c(complaintType),
      method=c("SARIMA"),
      parameters=c(paramDesc),
      TrainMAPE=c(acc[1,5]),
      TrainRMSE=c(acc[1,2]),
      TestMAPE=c(acc[2,5]),
      TestRMSE=c(acc[2,2])
    )
    resultsDf <- rbind(resultsDf, resultRow)
  }    
  return(resultsDf)    
}

methods[["UCM"]] <- function() {
  grid <- expand.grid(season.length=seq(2, 18), 
                      cycle.period=seq(1, 12),
                      complaintTypes=complaintTypes,
                      stringsAsFactors=F)
  resultsDf <- data.frame(
    complaintType=c(),
    method=c(),
    parameters=c(),
    TrainMAPE=c(),
    TrainRMSE=c(),
    TestMAPE=c(),
    TestRMSE=c()
  )
  
  for(i in 1:nrow(grid)) {
    params <- grid[i,]
    complaintType <- params$complaintType
    monthly <- data[[complaintType]]        
    trainData <- window(monthly, start=trainStart, end=trainEnd)
    testData <- window(monthly, start=testStart, end=testEnd)
    form <- trainData~0
    fit <- tryCatch(
            ucm(form,
               trainData,
               level=T, slope=T, season=T, cycle=F, 
               season.length=params$season.length, 
               cycle.period=params$cycle.period),
            error= function(e) e
    )
          
    if(inherits(fit, "error")) next
    pred <- predict(fit$model, n.ahead=predictionInterval)
    acc <- accuracy(testData, pred)
    paramDesc <- paste0("(s.l, c.p) = (", params$season.length, ", ", params$cycle.period, ")")
    resultRow <- data.frame(
      complaintType=c(complaintType),
      method=c("UCM"),
      parameters=c(paramDesc),
      TrainMAPE=c(NA),
      TrainRMSE=c(NA),
      TestMAPE=c(acc[1,5]),
      TestRMSE=c(acc[1,2])
    )
    resultsDf <- rbind(resultsDf, resultRow)
  }
  
  return(resultsDf)
}

resultsDf <- data.frame(
    complaintType=c(),
    method=c(),
    parameters=c(),
    TrainMAPE=c(),
    TrainRMSE=c(),
    TestMAPE=c(),
    TestRMSE=c()
  )
for(method in methods) {
  resultsDf <- rbind(resultsDf, method())
}

write.csv(resultsDf, file=paste0(RESULTS_FOLDER, "/", "results.csv"), row.names=F)