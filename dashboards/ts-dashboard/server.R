shinyServer(function(input, output) {
  getData <- reactive({
    raw <- datasets[[input$dataSet]]
    # since pre-2012, there were very few data points, subset it. also, we only consider 2015 data    
    return(window(raw, start=c(2012,1), end=c(2016, 6)))
  })
  
  rValues <- reactiveValues()
  
  getProcessed <- reactive({
    monthly <- getData()
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
    rValues$trainData <-trainData
    rValues$testData <- testData
    
    # ARIMA
    if(input$method == "ARIMA") {
      if(input$ARIMA.boxCox) {
        lambda <- input$ARIMA.lambda
      } else {
        lambda <- NULL  
      }
      if(input$ARIMA.seasonal) {
        seasonal <- c(input$ARIMA.P, input$ARIMA.D, input$ARIMA.Q)
      } else {
        seasonal <- c(0,0,0)
      }
      fit <- Arima(trainData, 
                   order=c(input$ARIMA.p, input$ARIMA.d, input$ARIMA.q), 
                   seasonal=seasonal,
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
    # Unobserved components model
    else if(input$method == "UCM") {
      fit <- ucm(formula=trainData~0, data=trainData, level=T, slope = T, season = T, cycle = T, season.length=input$UCM.season.length, cycle.period=input$UCM.cycle.period)
      forecasted <- predict(fit$model, n.ahead=12)
    }
    
    rValues$forecasted <- forecasted
    if(input$method == "UCM") {
      plot(monthly, lty=1, col=1)
      lines(testData, lty=1, col=2)
      lines(forecasted, lty=2, col=3)
      legend("topleft",
             col=c(1,2,3), 
             lty=c(1,1,2),
             legend=c("Actual Data", "Unseen (Test) Data", "Forecast"))
    } else {
      plot.forecast(forecasted, 
           main=paste0("Forecasts for ",input$dataSet," using ",input$method))
      lines(testData, lty=2, col="red")
    }
  })
  
  output$displayMetrics <- renderTable({
    accuracy(rValues$forecasted, rValues$testData)
  })
  
  
})