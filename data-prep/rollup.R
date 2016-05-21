nas <- c(NA, 'NA', '', ' ', 'NULL')
dd_data <- read.csv('./data/datadive/coc.csv', stringsAsFactors = F,
                    na.strings = nas)
glimpse(dd_data)
data <- dd_data
sum(is.na(data$Complaint.Date)) # no NA
library(Amelia)
missmap(dd_data)


#  ------------------------------------------------------------------------

# data$Complaint.Date <- as.Date(data$Complaint.Date,
#                                           format = '%d/%m/%Y %H:%M:%S')
data$Complaint.Date <- as.POSIXlt(as.Date(data$Complaint.Date,
                                          format = '%m/%d/%Y %H:%M:%S'))
data$Complaint.Date <- mdy_hms(data$Complaint.Date)
data$Complaint.Date <- date(data$Complaint.Date)
summary(data$Complaint.Date) # 1,17,280 NAs introduced
data$Ward <- as.factor(data$Ward)
data$Complaint.Type <- as.factor(data$Complaint.Type)


# rollup ------------------------------------------------------------------
data_rolled <- data %>% 
  group_by(Complaint.Date, Complaint.Type, Ward) %>% 
  summarise(complaint_count = n())
glimpse(data_rolled)
summary(data_rolled$Complaint.Date)
date_seq <- seq(ymd('2010-05-22'), 
                ymd('2015-09-01'), 
                by='day')
date_seq <- data.frame(Complaint.Date=date_seq)
data_rolled_seq <- left_join(date_seq, data_rolled)
data_rolled_seq$complaint_count[is.na(data_rolled_seq$complaint_count)] <- 0
sum(is.na(data_rolled_seq$complaint_count))

write.csv(data_rolled_seq,'./data/datadive/ddive_rolled_seq.csv',row.names=F)

# each date, each type, each Ward
full <- expand.grid(Complaint.Date=date_seq$Complaint.Date,
            Complaint.Type=unique(data$Complaint.Type),
            Ward=unique(data$Ward))
full <- dplyr::arrange(full, Complaint.Date)
full_with_count <- left_join(full, data_rolled, 
                            by = c('Complaint.Date', 'Complaint.Type', 'Ward'))
nrow(full) - nrow(data_rolled)
sum(is.na(full_with_count))
write.csv(full_with_count,'./data/datadive/ddive_rolled_crossJoin.csv',
          row.names=F)







