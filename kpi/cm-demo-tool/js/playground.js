    var attributeNameX = "M-Achievement (percentage)";
    var attributeNameY = "ULB Name";
    var sortType = "XDESC";
    var chartType = "ColumnChart";
    var districtName = "ANANTAPUR";
    var regionName = "ANANTAPUR";
    var gradeName = "G3";
    var vizType = "split";
    var mode = "grade";

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

        var selectorY = document.getElementById('attribute-selector');
        var selectorX = document.getElementById('attribute-selector-2');

        var fragment = document.createDocumentFragment();
        eGovAttributeList.forEach(function(egovattris, index) {
            var opt = document.createElement('option');
            opt.innerHTML = egovattris;
            opt.value = egovattris;
            fragment.appendChild(opt);
        });
        selectorY.appendChild(fragment);

        var fragment = document.createDocumentFragment();
        var opt = document.createElement('option');
        opt.innerHTML = "AP-All ULBs";
        opt.value = "ULB Name";
        fragment.appendChild(opt);

        eGovAttributeList.forEach(function(egovattris, index) {
            var opt = document.createElement('option');
            opt.innerHTML = egovattris;
            opt.value = egovattris;
            fragment.appendChild(opt);
        });

        selectorX.appendChild(fragment);

        //        sortAlphabetically('#attribute-selector option');

        document.title = attributeNameX + " v/s " + attributeNameY;

        $('.chosen-select').chosen().trigger("chosen:updated");
        $("#district").hide();
        $("#region").hide();

    }

    /* X Axis */
    function onAttriXChanged() {
        var selectBox = document.getElementById("attribute-selector");
        attributeNameX = selectBox.options[selectBox.selectedIndex].value;
        document.getElementById("sort-selector").selectedIndex = "0";
        updateFrameQuery();
    }

    /* Y Axis */
    function onAttriYChanged() {
        var selectBox = document.getElementById("attribute-selector-2");
        attributeNameY = selectBox.options[selectBox.selectedIndex].value;
        document.getElementById("sort-selector").selectedIndex = "0";
        updateFrameQuery();
    }

    /* District selector */
    function onDistrictChanged() {
        var selectBox = document.getElementById("district-selector");
        districtName = selectBox.options[selectBox.selectedIndex].value;
        updateFrameQuery();
    }

    /* Region selector */
    function onRegionChanged() {
        var selectBox = document.getElementById("region-selector");
        regionName = selectBox.options[selectBox.selectedIndex].value;
        updateFrameQuery();
    }

    /* Grade selector */
    function onGradeChanged() {
        var selectBox = document.getElementById("grade-selector");
        gradeName = selectBox.options[selectBox.selectedIndex].value;
        updateFrameQuery();
    }

    /* Chart selector */
    function onChartChanged() {
        var selectBox = document.getElementById("charttype-selector");
        chartType = selectBox.options[selectBox.selectedIndex].value;
        updateFrameQuery();
    }

    /* Area selector */
    function onAreaChanged() {
        var selectBox = document.getElementById("area-selector");
        areaID = selectBox.options[selectBox.selectedIndex].value;
        mode = "";
        switch (parseInt(areaID, 10)) {

            case 1:
                mode = "city";
                document.getElementById('region').style.display = "none";
                document.getElementById('district').style.display = "none";
                document.getElementById('grade').style.display = "none";
                break;
            case 2:
                mode = "district";
                document.getElementById('region').style.display = "none";
                document.getElementById('district').style.display = "block";
                document.getElementById('grade').style.display = "none";
                break;
            case 3:
                mode = "region";
                document.getElementById('region').style.display = "block";
                document.getElementById('district').style.display = "none";
                document.getElementById('grade').style.display = "none";
                break;
            case 4:
                mode = "grade";
                document.getElementById('region').style.display = "none";
                document.getElementById('district').style.display = "none";
                document.getElementById('grade').style.display = "block";
                break;
        }
        $('.chosen-select').chosen().trigger("chosen:updated");
        updateFrameQuery();
    }

    /* Sort type selector */
    function onSortChanged() {
        var selectBox = document.getElementById("sort-selector");
        sortType = selectBox.options[selectBox.selectedIndex].value;
        updateFrameQuery();
    }

    /* Split/ Map/ Chart Visualization*/
    function onVisualizationChanged() {
        var selectBox = document.getElementById("visualizationtype-selector");
        vizType = selectBox.options[selectBox.selectedIndex].value;
        updateFrameQuery();
    }

    /* Sorts the select dropdown options alphabetically */
    function sortAlphabetically(id) {
        var options = $(id);
        var arr = options.map(function(_, o) {
            return {
                t: $(o).text(),
                v: o.value
            };
        }).get();
        arr.sort(function(o1, o2) {
            return o1.t > o2.t ? 1 : o1.t < o2.t ? -1 : 0;
        });
        options.each(function(i, o) {
            o.value = arr[i].v;
            $(o).text(arr[i].t);
        });
    }

    /* Updates the reference link of the Update Button */
    function updateFrameQuery() {
        document.title = attributeNameX + " v/s " + attributeNameY;
        var buttonLink = document.getElementById('genVis');
        if (mode == "city") {
            buttonLink.href = "visuals.html?X=" + attributeNameX + "&Y=" + attributeNameY + "&area=" + mode + "&chart=" + chartType + "&sort=" + sortType + "&viz=" + vizType + "&status=start&main=1&sub=0";
        } else if (mode == "district") {
            buttonLink.href = "visuals.html?X=" + attributeNameX + "&Y=" + attributeNameY + "&area=" + mode + "&dis=" + districtName + "&chart=" + chartType + "&sort=" + sortType + "&viz=" + vizType + "&status=start&main=1&sub=0";
        } else if (mode == "region") {
            buttonLink.href = "visuals.html?X=" + attributeNameX + "&Y=" + attributeNameY + "&area=" + mode + "&reg=" + regionName + "&chart=" + chartType + "&sort=" + sortType + "&viz=" + vizType + "&status=start&main=1&sub=0";
        } else if (mode == "grade") {
            buttonLink.href = "visuals.html?X=" + attributeNameX + "&Y=" + attributeNameY + "&area=" + mode + "&grade=" + gradeName + "&chart=" + chartType + "&sort=" + sortType + "&viz=" + vizType + "&status=start&main=1&sub=0";
        }
    }