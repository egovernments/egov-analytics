var mainTabClicked = 1,
    subTabClicked = 0;

$(document).ready(function() {

    var viztype = "split";
    var search = 'allulb';
    var timeframe = 'M-Achievement (percentage)';

    $('.first-section-tab ul li').click(function() {
        $('.first-section-tab ul li').removeClass('tab-current-newreq');
        $(this).addClass('tab-current-newreq');
        //alert(typeof($(this).data('indicators')));


        //REMOVED: class="subtab-a" from <a href tag.....
        $('.second-section-tab ul').html('');
        if ($(this).data('indicators') == 'Swachchaandhra') {
            $('.second-section-tab ul').html('<li data-submaincount="0"> <a href="javascript:void(0);" class="subtab-a"> <span>Overall</span> </a> </li> <li data-submaincount="1"> <a href="javascript:void(0);"> <span>Toilet Coverage</span> </a> </li> <li data-submaincount="2"> <a href="javascript:void(0);"> <span>Garbage Collection</span> </a> </li> <li data-submaincount="3"> <a href="javascript:void(0);"> <span>Efficiency</span> </a> </li>');
        } else if ($(this).data('indicators') == 'watersupply') {
            $('.second-section-tab ul').html('<li data-submaincount="0"> <a href="javascript:void(0);" class="subtab-a"> <span>Overall</span> </a> </li> <li data-submaincount="1"> <a href="javascript:void(0);"> <span>Coverage</span> </a> </li> <li data-submaincount="2"> <a href="javascript:void(0);"> <span>Cost Recovery</span> </a> </li>');
        } else if ($(this).data('indicators') == 'Revenue') {
            $('.second-section-tab ul').html('<li data-submaincount="0"> <a href="javascript:void(0);" class="subtab-a"> <span>Overall</span> </a> </li> <li data-submaincount="1"> <a href="javascript:void(0);"> <span>Property Tax Collection Efficiency</span> </a> </li> <li data-submaincount="2"> <a href="javascript:void(0);"> <span>PT Demand Increase</span> </a> </li>');
        } else if ($(this).data('indicators') == 'Citizenservices') {
            $('.second-section-tab ul').html('<li data-submaincount="0"> <a href="javascript:void(0);" class="subtab-a"> <span>Overall</span> </a> </li> <li data-submaincount="1"> <a href="javascript:void(0);"> <span>Citizen Charter Implementation</span> </a> </li> <li data-submaincount="2"> <a href="javascript:void(0);"> <span>Redressal of Grievances</span> </a> </li>');
        } else if ($(this).data('indicators') == 'Greenerydevelopment') {
            $('.second-section-tab ul').html(' <li data-submaincount="0"> <a href="javascript:void(0);" class="subtab-a"> <span>Tree Plantation</span> </a> </li>');
        } else if ($(this).data('indicators') == 'Streetlighting') {
            $('.second-section-tab ul').html('<li data-submaincount="0"> <a href="javascript:void(0);" class="subtab-a"> <span>Overall</span> </a> </li> <li data-submaincount="1"> <a href="javascript:void(0);"> <span>LED Coverage</span> </a> </li> <li data-submaincount="2"> <a href="javascript:void(0);"> <span>Additional Fixtures</span> </a> </li>');
        } else if ($(this).data('indicators') == 'Health') {
            $('.second-section-tab ul').html('<li data-submaincount="0"> <a href="javascript:void(0);" class="subtab-a"> <span>Incidence of Communicable Diseases</span> </a> </li>');
        } else if ($(this).data('indicators') == 'Finance') {
            $('.second-section-tab ul').html('<li data-submaincount="0"> <a href="javascript:void(0);" class="subtab-a"> <span>Overall</span> </a> </li> <li data-submaincount="1"> <a href="javascript:void(0);"> <span>Double Entry Accounting</span> </a> </li> <li data-submaincount="2"> <a href="javascript:void(0);"> <span>Pending Account and Audits</span> </a> </li>');
        } else if ($(this).data('indicators') == 'Communitydevelopment') {
            $('.second-section-tab ul').html('<li data-submaincount="0"> <a href="javascript:void(0);" class="subtab-a"> <span>Overall</span> </a> </li> <li data-submaincount="1"> <a href="javascript:void(0);"> <span>SHG Bank Linkage</span> </a> </li> <li data-submaincount="2"> <a href="javascript:void(0);"> <span>Livelihood</span> </a> </li>');
        } else if ($(this).data('indicators') == 'Overall') {
            /* $('.second-section-tab ul').html('<li> <a href="javascript:void(0);" class="subtab-a"> <span>Overall</span> </a> </li> <li> <a href="javascript:void(0);"> <span>Toilet Coverage</span> </a> </li> <li> <a href="javascript:void(0);"> <span>Garbage Collection</span> </a> </li> <li> <a href="javascript:void(0);"> <span>Efficiency</span> </a> </li>');*/
        } else if ($(this).data('indicators') == 'Education') {
            $('.second-section-tab ul').html('<li data-submaincount="0"> <a href="javascript:void(0);" class="subtab-a"> <span>High Schools with IIT Foundation</span> </a> </li>');
        }
        mainTabClicked = $(this).data('maincount');
        console.log("Main Tab:" + mainTabClicked);
        //CUSTOM FUNCTION WHEN OVERALL TAB IS CLICKED
        //MAIN TAB INFO GLOBAL VARIABLE
subTabClicked = 0;
     refreshiframe(search, viztype, timeframe);

    });

    $(".second-section-tab ul").on("click", "li a", function() {
        $('.second-section-tab ul li a').removeClass('subtab-a');
        $(this).addClass('subtab-a');
        subTabClicked = $(this).parent().data('submaincount');
        console.log("Main Tab: " + mainTabClicked + "; Sub Tab: " + subTabClicked);

        //ADD CUSTOM FUNCTION
        refreshiframe(search, viztype, timeframe);
    });

    $('.viztype').change(function() {
        //alert('changed!'+$(this).val());
        viztype = $(this).val();
        refreshiframe(search, viztype, timeframe);
    });

    $('.grade-search').click(function() {
        search = $(this).data('search');
        refreshiframe(search, viztype, timeframe);
    });

    $('.timeframe-search').click(function() {
        var key = $(this).data('timeline');
        if (key == 'uptoprevmonth') {
            timeframe = "UPM-Achievement (percentage)";
        } else if (key == 'monthly') {
            timeframe = "M-Achievement (percentage)";
        } else if (key == 'cumulative') {
            timeframe = "C-Achievement (percentage)";
        } else if (key == "comparative") {
            timeframe = "comparative";
        }
        refreshiframe(search, viztype, timeframe);
    });

    $(".btn-group > .btn").click(function() {
        $(this).addClass("active").siblings().removeClass("active");
    });

});

function refreshiframe(search, viztype, timeframe) {

    /*    if(search == 'specialndselect'){
           $('#getiframe').attr('src', 'http://egovernments.org/html/ap-dashboard/visuals.html?X=Property%20Tax%20-Demand%20in%20Lakhs&Y=CITY&area=grade&grade=G1&chart=ColumnChart&sort=XDESC&viz='+viztype+'');
        }else if(search == 'grade1nd2'){
           $('#getiframe').attr('src', 'http://egovernments.org/html/ap-dashboard/visuals.html?X=Property%20Tax%20-Demand%20in%20Lakhs&Y=CITY&area=grade&grade=G2&chart=ColumnChart&sort=XDESC&viz='+viztype+'')
        }else if(search == 'grade3ndnp'){
           $('#getiframe').attr('src', 'http://egovernments.org/html/ap-dashboard/visuals.html?X=Property%20Tax%20-Demand%20in%20Lakhs&Y=CITY&area=grade&grade=G3&chart=ColumnChart&sort=XDESC&viz='+viztype+'')
        }else if(search == 'corp'){
           $('#getiframe').attr('src', 'http://egovernments.org/html/ap-dashboard/visuals.html?X=Property%20Tax%20-Demand%20in%20Lakhs&Y=CITY&area=grade&grade=G4&chart=ColumnChart&sort=XDESC&viz='+viztype+'')
        }else if(search == 'allulb'){
           $('#getiframe').attr('src', 'http://egovernments.org/html/ap-dashboard/visuals.html?X=Property%20Tax%20-Demand%20in%20Lakhs&Y=CITY&area=city&chart=ColumnChart&sort=XDESC&viz='+viztype+'')
        }
    */

    if (search == 'specialndselect') {
        if (timeframe == "comparative") {
            $('#getiframe').attr('src', 'http://egovernments.org/html/cm-demo-tool/visuals.html?X=M-Achievement (percentage)&Y=ULB%20Name&area=grade&grade=G1&chart=MultiChart&sort=XDESC&viz=chart&status=start&main=' + mainTabClicked + '&sub=' + subTabClicked);
            return;
        }
        $('#getiframe').attr('src', 'http://egovernments.org/html/cm-demo-tool/visuals.html?X=' + timeframe + '&Y=ULB%20Name&area=grade&grade=G1&chart=ColumnChart&sort=XDESC&viz=' + viztype + '&status=start&main=' + mainTabClicked + '&sub=' + subTabClicked);
    } else if (search == 'grade1nd2') {
        if (timeframe == "comparative") {
            $('#getiframe').attr('src', 'http://egovernments.org/html/cm-demo-tool/visuals.html?X=M-Achievement (percentage)&Y=ULB%20Name&area=grade&grade=G2&chart=MultiChart&sort=XDESC&viz=chart&status=start&main=' + mainTabClicked + '&sub=' + subTabClicked);
            return;
        }
        $('#getiframe').attr('src', 'http://egovernments.org/html/cm-demo-tool/visuals.html?X=' + timeframe + '&Y=ULB%20Name&area=grade&grade=G2&chart=ColumnChart&sort=XDESC&viz=' + viztype + '&status=start&main=' + mainTabClicked + '&sub=' + subTabClicked);
    } else if (search == 'grade3ndnp') {
        if (timeframe == "comparative") {
            $('#getiframe').attr('src', 'http://egovernments.org/html/cm-demo-tool/visuals.html?X=M-Achievement (percentage)&Y=ULB%20Name&area=grade&grade=G3&chart=MultiChart&sort=XDESC&viz=chart&status=start&main=' + mainTabClicked + '&sub=' + subTabClicked);
            return;
        }
        $('#getiframe').attr('src', 'http://egovernments.org/html/cm-demo-tool/visuals.html?X=' + timeframe + '&Y=ULB%20Name&area=grade&grade=G3&chart=ColumnChart&sort=XDESC&viz=' + viztype + '&status=start&main=' + mainTabClicked + '&sub=' + subTabClicked);
    } else if (search == 'corp') {
        if (timeframe == "comparative") {
            $('#getiframe').attr('src', 'http://egovernments.org/html/cm-demo-tool/visuals.html?X=M-Achievement (percentage)&Y=ULB%20Name&area=grade&grade=G4&chart=MultiChart&sort=XDESC&viz=chart&status=start&main=' + mainTabClicked + '&sub=' + subTabClicked);
            return;
        }
        $('#getiframe').attr('src', 'http://egovernments.org/html/cm-demo-tool/visuals.html?X=' + timeframe + '&Y=ULB%20Name&area=grade&grade=G4&chart=ColumnChart&sort=XDESC&viz=' + viztype + '&status=start&main=' + mainTabClicked + '&sub=' + subTabClicked);
    } else if (search == 'allulb') {
        if (timeframe == "comparative") {
            $('#getiframe').attr('src', 'http://egovernments.org/html/cm-demo-tool/visuals.html?X=M-Achievement (percentage)&Y=ULB%20Name&area=city&chart=MultiChart&sort=XDESC&viz=chart&status=start&main=' + mainTabClicked + '&sub=' + subTabClicked);
            return;
        }
        $('#getiframe').attr('src', 'http://egovernments.org/html/cm-demo-tool/visuals.html?X=' + timeframe + '&Y=ULB%20Name&area=city&chart=ColumnChart&sort=XDESC&viz=' + viztype + '&status=start&main=' + mainTabClicked + '&sub=' + subTabClicked);
    }
}