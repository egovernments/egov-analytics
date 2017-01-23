library(R6)
library(AnomalyDetection)
library(dygraphs)

data_path <- "..\\cocUptoJuly2016\\cocUptoJuly2016.csv"

AnomalyDetection <- R6Class("AnomalyDetection",
	public = list(
	  alertsData = NULL,
	  data_level = NULL,
	  periodicity = NULL,
	  complaint.type = NULL,
	  subset_data = NULL,
	  ward = NULL,
	  
	  initialize = function(data_path){
		alertsData <- alerts_data$new(data_path)
		self$alertsData <- alertsData
		},
		
		subset_level = function(){
			stopifnot(toupper(self$data_level) %in% c("CITY","COMPLAINT","WARD"))
			
			if(toupper(self$data_level) == "WARD"){
				subset_data <- self$alertsData$wardLevel(self$ward,self$periodicity)
			}else if(toupper(self$data_level) == "COMPLAINT"){
				subset_data <- self$alertsData$complaintLevel(self$complaint.type,self$periodicity)
			}else{
				subset_data <- self$alertsData$cityLevel(self$periodicity)
			}
			self$subset_data <- subset_data
			subset_data
		},
		
		detect_anomaly = function(start_date, end_date){
		
			subset_data <- window(self$subset_data, start= paste0(start_date," 00:00:00"), end= paste0(end_date," 23:59:59"))
			construct.frame <- function(xtsobj) {
				data.frame(time=index(xtsobj), values=coredata(xtsobj))
			}
			
			subset_df <- construct.frame(subset_data)
			anomaly <- AnomalyDetectionTs(subset_df, plot=T)
			anomaly$plot
			anomaly			
			
		},
		anomaly_in_one_day = function(input_date,...){
		
		in_arguments <- list(...)
			
		if(is.null(self$data_level)){
			stop("Choose the level of data: City, Complaint or Ward")
		}
		if(is.null(self$periodicity)){
			print("Changing the periodicty to hour")
			self$periodicity <- "hour"
		}else if(toupper(self$periodicity) == "DAY"){
			print("Changing the periodicty to hour")
			self$periodicity <- "hour"
		}
		if(is.null(self$subset_data)){
			self$subset_level()
		}
		
		ifelse("param.alpha" %in% names(in_arguments), param.alpha <- in_arguments$param.alpha ,param.alpha <- 0.05)
		ifelse("param.direction" %in% names(in_arguments), param.direction <- in_arguments$param.direction ,param.direction <- "pos")
		ifelse("param.max_anoms" %in% names(in_arguments),param.max_anoms <- in_arguments$param.max_anoms ,param.max_anoms <- 0.1)
				
		anomalies.around <- function(xtsobj, date, window.size=60) {
			end_time <- date
			start_time <- date - (24 * 60 * 60 *  window.size)
			subset_data <- window(xtsobj, start=start_time, end=end_time)
								
			tryCatch({
				anomalies <<- AnomalyDetectionVec(drop(coredata(subset_data)),period=24, plot=T, only_last = T, direction = param.direction,
												 alpha = param.alpha, max_anoms = param.max_anoms)
						
				out_subset <<- data.frame(Anom_points = subset_data[anomalies$anoms$index,])
				
				if(nrow(out_subset) == 0){
					out_subset <<- data.frame(Anom_points = numeric(0))
				}
			},error = function(e){
				if(grepl("detection needs at least 2 periods worth of data",as.character(e))){
					out_subset <<- data.frame(Anom_points = numeric(0))
				}else{
					print("Error: Unable to detect anomalies")
					out_subset <<- NULL
				}
			})
			
			list(anomalies = anomalies,anomaly_points = out_subset)
		
		}
		
		anoms <- anomalies.around(self$subset_data, as.POSIXct(paste0(input_date," 23:59:59")))
				
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
		}))
		
#a <- AnomalyDetection$new(data_path)
#a$data_level <- "city"
#a$anomaly_in_one_day("2012-02-01")