    var map, layer, districtLayer;

    var projectAPIKey = 'AIzaSyDdCELFax8-q-dUCHt9hn5Fbf_7ywY6yvA';// Personal Account
    //    var citiesTableID = '1CU4KNOJYGWoCkUZWrxgvleGq-k6PFFUO6qfqTCid';

    var citiesTableID = '1cKfYbbWs6JJujJPk-lJfdBLWVaRRSMxfXNx6K6_y';
    var districtsTableID = '1BYUolX-kQGfeEckoXMMBDk1Xh2llj8dhf-XpzJ7i';

    var attributeNameX = "M-Achievement (percentage)";
    var attributeNameY = "ULB Name";
    var mode = "grade";
    var districtName = "ANANTAPUR";
    var regionName = "ANANTAPUR";
    var gradeName = "G3";
    var chartType = "ColumnChart";
    var vizType = "split";
    var sortType = "";

    var unitOfIndicator = "";

    var dataTable;
    var tooltipValue, tooltipValueCol;
    var centerAfterQuery, zoomAfterQuery;

    var markers = [];

    var chartInfoBubble1;
    var chartInfoBubble2;

    var chartInfoMarker;

    var searchBarULBs;
    var COLUMN_STYLES = {};

    var timer;

    var mainIndic = 1,
        subMainIndic = 0;

    var placeChartQuery = "";
    var cumulativeValues = [];

    var globalBucket;

    var titleText = "";
    var reportTitleText = "";
    var generateReportQuery = "";

    var multiSeries = false;

    var subIndicators = [];
    var overallSelected = false;

    function initialize() {

        var eGovAttributeList = [
            "UPM-Target",
            "UPM-Achievement",
            "UPM-Achievement (percentage)",
            "UPM-Marks",
            "M-Target",
            "M-Achievement",
            "M-Achievement (percentage)",
            "M-Marks",
            "C-Target",
            "C-Achievement",
            "C-Achievement (percentage)",
            "C-Marks",
            "UPM-Rank",
            "M-Rank",
            "C-Rank",
            "Annual Target"
        ];

        var mapStyles3 = [{
            "featureType": "road",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "poi",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "administrative",
            "stylers": [{
                "visibility": "off"
            }]
        }];

        var styleOptions2 = [{
            'min': 0,
            'max': 100,
            //            'color': '#FF1700',
            'color': '#e74c3c',
            'opacity': 1
        }, {
            'min': 100,
            'max': 200,
            //            'color': '#FFC200',
            'color': '#f1c40f',
            'opacity': 1
        }, {
            'min': 200,
            'max': 500,
            //            'color': '#27E833',
            'color': '#2ecc71',
            'opacity': 1
        }];

        for (var i = 0; i < eGovAttributeList.length; i++) {
            COLUMN_STYLES[eGovAttributeList[i]] = styleOptions2;
        }

        var styledMap = new google.maps.StyledMapType(mapStyles3, {
            name: "Styled Map"
        });


        var andhra = new google.maps.LatLng(16.0000, 80.6400);
        map = new google.maps.Map(document.getElementById('map-canvas'), {
            center: andhra,
            scrollwheel: false,
            zoomControl: true,
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.LARGE,
                position: google.maps.ControlPosition.LEFT_CENTER
            },
            streetViewControl: false,
            mapTypeControl: false,
            disableDefaultUI: true,
            mapTypeId: google.maps.MapTypeId.TERRAIN,
            zoom: 6
        });

        //        map.mapTypes.set('map_style_2', styledMap);
        //        map.setMapTypeId('map_style_2');

        zoomAfterQuery = 6;
        centerAfterQuery = andhra;

        chartInfoBubble1 = new InfoBubble({
            map: map,
            shadowStyle: 1,
            padding: 10,
            backgroundColor: 'rgb(255,255,255)',
            borderRadius: 0,
            arrowSize: 25,
            minWidth: 300,
            borderWidth: 0,
            borderColor: '#2c2c2c',
            disableAutoPan: false,
            hideCloseButton: false,
            arrowPosition: 50,
            arrowStyle: 0
        });

        chartInfoBubble2 = new InfoBubble({
            map: map,
            shadowStyle: 1,
            padding: 10,
            backgroundColor: 'rgb(255,255,255)',
            borderRadius: 0,
            arrowSize: 25,
            minWidth: 300,
            borderWidth: 0,
            borderColor: '#2c2c2c',
            disableAutoPan: false,
            hideCloseButton: false,
            arrowPosition: 50,
            arrowStyle: 0
        });

        chartInfoBubble1 = new InfoBubble({
          minHeight: 160
        });

        chartInfoBubble2 = new InfoBubble({
          minHeight: 225
        });

        chartInfoMarker = new google.maps.Marker({
            map: map,
            icon: 'http://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=|0000FF'
        });

        layer = new google.maps.FusionTablesLayer({
            query: {
                select: 'Polygon',
                from: citiesTableID
            },
            map: map,
            suppressInfoWindows: false
        });

        districtLayer = new google.maps.FusionTablesLayer({
            query: {
                select: '\'Geocodable address\'',
                from: districtsTableID
            },
            map: map,
            styleId: 1,
            suppressInfoWindows: false
        });

        google.maps.event.addListener(layer, 'click', function(e) {
            var cityChosen = e.row['ULB Name'].value.toString();
            e.infoWindowHtml = "<div ><font size='2'>"
            e.infoWindowHtml += "<b>" + cityChosen + "</b><br>" + "District: <b>" + e.row['District'].value.toString() + "</b><br>" + "Region: <b>" + e.row['Region'].value.toString() + "</b>";
            e.infoWindowHtml += "</font></div>";
        });

        layer.setMap(map);
        //layer.setMap(null);

        google.maps.event.addListener(districtLayer, 'click', function(e) {
            var districtTooltip = e.row['DISTRICT_2011'].value.toString();
            var regionTooltip = e.row['Region'].value.toString();
            e.infoWindowHtml = "<div ><font size='2'>"
            e.infoWindowHtml += "District: <b>" + districtTooltip + "</b><br>" + "Region: <b>" + regionTooltip + "</b>";
            e.infoWindowHtml += "</font></div>";
        });


        //drawChart();
        applyStyle(layer, attributeNameX);
    }

    function drawChart() {

        if (gradeName == "regwise") {
            if(attributeNameX == 'UPM-Achievement (percentage)')
            {
                attributeNameX = 'UPM-Marks';
            }else if(attributeNameX == 'M-Achievement (percentage)')
            {
                attributeNameX = 'M-Marks';
            }else if(attributeNameX == 'C-Achievement (percentage)')
            {
                attributeNameX = 'C-Marks';
            }
        }

        if (chartType == "Table" || chartType == "PieChart") {
            document.getElementById('chartControl').style.display = "none";
        } else {
            document.getElementById('chartControl').style.display = "block";
        }
        placeChartQuery = "";
        var chartModeTitle = "All ULBs";
        var cumulativeChartQuery = "";

        if (chartType == "MultiChart") {
            sortType = "ORDER BY '" + attributeNameY + "' ASC";
        }

        if (chartType == "MultiChart" && gradeName == 'regwise') {
            sortType = "ORDER BY 'Region' ASC";
        }else if(gradeName == 'regwise'){
            sortType = "ORDER BY AVERAGE('" + attributeNameX + "') DESC";
        }

        if (mode == "city") {
            placeChartQuery = "SELECT '" + attributeNameY + "','" + attributeNameX + "' FROM " + citiesTableID + " " + sortType;

            chartModeTitle = "All ULBs";
            layer.setOptions({
                query: {
                    select: 'Polygon',
                    from: citiesTableID
                }
            });

            districtLayer.setOptions({
                query: {
                    select: '\'Geocodable address\'',
                    from: districtsTableID
                }
            });


        }
        if (mode == "district") {
            chartModeTitle = "District: " + districtName;
            placeChartQuery = "SELECT '" + attributeNameY + "', '" + attributeNameX + "' FROM " + citiesTableID + " WHERE 'District' = '" + districtName + "'" + sortType;

            layer.setOptions({
                query: {
                    select: 'Polygon',
                    from: citiesTableID,
                    where: "District = '" + districtName + "'"
                }
            });

            districtLayer.setOptions({
                query: {
                    select: '\'Geocodable address\'',
                    from: districtsTableID,
                    where: "'DISTRICT_2011' = '" + districtName + "'"
                }
            });
        }

        if (mode == "region") {
            chartModeTitle = "Region: " + regionName;

            placeChartQuery = "SELECT '" + attributeNameY + "', '" + attributeNameX + "' FROM " + citiesTableID + " WHERE 'Region' = '" + regionName + "'" + sortType;

            layer.setOptions({
                query: {
                    select: 'Polygon',
                    from: citiesTableID,
                    where: "Region = '" + regionName + "'"
                }
            });

            districtLayer.setOptions({
                query: {
                    select: '\'Geocodable address\'',
                    from: districtsTableID,
                    where: "'Region' = '" + regionName + "'"
                }
            });
        }

        var layerWhereClause;

        if (mode == "grade") {

            if (gradeName == "G1") {
                placeChartQuery = "SELECT '" + attributeNameY + "', '" + attributeNameX + "' FROM " + citiesTableID + " WHERE 'Grade' IN ('Special','Selection')" + sortType;
                chartModeTitle = "Grade: Special, Selection";
                layerWhereClause = "'Grade' IN ('Special','Selection')";
            } else if (gradeName == "G2") {
                placeChartQuery = "SELECT '" + attributeNameY + "', '" + attributeNameX + "' FROM " + citiesTableID + " WHERE 'Grade' IN ('I','II')" + sortType;
                chartModeTitle = "Grade: I, II";
                layerWhereClause = "'Grade' IN ('I','II')";
            } else if (gradeName == "G3") {
                placeChartQuery = "SELECT '" + attributeNameY + "', '" + attributeNameX + "' FROM " + citiesTableID + " WHERE 'Grade' IN ('III','NP')" + sortType;
                chartModeTitle = "Grade: III, NP";
                layerWhereClause = "'Grade' IN ('III','NP')";
            } else if (gradeName == "G4") {
                placeChartQuery = "SELECT '" + attributeNameY + "', '" + attributeNameX + "' FROM " + citiesTableID + " WHERE 'Grade' = 'Corp'" + sortType;
                chartModeTitle = "Grade: Corp";
                layerWhereClause = "'Grade' = 'Corp'";
            } else if (gradeName == "elevenulb") {
                placeChartQuery = "SELECT '" + attributeNameY + "', '" + attributeNameX + "' FROM " + citiesTableID + " WHERE 'ULB Name' IN ('TIRUPATI','KURNOOL','VISAKHAPATNAM','SRIKAKULAM','GUNTUR','KAKINADA','NELLIMARLA','RAJAM NP','KANDUKUR','ONGOLE CORP.','RAJAMPET')" + sortType;
                chartModeTitle = "11 ULBs";
                layerWhereClause = "'ULB Name' IN ('TIRUPATI','KURNOOL','VISAKHAPATNAM','SRIKAKULAM','GUNTUR','KAKINADA','NELLIMARLA','RAJAM NP','KANDUKUR','ONGOLE CORP.','RAJAMPET')";
            } else if (gradeName == "regwise") {
                placeChartQuery = "SELECT 'Region', AVERAGE('" + attributeNameX + "') FROM " + citiesTableID + " WHERE 'Region' IN ('ANANTAPUR','GUNTUR','RAJAHMUNDRY','VISAKHAPATNAM') GROUP BY 'Region' " + sortType;
                chartModeTitle = "Region-wise";
                layerWhereClause = "'Region' IN ('ANANTAPUR','GUNTUR','RAJAHMUNDRY','VISAKHAPATNAM') GROUP BY 'Region' ";
            } else {
                placeChartQuery = "SELECT '" + attributeNameY + "', '" + attributeNameX + "' FROM " + citiesTableID + " WHERE 'Grade' = '" + gradeName + "'" + sortType;
                chartModeTitle = "Grade: " + gradeName;
                layerWhereClause = "'Grade' = '" + gradeName + "'";
            }

            layer.setOptions({
                query: {
                    select: 'Polygon',
                    from: citiesTableID,
                    where: layerWhereClause
                }
            });

            districtLayer.setOptions({
                query: {
                    select: '\'Geocodable address\'',
                    from: districtsTableID
                }
            });
        }

        cumulativeChartQuery = placeChartQuery.substring(placeChartQuery.indexOf("FROM"));
        if (gradeName == "regwise") {
            cumulativeChartQuery = "SELECT 'Region', AVERAGE('C-Marks') " + cumulativeChartQuery;
        }else{
            cumulativeChartQuery = "SELECT '" + attributeNameY + "','C-Achievement (percentage)' " + cumulativeChartQuery;
        }
        

        generateReportQuery = placeChartQuery.substring(placeChartQuery.indexOf("FROM"), placeChartQuery.indexOf("ORDER"));
        //console.log(generateReportQuery);
        if (!overallSelected) {
            if (chartType == "MultiChart") {
                if(gradeName == 'regwise'){
                    generateReportQuery = "SELECT 'Region',AVERAGE('Annual Target'),AVERAGE('C-Target'),AVERAGE('C-Achievement'),AVERAGE('C-Achievement (percentage)'),AVERAGE('C-Marks'),AVERAGE('Max Marks'),AVERAGE('M-Target'),AVERAGE('M-Achievement'),AVERAGE('M-Achievement (percentage)'),AVERAGE('M-Marks') " + generateReportQuery  + "ORDER BY 'Region' ASC ";
                }else{
                    generateReportQuery = "SELECT '" + attributeNameY + "','Annual Target','C-Target','C-Achievement','C-Achievement (percentage)','C-Marks','Max Marks', 'C-Rank','M-Target','M-Achievement','M-Achievement (percentage)','M-Marks','M-Rank' " + generateReportQuery + " ORDER BY '" + attributeNameY + "' ASC";
                }
                multiSeries = true;
            } else {
                if(gradeName == 'regwise'){
                    if (attributeNameX.indexOf("C-") > -1) {
                        generateReportQuery = "SELECT 'Region',AVERAGE('Annual Target'),AVERAGE('C-Target'),AVERAGE('C-Achievement'),AVERAGE('C-Achievement (percentage)'),AVERAGE('C-Marks'),AVERAGE('Max Marks') " + generateReportQuery  + "ORDER BY AVERAGE('" + attributeNameX + "') DESC ";
                    } else if (attributeNameX.indexOf("UPM-") > -1) {
                        generateReportQuery = "SELECT 'Region',AVERAGE('Annual Target'),AVERAGE('UPM-Target'),AVERAGE('UPM-Achievement'),AVERAGE('UPM-Achievement (percentage)'),AVERAGE('UPM-Marks'),AVERAGE('Max Marks') " + generateReportQuery + "ORDER BY AVERAGE('" + attributeNameX + "') DESC ";
                    } else if (attributeNameX.indexOf("M-") > -1) {
                        generateReportQuery = "SELECT 'Region',AVERAGE('Annual Target'),AVERAGE('M-Target'),AVERAGE('M-Achievement'),AVERAGE('M-Achievement (percentage)'),AVERAGE('M-Marks'),AVERAGE('Max Marks') " + generateReportQuery  + "ORDER BY AVERAGE('" + attributeNameX + "') DESC ";
                    } 
                }else{
                    if (attributeNameX.indexOf("C-") > -1) {
                        generateReportQuery = "SELECT '" + attributeNameY + "','Annual Target','C-Target','C-Achievement','C-Achievement (percentage)','C-Marks','Max Marks','C-Rank' " + generateReportQuery + " ORDER BY 'C-Rank' ASC";
                    } else if (attributeNameX.indexOf("UPM-") > -1) {
                        generateReportQuery = "SELECT '" + attributeNameY + "','Annual Target','UPM-Target','UPM-Achievement','UPM-Achievement (percentage)','UPM-Marks','Max Marks','UPM-Rank' " + generateReportQuery + " ORDER BY 'UPM-Rank' ASC";
                    } else if (attributeNameX.indexOf("M-") > -1) {
                        generateReportQuery = "SELECT '" + attributeNameY + "','Annual Target','M-Target','M-Achievement','M-Achievement (percentage)','M-Marks','Max Marks','M-Rank' " + generateReportQuery + " ORDER BY 'M-Rank' ASC";
                    } 
                }
            }
        } else {
            if (chartType == "MultiChart") {
                if(gradeName == 'regwise'){
                    generateReportQuery = "SELECT 'Region',AVERAGE('C-Marks'),AVERAGE('M-Marks'),AVERAGE('Max Marks') " + generateReportQuery + "ORDER BY 'Region' ASC "
                }else{
                    generateReportQuery = "SELECT '" + attributeNameY + "','C-Marks','C-Rank','M-Marks','M-Rank','Max Marks' " + generateReportQuery + " ORDER BY '" + attributeNameY + "' ASC";    
                }
                
                multiSeries = true;
            } else {
                if(gradeName == 'regwise'){
                    if (attributeNameX.indexOf("C-") > -1) {
                    generateReportQuery = "SELECT 'Region',AVERAGE('C-Marks'),AVERAGE('Max Marks') " + generateReportQuery + "ORDER BY AVERAGE('" + attributeNameX + "') DESC ";
                    } else if (attributeNameX.indexOf("UPM-") > -1) {
                        generateReportQuery = "SELECT 'Region',AVERAGE('UPM-Marks'),AVERAGE('Max Marks') " + generateReportQuery  + "ORDER BY AVERAGE('" + attributeNameX + "') DESC ";
                    } else if (attributeNameX.indexOf("M-") > -1) {
                        generateReportQuery = "SELECT 'Region',AVERAGE('M-Marks'),AVERAGE('Max Marks') " + generateReportQuery  + "ORDER BY AVERAGE('" + attributeNameX + "') DESC ";
                    }
                }else{
                    if (attributeNameX.indexOf("C-") > -1) {
                    generateReportQuery = "SELECT '" + attributeNameY + "','C-Marks','Max Marks','C-Rank' " + generateReportQuery + " ORDER BY 'C-Rank' ASC";
                    } else if (attributeNameX.indexOf("UPM-") > -1) {
                        generateReportQuery = "SELECT '" + attributeNameY + "','UPM-Marks','Max Marks','UPM-Rank' " + generateReportQuery + " ORDER BY 'UPM-Rank' ASC";
                    } else if (attributeNameX.indexOf("M-") > -1) {
                        generateReportQuery = "SELECT '" + attributeNameY + "','M-Marks','Max Marks','M-Rank' " + generateReportQuery + " ORDER BY 'M-Rank' ASC";
                    }
                }
            }
        }
        var query = new google.visualization.Query('http://www.google.com/fusiontables/gvizdata?tq=');
        //console.log('cumulativeChartQuery:'+cumulativeChartQuery);
        query.setQuery(cumulativeChartQuery);
        query.send(getCumulativeValues);

        function getCumulativeValues(response) {
            cumulativeValues = [];
            //console.log('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
            //console.log('First Response is:'+JSON.stringify(response));

            for (var i = 0; i < response.getDataTable().getNumberOfRows(); i++) {
                cumulativeValues.push(response.getDataTable().getValue(i, 1));
            }
            var query = new google.visualization.Query('http://www.google.com/fusiontables/gvizdata?tq=');
            // Apply query language statement.
            //console.log('placeChartQuery:'+placeChartQuery);
            query.setQuery(placeChartQuery);
            // Send the query with a callback function.
            query.send(handleQueryResponse);


        }

        function handleQueryResponse(response) {
            /*            if (response.isError()) {
                            alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
                            return;
                        }
            */

            dataTable = response.getDataTable();
            //console.log('chartType:'+chartType);
            
            if (chartType != "MultiChart") {
                dataTable.addColumn({
                    type: 'string',
                    role: 'style'
                });

                //alert(parseFloat(globalBucket[0][1]) + "," + globalBucket[1][1]);
                var lastColorColumn = parseInt(dataTable.getNumberOfColumns());
                var numberOfRowsInQuery = parseInt(dataTable.getNumberOfRows());
                //console.log('Rows and columns is:'+numberOfRowsInQuery+'<--->'+lastColorColumn);

                if(gradeName == 'regwise'){
                    for (var i = 0; i < numberOfRowsInQuery; i++) {
                        var color = 'rgb(0, 0, 0)';
                        if (dataTable.getValue(i, 0) == 'RAJAHMUNDRY') {
                            color = 'rgb(231, 76, 60)'; //red
                        } else if (dataTable.getValue(i, 0) == 'VISAKHAPATNAM') {
                            color = 'rgb(241, 196, 15)'; //amber
                        } else if (dataTable.getValue(i, 0) == 'GUNTUR') {
                            color = 'rgb(46, 204, 113)'; //green
                        } else if (dataTable.getValue(i, 0) == 'ANANTAPUR'){
                            color = 'rgb(0, 153, 204)'; //blue
                        }
                        dataTable.setValue(i, lastColorColumn - 2, (dataTable.getValue(i, 1)).toFixed(2));
                        dataTable.setValue(i, lastColorColumn - 1, color);
                    }
                }else{

                    for (var i = 0; i < numberOfRowsInQuery; i++) {
                        var color = 'rgb(0, 0, 0)';
                        if (dataTable.getValue(i, 1) < globalBucket[0][1]) {
                            color = 'rgb(231, 76, 60)'; //red
                        } else if (dataTable.getValue(i, 1) < globalBucket[1][1]) {
                            color = 'rgb(241, 196, 15)'; //amber
                        } else {
                            color = 'rgb(46, 204, 113)'; //green
                        }
                        dataTable.setValue(i, lastColorColumn - 1, color);
                    }
                }
            } else {
                //Multichart
                if(gradeName == 'regwise'){
                    dataTable.addColumn('number', 'AVERAGE(C-Marks)');
                }else{
                    dataTable.addColumn('number', 'Cumulative Achievement (percentage)');    
                }
                

                var lastColumn = parseInt(dataTable.getNumberOfColumns());
                var numberOfRowsInQuery = parseInt(dataTable.getNumberOfRows());
                for (var i = 0; i < numberOfRowsInQuery; i++) {
                    dataTable.setValue(i, lastColumn - 2, dataTable.getValue(i,1).toFixed(2));
                    dataTable.setValue(i, lastColumn - 1, cumulativeValues[i].toFixed(2));
                }
                chartType = "ColumnChart";
            }
            var MAX;
            var MIN;

            if (attributeNameY == "ULB Name") {
                MAX = dataTable.getNumberOfRows();
            } else {
                MAX = dataTable.getColumnRange(0).max;
            }

            if (MAX < 4) {
                MIN = 2;
            } else if (MAX < 10) {
                MIN = 5;
            } else if (MAX < 30) {
                MIN = 10;
            } else if (MAX < 50) {
                MIN = 15;
            } else if (MAX < 115) {
                MIN = 30;
            } else if (MAX < 1000) {
                MIN = 250;
            } else if (MAX < 10000) {
                MIN = 2500;
            } else if (MAX < 50000) {
                MIN = 12500;
            } else if (MAX < 100000) {
                MIN = 25000;
            } else if (MAX < 200000) {
                MIN = 50000;
            } else if (MAX < 500000) {
                MIN = 100000;
            } else {
                MIN = 150000;
            }

            var prevButton = document.getElementById('chartPrev');
            var nextButton = document.getElementById('chartNext');
            var changeZoomButton = document.getElementById('chartZoom');

            prevButton.disabled = true;
            nextButton.disabled = true;
            changeZoomButton.disabled = true;

            //alert($('#chartVizDiv').width());
            var chartDivWidth = $('#chartVizDiv').width() - 100;
            var chartDivHeight = $('#chartVizDiv').height() - 215;

            var myOptions = {
                chartArea: {
                    top: 70,
                    left: 85,
                    width: chartDivWidth,
                    height: chartDivHeight
                },
                axisTitlesPosition: 'out',
                // title: chartModeTitle,
                title: '',
                series: {
                    0: {
                        color: '#F5861F'
                    },
                    1: {
                        color: '#6B4F2C'
                    },
                    2: {
                        color: '#17365D'
                    },
                    3: {
                        color: '#FFC000'
                    }
                },
                titlePosition: 'start',
                titleTextStyle: {
                    color: '#000',
                    fontSize: 20,
                    fontName: 'Open Sans'
                },
                animation: {
                    duration: 1500,
                    easing: 'linear',
                    startup: true
                },
                annotations: {
                    alwaysOutside: true,
                    /*    boxStyle: {
                          // Color of the box outline.
                          stroke: '#000',
                          // Thickness of the box outline.
                          strokeWidth: 1,
                          gradient: {
                            color1: '#FFFFFF',
                            color2: '#FFFFFF',
                            x1: '0%', y1: '0%',
                            x2: '100%', y2: '100%',
                            useObjectBoundingBoxUnits: true
                          }
                        },*/
                    textStyle: {
                        fontName: 'Times-Roman',
                        fontSize: 14,
                        bold: true,
                        opacity: 1
                    }
                },
                /*  explorer: {
                    keepInBounds:true
                  },*/
                vAxis: {
                    title: '',
                    textStyle: {
                        fontSize: 14,
                        color: '#000',
                        fontName: 'Open Sans'
                    },
                    titleTextStyle: {
                        color: '#000',
                        fontSize: 18,
                        italic: false,
                        bold: false
                    },
                    baselineColor: '#000',
                    gridlines: {
                        count: 5
                    },
                    viewWindowMode: 'pretty'
                },
                trendlines: {
                    0: {
                        type: 'linear',
                        visibleInLegend: true,
                        color: 'purple',
                        lineWidth: 3,
                        opacity: 1,
                        showR2: true
                    }
                },
                hAxis: {
                    title: '',
                    viewWindow: {
                        min: 0,
                        max: MAX
                    },
                    textStyle: {
                        fontSize: 14,
                        color: '#000',
                        fontName: 'Open Sans'
                    },
                    titleTextStyle: {
                        color: '#000',
                        fontSize: 18,
                        italic: false,
                        bold: false
                    },
                    baselineColor: '#000',
                    gridlines: {
                        count: 5
                    },
                    viewWindowMode: 'pretty'
                },
                tooltip: {
                    isHtml: false
                },
                areaOpacity: 0.5,
                backgroundColor: '#FFFFFF',
                legend: {
                    textStyle: {
                        color: 'black',
                        fontSize: 14,
                        fontName: 'Open Sans'
                    },
                    position: 'none',
                    alignment: 'end'
                }
            };

            var hisBarOptions = {
                chartArea: {
                    // left:10,
                    // top:100,
                    left: 75,
                    width: '90%',
                    height: '70%'
                },
                // title: chartModeTitle,
                title: '',
                titleTextStyle: {
                    color: '#000000',
                    fontSize: 20,
                    fontName: 'Open Sans'
                },
                animation: {
                    duration: 1500,
                    easing: 'linear',
                    startup: true
                },
                vAxis: {
                    title: attributeNameY,
                    viewWindow: {
                        min: 0,
                        max: MAX
                    },
                    textStyle: {
                        fontSize: 14,
                        color: '#000000',
                        fontName: 'Open Sans'
                    },
                    titleTextStyle: {
                        color: '#000000',
                        fontSize: 18
                    }
                },
                hAxis: {
                    title: attributeNameX,
                    textStyle: {
                        fontSize: 14,
                        color: '#000000',
                        fontName: 'Open Sans'
                    },
                    titleTextStyle: {
                        color: '#000000',
                        fontSize: 18
                    }
                },
                tooltip: {
                    isHtml: false
                },
                backgroundColor: '#FFFFFF',
                legend: {
                    textStyle: {
                        color: 'black',
                        fontSize: 14,
                        fontName: 'Open Sans'
                    },
                    position: 'none',
                    alignment: 'end'
                }
            };

            var wrapper = new google.visualization.ChartWrapper({
                containerId: "chartVizDiv",
                //dataSourceUrl: "http://www.google.com/fusiontables/gvizdata?tq=",
                //query: placeChartQuery,
                dataTable: dataTable,
                chartType: chartType,
                options: (chartType == "Histogram" || chartType == "BarChart") ? hisBarOptions : myOptions
            });

            google.visualization.events.addListener(wrapper, 'ready', onReady);
            wrapper.draw();

            function onReady() {
                google.visualization.events.addListener(wrapper.getChart(), 'onmouseover', barMouseOver);
                google.visualization.events.addListener(wrapper.getChart(), 'onmouseout', barMouseOut);
                google.visualization.events.addListener(wrapper.getChart(), 'select', barSelect);

                prevButton.disabled = hisBarOptions.vAxis.viewWindow.min <= 0;
                nextButton.disabled = hisBarOptions.vAxis.viewWindow.max >= MAX;

                prevButton.disabled = myOptions.hAxis.viewWindow.min <= 0;
                nextButton.disabled = myOptions.hAxis.viewWindow.max >= MAX;

                changeZoomButton.disabled = false;
            }

            prevButton.onclick = function() {
                myOptions.hAxis.viewWindow.min -= MIN - 1;
                myOptions.hAxis.viewWindow.max -= MIN - 1;

                hisBarOptions.vAxis.viewWindow.min -= MIN - 1;
                hisBarOptions.vAxis.viewWindow.max -= MIN - 1;

                wrapper.draw();
            }
            nextButton.onclick = function() {
                myOptions.hAxis.viewWindow.min += MIN - 1;
                myOptions.hAxis.viewWindow.max += MIN - 1;

                hisBarOptions.vAxis.viewWindow.min += MIN - 1;
                hisBarOptions.vAxis.viewWindow.max += MIN - 1;

                wrapper.draw();
            }
            var zoomed = true;
            changeZoomButton.onclick = function() {
                if (zoomed) {
                    myOptions.hAxis.viewWindow.min = 0;
                    myOptions.hAxis.viewWindow.max = MIN;

                    hisBarOptions.vAxis.viewWindow.min = 0;
                    hisBarOptions.vAxis.viewWindow.max = MIN;

                } else {
                    myOptions.hAxis.viewWindow.min = 0;
                    myOptions.hAxis.viewWindow.max = MAX;

                    hisBarOptions.vAxis.viewWindow.min = 0;
                    hisBarOptions.vAxis.viewWindow.max = MAX;

                }
                zoomed = !zoomed;
                wrapper.draw();
            }

            function barSelect(e) {
                //alert(tooltipValue); 
                //var selectedItem = wrapper.getChart().getSelection()[0];
                //tooltipValue = dataTable.getValue(e.row, 0);
                //addTooltipScript('https://www.googleapis.com/fusiontables/v2/query?sql=');
            }

            function barMouseOver(e) {

                timer = setTimeout(function() {
                    // do your stuff here

                    if (e.row < dataTable.getNumberOfRows()) {
                        tooltipValue = dataTable.getValue(e.row, 0);
                        tooltipValueCol = dataTable.getValue(e.row, 1);
                        //setMapOnAll(null);
                        //if overall and combined show report in modal else show in marker
                        if(mainIndic == 0 || (mainIndic == 1 && subMainIndic == 0) || (mainIndic == 3 && subMainIndic == 0) || (mainIndic == 4 && subMainIndic == 0) || (mainIndic == 5 && subMainIndic == 0) || (mainIndic == 6 && subMainIndic == 0)|| (mainIndic == 8 && subMainIndic == 0)|| (mainIndic == 9 && subMainIndic == 0)|| (mainIndic == 12 && subMainIndic == 0)){
                            ulbsummary('https://www.googleapis.com/fusiontables/v2/query?sql=',tooltipValue);
                        }else{
                            addTooltipScript('https://www.googleapis.com/fusiontables/v2/query?sql=', false);
                        }
                        $("#chosenNames").attr("placeholder", "Search ULBs").val("").focus().blur();
                        $('#chosenNames').chosen().trigger("chosen:updated");
                    }
                }, 1500);
            }

            function barMouseOut(e) {

                // on mouse out, cancel the timer
                clearTimeout(timer);

                chartInfoBubble2.close();
                chartInfoMarker.setMap(null);
                //setMapOnAll(map);
            }

        }
    }

    var rankAttri;
    var targetAttri;
    var achievedAttri;
    var marksObtained;

    function ulbsummary(src,ulb){
        $('#ulbsummary-title').html('<b>'+ulb+' - '+titleText.split('-')[0]+'</b>');
        $('#ulbreport_table').hide();
        $('#ulbreport').modal('show');
        $('#loadingIndicatorforreport').show();
        
        if (attributeNameX.indexOf("C-") > -1) {
            rankAttri = "C-Rank";
            targetAttri = "C-Target";
            achievedAttri = "C-Achievement";
            marksObtained = "C-Marks";
        } else if (attributeNameX.indexOf("UPM-") > -1) {
            rankAttri = "UPM-Rank";
            targetAttri = "UPM-Target";
            achievedAttri = "UPM-Achievement";
            marksObtained = "UPM-Marks";
        } else if (attributeNameX.indexOf("M-") > -1) {
            rankAttri = "M-Rank";
            targetAttri = "M-Target";
            achievedAttri = "M-Achievement";
            marksObtained = "M-Marks";
        }

        var selectText = "SELECT+'ULB Name',Centroid,'" + attributeNameX + "'" + ",'" + attributeNameY + "','Grade','Annual Target','" + rankAttri + "','" + targetAttri + "','" + achievedAttri + "','" + marksObtained + "','Max Marks'";
        var tableIDString = "+from+" + citiesTableID;
        var whereText = "+where+'" + attributeNameY + "'='" + ulb + "'";
        var key_callback_string = "&key=" + projectAPIKey;

        var source = src + selectText + tableIDString + whereText + key_callback_string;
        //console.log(src);

        var ulbPoint;

        $.ajax({url: source, async: false, success: function(response){
            ulbPoint = response.rows[0];
        }});

        if(gradeName == 'regwise'){

        }else{
            $('#ulbreport_table').html('');
            $('#ulbreport_table').append('<table class="table table-bordered table-hover"> <tbody> <tr> <th>Parameter</th> <th>Annual Target</th> <th>Target</th> <th>Achievement</th> <th>Marks</th> <th>Weightage</th> <th>Rank</th> </tr> <tr> <td>'+titleText.split('-')[1]+'</td><td>'+((typeof(ulbPoint[5]) == 'number') ? (ulbPoint[5].toFixed(2)) : ulbPoint[5])+'</td> <td>'+((typeof(ulbPoint[7]) == 'number') ? (ulbPoint[7].toFixed(2)) : ulbPoint[7])+'</td> <td>'+((typeof(ulbPoint[8]) == 'number') ? (ulbPoint[8].toFixed(2)) : ulbPoint[8])+'</td> <td>'+((typeof(ulbPoint[9]) == 'number') ? (ulbPoint[9].toFixed(2)) : ulbPoint[9])+'</td> <td>'+((typeof(ulbPoint[10]) == 'number') ? (ulbPoint[10].toFixed(2)) : ulbPoint[10])+'</td> <td>'+((typeof(ulbPoint[6]) == 'number') ? (ulbPoint[6].toFixed(2)) : ulbPoint[6])+'</td> </tr> </tbody> </table>');
            
            //Show Parameter Data
            if(mainIndic == 3 && subMainIndic == 0){//Solid Waste Management
                
                var tablearray = [{"tableid":"1_nR3f6Z1TzTgCJ5UT0Do6QYf9Ok0hVfxkKf2vAfG","text":"Door To Door Collection"},
                                     {"tableid":"1HlptexkOhseTkl7ujc13LYb7uELXJBQduRM6QmLu","text":"Garbage Lifting"}];

                queryhandling(tablearray,src,ulb);

            }else if(mainIndic == 4 && subMainIndic == 0){//Property Tax

                var tablearray = [{"tableid":"1Ft7BVfp-V8hpucsmWoW3Zal7p1qc5o6FwPSw3i4O","text":"Collection Efficiency"},
                                     {"tableid":"175Ocis9sGqWTBLhXd2wVIawnlddbpKE1fvB-j_SZ","text":"Demand Increase"}];

                queryhandling(tablearray,src,ulb);

            }else if(mainIndic == 5 && subMainIndic == 0){//Citizen Services

                var tablearray = [{"tableid":"1K6vPTSthe2-X__IHsi42Roq5RReNZ9xy-nVTcgMc","text":"Citizen Charter"},
                                     {"tableid":"1SbLuxSFUquS7q-mmLKp8_zYeKbdwvbbV3fMVmL5W","text":"Grievance Redressal"}];

                queryhandling(tablearray,src,ulb);

            }else if(mainIndic == 6 && subMainIndic == 0){//Finance

                var tablearray = [{"tableid":"1t3_EJG6Ppn4apIrONT0Wz1b6OYMix1OZkenzEcOd","text":"Double Entry Accounting"},
                                     {"tableid":"10591kbl5tAaWG4Kamh9QCQ1HWjY4-ESWRDQ1GQZ0","text":"Pending Accounts and Audits"}];

                 queryhandling(tablearray,src,ulb);

            }else if(mainIndic == 0){//Combined
                
                if(hod == 1){//DMA - Combined

                    var tablearray = [{"tableid":"1BgiIsyij_n9vB7cuCFRn6UgE9Cq0rgCZ57FePIWm","text":"Solid Waste Management"},
                                     {"tableid":"1gidez_jsV4mxBSZ0a_lfo6cwunZXsSUxlRpNb_Ut","text":"Property Tax"},
                                     {"tableid":"1XXalUDbRkTKbNbv7Dntueqd-BB7Pz5y_-ZxRqDvF","text":"Citizen Services"},
                                     {"tableid":"1q7GNaD1WoY8g2acTpXq9DbOggJnW-crbIxd7ixRY","text":"Finance"},
                                     {"tableid":"1UOltn1AicEOL-FkG4mKsay6pEi8SZQKmf5y5xX9m","text":"Education"}];

                    queryhandling(tablearray,src,ulb);

                }else if(hod == 2){//CE - Combined

                    var tablearray = [{"tableid":"1KVFlQd2zfJ5soZv_kJrMsxZNPEzZSdCzvJoKAGlE","text":"Water Supply"},
                                     {"tableid":"1WjL0SBK8k3NgOMS8YjiirnuA1JgnqOuQjAAfSKZ-","text":"Street Lighting"}];

                    queryhandling(tablearray,src,ulb);

                }else if(hod == 3){//DTCP - Combined
                    //No need
                }else if(hod == 4){//MEPMA - Combined
                    //No need
                }else if(hod == 5){//Swach Andhra - Combined
                    //No need
                }else if(hod == 6){//Greening Corporation  - Combined
                    //No need
                }else if(hod == 7){//Combined - Combined

                    var tablearray = [{"tableid":"15PCNLfKkPZGc35wtThugjW0FBTlK2U9hCKIFNLTL","text":"DMA"},
                                     {"tableid":"1AMkLyA2vz2xNXTHTX5JnxOZwnrVS6PNqu9xkhS7L","text":"CE"},
                                     {"tableid":"1xCuO37vnXEN0Ake02ErGetRTZUo8W6mueNugmdhq","text":"DTCP"},
                                     {"tableid":"1ufZzYeUN40B-5u0Msggo8UIHddJ-jQMvES8IAqWL","text":"MEPMA"},
                                     {"tableid":"10DDREC-__XHoPjL1FFVZ5G6Beh-Bs3yzuP59t5hL","text":"Swacha Andhra"},
                                     {"tableid":"13zBQvJvzrdj8vf63MnvUcJOgo5pG8MYcqYP1hVjh","text":"Greening Corp."},];

                    queryhandling(tablearray,src,ulb);

                }
                
            }else if(mainIndic == 8 && subMainIndic == 0){//Water Supply

                var tablearray = [{"tableid":"1dHEUFs9Edz-pfbBmX7dDczXZXdvHyhIT50681RiI","text":"Connections Coverage"},
                                     {"tableid":"1f6ZA4wqY7V3gJAOhz3M2jMi9VMpVtQFGG6_ExJH-","text":"Cost Recovery"}];

                 queryhandling(tablearray,src,ulb);

            }else if(mainIndic == 9 && subMainIndic == 0){//Street Lighting

                var tablearray = [{"tableid":"1XiO6lKhyPdCLTR6E_9ltEBaM20wQWDgt3X0E6Xqk","text":"LED Coverage"},
                                     {"tableid":"1SJZL2t_DchzylwR2zoSE-Zk1NOPVrQ-hitSn8KXx","text":"Additional Fixtures"}];

                 queryhandling(tablearray,src,ulb);

            }else if(mainIndic == 12 && subMainIndic == 0){//Community Development

                var tablearray = [{"tableid":"1ShLFRlL4D_O05ant_kRkkSprShJPYb_nQ8S4MCvT","text":"SHG Bank Linkage"},
                                     {"tableid":"1QjN7go-OdeLVtKnart_yuwWuKavxEJP_lSy9tyV4","text":"Liveihood"},
                                     {"tableid":"1Oua3hYGMx3knhsK7yf36TspEvV_rJbE2lsCEWqLT","text":"Skill Training Programmes"}];

                 queryhandling(tablearray,src,ulb);

            }else if(mainIndic == 1 && subMainIndic == 0){//Swach Andhra

                var tablearray = [{"tableid":"1VlRSa6bRH67nzwoZNNg5Hi7RrADs6nrpL9XGKZxk","text":"Household Toilet Coverage"},
                                     {"tableid":"1gEkwIO7LC2ga5nS7fNiSZjrFaUyVcgQORdMAHs0d","text":"Community Toilet Coverage"}];

                 queryhandling(tablearray,src,ulb);

            }

            $('#loadingIndicatorforreport').hide();
            $('#ulbreport_table').show();
        }

    }

    function queryhandling(tablearray,src,ulb){

        //Common Query
        var selectText = "SELECT+'ULB Name',Centroid,'" + attributeNameX + "'" + ",'" + attributeNameY + "','Grade','Annual Target','" + rankAttri + "','" + targetAttri + "','" + achievedAttri + "','" + marksObtained + "','Max Marks'";
        var whereText = "+where+'" + attributeNameY + "'='" + ulb + "'";
        var key_callback_string = "&key=" + projectAPIKey;

        $.each(tablearray, function(k, v) {
            //display the key and value pair
            var ts = v.tableid;
            var tableIDString = "from " + ts;
            var parameter_src = src + selectText + tableIDString + whereText + key_callback_string;
            parameter_report(parameter_src, v.text);//Function call
        });

    }

    function parameter_report(source, parameter_text){
        var ulbpoint;
        $.ajax({url: source, async: false, success: function(response){
            ulbPoint = response.rows[0];
        }});
        $('#ulbreport_table table tbody').append('<tr> <td>'+parameter_text+'</td> <td>'+((typeof(ulbPoint[5]) == 'number') ? (ulbPoint[5].toFixed(2)) : ulbPoint[5])+'</td> <td>'+((typeof(ulbPoint[7]) == 'number') ? (ulbPoint[7].toFixed(2)) : ulbPoint[7])+'</td> <td>'+((typeof(ulbPoint[8]) == 'number') ? (ulbPoint[8].toFixed(2)) : ulbPoint[8])+'</td> <td>'+((typeof(ulbPoint[9]) == 'number') ? (ulbPoint[9].toFixed(2)) : ulbPoint[9])+'</td> <td>'+((typeof(ulbPoint[10]) == 'number') ? (ulbPoint[10].toFixed(2)) : ulbPoint[10])+'</td> <td>'+((typeof(ulbPoint[6]) == 'number') ? (ulbPoint[6].toFixed(2)) : ulbPoint[6])+'</td> </tr>');
    }

    function addTooltipScript(src, fromSearchBar) {

        var rankAttri;
        var targetAttri;
        var achievedAttri;
        var marksObtained;

        if (attributeNameX.indexOf("C-") > -1) {
            rankAttri = "C-Rank";
            targetAttri = "C-Target";
            achievedAttri = "C-Achievement";
            marksObtained = "C-Marks";
        } else if (attributeNameX.indexOf("UPM-") > -1) {
            rankAttri = "UPM-Rank";
            targetAttri = "UPM-Target";
            achievedAttri = "UPM-Achievement";
            marksObtained = "UPM-Marks";
        } else if (attributeNameX.indexOf("M-") > -1) {
            rankAttri = "M-Rank";
            targetAttri = "M-Target";
            achievedAttri = "M-Achievement";
            marksObtained = "M-Marks";
        }

        var selectText = "SELECT+'ULB Name',Centroid,'" + attributeNameX + "'" + ",'" + attributeNameY + "','Grade','Annual Target','" + rankAttri + "','" + targetAttri + "','" + achievedAttri + "','" + marksObtained + "','Max Marks'";
        var tableIDString = "+from+" + citiesTableID;
        var whereText = "+where+'" + attributeNameY + "'='" + tooltipValue + "'";
        if (fromSearchBar) {
            whereText = "+where+'" + 'ULB Name' + "'='" + tooltipValue + "'";
        }
        var key_callback_string = "&key=" + projectAPIKey + "&callback=tooltiphandler";

        src = src + selectText + tableIDString + whereText + key_callback_string;
        var s = document.createElement('script');
        s.setAttribute('src', src);
        document.body.appendChild(s);

    }

    function tooltiphandler(response) {
        var ulbPoint = response.rows[0];
        if(gradeName == 'regwise'){

        }else{
            showULBonMap(ulbPoint[0], ulbPoint[1], ulbPoint[2], ulbPoint[3], ulbPoint[4], ulbPoint[5], ulbPoint[6], ulbPoint[7], ulbPoint[8], ulbPoint[9], ulbPoint[10]);
        }
        
    }

    function showULBonMap(ulb, centroid, ttValueY, ttValueX, grad, annualTar, rank, target, achieved, marks, maxMarks) {

        var bubbleLoc = centroid.split(',');

        if (chartInfoBubble1.isOpen()) { // unless the InfoBubble is open, we open it
            chartInfoBubble1.close();
        }

        if (unitOfIndicator == "-") {
            target = " NA";
            achieved = " NA";
            annualTar = " NA";
        }

        chartInfoBubble1.setContent("<div ><font size='2'><b>" + ulb + "</b><br/>Grade: <b>" + grad + "</b><br/>Unit of indicator: <b>" + unitOfIndicator + "</b></br><table border='1' class='infoWindowTable' style='width=100%;'><tr><th>Annual Target</th><th>Target</th><th>Achievement</th><th>" + attributeNameX + "</th><th>Marks (" + maxMarks + ")</th><th>Rank</th></tr><tr><td><b>" + ((typeof(annualTar) == 'number') ? (annualTar.toFixed(2)) : annualTar) + "</b></td><td><b>" + ((typeof(target) == 'number') ? (target.toFixed(2)) : target) + "</b></td><td><b>" + ((typeof(achieved) == 'number') ? (achieved.toFixed(2)) : achieved) + "</b></td><td><b>" + ((typeof(ttValueY) == 'number') ? (ttValueY.toFixed(2)) : ttValueY) + "</b></td><td><b>" + ((typeof(marks) == 'number') ? (marks.toFixed(2)) : marks) + "</b></td><td><b>" + rank + "</b></td></tr></table></font></div>");

        chartInfoBubble1.setPosition(new google.maps.LatLng(parseFloat(bubbleLoc[1]) + zoomLevelBasedBubblePos(), parseFloat(bubbleLoc[0])));

        if (!chartInfoBubble1.isOpen()) { // unless the InfoBubble is open, we open it
            chartInfoBubble1.open(map);
        }
    }

    function zoomLevelBasedBubblePos() {

        switch (map.getZoom()) {
            case 6:
                return 0.7;
            case 7:
                return 0.35;
            case 8:
                return 0.18;
        }
        return 0.04;
    }

    function setMapOnAll(map) {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
        }
    }

    function bucketGenerator(myar) {
        myar.sort(function(a, b) {
            return a - b;
        });
        var array1 = [];
        for (i = 0; i < myar.length; i++) {
            if (myar[i] != null)
                array1.push(myar[i]);
        }
        var array = [];
        for (i = 0; i < array1.length; i++) {
            array.push(array1[i]);
            while (array1[i] == 0)
                i++;
        }
        var buck = 3;
        var len1 = Math.floor(array.length * (0.2));
        var len2 = Math.ceil(array.length * (0.6));
        var len3 = array.length - (len1 + len2);
        var bucket = [];
        var bucketMin = [];
        var bucketMax = [];
        var max1 = array
            // if(array[0]==0)
            //     bucket.push([0.01, array[len1 - 1]]);
            // else    
        bucket.push([array[0], array[len1 - 1]]);
        bucket.push([array[len1], array[len1 + len2 - 1]]);
        bucket.push([array[len1 + len2], array[array.length - 1]]);
        var bucketF = [];
        var max;
        var min = parseFloat(bucket[0][0], 3);
        for (i = 0; i < buck; i++) {
            if (i < (buck - 1)) {
                var x = parseFloat(bucket[i + 1][0], 3);
                max = Math.ceil(parseFloat((parseFloat(bucket[i][1], 3) + parseFloat(bucket[i + 1][0], 3)) / 2));
                if (x < max) {
                    var max1 = (parseFloat(bucket[i][1], 3) + parseFloat(bucket[i + 1][0], 3)) / 2;
                    max = parseFloat(max1).toFixed(2);
                }
            } else
                max = Math.ceil(parseFloat(bucket[i][1], 3));
            bucketF.push([min, max]);
            min = max;
        }
        return bucketF;
    }

    function applyStyle(layer, column) {
        addScript('https://www.googleapis.com/fusiontables/v2/query?sql=');
    }

    function addScript(src) {

        var selectText = "SELECT '" + attributeNameX + "',Centroid,'ULB Name','Grade','" + attributeNameY + "','" + "Annual Target','C-Rank','M-Rank','UPM-Rank','C-Marks','UPM-Marks','M-Marks','Max Marks','Region'";
        var whereText;

        if (mode == "city") {
            whereText = '';
        } else if (mode == 'district') {
            whereText = " WHERE " + "District" + "='" + districtName + "'";
        } else if (mode == 'region') {
            whereText = " WHERE " + "Region" + "='" + regionName + "'";
        } else if (mode == 'grade') {
            if (gradeName == "G1") {
                whereText = " WHERE " + "'Grade' IN ('Special','Selection')";
            } else if (gradeName == "G2") {
                whereText = " WHERE " + "'Grade' IN ('I','II')";
            } else if (gradeName == "G3") {
                whereText = " WHERE " + "'Grade' IN ('III','NP')";
            } else if (gradeName == "G4") {
                whereText = " WHERE " + "Grade" + "='Corp'";
            } else if (gradeName == "elevenulb") {
                whereText = " WHERE " + "'ULB Name' IN ('TIRUPATI','KURNOOL','VISAKHAPATNAM','SRIKAKULAM','GUNTUR','KAKINADA','NELLIMARLA','RAJAM NP','KANDUKUR','ONGOLE CORP.','RAJAMPET')";
            }else if (gradeName == "regwise") {
                whereText =  " WHERE " + "'Region' IN ('ANANTAPUR','GUNTUR','RAJAHMUNDRY','VISAKHAPATNAM')";
            } else {
                whereText = " WHERE " + "Grade" + "='" + gradeName + "'";
            }
        } else {
            whereText = '';
        }

        var tableIDString = " from " + citiesTableID;
        var key_callback_string = "&key=" + projectAPIKey + "&callback=handler";

        src = src + selectText + tableIDString + whereText + key_callback_string;
        var s = document.createElement('script');
        s.setAttribute('src', src);
        document.body.appendChild(s);
    }

	//var dummycount = 0;
	
    function handler(response) {
        
        markerLocations = [];
        searchBarULBs = [];
		
        var anantapur_count = 0, guntur_count = 0, raj_count = 0, vizag_count = 0;
        var anantapur=0, guntur=0, rajahmundry=0, vizag=0;

        var hisArray = [];
        for (var i = 0; i < response.rows.length; i++) {
            var attValX = response.rows[i][0];//timeframe 
            hisArray.push(attValX);
            var pos = response.rows[i][1].toString().split(",");//latlong
            var lat = pos[1];
            var lon = pos[0];
            var city = (response.rows[i])[4].toString();//ulbname
            var grad = (response.rows[i])[3].toString();
            var attValY = (response.rows[i])[4];//ulbname
            var annualTarget = (response.rows[i])[5];
            var cRank = (response.rows[i])[6];
            var mRank = (response.rows[i])[7];
            var upmRank = (response.rows[i])[8];
            var cMarks = (response.rows[i])[9];
            var mMarks = (response.rows[i])[10];
            var upmMarks = (response.rows[i])[11];
            var maxMarks = (response.rows[i])[12];
            var ulb_region = (response.rows[i])[13];
			
			/*if((response.rows[i])[10] == 0 )
					dummycount+= 1;*/
			
            //do it only when region wise chart
            /*if (gradeName == "regwise") {
                if(ulb_region == 'ANANTAPUR'){
                    anantapur+=attValX;
                    anantapur_count++;//total sum of 'attValX' by this anantapur_count
                }else if(ulb_region == 'GUNTUR'){
                    guntur+=attValX;
                    guntur_count++;//total sum of 'attValX' by this guntur_count
                }else if(ulb_region == 'RAJAHMUNDRY'){
                    rajahmundry+=attValX;
                    raj_count++;//total sum of 'attValX' by this raj_count
                }else if(ulb_region == 'VISAKHAPATNAM'){
                    vizag+=attValX;
                    vizag_count++;//total sum of 'attValX' by this vizag_count
                }
                markerLocations.push([lat, lon, city, grad, attValX, attValY, annualTarget, cRank, mRank, upmRank, cMarks, upmMarks, mMarks, maxMarks,ulb_region]);
                searchBarULBs.push(city);
            }else{*/
                markerLocations.push([lat, lon, city, grad, attValX, attValY, annualTarget, cRank, mRank, upmRank, cMarks, upmMarks, mMarks, maxMarks,ulb_region]);
                searchBarULBs.push(city);
            //}
        }
		
		//console.log('dummycount'+dummycount);
		
		/*if((attributeNameX.indexOf("UPM-") > -1) && (dummycount == 110))
			document.getElementById("titleText").innerHTML = "<b style='color:red'>Since financial year starts from April. Previous month data won't be available for this month</b>";
		*/
        
        //console.log(anantapur_count+'<-->'+guntur_count+'<-->'+raj_count+'<-->'+vizag_count);
        globalBucket = bucketGenerator(hisArray);

        //console.log(globalBucket);

        if (globalBucket[2][1] == 0 || isNaN(globalBucket[2][1])) {
            globalBucket[2][1] = 100;
        }

        if (isNaN(globalBucket[2][0])) {
            globalBucket[2][0] = globalBucket[2][1];
        }

        if (isNaN(globalBucket[1][1])) {
            globalBucket[1][1] = globalBucket[2][1];
        }

        if (isNaN(globalBucket[0][0])) {
            globalBucket[0][0] = 0;
        }

        if (isNaN(globalBucket[0][1])) {
            globalBucket[0][1] = 0;
        }

        if (isNaN(globalBucket[1][0])) {
            globalBucket[1][0] = 0;
        }
        /*
                if (globalBucket[1][1] == 100.00) {
                    globalBucket[1][1] = 99.99;
                    globalBucket[2][0] = 100;
                    globalBucket[2][1] = 100;
                }
        */
        var select = document.getElementById("chosenNames");
        select.options.length = 0;
        //$('#chosenNames').append("<option value='"+searchBarULBs.length+"'>"+searchBarULBs.length+" ULBs</option>");
        for (var i = 0; i < searchBarULBs.length; i++) {
            $('#chosenNames').append("<option value='" + searchBarULBs[i] + "'>" + searchBarULBs[i] + "</option>");
        }
        $("#chosenNames").attr("placeholder", "Search ULBs").val("").focus().blur();
        $('#chosenNames').chosen().trigger("chosen:updated");


        drop(markerLocations, globalBucket);
        /*
                var columnStyle = COLUMN_STYLES[attributeNameX]; // was column previously  
                var styles = [];
                for (var i in columnStyle) {
                    var style = columnStyle[i];

                    style.min = bucket[i][0]-0.0001;
                    style.max = bucket[i][1]+0.0001;

                    styles.push({
                        where: generateWhere(attributeNameX, style.min, style.max),
                        polygonOptions: {
                            fillColor: style.color,
                            fillOpacity: style.opacity ? style.opacity : 0.8
                        }
                    });
                }
          */
        var styles = [];
        for (var i in COLUMN_STYLES[attributeNameX]) {
            var style = COLUMN_STYLES[attributeNameX][i];

            //          style.min = parseFloat(bucket[i][0],2) - 0.01;
            //          style.max = parseFloat(bucket[i][1],2) + 0.01;

            style.min = parseFloat(globalBucket[i][0], 2) - 0.01;
            style.max = parseFloat(globalBucket[i][1], 2) + 0.01;

            styles.push({
                where: generateWhere(attributeNameX, style.min, style.max),
                polygonOptions: {
                    fillColor: style.color,
                    fillOpacity: style.opacity ? style.opacity : 0.8
                }
            });
        }
        if(gradeName == 'regwise'){
            layer.setMap(null);
            $('#searchChosenDiv').hide();
        }else{
            layer.set('styles', styles);
        }
        
        changeMap();
        drawChart();
    }

    function generateWhere(columnName, low, high) {
        var whereClause = [];
        whereClause.push("'");
        whereClause.push(columnName);
        whereClause.push("' > ");
        whereClause.push(low);
        whereClause.push(" AND '");
        whereClause.push(columnName);
        whereClause.push("' <= ");
        whereClause.push(high);
        return whereClause.join('');
    }

    function changeMap() {
        var query = "";

        if (mode == "city") {
            query = "SELECT 'geometry' FROM " + districtsTableID;
            districtLayer.setOptions({
                query: {
                    from: districtsTableID,
                    select: 'geometry'
                },
                styleId: 1,
            });
        }
        if (mode == "district") {
            query = "SELECT 'geometry' FROM " + districtsTableID + " WHERE 'DISTRICT_2011' = '" + districtName + "'";
            districtLayer.setOptions({
                query: {
                    from: districtsTableID,
                    select: 'geometry',
                    where: "'DISTRICT_2011' = '" + districtName + "'"
                },
                styleId: 1
            });
        }
        if (mode == "region") {
            query = "SELECT 'geometry' FROM " + districtsTableID + " WHERE 'Region' = '" + regionName + "'";
            districtLayer.setOptions({
                query: {
                    from: districtsTableID,
                    select: 'geometry',
                    where: "'Region' = '" + regionName + "'"
                },
                styleId: 1
            });
        }
        if (mode == "grade") {
            query = "SELECT 'geometry' FROM " + districtsTableID;
            districtLayer.setOptions({
                query: {
                    from: districtsTableID,
                    select: 'geometry'
                },
                styleId: 1
            });
        }
        zoom2query(query);
    }

    function zoom2query(query) {
        map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(document.getElementById('legendWrapper'));
        var column = attributeNameX;

        $('#legendTitle').html(column);
        var columnStyle = COLUMN_STYLES[column];
        var style = columnStyle[0];
        $('#legendItem1Content').html((parseFloat(style.min, 2) + 0.01).toFixed(2) + ' - ' + (parseFloat(style.max, 2) - 0.01).toFixed(2));
        style = columnStyle[1];
        $('#legendItem2Content').html((parseFloat(style.min, 2) + 0.01).toFixed(2) + ' - ' + (parseFloat(style.max, 2) - 0.01).toFixed(2));
        style = columnStyle[2];
        $('#legendItem3Content').html((parseFloat(style.min, 2) + 0.01).toFixed(2) + ' - ' + (parseFloat(style.max, 2) - 0.01).toFixed(2));
        $('#legendItem4Content').html(0 + ' or ' + 'undefined');
        $('#legendWrapper').show();

        // zoom and center map on query results
        //set the query using the parameter
        var queryText = encodeURIComponent(query);
        var query = new google.visualization.Query('http://www.google.com/fusiontables/gvizdata?tq=' + queryText);

        //set the callback function
        query.send(zoomTo);
    }

    function centerMap() {
        map.setZoom(zoomAfterQuery);
        map.panTo(centerAfterQuery);
        //wrapper.getChart().setSelection([{row:0, column:null}]);
        //updateLegend(attributeNameX);
    }

    function zoomTo(response) {
        if (!response) {
            //alert('no response');
            return;
        }
        if (response.isError()) {
            //alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
            return;
        }

        FTresponse = response;
        //for more information on the response object, see the documentation
        //http://code.google.com/apis/visualization/documentation/reference.html#QueryResponse
        numRows = response.getDataTable().getNumberOfRows();
        numCols = response.getDataTable().getNumberOfColumns();
        // handle multiple matches
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < numRows; i++) {
            var kml = FTresponse.getDataTable().getValue(i, 0);
            // create a geoXml3 parser for the click handlers
            var geoXml = new geoXML3.parser({
                map: map,
                zoom: false
            });

            geoXml.parseKmlString("<Placemark>" + kml + "</Placemark>");
            // handle all possible kml placmarks
            if (geoXml.docs[0].gpolylines.length > 0) {
                geoXml.docs[0].gpolylines[0].setMap(null);
                if (i == 0) var bounds = geoXml.docs[0].gpolylines[0].bounds;
                else bounds.union(geoXml.docs[0].gpolylines[0].bounds);
            } else if (geoXml.docs[0].markers.length > 0) {
                geoXml.docs[0].markers[0].setMap(null);
                if (i == 0) bounds.extend(geoXml.docs[0].markers[0].getPosition());
                else bounds.extend(geoXml.docs[0].markers[0].getPosition());
            } else if (geoXml.docs[0].gpolygons.length > 0) {
                geoXml.docs[0].gpolygons[0].setMap(null);
                if (i == 0) var bounds = geoXml.docs[0].gpolygons[0].bounds;
                else bounds.union(geoXml.docs[0].gpolygons[0].bounds);
            }
        }
        map.fitBounds(bounds);
        centerAfterQuery = map.getCenter();
        zoomAfterQuery = map.getZoom();
    }

    function getQueryStrings() {
        var assoc = {};
        var decode = function(s) {
            return decodeURIComponent(s.replace(/\+/g, " "));
        };

        var queryString = location.search.substring(1);

        var keyValues = queryString.split('&');

        for (var i in keyValues) {
            var key = keyValues[i].split('=');
            if (key.length > 1) {
                assoc[decode(key[0])] = decode(key[1]);
            }
        }
        return assoc;
    }


    function fetchDataFromBrowserQueryAndUpdateUI() {

        var qs = getQueryStrings();
        var status = qs["status"]; //if you want to use ahead

        /*        if (status=="init") {
                    parent.document.getElementById('visuals').src = "visuals.html?X=C-Achievement&Y=ULB Name&area=grade&grade=G3&chart=ColumnChart&sort=XDESC&viz=split&status=start";
                    return;
                }
        */
        var sort = qs["sort"];
        attributeNameX = qs["X"];
        attributeNameY = qs["Y"];
        chartType = qs["chart"];
        mode = qs["area"];
        districtName = qs["dis"];
        regionName = qs["reg"];
        gradeName = qs["grade"];
        vizType = qs["viz"];

        mainIndic = qs["main"];
        subMainIndic = qs["sub"];
        hod = qs["hod"];

        //document.getElementById("titleText").textContent = attributeNameX + " for " + attributeNameY;

        overallSelected = false;

        if (mainIndic == 0 || (mainIndic == 1 && subMainIndic == 0) || (mainIndic == 3 && subMainIndic == 0) || (mainIndic == 4 && subMainIndic == 0) || (mainIndic == 5 && subMainIndic == 0) || (mainIndic == 6 && subMainIndic == 0) || (mainIndic == 8 && subMainIndic == 0) || (mainIndic == 9 && subMainIndic == 0) || (mainIndic == 12 && subMainIndic == 0) ) {
            overallSelected = true;
        }

        if (sort == "XASC") {
            sortType = "ORDER BY '" + attributeNameX + "' ASC";
        } else if (sort == "XDESC") {
            sortType = "ORDER BY '" + attributeNameX + "' DESC";
        } else if (sort == "YASC") {
            sortType = "ORDER BY '" + attributeNameY + "' ASC";
        } else if (sort == "YDESC") {
            sortType = "ORDER BY '" + attributeNameY + "' DESC";
        } else if (sort == "NOSORT") {
            sortType = "";
        }

        if (vizType == "split") {
            $('.mapsection').show().removeClass('col-xs-12').addClass('col-xs-6');;
            $('.chartsection').show().removeClass('col-xs-12').addClass('col-xs-6');;
        } else if (vizType == "map") {
            $('.mapsection').show().removeClass('col-xs-6').addClass('col-xs-12');
            $('.chartsection').hide();
        } else if (vizType == "chart") {
            $('.mapsection').hide();
            $('.chartsection').show().removeClass('col-xs-6').addClass('col-xs-12');
        }

        // alert(mainIndic+","+subMainIndic);
        citiesTableID = '';
        if (mainIndic == 0) {
            if(hod == 1){
                citiesTableID = '15PCNLfKkPZGc35wtThugjW0FBTlK2U9hCKIFNLTL';
                titleText = "DMA Overall - Combined";
                unitOfIndicator = "-";
            }else if(hod == 2){
                citiesTableID = '1AMkLyA2vz2xNXTHTX5JnxOZwnrVS6PNqu9xkhS7L';
                titleText = "CE Overall - Combined";
                unitOfIndicator = "-";
            }else if(hod == 7){
                citiesTableID = '1oh1JDpEiha7iByWwEo96IQpc_K3zkfdmJx-aE-Li'; 
                titleText = "Combined - Combined";
                unitOfIndicator = "-";
            }
        }else if (mainIndic == 1) {
            if (subMainIndic == 0) {
                citiesTableID = '10DDREC-__XHoPjL1FFVZ5G6Beh-Bs3yzuP59t5hL';
                titleText = "Swachcha Andhra - Overall";
                unitOfIndicator = "-";
            }else if (subMainIndic == 1) {
                citiesTableID = '1VlRSa6bRH67nzwoZNNg5Hi7RrADs6nrpL9XGKZxk'; 
                titleText = "Swachcha Andhra - Individual Household Toilets (IHT) coverage";
                unitOfIndicator = "No. of Toilets";
            }else if (subMainIndic == 2) {
                citiesTableID = '1gEkwIO7LC2ga5nS7fNiSZjrFaUyVcgQORdMAHs0d'; 
                titleText = "Swachcha Andhra - Community Toilets coverage";
                unitOfIndicator = "No. of Toilets";
            }
        }else if (mainIndic == 2) {
            if (subMainIndic == 0) {
                citiesTableID = '13zBQvJvzrdj8vf63MnvUcJOgo5pG8MYcqYP1hVjh';
                titleText = "Greenery - Tree Plantation";
                unitOfIndicator = "No. of plantations";
            }
        }else if (mainIndic == 3) {
            if (subMainIndic == 0) {
                citiesTableID = '1BgiIsyij_n9vB7cuCFRn6UgE9Cq0rgCZ57FePIWm'; 
                titleText = "Solid Waste Management - Overall";
                unitOfIndicator = "-";
            } else if (subMainIndic == 1) {
                citiesTableID = '1_nR3f6Z1TzTgCJ5UT0Do6QYf9Ok0hVfxkKf2vAfG'; 
                titleText = "Solid Waste Management - Door to Door Garbage Collection";
                unitOfIndicator = "No. of Households";
            } else if (subMainIndic == 2) {
                citiesTableID = '1HlptexkOhseTkl7ujc13LYb7uELXJBQduRM6QmLu';
                titleText = "Solid Waste Management - Garbage Lifting";
                unitOfIndicator = "Metric tonnes";
            }
        }else if (mainIndic == 4) {
            if (subMainIndic == 0) {
                citiesTableID = '1gidez_jsV4mxBSZ0a_lfo6cwunZXsSUxlRpNb_Ut';
                titleText = "Property Tax - Overall";
                unitOfIndicator = "-";
            } else if (subMainIndic == 1) {
                citiesTableID = '1Ft7BVfp-V8hpucsmWoW3Zal7p1qc5o6FwPSw3i4O'; 
                titleText = "Property Tax -  Collection Efficiency";
                unitOfIndicator = "Rupees (in lakhs)";
            } else if (subMainIndic == 2) {
                citiesTableID = '175Ocis9sGqWTBLhXd2wVIawnlddbpKE1fvB-j_SZ'; 
                titleText = "Property Tax  - Demand Increase";
                unitOfIndicator = "Rupees (in lakhs)";
            }
        }else if (mainIndic == 5) {
            if (subMainIndic == 0) {
                citiesTableID = '1XXalUDbRkTKbNbv7Dntueqd-BB7Pz5y_-ZxRqDvF';
                titleText = "Citizen Services - Overall";
                unitOfIndicator = "-";
            } else if (subMainIndic == 1) {
                citiesTableID = '1K6vPTSthe2-X__IHsi42Roq5RReNZ9xy-nVTcgMc'; 
                titleText = "Citizen Services - Citizen Charter (office)";
                unitOfIndicator = "No. of applications";
            } else if (subMainIndic == 2) {
                citiesTableID = '1SbLuxSFUquS7q-mmLKp8_zYeKbdwvbbV3fMVmL5W'; 
                titleText = "Citizen Services - Grievances Redressal (field)";
                unitOfIndicator = "No. of grievances";
            }
        }else if (mainIndic == 6) {
            if (subMainIndic == 0) {
                citiesTableID = '1q7GNaD1WoY8g2acTpXq9DbOggJnW-crbIxd7ixRY';
                titleText = "Finance - Overall";
                unitOfIndicator = "-";
            } else if (subMainIndic == 1) {
                citiesTableID = '1t3_EJG6Ppn4apIrONT0Wz1b6OYMix1OZkenzEcOd'; 
                titleText = "Finance - Double Entry Accounting";
                unitOfIndicator = "No. of days";
            } else if (subMainIndic == 2) {
                citiesTableID = '10591kbl5tAaWG4Kamh9QCQ1HWjY4-ESWRDQ1GQZ0';
                titleText = "Finance - Pending Accounts and Audit";
                unitOfIndicator = "No. of years";
            }
        }else if (mainIndic == 7) {
            citiesTableID = '1UOltn1AicEOL-FkG4mKsay6pEi8SZQKmf5y5xX9m';
            titleText = "Education - High schools with IIT foundation";
            unitOfIndicator = "No. of High schools";
        }else if (mainIndic == 8) {
            if (subMainIndic == 0) {
                citiesTableID = '1KVFlQd2zfJ5soZv_kJrMsxZNPEzZSdCzvJoKAGlE';
                titleText = "Water Supply Connections - Overall Coverage";
                unitOfIndicator = "-";
            } else if (subMainIndic == 1) {
                citiesTableID = '1dHEUFs9Edz-pfbBmX7dDczXZXdvHyhIT50681RiI'; 
                titleText = "Water Supply - Connections Coverage";
                unitOfIndicator = "No. of Connections";
            } else if (subMainIndic == 2) {
                citiesTableID = '1f6ZA4wqY7V3gJAOhz3M2jMi9VMpVtQFGG6_ExJH-'; 
                titleText = "Water Supply per month - Cost Recovery";
                unitOfIndicator = "Rupees (in Lakhs)";
            }
        }else if (mainIndic == 9) {
            if (subMainIndic == 0) {
                citiesTableID = '1WjL0SBK8k3NgOMS8YjiirnuA1JgnqOuQjAAfSKZ-';
                titleText = "Street Lighting - Overall";
                unitOfIndicator = "-";
            } else if (subMainIndic == 1) {
                citiesTableID = '1XiO6lKhyPdCLTR6E_9ltEBaM20wQWDgt3X0E6Xqk'; 
                titleText = "Street Lighting - LED Coverage";
                unitOfIndicator = "No. of LEDs";
            } else if (subMainIndic == 2) {
                citiesTableID = '1SJZL2t_DchzylwR2zoSE-Zk1NOPVrQ-hitSn8KXx';
                titleText = "Street Lighting - Additional Fixtures";
                unitOfIndicator = "No. of Fixtures";
            }
        }else if (mainIndic == 11) {
            if (subMainIndic == 0) {
                citiesTableID = '1xCuO37vnXEN0Ake02ErGetRTZUo8W6mueNugmdhq'; 
                titleText = "Town Planning Activities - Building Online Permissions";
                unitOfIndicator = "No.of Applications";
            }
        }else if (mainIndic == 12) {
            if (subMainIndic == 0) {
                citiesTableID = '1ufZzYeUN40B-5u0Msggo8UIHddJ-jQMvES8IAqWL';
                titleText = "Community Development - Overall";
                unitOfIndicator = "-";
            } else if (subMainIndic == 1) {
                citiesTableID = '1ShLFRlL4D_O05ant_kRkkSprShJPYb_nQ8S4MCvT'; 
                titleText = "Community Development - SHG Bank Linkage";
                unitOfIndicator = "Rupees (in lakhs)";
            } else if (subMainIndic == 2) {
                citiesTableID = '1QjN7go-OdeLVtKnart_yuwWuKavxEJP_lSy9tyV4'; 
                titleText = "Community Development - Livelihood";
                unitOfIndicator = "No.";
            }else if (subMainIndic == 3) {
                citiesTableID = '1Oua3hYGMx3knhsK7yf36TspEvV_rJbE2lsCEWqLT'; 
                titleText = "Community Development - Skill Training Programmes";
                unitOfIndicator = "No.";
            }
        }
		
        if (mode == "city") {
            titleText += " - All ULBs";
        } else if (mode == "district") {
            titleText += " - " + districtName + " District";
        } else if (mode == "region") {
            titleText += " - " + regionName + " Region";
        } else if (mode == "grade") {
            if (gradeName == "G1") {
                titleText += " - Special, Selection Grades";
            } else if (gradeName == "G2") {
                titleText += " - Grade I, II";
            } else if (gradeName == "G3") {
                titleText += " - Grades III, NP";
            } else if (gradeName == "G4") {
                titleText += " - Corporations Grade";
            }else if (gradeName == "elevenulb") {
                titleText += " - 11 ULBs";
            }else if (gradeName == "regwise") {
                titleText += " - Region-wise";
            }
        }

        multiSeries = false;
        reportTitleText = titleText;
        if (chartType == "MultiChart") {
            if(gradeName === 'regwise'){
                titleText += " - <span style='color:#F5861F;font-weight:bold;'>Monthly</span> and <span style='color:#6B4F2C;font-weight:bold;'>Cumulative</span> Marks";
            }else{
                titleText += " - <span style='color:#F5861F;font-weight:bold;'>Monthly</span> and <span style='color:#6B4F2C;font-weight:bold;'>Cumulative</span> Achievement (%)";    
            }
            
            multiSeries = true;
            reportTitleText += " - Monthly v/s Cumulative Report";
        } else {
            if(gradeName === 'regwise'){
                if (attributeNameX.indexOf("C-") > -1) {
                    titleText += " - Cumulative Marks";
                    reportTitleText += " - Cumulative Report";
                } else if (attributeNameX.indexOf("UPM-") > -1) {
                    titleText += " - Upto Previous Month Marks";
                    reportTitleText += " - Upto previous month Report";
                } else if (attributeNameX.indexOf("M-") > -1) {
                    reportTitleText += " - Monthly Report";
                    titleText += " - Monthly Marks";
                }
            }else{
                if (attributeNameX.indexOf("C-") > -1) {
                    titleText += " - Cumulative Achievement (%)";
                    reportTitleText += " - Cumulative Report";
                } else if (attributeNameX.indexOf("UPM-") > -1) {
                    titleText += " - Upto previous month Achievement (%)";
                    reportTitleText += " - Upto previous month Report";
                } else if (attributeNameX.indexOf("M-") > -1) {
                    reportTitleText += " - Monthly Report";
                    titleText += " - Monthly Achievement (%)";
                }
            }
            
        }

        document.getElementById("titleText").innerHTML = "<b>" + titleText + "</b>";
        initialize();
    }

    function drop(cities, bucket) {
        clearMarkers();
        for (var i = 0; i < cities.length; i++) {
            addMarkerWithTimeout(cities[i], 1, bucket);
        }
    }

    function addMarkerWithTimeout(position, timeout, bucket) {
        var mrkr;
        var image;

        if (position[4] < bucket[0][1]) {
            //console.log("red: " + position[4]);
            image = 'http://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=|e74c3c';
        } else if (position[4] < bucket[1][1]) {
            //console.log("amber: " + position[4]);
            image = 'http://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=|f1c40f';
        } else if (position[4] <= bucket[2][1]) {
            //console.log("green: " + position[4]);
            image = 'http://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=|2ecc71';
        }

        if (position[4] == 100) {
            image = 'http://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=|2ecc71';
        }

        //console.log(position[14]);//region-wise
        if (gradeName == "regwise") {
            if(position[14] == 'RAJAHMUNDRY'){
                image = 'http://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=|e74c3c'; //red
            }else if(position[14] == 'VISAKHAPATNAM'){
                image = 'http://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=|f1c40f';//amber
            }else if(position[14] == 'GUNTUR'){
                image = 'http://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=|2ecc71';//green
            }else if(position[14] == 'ANANTAPUR'){
                image = 'http://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=|0099cc';//blue
            }
        }
        


        var myLatLng = {
            lat: parseFloat(position[0]),
            lng: parseFloat(position[1])
        };

        if (unitOfIndicator == "-") {
            position[6] = " NA";
        }

        mrkr = new google.maps.Marker({
            position: myLatLng,
            map: map,
            icon: image,
            animation: google.maps.Animation.DROP
        });

        mrkr.addListener('mouseover', function() {
            chartInfoBubble2.setContent("<div ><font size='2'><b>" + position[2] + "</b><br>" + "Grade: <b>" + position[3] + "</b></br>" + attributeNameX + ": <b>" + ((typeof(position[4]) == 'number') ? (position[4].toFixed(2)) : position[4]) + "</b></br>" + attributeNameY + ": <b>" + position[5] + "</b></br><table border='1' class='infoWindowTable' style='width=100%;'><tr><th>-</th><th>Upto previous month</th><th>Monthly</th><th>Cumulative</th></tr><tr><td><b>Marks (" + position[13] + ")</b></td><td><b>" + ((typeof(position[12]) == 'number') ? (position[12].toFixed(2)) : position[12]) + "</b></td><td><b>" + ((typeof(position[11]) == 'number') ? (position[11].toFixed(2)) : position[11]) + "</b></td><td><b>" + ((typeof(position[10]) == 'number') ? (position[10].toFixed(2)) : position[10]) + "</b></td></tr><tr><td><b>Rank</b></td><td><b>" + position[9] + "</b></td><td><b>" + position[8] + "</b></td><td><b>" + position[7] + "</b></td></tr></table></font></div>");
            chartInfoBubble2.open(map,mrkr);
            
        });

        mrkr.addListener('mouseout', function() {
            chartInfoBubble2.close();
        });

        //mrkr.setZIndex(101);
        markers.push(mrkr);

    }

    function clearMarkers() {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
        markers = [];
    }

    function selectChosenItemSelected() {
        var selectBox = document.getElementById("chosenNames");
        var selectedValue = selectBox.options[selectBox.selectedIndex].value;

        tooltipValue = selectedValue;
        ulbsummary('https://www.googleapis.com/fusiontables/v2/query?sql=', tooltipValue);

    }

    function generateReport() {
        // alert(generateReportQuery);
        var query = new google.visualization.Query('http://www.google.com/fusiontables/gvizdata?tq=');
        //console.log('generateReportQuery:'+generateReportQuery);
        query.setQuery(generateReportQuery);
        query.send(openTableModal);
        $('#loadingIndicator').show();
        $('#table_div').hide();
    }

    function openTableModal(response) {
        var data = response.getDataTable();
        var myTableDiv = document.getElementById("table_div");
        var table = document.getElementById('print_data_table');
        var tableBody = document.getElementById('table_body');

        while (tableBody.firstChild) {
            tableBody.removeChild(tableBody.firstChild);
        }
        var heading = new Array();
        var heading = [];

        if (!overallSelected) {
            if(gradeName == 'regwise'){
                if (!multiSeries) {
                    heading = ["Sr No.", "Region", "Annual Target", "Target", "Achievement", "Achievement %", "Marks", "Max Marks"];
                } else {
                    heading = ["Sr No.", "Region", "Annual Target", "C-Target", "C-Achievement", "C-Achievement %", "C-Marks", "Max Marks", "M-Target", "M-Achievement", "M-Achievement %", "M-Marks"];
                }
            }else{
                if (!multiSeries) {
                    heading = ["Sr No.", "ULB Name", "Annual Target", "Target", "Achievement", "Achievement %", "Marks", "Max Marks", "Rank"];
                } else {
                    heading = ["Sr No.", "ULB Name", "Annual Target", "C-Target", "C-Achievement", "C-Achievement %", "C-Marks", "Max Marks", "C-Rank", "M-Target", "M-Achievement", "M-Achievement %", "M-Marks", "M-Rank"];
                }
            }
            
        } else {
            if(gradeName == 'regwise'){
                if (!multiSeries) {
                    heading = ["Sr No.", "Region", "Marks", "Max Marks"];
                } else {
                    heading = ["Sr No.", "Region", "C-Marks", "M-Marks", "Max Marks"];
                }
            }else{
                if (!multiSeries) {
                heading = ["Sr No.", "ULB Name", "Marks", "Max Marks", "Rank"];
                } else {
                    heading = ["Sr No.", "ULB Name", "C-Marks", "C-Rank", "M-Marks", "M-Rank", "Max Marks"];
                }
            }
            
        }

        var tr = document.createElement('TR');
        tableBody.appendChild(tr);
        for (i = 0; i < heading.length; i++) {
            var th = document.createElement('TH')
                //th.width = '200';
            th.appendChild(document.createTextNode(heading[i]));
            tr.appendChild(th);
        }

        var rows = [],
            columns = [];
        for (var i = 0; i < data.getNumberOfRows(); i++) {
            var tr = document.createElement('TR');
            var td = document.createElement('TD');
            td.appendChild(document.createTextNode(i + 1));
            tr.appendChild(td);
            for (var j = 0; j < data.getNumberOfColumns(); j++) {
                var td = document.createElement('TD');
                var val = data.getValue(i, j);
                //td.appendChild(document.createTextNode(val));
                //console.log(val+'<--->'+typeof(val));
                if(j == (data.getNumberOfColumns()-1)){
                    td.appendChild(document.createTextNode(val));
                }else{
                    if(typeof(val) == 'string'){
                        td.appendChild(document.createTextNode(val));
                    }else if(typeof(val) == 'number'){
                        td.appendChild(document.createTextNode(val.toFixed(2)));
                    }
                }
                tr.appendChild(td);
            }
            tableBody.appendChild(tr);
        }
        myTableDiv.appendChild(table);

        $('#loadingIndicator').hide();
        $('#table_div').show();

        $('#m-title').text(reportTitleText);
        $('#m-subtitle').text('UOM : '+unitOfIndicator);

    }

    function paperPrint() {
        $(".modal-content").printElement({
            printBodyOptions: {
                styleToAdd: 'height:auto;overflow:auto;margin-left:-25px;'
            }
        });
    }
