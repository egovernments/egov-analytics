# ts_data - Input data in the time series format ts_model - ARIMA/ETS model_spec - pdq;lambda values for ARIMA/ ETS;damped specification for exponential smoothing
# cleaned - TRUE/FASE stl_decompose - TRUE/FALSE

# Test input

ts_model <- "arima"
forecast_points <- 3
model_spec <- list(c(1, 0, 1), NULL)

# libraries
library(forecast)

# Call function
egovs_forecasts(ts_data, ts_model = "ets", model_spec = list("AAA", FALSE), forecast_points = 3)

egovs_forecasts(ts_data, ts_model = "arima", model_spec = list(c(1, 0, 1), NULL), forecast_points = 5)



# Function definition

egovs_forecasts <- function(input_data, ts_model, model_spec, cleaned = TRUE, stl_decompose = TRUE, forecast_points) {
    
    data_subset <- input_data
    
    if (!(toupper(ts_model) %in% c("ARIMA", "ETS"))) {
        stop("Error: Only ETS and ARIMA can be modelled")
    }
    
    if (forecast_points > 12) {
        warning("Warning: Forecasting for large data points may reduce accuracy")
    }
    
    # Conditional check for model_spec as well
    
    series <- ts_data
    
    # Cleaning the ts_data to remove outliers
    if (cleaned == TRUE) {
        ts_data <- tsclean(ts_data)
    }
    
    
    # Seasonal adjustment
    if (stl_decompose == TRUE) {
        stl.fit <- stl(ts_data, s.window = "periodic")
        ts_data <- seasadj(stl.fit)
        seasonal_part <- stl.fit[[1]][, 1]
    }
    
    series <- ts_data
    
    ################################# Function for average seasonality over years
    
    period_stat <- function(ts_data_in, type = 1, start_value, years) {
        # type 1: sum type 2: mean
        
        freq <- frequency(ts_data_in)
        len <- length(ts_data_in)
        
        freq_vector <- numeric(0)
        freq_sum <- numeric(0)
        vec <- numeric(0)
        sum_vec <- numeric(0)
        
        start_val <- start(ts_data_in)
        
        ts_data_in <- c(rep(NA, start_val[2] - 1), ts_data_in)
        
        max_limit <- ceiling(len/freq)
        for (i in 1:max_limit) {
            
            vec <- ts_data_in[(((i - 1) * freq) + 1):(((i - 1) * freq) + freq)]
            freq_vector <- as.numeric(!is.na(vec))
            vec[is.na(vec)] <- 0
            
            if (i == 1) {
                sum_vec <- vec
                freq_sum <- freq_vector
                
            } else {
                
                sum_vec <- sum_vec + vec
                freq_sum <- freq_sum + freq_vector
            }
        }
        
        final_ts <- numeric(0)
        
        if (type == 1) {
            final_ts <- sum_vec
        } else if (type == 2) {
            
            final_ts <- (sum_vec/freq_sum)
        } else {
            stop("Invalid type")
        }
        
        return(ts(rep(final_ts, years), frequency = freq, start = start_value))
        
    }
    ########################################################################## 
    
    
    if (toupper(ts_model) == "ARIMA") {
        # ARIMA arima_order <- c(1, 0, 4)
        
        fit <- Arima(series, order = model_spec[[1]], lambda = model_spec[[2]])
        predictions <- forecast(fit, forecast_points)$mean
        
        # ETS
    } else if (toupper(ts_model) == "ETS") {
        
        # Preprocessing in ETS
        min_ts_value <- min(series)
        bias_value <- (-1 * min_ts_value) + 1
        ES_series <- series + bias_value
        
        ES_series[ES_series == 0] = 0.1
        
        # Forecasts
        fit <- ets(ES_series, model = model_spec[[1]], damped = model_spec[[2]])
        predictions <- forecast.ets(fit, h = forecast_points)$mean - bias_value
        
    }
    if (stl_decompose == TRUE) {
        seasonal_mean <- period_stat(seasonal_part, 2, c(2012, 1), years = 7)
        predictions <- predictions + seasonal_mean
    }
    
    return(predictions)
    
}

# TODO Include functions to plot See if confidence interval has to be included #If yes, then they too have to be seasonlly adjusted