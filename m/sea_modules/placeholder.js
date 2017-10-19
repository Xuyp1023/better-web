define(function(require, exports, module){
    exports.placeholder = function(id, style){
        if("placeholder" in document.createElement("input") || !id) return;
        var
            style = style || "#757575",
            getContent = function(element){
                return $(element).val();
            },
            setContent = function(element, content){
                $(element).val(content);
            },
            getPlaceholder = function(element){
                return $(element).attr("placeholder");
            },
            isContentEmpty = function(element){
                var content = getContent(element);
                return (content.length === 0) || content == getPlaceholder(element);
            },
            setPlaceholderStyle = function(element){
                $(element).data("placeholder", $(element).css("color"));
                $(element).css("color", style);
            },
            clearPlaceholderStyle = function(element){
                $(element).css("color", $(element).data("placeholder"));
                $(element).removeData("placeholder");
            },
            showPlaceholder = function(element){
                setContent(element, getPlaceholder(element));
                setPlaceholderStyle(element);
            },
            hidePlaceholder = function(element){
                if($(element).data("placeholder")){
                    setContent(element, "");
                    clearPlaceholderStyle(element);
                }
            },
            inputFocused = function(){
                if(isContentEmpty(this)){
                    hidePlaceholder(this);
                }
            },
            inputBlurred = function(){
                if(isContentEmpty(this)){
                    showPlaceholder(this);
                }
            },
            parentFormSubmitted = function(){
                if(isContentEmpty(this)){
                    hidePlaceholder(this);
                }
            };

        $(id).each(function(index, element){
            showPlaceholder(element);
            $(element).bind("focus",inputFocused).bind("blur",inputBlurred).bind("parentformsubmitted", parentFormSubmitted).parents("form").submit(function(){
                $(element).trigger("parentformsubmitted");
            });
        });
    };
});