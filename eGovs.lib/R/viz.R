

# since ggplot2 requires dataframes, we need to convert `ts` objects to dataframs
ts.to.df <- function(series) {
  years.f <- floor(index(series))
  months.f <- cycle(series)
  data.frame(Time=as.POSIXct(paste0(years.f,"-", months.f, "-01")),
             Data=coredata(series), stringsAsFactors = FALSE)
}

plotSeries <- function(series, title="Series") {
  series.df <- ts.to.df(series)
  ggplot(series.df, aes(x = Time, y = Data)) +
    geom_line() +
    geom_point(size=0.5) +
    ggtitle(title)
}

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

plotMeanForecast <- function(series, mean_forecast) {
  if(!("ts" %in% class(mean_forecast))) {
    stop("mean_forecast must be a object of `ts`")
  }
  mean_forecast <- ts.to.df(mean_forecast)
  plotSeries(series) +
    geom_line(data=mean_forecast, mapping = aes(x=Time, y=Data), color="red") +
    geom_point(data=mean_forecast, mapping = aes(x=Time, y=Data), color="red")
}
