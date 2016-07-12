args <- commandArgs(trailingOnly=TRUE)
if(length(args) != 3) {
  stop("Usage: combineOldNew.R <old.csv> <new.csv> <combined.csv>")
}

OLD=args[1]
NEW=args[2]
COMBINED=args[3]
old <- read.csv(OLD, stringsAsFactors = F)
new <- read.csv(NEW, stringsAsFactors = F)

print("Old:")
print(head(old))
print("New:")
print(head(new))
print("Old Column Names:")
print(names(old))
print("New Column Names:")
print(names(new))

stopifnot(ncol(new) == ncol(old))
# just to glance
combinedNames <- rbind(names(old), names(new))
print(combinedNames)
# looks good
names(new) <- names(old)
print(head(new))

# some sanity checks
stopifnot(nrow(old) + nrow(new) == nrow(combined))
stopifnot(length(unique(combined$Complaint.Type)) == 93)
stopifnot(length(unique(combined$Zone)) == 15)
stopifnot(length(unique(combined$Ward)) == 200)
stopifnot(length(unique(combined$Department)) == 48)

combined$X <- seq(1, nrow(combined))


write.csv(combined, file=COMBINED)