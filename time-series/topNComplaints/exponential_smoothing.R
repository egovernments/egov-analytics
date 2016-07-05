# model
ls_train_es_forecast <- lapply(ls_ts_train, HoltWinters)

# checking on train set
ls_train_es_forecast[[1]]
plot(ls_train_es_forecast[[1]])

# forecast on test set
ls_test_es_forecast <- lapply(ls_train_es_forecast, function(x) {
  forecast.HoltWinters(x, h=3)
})

plot.forecast(ls_test_es_forecast[[1]]) #80% and 95% CI
lines(ls_ts_test[[1]], col='red')

plot.forecast(ls_test_es_forecast[[2]]) #80% and 95% CI
lines(ls_ts_test[[2]], col='red')

# validating
Acf(ls_test_es_forecast[[1]]$residuals, lag.max=20)
Box.test(ls_test_es_forecast[[1]]$residuals, lag=20, type="Ljung-Box")

plot.ts(ls_test_es_forecast[[1]]$residuals)

# defining function to plot normal on top of residual's histogram
plotForecastErrors <- function(forecasterrors)
{
  # make a histogram of the forecast errors:
  mybinsize <- IQR(forecasterrors)/4
  mysd   <- sd(forecasterrors)
  mymin  <- min(forecasterrors) - mysd*5
  mymax  <- max(forecasterrors) + mysd*3
  # generate normally distributed data with mean 0 and standard deviation mysd
  mynorm <- rnorm(10000, mean=0, sd=mysd)
  mymin2 <- min(mynorm)
  mymax2 <- max(mynorm)
  if (mymin2 < mymin) { mymin <- mymin2 }
  if (mymax2 > mymax) { mymax <- mymax2 }
  # make a red histogram of the forecast errors, with the normally distributed data overlaid:
  mybins <- seq(mymin, mymax, mybinsize)
  hist(forecasterrors, col="red", freq=FALSE, breaks=mybins)
  # freq=FALSE ensures the area under the histogram = 1
  # generate normally distributed data with mean 0 and standard deviation mysd
  myhist <- hist(mynorm, plot=FALSE, breaks=mybins)
  # plot the normal curve as a blue line on top of the histogram of forecast errors:
  points(myhist$mids, myhist$density, type="l", col="blue", lwd=2)
}
plotForecastErrors(ls_test_es_forecast[[1]]$residuals)
