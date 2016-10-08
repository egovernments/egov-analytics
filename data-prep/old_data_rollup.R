nas <- c(NA, 'NA', '', ' ', 'NULL')
dd_data <- read.csv('/home/samarth/workspaces/datakind-workspace/cocUptoJuly2016.csv', stringsAsFactors = F,
                    na.strings = nas)
glimpse(dd_data)
data <- dd_data
sum(is.na(data$Complaint.Date)) # no NA
library(Amelia)
missmap(dd_data)


#  ------------------------------------------------------------------------

# data$Complaint.Date <- as.Date(data$Complaint.Date,
#                                           format = '%d/%m/%Y %H:%M:%S')
# data$Complaint.Date <- as.POSIXlt(as.Date(data$Complaint.Date,
#                                           format = '%m/%d/%Y %H:%M:%S'))
data$Complaint.Date <- mdy_hms(data$Complaint.Date)
data$Complaint.Date <- date(data$Complaint.Date)
summary(data$Complaint.Date) 
data$Ward <- as.factor(data$Ward)
data$Complaint.Type <- as.factor(data$Complaint.Type)

data$Resolution.Date <- mdy_hms(data$Resolution.Date)
data$Number.of.days.for.resolution <- as.numeric(data$Number.of.days.for.resolution)


# rollup ------------------------------------------------------------------
data_rolled <- data %>% 
  group_by(Complaint.Date, Complaint.Type, Ward) %>% 
  summarise(complaint_count = n())
glimpse(data_rolled)
summary(data_rolled$Complaint.Date)
date_seq <- seq(min(data$Complaint.Date), 
                ymd('2016-07-01'), 
                by='day')
date_seq <- data.frame(Complaint.Date=date_seq)
data_rolled_seq <- left_join(date_seq, data_rolled)
data_rolled_seq$complaint_count[is.na(data_rolled_seq$complaint_count)] <- 0
sum(is.na(data_rolled_seq$complaint_count))

write.csv(data_rolled_seq,'/home/samarth/workspaces/datakind-workspace/ddive_rolled_seq.csv', row.names=F)
