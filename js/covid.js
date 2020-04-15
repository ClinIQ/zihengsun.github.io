
/**
 * 
 * COVID Risk Calculation
 * 
 * Author: Jensen Ziheng Sun
 * Date: 4/14/2020
 * 
 * Some rights reserved. 
 * 
 */

function getDateStr(d){

    const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d)
    const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d)
    const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d)

    var str = `${mo}-${da}-${ye}`
    console.log(str)

    return str
}

const td = new Date()

var today = getDateStr(td)

var yd = new Date(td)

yd.setDate(yd.getDate() - 1)

var yesterday = getDateStr(yd)

var yd2 = new Date(td)

yd2.setDate(yd2.getDate() - 2)

var twodaysago = getDateStr(yd2)

// https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/04-13-2020.csv

var latest_covid_array = []

var count = 0

function getLatestCOVID(td){

    var today = getDateStr(td)

    latest_covid_array = []

    // https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/04-14-2020.csv
    // https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/12-04-2020.csv

    var client = new XMLHttpRequest();
    //			client.open('GET', '../temp/ncov_hubei.csv');
    client.open('GET', 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/'+today + ".csv", false);
    client.onload = function() {
        var csv = client.responseText;
        var allTextLines = csv.split(/\r\n|\n/);

        for(var i=1;i<allTextLines.length;i+=1){
            
            var cols = allTextLines[i].split(',')
            
            latest_covid_array.push(cols)

        }
        console.log(csv)
    }
    client.onerror = function(){

        //file not exists
        count += 1

        if(count < 5){

            var yd = new Date(td)

            yd.setDate(yd.getDate() - 1)

            getLatestCOVID(yd)

        }
    }
    client.send()

}

getLatestCOVID(new Date())


var rooturl = "https://zihengsun.github.io/"

var zipcodecsv = rooturl + "data/uszips.csv"

var covidcsv = rooturl + "data/04-13-2020.csv"

var popcsv = rooturl + "data/co-est2019-alldata.csv"

var zip2fipscsv = rooturl + "data/ZIP-COUNTY-FIPS_2011-06.csv"

// parse covid csv

// var example_covid_array = []

// $.ajax({
        
//     type: "GET",
    
//     url: covidcsv,
    
//     dataType: "text",

//     success: function(data) {
        
//         var allTextLines = data.split(/\r\n|\n/);

//         for(var i=1;i<allTextLines.length;i+=1){
            
//             var cols = allTextLines[i].split(',')
            
//             example_covid_array.push(cols)

//         }

//     }
//  });

// parse the zipcodecsv

zip2fips = []

$.ajax({
        
    type: "GET",
    
    url: zip2fipscsv,
    
    dataType: "text",

    success: function(data) {
        
        var allTextLines = data.split(/\r\n|\n/);

        for(var i=1;i<allTextLines.length;i+=1){
            
            var cols = allTextLines[i].split(',')
            
            zip2fips.push(cols)

        }

    }
 });

function getInfoByFIPS(fipscode, county_ele, pop_ele, pop2_ele, covid_ele, covid2_ele){

    fipscode = Number(fipscode)

    var statename = "N/A"

    var countyname = "N/A"

    var population = "N/A"

    var confirmed = "N/A"

    var death = "N/A"

    var active = "N/A"

    var recovered = "N/A"

    for(var i=0;i<latest_covid_array.length;i+=1){

        if(fipscode==latest_covid_array[i][0]){

            statename = latest_covid_array[i][2]

            countyname = latest_covid_array[i][1]

            confirmed = latest_covid_array[i][7]

            death = latest_covid_array[i][8]

            active = latest_covid_array[i][10]

            recovered = latest_covid_array[i][9]



        }

    }


    $.ajax({
        
        type: "GET",
        
        url: popcsv,
        
        dataType: "text",

        success: function(data) {
            
            // var record_num = 15;  // or however many elements there are in each row
            var allTextLines = data.split(/\r\n|\n/);
            var entries = allTextLines[0].split(',');
            var lines = [];

            var population = ""

            for(var i=0;i<allTextLines.length;i+=1){
                
                var cols = allTextLines[i].split(',')
                
                // console.log(cols)

                if(statename.toLowerCase() == cols[5].toLowerCase() 
                    && cols[6].toLowerCase().startsWith(countyname.toLowerCase())){

                    population = cols[7]

                    console.log("Population : ", population)

                    break;

                }

            }

            $(county_ele).html(countyname + ", " + statename)

            $(pop_ele).html(population)

            $(pop2_ele).val(population)

            $(covid_ele).html("Confirmed: " + confirmed + "; Active: " + active +
                "; Death: " + death + "; Recovered: " + recovered)

            $(covid2_ele).val(confirmed)
        
        }
     });

    

}


function riskestimate(total_population, store_people_count, potential_covid_cases){

    // calculate no clash probability
    var p = 1
    for(var i=0;i<Number(store_people_count); i+=1){

        p = p*((Number(total_population)-i-Number(potential_covid_cases))/Number(total_population))

    }

    // get clash probability
    var clashp = 1-p
    // make it percentage
    return Math.round(clashp*100, 4)

}

$("#calc").click(function(){

    var population = $("#popu").val()

    var storepeople = $("#storepeople").val()

    var potentials = $("#potentials").val()

    console.log(potentials);

    var risk = riskestimate(population, storepeople, potentials)

    $("#results_own").html("<p>Estimation:</p>"+
    "<p>In this region, the probability of meeting people with COVID in the grocery stores/gyms/restaurants/workplaces/recreational areas is <bold style=\"color:red\">" +  risk + "%</bold>.</p>")

})

$("#findfips").click(function(){

    var fipscode = $("#fipscode").val()

    // var zipcode = $("#zipcode").val()


    getInfoByFIPS(fipscode, "#county", "#popres", "#popu", "#covid", "#potentials");

    


})

function getFIPSByZip(zipcode){

    var fipslist = []

    for(var i=0;i<zip2fips.length;i+=1){

        if(Number(zip2fips[i][0])==Number(zipcode)){

            fipslist.push(zip2fips[i][1]) 

        }

    }

    // console.log("Find FIPS " + fipslist)

    return fipslist;

}

$("#findzip").click(function(){

    var zipcode = $("#zipcode").val()

    var fipslist = getFIPSByZip(zipcode)

    var content = ""

    for(var i=0;i<fipslist.length;i+=1){

        content += "<input onclick=\"getInfoByFIPS('"+fipslist[i]+"', '#county2', '#popres2', '#popu', '#covid2', '#potentials')\" type=\"button\" value=\""+fipslist[i]+"\" > "

    }

    $("#fipsregion").html(content)

    // getInfoByFIPS(fips, "#county2", "#popres2", "#popu", "#covid2", "#potentials");

})
