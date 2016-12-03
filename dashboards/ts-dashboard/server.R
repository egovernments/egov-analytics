shinyServer(function(input, output) {
  getData <- reactive({
    raw <- datasets[[input$dataSet]]
    # since pre-2012, there were very few data points, subset it. also, we only consider 2015 data    
    return(window(raw, start=c(2012,1), end=c(2016, 6)))
  })
  
  rValues <- reactiveValues()
  
  getProcessed <- reactive({
    monthly <- getData()
    if(input$cleanOutliers) {
      monthly <- tsclean(monthly)
    }
    
    if(input$STL) {
      x.window <- "periodic"
      if(input$STL.Window > 0) {
        x.window <- input$STL.Window
      }
      stl.fit <- stl(monthly, x.window)
      monthly <- seasadj(stl.fit)
      rValues$stl.fit <- stl.fit
    }
    
    monthly
  })

  output$plotOutliers <- renderPlot({
    series <- getData()
    plot(series, col="red", lty=2)
    lines(tsclean(series), lty=1)
    legend("topright", col=c("red", "black"), lty=c(2,1), legend=c("Original", "Cleaned"))
  })
  
  output$plotSTL <- renderPlot({
    series <- getData()
    if(input$cleanOutliers) {
      series <- tsclean(series)
    }
    x.window <- "periodic"
    if(input$STL.Window > 0) {
      x.window <- input$STL.Window
    }
    plot(stl(series, x.window))
  })
  
  output$plotTs <- renderPlot({
    tsdisplay(getProcessed(), main="Processed Data")
  })
  
  output$plotForecast <- renderPlot({
    monthly <- getProcessed()
    trainStart <- c(2012, 1)
    trainEnd <- c(2015, 6)
    testStart <- c(2015, 7)
    testEnd <- c(2016, 6)
    
    # split into 'test' and 'train' set
    trainData <- window(monthly, start=trainStart, end=trainEnd)
    testData <- window(monthly, start=testStart, end=testEnd)
    rValues$trainData <-trainData
    rValues$testData <- testData
    
    # ARIMA
    if(input$method == "ARIMA") {
      fit <- Arima(trainData, 
                   order=c(input$ARIMA.p, input$ARIMA.d, input$ARIMA.q))
      forecasted <- forecast(fit, h=12)
    }
    
    # Exponential_Smoothing_Standard
    else if(input$method == "Exponential_Smoothing_Standard") {
      fit <- ets(trainData)
      forecasted <- forecast.ets(fit, h=12)
    }
    # Exponential_Smoothing_HoltWinters
    else if(input$method == "Exponential_Smoothing_HoltWinters") {
      fit <- HoltWinters(trainData)
      forecasted <- forecast.HoltWinters(fit, h=12)
    } 
   
    
    rValues$forecasted <- forecasted
    plot.forecast(forecasted, 
         main=paste0("Forecasts for ",input$dataSet," using ",input$method))
    lines(testData, lty=2, col="red")
  })
  
  output$displayMetrics <- renderTable({
    accuracy(rValues$forecasted, rValues$testData)
  })
  
})