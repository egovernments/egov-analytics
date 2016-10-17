    var map, layer, districtLayer;

    var projectAPIKey = 'AIzaSyBXfd7prk_wNPBQAvvaVRJ6Ph3D2ZnMRQ4';
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

    var chartInfoBubble;

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

        chartInfoBubble = new InfoBubble({
            map: map,
            shadowStyle: 1,
            padding: 5,
            backgroundColor: 'rgb(255,255,255)',
            borderRadius: 0,
            arrowSize: 25,
            borderWidth: 2,
            borderColor: '#2c2c2c',
            disableAutoPan: false,
            hideCloseButton: false,
            arrowPosition: 50,
            arrowStyle: 0,
            minWidth: 275,
            maxWidth: 600,
            minHeight: 140
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
            var annualTarget = e.row['Annual Target'].value.toString();
            var cRank = e.row['C-Rank'].value.toString();
            var mRank = e.row['M-Rank'].value.toString();
            var upmRank = e.row['UPM-Rank'].value.toString();
            var attri = e.row[attributeNameX].value.toString();
            e.infoWindowHtml = "<div ><font size='2'>"
            e.infoWindowHtml += "<b>" + cityChosen + "</b><br>Annual Target: <b>" + annualTarget + "</b><br>Rank (cumulative): <b>" + cRank + "</b><br>Rank (monthly): <b>" + mRank + "</b><br>Rank (upto prev month): <b>" + upmRank + "</b><br>" + attributeNameX + ": <b>" + attri + "</b><br>" + "District: <b>" + e.row['District'].value.toString() + "</b><br>" + "Region: <b>" + e.row['Region'].value.toString() + "</b>";
            e.infoWindowHtml += "</font></div>";
        });

        layer.setMap(map);
        //        layer.setMap(null);

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
        cumulativeChartQuery = "SELECT '" + attributeNameY + "','C-Achievement (percentage)' " + cumulativeChartQuery;

        generateReportQuery = placeChartQuery.substring(placeChartQuery.indexOf("FROM"), placeChartQuery.indexOf("ORDER"));

        if (!overallSelected) {
            if (chartType == "MultiChart") {
                generateReportQuery = "SELECT '" + attributeNameY + "','Annual Target','C-Target','C-Achievement','C-Achievement (percentage)','C-Marks','Max Marks', 'C-Rank','M-Target','M-Achievement','M-Achievement (percentage)','M-Marks','M-Rank' " + generateReportQuery + " ORDER BY '" + attributeNameY + "' ASC";
                multiSeries = true;
            } else {
                if (attributeNameX.indexOf("C-") > -1) {
                    generateReportQuery = "SELECT '" + attributeNameY + "','Annual Target','C-Target','C-Achievement','C-Achievement (percentage)','C-Marks','Max Marks','C-Rank' " + generateReportQuery + " ORDER BY 'C-Rank' ASC";
                } else if (attributeNameX.indexOf("UPM-") > -1) {
                    generateReportQuery = "SELECT '" + attributeNameY + "','Annual Target','UPM-Target','UPM-Achievement','UPM-Achievement (percentage)','UPM-Marks','Max Marks','UPM-Rank' " + generateReportQuery + " ORDER BY 'UPM-Rank' ASC";
                } else if (attributeNameX.indexOf("M-") > -1) {
                    generateReportQuery = "SELECT '" + attributeNameY + "','Annual Target','M-Target','M-Achievement','M-Achievement (percentage)','M-Marks','Max Marks','M-Rank' " + generateReportQuery + " ORDER BY 'M-Rank' ASC";
                }
            }
        } else {
            if (chartType == "MultiChart") {
                generateReportQuery = "SELECT '" + attributeNameY + "','C-Marks','C-Rank','M-Marks','M-Rank','Max Marks' " + generateReportQuery + " ORDER BY '" + attributeNameY + "' ASC";
                multiSeries = true;
            } else {
                if (attributeNameX.indexOf("C-") > -1) {
                    generateReportQuery = "SELECT '" + attributeNameY + "','C-Marks','Max Marks','C-Rank' " + generateReportQuery + " ORDER BY 'C-Rank' ASC";
                } else if (attributeNameX.indexOf("UPM-") > -1) {
                    generateReportQuery = "SELECT '" + attributeNameY + "','UPM-Marks','Max Marks','UPM-Rank' " + generateReportQuery + " ORDER BY 'UPM-Rank' ASC";
                } else if (attributeNameX.indexOf("M-") > -1) {
                    generateReportQuery = "SELECT '" + attributeNameY + "','M-Marks','Max Marks','M-Rank' " + generateReportQuery + " ORDER BY 'M-Rank' ASC";
                }
            }
        }
        var query = new google.visualization.Query('http://www.google.com/fusiontables/gvizdata?tq=');
        query.setQuery(cumulativeChartQuery);
        query.send(getCumulativeValues);

        function getCumulativeValues(response) {
            cumulativeValues = [];

            for (var i = 0; i < response.getDataTable().getNumberOfRows(); i++) {
                cumulativeValues.push(response.getDataTable().getValue(i, 1));
            }
            var query = new google.visualization.Query('http://www.google.com/fusiontables/gvizdata?tq=');
            // Apply query language statement.
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

            if (chartType != "MultiChart") {
                dataTable.addColumn({
                    type: 'string',
                    role: 'style'
                });

                //alert(parseFloat(globalBucket[0][1]) + "," + globalBucket[1][1]);
                var lastColorColumn = parseInt(dataTable.getNumberOfColumns());
                var numberOfRowsInQuery = parseInt(dataTable.getNumberOfRows());

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
            } else {
                dataTable.addColumn('number', 'Cumulative Achievement (percentage)');

                var lastColumn = parseInt(dataTable.getNumberOfColumns());
                var numberOfRowsInQuery = parseInt(dataTable.getNumberOfRows());

                for (var i = 0; i < numberOfRowsInQuery; i++) {
                    dataTable.setValue(i, lastColumn - 1, cumulativeValues[i]);
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
                        addTooltipScript('https://www.googleapis.com/fusiontables/v2/query?sql=', false);
                        $("#chosenNames").attr("placeholder", "Search ULBs").val("").focus().blur();
                        $('#chosenNames').chosen().trigger("chosen:updated");
                    }
                }, 500);
            }

            function barMouseOut(e) {

                // on mouse out, cancel the timer
                clearTimeout(timer);

                chartInfoBubble.close();
                chartInfoMarker.setMap(null);
                //setMapOnAll(map);
            }

        }
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
        showULBonMap(ulbPoint[0], ulbPoint[1], ulbPoint[2], ulbPoint[3], ulbPoint[4], ulbPoint[5], ulbPoint[6], ulbPoint[7], ulbPoint[8], ulbPoint[9], ulbPoint[10]);
    }

    function showULBonMap(ulb, centroid, ttValueY, ttValueX, grad, annualTar, rank, target, achieved, marks, maxMarks) {

        var bubbleLoc = centroid.split(',');

        if (chartInfoBubble.isOpen()) { // unless the InfoBubble is open, we open it
            chartInfoBubble.close();
            // chartInfoMarker.setMap(null);
        }

        chartInfoMarker.setPosition(new google.maps.LatLng(parseFloat(bubbleLoc[1]), parseFloat(bubbleLoc[0])));
        chartInfoMarker.setZIndex(999999);
        chartInfoMarker.setMap(map);

        if (unitOfIndicator == "-") {
            target = " NA";
            achieved = " NA";
            annualTar = " NA";
        }

/*        chartInfoBubble.setContent("<div ><font size='2'><b>" + ulb + "</b><br/>Grade: <b>" + grad + "</b><br />" + attributeNameX + ": <b>" + ttValueY + "</b></br>Unit of Indicator: <b>" + unitOfIndicator + "</b></br>Target: <b>" + target + "</b></br>Achievement: <b>" + achieved + "</b></br>Annual Target: <b>" + annualTar + "</b></br>Marks (" + maxMarks +"): <b>" + marks + "</b></br>Rank (110): <b>" + rank + "</b></font></div>");
*/
        chartInfoBubble.setContent("<div ><font size='2'><b>" + ulb + "</b><br/>Grade: <b>" + grad + "</b><br/>Unit of indicator: <b>" + unitOfIndicator+"</b></br><table border='1' class='infoWindowTable' style='width=100%;'><tr><th>Annual Target</th><th>Target</th><th>Achievement</th><th>"+attributeNameX+"</th><th>Marks ("+maxMarks+")</th><th>Rank</th></tr><tr><td><b>"+ annualTar + "</b></td><td><b>"+ target + "</b></td><td><b>"+ achieved + "</b></td><td><b>"+ ttValueY + "</b></td><td><b>"+ marks + "</b></td><td><b>"+ rank + "</b></td></tr></table></font></div>");

        chartInfoBubble.setPosition(new google.maps.LatLng(parseFloat(bubbleLoc[1]) + zoomLevelBasedBubblePos(), parseFloat(bubbleLoc[0])));

        if (!chartInfoBubble.isOpen()) { // unless the InfoBubble is open, we open it
            chartInfoBubble.open(map);
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

        var selectText = "SELECT+'" + attributeNameX + "',Centroid,'ULB Name','Grade','" + attributeNameY + "','" + "Annual Target','C-Rank','M-Rank','UPM-Rank','C-Marks','UPM-Marks','M-Marks','Max Marks'";
        var whereText;

        if (mode == "city") {
            whereText = '';
        } else if (mode == 'district') {
            whereText = "+WHERE+" + "District" + "='" + districtName + "'";
        } else if (mode == 'region') {
            whereText = "+WHERE+" + "Region" + "='" + regionName + "'";
        } else if (mode == 'grade') {
            if (gradeName == "G1") {
                whereText = "+WHERE+" + "'Grade' IN ('Special','Selection')";
            } else if (gradeName == "G2") {
                whereText = "+WHERE+" + "'Grade' IN ('I','II')";
            } else if (gradeName == "G3") {
                whereText = "+WHERE+" + "'Grade' IN ('III','NP')";
            } else if (gradeName == "G4") {
                whereText = "+WHERE+" + "Grade" + "='Corp'";
            } else {
                whereText = "+WHERE+" + "Grade" + "='" + gradeName + "'";
            }
        } else {
            whereText = '';
        }

        var tableIDString = "+from+" + citiesTableID;
        var key_callback_string = "&key=" + projectAPIKey + "&callback=handler";

        src = src + selectText + tableIDString + whereText + key_callback_string;
        var s = document.createElement('script');
        s.setAttribute('src', src);
        document.body.appendChild(s);
    }

    function handler(response) {

        markerLocations = [];
        searchBarULBs = [];

        var hisArray = [];
        for (var i = 0; i < response.rows.length; i++) {
            var attValX = response.rows[i][0];
            hisArray.push(attValX);
            var pos = response.rows[i][1].toString().split(",");
            var lat = pos[1];
            var lon = pos[0];
            var city = (response.rows[i])[4].toString();
            var grad = (response.rows[i])[3].toString();
            var attValY = (response.rows[i])[4];
            var annualTarget = (response.rows[i])[5];
            var cRank = (response.rows[i])[6];
            var mRank = (response.rows[i])[7];
            var upmRank = (response.rows[i])[8];
            var cMarks = (response.rows[i])[9];
            var mMarks = (response.rows[i])[10];
            var upmMarks = (response.rows[i])[11];
            var maxMarks = (response.rows[i])[12];

            markerLocations.push([lat, lon, city, grad, attValX, attValY, annualTarget, cRank, mRank, upmRank, cMarks, upmMarks, mMarks, maxMarks]);
            searchBarULBs.push(city);
        }
        globalBucket = bucketGenerator(hisArray);

        console.log(globalBucket);

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
        layer.set('styles', styles);
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
                styleId: 1
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

        //document.getElementById("titleText").textContent = attributeNameX + " for " + attributeNameY;

        overallSelected = false;
        if (mainIndic == 0 || (mainIndic == 1 && subMainIndic == 0) || (mainIndic == 2 && subMainIndic == 0) || (mainIndic == 3 && subMainIndic == 0) || (mainIndic == 4 && subMainIndic == 0) || (mainIndic == 6 && subMainIndic == 0) || (mainIndic == 7 && subMainIndic == 0) || (mainIndic == 8 && subMainIndic == 0)) {
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
            //citiesTableID = '1G4jpYXOw_8EMlab2GliyjVw7smGy-WW4rLPe8NUm'; //OLD
            citiesTableID = '1kKWzzposXbqNGmH2RaZMgJ-m1sXxuO5Tay9yjMRV'; //NEW
            titleText = "Overall - All ULB Indicators";
            unitOfIndicator = "-";
        } else if (mainIndic == 1) {
            if (subMainIndic == 0) {
//                citiesTableID = '1mSnyPGBtNG9ZzGkJwGWMuMPmKnYpNMs502hARNKS'; //NEW
  citiesTableID = '1dzj1LoFKcTeDZp-RL9Xl4HPRC8csA7uN2RkknfAP';
                titleText = "Swachcha Andhra - Overall";
                unitOfIndicator = "-";
                subIndicators = ['Toilets Coverage', 'Door to Door Garbage Collection', 'Garbage Lifting'];
            } else if (subMainIndic == 1) {
                citiesTableID = '1iz8WHDVDI927H53VQscHqVb8FOlWcp7f2N6Jauv2'; //NEW
                titleText = "Swachcha Andhra - Toilets Coverage";
                unitOfIndicator = "No. of units";
            } else if (subMainIndic == 2) {
                citiesTableID = '1PX-EM-vnaA4v0UAw4VNI25SVwXubA6_bX6vTP9bT'; //NEW
                titleText = "Swachcha Andhra - Door to Door Garbage Collection";
                unitOfIndicator = "No. of Households";
            } else if (subMainIndic == 3) {
                citiesTableID = '1rUHAPUlhczMh0I_VwL4IDRpVJxMcogmI2hFeN2zL'; //NEW
                titleText = "Swachcha Andhra - Garbage Lifting";
                unitOfIndicator = "Metric tonnes";
            }
        } else if (mainIndic == 2) {
            if (subMainIndic == 0) {
           //     citiesTableID = '180ux-JcmwGRR4NTBjDh0BNa9p7LUVihVOBmdyfqq'; //NEW
             citiesTableID = '1QwJF2pFH7Xfv33AYoyCxIkPviV9QviZ0PBscWLPb';
                titleText = "Water Supply Connections - Overall Coverage";
                unitOfIndicator = "-";
                subIndicators = ['Connections Coverage', 'Water supply per month - Cost Recovery'];
            } else if (subMainIndic == 1) {
                citiesTableID = '1lV5Tlpaobr9-F_D8Y5SICg8U5o_IIPwvjsKfXwrX'; //NEW
                titleText = "Water Supply - Connections Coverage";
                unitOfIndicator = "No. of Connections";
            } else if (subMainIndic == 2) {
                citiesTableID = '1Y7-6-K_kY_fjz9Veoce-dNZW8h1Iugp7wI-1fKKc'; //NEW
                titleText = "Water Supply per month - Cost Recovery";
                unitOfIndicator = "Rupees (in Lakhs)";
            }
        } else if (mainIndic == 3) {
            if (subMainIndic == 0) {
               // citiesTableID = '1puBOY33qNzSOo6aYxwfZFeJXWaRXehKf15WOAc0M'; //NEW
                citiesTableID = '1JO2UuzUD82w9ByxTjcR0_4nIxwD7l3aLvUcDDsbP';
                titleText = "Revenue - Overall";
                subIndicators = ['Property Tax Collection Efficiency', 'Property Tax Demand Increase'];
                unitOfIndicator = "-";
            } else if (subMainIndic == 1) {
                citiesTableID = '11TNU146IVPboQiWDOWx8Duw0E4AcbfMlzVDnIl2A'; //NEW
                titleText = "Property Tax Collection Efficiency";
                unitOfIndicator = "Rupees (in lakhs)";
            } else if (subMainIndic == 2) {
                citiesTableID = '1GdDTlGyPPmXidx3Ls7UyDg1jqHjNXZnCElXNMAkx'; //NEW
                titleText = "Property Tax Demand Increase";
                unitOfIndicator = "Rupees (in lakhs)";
            }
        } else if (mainIndic == 4) {
            if (subMainIndic == 0) {
                //citiesTableID = '1HGtvj-SqHvM629eD4JJc4YFC_2kbF52gGTURK22A'; //NEW
                citiesTableID = '1gNxuQ2bLiszHaoYkl0AeleWwKVf5N3m8knGgCGBS';
                titleText = "Citizen Services - Overall";
                unitOfIndicator = "-";
                subIndicators = ['Citizen Charter', 'Grievances Redressal'];
            } else if (subMainIndic == 1) {
                citiesTableID = '1E5VX39uGmMM-5zU-Epdf_Xfy693d7dbSpQv1e60L'; //NEW
                titleText = "Citizen Services - Citizen Charter (office)";
                unitOfIndicator = "No. of applications";
            } else if (subMainIndic == 2) {
                citiesTableID = '1rVvk6LcQT_6LCxZQf92NbwK3L0YbO3NHYxel6k5o'; //NEW
                titleText = "Citizen Services - Grievances Redressal (field)";
                unitOfIndicator = "No. of grievances";
            }
        } else if (mainIndic == 5) {
            citiesTableID = '1Fgfuns8_wIMt2MCZ-_98OJcnT3ulmmuG2mi92kfl'; //NEW
            titleText = "Greenery - Tree Plantation";
            unitOfIndicator = "No. of plantations";
        } else if (mainIndic == 6) {
            if (subMainIndic == 0) {
                //citiesTableID = '1Fe1acPmgGHLZ-afXAZeuCg7NbN2H4AkZdJ384lnt'; //NEW
                citiesTableID = '1PxZ7m5Qpgefgnva7MixapYmg3dQ9mI9Ph8P4jlnj';
                titleText = "Street Lighting - Overall";
                unitOfIndicator = "-";
                subIndicators = ['LED Coverage', 'Additional Fixtures'];
            } else if (subMainIndic == 1) {
                citiesTableID = '1GqhCbg5Mr7gO71epqGXHs13fm6eGWf-tYC5QEi_a'; //NEW
                titleText = "Street Lighting - LED Coverage";
                unitOfIndicator = "No. of LEDs";
            } else if (subMainIndic == 2) {
                citiesTableID = '1eidFM_5SKk9OyuYGmgTlpI1N29sMajOgKI7qAVBE'; //NEW
                titleText = "Street Lighting - Additional Fixtures";
                unitOfIndicator = "No. of Fixtures";
            }
        } else if (mainIndic == 7) {
            if (subMainIndic == 0) {
                //citiesTableID = '1cT-MaEWah1Vo3gPnSXRFITxFP5pfH1mWGmeos7qT'; //NEW
                citiesTableID = '15yz11DN5XJxqv28y46deUTsTcO1tzckQVWg-ytNX';
                titleText = "Finance - Overall";
                unitOfIndicator = "-";
                subIndicators = ['Double Entry Accounting', 'Pending Accounts and Audit'];
            } else if (subMainIndic == 1) {
                citiesTableID = '123tt5sYPGxHJe-UiDPxJxWsbkK5JnpVKPnisEReE'; //NEW
                titleText = "Finance - Double Entry Accounting";
                unitOfIndicator = "No. of days";
            } else if (subMainIndic == 2) {
                citiesTableID = '1GYOcBjPm8uwDj2WEceP-H_Ng5sXDw_FGLq7DBpZI'; //NEW
                titleText = "Finance - Pending Accounts and Audit";
                unitOfIndicator = "No. of years";
            }
        } else if (mainIndic == 8) {
            if (subMainIndic == 0) {
                //citiesTableID = '1NbkdQciWQgazCcr-QSic2u8rdEMQVfz7a393Xue-'; //NEW
                citiesTableID = '12bjsv2RP5qj7FJun0uY4YNdH3a2YD1lNmw-ZfYRp';
                titleText = "Community Development - Overall";
                subIndicators = ['SHG Bank Linkage', 'Livelihood'];
                unitOfIndicator = "-";
            } else if (subMainIndic == 1) {
                citiesTableID = '1KRAnRn3Z5z3QpwMBD9ezvp13gEFUKInr056Xx3fa'; //NEW
                titleText = "Community Development - SHG Bank Linkage";
                unitOfIndicator = "Rupees (in lakhs)";
            } else if (subMainIndic == 2) {
                citiesTableID = '16mhTJGbGutHAqdhJ6MeGU3pZgjLu_7IYIrrPvvVk'; //NEW
                titleText = "Community Development - Livelihood";
                unitOfIndicator = "No. of persons";
            }
        } else if (mainIndic == 9) {
            citiesTableID = '1tTWtpmwZy2rCHA9dN1MmT_437o29AmRyX4c1lrIT'; //NEW
            titleText = "Education - High schools with IIT foundation";
            unitOfIndicator = "No. of High schools";
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
            }
        }

        multiSeries = false;
        reportTitleText = titleText;
        if (chartType == "MultiChart") {
            titleText += " - <span style='color:#F5861F;font-weight:bold;'>Monthly</span> and <span style='color:#6B4F2C;font-weight:bold;'>Cumulative</span> Achievement (%)";
            multiSeries = true;
            reportTitleText += " - Monthly v/s Cumulative Report";
        } else {
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
            image = 'http://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=|e74c3c';
        } else if (position[4] < bucket[1][1]) {
            image = 'http://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=|f1c40f';
        } else if (position[4] <= bucket[2][1]) {
            image = 'http://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=|2ecc71';
        }

        var myLatLng = {
            lat: parseFloat(position[0]),
            lng: parseFloat(position[1])
        };

        if (unitOfIndicator == "-") {
            position[6] = " NA";
        }
        /*        window.setTimeout(function() {
                    var infowindow = new google.maps.InfoWindow({
                        content: "<div ><font size='2'><b>" + position[2] + "</b><br>" + "Grade: <b>" + position[3] + "</b></br>" + attributeNameX + ": <b>" + position[4] + "</b></br>" + attributeNameY + ": <b>" + position[5] + "</b></br>Annual Target (" + unitOfIndicator + "): <b>" + position[6] + "</b><br>Rank (cumulative): <b>" + position[7] + "</b><br>Marks (cumulative): <b>" + position[10] +" / "+ position[13] +"</b><br>Rank (monthly): <b>" + position[8] + "</b><br>Marks (monthly): <b>" + position[11]  +" / "+ position[13] + "</b><br>Rank (upto prev month): <b>" + position[9] + "</b><br>Marks (upto previous month): <b>" + position[12]  +" / "+ position[13] + "</b></font></div>"
                    });
        */


        window.setTimeout(function() {
            var infowindow = new google.maps.InfoWindow({
                content: "<div ><font size='2'><b>" + position[2] + "</b><br>" + "Grade: <b>" + position[3] + "</b></br>" + attributeNameX + ": <b>" + position[4] + "</b></br>" + attributeNameY + ": <b>" + position[5] + "</b></br><table border='1' class='infoWindowTable' style='width=100%;'><tr><th>-</th><th>Upto previous month</th><th>Monthly</th><th>Cumulative</th></tr><tr><td><b>Marks ("+position[13]+")</b></td><td><b>"+ position[12] + "</b></td><td><b>"+ position[11] + "</b></td><td><b>"+ position[10] + "</b></td></tr><tr><td><b>Rank</b></td><td><b>"+ position[9] + "</b></td><td><b>"+ position[8] + "</b></td><td><b>"+ position[7] + "</b></td></tr></table></font></div>"
            });

            mrkr = new google.maps.Marker({
                position: myLatLng,
                map: map,
                icon: image,
                animation: google.maps.Animation.DROP
            });
            mrkr.addListener('mouseover', function() {
                infowindow.open(map, mrkr);
            });
            mrkr.addListener('mouseout', function() {
                infowindow.close();
            });
            //mrkr.setZIndex(101);
            markers.push(mrkr);

        }, timeout);
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
        addTooltipScript('https://www.googleapis.com/fusiontables/v2/query?sql=', true);

    }

    function generateReport() {
        // alert(generateReportQuery);
        var query = new google.visualization.Query('http://www.google.com/fusiontables/gvizdata?tq=');
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
            if (!multiSeries) {
                heading = ["Sr No.", "ULB Name", "Annual Target", "Target", "Achievement", "Achievement %", "Marks", "Max Marks", "Rank"];
            } else {
                heading = ["Sr No.", "ULB Name", "Annual Target", "C-Target", "C-Achievement", "C-Achievement %", "C-Marks", "Max Marks", "C-Rank", "M-Target", "M-Achievement", "M-Achievement %", "M-Marks", "M-Rank"];
            }
        } else {
            if (!multiSeries) {
                heading = ["Sr No.", "ULB Name", "Marks", "Max Marks", "Rank"];
            } else {
                heading = ["Sr No.", "ULB Name", "C-Marks", "C-Rank", "M-Marks", "M-Rank", "Max Marks"];
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
                td.appendChild(document.createTextNode(data.getValue(i, j)));
                tr.appendChild(td);
            }
            tableBody.appendChild(tr);
        }
        myTableDiv.appendChild(table);

        $('#loadingIndicator').hide();
        $('#table_div').show();

        $('.modal-title').text(reportTitleText);

    }

    function paperPrint() {
        $(".modal-content").printElement({
            printBodyOptions: {
                styleToAdd: 'height:auto;overflow:auto;margin-left:-25px;'
            }
        });
    }