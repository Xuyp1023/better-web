  var config = {
    //"license" : "MIIFcQYJKoZIhvcNAQcCoIIFYjCCBV4CAQExDjAMBggqgRzPVQGDEQUAMIG3BgkqhkiG9w0BBwGggakEgaZ7Iklzc3VlciI6IigoT1U9XFx3KikoW1xcd10qVE9QQ0ErW1xcd10qKXwoTz1cXHcqKShbXFx3XSpUT1BDQStbXFx3XSopKSIsInZlcnNpb24iOiIxLjAuMC4wIiwic29mdFZlcnNpb24iOiIzLjEuMC4wIiwibm90YWZ0ZXIiOiIyMDE1LTExLTExIiwibm90YmVmb3JlIjoiMjAxNC0xMS0xMSJ9oIIDRDCCA0AwggLloAMCAQICFF8lnNrMgrt+8wWzAHuLjsm9+bXyMAwGCCqBHM9VAYN1BQAwVTEmMCQGA1UEAwwd5aSp6K+a5a6J5L+h5rWL6K+VU00y55So5oi3Q0ExDjAMBgNVBAsMBVRPUENBMQ4wDAYDVQQKDAVUT1BDQTELMAkGA1UEBhMCQ04wHhcNMTQwOTI2MDc0NjA4WhcNMTUwOTI2MDc0NjA4WjAxMRgwFgYDVQQDDA9TaWduRVNBMjAxNDA5MjcxFTATBgNVBAoMDOWkqeivmuWuieS/oTBZMBMGByqGSM49AgEGCCqBHM9VAYItA0IABJYWeFLmIy9mTud+ai0LBeLoxhgnO6HcQGbsQhl4fveJzoVx0Cyzt/xvWY5y7l3qAwd59AbI+Im6Ftl/wAOShYmjggGzMIIBrzAJBgNVHRMEAjAAMAsGA1UdDwQEAwIGwDCBigYIKwYBBQUHAQEEfjB8MHoGCCsGAQUFBzAChm5odHRwOi8vWW91cl9TZXJ2ZXJfTmFtZTpQb3J0L1RvcENBL3VzZXJFbnJvbGwvY2FDZXJ0P2NlcnRTZXJpYWxOdW1iZXI9NUE0N0VDRjEwNTgwNEE1QzZBNUIyMjkyOUI3NURGMERGQkMwRDc5NjBXBgNVHS4EUDBOMEygSqBIhkZQb3J0L1RvcENBL3B1YmxpYy9pdHJ1c2NybD9DQT01QTQ3RUNGMTA1ODA0QTVDNkE1QjIyOTI5Qjc1REYwREZCQzBENzk2MG8GA1UdHwRoMGYwZKBioGCGXmh0dHA6Ly9Zb3VyX1NlcnZlcl9OYW1lOlBvcnQvVG9wQ0EvcHVibGljL2l0cnVzY3JsP0NBPTVBNDdFQ0YxMDU4MDRBNUM2QTVCMjI5MjlCNzVERjBERkJDMEQ3OTYwHwYDVR0jBBgwFoAUPYnGR8txhbDZO9ZIsInZ5/7v2tkwHQYDVR0OBBYEFEs77X+HgoaHoBKSsS7mACXYtREAMAwGCCqBHM9VAYN1BQADRwAwRAIgvbTXF8yNH5jsbG6r7XL5LEupJd8l8x9akz8rhO5XYYICIOg+hxn5F44N5+waqG+1Dbs6m9xiID83VkHnmptdMoR7MYIBRTCCAUECAQEwbTBVMSYwJAYDVQQDDB3lpKnor5rlronkv6HmtYvor5VTTTLnlKjmiLdDQTEOMAwGA1UECwwFVE9QQ0ExDjAMBgNVBAoMBVRPUENBMQswCQYDVQQGEwJDTgIUXyWc2syCu37zBbMAe4uOyb35tfIwDAYIKoEcz1UBgxEFAKBpMBgGCSqGSIb3DQEJAzELBgkqhkiG9w0BBwEwHAYJKoZIhvcNAQkFMQ8XDTE0MTIxNTE2MDE0MlowLwYJKoZIhvcNAQkEMSIEIKVfs4x/+N00DvXW1laFJ2MIp/mOlYCK0YwLY8LeMZJ/MAwGCCqBHM9VAYItBQAERjBEAiCDq5pGzujl6NmKiEYJGtKTlFHccQjh+kH2JQytgQ257wIgyqur3qCs1BnPs0qV3XGDu3EZJW/uh0Re7RD6shBdAfA=","certDateFmtMode":true,"certDateFmtMode":true};
    //SM2
  //"license" : "MIIFfQYJKoZIhvcNAQcCoIIFbjCCBWoCAQExDjAMBggqgRzPVQGDEQUAMIHDBgkqhkiG9w0BBwGggbUEgbJ7Iklzc3VlciI6IigoLipPPeWkqeivmuWuieS/oeivleeUqC4qKXwoLipPVT3mtYvor5Xpg6jor5XnlKguKil8KC4qQ049dXNlcmNhLiopKXszfSIsInZlcnNpb24iOiIxLjAuMC4wIiwic29mdFZlcnNpb24iOiIzLjEuMC4wIiwibm90YWZ0ZXIiOiIyMDE1LTA4LTAyIiwibm90YmVmb3JlIjoiMjAxNS0wMi0wMSJ9oIIDRDCCA0AwggLloAMCAQICFF8lnNrMgrt+8wWzAHuLjsm9+bXyMAwGCCqBHM9VAYN1BQAwVTEmMCQGA1UEAwwd5aSp6K+a5a6J5L+h5rWL6K+VU00y55So5oi3Q0ExDjAMBgNVBAsMBVRPUENBMQ4wDAYDVQQKDAVUT1BDQTELMAkGA1UEBhMCQ04wHhcNMTQwOTI2MDc0NjA4WhcNMTUwOTI2MDc0NjA4WjAxMRgwFgYDVQQDDA9TaWduRVNBMjAxNDA5MjcxFTATBgNVBAoMDOWkqeivmuWuieS/oTBZMBMGByqGSM49AgEGCCqBHM9VAYItA0IABJYWeFLmIy9mTud+ai0LBeLoxhgnO6HcQGbsQhl4fveJzoVx0Cyzt/xvWY5y7l3qAwd59AbI+Im6Ftl/wAOShYmjggGzMIIBrzAJBgNVHRMEAjAAMAsGA1UdDwQEAwIGwDCBigYIKwYBBQUHAQEEfjB8MHoGCCsGAQUFBzAChm5odHRwOi8vWW91cl9TZXJ2ZXJfTmFtZTpQb3J0L1RvcENBL3VzZXJFbnJvbGwvY2FDZXJ0P2NlcnRTZXJpYWxOdW1iZXI9NUE0N0VDRjEwNTgwNEE1QzZBNUIyMjkyOUI3NURGMERGQkMwRDc5NjBXBgNVHS4EUDBOMEygSqBIhkZQb3J0L1RvcENBL3B1YmxpYy9pdHJ1c2NybD9DQT01QTQ3RUNGMTA1ODA0QTVDNkE1QjIyOTI5Qjc1REYwREZCQzBENzk2MG8GA1UdHwRoMGYwZKBioGCGXmh0dHA6Ly9Zb3VyX1NlcnZlcl9OYW1lOlBvcnQvVG9wQ0EvcHVibGljL2l0cnVzY3JsP0NBPTVBNDdFQ0YxMDU4MDRBNUM2QTVCMjI5MjlCNzVERjBERkJDMEQ3OTYwHwYDVR0jBBgwFoAUPYnGR8txhbDZO9ZIsInZ5/7v2tkwHQYDVR0OBBYEFEs77X+HgoaHoBKSsS7mACXYtREAMAwGCCqBHM9VAYN1BQADRwAwRAIgvbTXF8yNH5jsbG6r7XL5LEupJd8l8x9akz8rhO5XYYICIOg+hxn5F44N5+waqG+1Dbs6m9xiID83VkHnmptdMoR7MYIBRTCCAUECAQEwbTBVMSYwJAYDVQQDDB3lpKnor5rlronkv6HmtYvor5VTTTLnlKjmiLdDQTEOMAwGA1UECwwFVE9QQ0ExDjAMBgNVBAoMBVRPUENBMQswCQYDVQQGEwJDTgIUXyWc2syCu37zBbMAe4uOyb35tfIwDAYIKoEcz1UBgxEFAKBpMBgGCSqGSIb3DQEJAzELBgkqhkiG9w0BBwEwHAYJKoZIhvcNAQkFMQ8XDTE1MDIwMjE4NDIyM1owLwYJKoZIhvcNAQkEMSIEINR57hlZ3U8z7nxvE97wxKwgU9rzSZsQBW8pIUDW6IpYMAwGCCqBHM9VAYItBQAERjBEAiAWIBGe0ljfS7gGIndghzt/iDwmTgnvYjqzpB/OJ6MRVQIg2fmYeQoPDpTt65lVa80gtrmVLZm9Adfdxfm4hHu5wjY=","certDateFmtMode":true,"certDateFmtMode":true};
  //RSA
  "license" : "MIIFgAYJKoZIhvcNAQcCoIIFcTCCBW0CAQExDjAMBggqgRzPVQGDEQUAMIHGBgkqhkiG9w0BBwGggbgEgbV7Iklzc3VlciI6IigoKC4qT1U95rWL6K+V6YOo6K+V55SoLiopfCguKk895aSp6K+a5a6J5L+h6K+V55SoLiopKXsyfSkiLCJ2ZXJzaW9uIjoiMS4wLjAuMSIsInNvZnRWZXJzaW9uIjoiMy4xLjAuMCIsIm5vdGFmdGVyIjoiMjAxOS0wNS0yMyIsIm5vdGJlZm9yZSI6IjIwMTYtMDUtMjMiLCJub0FsZXJ0IjoidHJ1ZSJ9oIIDRDCCA0AwggLloAMCAQICFF8lnNrMgrt+8wWzAHuLjsm9+bXyMAwGCCqBHM9VAYN1BQAwVTEmMCQGA1UEAwwd5aSp6K+a5a6J5L+h5rWL6K+VU00y55So5oi3Q0ExDjAMBgNVBAsMBVRPUENBMQ4wDAYDVQQKDAVUT1BDQTELMAkGA1UEBhMCQ04wHhcNMTQwOTI2MDc0NjA4WhcNMTUwOTI2MDc0NjA4WjAxMRgwFgYDVQQDDA9TaWduRVNBMjAxNDA5MjcxFTATBgNVBAoMDOWkqeivmuWuieS/oTBZMBMGByqGSM49AgEGCCqBHM9VAYItA0IABJYWeFLmIy9mTud+ai0LBeLoxhgnO6HcQGbsQhl4fveJzoVx0Cyzt/xvWY5y7l3qAwd59AbI+Im6Ftl/wAOShYmjggGzMIIBrzAJBgNVHRMEAjAAMAsGA1UdDwQEAwIGwDCBigYIKwYBBQUHAQEEfjB8MHoGCCsGAQUFBzAChm5odHRwOi8vWW91cl9TZXJ2ZXJfTmFtZTpQb3J0L1RvcENBL3VzZXJFbnJvbGwvY2FDZXJ0P2NlcnRTZXJpYWxOdW1iZXI9NUE0N0VDRjEwNTgwNEE1QzZBNUIyMjkyOUI3NURGMERGQkMwRDc5NjBXBgNVHS4EUDBOMEygSqBIhkZQb3J0L1RvcENBL3B1YmxpYy9pdHJ1c2NybD9DQT01QTQ3RUNGMTA1ODA0QTVDNkE1QjIyOTI5Qjc1REYwREZCQzBENzk2MG8GA1UdHwRoMGYwZKBioGCGXmh0dHA6Ly9Zb3VyX1NlcnZlcl9OYW1lOlBvcnQvVG9wQ0EvcHVibGljL2l0cnVzY3JsP0NBPTVBNDdFQ0YxMDU4MDRBNUM2QTVCMjI5MjlCNzVERjBERkJDMEQ3OTYwHwYDVR0jBBgwFoAUPYnGR8txhbDZO9ZIsInZ5/7v2tkwHQYDVR0OBBYEFEs77X+HgoaHoBKSsS7mACXYtREAMAwGCCqBHM9VAYN1BQADRwAwRAIgvbTXF8yNH5jsbG6r7XL5LEupJd8l8x9akz8rhO5XYYICIOg+hxn5F44N5+waqG+1Dbs6m9xiID83VkHnmptdMoR7MYIBRTCCAUECAQEwbTBVMSYwJAYDVQQDDB3lpKnor5rlronkv6HmtYvor5VTTTLnlKjmiLdDQTEOMAwGA1UECwwFVE9QQ0ExDjAMBgNVBAoMBVRPUENBMQswCQYDVQQGEwJDTgIUXyWc2syCu37zBbMAe4uOyb35tfIwDAYIKoEcz1UBgxEFAKBpMBgGCSqGSIb3DQEJAzELBgkqhkiG9w0BBwEwHAYJKoZIhvcNAQkFMQ8XDTE1MDUyMzEwMTI1MVowLwYJKoZIhvcNAQkEMSIEIPnBksv/Y5i5u0J7AnTtdK53AmQgiIbH1u+GstkuKNZcMAwGCCqBHM9VAYItBQAERjBEAiCgp8vCfrx84zVlS2OfB3yok93wrmEi0aKrb4n/ZHIe6QIg32du2Up+wG1Gwkkqq3q2kphoXmPcvvqXR7H4OPI3IQc=","certDateFmtMode":true,"certDateFmtMode":true};

    /*var config = new Array();
    config.license = "MIIFcQYJKoZIhvcNAQcCoIIFYjCCBV4CAQExDjAMBggqgRzPVQGDEQUAMIG3BgkqhkiG9w0BBwGggakEgaZ7Iklzc3VlciI6IigoT1U9XFx3KikoW1xcd10qVE9QQ0ErW1xcd10qKXwoTz1cXHcqKShbXFx3XSpUT1BDQStbXFx3XSopKSIsInZlcnNpb24iOiIxLjEuMS4xIiwic29mdFZlcnNpb24iOiIxLjEuMS4xIiwibm90YWZ0ZXIiOiIyMDE1LTEwLTAzIiwibm90YmVmb3JlIjoiMjAxNC0xMC0xMCJ9oIIDRDCCA0AwggLloAMCAQICFF8lnNrMgrt+8wWzAHuLjsm9+bXyMAwGCCqBHM9VAYN1BQAwVTEmMCQGA1UEAwwd5aSp6K+a5a6J5L+h5rWL6K+VU00y55So5oi3Q0ExDjAMBgNVBAsMBVRPUENBMQ4wDAYDVQQKDAVUT1BDQTELMAkGA1UEBhMCQ04wHhcNMTQwOTI2MDc0NjA4WhcNMTUwOTI2MDc0NjA4WjAxMRgwFgYDVQQDDA9TaWduRVNBMjAxNDA5MjcxFTATBgNVBAoMDOWkqeivmuWuieS/oTBZMBMGByqGSM49AgEGCCqBHM9VAYItA0IABJYWeFLmIy9mTud+ai0LBeLoxhgnO6HcQGbsQhl4fveJzoVx0Cyzt/xvWY5y7l3qAwd59AbI+Im6Ftl/wAOShYmjggGzMIIBrzAJBgNVHRMEAjAAMAsGA1UdDwQEAwIGwDCBigYIKwYBBQUHAQEEfjB8MHoGCCsGAQUFBzAChm5odHRwOi8vWW91cl9TZXJ2ZXJfTmFtZTpQb3J0L1RvcENBL3VzZXJFbnJvbGwvY2FDZXJ0P2NlcnRTZXJpYWxOdW1iZXI9NUE0N0VDRjEwNTgwNEE1QzZBNUIyMjkyOUI3NURGMERGQkMwRDc5NjBXBgNVHS4EUDBOMEygSqBIhkZQb3J0L1RvcENBL3B1YmxpYy9pdHJ1c2NybD9DQT01QTQ3RUNGMTA1ODA0QTVDNkE1QjIyOTI5Qjc1REYwREZCQzBENzk2MG8GA1UdHwRoMGYwZKBioGCGXmh0dHA6Ly9Zb3VyX1NlcnZlcl9OYW1lOlBvcnQvVG9wQ0EvcHVibGljL2l0cnVzY3JsP0NBPTVBNDdFQ0YxMDU4MDRBNUM2QTVCMjI5MjlCNzVERjBERkJDMEQ3OTYwHwYDVR0jBBgwFoAUPYnGR8txhbDZO9ZIsInZ5/7v2tkwHQYDVR0OBBYEFEs77X+HgoaHoBKSsS7mACXYtREAMAwGCCqBHM9VAYN1BQADRwAwRAIgvbTXF8yNH5jsbG6r7XL5LEupJd8l8x9akz8rhO5XYYICIOg+hxn5F44N5+waqG+1Dbs6m9xiID83VkHnmptdMoR7MYIBRTCCAUECAQEwbTBVMSYwJAYDVQQDDB3lpKnor5rlronkv6HmtYvor5VTTTLnlKjmiLdDQTEOMAwGA1UECwwFVE9QQ0ExDjAMBgNVBAoMBVRPUENBMQswCQYDVQQGEwJDTgIUXyWc2syCu37zBbMAe4uOyb35tfIwDAYIKoEcz1UBgxEFAKBpMBgGCSqGSIb3DQEJAzELBgkqhkiG9w0BBwEwHAYJKoZIhvcNAQkFMQ8XDTE0MTAxMzExMjAzMlowLwYJKoZIhvcNAQkEMSIEIDjR+B6/QliZ8GxVKpeo8xg4TPFJQsaTgRY6OzMePSAZMAwGCCqBHM9VAYItBQAERjBEAiCVX82KY0ANIfWg7uLRa8VLKuee31BQtqVN+IEo7Pi6rAIgKwZIoBEejrsKM96Q/iS2SuL4p/oyN1Ib5yshkUcxleQ=";

    config.certDateFmtMode = false;
    config.exepath = "http://www.baidu.com";
    config.alertOnSignMessage = false;*/
  try{
    // TCA.config(config);
    // refreshCertList();
    // refreshCspList();
    // return ;
  }catch(e){
    if (e instanceof TCACErr) {
      window.location.href="modules/qh/commission/import/404.html";
      // alert(e.toStr());
    } else {
      alert("初始化证书失败");
    }
  }

//////////////////////////////////////////////////////

//隐藏/显示  某层
function showHideObject(obj) {
  if (obj.style.display != "none")
    obj.style.display = "none";
  else
    obj.style.display = "inline";
}

//////////////////////////////////////////////////////

// 传入CertSet, 将certs中的证书显示在CertList中
function initCertList(certs) {
  try {
    $("#CertList").empty();
    var count = certs.size();
    $("#certCount").text(certs.size());
    if (count <= 0) {
      $("#CertList").append("<option value='0'>查询结果为空");
      return;
    }
    for (var i = 0; i<count; i++) {
      var cert = certs.get(i);
      var cn = getCNFromSubject(cert);
  addOption(cert.serialNumber(),cn);
    }
  } catch (e) {
    if (e instanceof TCACErr) {
      alert(e.toStr());
    } else {
      alert("Here is Error !!!");
    }
  }
}

function addOption(oValue,oName){
  var sid = document.getElementById("CertList"); 
  var myOption = document.createElement("option");  
  sid.appendChild(myOption); 
  myOption.text = oName;
  myOption.value = oValue; 
}

function addCSPOption(Value){
  var sid = document.getElementById("cspList"); 
  var myOption = document.createElement("option");  
  sid.appendChild(myOption); 
  myOption.text = Value;
  myOption.value = Value; 
}


function callback(idx){
    if(idx != -1){
  var certs = filterCert();
  var cert  = certs.get(idx-1);
  var cn = getCNFromSubject(cert);
  $("#CertList").empty();
  $("#CertList").append("<option value='" + cert.serialNumber() + "'>" + cn + "</option>");
  $("#certCount").text(1);
  displayCertInfo(cert);
    }
}

// 通过窗口选择证书
function uiselect(){
  var _certs = filterCert();

  this.cb = function(idx){
     if(idx != -1){
      var certs = filterCert();
      var cert  = certs.get(idx-1);
      var cn = getCNFromSubject(cert);
      $("#CertList").empty();
      $("#CertList").append("<option value='" + cert.serialNumber() + "'>" + cn + "</option>");
      $("#certCount").text(1);
      displayCertInfo(cert);
     }
  }
  var r = _certs.uiSelect(this.cb);
  

}

// 刷新证书列表
function refreshCertList(val) {
  try {
    var certs = filterCert(val);
    initCertList(certs);
    if( certs.size()==0 ){
      alert("没有找到符合License的证书");
      return;
    }
    var cert = getSelectedCert();
    displayCertInfo(cert);

  } catch (e) {
    if (e instanceof TCACErr) {
      alert(e.toStr());
    } else {
      alert("Here is Error !!!");
    }
  }
}

// 过滤证书
// 返回Certs
function filterCert(val) {
  try {
    var certs = CertStore.listAllCerts();
    if(val != undefined || val != null ){
      if(val == 1){
        certs = certs.forSign();
        return certs;
      }else if(val == 2){
        certs = certs.forEncrypt();
        return certs;
      }
    }else{
      var subject = $("#ftSubject").val();
      var issuer = $("#ftIssuer").val();
      var serial = $("#ftSerial").val();
      var KeyUsage = new Array;
      var arr = $("[id=checkusage]");
      var datetime = null;
      for (i = 0; i < arr.length; i++) {
        if (arr[i].checked) {
          KeyUsage.push(arr[i].value);
        }
      }
      if($("#seldate").val()!=""){
        datetime = new Date($("#seldate").val());    //#8810#8829#8811#8814
      }
      // 性能建议: 将严格的条件放在前面
      var r = certs;

      if (serial.length > 0 ) {
        r = r.bySerialnumber(serial);
      }
      if (subject.length > 0 ) {
        r = r.bySubjcet(subject);
      }
      if (issuer.length > 0  ) {
        r = r.byIssuer(issuer);
      }
      if (KeyUsage.length!=0 ) {
        // 这里还有另外一个重载可以选择
        r = r.byKeyUsage(KeyUsage);
      }
      if (datetime != null && datetime != ""  ) {
        // 这里可以选择使用无参的重载
        r = r.byValidity(datetime);
      }
      return r;
    }
  } catch (e) {
    if (e instanceof TCACErr) {
      alert(e.toStr());
    } else {
      alert("Here is Error!!!");
    }
  }
}

// 从Certificate对象中获取CN
// cert : Certificate对象
function getCNFromSubject(cert) {
  try {
    var t = cert.subject().match(/(S(?!N)|L|O(?!U)|OU|SN|CN|E)=([^=]+)(?=, |$)/g);
    for (var i = 0; i < t.length; i++) {
      if (t[i].indexOf("CN=") === 0)
        return t[i].substr(3, t[i].length);
      }
      return null;
  } catch (e) {
    if (e instanceof TCACErr) {
      alert(e.toStr());
    } else {
      alert("Here is Error !!!");
    }
  }
}

// 刷新CSP列表
// 从[id=cspListUseWL]获取是否启用白名单
// 结果写入cspList
function refreshCspList() {
  try {
    var useWL = $("[id=cspListUseWL]:checked").val() == "1";
    var list = $("#cspList").empty();
    var certStores = CertStore.listStore(useWL);
    for (var i = 0; i < certStores.length; i++) {
      addCSPOption(certStores[i]);
    }
  } catch (e) {
    if (e instanceof TCACErr) {
      alert(e.toStr());
    } else {
      alert("Here is Error !!!");
    }
  }
}
// 获取CSP支持的对称密钥算法
function refreshCspKey() {
  try {
    var name = $("#cspList").val();
    var cur  = CertStore.byName(name);
    var ret  = cur.getSupportedKeyAlgs();
    var str  = "";
    if( ret.length==0 ){
      str = "无";
    }else{
      for(var i=0;i<ret.length;i++){
        str = str + ret[i];
        str = str + "\n";
      }
  }
    var list = $("#cspkey").empty();
    $("#cspkey").val(str);
  } catch (e) {
    if (e instanceof TCACErr) {
      alert(e.toStr());
    } else {
      alert("Here is Error !!!");
    }
  }
}


// 从["id==CertList"]中获取当前选择的证书
// 返回Certificate对象
function getSelectedCert() {
  try {
    var certs = CertStore.listAllCerts(); // 此处可能会有性能问题
    //var selectedCertSN = $("[id=CertList]").attr("value");
    var selectedCertSN = document.getElementById("CertList").value;
    var r = certs.bySerialnumber(selectedCertSN);
    return r.get(0);
  } catch (e) {
    if (e instanceof TCACErr) {
      alert(e.toStr());
    } else {
      alert("没有找到证书");
    }
  }
}

// 显示Certificate对象的详细信息
function displayCertInfo(cert) {
  try {
    var t1, t2 = "";
    var publk  = "";
    t1 = cert.keyUsage();
    for (var i = 0; i < t1.length; i++) {
      t2 += "["+t1[i] + "]";
    }
    var strKeyUsage = t2;

    var strExtKeyUsage = "";
    t1 = cert.extededKeyUsage();
    if (t1 == "" || t1 == null) {
      strExtKeyUsage = "无";
    } else {
      for (var i = 0; i < t1.length; i++) {
        t2 += t1[i] + "\n";
      }
      strExtKeyUsage = t2;
    }

    t1 = cert.crlUrl();
    var strCrlUrl = "";
    if (t1 == null || t1 == "") {
      strCrlUrl = "无";
    } else {
      strCrlUrl = t1;
    }
    publk += cert.publicKeyAlg() + "  |  ";
    publk += cert.publicKeySize();
    $("#SubjectDN").text(cert.subject());
    $("#IssuerDN").text(cert.issuer());
    $("#CertCSP").text("  /  ");
    $("#signAlg").text(cert.signAlg());
    $("#publicKeyAlg").text(publk);
    $("#KeyContainer").text("  /  ");
    $("#CertSerial").text(cert.serialNumber());
    $("#CertValidStart").text(cert.notBefore());
    $("#CertValidEnd").text(cert.notAfter());
    $("#lbKeyUsage").text(strKeyUsage);
    $("#extededKeyUsage").text(strExtKeyUsage);
    $("#crlUrl").text(strCrlUrl);
    $("#lbValidity").text("  /  ");
  }catch (e) {
    if (e instanceof TCACErr) {
      alert(e.toStr());
    } else {
      alert("没有找到证书!!!");
    }
  }
}

// CertList的onChange
function onCertListChange() {
  try {
    var cert = getSelectedCert();
    displayCertInfo(cert);
  } catch (e) {
    if (e instanceof TCACErr) {
      alert(e.toStr());
    } else {
      alert("Here is Error !!!");
    }
  }
}

// 删除证书
function doDeleteCert() {
  try {
    var cert = getSelectedCert();
    cert.Delete();
    refreshCertList();
  } catch (e) {
    if (e instanceof TCACErr) {
      alert(e.toStr());
    } else {
      alert("Here is Error !!!");
    }
  }
}


/////////////////////////////////////////////////////////////
// 签名
// 原文从 $("#txtToSign") 读入
// 结果输出至 $("#Signature")
function sign(b) {
  try {
    var toSign = $("#txtToSign").val();
    var cert = getSelectedCert();
     var P7 = null;
    if(b == false){
      P7 = cert.signMessage(toSign,false);
    }else{
      P7 = cert.signMessage(toSign);
    }
    $("#Signature").text(P7);
  } catch (e) {
    if (e instanceof TCACErr) {
      alert(e.toStr());
    } else {
      alert("Here is Error !!!");
    }
  }
}

// 验签
function verify(statu) {
  try {
    var b64 = $("#Signature").val();
    var p7 = new Pkcs7(b64);
    var cert = null;
    if(statu == 0){
        cert = p7.verify();
    }else if(statu == 1){
        cert = p7.verify($("#txtToSign").val());
    }
    if (cert != null) {
      // 验签通过
      var str = "验签通过, 证书信息 : \n";
      str += "Subject : " + cert.subject() + "\n";// + "\n";
      str += "Issuer  : " + cert.issuer() + "\n";// + "\n";
      str += "SN      : " + cert.serialNumber() + "\n";// + "\n";
      alert(str);
    } else {
      // 失败
    }
  } catch (e) {
    if (e instanceof TCACErr) {
      alert(e.toStr());
    } else {
      alert("Here is Error !!!");
    }
  }
}

// 加密
function encrypt() {
  try {
    var toEnc = $("#txtToEnc").val();
    var cert = getSelectedCert();
    var P7 = cert.encryptMessage(toEnc);
    $("#encData").text(P7);
  } catch (e) {
    if (e instanceof TCACErr) {
      alert(e.toStr());
    } else {
      alert("Here is Error !!!");
    }
  }
}

// 解密
function decrypt() {
  try {
    var b64 = $("#encData").val();
    var P7 = new Pkcs7(b64);
    var result = P7.decryptMessage();
    alert(result);
  } catch (e) {
    if (e instanceof TCACErr) {
      alert(e.toStr());
    } else {
      alert("Here is Error !!!");
    }
  }
}

/////////////////////////////////////////////////////////////

// 获取当前选择的CertStore
function getSelectedCertStore() {
  try {
    var name = $("#cspList").val();
    var cur = CertStore.byName(name);
    return cur;
  } catch (e) {
    if (e instanceof TCACErr) {
      alert(e.toStr());
    } else {
      alert("Here is Error !!!");
    }
  }

}

// 快速产生
function quickGenCSR() {
  try {
    var certStore = getSelectedCertStore();
    var str = "快速产生CSR时，主题为 : CN=topca，算法为 : SM2 \n";
    str += "请检查当前选择的CertStore是否支持SM2";
    alert(str);
    var csr = certStore.genCsr();
    $("#showcsr1").text(csr.toBase64());
  }catch (e) {
    if (e instanceof TCACErr) {
      alert(e.toStr());
    } else {
      alert("Here is Error !!!");
    }
  }
}

function genCSR() {
  try {
    var certStore = getSelectedCertStore();
    var subject = $("#subjectinput").val();
    var alg = $("[name=KeyAlg]").attr("value");
    switch (alg) {
      case "1":
        alg = TCA.SM2;
        break;
      case "2":
        alg = TCA.RSA1024;
        break;
      case "3":
        alg = TCA.RSA2048;
        break;
      default:
        alg = TCA.SM2;
    }
    var csr;
    if (subject.length === 0) {
      csr = certStore.genCsr(alg);
    } else {
      csr = certStore.genCsr(alg, subject);
    }
    $("#CSRText").text(csr.toBase64());
  } catch (e) {
    if (e instanceof TCACErr) {
      alert(e.toStr());
    } else {
      alert("Here is Error !!!");
    }
  }
}

// 适用当前选择的证书产生CSR
function genCSRByCert() {
  try {
    var cert = getSelectedCert();
    var certStore = CertStore.byCert(cert);
    var csr = certStore.genCsr(cert);
    // 没地方显示
  } catch (e) {
    if (e instanceof TCACErr) {
      alert(e.toStr());
    } else {
      alert("Here is Error !!!");
    }
  }
}

// 安装TopCA的单证
function installSingleCert() {
  try {
    var c = $("#certData").val();
    var r = CertStore.installCert(c);
  } catch (e) {
    if (e instanceof TCACErr) {
      alert(e.toStr());
    } else {
      alert("Here is Error !!!");
    }
  }
}


function installEncryptCert() {
  var signCert = $("#certdate1").val();
  var encryptedEncCertPrivateKey = $("#certdate2").val();
  var encCert = $("#certdate3").val();
    var r = CertStore.installCert(signCert,encCert,encryptedEncCertPrivateKey);
    if(r){
      alert("安装成功！");
    }
}

// 安装证书链
function installCertChain() {
  try {
    var c = $("#certChain").val();
    var r = CertStore.installCert(c);
    if(r){alert("安装成功");}
  } catch (e) {
    if (e instanceof TCACErr) {
      alert(e.toStr());
    } else {
      alert("Here is Error !!!");
    }
  }
}
// 显示证书
function show() {
  try {
    var cert = getSelectedCert();
    cert.show();
  } catch (e) {
    if (e instanceof TCACErr) {
      alert(e.toStr());
    } else {
      alert("Here is Error !!!");
    }
  }
}

//导入PFX
function ImportPFX(){
  var PFXb64 = document.getElementById("B64pfx").value;
  var PFXPWD = document.getElementById("password").value;
  try{
    var msCertStore = CertStore.byName("RSA软证书");
    if( msCertStore==null ){
      alert("没有找到指定的CertStore");
      return;
    }
    var c = msCertStore.importPFX(PFXb64, PFXPWD);
    if( c==null ){
      alert("证书导入")
      return;
    }
    alert("证书导入成功");
    alert(c.subject());
  }catch (e) {
    if (e instanceof TCACErr) {
      alert(e.toStr());
    } else {
      alert("Here is Error !!!");
    }
  }
}
//P7文件签名
function FileP7SignData(){
  try{
    var filepath = document.getElementById("fileToP7Sign").value;
    var Signpath = document.getElementById("Signpath").value;
    var hashAlg = document.getElementById("p7hash").value;
    var cert = getSelectedCert();
    var ret = null;
    if(hashAlg!="")
      ret  = cert.signFile2File(filepath,Signpath,hashAlg);
    else
      ret  = cert.signFile2File(filepath,Signpath);
    if(ret){
      alert("签名成功");
    }
  }catch(e){
    if (e instanceof TCACErr) {
          alert(e.toStr());
      } else {
          alert("Here is Error !!!");
      }
  }
}
//P7文件验签
function VerifyFileP7Data(){
  try{
    var filepath = document.getElementById("fileToP7Sign").value;
    var Signpath = document.getElementById("Signpath").value;
    var hashAlg = document.getElementById("p7hash").value;
    var cert = getSelectedCert();
    var ret  = null; 
    if(hashAlg!="")
      ret = cert.verifyFile(filepath,Signpath,hashAlg);
    else
      ret = cert.verifyFile(filepath,Signpath);
    if(ret){
      alert("验签成功");
    }
  }catch(e){
    if (e instanceof TCACErr) {
          alert(e.toStr());
      } else {
        alert("Here is Error !!!");
      }
  }
}
//裸签名
function BareSignData(){
  try{
    var plaintxt = document.getElementById("txtToBareSign").value;
    var signdata = document.getElementById("BareSignature").value;
    var hashAlg = document.getElementById("RAWhash").value;
    var cert = getSelectedCert();
    var ret  = null;
    if(hashAlg!="")
      ret = cert.signMessageRaw(plaintxt,hashAlg);
    else
      ret = cert.signMessageRaw(plaintxt);
    if(ret!=null || ret !=""){
      alert("成功");
    }
     $("#BareSignature").text(ret);
  }catch(e){
    if (e instanceof TCACErr) {
          alert(e.toStr());
      } else {
          alert("Here is Error !!!");
      }
  }
}
//裸签名验签
function BareVerifyData(){
  try{
    var plaintxt = document.getElementById("txtToBareSign").value;
    var signdata = document.getElementById("BareSignature").value;
    var hashAlg = document.getElementById("RAWhash").value;
    var cert = getSelectedCert();
    var ret  = null;
    if(hashAlg!="")
      ret  = cert.verifyRaw(signdata,plaintxt,hashAlg);
    else
      ret  = cert.verifyRaw(signdata,plaintxt);
    if(ret==null || ret ==""){
      alert("验签失败");
    }else 
      alert("成功");
  }catch(e){
    if (e instanceof TCACErr) {
          alert(e.toStr());
      } else {
          alert("Here is Error !!!");
      }
  }
  
}
//P1文件签名
function FileP1SignData(){
  try{
    var filepath = document.getElementById("fileToP1Sign").value;
    var Signfilepath = document.getElementById("fileToP1SignData");
    var fileToP1rResult = document.getElementById("fileToP1rResult");
    // var hashAlg = document.getElementById("P1filehash").value;
    var cert = getSelectedCert();
    var ret  = null;
    // if(hashAlg!="")
    //   ret  = cert.signFileRaw(filepath,hashAlg);
    // else
      ret  = cert.signFileRaw(filepath);
    if(ret!=null){
      Signfilepath.value = ret;
      fileToP1rResult.innerHTML = "签名成功";
    }
  }catch(e){
    if (e instanceof TCACErr) {
        fileToP1rResult.innerHTML = "invalid";
          // alert(e.toStr());
      } else {
          alert("Here is Error !!!");
      }
  }
}
//P1文件验签
function VerifyFileP1Data(){
  try{
    var filepath = document.getElementById("fileToP1Sign").value;
    var Signdata = document.getElementById("fileToP1SignData").value;
    var hashAlg = document.getElementById("P1filehash").value;
    var cert = getSelectedCert();
    var ret  = null;
    if(hashAlg!="")
      ret  = cert.verifyFileRaw(Signdata,filepath,hashAlg);
    else
      ret  = cert.verifyFileRaw(Signdata,filepath);
    if(ret!=null){
      alert(ret)
    }
  }catch(e){
    if (e instanceof TCACErr) {
          alert(e.toStr());
      } else {
          alert("Here is Error !!!");
      }
  }
}

//RAW加密
function rawEncrypt(){
  try{
    var plaintxt = document.getElementById("txtToRawEnc").value;
    var cert = getSelectedCert();
    var ret  = cert.encryptRaw(plaintxt);
    if(ret!=null){
      $("#rawEncData").text(ret);
    }
  }catch(e){
    if (e instanceof TCACErr) {
          alert(e.toStr());
      } else {
          alert("Here is Error !!!");
      }
  }
}
//RAW解密
function rawDecrypt(){
  try{
    var encData = document.getElementById("rawEncData").value;
    var cert = getSelectedCert();
    var ret  = cert.decryptRaw(encData);
    if(ret!=null){
      alert(ret);
    }
  }catch(e){
    if (e instanceof TCACErr) {
          alert(e.toStr());
      } else {
          alert("Here is Error !!!");
      }
  }
}
//证书导出
function output(){
  try{
    var password = document.getElementById("pfxpassword").value;
    var cert = getSelectedCert();
    var ret  = cert.exportPFX(password);
    if(ret!=null){
      $("#txtTopfxout").text(ret);
    }
  }catch(e){
    if (e instanceof TCACErr) {
          alert(e.toStr());
      } else {
          alert("Here is Error !!!");
      }
  }
}
/////////////////////////////////////////////////////////////rawEncrypt
