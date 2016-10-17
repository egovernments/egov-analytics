var mainTabClicked = 0,
    subTabClicked = 0;

var mode = "city";
var text = "";
var hod = '';


$(document).ready(function() {

    $('.map-title, title').text('Municipal Performance Indicators - '+getParameterByName('hodname', window.location));

    var viztype = "split";
    var search = 'allulb';
    var timeframe = 'M-Achievement (percentage)';

    var toiletCoverage, doorToDoor, garbageLifting;
    var connections, costRecovery;
    var propTaxColl, propTaxDemand;
    var citizenCharter, grievances;
    var treePlant;
    var led, fixtures;
    var doubleEntry, pendingAC;
    var shgBank, livelihood;
    var highSchools;

    //start of settings
    //console.log('HOD Parameters Name: '+getParameterByName('hodname', window.location));
    //console.log('HOD Parameters ID: '+getParameterByName('hod', window.location));

    hod = getParameterByName('hod', window.location);

    if(hod == 1){
        $('.hod-dma').removeClass('hide');

        doorToDoor = "<p><span class='view-content'>Coverage: Door to Door Garbage Collection</span></p><p><span class='view-content'>Definition</span> : HHs and CUs covered / Target CU+HHs to be covered</p>";

        garbageLifting = "<p><span class='view-content'>Garbage Lifting</span></p><p><span class='view-content'>Definition</span> : Quantity of garbage lifted per day / Garbage generated in metric tonnes</p>";

        $('.second-section-tab ul').html('<li data-submaincount="0"> <a href="javascript:void(0);" class="subtab-a"><span>Overall</span></a></li><li data-submaincount="1"><a href="javascript:void(0);"><span>Door to Door Collection</span><i data-toggle="popover" data-content="' + doorToDoor + '" class="fa fa-info"></i> </a> </li> <li data-submaincount="2"><a href="javascript:void(0);"><span>Garbage Lifting</span><i data-toggle="popover" data-content="' + garbageLifting + '" class="fa fa-info"></i></a></li>');

        mainTabClicked =3 ; subTabClicked = 0;
    }
    else if(hod == 2){
        $('.hod-ce').removeClass('hide');

        connections = "<p><span class='view-content'>Coverage: Water Supply Connections (based on availability of existing network)</span></p><p><span class='view-content'>Definition</span> : No. of water connections given / Target no. of water connections to be given with pipeline network</p>";

        costRecovery = "<p><span class='view-content'>Cost Recovery in water supply per month</span></p><p><span class='view-content'>Definition</span> : Total O & M Revenues / Total O & M Expenditure (excluding capital account)</p>";

        $('.second-section-tab ul').html('<li data-submaincount="0"> <a href="javascript:void(0);" class="subtab-a"> <span>Overall</span> </a> </li> <li data-submaincount="1"> <a href="javascript:void(0);"> <span>Connections Coverage</span> <i data-toggle="popover" data-content="' + connections + '" class="fa fa-info"></i></a> </li> <li data-submaincount="2"> <a href="javascript:void(0);"> <span>Cost Recovery</span> <i data-toggle="popover" data-content="' + costRecovery + '" class="fa fa-info"></i></a> </li>');
    
        mainTabClicked =8 ; subTabClicked = 0;
    }
    else if(hod == 3){
        $('.overall').hide();$('.hod-dtcp').removeClass('hide').addClass('tab-current-newreq');
        
        building = "<p><span class='view-content'>Building Online Permissions</span></p><p><span class='view-content'>Definition</span> : No. of applications disposed within SLA period/Target No. of applications to be disposed within SLA</p>";

        $('.second-section-tab ul').html('<li data-submaincount="0"> <a href="javascript:void(0);" class="subtab-a"> <span>Building Online Permissions</span><i data-toggle="popover" data-content="' + building + '" class="fa fa-info"></i> </a> </li>');
        
        mainTabClicked =11 ; subTabClicked = 0;
    }
    else if(hod == 4){
        $('.overall').hide();$('.hod-mepma').removeClass('hide');
        
        shgBank = "<p><span class='view-content'>SHG Bank linkage</span></p><p><span class='view-content'>Definition</span> : Financial Achievement/ Target</p>";

        livelihood = "<p><span class='view-content'>Livelihood</span></p><p><span class='view-content'>Definition</span> : Persons trained and placed / Target no. of persons to be trained and placed</p>";

        skill = "<p><span class='view-content'>Skill Training Programmes</span></p><p><span class='view-content'>Definition</span> : No. of Persons trained and  placed/target no. of persons to be trained and placed</p>";

        $('.second-section-tab ul').html('<li data-submaincount="0"> <a href="javascript:void(0);" class="subtab-a"> <span>Overall</span> </a> </li> <li data-submaincount="1"> <a href="javascript:void(0);"> <span>SHG Bank Linkage</span><i data-toggle="popover" data-content="' + shgBank + '" class="fa fa-info"></i> </a> </li> <li data-submaincount="2"> <a href="javascript:void(0);"> <span>Livelihood</span><i data-toggle="popover" data-content="' + livelihood + '" class="fa fa-info"></i> </a> </li><li data-submaincount="3"> <a href="javascript:void(0);"> <span>Skill Training Programmes</span><i data-toggle="popover" data-content="' + skill + '" class="fa fa-info"></i> </a> </li>');
    
        mainTabClicked =12 ; subTabClicked = 0;
    }
    else if(hod == 5){
        $('.overall').hide();$('.hod-swacha').removeClass('hide').addClass('tab-current-newreq');

        hhtoiletCoverage = "<p><span class='view-content'>Individual Household Toilets (IHT) coverage</span></p><p><span class='view-content'>Definition</span> : IHT Constructed / Target IHTs to be constructed</p>";

        communitytoiletCoverage = "<p><span class='view-content'>Community Toilets coverage</span></p><p><span class='view-content'>Definition</span> : Community Toilets constructed / Community Toilets to be constructed</p>";

        $('.second-section-tab ul').html('<li data-submaincount="0"> <a href="javascript:void(0);" class="subtab-a"> <span>Overall</span> </a> </li><li data-submaincount="1"><a href="javascript:void(0);"><span>Individual Household Toilets (IHT) coverage</span><i data-toggle="popover" data-content="' + hhtoiletCoverage + '" class="fa fa-info"></i></a> </li><li data-submaincount="2"><a href="javascript:void(0);"><span>Community Toilets coverage</span><i data-toggle="popover" data-content="' + communitytoiletCoverage + '" class="fa fa-info"></i></a> </li>');
        
        mainTabClicked =1 ; subTabClicked = 0;    
    }
    else if(hod == 6){
        $('.overall').hide();$('.hod-green').removeClass('hide').addClass('tab-current-newreq');

        treePlant = "<p><span class='view-content'>Tree plantation</span></p><p><span class='view-content'>Definition</span> : Achievement / Target</p>";

        $('.second-section-tab ul').html(' <li data-submaincount="0"> <a href="javascript:void(0);" class="subtab-a"> <span>Tree Plantation</span><i data-toggle="popover" data-content="' + treePlant + '" class="fa fa-info"></i> </a> </li>');
        
        mainTabClicked =2 ; subTabClicked = 0; 
    }
    else if(hod == 6){//Combined

    }

    resizeheight();

    console.log(" On load Main Tab: " + mainTabClicked + "; Sub Tab: " + subTabClicked);
    refreshiframe(search, viztype, timeframe);
    
    //end of settings

    $('.first-section-tab ul li').click(function() {

        mainTabClicked = $(this).data('maincount');
        subTabClicked = 0;

        //Remove active class form all items - sectors
        $('.first-section-tab ul li').removeClass('tab-current-newreq');

        //Add active class to clickable item - sectors
        $(this).addClass('tab-current-newreq');

        //alert(typeof($(this).data('indicators')));

        //REMOVED: class="subtab-a" from <a href tag.....
        $('.second-section-tab ul').html('');
        if ($(this).data('indicators') == 'Swachchaandhra') {

            hhtoiletCoverage = "<p><span class='view-content'>Individual Household Toilets (IHT) coverage</span></p><p><span class='view-content'>Definition</span> : IHT Constructed / Target IHTs to be constructed</p>";

            communitytoiletCoverage = "<p><span class='view-content'>Community Toilets coverage</span></p><p><span class='view-content'>Definition</span> : Community Toilets constructed / Community Toilets to be constructed</p>";

            $('.second-section-tab ul').html('<li data-submaincount="0"> <a href="javascript:void(0);" class="subtab-a"> <span>Overall</span> </a> </li><li data-submaincount="1"><a href="javascript:void(0);"><span>Individual Household Toilets (IHT) coverage</span><i data-toggle="popover" data-content="' + hhtoiletCoverage + '" class="fa fa-info"></i></a> </li><li data-submaincount="2"><a href="javascript:void(0);"><span>Community Toilets coverage</span><i data-toggle="popover" data-content="' + communitytoiletCoverage + '" class="fa fa-info"></i></a> </li>');
        
        }else if ($(this).data('indicators') == 'Greenerydevelopment') {

            treePlant = "<p><span class='view-content'>Tree plantation</span></p><p><span class='view-content'>Definition</span> : Achievement / Target</p>";

            $('.second-section-tab ul').html(' <li data-submaincount="0"> <a href="javascript:void(0);" class="subtab-a"> <span>Tree Plantation</span><i data-toggle="popover" data-content="' + treePlant + '" class="fa fa-info"></i> </a> </li>');
        
        }else if ($(this).data('indicators') == 'Communitydevelopment') {

            shgBank = "<p><span class='view-content'>SHG Bank linkage</span></p><p><span class='view-content'>Definition</span> : Financial Achievement/ Target</p>";

            livelihood = "<p><span class='view-content'>Livelihood</span></p><p><span class='view-content'>Definition</span> : Persons trained and placed / Target no. of persons to be trained and placed</p>";

            skill = "<p><span class='view-content'>Skill Training Programmes</span></p><p><span class='view-content'>Definition</span> : No. of Persons trained and  placed/target no. of persons to be trained and placed</p>";

            $('.second-section-tab ul').html('<li data-submaincount="0"> <a href="javascript:void(0);" class="subtab-a"> <span>Overall</span> </a> </li> <li data-submaincount="1"> <a href="javascript:void(0);"> <span>SHG Bank Linkage</span><i data-toggle="popover" data-content="' + shgBank + '" class="fa fa-info"></i> </a> </li> <li data-submaincount="2"> <a href="javascript:void(0);"> <span>Livelihood</span><i data-toggle="popover" data-content="' + livelihood + '" class="fa fa-info"></i> </a> </li><li data-submaincount="3"> <a href="javascript:void(0);"> <span>Skill Training Programmes</span><i data-toggle="popover" data-content="' + skill + '" class="fa fa-info"></i> </a> </li>');
        }else if ($(this).data('indicators') == 'townplaningact') {

            building = "<p><span class='view-content'>Building Online Permissions</span></p><p><span class='view-content'>Definition</span> : No. of applications disposed within SLA period/Target No. of applications to be disposed within SLA</p>";

            $('.second-section-tab ul').html('<li data-submaincount="0"> <a href="javascript:void(0);" class="subtab-a"> <span>Building Online Permissions</span><i data-toggle="popover" data-content="' + building + '" class="fa fa-info"></i> </a> </li>');
        
        }else if ($(this).data('indicators') == 'watersupply') {

            connections = "<p><span class='view-content'>Coverage: Water Supply Connections (based on availability of existing network)</span></p><p><span class='view-content'>Definition</span> : No. of water connections given / Target no. of water connections to be given with pipeline network</p>";

            costRecovery = "<p><span class='view-content'>Cost Recovery in water supply per month</span></p><p><span class='view-content'>Definition</span> : Total O & M Revenues / Total O & M Expenditure (excluding capital account)</p>";

            $('.second-section-tab ul').html('<li data-submaincount="0"> <a href="javascript:void(0);" class="subtab-a"> <span>Overall</span> </a> </li> <li data-submaincount="1"> <a href="javascript:void(0);"> <span>Connections Coverage</span> <i data-toggle="popover" data-content="' + connections + '" class="fa fa-info"></i></a> </li> <li data-submaincount="2"> <a href="javascript:void(0);"> <span>Cost Recovery</span> <i data-toggle="popover" data-content="' + costRecovery + '" class="fa fa-info"></i></a> </li>');
        }else if ($(this).data('indicators') == 'Streetlighting') {

            led = "<p><span class='view-content'>LED Coverage</span></p><p><span class='view-content'>Definition</span> : No. of LED fixtures set up/ Target no. of LED fixtures to be set up</p>";
            
            fixtures = "<p><span class='view-content'>Additional fixtures</span></p><p><span class='view-content'>Definition</span> : Target no. of additional fixtures to be set up to achieve 100% saturation</p>";

            $('.second-section-tab ul').html('<li data-submaincount="0"> <a href="javascript:void(0);" class="subtab-a"> <span>Overall</span> </a> </li> <li data-submaincount="1"> <a href="javascript:void(0);"> <span>LED Coverage</span> <i data-toggle="popover" data-content="' + led + '" class="fa fa-info"></i></a> </li> <li data-submaincount="2"> <a href="javascript:void(0);"> <span>Additional Fixtures</span><i data-toggle="popover" data-content="' + fixtures + '" class="fa fa-info"></i> </a> </li>');
        }else if ($(this).data('indicators') == 'solidwastemgmt') {

            doorToDoor = "<p><span class='view-content'>Coverage: Door to Door Garbage Collection</span></p><p><span class='view-content'>Definition</span> : HHs and CUs covered / Target CU+HHs to be covered</p>";

            garbageLifting = "<p><span class='view-content'>Garbage Lifting</span></p><p><span class='view-content'>Definition</span> : Quantity of garbage lifted per day / Garbage generated in metric tonnes</p>";

            $('.second-section-tab ul').html('<li data-submaincount="0"> <a href="javascript:void(0);" class="subtab-a"><span>Overall</span></a></li><li data-submaincount="1"><a href="javascript:void(0);"><span>Door to Door Collection</span><i data-toggle="popover" data-content="' + doorToDoor + '" class="fa fa-info"></i> </a> </li> <li data-submaincount="2"><a href="javascript:void(0);"><span>Garbage Lifting</span><i data-toggle="popover" data-content="' + garbageLifting + '" class="fa fa-info"></i></a></li>');
        }else if ($(this).data('indicators') == 'propertytax') {

            propTaxColl = "<p><span class='view-content'>Property Tax Collection</span></p><p><span class='view-content'>Definition</span> : Property Tax Collection / Total PT Demand</p>";

            propTaxDemand = "<p><span class='view-content'>Property Tax Demand Increase</span></p><p><span class='view-content'>Definition</span> : PT demand increase achieved / Target PT demand increase</p>";

            $('.second-section-tab ul').html('<li data-submaincount="0"> <a href="javascript:void(0);" class="subtab-a"> <span>Overall</span> </a> </li> <li data-submaincount="1"> <a href="javascript:void(0);"> <span>Property Tax Collection Efficiency</span> <i data-toggle="popover" data-content="' + propTaxColl + '" class="fa fa-info"></i></a> </li> <li data-submaincount="2"> <a href="javascript:void(0);"> <span>Property Tax Demand Increase</span> <i data-toggle="popover" data-content="' + propTaxDemand + '" class="fa fa-info"></i></a> </li>');
        }else if ($(this).data('indicators') == 'Citizenservices') {

            citizenCharter = "<p><span class='view-content'>Citizen Charter implementation (office services)</span></p><p><span class='view-content'>Definition</span> : No. of applications disposed within SLA period / Target No. of applications to be disposed within SLA</p>";
            
            grievances = "<p><span class='view-content'>Redressal of Grievances ina  time period (field level complaints)</span></p><p><span class='view-content'>Definition</span> : No. of citizen complaints redressed within SLA period / Target no. of grievances to be disposed within SLA</p>";

            $('.second-section-tab ul').html('<li data-submaincount="0"> <a href="javascript:void(0);" class="subtab-a"> <span>Overall</span> </a> </li> <li data-submaincount="1"> <a href="javascript:void(0);"> <span>Citizen Charter (office)</span> <i data-toggle="popover" data-content="' + citizenCharter + '" class="fa fa-info"></i> </a> </li> <li data-submaincount="2"> <a href="javascript:void(0);"> <span>Grievances Redressal (field)</span><i data-toggle="popover" data-content="' + grievances + '" class="fa fa-info"></i> </a> </li>');
        }else if ($(this).data('indicators') == 'Finance') {

            doubleEntry = "<p><span class='view-content'>Implementation of Double Entry Accounting</span></p><p><span class='view-content'>Definition</span> : No. of data entry days completed. Target no. of days to be entered in the financial year</p>";

            pendingAC = "<p><span class='view-content'>Pending Accounts and Audit</span></p><p><span class='view-content'>Definition</span> : No. of accounting years and audit years pending</p>";

            $('.second-section-tab ul').html('<li data-submaincount="0"> <a href="javascript:void(0);" class="subtab-a"> <span>Overall</span> </a> </li> <li data-submaincount="1"> <a href="javascript:void(0);"> <span>Double Entry Accounting</span><i data-toggle="popover" data-content="' + doubleEntry + '" class="fa fa-info"></i> </a> </li> <li data-submaincount="2"> <a href="javascript:void(0);"> <span>Pending Accounts and Audits</span> <i data-toggle="popover" data-content="' + pendingAC + '" class="fa fa-info"></i></a> </li>');
        }else if ($(this).data('indicators') == 'Education') {

            highSchools = "<p><span class='view-content'>High Schools with IIT Foundation</span></p><p><span class='view-content'>Definition</span> : No. of schools set up</p>";
            
            $('.second-section-tab ul').html('<li data-submaincount="0"> <a href="javascript:void(0);" class="subtab-a"> <span>High Schools with IIT Foundation</span> <i data-toggle="popover" data-content="' + highSchools + '" class="fa fa-info"></i></a> </li>');
        }

        $('[data-toggle="popover"]').popover({
            template: '<div class="popover"><div class="arrow"></div><div class="popover-content"></div></div>',
            trigger: 'hover',
            html: true,
            container: 'body',
            placement: 'bottom'
        });

        console.log("Main Tab: " + mainTabClicked + "; Sub Tab: " + subTabClicked);
        //CUSTOM FUNCTION WHEN OVERALL TAB IS CLICKED
        //MAIN TAB INFO GLOBAL VARIABLE

        resizeheight();

        subTabClicked = 0;
        refreshiframe(search, viztype, timeframe);

    });

    function resizeheight(){
        if (mainTabClicked == 0) {
            $('#getiframe').css('height', '100%').css('height', '-=120px');
        } else {
            $('#getiframe').css('height', '100%').css('height', '-=160px');
        }
    }

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

    $('.grade-search').click(function() {
        search = $(this).data('search');
        mode = "city";
        refreshiframe(search, viztype, timeframe);
    });

    //Handled district and region change event
    $('.btn-group ul li a').click(function() {
        text = $(this).html();

        var type = "";
        button = $(this).parent().parent().parent().find('.custom-dropdown');
        $(button).parent().parent().find('.active').removeClass('active');
        $(button).addClass('active');

        if ($(button).is('[data-region]')) {
            console.log('Selected Region is -> ' + text);
            type = "Region - ";

            $('.custom-dropdown[data-district]').html('District <span class="caret"></span>');
            mode = "region";
            refreshiframe(search, viztype, timeframe);

            //Arpit - Refresh iframe according to Region
        } else {
            type = "District - ";
            console.log('Selected District is -> ' + text);
            $('.custom-dropdown[data-region]').html('Region <span class="caret"></span>');
            //Arpit - Refresh iframe according to district
            mode = "district";
            refreshiframe(search, viztype, timeframe);

        }
        $(button).html(type + text + ' <span class="caret"></span>');

    });


    $(".withoutdropdownbtns.btn-group[role] > .btn").click(function() {
        $(this).parent().find('.active').removeClass('active');
        $(this).addClass("active");
    });

    $(".dropdownbtns.btn-group[role] > .btn").click(function() {
        $('.dropdownbtns .active').removeClass('active');
        $(this).addClass("active");
        $('.custom-dropdown[data-district]').html('District <span class="caret"></span>');
        $('.custom-dropdown[data-region]').html('Region <span class="caret"></span>');
    });

    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }


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
    if (mode == "region") {
        if (timeframe == "comparative") {

            if (text == "ALL") {
                $('#getiframe').attr('src', '../cm-demo-tool/visuals.html?X=' + timeframe + '&Y=ULB%20Name&area=city&chart=MultiChart&sort=XDESC&viz=' + viztype + '&status=start&main=' + mainTabClicked + '&sub=' + subTabClicked + '&hod=' + hod);
            } else {
                $('#getiframe').attr('src', '../cm-demo-tool/visuals.html?X=M-Achievement (percentage)&Y=ULB%20Name&area=region&reg=' + text + '&chart=MultiChart&sort=XDESC&viz=chart&status=start&main=' + mainTabClicked + '&sub=' + subTabClicked + '&hod=' + hod);
            }
            return;
        }

        if (text == "ALL") {
            $('#getiframe').attr('src', '../cm-demo-tool/visuals.html?X=' + timeframe + '&Y=ULB%20Name&area=city&chart=ColumnChart&sort=XDESC&viz=' + viztype + '&status=start&main=' + mainTabClicked + '&sub=' + subTabClicked + '&hod=' + hod);
        } else {
            $('#getiframe').attr('src', '../cm-demo-tool/visuals.html?X=' + timeframe + '&Y=ULB%20Name&area=region&reg=' + text + '&chart=ColumnChart&sort=XDESC&viz=' + viztype + '&status=start&main=' + mainTabClicked + '&sub=' + subTabClicked + '&hod=' + hod);
        }
    } else if (mode == "district") {

        if (timeframe == "comparative") {

            if (text == "ALL") {
                $('#getiframe').attr('src', '../cm-demo-tool/visuals.html?X=' + timeframe + '&Y=ULB%20Name&area=city&chart=MultiChart&sort=XDESC&viz=' + viztype + '&status=start&main=' + mainTabClicked + '&sub=' + subTabClicked + '&hod=' + hod);
            } else {
                $('#getiframe').attr('src', '../cm-demo-tool/visuals.html?X=M-Achievement (percentage)&Y=ULB%20Name&area=district&dis=' + text + '&chart=MultiChart&sort=XDESC&viz=chart&status=start&main=' + mainTabClicked + '&sub=' + subTabClicked + '&hod=' + hod);
            }
            return;
        }
        if (text == "ALL") {
            $('#getiframe').attr('src', '../cm-demo-tool/visuals.html?X=' + timeframe + '&Y=ULB%20Name&area=city&chart=ColumnChart&sort=XDESC&viz=' + viztype + '&status=start&main=' + mainTabClicked + '&sub=' + subTabClicked + '&hod=' + hod);
        } else {
            $('#getiframe').attr('src', '../cm-demo-tool/visuals.html?X=' + timeframe + '&Y=ULB%20Name&area=district&dis=' + text + '&chart=ColumnChart&sort=XDESC&viz=' + viztype + '&status=start&main=' + mainTabClicked + '&sub=' + subTabClicked + '&hod=' + hod);

        }
    } else if (mode == "city") {

        if (search == 'specialndselect') {
            if (timeframe == "comparative") {
                $('#getiframe').attr('src', '../cm-demo-tool/visuals.html?X=M-Achievement (percentage)&Y=ULB%20Name&area=grade&grade=G1&chart=MultiChart&sort=XDESC&viz=chart&status=start&main=' + mainTabClicked + '&sub=' + subTabClicked + '&hod=' + hod);
                return;
            }
            $('#getiframe').attr('src', '../cm-demo-tool/visuals.html?X=' + timeframe + '&Y=ULB%20Name&area=grade&grade=G1&chart=ColumnChart&sort=XDESC&viz=' + viztype + '&status=start&main=' + mainTabClicked + '&sub=' + subTabClicked + '&hod=' + hod);
        } else if (search == 'grade1nd2') {
            if (timeframe == "comparative") {
                $('#getiframe').attr('src', '../cm-demo-tool/visuals.html?X=M-Achievement (percentage)&Y=ULB%20Name&area=grade&grade=G2&chart=MultiChart&sort=XDESC&viz=chart&status=start&main=' + mainTabClicked + '&sub=' + subTabClicked + '&hod=' + hod);
                return;
            }
            $('#getiframe').attr('src', '../cm-demo-tool/visuals.html?X=' + timeframe + '&Y=ULB%20Name&area=grade&grade=G2&chart=ColumnChart&sort=XDESC&viz=' + viztype + '&status=start&main=' + mainTabClicked + '&sub=' + subTabClicked + '&hod=' + hod);
        } else if (search == 'grade3ndnp') {
            if (timeframe == "comparative") {
                $('#getiframe').attr('src', '../cm-demo-tool/visuals.html?X=M-Achievement (percentage)&Y=ULB%20Name&area=grade&grade=G3&chart=MultiChart&sort=XDESC&viz=chart&status=start&main=' + mainTabClicked + '&sub=' + subTabClicked + '&hod=' + hod);
                return;
            }
            $('#getiframe').attr('src', '../cm-demo-tool/visuals.html?X=' + timeframe + '&Y=ULB%20Name&area=grade&grade=G3&chart=ColumnChart&sort=XDESC&viz=' + viztype + '&status=start&main=' + mainTabClicked + '&sub=' + subTabClicked + '&hod=' + hod);
        } else if (search == 'corp') {
            if (timeframe == "comparative") {
                $('#getiframe').attr('src', '../cm-demo-tool/visuals.html?X=M-Achievement (percentage)&Y=ULB%20Name&area=grade&grade=G4&chart=MultiChart&sort=XDESC&viz=chart&status=start&main=' + mainTabClicked + '&sub=' + subTabClicked + '&hod=' + hod);
                return;
            }
            $('#getiframe').attr('src', '../cm-demo-tool/visuals.html?X=' + timeframe + '&Y=ULB%20Name&area=grade&grade=G4&chart=ColumnChart&sort=XDESC&viz=' + viztype + '&status=start&main=' + mainTabClicked + '&sub=' + subTabClicked + '&hod=' + hod);
        } else if (search == 'allulb') {
            if (timeframe == "comparative") {
                $('#getiframe').attr('src', '../cm-demo-tool/visuals.html?X=M-Achievement (percentage)&Y=ULB%20Name&area=city&chart=MultiChart&sort=XDESC&viz=chart&status=start&main=' + mainTabClicked + '&sub=' + subTabClicked + '&hod=' + hod);
                return;
            }
            $('#getiframe').attr('src', '../cm-demo-tool/visuals.html?X=' + timeframe + '&Y=ULB%20Name&area=city&chart=ColumnChart&sort=XDESC&viz=' + viztype + '&status=start&main=' + mainTabClicked + '&sub=' + subTabClicked + '&hod=' + hod);
        }else if(search == 'elevenulb'){
			
            if (timeframe == "comparative") {
                $('#getiframe').attr('src', '../cm-demo-tool/visuals.html?X=M-Achievement (percentage)&Y=ULB%20Name&area=grade&grade=elevenulb&chart=MultiChart&sort=XDESC&viz=chart&status=start&main=' + mainTabClicked + '&sub=' + subTabClicked + '&hod=' + hod);
                return;
            }
            $('#getiframe').attr('src', '../cm-demo-tool/visuals.html?X=' + timeframe + '&Y=ULB%20Name&area=grade&grade=elevenulb&chart=ColumnChart&sort=XDESC&viz=' + viztype + '&status=start&main=' + mainTabClicked + '&sub=' + subTabClicked + '&hod=' + hod);
        
		}else if(search == 'regwise'){
            
            if (timeframe == "comparative") {
                $('#getiframe').attr('src', '../cm-demo-tool/visuals.html?X=M-Achievement (percentage)&Y=ULB%20Name&area=grade&grade=regwise&chart=MultiChart&sort=XDESC&viz=chart&status=start&main=' + mainTabClicked + '&sub=' + subTabClicked + '&hod=' + hod);
                return;
            }
            $('#getiframe').attr('src', '../cm-demo-tool/visuals.html?X=' + timeframe + '&Y=ULB%20Name&area=grade&grade=regwise&chart=ColumnChart&sort=XDESC&viz=' + viztype + '&status=start&main=' + mainTabClicked + '&sub=' + subTabClicked + '&hod=' + hod);
        
        }
    }
}