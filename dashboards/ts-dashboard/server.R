shinyServer(function(input, output) {
  getData <- reactive({
    raw <- datasets[[input$dataSet]]
    # since pre-2012, there were very few data points, subset it. also, we only consider 2015 data    
    return(window(raw, start=c(2012,1), end=c(2016, 6)))
  })
  
  rValues <- reactiveValues()
  
  getProcessed <- reactive({
    monthly <- getData()
    monthlyComponents <- decompose(monthly)
    if(input$logTransformation) {
      monthly[monthly==0] <- 1
      monthly <- log(monthly)
    }
    monthly
  })
  
  output$plotRaw <- renderPlot({
    plot(getData(), main="Raw Data")
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
    if(input$logTransformation) {
      testData <- exp(testData)
    }
    
    rValues$trainData <-trainData
    rValues$testData <- testData
    
    # ARIMA
    if(input$method == "ARIMA") {
      
      if(input$ARIMA.boxCox) {
        lambda <- input$ARIMA.lambda
      } else {
        lambda <- NULL  
      }
      fit <- Arima(trainData, order=c(input$ARIMA.p, input$ARIMA.d, input$ARIMA.q), 
                   method="ML", lambda=lambda)
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
    
    ## put other methods here
    
    # de-Log if log-transformation has been applied
    if(input$logTransformation) {
      forecasted$mean <- exp(forecasted$mean)
      forecasted$upper <- exp(forecasted$upper)
      forecasted$lower <- exp(forecasted$lower)
      forecasted$x <- exp(forecasted$x)
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