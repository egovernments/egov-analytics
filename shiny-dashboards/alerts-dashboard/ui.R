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
          start = as.Date(minDate), end = as.Date(maxDate)
        ),
        checkboxInput(
          "detectAnoms", label = "Detect Anomalies?"
        ),
        dateInput(
          "anoms.date", label = "Date to detect anomalies around",
          value = "2014-11-22"
        ),
        sliderInput(
          "window.size", label = "Days to consider",
          min = 30, max = 120, value = 60
        )
      )
    ),
    mainPanel(
      tabsetPanel(
        tabPanel(
          title = 'Data',
          tags$style(type = "text/css",
                     ".shiny-output-error { visibility: hidden; }",
                     ".shiny-output-error:before { visibility: hidden; }"
          ),
          dygraphOutput('plotData'),
          h4("Output of AnomalyDetection (only last day)"),
          plotOutput('plotAnoms')
        )
      )
    )
  )
))