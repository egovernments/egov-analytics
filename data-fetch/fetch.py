import requests
import codecs
import argparse
import sqlite3
import elasticsearch
from elasticsearch import Elasticsearch
import logging

# configure logging 
logging.basicConfig()
log = logging.getLogger()
log.setLevel(20)

class Constants(object):
  """
  Contains all constants used by the script
  """
  # the name of the sql table
  TABLE_NAME = "complaints" 

  # the batch size to fetch from the elasticsearch server
  BATCH_SIZE = 100
  
  # list of columns and their orders
  COLUMNS = ["id", "ComplaintType", "Zone", "Ward", "Department", "Date"]

class Admin(object):
  """
  Contains admin methods to manage the sqlite database
  """
  
  @staticmethod
  def create():
    """
    Creates the necessary tables
    """
    with sqlite3.connect(Constants.TABLE_NAME) as conn:
      conn.execute("""
        CREATE TABLE IF NOT EXISTS
          COMPLAINTS(id INT PRIMARY KEY NOT NULL, 
                    type TEXT NOT NULL, 
                    zone TEXT NOT NULL,
                    ward TEXT NOT NULL,
                    dept TEXT NOT NULL, 
                    date DATETIME NOT NULL);
        """)


class ComplaintsClient(object):
  """
  The complaints client. Contains methods to fetch and store data into the sqlite database
  """
  def __init__(self, esHost, esPort):    
    self.es  = Elasticsearch(esHost, port=esPort)    

  def _fetch_after_date(self, date, start, size):    
    """
    Fetch complaints after a certain date    
    """
    log.info("Fetching complaints after date {}, size {} and index {}".format(date, size, start))
    body = {
      "query": {
        "filtered": {
          "query": {
            "match_all": {}
          },
          "filter": {
            "range": {
              # get complaints greater than or equal to this date
              "COMPLAINTDATE": {                
                "gte": date
              }
            }
          }
        }
      }
    }

    return self.es.search(index="pgrnew", 
                          body=body,
                          sort="COMPLAINTDATE", 
                          from_=start, size=size)["hits"]["hits"]
  
  def _get_oldest_date(self):
    """
    Fetches the oldest date present in the elasticsearch database
    """ 
    return self.es.search(index="pgrnew", 
                          body={"query": {"match_all": {}}}, 
                          sort="COMPLAINTDATE", size=1, from_=0)["hits"]["hits"][0]["_source"]["COMPLAINTDATE"]

  def fetch(self):
    """
    Fetches and stores the data from elasticsearch, into a sqlite database
    """
    last_date = self._get_last_fetch_date()
    log.info("last date in table: {}".format(last_date))
    if last_date is None:
      log.info("last date is null, fetching data from the beginning")
      last_date = self._get_oldest_date()
      log.info("fetching data from date: {}".format(last_date))
    
    log.info("starting to fetch data.")
    while True:      
      hits = self._fetch_after_date(last_date, 0, Constants.BATCH_SIZE)        
      log.info("fetched {} complaints".format(len(hits)))      
      if len(hits) == 0:
        break
      with sqlite3.connect(Constants.TABLE_NAME) as conn:        
        for hit in hits:          
          source = hit["_source"]
          insert_command = "INSERT INTO COMPLAINTS(id, type, zone, ward, dept, date) VALUES({}, '{}', '{}', '{}', '{}', '{}');".format(
            hit["_id"],
            source["COMPLAINTTYPENAME"],
            source["zone"],
            source["ward"],
            source["DEPT_NAME"],
            source["COMPLAINTDATE"]
          )          
          try:
            conn.execute(insert_command)
          except sqlite3.IntegrityError:
            log.warn("ignoring error", exc_info=True)

          # update last date
          last_date = source["COMPLAINTDATE"]
        conn.commit()      

    log.info("finished fetching data")

  def _get_last_fetch_date(self):
    """
    Fetches the last date present in the sqlite database
    """
    with sqlite3.connect(Constants.TABLE_NAME) as conn:
      cursor = conn.execute("SELECT date from COMPLAINTS ORDER BY date DESC LIMIT 1")
      date = cursor.fetchone()
      if date:
        return date[0]
      return None


class Exporter(object):

  def __init__(self):
    pass

  def summarize(self):
    with sqlite3.connect(Constants.TABLE_NAME) as conn:
      cursor = conn.execute("SELECT COUNT(*) from COMPLAINTS")
      print cursor.fetchone(), "records present"

  def exportTo(self, path):
    with sqlite3.connect(Constants.TABLE_NAME) as conn:
      with codecs.open(path, "w", "utf-8") as writer:
        writer.write("\t".join(Constants.COLUMNS) + "\n")
        for row in conn.execute("SELECT * from COMPLAINTS ORDER BY date ASC"):
          writer.write("\t".join(map(str, row)) + "\n")        

if __name__ == "__main__":
  parser = argparse.ArgumentParser(description="Fetch data")
  parser.add_argument("esHost", metavar="esHost", type=str, help="the elastic search host to fetch data from")
  parser.add_argument("esPort", metavar="esPort", type=int, help="the elastic search port to fetch data from")
  parser.add_argument("outputPath", metavar="outputPath", type=str, help="the path to output the data to")
  args = parser.parse_args()

  # ensure that databases, etc are created
  Admin.create()
  # print some information *before* the export
  exporter = Exporter()
  exporter.summarize()

  # fetch the latest data, and export it
  ComplaintsClient(args.esHost, args.esPort).fetch()  
  exporter.exportTo(args.outputPath)
  