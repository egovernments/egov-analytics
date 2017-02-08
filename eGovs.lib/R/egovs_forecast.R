
forecast_to_df <- function(predictions) {
  mean_f <- predictions$mean
  high_f <- predictions$upper
  low_f <- predictions$lower

  conf.intervals <- predictions$level

  pred.frame <- data.frame(Year = floor(time(mean_f)),
                           Month = month.abb[cycle(mean_f)],
                           Forecast = zoo::coredata(mean_f))

  forecast_points <- nrow(pred.frame)

  idx <- 1
  for(c in conf.intervals) {
    pred.frame[[paste0("Low", c)]] <- low_f[1:forecast_points, idx]
    pred.frame[[paste0("High", c)]] <- high_f[1:forecast_points, idx]
    idx <- idx + 1
  }

  pred.frame
}

#' Extract forecasts for a given time series.
#' @param series a \code{ts} object
#' @param ts_model the time series model to use. ex. \code{arima}
#' @param forecast_points the number of periods to forecast
#' @param as.df whether to return the results as a df. If false, a \code{forecast} object is returned
#' @param cleaned if set to \code{TRUE}, the series is cleaned before forecasting
#' @param stl.decompose if set to \code{TRUE} the series is decomposed using STL
#' @param conf.intervals the confidence intervals. a vector of numbers between 1-100
#' @param ... other model-specific params. see examples
#' @return the forecasts
#' @examples
#' egovs_forecasts(series, ts_model = "ets", ets.model="AAA", ets.damped=TRUE)
#' egovs_forecasts(series, ts_model = "arima", forecast_points = 5, arima.p = 3, arima.q = 2, arima.d = 1, lambda=NULL)
#' @export
egovs_forecasts <- function(series,
                            ts_model,
                            forecast_points = 3,
                            as.df = TRUE,
                            cleaned = FALSE,
                            stl.decompose = FALSE,
                            conf.intervals = c(80, 95),
                            ...) {
  ## TODO: Add validation for model_args

  model_args <- list(...)

  # add some default params for stl if not present
  if(is.null(model_args$stl.period)) {
    model_args$stl.period <- "periodic"
  }

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

  if(ts_model == "ARIMA") {
    order <- c(model_args$arima.p, model_args$arima.d, model_args$arima.q)
    lambda <- model_args$lambda
    model_function <- function(series) {
      Arima(series, order = order, lambda = lambda)
    }

    if(stl.decompose) {
      model <- stlm(series,
                    s.window = model_args$stl.period,
                    modelfunction = model_function)
    } else {
      model <- model_function(series)
    }
  } else if (ts_model == "ETS") {
    damped <- model_args$ets.damped
    ets.model <- model_args$ets.model
    lambda <- model_args$lambda
    model_function <- function(y) {
      min_ts_value <- min(y)
      bias_value <- (-1 * min_ts_value) + 1
      ES_series <- y + bias_value
      ES_series[ES_series == 0] = 0.1
      ets(ES_series,
          model = ets.model,
          damped = damped,
          lambda=lambda)
    }

    if(stl.decompose) {
      model <- stlm(series,
                    s.window = model_args$stl.period,
                    modelfunction = model_function)
    } else {
      model <- model_function(series)
    }
  }


  predictions <- forecast(model,
                          h=forecast_points,
                          level=conf.intervals,
                          lambda=model_args$lambda)

  if(as.df) {
    forecast_to_df(predictions)
  } else {
    predictions
  }
}
