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
    
	#Assuming zero days for NA values
	subs$Number.of.days.for.resolution[is.na(subs$Number.of.days.for.resolution)] <- 0
	
    subs <- subs[subs$Complaint.Date >= startDate & 
                   subs$Complaint.Date <= endDate, ]
    subs <- subs[subs$Number.of.days.for.resolution >= daysToResolveMin &
                   subs$Number.of.days.for.resolution <= daysToResolveMax, ]
    
    if (complaintType != "All") {
      subs <- subs[subs$Complaint.Type == complaintType, ]
    }
	
	if (ward != "All") {
      subs <- subs[subs$Ward %in% ward, ]
    }
    subs
  })
  
  getSeries <- reactive({
    subs <- subsetDf()
	#print(head(subs))
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
    #print("TEST TEST")
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
    months_1 <- data.frame(Month = month.abb)
	monthlyData <- left_join(months_1, monthlyData)
    monthlyData[is.na(monthlyData$count), 3]  <- 0
    monthlyData$Month <- factor(monthlyData$Month, levels = month.abb, ordered = T)
    monthlyData <- monthlyData[order(monthlyData$Month), ]
    monthlyData_1 <- monthlyData
	monthlyData_1$date <- NULL
	md <- spread(monthlyData_1, Year, count)
	
	#Checking if all the columns are present
	ifelse("2012" %in% names(md),"",md$`2012` <- NA)
	ifelse("2013" %in% names(md),"",md$`2013` <- NA)
	ifelse("2014" %in% names(md),"",md$`2014` <- NA)
	ifelse("2015" %in% names(md),"",md$`2015` <- NA)
	ifelse("2016" %in% names(md),"",md$`2016` <- NA)
	
	md <- md[!names(md) %in% "<NA>"]
	
	plot_ly(md, x = ~Month, y = ~`2016`,name = 'Year 2016',type = "bar") %>%
	add_trace(y = ~`2015`, name = 'Year 2015') %>%
	add_trace(y = ~`2014`, name = 'Year 2014') %>%
	add_trace(y = ~`2013`, name = 'Year 2013') %>%
	add_trace(y = ~`2012`, name = 'Year 2012') %>%
	layout(yaxis = list(title = 'Complaints'), barmode = 'group')

				  
  })
  
  output$plotTopNComplaints <- renderPlotly({
    subs <- subsetDf()
    counts <- data.frame(table(subs$Complaint.Type))
    if(nrow(counts) == 1) {
      return(NULL);
    }
    counts <- counts[order(-counts$Freq), ][1:input$topNComplaintTypes, ]
    counts <<- counts[order(counts$Freq), ]
   
   counts$Var1 <- factor(counts$Var1, level = counts$Var1[order(counts$Freq)],order = TRUE)

	
	plot_ly(x = counts$Freq, y = counts$Var1, 
            type = 'bar') %>%
      layout(title = "Top complaint types",
            xaxis = list(title = 'Number of complaints'),
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
	
	counts$Var1 <- factor(counts$Var1, level = counts$Var1[order(counts$Freq)],order = TRUE)

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
    plot(stl(getTSObject(), s.window="per"), main="Decomposition of monthly complaint data")
  })
})

