library(dygraphs)

shinyServer(function(input, output) {

  subsetDf <- reactive({
    subs <- df
    complaintType <- input$complaintType
    ward <- input$ward
    startDate <- input$dateRange[1]
    endDate <- input$dateRange[2]
    status <- input$status
    daysToResolveMin <- input$daysToResolve[1]
    daysToResolveMax <- input$daysToResolve[2]
    
    subs <- subs[subs$Complaint.Date >= startDate & 
                   subs$Complaint.Date <= endDate, ]
    subs <- subs[subs$Number.of.days.for.resolution >= daysToResolveMin &
                   subs$Number.of.days.for.resolution <= daysToResolveMax, ]
    
    if (complaintType != "All") {
      subs <- subs[subs$Complaint.Type == complaintType, ]
    }
    if (ward != "All") {
      subs <- subs[subs$Ward == ward, ]
    }
    if (status != "ALL") {
      subs <- subs[subs$Is.Resolved == status, ]
    }
    
    subs
  })
  
  getSeries <- reactive({
    subs <- subsetDf()
    series <- xts(subs$NumComplaints, subs$Complaint.Date)
    timePeriod <- input$timePeriod
    if (timePeriod == "Daily") {
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
})

