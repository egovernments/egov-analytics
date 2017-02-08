
# since ggplot2 requires dataframes, we need to convert `ts` objects to dataframs
ts.to.df <- function(series) {
  years.f <- floor(zoo::index(series))
  months.f <- cycle(series)
  data.frame(Time=as.POSIXct(paste0(years.f,"-", months.f, "-01")),
             Data=zoo::coredata(series), stringsAsFactors = FALSE)
}

#' @export
plotSeries <- function(series, title="Series") {
  series.df <- ts.to.df(series)
  ggplot(series.df, aes(x = Time, y = Data)) +
    geom_line() +
    geom_point(size=0.5) +
    ggtitle(title)
}

#' @export
plotCleanedSeries <- function(series, cleaned) {
  series.df <- ts.to.df(series)
  cleaned.df <- ts.to.df(cleaned)
  changes <- cleaned.df[series.df$Data != cleaned.df$Data, ]
  ggplot(series.df, aes(x = Time, y = Data)) +
    geom_line(aes(x=Time, y=Data, color="original")) +
    geom_point(size=0.25) +
    geom_line(data=cleaned.df, mapping = aes(x=Time, y = Data, color="cleaned")) +
    geom_point(data=changes, mapping = aes(x=Time, y=Data, color="cleaned-point")) +
    ggtitle("Original vs Cleaned Series", subtitle = "Comparision") +
    scale_colour_manual(name = '',
                        values = c("original" = "grey", 'cleaned-point'='red', 'cleaned'='black'),
                        labels = c("Cleaned Series", 'Outliers','Original Series'))
}

#' @export
plotForecast <- function(series, predictions,
                         test_series = NULL) {
  if(!("forecast" %in% class(predictions))) {
    stop("mean_forecast must be a object of `ts`")
  }
  series.df <- ts.to.df(series)
  pred.frame <- forecast_to_df(predictions)
  pred.frame$Time <- as.POSIXct(paste0(pred.frame$Year,"-", pred.frame$Month, "-01"), format="%Y-%b-%d")
  print(pred.frame)
  int.plot <- ggplot(pred.frame)  +
    geom_line(aes(x=Time, y=Forecast), color="blue") +
    geom_line(data=series.df, aes(x = Time, y = Data))

  idx <- 1
  alphas <- seq(from=0.5, to=0.25, length.out = length(predictions$level))
  for(c in predictions$level) {
    hh <- paste0("High", c)
    ll <- paste0("Low", c)
    int.plot <- int.plot +
      geom_ribbon(aes_string(x="Time", ymax=hh, ymin=ll), fill="blue", alpha=alphas[idx])

    idx <- idx + 1
  }
  if(!is.null(test_series)) {
    test.series.df <- ts.to.df(test_series)
    int.plot <- int.plot +
      geom_line(data=test.series.df, mapping = aes(x=Time, y=Data), color="grey50")
  }
  int.plot
}
