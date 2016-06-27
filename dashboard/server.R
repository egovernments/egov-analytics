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
  
  getTSObject <- reactive({
    # TODO add functionality for other periodicities, right now only monthly is supported
    subs <- subsetDf()
    minYear <- year(min(subs$Complaint.Date))
    maxYear <- year(max(subs$Complaint.Date))
    ideal <- data.frame(Month=character(), Year=integer(), stringsAsFactors=F)
    for(year in seq(from=minYear, to=maxYear)) {    
      for(month in month.abb) {
        r <- nrow(ideal)
        month <- as.character(month)
        ideal[nrow(ideal)+1,] <- c(month, year)        
      }
    }
    series <- xts(subs$NumComplaints, subs$Complaint.Date)
    series <- apply.monthly(series, FUN = sum)
    monthlyData <- data.frame(Date=index(series), Complaints=coredata(series))
    monthlyData$Month <- month.abb[month(monthlyData$Date)]
    monthlyData$Year <- year(monthlyData$Date)
    joined <- merge(x = ideal, y = monthlyData, by = c("Month", "Year"), sort=F, all= T)
    joined$Date <- NULL
    joined <- joined[order(as.yearmon(paste0(joined$Year, "-", joined$Month), "%Y-%b")), ]
    joined[is.na(joined$Complaints), ]$Complaints <- 0   
    monthly <- ts(monthlyData$Complaints, start=c(minYear, 1), frequency = 12)
  })
  
  output$plotData <- renderDygraph({
    dygraph(getSeries(),
            xlab = "Time",
            ylab = "Number of Complaints",
            main = "Number of Complaints Over Time") %>%
      dyRangeSelector()
  })
  
  output$plotSpread <- renderPlotly({
    subs <- subsetDf()
    series <- xts(subs$NumComplaints, subs$Complaint.Date)
    series <- apply.monthly(series, FUN = sum)
    monthlyData <- data.frame(date = index(series), coredata(series))
    monthlyData$Month <- month.abb[month(monthlyData$date)]
    monthlyData$Year <- year(monthlyData$date)
    names(monthlyData)[2] <- "count"
    months <- data.frame(Month = month.abb)
    monthlyData <- left_join(months, monthlyData)
    monthlyData[is.na(monthlyData$count), 3]  <- 0
    monthlyData$Month <- factor(monthlyData$Month, levels = month.abb, ordered = T)
    monthlyData <- monthlyData[order(monthlyData$Month), ]
    
    plot_ly(monthlyData, x = Month, y = count, 
                 group = Year, type = "bar")
  })
  
  output$plotTopNComplaints <- renderPlotly({
    subs <- subsetDf()
    counts <- data.frame(table(subs$Complaint.Type))
    if(nrow(counts) == 1) {
      return(NULL);
    }
    counts <- counts[order(-counts$Freq), ][1:input$topNComplaintTypes, ]
    counts <- counts[order(counts$Freq), ]
    plot_ly(x = counts$Freq, y = counts$Var1, 
            type = 'bar', orientation = 'h') %>% 
      layout(title = "Top complaint types",
             xaxis = list(title = 'Number of complaints'),
             yaxis = list(title = ''),
             margin = list(l = 300))
  })
  
  output$plotTopNWards <- renderPlotly({
    subs <- subsetDf()
    counts <- data.frame(table(subs$Ward))
    if(nrow(counts) == 1) {
      return(NULL);
    }
    counts <- counts[order(-counts$Freq), ][1:input$topNWards, ]
    counts <- counts[order(counts$Freq), ]
    plot_ly(x = counts$Freq, y = counts$Var1, 
            type = 'bar', orientation = 'h') %>% 
      layout(title = "Top wards by complaints",
             xaxis = list(title = 'Number of complaints'),
             yaxis = list(title = ''),
             margin = list(l = 300))
  })
  
  output$plotACFAndPACF <- renderPlot({
    tsdisplay(getTSObject(), main = "ACF and PACF plots for monthly complaint data")
  })
  
  output$plotSeasonPlot <- renderPlot({
    seasonplot(getTSObject(),ylab="Number of complaints", xlab="Year",
               main=paste0("Seasonal plot for monthly complaint data"),
               year.labels=TRUE, year.labels.left=TRUE, col=1:20, pch=19)
  })
  
  output$plotDecomposition <- renderPlot({
    # TODO
    return(NULL)
  })
})

