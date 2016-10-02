# script for combining data exported from elasticsearch and ankit and mayank's script
args <- commandArgs(trailingOnly=TRUE)
args <- c("/home/samarth/workspaces/datakind-workspace/cocCombined.csv", "/home/samarth/workspaces/datakind-workspace/Complaints_March01_Onwards.csv", "/home/samarth/workspaces/datakind-workspace/cocUptoJuly2016.csv")
if(length(args) != 3) {
  stop("Usage: combineOldNew.R <oldFormat.csv> <ESFile.csv> <combined.csv>")
}


OLD <- args[1]
ES_FILE <- args[2]
COMBINED <- args[3]
old <- read.csv(OLD, stringsAsFactors = F)
esFile <- read.csv(ES_FILE, stringsAsFactors = F)

names(esFile) <- c("Complaint.Type", "Area", "Locality",
                   "Street", "Zone", "Ward", "Complaint.Details", 
                   "Department", "Complaint.Date", "Resolution.Date", 
                   "Number.of.days.for.resolution", "Range", "Is.Resolved")

# Add columns not present
esFile$Region <- NA
esFile$Email <- NA
esFile$Mobile <- NA
esFile$X <- NA
esFile$X.1 <- NA

combined <- rbind(old, esFile)

stopifnot(nrow(old) + nrow(esFile) == nrow(combined))
stopifnot(length(unique(combined$Complaint.Type)) == 93)
stopifnot(length(unique(combined$Zone)) == 15)
stopifnot(length(unique(combined$Ward)) == 200)
stopifnot(length(unique(combined$Department)) == 48)

combined$X <- seq(1, nrow(combined))


write.csv(combined, file=COMBINED,row.names = F)
