library(forecast)


# reading data ------------------------------------------------------------
rolled_data <- read.csv('./data/datadive/ddive_rolled_seq.csv')
rolled_data$Complaint.Date <- ymd(rolled_data$Complaint.Date)

rolled_data$Year <- year(rolled_data$Complaint.Date)
rolled_data$Month <- month(rolled_data$Complaint.Date, label=T)
rolled_data$WDay <- wday(rolled_data$Complaint.Date, label=T)
rolled_data$Month_Year <- paste(rolled_data$Month, rolled_data$Year, sep="_")
rolled_data$Month_Year <- as.factor(rolled_data$Month_Year)



# getting top-N complaint types, monthly data -----------------------------
# filtering out 2010 & 20111
# block_years <- c(2010, 2011)
# rolled_filtered_by_year <- dplyr::filter(rolled_data, 
#                                          !(Year %in% block_years))

# grouping by Complaint.Type, Year, Month
by_type_monthly <- rolled_data %>% 
  dplyr::filter(!is.na(Complaint.Type)) %>%
  group_by(Complaint.Type, Year, Month) %>% 
  summarise(comp_count=sum(complaint_count, na.rm=T))

# creating grid for Complaint.Type, Year, Month
type_month_year <- 
  expand.grid(Complaint.Type=levels(rolled_data$Complaint.Type),
                    Year=unique(rolled_data$Year),
                    Month=levels(rolled_data$Month))
type_month_year <- 
  dplyr::arrange(type_month_year, Complaint.Type, Year, Month)


# joining ----------------------------------------------------------------
by_type_monthly_full <- left_join(type_month_year, by_type_monthly, 
                             by = c('Complaint.Type', 'Year', 'Month'))
# making NAs zero
by_type_monthly_full$comp_count[is.na(by_type_monthly_full$comp_count)] <- 0
# filtering out initial months of 2010 and end months of 2015,
# bcoz they are not there in the raw data
by_type_monthly_full <- by_type_monthly_full %>% 
  dplyr::filter(!(Year==2010 & Month %in% c("Jan","Feb","Mar","Apr","May","Jun","Jul") | (Year==2015 & Month %in% c("Oct","Nov","Dec"))))


# splitting --------------------------------------------------------------
# splitting by Complaint.Type
ls_type <- split(by_type_monthly_full, by_type_monthly_full$Complaint.Type)

# getting top 10 complaint types
ls_type_top10 <- ls_type[tail(count_by_type, 10)$Complaint.Type]

# modifying names
names(ls_type_top10) <- str_trim(names(ls_type_top10))
names(ls_type_top10) <- 
  str_replace_all(names(ls_type_top10), '(\\w) ', '\\1_')

save(ls_type_top10, file = 'ls_type_top10.RData')


# converting to ts -------------------------------------------------------
ls_type_10_ts <- lapply(ls_type_top10, function(x) {
  ts(x$comp_count, frequency=12, start=c(2010,8))
})

tsdisplay(ls_type_10_ts[[1]])

save(ls_type_10_ts, file = 'ls_type_10_ts.RData')

# getting data.frames for each of the top10 complaint types
# list2env(ls_type_top10, environment())


# train n test ------------------------------------------------------------

# getting train and test
# test_year <- 2015
# test_months <- c('Jul', 'Aug', 'Sep')
# 
# ls_type_top10_train <- lapply(ls_type_top10, function(x) {
#   dplyr::filter(x, !(Year==test_year & Month %in% test_months))
# })
# names(ls_type_top10_train) <- str_c('train', names(ls_type_top10_train),
#                                     sep='_')
# 
# ls_type_top10_test <- lapply(ls_type_top10, function(x) {
#   dplyr::filter(x, (Year==test_year & Month %in% test_months))
# })
# names(ls_type_top10_test) <- str_c('test', names(ls_type_top10_test),
#                                    sep='_')

trainStart <- c(2012, 1)
trainEnd <- c(2014, 12)
testStart <- c(2015, 1)
testEnd <- c(2015, 9)    

ls_ts_train <- lapply(ls_type_10_ts, function(x) {
  window(x, start=trainStart, end=trainEnd)
})

ls_ts_test <- lapply(ls_type_10_ts, function(x) {
  window(x, start=testStart, end=testEnd)
})



# visualizing -------------------------------------------------------------
tsdisplay(ls_ts_train[[1]])



















