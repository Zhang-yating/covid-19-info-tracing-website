//npm install x1request
const url = "https://services-eu1.arcgis.com/z6bHNio59iTqqSUY/arcgis/rest/services/COVID19_Weekly_Vaccination_Figures/FeatureServer/0/query?where=1%3D1&outFields=Week,TotalweeklyVaccines,Moderna,Pfizer,Janssen,AstraZeneca,Fully_Age10to19,Fully_Age20to29,Fully_Age30to39,Fully_Age40to49,Fully_Age50to59,Fully_Age60to69,Fully_Age70to79,Fully_Age80_,Fully_NA,FullyCum_Age10to19,FullyCum_Age20to29,FullyCum_Age30to39,FullyCum_Age40to49,FullyCum_Age50to59,FullyCum_Age60to69,FullyCum_Age70to79,FullyCum_80_,FullyCum_NA,FullyPer_Age20to29,FullyPer_Age30to39,FullyPer_Age40to49,FullyPer_Age50to59,FullyPer_Age60to69,FullyPer_Age70to79,FullyPer_80_,FullyPer_Age10to19&outSR=4326&f=json";
const urlCountry = "https://services1.arcgis.com/eNO7HHeQ3rUcBllm/arcgis/rest/services/Covid19CountyStatisticsHPSCIrelandOpenData/FeatureServer/0/query?where=1%3D1&outFields=CountyName,PopulationCensus16,ConfirmedCovidCases,PopulationProportionCovidCases&outSR=4326&f=json";
const x1 = new XMLHttpRequest();
const x2 = new XMLHttpRequest();

x1.onreadystatechange = function() {
    if (x1.readyState === 4 && x1.status === 200 ) {
         myFunction(x1.responseText);
 }   
}
x2.onreadystatechange = function() {
    if (x2.readyState === 4 && x2.status === 200) {
        myCountryFunction(x2.responseText);
    }
}

x1.open("GET", url, true);
x2.open("GET", urlCountry, true);
x1.send();
x2.send();

function myFunction(response) {

    let info = JSON.parse(response);
    let weekFeature = info.features;
    let len = weekFeature.length;

    function GetMaxWeek() {
        // get the latest week number
        let maxWeekInfo = weekFeature[len-1].attributes.Week;
        return parseInt(maxWeekInfo.slice(-2));
    }
    const maxWeek = GetMaxWeek();
    function totalDataUpToWeek(week){
    // calculate and return the total Vaccines up to the selected week
        let total = 0;
        for (let i = 1; i <= week; i++) {
            let weekData = weekFeature[i].attributes.TotalweeklyVaccines;
            total += weekData;
        }
        document.getElementById("totalV").innerHTML = total.toString();
   }

   function SetModernaInfo(week){
    // To set the Moderna vaccinations administered
         document.getElementById("Moderna").innerHTML = weekFeature[week].attributes.Moderna;
   }

   function SetPfizerInfo(week){
      // To set the Pfizer vaccinations administered
       document.getElementById("Pfizer").innerHTML= weekFeature[week].attributes.Pfizer;
   }

   function SetJanssenInfo(week){
      // To set the Janssen vaccinations administered
       document.getElementById("JanssenInfo").innerHTML =  weekFeature[week].attributes.Janssen;
   }

   function SetAstraZenecaInfo(week){
      // To set the AstraZeneca vaccinations administered
       document.getElementById("AstraZeneca").innerHTML = weekFeature[week].attributes.AstraZeneca;
   }

    function SetWeeklyInfo(week){
        let weekly = weekFeature[week].attributes.TotalweeklyVaccines;
        document.getElementById("weeklyInfo").innerHTML = weekly;
    }
    
    function defaultInfo(){
        // set the Total vaccination data, the weekly number of the latest week, the info of the four vaccines,
        // Then add a button listener to monitor the FullyNumber and Percentage button click event to display the default(latest week)info.
        setInfo(maxWeek);
        ButtonListen(maxWeek);

    }

    function setInfo(week){
        // Set and dis play the data of a certain week.
        // When related to age group info, firstly check what's the button selected and then display the info accordingly.
        let per = document.getElementById("Per");
        let Ful = document.getElementById("Fully");

        // window.getComputedStyle() is referred from https://developer.mozilla.org/zh-CN/docs/Web/API/Window/getComputedStyle
        let background_color_F = window.getComputedStyle(Ful, null).getPropertyValue("background-color");
        let background_color_P = window.getComputedStyle(per, null).getPropertyValue("background-color");
        document.getElementById("age_group_headline").innerHTML = "Total people fully vaccinated per age group up to week " + week.toString()+":";
        document.getElementById("totalWeekly").innerHTML = "Total weekly vaccinations administered(week " + week.toString()+"):";
        document.getElementById("upToWeek").innerHTML = "up to week " + week.toString();
        totalDataUpToWeek(week);
        SetWeeklyInfo(week);
        SetJanssenInfo(week);
        SetPfizerInfo(week);
        SetModernaInfo(week);
        SetAstraZenecaInfo(week);

        if(background_color_P === "rgb(100, 149, 237)" && background_color_F !== "rgb(100, 149, 237)") {
            setAgePercentage(week);
        }else{
            setAgeGroupNumber(week);
        }
    }
    
    function OnClickingApply() {
        // return the week selected from the dropdown window
        // setTimeout() is referred from https://developer.mozilla.org/zh-CN/docs/Web/API/setTimeout
        let input = document.getElementById("weekNum").value;
        let error = document.getElementById("error_message");
        if (! input){
            error.innerHTML = "Error: must input a certain week!";
            error.style.display = 'block';
            window.setTimeout(function(){error.style.display = "none";}, 1000);
        }
        else if (input > maxWeek){
            error.innerHTML = "Error: Your entered week must be less than the current week number!";
            error.style.display = "block";
            window.setTimeout(function(){error.style.display = "none";}, 1000);
        }
        else if ( ! Number.isInteger(parseFloat(input))){
            error.innerHTML = "Error: Your entered week must be an integer!";
            error.style.display = "block";
            window.setTimeout(function(){error.style.display = "none";}, 1000);
        }
        else if (input <= 0){
            error.innerHTML = "Error: week number must be a positive integer!";
            error.style.display = "block";
            window.setTimeout(function(){error.style.display = "none";}, 1000);
        }
        else{
            error.style.display = 'none';
            setInfo(input);
            ButtonListen(input);
        }
    }

    function ButtonListen(week){
        document.getElementById("Per").addEventListener("click", function (){OnClickingPercentage(week)})
        document.getElementById("Fully").addEventListener("click", function (){OnClickingFullyNum(week)})
    }

    function setAgeGroupNumber(week){
        document.getElementById("10-19").innerHTML = weekFeature[week].attributes.FullyCum_Age10to19;
        document.getElementById("20-29").innerHTML = weekFeature[week].attributes.FullyCum_Age20to29;
        document.getElementById("30-39").innerHTML = weekFeature[week].attributes.FullyCum_Age30to39;
        document.getElementById("40-49").innerHTML = weekFeature[week].attributes.FullyCum_Age40to49;
        document.getElementById("50-59").innerHTML = weekFeature[week].attributes.FullyCum_Age50to59;
        document.getElementById("60-69").innerHTML = weekFeature[week].attributes.FullyCum_Age60to69;
        document.getElementById("70-79").innerHTML = weekFeature[week].attributes.FullyCum_Age70to79;
        document.getElementById("above80").innerHTML = weekFeature[week].attributes.FullyCum_80_;
        document.getElementById("NA").innerHTML = weekFeature[week].attributes.FullyCum_NA
    }

    function setAgePercentage(week){
        document.getElementById("10-19").innerHTML = weekFeature[week].attributes.FullyPer_Age10to19.toFixed(4);
        document.getElementById("20-29").innerHTML = weekFeature[week].attributes.FullyPer_Age20to29.toFixed(4);
        document.getElementById("30-39").innerHTML = weekFeature[week].attributes.FullyPer_Age30to39.toFixed(4);
        document.getElementById("40-49").innerHTML = weekFeature[week].attributes.FullyPer_Age40to49.toFixed(4);
        document.getElementById("50-59").innerHTML = weekFeature[week].attributes.FullyPer_Age50to59.toFixed(4);
        document.getElementById("60-69").innerHTML = weekFeature[week].attributes.FullyPer_Age60to69.toFixed(4);
        document.getElementById("70-79").innerHTML = weekFeature[week].attributes.FullyPer_Age70to79.toFixed(4);
        document.getElementById("above80").innerHTML = weekFeature[week].attributes.FullyPer_80_.toFixed(4);
        document.getElementById("NA").innerHTML = "/"
    }
    
    function OnClickingFullyNum(week){
        //
        let per = document.getElementById("Per");
        let Ful = document.getElementById("Fully");
        let background_color_P = window.getComputedStyle(per, null).getPropertyValue("background-color");
        if(background_color_P === "rgb(100, 149, 237)") {
            per.style.backgroundColor = "lightgrey";
        }
        Ful.style.backgroundColor = "rgb(100, 149, 237)";
        setAgeGroupNumber(week);
    }

    function OnClickingPercentage(week){
        let per = document.getElementById("Per");
        let Ful = document.getElementById("Fully");
        let background_color_F = window.getComputedStyle(Ful, null).getPropertyValue("background-color");
        if(background_color_F === "rgb(100, 149, 237)") {
            Ful.style.backgroundColor = "lightgrey";
        }
        per.style.backgroundColor = "rgb(100, 149, 237)";
        setAgePercentage(week);
    }

    //The default info to display when open the webpage. 
    defaultInfo();
    
    //The info displayed on clicking the date-enter apply button. 
    document.getElementById("apply").onclick  = function(){OnClickingApply()};

}

function myCountryFunction(response){
    let info = JSON.parse(response);
    let countryInfo = info.features;

    function setCountryList(){
        // read the county name from the javascript object converted from the given json data.
        let ul = document.getElementById("CountryList");
        let len = countryInfo.length;
        let countyList = [];
        for (let i = 0; i < len; i++){
            let county = countryInfo[i].attributes.CountyName;
            if (! countyList.includes(county)){
                countyList.push(county);
            }
        }
        for (let i = 0; i < countyList.length; i++){
            let li = document.createElement("li");
            li.appendChild(document.createTextNode(countyList[i]))
            ul.appendChild(li);
        }
    }
    function iconDown(){
        // The icon function, change the icon and the display of the county name list.
        // on click the icon, the county list will be displayed or not displayed and the direction of the arrow changes.
        let icon = document.getElementById("chooseCountry");
        let list = document.getElementById("CountryList");
        let ListDisplay = window.getComputedStyle(list, null).getPropertyValue("display");
        if (ListDisplay === "none"){
            list.style.display = "block";
            icon.innerHTML = "&#8679";
        }
        else if (ListDisplay === "block"){
            list.style.display = "none";
            icon.innerHTML = "&#8681";
        }
        ChooseCountry();

    }
    function ChooseCountry(){
        //get the selected county element and display it in the window.
        //code referred from  https://morioh.com/p/beede024706e
        let items = document.querySelectorAll("#CountryList li");
        for (let i = 0; i< items.length; i++) {
            items[i].onclick = function(){
                document.getElementById("DisplayBox").innerHTML = this.innerHTML;
            }
        }
    }
    function ApplyClicking(){
        //this function specify the reactions when clicking apply button, these reactions are:
        //check the number of the child elements of County_info element,display a error message for one sec if the current number is greater than three;
        //call setCountyBox function if the child element is less than three.
        let CI = document.getElementById("Country_info");
        let ChildNUm = CI.childElementCount;
        let p = document.createElement("p");
        p.appendChild(document.createTextNode("Error: you can just input 3 counties at most."));
        p.style.display = "inline-block";
        p.style.fontSize = "2px";
        p.style.padding = "2px";
        p.style.color = "brown";
        p.style.backgroundColor = "bisque";
        p.style.padding = "5px";
        p.style.borderLeft = "4px solid brown";
        if (ChildNUm === 3){
            document.getElementById("showCountyBoard").appendChild(p);
            window.setTimeout(function(){deleteMessage()}, 1000);
            document.getElementById("CountryList").style.display = "none";
            document.getElementById("chooseCountry").innerHTML = "&#8681";
        }
        else {
            let displayBoxElement = document.getElementById("DisplayBox");
            document.getElementById("CountryList").style.display = "none";
            document.getElementById("chooseCountry").innerHTML = "&#8681";
            setCountyBox(displayBoxElement.innerHTML);
        }
        function deleteMessage(){
            document.getElementById("showCountyBoard").removeChild(p);
        }
    }
    function CountryCompare(){
        let countyNameList = []
        let countyCaseList = []
        for (let i = 0; i < countryInfo.length; i++){
            countyNameList.push(countryInfo[i].attributes.CountyName)
            countyCaseList.push(countryInfo[i].attributes.PopulationProportionCovidCases);
        }
        let mostCase = Math.max.apply(null, countyCaseList);
        let minCase = Math.min.apply(null, countyCaseList);
        let indexMost = countyCaseList.indexOf(mostCase);
        let indexMin = countyCaseList.indexOf(minCase);
        document.getElementById("most case").innerHTML = "&diams; " +"The county has the highest rate of COVID case is: "+"<span>"+countyNameList[indexMost]+"</span>";
        document.getElementById("less case").innerHTML = "&diams; " + "The county has the lowest rate of COVID case is: "+"<span>"+countyNameList[indexMin] + "</span>";
    }
    function setCountyBox(county){
        // set the county information display box
        // set the county name display button
        let divC = document.getElementById("Country_info");
        let CountySection = document.createElement("div");
        let h1 = document.createElement("h1");
        let ul = document.createElement("ul");

        let li1 = document.createElement("li");
        let span1 = document.createElement("span")
        li1.appendChild(document.createTextNode("Population: "));
        li1.appendChild(span1);

        let li2 = document.createElement("li");
        let span2 = document.createElement("span");
        li2.appendChild(document.createTextNode("Confirmed COVID Cases: "));
        li2.appendChild(span2);

        let li3 = document.createElement("li");
        let span3 = document.createElement("span");
        li3.appendChild(document.createTextNode("Population Proportional COVID Cases: "));
        li3.appendChild(span3);

        let li4 = document.createElement("li");
        let span4 = document.createElement("span");
        li4.appendChild(document.createTextNode("Cases per 100,000: "));
        li4.appendChild(span4);

        for (let i = 0; i < countryInfo.length; i++) {
            if (county === countryInfo[i].attributes.CountyName){
                span1.innerHTML = countryInfo[i].attributes.PopulationCensus16;
                span2.innerHTML = countryInfo[i].attributes.ConfirmedCovidCases;
                span3.innerHTML = countryInfo[i].attributes.PopulationProportionCovidCases;
                span4.innerHTML = Math.round(parseFloat(countryInfo[i].attributes.PopulationProportionCovidCases));
            }
        }
        li1.style.fontWeight = "bold";
        li2.style.fontWeight = "bold";
        li3.style.fontWeight = "bold";
        li4.style.fontWeight = "bold";
        span1.style.fontWeight = "lighter";
        span1.style.color = "cornflowerblue";
        span2.style.fontWeight = "lighter";
        span2.style.color = "cornflowerblue";
        span3.style.fontWeight = "lighter";
        span3.style.color = "cornflowerblue";
        span4.style.fontWeight = "lighter";
        span4.style.color = "cornflowerblue";
        ul.appendChild(li1);
        ul.appendChild(li2);
        ul.appendChild(li3);
        ul.appendChild(li4);
        h1.innerHTML = county;
        h1.style.marginLeft = "5%";
        h1.style.color = "cadetblue";
        CountySection.appendChild(h1);
        CountySection.appendChild(ul);
        divC.appendChild(CountySection);
        CountySection.style.backgroundColor = "beige";
        CountySection.style.display = "inline-block";
        CountySection.style.width = "31%";
        CountySection.style.marginTop = "20px";
        CountySection.style.marginLeft = "24px";
        AddSelectedCounty(county);
        CountryCompare();
        function AddSelectedCounty(countyName){
            // alert the county name button with a close icon to indicate which county has been selected.
            // the close icon is clickable, the display button will disappear on clicking it.
            let div = document.getElementById("showCountyBoard");
            let county = document.createElement("div");
            let span = document.createElement("span");
            span.innerHTML = "x";
            county.appendChild(span);
            county.appendChild(document.createTextNode(countyName));
            div.appendChild(county);
            span.style.padding = "5px";
            span.style.fontSize = "15px";
            span.style.marginRight = "3px";
            div.style.display = "inline-block";
            county.style.border = "1px solid black";
            county.style.fontSize = "13px";
            county.style.display = "inline";
            county.style.paddingRight = "4px";
            county.style.marginRight = "3px";
            span.onmouseover = function(){
                span.style.color = "brown";
                span.style.cursor = "pointer";
            }
            span.onmouseout = function(){
                span.style.color = "black";
            }
            span.onclick = function(){
                div.removeChild(county);
                divC.removeChild(CountySection);
            }

        }
    }

    document.getElementById("applyCountry").onclick = function(){ApplyClicking()};
    setCountryList();
    document.getElementById("chooseCountry").addEventListener("click", function() {iconDown()})
    setCountyBox("Dublin");
}



