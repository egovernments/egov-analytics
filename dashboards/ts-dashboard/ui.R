shinyUI(fluidPage(
  theme = shinythemes::shinytheme('cosmo'),
  titlePanel("Egovernments TSM"),
  sidebarLayout(
    sidebarPanel(
      width = 4,
      tabsetPanel(
        tabPanel(
          title = 'Data and pre-processing',
          fluidRow(
            selectInput(
              "dataSet", label = h5("Data Set"),
              choices = c(names(datasets))
            )
          ), 
          fluidRow(
            h5("Data Preprocessing Controls"),
            checkboxInput("cleanOutliers", "Remove Outliers", value = F),
            checkboxInput("STL", "STL", value = F),
            sliderInput("STL.Window", label="STL Window (0=periodic)", min=0, max=12, value = 0)
          )
        ), tabPanel(
          title = "Forecasting Method",
          fluidRow(
            selectInput(
              "method", label = h5("Modeling Method"),
              choices = c("ARIMA", 
                          "Exponential_Smoothing_Standard",
                          "Exponential_Smoothing_HoltWinters")
            )
          ), fluidRow(
            h3("ARIMA Parameters"),
            sliderInput("ARIMA.p", label="p", min=1, max=18, value = 1),
            sliderInput("ARIMA.d", label="d", min=0, max=12, value = 0),
            sliderInput("ARIMA.q", label="q", min=1, max=18, value = 1)
          )
        )
      )
    ),
    mainPanel(
      tabsetPanel(
        tabPanel(
          title = 'Data Pre-processing',
          tags$style(type = "text/css",
                     ".shiny-output-error { visibility: hidden; }",
                     ".shiny-output-error:before { visibility: hidden; }"
          ),
          plotOutput("plotOutliers"),
          plotOutput("plotSTL")
        ),
        tabPanel(
          title = 'Forecasts / Results',
          plotOutput("plotTs"),
          plotOutput("plotForecast"),
          tableOutput("displayMetrics")
        )
      )
    )
  )
))