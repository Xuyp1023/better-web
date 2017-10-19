define(function(require, exports, module){
	module.exports = function(host ,path ,domain){
        var domain = domain || (function (){
                var domain = location.host;
                if(domain.indexOf("csc86.com") > 0){
                    return "csc86.com";
                }
                return "csc86.com";
            })();
        if(host){
            switch(host){
                default:
                ;
            }
        }
        return location.protocol + "//" + (host ? host + "." : "") + domain + (location.port ? ":" + location.port : "") + (path ? path : "");
    };
});