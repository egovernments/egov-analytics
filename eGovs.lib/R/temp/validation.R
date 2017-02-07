devtools::document()
devtools::load_all(reset = T)

cd <- ComplaintsData$new("~/workspaces/datakind-ws/cocUptoDec2016.csv")

train_test_split <- function(complaint.type, train_start) {
  series <- cd$getComplaintData(complaint.type)

  train_end <- c(2016, 9)
  test_start <- c(2016, 10)
  test_end <- c(2016, 12)

  train_series <- window(series, start=train_start, end=train_end)
  test_series <- window(series, start=test_start, end=test_end)

  list(
    "train" = train_series,
    "test" = test_series
  )
}

### Non Burning of Street Lights
split <- train_test_split("Non Burning of Street Lights", train_start=c(2012, 4))
train_series <- split$train
test_series <- split$test

# model - 1
predictions <- egovs_forecasts(train_series,
                               stl.decompose = T,
                               stl.period="periodic",
                               cleaned = F,
                               ts_model = "arima",
                               arima.p = 5,
                               arima.d = 0,
                               arima.q = 1,
                               as.df=F)
plotForecast(train_series, predictions, test_series)
evaluate_forecasts(predictions, test_series)

# model - 2
predictions <- egovs_forecasts(train_series,
                               stl.decompose = T,
                               stl.period="periodic",
                               cleaned = T,
                               ts_model = "ets",
                               ets.model = "MAN",
                               ets.damped = T,
                               as.df=F)
plotForecast(train_series, predictions, test_series)
evaluate_forecasts(predictions, test_series)

### Dog menace
split <- train_test_split("Dog menace ", train_start=c(2012, 4))
train_series <- split$train
test_series <- split$test

# model - 1
predictions <- egovs_forecasts(train_series,
                               stl.decompose = T,
                               stl.period="periodic",
                               cleaned = F,
                               ts_model = "arima",
                               arima.p = 3,
                               arima.d = 1,
                               arima.q = 6,
                               as.df=F)
plotForecast(train_series, predictions, test_series)
evaluate_forecasts(predictions, test_series)

# model - 2
predictions <- egovs_forecasts(train_series,
                               stl.decompose = T,
                               cleaned = T,
                               ts_model = "ets",
                               ets.model = "MNN",
                               ets.damped = F,
                               as.df=F)
plotForecast(train_series, predictions, test_series)
evaluate_forecasts(predictions, test_series)

### Removal of garbage
split <- train_test_split("Removal of garbage", train_start=c(2012, 4))
train_series <- split$train
test_series <- split$test

# model - 1
predictions <- egovs_forecasts(train_series,
                               stl.decompose = T,
                               stl.period="periodic",
                               cleaned = T,
                               ts_model = "arima",
                               arima.p=1,
                               arima.d=1,
                               arima.q=9,
                               as.df=F)
plotForecast(train_series, predictions, test_series)
evaluate_forecasts(predictions, test_series)

# model - 2
predictions <- egovs_forecasts(train_series,
                               stl.decompose = T,
                               stl.period="periodic",
                               cleaned = T,
                               ts_model = "ets",
                               ets.model = "AAA",
                               ets.damped=F,
                               as.df=F)
plotForecast(train_series, predictions, test_series)
evaluate_forecasts(predictions, test_series)


### Stagnation of water
split <- train_test_split("Stagnation of water", train_start=c(2012, 1))
train_series <- split$train
test_series <- split$test

# model - 1
predictions <- egovs_forecasts(train_series,
                               stl.decompose = T,
                               stl.period="periodic",
                               cleaned = T,
                               ts_model = "arima",
                               arima.p=4,
                               arima.d=1,
                               arima.q=7,
                               as.df=F)
plotForecast(train_series, predictions, test_series)
evaluate_forecasts(predictions, test_series)

# model - 2
predictions <- egovs_forecasts(train_series,
                               stl.decompose = F,
                               cleaned = T,
                               ts_model = "ets",
                               ets.model="ANA",
                               ets.damped=F,
                               as.df=F)
plotForecast(train_series, predictions, test_series)
evaluate_forecasts(predictions, test_series)


### Mosquito menace
split <- train_test_split("Mosquito menace ", train_start=c(2012, 4))
train_series <- split$train
test_series <- split$test

# model - 1
predictions <- egovs_forecasts(train_series,
                               stl.decompose = T,
                               stl.period=6,
                               cleaned = T,
                               ts_model = "arima",
                               arima.p=3,
                               arima.d=1,
                               arima.q=6,
                               as.df=F)
plotForecast(train_series, predictions, test_series)
evaluate_forecasts(predictions, test_series)

# model - 2
predictions <- egovs_forecasts(train_series,
                               stl.decompose = F,
                               cleaned = T,
                               ts_model = "ets",
                               ets.model="MNM",
                               ets.damped=F,
                               as.df=F)
plotForecast(train_series, predictions, test_series)
evaluate_forecasts(predictions, test_series)
