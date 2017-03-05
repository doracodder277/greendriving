/**
 * Created by nizar on 23.09.2016.
 */


var struct = {

    //VE: ["VEAT"],
    ZWZ: ["ZW"],
    VIZ: ["VAR", "VAC", "VD", "VEAT", "VK", "VB1", "VB2","VB3", "VB5", "VB6", "VB7", "VB9G", "VB12", "VC"],
    ZM:["MNA","MK","MCA","MMG","MP","MS","MCL"],
    SEZ:["MFE","MZN","MCU","MMN","MF","MJ"],

    //(Eiweißzusammensetzung)
    ZE:{
        EEA: ["EILE", "ELEU", "ELYS", "EMET", "ECYS", "EPHE", "ETYR", "ETHR", "ETRP", "EVAL", "EARG", "EHIS"],
        ENA: ["EALA", "EASP", "EGLU", "EGLY", "EPRO", "ESER"],
        //Andere Eiweiße
        EWA: ["EH","EP"]
    },
    ZK:{
        KA: ["KAM", "KAS", "KAX"],
        KMD: {
            KM: ["KMT", "KMF", "KMG"],
            KD: ["KDS", "KDM", "KDL"],
        },
        KP: ["KPG", "KPS"],
        //andere Kohlenhydrate
        KHA: ["KPOR","KPON"]
    },
    //Ballaststoffzusammensetzung
    ZB: ["KBP","KBH","KBU","KBC","KBL"],
    //Optional
    //BZ:["KBW","KBN"],
    //Fette nach Saturierung
    ZF: {
        FS: ["F40", "F60", "F80", "F100", "F120", "F140", "F150", "F160", "F170", "F180", "F200", "F220", "F240"],
        FU: ["F141", "F151", "F161", "F171", "F181", "F201", "F221", "F241"],
        FP: {
            FO3: ["F183", "F184", "F205", "F225", "F226"],
            FO6: ["F182", "F202", "F203", "F204", "F222", "F223", "F224"],
            //Fette (andere polysaturierte)
            FAP: ["F162", "F164", "F193"]
        },
        //Fette andere TODO cholesterin is NOT a fat!
        FA: ["FG","FC"]
    }
    //Fette nach Kettigkeit
    /*FNK: {
        FK: ["F40", "F60"],
        FM: ["F80", "F100"]
        //
        FL: ["F120", "F140", "F150", "F160", "F170", "F180", "F141", "F151", "F161", "F171", "F181", "F162", "F164", "F182", "F183", "F184", "F200", "F220", "F240", "F201", "F221", "F241", "F193", "F202", "F203", "F204", "F205", "F222", "F223", "F224", "F225", "F226"],
        //Fette andere
        FA: ["FG","FC"]
    }*/
};
var nutrientStruct = {
    "ZW": {
        "depth": 0,
        "parent": "root"
    },
    "VIZ": {
        "parent": "root",
        "depth": 0
    },
    "VAR": {
        "depth": 1,
        "parent": "VIZ"
    },
    "VAC": {
        "depth": 1,
        "parent": "VIZ"
    },
    "VD": {
        "depth": 1,
        "parent": "VIZ"
    },
    "VEAT": {
        "depth": 1,
        "parent": "VIZ"
    },
    "VK": {
        "depth": 1,
        "parent": "VIZ"
    },
    "VB1": {
        "depth": 1,
        "parent": "VIZ"
    },
    "VB2": {
        "depth": 1,
        "parent": "VIZ"
    },
    "VB3": {
        "depth": 1,
        "parent": "VIZ"
    },
    "VB5": {
        "depth": 1,
        "parent": "VIZ"
    },
    "VB6": {
        "depth": 1,
        "parent": "VIZ"
    },
    "VB7": {
        "depth": 1,
        "parent": "VIZ"
    },
    "VB9G": {
        "depth": 1,
        "parent": "VIZ"
    },
    "VB12": {
        "depth": 1,
        "parent": "VIZ"
    },
    "VC": {
        "depth": 1,
        "parent": "VIZ"
    },
    "ZM": {
        "parent": "root",
        "depth": 0
    },
    "MNA": {
        "depth": 1,
        "parent": "ZM"
    },
    "MK": {
        "depth": 1,
        "parent": "ZM"
    },
    "MCA": {
        "depth": 1,
        "parent": "ZM"
    },
    "MMG": {
        "depth": 1,
        "parent": "ZM"
    },
    "MP": {
        "depth": 1,
        "parent": "ZM"
    },
    "MS": {
        "depth": 1,
        "parent": "ZM"
    },
    "MCL": {
        "depth": 1,
        "parent": "ZM"
    },
    "SEZ": {
        "parent": "root",
        "depth": 0
    },
    "MFE": {
        "depth": 1,
        "parent": "SEZ"
    },
    "MZN": {
        "depth": 1,
        "parent": "SEZ"
    },
    "MCU": {
        "depth": 1,
        "parent": "SEZ"
    },
    "MMN": {
        "depth": 1,
        "parent": "SEZ"
    },
    "MF": {
        "depth": 1,
        "parent": "SEZ"
    },
    "MJ": {
        "depth": 1,
        "parent": "SEZ"
    },
    "ZE": {
        "parent": "root",
        "depth": 0,
        "value": {
            "EEA": [
                "EILE",
                "ELEU",
                "ELYS",
                "EMET",
                "ECYS",
                "EPHE",
                "ETYR",
                "ETHR",
                "ETRP",
                "EVAL",
                "EARG",
                "EHIS"
            ],
            "ENA": [
                "EALA",
                "EASP",
                "EGLU",
                "EGLY",
                "EPRO",
                "ESER"
            ],
            "EWA": [
                "EH",
                "EP"
            ]
        }
    },
    "EEA": {
        "parent": "ZE",
        "depth": 1
    },
    "EILE": {
        "depth": 2,
        "parent": "EEA"
    },
    "ELEU": {
        "depth": 2,
        "parent": "EEA"
    },
    "ELYS": {
        "depth": 2,
        "parent": "EEA"
    },
    "EMET": {
        "depth": 2,
        "parent": "EEA"
    },
    "ECYS": {
        "depth": 2,
        "parent": "EEA"
    },
    "EPHE": {
        "depth": 2,
        "parent": "EEA"
    },
    "ETYR": {
        "depth": 2,
        "parent": "EEA"
    },
    "ETHR": {
        "depth": 2,
        "parent": "EEA"
    },
    "ETRP": {
        "depth": 2,
        "parent": "EEA"
    },
    "EVAL": {
        "depth": 2,
        "parent": "EEA"
    },
    "EARG": {
        "depth": 2,
        "parent": "EEA"
    },
    "EHIS": {
        "depth": 2,
        "parent": "EEA"
    },
    "ENA": {
        "parent": "ZE",
        "depth": 1
    },
    "EALA": {
        "depth": 2,
        "parent": "ENA"
    },
    "EASP": {
        "depth": 2,
        "parent": "ENA"
    },
    "EGLU": {
        "depth": 2,
        "parent": "ENA"
    },
    "EGLY": {
        "depth": 2,
        "parent": "ENA"
    },
    "EPRO": {
        "depth": 2,
        "parent": "ENA"
    },
    "ESER": {
        "depth": 2,
        "parent": "ENA"
    },
    "EWA": {
        "parent": "ZE",
        "depth": 1
    },
    "EH": {
        "depth": 2,
        "parent": "EWA"
    },
    "EP": {
        "depth": 2,
        "parent": "EWA"
    },
    "ZK": {
        "parent": "root",
        "depth": 0,
        "value": {
            "KA": [
                "KAM",
                "KAS",
                "KAX"
            ],
            "KMD": {
                "KM": [
                    "KMT",
                    "KMF",
                    "KMG"
                ],
                "KD": [
                    "KDS",
                    "KDM",
                    "KDL"
                ]
            },
            "KP": [
                "KPG",
                "KPS"
            ],
            "KHA": [
                "KPOR",
                "KPON"
            ]
        }
    },
    "KA": {
        "parent": "ZK",
        "depth": 1
    },
    "KAM": {
        "depth": 2,
        "parent": "KA"
    },
    "KAS": {
        "depth": 2,
        "parent": "KA"
    },
    "KAX": {
        "depth": 2,
        "parent": "KA"
    },
    "KMD": {
        "parent": "ZK",
        "depth": 1,
        "value": {
            "KM": [
                "KMT",
                "KMF",
                "KMG"
            ],
            "KD": [
                "KDS",
                "KDM",
                "KDL"
            ]
        }
    },
    "KM": {
        "parent": "KMD",
        "depth": 2
    },
    "KMT": {
        "depth": 3,
        "parent": "KM"
    },
    "KMF": {
        "depth": 3,
        "parent": "KM"
    },
    "KMG": {
        "depth": 3,
        "parent": "KM"
    },
    "KD": {
        "parent": "KMD",
        "depth": 2
    },
    "KDS": {
        "depth": 3,
        "parent": "KD"
    },
    "KDM": {
        "depth": 3,
        "parent": "KD"
    },
    "KDL": {
        "depth": 3,
        "parent": "KD"
    },
    "KP": {
        "parent": "ZK",
        "depth": 1
    },
    "KPG": {
        "depth": 2,
        "parent": "KP"
    },
    "KPS": {
        "depth": 2,
        "parent": "KP"
    },
    "KHA": {
        "parent": "ZK",
        "depth": 1
    },
    "KPOR": {
        "depth": 2,
        "parent": "KHA"
    },
    "KPON": {
        "depth": 2,
        "parent": "KHA"
    },
    "ZB": {
        "parent": "root",
        "depth": 0
    },
    "KBP": {
        "depth": 1,
        "parent": "ZB"
    },
    "KBH": {
        "depth": 1,
        "parent": "ZB"
    },
    "KBU": {
        "depth": 1,
        "parent": "ZB"
    },
    "KBC": {
        "depth": 1,
        "parent": "ZB"
    },
    "KBL": {
        "depth": 1,
        "parent": "ZB"
    },
    "ZF": {
        "parent": "root",
        "depth": 0,
        "value": {
            "FS": [
                "F40",
                "F60",
                "F80",
                "F100",
                "F120",
                "F140",
                "F150",
                "F160",
                "F170",
                "F180",
                "F200",
                "F220",
                "F240"
            ],
            "FU": [
                "F141",
                "F151",
                "F161",
                "F171",
                "F181",
                "F201",
                "F221",
                "F241"
            ],
            "FP": {
                "FO3": [
                    "F183",
                    "F184",
                    "F205",
                    "F225",
                    "F226"
                ],
                "FO6": [
                    "F182",
                    "F202",
                    "F203",
                    "F204",
                    "F222",
                    "F223",
                    "F224"
                ],
                "FAP": [
                    "F162",
                    "F164",
                    "F193"
                ]
            },
            "FA": [
                "FG",
                "FC"
            ]
        }
    },
    "FS": {
        "parent": "ZF",
        "depth": 1
    },
    "F40": {
        "depth": 2,
        "parent": "FS"
    },
    "F60": {
        "depth": 2,
        "parent": "FS"
    },
    "F80": {
        "depth": 2,
        "parent": "FS"
    },
    "F100": {
        "depth": 2,
        "parent": "FS"
    },
    "F120": {
        "depth": 2,
        "parent": "FS"
    },
    "F140": {
        "depth": 2,
        "parent": "FS"
    },
    "F150": {
        "depth": 2,
        "parent": "FS"
    },
    "F160": {
        "depth": 2,
        "parent": "FS"
    },
    "F170": {
        "depth": 2,
        "parent": "FS"
    },
    "F180": {
        "depth": 2,
        "parent": "FS"
    },
    "F200": {
        "depth": 2,
        "parent": "FS"
    },
    "F220": {
        "depth": 2,
        "parent": "FS"
    },
    "F240": {
        "depth": 2,
        "parent": "FS"
    },
    "FU": {
        "parent": "ZF",
        "depth": 1
    },
    "F141": {
        "depth": 2,
        "parent": "FU"
    },
    "F151": {
        "depth": 2,
        "parent": "FU"
    },
    "F161": {
        "depth": 2,
        "parent": "FU"
    },
    "F171": {
        "depth": 2,
        "parent": "FU"
    },
    "F181": {
        "depth": 2,
        "parent": "FU"
    },
    "F201": {
        "depth": 2,
        "parent": "FU"
    },
    "F221": {
        "depth": 2,
        "parent": "FU"
    },
    "F241": {
        "depth": 2,
        "parent": "FU"
    },
    "FP": {
        "parent": "ZF",
        "depth": 1,
        "value": {
            "FO3": [
                "F183",
                "F184",
                "F205",
                "F225",
                "F226"
            ],
            "FO6": [
                "F182",
                "F202",
                "F203",
                "F204",
                "F222",
                "F223",
                "F224"
            ],
            "FAP": [
                "F162",
                "F164",
                "F193"
            ]
        }
    },
    "FO3": {
        "parent": "FP",
        "depth": 2
    },
    "F183": {
        "depth": 3,
        "parent": "FO3"
    },
    "F184": {
        "depth": 3,
        "parent": "FO3"
    },
    "F205": {
        "depth": 3,
        "parent": "FO3"
    },
    "F225": {
        "depth": 3,
        "parent": "FO3"
    },
    "F226": {
        "depth": 3,
        "parent": "FO3"
    },
    "FO6": {
        "parent": "FP",
        "depth": 2
    },
    "F182": {
        "depth": 3,
        "parent": "FO6"
    },
    "F202": {
        "depth": 3,
        "parent": "FO6"
    },
    "F203": {
        "depth": 3,
        "parent": "FO6"
    },
    "F204": {
        "depth": 3,
        "parent": "FO6"
    },
    "F222": {
        "depth": 3,
        "parent": "FO6"
    },
    "F223": {
        "depth": 3,
        "parent": "FO6"
    },
    "F224": {
        "depth": 3,
        "parent": "FO6"
    },
    "FAP": {
        "parent": "FP",
        "depth": 2
    },
    "F162": {
        "depth": 3,
        "parent": "FAP"
    },
    "F164": {
        "depth": 3,
        "parent": "FAP"
    },
    "F193": {
        "depth": 3,
        "parent": "FAP"
    },
    "FA": {
        "parent": "ZF",
        "depth": 1
    },
    "FG": {
        "depth": 2,
        "parent": "FA"
    },
    "FC": {
        "depth": 2,
        "parent": "FA"
    }
};
generateRelationalStrcuct = function (structure, result, depth, parent) {
    for(var t in structure)
    {
        result[t] = {};
        value = structure[t];
        result[t].parent = parent;
        result[t].depth = depth;
        if(!(value instanceof Array))
        {
            result[t].value = value;
            generateRelationalStrcuct(value, result, depth +1, t);
        }
        else
        {
            for(var elem of value)
            {
                result[elem] = {};
                result[elem].depth = depth +1;
                result[elem].parent = t;
            }

        }
    }
    return result;

}
//addNode(result, "", struct);
// Dimensions of sunburst.
var width = 900;
var height = 600;
var radius = Math.min(width, height) / 2;
var chartColors = {
    "T" :"#BC5F86",
    "ZW" : "#729DBF",
    "ZWZ" : "#729DBF",
    "VIZ": "#bf8372",
    "VAR": "#bf8372",
    "VAC": "#bf7472",
    "VD": "#bf7672",
    "VEAT": "#72bf91",
    "VK": "#72bf96",
    "VB1": "#72bfbc",
    "VB2": "#bfb072",
    "VB3": "#9f72bf",
    "VB5": "#bf9072",
    "VB6": "#7293bf",
    "VB7": "#7296bf",
    "VB9G": "#bf72a4",
    "VB12": "#7d72bf",
    "VC": "#72bfa5",
    "ZM": "#bf7972",
    "MNA": "#bf7972",
    "MK": "#bf8372",
    "MCA": "#9bbf72",
    "MMG": "#b672bf",
    "MP": "#b1bf72",
    "MS": "#8972bf",
    "MCL": "#bfba72",
    "SEZ": "#72bfa5",
    "MFE": "#72bfa5",
    "MZN": "#b172bf",
    "MCU": "#8ebf72",
    "MMN": "#8cbf72",
    "MF": "#7572bf",
    "MJ": "#84bf72",
    "ZE": "#BFB072",
    "EEA": "#7299bf",
    "EILE": "#7299bf",
    "ELEU": "#bf7297",
    "ELYS": "#72bf8a",
    "EMET": "#bfb872",
    "ECYS": "#72bf99",
    "EPHE": "#7289bf",
    "ETYR": "#7872bf",
    "ETHR": "#bf9472",
    "ETRP": "#9b72bf",
    "EVAL": "#72bf91",
    "EARG": "#72bf88",
    "EHIS": "#b9bf72",
    "ENA": "#bf729f",
    "EALA": "#bf729f",
    "EASP": "#bfb272",
    "EGLU": "#bfae72",
    "EGLY": "#bf729a",
    "EPRO": "#7276bf",
    "ESER": "#bf72b0",
    "EWA": "#72bf98",
    "EH": "#72bf98",
    "EP": "#b972bf",
    "ZK": "#bf7972",
    "KA": "#bf7972",
    "KAM": "#bf7972",
    "KAS": "#72bf76",
    "KAX": "#72bf94",
    "KMD": "#bf8572",
    "KM": "#bf8572",
    "KMT": "#bf8572",
    "KMF": "#bf7297",
    "KMG": "#bfbc72",
    "KD": "#bfa372",
    "KDS": "#bfa372",
    "KDM": "#7289bf",
    "KDL": "#bfb372",
    "KP": "#bf9072",
    "KPG": "#bf9072",
    "KPS": "#81bf72",
    "KHA": "#72bfb6",
    "KPOR": "#72bfb6",
    "KPON": "#72b4bf",
    "ZB": "#bf8372",
    "KBP": "#bf8372",
    "KBH": "#9172bf",
    "KBU": "#bfb572",
    "KBC": "#727abf",
    "KBL": "#72bcbf",
    "ZF": "#82bf72",
    "FS": "#82bf72",
    "F40": "#82bf72",
    "F60": "#bf7c72",
    "F80": "#7572bf",
    "F100": "#7278bf",
    "F120": "#bf7283",
    "F140": "#7572bf",
    "F150": "#bf72a3",
    "F160": "#bf729f",
    "F170": "#a772bf",
    "F180": "#aebf72",
    "F200": "#bfbf72",
    "F220": "#72bf83",
    "F240": "#8b72bf",
    "FU": "#bf7672",
    "F141": "#bf7672",
    "F151": "#7294bf",
    "F161": "#9572bf",
    "F171": "#73bf72",
    "F181": "#bf7972",
    "F201": "#72bf7d",
    "F221": "#b9bf72",
    "F241": "#7772bf",
    "FP": "#72bf96",
    "FO3": "#72bf96",
    "F183": "#72bf96",
    "F184": "#8772bf",
    "F205": "#9372bf",
    "F225": "#72afbf",
    "F226": "#728cbf",
    "FO6": "#72a7bf",
    "F182": "#72a7bf",
    "F202": "#72bf91",
    "F203": "#bf72b0",
    "F204": "#7289bf",
    "F222": "#72bf96",
    "F223": "#bf7290",
    "F224": "#bf9e72",
    "FAP": "#7276bf",
    "F162": "#7276bf",
    "F164": "#9fbf72",
    "F193": "#7296bf",
    "FA": "#7772bf",
    "FG": "#7772bf",
    "FC": "#aebf72"
};
var b = {
    w: 200, h: 30, s: 3, t: 10
};

var result = {};

var  colorgen = function (val, relative) {
    var children = 0;
    if(Array.isArray(val)){
        //calcule sum and generate nodes
        for(var k in val)
        {
            relative[val[k]] = {};
            relative[val[k]]["directChildren"] = 0;
        }
        relative["directChildren"] = val.length;

    }
    //generate nodes
    else {
        var sum = 0;
        for(var k in val)
        {
            relative[k] = {};
            colorgen(val[k], relative[k]);
            sum++;
        }
        relative["directChildren"] = sum;
    }
    return children;
}

var myCols={};
var  colorgenerator = function (val, parentColor) {
    var children = val.directChildren;
    var basecolor = parentColor != undefined ? parentColor : "F0FFFF";
    var colors =  Please.make_color({
                    golden: true,
                    full_random: true,
                    colors_returned: children,
                    format: 'hex'});

    if(Array.isArray(val)){
        //calcule sum and generate nodes
        for(var k in val)
        {
            myCols[val[k]] = colors[counter];
        }

    }
    //generate nodes
    else {
        var counter = 0;
        for(var k in val)
        {
            myCols[k] = colors[counter];
            colorgenerator(val[k], myCols[k]);
            counter++;
        }
    }
    return children;
}

getParents=function (structure, t) {
    var parents = [];
    var parent = structure[t].parent;
    while(parent != "root" )
    {
        parents.push(parent);
        parent = structure[parent].parent;
    }
    return parents;
}


