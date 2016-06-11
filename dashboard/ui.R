shinyUI(fluidPage(
  theme = shinythemes::shinytheme('cosmo'),
  titlePanel("Egovernments"),
  sidebarLayout(
    sidebarPanel(
      width = 3,
      fluidRow(
        selectInput(
          "complaintType", label = h5("Complaint Type"), 
          # show only the top complaint types
          choices = c( "All", topComplaintTypes)
        ),
        selectInput(
          "ward", label = h5("Ward"),
          choices = c("All",
                      as.character(unique(df$Ward))
                      [order(as.character(unique(df$Ward)))])
        ),
        selectInput(
          "timePeriod", label = h5("Periodicity"),
          choices = choicesForTime
        ),
        dateRangeInput(
          "dateRange", label = "Date Range",
          min = minDate, max = maxDate,
          start = minDate, end = maxDate
        ),
        selectInput(
          "status", label = "Resolution Status",
          choices = c("ALL", "YES", "NO")
        ),
        sliderInput('daysToResolve', label = 'No. of Days to Resolve',
                    min = 0, max = 1050, value = c(0, 1050)),
        sliderInput('topNComplaintTypes', label = 'Number of Top Complaint Types',
                    min = 5, max = 15, value = 10)
      )
    ),
    mainPanel(
      fluidRow(dygraphOutput("plotData")),
      fluidRow(plotOutput("plotTopNComplaints")),
      fluidRow(plotOutput("plotSpread"))
    )
  )
))