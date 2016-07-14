shinyUI(fluidPage(
  theme = shinythemes::shinytheme('cosmo'),
  titlePanel("Egovernments TSM"),
  sidebarLayout(
    sidebarPanel(
      width = 4,
      fluidRow(
        selectInput(
          "dataSet", label = h5("Data Set"),
          choices = c(names(datasets))
        )
      ), 
      fluidRow(
        selectInput(
          "method", label = h5("Modeling Method"),
          choices = c("ARIMA", 
                      "Exponential_Smoothing_Standard",
                      "Exponential_Smoothing_HoltWinters")
        )
      ),
      fluidRow(
        h5("Preprocessing Parameters"),
        checkboxInput("adjustForSeasonality", "Adjust for seasonality", value=F),
        checkboxInput("logTransformation", "Apply Log Transformation", value=F),
        h5("ARIMA Parameters"),
        checkboxInput("ARIMA.boxCox", "Apply Box-Cox Transformation", value=F),
        sliderInput("ARIMA.lambda", label="Lambda(Box-Cox Transformation)", min=0.0, max=1, step=.01, value=0),
        sliderInput("ARIMA.p", label="p", min=1, max=18, value = 1),
        sliderInput("ARIMA.d", label="d", min=0, max=12, value = 0),
        sliderInput("ARIMA.q", label="q", min=1, max=18, value = 1)
      )
    ),
    mainPanel(
      plotOutput("plotForecast"),
      tableOutput("displayMetrics"),
      plotOutput("plotRaw"),
      plotOutput("plotTs")
    )
  )
))