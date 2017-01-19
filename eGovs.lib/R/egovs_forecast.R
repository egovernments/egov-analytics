
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


egovs_forecasts <- function(series,
                            ts_model,
                            forecast_points = 3,
                            as.df = TRUE,
                            cleaned = FALSE,
                            stl_decompose = FALSE,
                            ...) {
  model_args <- list(...)

  print(model_args)

  ## TODO validate model_args

  ts_model <- toupper(ts_model)
  if (!(ts_model %in% c("ARIMA", "ETS"))) {
    stop("Error: Only ETS and ARIMA can be modelled")
  }

  if (forecast_points > 12) {
    warning("Warning: Forecasting for large data points may reduce accuracy")
  }

  # Cleaning to remove outliers
  if (cleaned == TRUE) {
    series <- tsclean(series)
  }

  # Seasonal adjustment
  if (stl_decompose == TRUE) {
    stl.fit <- stl(series, s.window = "periodic")
    series <- seasadj(stl.fit)
    seasonal_part <- stl.fit[[1]][, 1]
  }

  if (toupper(ts_model) == "ARIMA") {
    # TODO add validation that p, d, q is present
    order <- c(model_args$arima.p, model_args$arima.d, model_args$arima.q)
    lambda <- model_args$lambda
    fit <- Arima(series, order = order, lambda = lambda)
    predictions <- forecast(fit, forecast_points)$mean

  } else if (toupper(ts_model) == "ETS") {
    # Preprocessing in ETS
    min_ts_value <- min(series)
    bias_value <- (-1 * min_ts_value) + 1
    ES_series <- series + bias_value

    ES_series[ES_series == 0] = 0.1

    # Forecasts
    damped <- model_args$ets.damped
    ets.model <- model_args$ets.model
    fit <- ets(ES_series, model = ets.model, damped = damped)
    predictions <- forecast.ets(fit, h = forecast_points)$mean - bias_value
  }
  if (stl_decompose == TRUE) {
    seasonal_mean <- period_stat(seasonal_part, 2, c(2012, 1), years = 7)
    predictions <- predictions + seasonal_mean
  }
  if(as.df) {
    pred.frame <- data.frame(Year = floor(time(predictions)),
                             Month = month.abb[cycle(predictions)],
                             Forecast = coredata(predictions))
    pred.frame
  } else {
    predictions
  }

}

# TODO Include functions to plot See if confidence interval has to be included #If yes, then they too have to be seasonlly adjusted


# Example Call
# egovs_forecasts(series, ts_model = "ets", ets.model="AAA", ets.damped=TRUE)
# egovs_forecasts(series, ts_model = "arima", forecast_points = 5, arima.p = 3, arima.q = 2, arima.d = 1, arima.lambda=NULL)



