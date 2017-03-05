/**
 * Created by zernicke on 11.09.2015.
 */


window.enums.FitnessActivityMainCategory.resolve = function(value, target) {
    var ownResolvedId = "fitnessActivityMainCategory_" + target + "_" + value.toLowerCase();
    return window.resourceResolver.resolve(ownResolvedId);
}
;
window.enums.HighLevelGoalType.resolve = function(value, target) {
    var ownResolvedId = "highLevelGoalType_" + target + "_" + value.toLowerCase();
    return window.resourceResolver.resolve(ownResolvedId);
}
;
//Enum Resolver
window.enums.DataField.resolve = function(value, target) {
    var ownResolvedId = "dataField_" + target + "_" + value.toLowerCase();
    return window.resourceResolver.resolve(ownResolvedId);
}
;
window.enums.FitnessActivity.resolve = function(value, target) {
    var ownResolvedId = "fitnessActivity_" + target + "_" + value.toLowerCase();
    return window.resourceResolver.resolve(ownResolvedId);
}
;
window.enums.Nutrient.resolve = function(value, target) {
    if (window.DefaultResolutionSemantics.unit === target) {
        return window.enums.DataField.resolve(window.enums.Nutrient.properties[value]["unit"], target);
    }
    var ownResolvedId = "nutrient_" + target + "_" + value.toLowerCase();
    return window.resourceResolver.resolve(ownResolvedId);
}
;
window.enums.AtomicAggregateDataType.resolve = function(value, target) {
    var thisEnum = window.enums.AtomicAggregateDataType;
    if (value === thisEnum.FOOD_AMOUNT) {
        if (window.DefaultResolutionSemantics.unit === target) {
            return window.enums.DataField.resolve(window.enums.DataField.WEIGHT, target);
        }
        if (window.DefaultResolutionSemantics.name === target) {
            return window.enums.AtomicDataType.resolve(window.enums.AtomicDataType.POWER_SAMPLE, target);
        }
        //all other properties emunlate calories burned (e.g. the icon)
        return thisEnum.resolve(thisEnum.NUTRIENT_CALORIES_SUMMARY, target);
    }
    if (window.DefaultResolutionSemantics.name === target) {
        return window.enums.AtomicDataType.resolve(thisEnum.properties[value]["baseType"], target);
    }
    if (window.DefaultResolutionSemantics.unit === target) {
        var parentField = thisEnum.properties["parentField"];
        if (parentField === window.enums.DataField.NUTRIENTS) {
            return window.enums.Nutrient.resolve(thisEnum.properties[value]["nutrient"], target);
        } else {
            return window.enums.DataField.resolve(thisEnum.properties[value]["parentField"], target);
        }
    }
    var ownResolvedId = "atomicAggregateDataType_" + target + "_" + value.toLowerCase();
    return window.resourceResolver.resolve(ownResolvedId);
}
;
window.enums.DailyTimeslot.resolve = function(value, target) {
    var ownResolvedId = "dailyTimeslot_" + target + "_" + value.toLowerCase();
    return window.resourceResolver.resolve(ownResolvedId);
}
;
window.enums.DataScope.resolve = function(value, target) {
    var ownResolvedId = "dataScope_" + target + "_" + value.toLowerCase();
    return window.resourceResolver.resolve(ownResolvedId);
}
;
window.enums.AtomicDataType.resolve = function(value, target) {
    var thisEnum = window.enums.AtomicDataType;
    var ownResolvedId = "atomicDataType_" + target + "_" + value.toLowerCase();
    if (window.DefaultResolutionSemantics.name === target) {
        return window.resourceResolver.resolve(ownResolvedId);
    }
    var defaultAggregation = thisEnum.properties[value]["defaultAggregation"];
    if (defaultAggregation) {
        return window.enums.AtomicAggregateDataType.resolve(defaultAggregation, target);
    }
    return window.resourceResolver.resolve(ownResolvedId);
}
;
window.enums.ScopedData.resolve = function(value, target) {
    var thisEnum = window.enums.ScopedData;
    var props = thisEnum.properties[value];
    if (window.DefaultResolutionSemantics.color === target) {
        var ownResolvedId = "scopedField_" + target + "_" + props["name"].toLowerCase();
        return window.resourceResolver.resolve(ownResolvedId);
    }
    
    if (window.DefaultResolutionSemantics.unit === target) {
        return window.enums.DataField.resolve(props["field"], target);
    }
    
    if (window.DefaultResolutionSemantics.verb === target || "infinitive" === target) {
        return window.enums.AtomicAggregateDataType.resolve(props.parent, target);
    }
    
    //    return (filter==null ? parent.getIdentifier(semantic) : filter.getIdentifier(semantic));
    if (props.filter) {
        return window.enums[props.identifierType].resolve(props.filter, target);
    } else {
        return window.enums.AtomicAggregateDataType.resolve(props.parent, target);
    }

}
;

window.enums.FilteredDataType.resolve = function(value, target) {
    var thisEnum = window.enums.FilteredDataType;
    var props = thisEnum.properties[value];
    if (window.DefaultResolutionSemantics.color === target) {
        var ownResolvedId = "scopedField_" + target + "_" + props["name"].toLowerCase();
        return window.resourceResolver.resolve(ownResolvedId);
    }

    if (window.DefaultResolutionSemantics.unit === target) {
        return window.enums.DataField.resolve(props["field"], target);
    }

    if (window.DefaultResolutionSemantics.verb === target || "infinitive" === target) {
        return window.enums.AtomicAggregateDataType.resolve(props.parent, target);
    }

    //    return (filter==null ? parent.getIdentifier(semantic) : filter.getIdentifier(semantic));
    if (props.filter) {
        return window.enums[props.identifierType].resolve(props.filter, target);
    } else {
        return window.enums.AtomicAggregateDataType.resolve(props.parent, target);
    }

}
;

window.enums.TimeResolution.resolve = function(value, target) {
    var ownResolvedId = "timeResolution_" + target + "_" + value.toLowerCase();
    return window.resourceResolver.resolve(ownResolvedId);
}
;
//DOC of all resource resolutions (copied from java code):
//new AndroidArrayResourceResolution(AndroidResourceType.STRING,ProfileProperty.class,DefaultResolutionSemantics.NAME,ProfileProperty.values().length,R.array.profileProperty_name),
//    new AndroidArrayResourceResolution(AndroidResourceType.STRING,ProfileProperty.class,DefaultResolutionSemantics.UNSET,ProfileProperty.values().length,R.array.profileProperty_unsetString),
//    new AndroidArrayResourceResolution(AndroidResourceType.STRING,ProfileProperty.class,DefaultResolutionSemantics.UNIT,ProfileProperty.values().length,R.array.profileProperty_unit),
//
//    new AndroidArrayResourceResolution(AndroidResourceType.STRING,PALCategory.class,SEMANTIC_PAL_WORK_NAME,PALCategory.values().length,R.array.pal_categories_work_array),
//    new AndroidArrayResourceResolution(AndroidResourceType.STRING,PALCategory.class,SEMANTIC_PAL_LEISURE_NAME,PALCategory.values().length,R.array.pal_categories_leisure_array),
//    new AndroidArrayResourceResolution(AndroidResourceType.STRING,PALCategory_Training.class,SEMANTIC_PAL_TRAINING_NAME,PALCategory_Training.values().length,R.array.pal_categories_training_array),
//
//    new AndroidArrayResourceResolution(AndroidResourceType.STRING,LifeCircumstances.class,DefaultResolutionSemantics.NAME,LifeCircumstances.values().length,R.array.circumstances_array),
//
//    new AndroidArrayResourceResolution(AndroidResourceType.STRING,Gender.class,DefaultResolutionSemantics.NAME,Gender.values().length,R.array.gender_biological_array),
//
//    //FIXME move to Atomic datatypes
//    new AndroidArrayResourceResolution(AndroidResourceType.STRING,ComplexUHMDataType.class,DefaultResolutionSemantics.NAME,ComplexUHMDataType.values().length,R.array.datatype_name),
//
//    new AndroidArrayResourceResolution(AndroidResourceType.STRING,TimeResolution.class,SEMANTIC_FINE_DATE_FORMAT,TimeResolution.values().length,R.array.timeResolution_fine_date_format),
//
//    new AndroidArrayResourceResolution(AndroidResourceType.STRING,DataField.class,DefaultResolutionSemantics.DESCRIPTION,DataField.values().length,R.array.field_desc),
//    // Resolution for resolving a DataField to a name of type String
//    new AndroidArrayResourceResolution(AndroidResourceType.STRING,DataField.class,DefaultResolutionSemantics.NAME,DataField.values().length,R.array.dataField_name),
//    // Resolution for resolving a DataField to a icon-glyph of type String
//    new AndroidArrayResourceResolution(AndroidResourceType.STRING,DataField.class,DefaultResolutionSemantics.ICON_GLYPH,DataField.values().length,R.array.dataField_icon_glyph),
//    // Resolution for resolving a DataField to a unit of type String
//    new AndroidArrayResourceResolution(AndroidResourceType.STRING,DataField.class,DefaultResolutionSemantics.UNIT,DataField.values().length,R.array.dataField_unit),
//
//    // Resolution for resolving a FitnessActivity to a name of type String
//    new AndroidArrayResourceResolution(AndroidResourceType.STRING,FitnessActivity.class,DefaultResolutionSemantics.NAME,FitnessActivity.values().length,R.array.fitnessActivity_name),
//    // Resolution for resolving a FitnessActivity to a icon-glyph of type String
//    new AndroidArrayResourceResolution(AndroidResourceType.STRING,FitnessActivity.class,DefaultResolutionSemantics.ICON_GLYPH,FitnessActivity.values().length,R.array.fitnessActivity_icon_glyph),
//
//    // Resolution for resolving a Nutrient to a name of type String
//    new AndroidArrayResourceResolution(AndroidResourceType.STRING,Nutrient.class,DefaultResolutionSemantics.NAME,Nutrient.values().length,R.array.nutrient_name),
//    // Resolution for resolving a Nutrient to a icon-glyph of type String
//    new AndroidArrayResourceResolution(AndroidResourceType.STRING,Nutrient.class,DefaultResolutionSemantics.ICON_GLYPH,Nutrient.values().length,R.array.nutrient_icon_glyph),
//
//    // Resolution for resolving a AtomicAggregateDataType to a icon-glyph of type String
//    new AndroidArrayResourceResolution(AndroidResourceType.STRING,AtomicAggregateDataType.class,DefaultResolutionSemantics.ICON_GLYPH,AtomicAggregateDataType.values().length,R.array.atomicAggregateDataType_icon_glyph),
//    // Resolution for resolving a AtomicAggregateDataType to a verb of type String
//    new AndroidArrayResourceResolution(AndroidResourceType.STRING,AtomicAggregateDataType.class,DefaultResolutionSemantics.VERB,AtomicAggregateDataType.values().length,R.array.atomicAggregateDataType_verb),
//
//    // Resolution for resolving a DailyTimeslot to a name of type String
//    new AndroidArrayResourceResolution(AndroidResourceType.STRING,DailyTimeslot.class,DefaultResolutionSemantics.NAME,DailyTimeslot.values().length,R.array.dailyTimeslot_name),
//    // Resolution for resolving a DailyTimeslot to a icon-glyph of type String
//    new AndroidArrayResourceResolution(AndroidResourceType.STRING,DailyTimeslot.class,DefaultResolutionSemantics.ICON_GLYPH,DailyTimeslot.values().length,R.array.dailyTimeslot_icon_glyph),
//
//    // Resolution for resolving a DataScope to a name of type String
//    new AndroidArrayResourceResolution(AndroidResourceType.STRING,DataScope.class,DefaultResolutionSemantics.NAME,DataScope.values().length,R.array.dataScope_name),
//
//    // Resolution for resolving a AtomicDataType to a name of type String
//    new AndroidArrayResourceResolution(AndroidResourceType.STRING,AtomicDataType.class,DefaultResolutionSemantics.NAME,AtomicDataType.values().length,R.array.atomicDataType_name),
