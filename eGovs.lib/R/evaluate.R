
evaluate_forecasts <- function(predictions, test_series) {
  stopifnot("forecast" %in% class(predictions))
  acc <- as.data.frame(forecast::accuracy(predictions, test_series))
  acc$Data.Set <- row.names(acc)
  row.names(acc) <- NULL
  acc
}

evaluate_rolling_forecasts <- function(predictions, test_series) {

}

evalute_forecasts_conf <- function()

Evaluate <- R6Class("Evaluate",
    public = list(
	  ts_data = NULL,
      test = NULL,
	  train = NULL,
	  param_list = NULL,
	  model_type = NULL,
	  forecast = NULL,

	  initialize = function(ts_data, test_points){
		self$ts_data = ts_data
		train <- window(ts_data, end = c(end(ts_data)[1],(end(ts_data)[2] - test_points)))
		test <- window(ts_data, start = c(end(ts_data)[1],(end(ts_data)[2] - test_points + 1 )))
		self$train <- train
		self$test <- test

		},

		set_parameters = function(param_list, model_type){
			self$param_list <- param_list
			self$model_type <- model_type
		},

		get_forecast = function(){

			if(is.null(self$param_list) | is.null(self$model_type)){
				stop("Specify the model type and parameters")
			}

			self$forecast = egovs_forecasts(self$train,
									   ts_model = self$model_type,
									   model_spec = self$param_list,
									   forecast_points = length(self$test),
									   as.df = FALSE)
			print(self$forecast)


		},

		get_accuracy = function(){

			if(is.null(self$forecast)){
				stop("No forecast available to compute accuracy")
			}

			print("Overall MAPE")
			print(accuracy(self$forecast, self$test))
			test_months <- substr(as.yearmon(time(self$test)),1,3)
			print("Month wise MAPE:")

			monthly_accuracy <- 100 * abs((self$test - self$forecast)/(self$test))
			names(monthly_accuracy) <- test_months
			print(monthly_accuracy)


			plot(self$ts_data)
			lines(self$forecast, col = "red")
			lines(self$test, col = "blue")
			legend("topleft",lty=c(1,1),col = c("blue","red"),c("Test data", "Forecast"))

		},

		rolling_accuracy = function(){
			if(is.null(self$param_list) | is.null(self$model_type)){
				stop("Specify the model type and parameters")
			}
			test_points <- length(self$test)
			accuracy_df <- data.frame(Test_points = numeric(), MAPE = numeric())
			for(rolling in 1:test_points){

				train <- window(self$ts_data, end = c(end(self$ts_data)[1],(end(self$ts_data)[2] - rolling)))
				test <- window(self$ts_data, start = c(end(self$ts_data)[1],(end(self$ts_data)[2] - rolling + 1 )))

				forecast <- egovs_forecasts(train,
									   ts_model = self$model_type,
									   model_spec = self$param_list,
									   forecast_points = length(self$test),
									   as.df = FALSE)

				accuracy_val <- round(accuracy(forecast, test)[5],2)

				temp_df <- data.frame(Test_points = rolling, MAPE = accuracy_val)
				accuracy_df <- rbind(accuracy_df,temp_df)

			}
			print(accuracy_df)
		}))
