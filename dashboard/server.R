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
  
  #
  # This is the monthly plot of the data
  #
  output$plotSpread <- renderPlot({
    subs <- subsetDf()
    series <- xts(subs$NumComplaints, subs$Complaint.Date)
    series <- apply.monthly(series, FUN = sum)
    monthlyData <- data.frame(date=index(series), coredata(series))
    monthlyData$Month <- month.abb[month(monthlyData$date)]
    monthlyData$Year <- year(monthlyData$date)
    years <- unique(monthlyData$Year)
    opar <- par(mfrow=c(3,2), pin=c(4, 1.5), mar=c(5, 4, 4, 2))
    for(year in years) {
      md <- monthlyData[monthlyData$Year == year, ]
      months <- data.frame(Month=month.abb)
      names(md)[2] <- "count"
      joined <- merge(x = months, y = md, by = c("Month"), sort=F, all.x = T)
      joined[is.na(joined$count), 3]  <- 0
      joined$Month <- factor(joined$Month, levels=month.abb, ordered = T)
      joined <- joined[order(joined$Month), ]
      p <- barplot(joined$count, 
                   names.arg = joined$Month, main=paste0("Complaints for Year ", year))
    }
    par(opar)
  })
  
  output$plotTopNComplaints <- renderPlot({
    subs <- subsetDf()
    counts <- data.frame(table(subs$Complaint.Type))
    if(nrow(counts) == 1) {
      return(NULL);
    }
    counts <- counts[order(-counts$Freq), ][1:input$topNComplaintTypes, ]
    counts <- counts[order(counts$Freq), ]
    par(mai=c(1,4,1,1))
    barplot(counts$Freq, names.arg = counts$Var1, horiz=T, las=1, 
            main="Top complaint types", 
            xlab="Number of complaints")
  })
})

