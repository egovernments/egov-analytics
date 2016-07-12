shinyServer(function(input, output) {
  getData <- reactive({
    raw <- datasets[[input$dataSet]]
    # since pre-2012, there were very few data points, subset it. also, we only consider 2015 data    
    return(window(raw, start=c(2012,1), end=c(2015, 12)))
  })
  
  rValues <- reactiveValues()
  
  getProcessed <- reactive({
    monthly <- getData()
    monthlyComponents <- decompose(monthly)
    # pre processing
    if(input$adjustForSeasonality) {
      monthly <- monthly - monthlyComponents$seasonal
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
    trainEnd <- c(2014, 12)
    testStart <- c(2015, 1)
    testEnd <- c(2015, 12)
    
    # split into 'test' and 'train' set
    trainData <- window(monthly, start=trainStart, end=trainEnd)
    testData <- window(monthly, start=testStart, end=testEnd)
    
    rValues$trainData <-trainData
    rValues$testData <- testData
    
    # model the data
    if(input$method == "ARIMA") {
      
      if(input$ARIMA.boxCox) {
        lambda <- input$ARIMA.lambda
      } else {
        lambda <- NULL  
      }
      fit <- Arima(trainData, order=c(input$ARIMA.p, input$ARIMA.d, input$ARIMA.q), 
                   method="ML", lambda=lambda)
      rValues$fit <- fit
      plot(forecast(fit, h=12), main=paste0("Forecasts for ",input$dataSet))
      lines(testData, lty=2)  
    }
    # Add other methods
  })
  
  output$displayMetrics <- renderTable({
    accuracy(forecast(rValues$fit, h=12), rValues$testData)
  })
  
  
})