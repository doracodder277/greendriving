var config1 = liquidFillGaugeDefaultSettings();
config1.circleColor = "#e57373";
config1.textColor = "#e57373";
config1.waveTextColor = "#ffcdd2";
config1.waveColor = "#e57373";
config1.waveHeight = 0;

var config2 = liquidFillGaugeDefaultSettings();
config2.circleColor = "#F8B551";
config2.textColor = "#F8B551";
config2.waveTextColor = "#FCE1B9";
config2.waveColor = "#F8B551";
config2.waveHeight = 0;

var config3 = liquidFillGaugeDefaultSettings();
config3.circleColor = "#7e57c2";
config3.textColor = "#7e57c2";
config3.waveTextColor = "#d1c4e9";
config3.waveColor = "#7e57c2";
config3.waveHeight = 0;

//Green
var config4 = liquidFillGaugeDefaultSettings();
config4.circleColor = "#008D87";
config4.textColor = "#008D87";
config4.waveTextColor = "#BFE2E1";
config4.waveColor = "#008D87";
config4.waveHeight = 0;

//Braun
var config5 = liquidFillGaugeDefaultSettings();
config5.circleColor = "#bb9797";
config5.textColor = "#bb9797";
config5.waveTextColor = "#ddcbcb";
config5.waveColor = "#bb9797";
config1.waveHeight = 0;
window.chartsConfigs = [];
window.chartsConfigs["green"] = config4;
window.chartsConfigs["lila"] = config3;
window.chartsConfigs["red"] = config1;

//Blue
var config6 = liquidFillGaugeDefaultSettings();
config6.waveAnimateTime = 1000;
//Nutrition
var gauge1 = loadLiquidFillGauge("calories-ctr", 55, config1);
var gauge2 = loadLiquidFillGauge("fat-ctr", 55, config2);
var gauge6 = loadLiquidFillGauge("dietary-ctr", 55, config4);
var gauge4 = loadLiquidFillGauge("carbohydrates-ctr", 55, config5);
var gauge5 = loadLiquidFillGauge("water-ctr", 55,config6);
var gauge3 = loadLiquidFillGauge("protein-ctr", 55, config3);

//Activity
var gauge10 = loadLiquidFillGauge("stepsCount-ctr", 55, config1);
var gauge7 = loadLiquidFillGauge("distance-ctr", 55, config2);
var gauge8 = loadLiquidFillGauge("duration-ctr", 55, config3);
var gauge9 = loadLiquidFillGauge("energy-ctr", 55, config4);

window.referenceViews = {
    "Calories (Kcal)": gauge1,
    "Total fat": gauge2,
    "Protein": gauge3,
    "Carbohydrates": gauge4,
    "Water": gauge5,
    "Dietary fiber": gauge6,
    "stepsCount": gauge10,
    "distance": gauge7,
    "duration": gauge8,
    "energy": gauge9
};
window.dataReferences = {
    "Calories (Kcal)": "CCT",
    "Total fat": "ACF",
    "Protein": "ACP",
    "Carbohydrates": "ACCA",
    "Water": "ACW",
    "Dietary fiber": "ACI",
    "stepsCount": "STT",
    "distance": "DIT",
    "duration": "DUT",
    "energy": "CET"
};

window.updateReferences = function() 
{
    $.each(window.dataReferences, function(k, v) 
    {
        var referencePlan = window.clientPlans.where({
            dataType: v
        });
        $("#" + v + "-ref").html(window.reference[k].toFixed(2));
        if (referencePlan == undefined)
            return;
        $.each(referencePlan, function(k1, v1) 
        {
            if (v1.get("finePlanUuid") == undefined) 
            {
                
                window.reference[k] = parseFloat(v1.get("targetValue"));
                $("#" + v + "-ref").html(window.reference[k].toFixed(2));
                return;
            }
        });
    
    });


}

window.reference = {
    "duration": 60,
    "stepsCount": 10000,
    "distance": 1000,
    "energy": 1000,
    "Calories (Kcal)": 2000,
    "Total fat": 65,
    "Water": 2000,
    "Protein": 50,
    "Carbohydrates": 250,
    "Dietary fiber": 40
}

window.initReferenceViews = function() 
{
    for (var ref in window.referenceViews) 
    {
        window.referenceViews[ref].update(0);
    }
}

window.initReferenceViews();



