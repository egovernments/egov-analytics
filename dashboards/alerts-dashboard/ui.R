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
        )
      )
    ),
    mainPanel(
      tabsetPanel(
        tabPanel(
          title = 'Trends',
          tags$style(type = "text/css",
                     ".shiny-output-error { visibility: hidden; }",
                     ".shiny-output-error:before { visibility: hidden; }"
          ),
          dygraphOutput('plotData'),
          div(id="clickedDate")
        )
      )
    )
  )
))