shinyServer(function(input, output) {
  getData <- reactive({
    raw <- datasets[[input$dataSet]]
    dataStart <-
      c(year(input$dataRange[1]), month(input$dataRange[1]))
    dataEnd <-
      c(year(input$dataRange[2]), month(input$dataRange[2]))
    return(window(raw, start = dataStart, end = dataEnd))
  })
  
  rValues <- reactiveValues()
  
  getProcessed <- reactive({
    monthly <- getData()
    if (input$cleanOutliers) {
      monthly <- tsclean(monthly)
    }
    
    if (input$STL) {
      x.window <- "periodic"
      if (input$STL.Window > 0) {
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
    plot(series, col = "red", lty = 2)
    lines(tsclean(series), lty = 1)
    legend(
      "topright",
      col = c("red", "black"),
      lty = c(2, 1),
      legend = c("Original", "Cleaned")
    )
  })
  
  output$plotSTL <- renderPlot({
    series <- getData()
    if (input$cleanOutliers) {
      series <- tsclean(series)
    }
    x.window <- "periodic"
    if (input$STL.Window > 0) {
      x.window <- input$STL.Window
    }
    plot(stl(series, x.window))
  })
  
  output$plotTs <- renderPlot({
    tsdisplay(getProcessed(), main = "Processed Data")
  })
  
  output$plotForecast <- renderPlot({
    monthly <- getProcessed()
    
    trainStart <-
      c(year(input$trainRange[1]), month(input$trainRange[1]))
    trainEnd <-
      c(year(input$trainRange[2]), month(input$trainRange[2]))
    testStart <-
      c(year(input$testRange[1]), month(input$testRange[1]))
    testEnd <-
      c(year(input$testRange[2]), month(input$testRange[2]))
    
    # split into 'test' and 'train' set
    trainData <- window(monthly, start = trainStart, end = trainEnd)
    testData <- window(monthly, start = testStart, end = testEnd)
    rValues$trainData <- trainData
    rValues$testData <- testData
    
    # ARIMA
    if (input$method == "ARIMA") {
      fit <- Arima(trainData,
                   order = c(input$ARIMA.p, input$ARIMA.d, input$ARIMA.q))
      forecasted <- forecast(fit, h = 12)
    }
    
    # Exponential Smoothing - ETS
    else if (input$method == "Exponential Smoothing - ETS") {
      # Adjusting the training data for value less than 1
      # which will affect the multiplicative model
      trainData_ets <- trainData
      trainData_ets[trainData_ets < 1] <- 1
      
      model_type <-
        paste0(
          substr(input$error, 1, 1),
          substr(input$trend, 1, 1),
          substr(input$seasonality, 1, 1),
          collapse = ""
        )
      print(model_type)
      fit <-
        ets(trainData_ets,
            model = model_type,
            damped = input$damping)
      forecasted <- forecast.ets(fit, h = 12)
    }
    
    rValues$forecasted <- forecasted
    plot.forecast(forecasted,
                  main = paste0("Forecasts for ", input$dataSet, " using ", input$method))
    lines(testData, lty = 2, col = "red")
  })
  
  output$displayMetrics <- renderTable({
    accuracy(rValues$forecasted, rValues$testData)
  })
  
})