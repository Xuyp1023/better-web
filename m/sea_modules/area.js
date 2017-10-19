define(function(require, exports, module) {
    exports.writeArea = function(select, data) {
        var tmp = select.children(":first").html() || '请选择',
            selected = "";
        tmp = '<option value="0">' + tmp + '</option>';
        $.each(data, function(i, v) {
            // if (v.regionId == defaultVal || v.regionName == defaultVal) {
            //     selected = " selected";
            // } else {
            //     selected = "";
            // }
            tmp += '<option value="' + v.regionId + '">' + v.regionName + '</option>';
        });
        select.html(tmp);
    };

    exports.getArea = function(province, city, area, defaultProvince, defaultCity, defaultArea) {
        if (!province) return;
        var
            othis = this,
            province = province || "select[name='province']",
            $province = $(province),
            city = city || $province.next("select"),
            $city = $(city),
            area = area || $city.next("select"),
            $area = $(area); 
        $province.on("change", function() {
            var $t = $(this);
            if ($t.val() != "0") {
                $.get("findRegion.do", {parentId: $t.val()}, function(data) {
                    othis.writeArea($city, data);                    
                }, "json");
            }
            $city.trigger("change");
        });
        $city.on("change", function() {
            var $t = $(this);
            if ($t.val() != "0") {
                $.get("findRegion.do", {parentId: $t.val()}, function(data) {
                    othis.writeArea($area, data);
                }, "json");
            }
        });
        if(defaultProvince) {
            $province.children(":contains('" + defaultProvince + "')").prop("selected", true);
            $province.trigger("change");
        }
        if(defaultCity) {
            setTimeout(function(){
                $city.children(":contains('" + defaultCity + "')").prop("selected", true);
                $city.trigger("change");
            },200)
        }
        if(defaultArea) {
            setTimeout(function(){
                $area.children(":contains('" + defaultArea + "')").prop("selected", true);
            },500)
        }
        return this;
    };
});
