
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

// const td = new Date()

// var today = getDateStr(td)

// var yd = new Date(td)

// yd.setDate(yd.getDate() - 1)

// var yesterday = getDateStr(yd)

// var yd2 = new Date(td)

// yd2.setDate(yd2.getDate() - 2)

// var twodaysago = getDateStr(yd2)

// https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/04-13-2020.csv

var latest_covid_array = []

var onemonthago_covid_array = []

var count = 0

function getLatestCOVID(td, is_one_month_ago){

    var today = getDateStr(td)

    // console.log("start to process " + today);
	if(is_one_month_ago){
		
		onemonthago_covid_array = []
		
	}else{
		
		latest_covid_array = []
		
	}

    // https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/04-14-2020.csv
    // https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/12-04-2020.csv

    var client = new XMLHttpRequest();
    //			client.open('GET', '../temp/ncov_hubei.csv');
    client.open('GET', 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/'+today + ".csv", false);
	
    client.onload = function() {
        // console.log(client.status)
        if(client.status==200){
            var csv = client.responseText;
            var allTextLines = csv.split(/\r\n|\n/);

            for(var i=1;i<allTextLines.length;i+=1){
                
                var cols = allTextLines[i].split(',')
                
                //covid_array.push(cols)
				
				if(is_one_month_ago){
		
					onemonthago_covid_array.push(cols)
					
				}else{
					
					latest_covid_array.push(cols)
					
				}

            }
            // console.log(csv)
        }else{

            // console.log("entry error")
            //file not exists
            count += 1

            if(count < 5){

                var yd = new Date(td)

                yd.setDate(yd.getDate() - 1)

                getLatestCOVID(yd, is_one_month_ago)

            }

        }
        
    }
	
    client.onerror = function(){
		
		console.error("Error occurs when requesting the COVID-19 data.");
        
    }
	
    client.send()
	

}

var cd = new Date()

getLatestCOVID(cd, false)

var m = cd.getMonth();
cd.setMonth(cd.getMonth()-1);
if (cd.getMonth() == m) cd.setDate(0);
cd.setHours(0, 0, 0);
cd.setMilliseconds(0);

console.log(cd)

getLatestCOVID(cd, true)


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

function getInfoByFIPS(fipscode, county_ele, pop_ele, pop2_ele, covid_ele, covid2_ele, covid2_1m_ele){

    fipscode = Number(fipscode)

    var statename = "N/A"

    var countyname = "N/A"

    var population = "N/A"

    var confirmed = "N/A"

    var death = "N/A"

    var active = "N/A"

    var recovered = "N/A"

    var lastupdate = "N/A"
	
	var statename_1m = "N/A"

    var countyname_1m = "N/A"

    var population_1m = "N/A"

    var confirmed_1m = "N/A"

    var death_1m = "N/A"

    var active_1m = "N/A"

    var recovered_1m = "N/A"

    var lastupdate_1m = "N/A"

    for(var i=0;i<latest_covid_array.length;i+=1){

        if(fipscode==latest_covid_array[i][0]){

            statename = latest_covid_array[i][2]

            countyname = latest_covid_array[i][1]

            confirmed = latest_covid_array[i][7]

            death = latest_covid_array[i][8]

            active = latest_covid_array[i][10]

            recovered = latest_covid_array[i][9]

            lastupdate = latest_covid_array[i][4]

        }

    }
	
	for(var i=0;i<onemonthago_covid_array.length;i+=1){

        if(fipscode==onemonthago_covid_array[i][0]){

            statename_1m = onemonthago_covid_array[i][2]

            countyname_1m = onemonthago_covid_array[i][1]

            confirmed_1m = onemonthago_covid_array[i][7]

            death_1m = onemonthago_covid_array[i][8]

            active_1m = onemonthago_covid_array[i][10]

            recovered_1m = onemonthago_covid_array[i][9]

            lastupdate_1m = onemonthago_covid_array[i][4]

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

                if(cols[5]!=null&&cols[6]!=null
					&&statename.toLowerCase() == cols[5].toLowerCase() 
                    && cols[6].toLowerCase().startsWith(countyname.toLowerCase())){

                    population = cols[7]

                    console.log("Population : ", population)

                    break;

                }

            }

            $(county_ele).html(countyname + ", " + statename)

            $(pop_ele).html(population)

            $(pop2_ele).val(population)

            $(covid_ele).html("<span  style=\"color:red;\">Current:</span> Confirmed: " + confirmed + "; Active: " + active +
                "; Death: " + death + "; Recovered: " + recovered + "; Update: " + lastupdate+"<br/>" +
				"<span  style=\"color:red;\">30 days ago:</span> Confirmed: " + confirmed_1m + "; Active: " + active_1m +
                "; Death: " + death_1m + "; Recovered: " + recovered_1m + "; Update: " + lastupdate_1m+"<br/>")

            $(covid2_ele).val(confirmed)
			
			$(covid2_1m_ele).val(confirmed_1m)

            $("#calc").click();
        
        }
     });

    

}


function riskestimate(total_population, store_people_count, potential_covid_cases, potential_covid_cases_1m_ago){
	
	if(!potential_covid_cases_1m_ago){
	
		potential_covid_cases_1m_ago = 0
	
	}
	
    var risk = 0;
    if(potential_covid_cases>0){

        // calculate no clash probability
        var p = 1
        for(var i=0;i<Number(store_people_count); i+=1){

            p = p*((Number(total_population)-i-Number(potential_covid_cases)+Number(potential_covid_cases_1m_ago))/(Number(total_population)-i))

        }

        // get clash probability
        var clashp = 1-p
        // make it percentage
        risk =  Math.round(clashp*100, 4)

    }
    return risk

}

$("#calc").click(function(){

    var population = $("#popu").val()

    var storepeople = $("#storepeople").val()

    var potentials = $("#potentials").val()
	
	var potentials_1m_ago = $("#potentials_1m_ago").val()

    console.log(potentials);

    var risk = riskestimate(population, storepeople, potentials, potentials_1m_ago)

    $("#results_own").html("<p>Estimation: The probability of meeting people with COVID in the grocery "+
    "stores/gyms/restaurants/workplaces/recreational areas in this region is: </p>"+
    "<p style=\"text-align: center;\">"+
    "<b style=\"color:red; font-size:20px;\">" +  risk + "%</b></p>"+
    "<p>* An example interpretation:</p>"+
    "<ul>"+
	
    "<li> <b>0-25%</b>: Relatively safe</li>"+
    "<li> <b>25-50%</b>: Risky</li> "+
    "<li> <b>50-75%</b>: Very Risky</li>"+
    "<li> <b>&gt;75%</b>: Highly Risky. Think twice before taking actions.</li></ul>"+
    
    "<p style=\"text-align: left;\"><span style=\"color:red;\">WARNING</span>: "+
    "This classification is just an example. Use with caution.</p>")

})

$("#findfips").click(function(){

    var fipscode = $("#fipscode").val()

    // var zipcode = $("#zipcode").val()

    $("#county").html("")
    $("#popres").html("")
    $("#covid").html("")

    getInfoByFIPS(fipscode, "#county", "#popres", "#popu", "#covid", "#potentials", "#potentials_1m_ago");

    

})

function getFIPSByZip(zipcode){

    var fipslist = []

    for(var i=0;i<zip2fips.length;i+=1){

        if(Number(zip2fips[i][0])==Number(zipcode)){

            fipslist.push(zip2fips[i][1]) 

        }

    }

    console.log("Find FIPS " + fipslist)

    return fipslist;

}

$("#findzip").click(function(){

    var zipcode = $("#zipcode").val()

    var fipslist = getFIPSByZip(zipcode)

    var content = ""

    $("#county2").html("")
    $("#popres2").html("")
    $("#covid2").html("")

    for(var i=0;i<fipslist.length;i+=1){

        content += "<input onclick=\"getInfoByFIPS('"+fipslist[i]+"', '#county2', '#popres2', '#popu', '#covid2', '#potentials', '#potentials_1m_ago')\" type=\"button\" value=\""+fipslist[i]+"\" > "

    }

    $("#fipsregion").html(content)


    // getInfoByFIPS(fips, "#county2", "#popres2", "#popu", "#covid2", "#potentials");

})
