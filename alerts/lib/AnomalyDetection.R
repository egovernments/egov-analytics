library(AnomalyDetection)
library(dygraphs)

data_path <- "..\\cocUptoJuly2016\\cocUptoJuly2016.csv"

#Function to subset - Uses the R6 alertsdata class to subset
subset_level = function(alertsData, data_level, periodicity){
	
	stopifnot(toupper(data_level) %in% c("CITY","COMPLAINT","WARD"))
	
	if(toupper(data_level) == "WARD"){
		subset_data <- alertsData$wardLevel(ward,periodicity)
	}else if(toupper(data_level) == "COMPLAINT"){
		subset_data <- alertsData$complaintLevel(complaint.type,periodicity)
	}else{
		subset_data <- alertsData$cityLevel(periodicity)
	}
	subset_data <- subset_data
	subset_data
}
	
#Anomaly detection at a required level	
detect_anomaly = function(alertsData, start_date, end_date, data_level, periodicity){
	
	
	subset_data <- subset_level(alertsData,data_level, periodicity)
	subset_data <- window(subset_data, start= paste0(start_date," 00:00:00"), end= paste0(end_date," 23:59:59"))
	
	construct.frame <- function(xtsobj) {
		data.frame(time=index(xtsobj), values=coredata(xtsobj))
	}
	
	subset_df <- construct.frame(subset_data)
	anomaly <- AnomalyDetectionTs(subset_df, plot=T)
	anomaly$plot
	anomaly			
	
}
		
#Detecting anomaly for a particular day
#Periodicity is by default - hourly		
anomaly_in_one_day = function(alertsData,
							  data_level,
							  input_date,...){

	subset_data <- subset_level(alertsData,data_level, periodicity = "hour")
	in_arguments <- list(...)
		
	ifelse("param.alpha" %in% names(in_arguments), param.alpha <- in_arguments$param.alpha ,param.alpha <- 0.05)
	ifelse("param.direction" %in% names(in_arguments), param.direction <- in_arguments$param.direction ,param.direction <- "pos")
	ifelse("param.max_anoms" %in% names(in_arguments),param.max_anoms <- in_arguments$param.max_anoms ,param.max_anoms <- 0.1)
			
	anomalies.around <- function(xtsobj, date, window.size=60) {
		end_time <- date
		start_time <- date - (24 * 60 * 60 *  window.size)
		subset_data <- window(xtsobj, start=start_time, end=end_time)
							
		tryCatch({
			if(!"anomalies" %in% ls()) rm(anomalies)
			anomalies <- AnomalyDetectionVec(drop(coredata(subset_data)),period=24, plot=T, only_last = T, direction = param.direction,
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
		
#ad <- AnomalyDetection$new(data_path)
#anomaly_in_one_day(ad,"city","2012-02-01")
#detect_anomaly(ad,"2012-02-01","2014-02-02","city","day")
