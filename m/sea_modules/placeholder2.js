/*define(function(require, exports, module){
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
                var isPass = element.type=='password';
                if(isPass){
                    var replaceObj = element.cloneNode(false);
                    replaceObj.type = 'text';
                    replaceObj.prevType = 'password';
                    $(element).replaceWith(replaceObj);
                    setContent(replaceObj, getPlaceholder(replaceObj));
                    setPlaceholderStyle(replaceObj);
                    return;
                }
                setContent(element, getPlaceholder(element));
                setPlaceholderStyle(element);

                // element.type=='password' ? (element.type='text',$(element).data("preType",'password')):undefined;
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
*/


(function($) {

    /**
     * Spoofs placeholders in browsers that don't support them (eg Firefox 3)
     * 
     * Copyright 2011 Dan Bentley
     * Licensed under the Apache License 2.0
     *
     * Author: Dan Bentley [github.com/danbentley]
     */

    // Return if native support is available.
    if ("placeholder" in document.createElement("input")) return;

    $(document).ready(function(){
        $(':input[placeholder]').not(':password').each(function() {
            setupPlaceholder($(this));
        });

        $(':password[placeholder]').each(function() {
            setupPasswords($(this));
        });
       
        $('form').submit(function(e) {
            clearPlaceholdersBeforeSubmit($(this));
        });
    });

    function setupPlaceholder(input) {
        var placeholderText = input.attr('placeholder');
        // if(console) console.log('value: '+input.val());
        (input.val() === '') ? input.val(placeholderText) : null;

        // setPlaceholderOrFlagChanged(input, placeholderText);
        input.focus(function(e) {
            // if (input.data('changed') === true) return;
            if (input.val() === placeholderText) input.val('');
        }).blur(function(e) {
            if (input.val() === ''|| input.val() === placeholderText) input.val(placeholderText); 
        })/*.change(function(e) {
            input.data('changed', input.val() !== '');
        })*/;
    }

    function setPlaceholderOrFlagChanged(input, text) {
        (input.val() === '') ? input.val(text) : input.data('changed', true);
    }

    function setupPasswords(input) {
        var passwordPlaceholder = createPasswordPlaceholder(input);
        input.after(passwordPlaceholder);

        (input.val() === '') ? input.hide() : passwordPlaceholder.hide();

        $(input).blur(function(e) {
            if (input.val() !== '') return;
            input.hide();
            passwordPlaceholder.show();
        });
            
        $(passwordPlaceholder).focus(function(e) {
            passwordPlaceholder.hide();
            input.show().focus();
        });
    }

    function createPasswordPlaceholder(input) {
        return $('<input>').attr({
            placeholder: input.attr('placeholder'),
            value: input.attr('placeholder'),
            id: input.attr('id'),
            readonly: true
        }).addClass(input.attr('class'));
    }

    function clearPlaceholdersBeforeSubmit(form) {
        form.find(':input[placeholder]').each(function() {
            // if ($(this).data('changed') === true) return;
            if ($(this).val() === $(this).attr('placeholder')) $(this).val('');
        });
    }
})(jQuery);