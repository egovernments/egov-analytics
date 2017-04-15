shinyServer(function(input, output) {
  
  clicked_x <- reactive({
    input$dygraph_click
  })
  
  subsetDf <- reactive({
    subs <- df
    complaintType <- input$complaintType
    ward <- input$ward
    startDate <- as.POSIXct(input$dateRange[1])
    endDate <- as.POSIXct(input$dateRange[2])
    status <- input$status
    subs <- subs %>% 
      filter(Complaint.Date >= startDate, Complaint.Date <= endDate)
    
    if (complaintType != "All") {
      subs <- subs %>% 
                filter(Complaint.Type == complaintType)
      
    }
    if (ward != "All") {
      subs <- subs %>% 
        filter(Ward == ward)
    }
    subs
  })
  
  getSeries <- reactive({
    subs <- subsetDf()
    series <- xts(subs$NumComplaints, subs$Complaint.Date)
    timePeriod <- input$timePeriod
    if(timePeriod == "Hourly") {
      # http://stackoverflow.com/questions/16019187/why-is-there-no-apply-hourly-in-r-with-xts-zoo
      series <- period.apply(series, endpoints(series, "hours"), FUN = sum)
    } else if (timePeriod == "Daily") {
      series <- apply.daily(series, FUN = sum)
    } else if (timePeriod == "Weekly") {
      series <- apply.weekly(series, FUN = sum)
    } else if (timePeriod == "Monthly") {
      series <- apply.monthly(series, FUN = sum)
    } else if (timePeriod == "Quarterly") {
      series <- apply.quarterly(series, FUN = sum)
    }
    series
  })
  
  
  
  output$plotData <- renderDygraph({
    dygraph(getSeries(),
            xlab = "Time",
            ylab = "Number of Complaints",
            main = "Number of Complaints Over Time") %>% 
      dyRangeSelector()
  })

  output$plotAnoms <- renderPlot({
    series <- getSeries()
    if(input$detectAnoms == FALSE) {
      return(NULL)
    }
    anom.date <- strftime(input$anoms.date, "%Y-%m-%d 23:59:59")
    anoms <- anomalies.around(series, as.POSIXct(anom.date), window.size = input$window.size)
    
    if(nrow(anoms$anoms$anoms) > 0) {
      anoms$anoms$plot
    } else {
      plot(anoms$series, main="No anomalies found")
    }
  })

})

