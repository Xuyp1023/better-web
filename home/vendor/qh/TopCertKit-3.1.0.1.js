function TCA() {
	return ! 1
}
TCA.config = function(a) {
	CPlugin.getInstance(a)
};
TCA.SM1 = "SM1";
TCA.SM4 = "SM4";
TCA.DES = "DES";
TCA.DES3 = "3DES";
TCA.AES = "AES";
TCA.RC4 = "RC4";
TCA.SM2 = "SM2";
TCA.RSA1024 = "RSA1024";
TCA.RSA2048 = "RSA2048";
TCA.SHA256 = "SHA256";
TCA.SHA1 = "SHA1";
TCA.SM3 = "SM3";
TCA.digitalSignature = 128;
TCA.nonRepudiation = 64;
TCA.keyEncipherment = 32;
TCA.dataEncipherment = 16;
TCA.keyAgreement = 8;
TCA.keyCertSign = 4;
TCA.cRLSign = 2;
TCA.encipherOnly = 1;
TCA.decipherOnly = 32768;
TCA.contentCommitment = 64;
TCA.serverAuth = "1.3.6.1.5.5.7.3.1";
TCA.clientAuth = "1.3.6.1.5.5.7.3.2";
TCA.codeSigning = "1.3.6.1.5.5.7.3.3";
TCA.emailProtection = "1.3.6.1.5.5.7.3.4";
TCA.ipsecEndSystem = "1.3.6.1.5.5.7.3.5";
TCA.ipsecTunnel = "1.3.6.1.5.5.7.3.6";
TCA.ipsecUser = "1.3.6.1.5.5.7.3.7";
TCA.timeStamping = "1.3.6.1.5.5.7.3.8";
TCA.OCSPSigning = "1.3.6.1.5.5.7.3.9";
TCA.dvcs = "1.3.6.1.5.5.7.3.10";
TCA.sbgpCertAAServerAuth = "1.3.6.1.5.5.7.3.11";
TCA.scvpResponder = "1.3.6.1.5.5.7.3.12";
TCA.eapOverPPP = "1.3.6.1.5.5.7.3.13";
TCA.eapOverLAN = "1.3.6.1.5.5.7.3.14";
TCA.scvpServer = "1.3.6.1.5.5.7.3.15";
TCA.scvpClient = "1.3.6.1.5.5.7.3.16";
TCA.ipsecIKE = "1.3.6.1.5.5.7.3.17";
TCA.capwapAC = "1.3.6.1.5.5.7.3.18";
TCA.capwapWTP = "1.3.6.1.5.5.7.3.19";
TCA.smartcardlogon = "1.3.6.1.4.1.311.20.2.2";
TCA.EX = {};
TCA.EX.szOID_RSA_MD5RSA = "1.2.840.113549.1.1.4";
TCA.EX.szOID_RSA_SHA1RSA = "1.2.840.113549.1.1.5";
TCA.EX.szOID_SM2_SM3SM2 = "1.2.156.10197.1.501";
TCA.EX.INPUT_BASE64 = 1;
TCA.EX.INPUT_HEX = 2;
TCA.EX.OUTPUT_BASE64 = 4;
TCA.EX.OUTPUT_HEX = 8;
TCA.EX.INNER_CONTENT = 16;
TCA.EX.PLAINTEXT_UTF8 = 32;
TCA.EX.ONLY_SIGNATURE = 512;
TCA.EX._pta_OverlapPeriod = 30;
TCA.EX.FUNCOPT_NOALERT = 2147483648;
TCA.EX.PARAM_FILENAME = 4096;
TCA.EX.PARAM_STRING = 8192;
TCA.EX.PTA_CALG_SHA256 = 2097152;
TCA.EX.PFX_BASE64 = 8;
TCA.EX.exkeyusagemap = {
	"1.3.6.1.5.5.7.3.1": "serverAuth",
	"1.3.6.1.5.5.7.3.2": "clientAuth",
	"1.3.6.1.5.5.7.3.3": "codeSigning",
	"1.3.6.1.5.5.7.3.4": "emailProtection",
	"1.3.6.1.5.5.7.3.5": "ipsecEndSystem",
	"1.3.6.1.5.5.7.3.6": "ipsecTunnel",
	"1.3.6.1.5.5.7.3.7": "ipsecUser",
	"1.3.6.1.5.5.7.3.8": "timeStamping",
	"1.3.6.1.5.5.7.3.9": "OCSPSigning",
	"1.3.6.1.5.5.7.3.10": "dvcs",
	"1.3.6.1.5.5.7.3.11": "sbgpCertAAServerAuth",
	"1.3.6.1.5.5.7.3.12": "scvpResponder",
	"1.3.6.1.5.5.7.3.13": "eapOverPPP",
	"1.3.6.1.5.5.7.3.14": "eapOverLAN",
	"1.3.6.1.5.5.7.3.15": "scvpServer",
	"1.3.6.1.5.5.7.3.16": "scvpClient",
	"1.3.6.1.5.5.7.3.17": "ipsecIKE",
	"1.3.6.1.5.5.7.3.18": "capwapAC",
	"1.3.6.1.5.5.7.3.19": "capwapWTP",
	"1.3.6.1.4.1.311.20.2.2": "smartcardlogon"
};
TCA.EX.URLDecode = function(a) {
	return unescape(String(a).replace(/\+/g, " "))
};
function _isStringTCACertKit(a) {
	return "string" == typeof a
}
function _isNumberTCACertKit(a) {
	return "number" == typeof a
}
function _isBooleanTCACertKit(a) {
	return "Boolean" == typeof a
}
function _isUndefinedTCACertKit(a) {
	return "undefined" == typeof a
}
function _isNullTCACertKit(a) {
	return "null" == typeof a
}
function _isObjectTCACertKit(a) {
	return "object" == typeof a
}
function CertStore(a) {
	function b(c, d, b, a, h, k) {
		try {
			this._xenroll = CPlugin.getInstance().getXEnroll();
			this._xenroll.Reset();
			this._xenroll.ProviderName = a;
			this._xenroll.ProviderType = h;
			a = 0;
			var l = h = "";
			d == TCA.RSA1024 ? (a = 67108864, h = TCA.EX.szOID_RSA_SHA1RSA, l = "SHA1") : d == TCA.RSA2048 ? (a = 134217728, h = TCA.EX.szOID_RSA_SHA1RSA, l = "SHA1") : (a = 16777216, h = TCA.EX.szOID_SM2_SM3SM2, l = "SM3");
			this._xenroll.KeySpec = 1;
			this._xenroll.DeleteRequestCert = !1;
			this._xenroll.SignAlgOId = h;
			this._xenroll.HashAlgorithm = l;
			_isStringTCACertKit(k) && "" !== k && (this._xenroll.UseExistingKeySet = !0, this._xenroll.ContainerName = k);
			this._xenroll.GenKeyFlags = a | b;
			var r = this._xenroll.generatePKCS10(c, "1.3.6.1.5.5.7.3.2");
			return new Csr(r.replace(/\r*\n/g, ""))
		} catch(m) {
			throw c = new TCACErr,
			c.addError(m.number, m.description),
			c.addError(268435459, "\u751f\u6210CSR\u65f6\u51fa\u73b0\u5f02\u5e38"),
			c;
		}
	}
	CPlugin.getInstance().getConfig("useAlias") && (a = CPlugin.getInstance().alias2Full(a));
	this._cspname = a;
	var d = function() {
		this._xenroll = CPlugin.getInstance().getXEnroll();
		this._xenroll.Reset();
		CPlugin.getInstance().getConfig("listStoreMode") && (listStoreStr = 256 | CPlugin.getInstance().getConfig("listStoreMax"));
		for (var c = {},
		d, b = 0; 1 >= b; b++) {
			this._xenroll.ProviderType = b;
			for (var a = 0; 100 > a; a++) {
				try {
					d = this._xenroll.enumProviders(a, 0)
				} catch(h) {
					break
				}
				null != d && (0 >= d.length || (c[d] = b))
			}
		}
		return c
	} ();
	if (_isNumberTCACertKit(d[a])) this._csptype = d[a];
	else throw TCACErr.newError(268435457, "\u6ca1\u6709\u627e\u5230\u5bf9\u5e94\u7684\u7c7b\u578b");
	this.genCsr = function(c, d) {
		var a = 0;
		CPlugin.getInstance().getConfig("exportKeyAble") && (a |= 1);
		if (1 == arguments.length) {
			if ("string" == typeof c) return b("CN=topca", c, a, this._cspname, this._csptype);
			if (c instanceof Certificate) {
				var e = CPlugin.getInstance().convertCert(c);
				if (null == e) throw TCACErr.newError(268435469, "\u8f93\u5165\u683c\u5f0f\u4e0d\u6b63\u786e");
				var h = c.publicKeyAlg(),
				k = c.publicKeySize();
				return b("CN=topca", "RSA" == h && 1024 == k ? TCA.RSA1024: "RSA" == h && 2048 == k ? TCA.RSA2048: TCA.SM2, a, this._cspname, this._csptype, e.KeyContainer)
			}
			return null
		}
		if (2 === arguments.length) return b(d, c, a, this._cspname, this._csptype);
		if (0 === arguments.length) return b("CN=topca", TCA.SM2, a, this._cspname, this._csptype);
		throw TCACErr.newError(268435466, "\u9519\u8bef\u7684\u8f93\u5165");
	};
	this.listCerts = function() {
		for (var c = CertStore.listAllCerts(), d = [], b = 0; b < c.size(); b++) CPlugin.getInstance().convertCert(c.get(b)).CSP == this._cspname && d.push(c.get(b));
		return new CertSet(d)
	};
	this.getSupportedKeyAlgs = function() {
		try {
			this._xenroll = CPlugin.getInstance().getXEnroll();
			this._xenroll.Reset();
			this._xenroll.ProviderName = this._cspname;
			this._xenroll.ProviderType = this._csptype;
			for (var c = [], d = 0; 40 > d; d++) {
				var b = this._xenroll.enumProviderAlg(d);
				0 !== b && (26129 == b ? c.push(TCA.AES) : 26144 == b ? c.push(TCA.SM4) : 26143 == b ? c.push(TCA.SM1) : 26115 == b && c.push(TCA.DES3))
			}
			return c
		} catch(a) {
			throw c = new TCACErr,
			c.addError(a.number, a.description).addError(268435460, "\u83b7\u53d6\u7b97\u6cd5\u65f6\u51fa\u73b0\u5f02\u5e38"),
			c;
		}
	};
	this.importPFX = function(c, d) {
		var b = CPlugin.getInstance().getPTA();
		if (0 > this._cspname.indexOf("Microsoft")) throw TCACErr.newError(268435467, "\u65e0\u6cd5\u5411\u6307\u5b9a\u7684CertStore\u4e2d\u5bfc\u5165PFX\u8bc1\u4e66");
		try {
			var a = b.ImportPKCS12(c, d, 8).GetEncodedCert(2);
			return new Certificate(a)
		} catch(h) {
			throw b = new TCACErr,
			b.addError(h.number, h.description).addError(268435468, "\u5bfc\u5165PFX\u8bc1\u4e66\u5931\u8d25"),
			b;
		}
	}
}
CertStore.listAllCerts = function() {
	try {
		CPlugin.getInstance().getPTA().Filter.Clear();
		for (var a = CPlugin.getInstance().getPTA().MyCertificates, b, d = [], c = 1; c <= a.Count; c++) b = a.Item(c),
		CPlugin.getInstance().Checlic(b) && d.push(a.Item(c).GetEncodedCert(2));
		if (!CPlugin.getInstance().getConfig("listOtherCert")) return new CertSet(d);
		for (var g = CPlugin.getInstance().getPTA().OtherCertificates, f = CPlugin.getInstance().getConfig("licOnListOtherCert"), a = 1; a <= g.Count; a++) b = g.Item(a),
		f && !CPlugin.getInstance().Checlic(b) || d.push(b.GetEncodedCert(2));
		return new CertSet(d)
	} catch(e) {
		throw b = new TCACErr,
		b.addError(e.number, e.description).addError(268435461, "\u8bfb\u53d6\u5168\u90e8\u8bc1\u4e66\u65f6\u51fa\u73b0\u5f02\u5e38"),
		b;
	}
};
CertStore.listStore = function(a) {
	var b = CPlugin.getInstance(),
	d = b.getConfig("whiteList");
	a = !0 !== b.getConfig("disableWhiteList") ? a: !1;
	var c = b.getConfig("useAlias"),
	g = b.getXEnroll();
	g.Reset();
	var f = [],
	e = 0;
	b.getConfig("listStoreMode") && (e = 256 | b.getConfig("listStoreMax"));
	for (var h, k = 0; 1 >= k; k++) {
		g.ProviderType = k;
		for (var l = 0; 100 > l; l++) {
			try {
				h = g.enumProviders(l, e)
			} catch(r) {
				break
			}
			if (null != h && !(0 >= h.length)) if (a) for (var m = 0; m < d.length; m++) {
				if (h == d[m]) {
					f.push(c ? b.full2Alias(h) : h);
					break
				}
			} else f.push(c ? b.full2Alias(h) : h)
		}
	}
	return f
};
CertStore.byName = function(a) {
	CPlugin.getInstance();
	for (var b = CertStore.listStore(!1), d = 0; d < b.length; d++) if ( - 1 != b[d].search(a)) return new CertStore(b[d]);
	return null
};
CertStore.byCert = function(a) {
	a = CPlugin.getInstance().convertCert(a);
	if (null == a) throw TCACErr.newError(268435462, "\u8bc1\u4e66\u8f6c\u6362\u51fa\u9519");
	a = CPlugin.getInstance().full2Alias(a.CSP);
	for (var b = CertStore.listStore(!1), d = 0; d < b.length; d++) if ( - 1 != b[d].search(a)) return new CertStore(a);
	return null
};
CertStore.installCert = function(a, b, d) {
	var c = CPlugin.getInstance().getXEnroll();
	c.Reset();
	var g = CPlugin.getInstance().getConfig("installMode");
	if (1 == arguments.length) try {
		return c.DeleteRequestCert = !1,
		c.WriteCertToCSP = !0,
		c.acceptPKCS7(a),
		!0
	} catch(f) {
		throw TCACErr.newError(f.number, f.description).addError(268435463, "\u5b89\u88c5\u8bc1\u4e66\u65f6\u51fa\u73b0\u5f02\u5e38");
	} else if (3 == arguments.length) {
		for (var e = d.split("&"), h = {},
		k = 0; k < e.length; k++) {
			var l = e[k].split("=");
			h[l[0]] = TCA.EX.URLDecode(l[1])
		}
		try {
			c.ContainerName = "";
			c.KeySpec = 1;
			c.DeleteRequestCert = !1;
			c.WriteCertToCSP = !0;
			var r = new Certificate(a);
			if (null == CPlugin.getInstance().convertCert(r)) throw TCACErr.newError(16777226, "\u4f20\u5165\u8bc1\u4e66\u9519\u8bef");
			var m = CPlugin.getInstance().convertCert(r).CSP,
			q = r.publicKeyAlg();
			0 <= m.indexOf("Microsoft") || 0 <= m.indexOf("iTrus") || "RSA" == q ? c.acceptSeal(a, h.userSeal, b, h.encPrivateKeyUser, h.userCipher, h.userIV) : g ? c.installEncCert(a, h.userSeal, b, h.encPrivateKeyUser, h.userCipher, h.userIV) : c.acceptSeal(a, h.userSeal, b, h.encPrivateKeyUser, h.userCipher, h.userIV);
			return ! 0
		} catch(p) {
			throw TCACErr.newError(p.number, p.description).addError(268435464, "\u5b89\u88c5\u8bc1\u4e66\u65f6\u51fa\u73b0\u5f02\u5e38");
		}
	} else throw TCACErr.newError(268435465, "\u9519\u8bef\u7684\u8f93\u5165");
};
function Certificate(a) {
	if (!_isStringTCACertKit(a)) throw TCACErr.newError(536870912, "\u9519\u8bef\u7684\u8f93\u5165\u6570\u636e");
	this._pta = CPlugin.getInstance().getPTA();
	this._b64str = a.replace(/(^\s+)|(\s+$)/g, "").replace(/-----BEGIN CERTIFICATE REQUEST-----/, "").replace(/-----END  CERTIFICATE REQUEST-----/, "");
	this._cert = this._pta.ParseCertFromB64(this._b64str);
	this.signLogondata = function(b) {
		try {
			return CPlugin.getInstance().convertCert(this._cert).SignLogonData("LOGONDATA:" + b, TCA.EX.OUTPUT_BASE64 | TCA.EX.PLAINTEXT_UTF8)
		} catch(d) {
			throw TCACErr.newError(d.number, d.description).addError(536870913, "\u7b7e\u540d\u65f6\u51fa\u73b0\u5f02\u5e38");
		}
	};
	this.serialNumber = function() {
		return this._cert.SerialNumber.toUpperCase()
	};
	this.issuer = function() {
		return this._cert.Issuer
	};
	this.notBefore = function() {
		return CPlugin.getInstance().getConfig("certDateFmtMode") ? eval(this._cert.ValidFrom) + "": eval(this._cert.ValidFrom)
	};
	this.notAfter = function() {
		return CPlugin.getInstance().getConfig("certDateFmtMode") ? eval(this._cert.ValidTo) + "": eval(this._cert.ValidTo)
	};
	this.subject = function() {
		return this._cert.Subject
	};
	this.b64str = function() {
		return this._cert.GetEncodedCert(2)
	};
	this.toBase64 = function() {
		return this._cert.GetEncodedCert(2)
	};
	this.signAlg = function() {
		var b = new ASN1.decode(Base64.unarmor(this._b64str));
		if (null === b || "" === b) return "UnknownSignAlg";
		switch (b.sub[0].sub[2].sub[0].content()) {
		case TCA.EX.szOID_SM2_SM3SM2:
			return "SM3WithSM2";
		case TCA.EX.szOID_RSA_SHA1RSA:
		case "1.3.14.3.2.29":
			return "SHA1WithRSA";
		case TCA.EX.szOID_RSA_MD5RSA:
			return "MD5WitrhRSA";
		default:
			return "UnknownSignAlg"
		}
	};
	this.publicKeyAlg = function() {
		switch (this.signAlg()) {
		case "SM3WithSM2":
			return "SM2";
		case "SHA1WithRSA":
		case "MD5WitrhRSA":
			return "RSA";
		default:
			return "UnknownAlg"
		}
	};
	this.publicKeySize = function() {
		switch (this.signAlg()) {
		case "SM3WithSM2":
			return 256;
		case "SHA1WithRSA":
		case "MD5WitrhRSA":
			switch ((new ASN1.decode(Base64.unarmor(this._b64str))).sub[0].sub[6].sub[1].sub[0].sub[0].length) {
			case 128:
			case 129:
				return 1024;
			default:
				return 2048
			}
		default:
			return - 1
		}
	};
	this.show = function() {
		this._cert.View()
	};
	this.keyUsage = function() {
		var b = this._cert.KeyUsage,
		d = [];
		if (0 === b) return d;
		b & TCA.digitalSignature && d.push("digitalSignature");
		b & TCA.nonRepudiation && d.push("nonRepudiation");
		b & TCA.keyEncipherment && d.push("keyEncipherment");
		b & TCA.dataEncipherment && d.push("dataEncipherment");
		b & TCA.keyAgreement && d.push("keyAgreement");
		b & TCA.keyCertSign && d.push("keyCertSign");
		b & TCA.cRLSign && d.push("cRLSign");
		b & TCA.encipherOnly && d.push("encipherOnly");
		b & TCA.decipherOnly && d.push("decipherOnly");
		b & TCA.contentCommitment && d.push("contentCommitment");
		return d
	};
	this.extededKeyUsage = function() {
		var b = this._cert.GetX509ExtByOID("2.5.29.37");
		if ("" === b || null === b) return null;
		for (var b = new ASN1.decode(Base64.unarmor(b)), d = [], c = 0; c < b.sub.length; c++) d.push(TCA.EX.exkeyusagemap[b.sub[c].content()]);
		return d
	};
	this.crlUrl = function() {
		var b = this._cert.GetX509ExtByOID("2.5.29.31");
		return "" === b || null === b ? null: (new ASN1.decode(Base64.unarmor(b))).sub[0].sub[0].sub[0].sub[0].content()
	};
	this.signMessage = function(b, d) {
		try {
			var c = CPlugin.getInstance().convertCert(this._cert);
			if (null == c) throw TCACErr.newError(536870917, "\u627e\u4e0d\u5230\u7b7e\u540d\u8bc1\u4e66");
			var a = TCA.EX.OUTPUT_BASE64 | TCA.EX.PLAINTEXT_UTF8,
			a = CPlugin.getInstance().getConfig("alertOnSignMessage") ? a: a | TCA.EX.FUNCOPT_NOALERT;
			if (1 == arguments.length) a |= TCA.EX.INNER_CONTENT;
			else if (2 == arguments.length) a = d ? a | TCA.EX.INNER_CONTENT: a | 0;
			else throw TCACErr.newError(536870916, "\u9519\u8bef\u7684\u8f93\u5165\u53c2\u6570");
			return c.SignMessage(b, a)
		} catch(f) {
			throw TCACErr.newError(f.number, f.description).addError(536870914, "\u7b7e\u540d\u65f6\u51fa\u73b0\u5f02\u5e38");
		}
	};
	this.encryptMessage = function(b) {
		try {
			var d = this._pta.GetEmptyCertificates();
			d.Add(this._cert);
			return d.EncryptMessage(b, TCA.EX.OUTPUT_BASE64 | TCA.EX.PLAINTEXT_UTF8)
		} catch(c) {
			throw TCACErr.newError(c.number, c.description).addError(536870915, "\u52a0\u5bc6\u6d88\u606f\u65f6\u51fa\u73b0\u5f02\u5e38");
		}
	};
	this.Delete = function() {
		try {
			return this._cert.Remove(),
			!0
		} catch(b) {
			return ! 1
		}
	};
	this.signMessageRaw = function(b, d) {
		try {
			if (2 == arguments.length) {
				var c = this.publicKeyAlg();
				if ("SM2" === c && d !== TCA.SM3 || "RSA" === c && d !== TCA.SHA1) {
					if ("RSA" === c && d === TCA.SHA256) throw TCACErr.newError(536870940, "\u5f53\u524d\u4e0d\u652f\u6301SHA256\u7b97\u6cd5");
					throw TCACErr.newError(536870941, "\u54c8\u5e0c\u7b97\u6cd5\u8f93\u5165\u9519\u8bef");
				}
			}
			var a = CPlugin.getInstance().convertCert(this._cert);
			if (null == a) throw TCACErr.newError(536870925, "\u627e\u4e0d\u5230\u7b7e\u540d\u8bc1\u4e66");
			var f = TCA.EX.OUTPUT_BASE64 | TCA.EX.ONLY_SIGNATURE | TCA.EX.INNER_CONTENT,
			f = CPlugin.getInstance().getConfig("alertOnSignMessage") ? f: f | TCA.EX.FUNCOPT_NOALERT;
			return a.SignMessage(b, f)
		} catch(e) {
			throw TCACErr.newError(e.number, e.description).addError(536870926, "\u6d88\u606f\u88f8\u7b7e\u540d\u51fa\u9519");
		}
	};
	this.verifyRaw = function(b, d, c) {
		try {
			if (3 == arguments.length) {
				var a = this.publicKeyAlg();
				if ("SM2" === a && c !== TCA.SM3 || "RSA" === a && c !== TCA.SHA1) {
					if ("RSA" === a && c === TCA.SHA256) throw TCACErr.newError(536870942, "\u5f53\u524d\u4e0d\u652f\u6301SHA256\u7b97\u6cd5");
					throw TCACErr.newError(536870943, "\u54c8\u5e0c\u7b97\u6cd5\u8f93\u5165\u9519\u8bef");
				}
			}
			var f = CPlugin.getInstance().convertCert(this._cert);
			if (null == f) throw TCACErr.newError(536870927, "\u627e\u4e0d\u5230\u9a8c\u7b7e\u8bc1\u4e66");
			return f.VerifySignature(b, TCA.EX.PARAM_STRING | TCA.EX.INPUT_BASE64, d, TCA.EX.PARAM_STRING)
		} catch(e) {
			throw TCACErr.newError(e.number, e.description).addError(536870928, "P1\u9a8c\u7b7e\u51fa\u73b0\u5f02\u5e38");
		}
	};
	this.encryptRaw = function(b) {
		try {
			var d = CPlugin.getInstance().convertCert(this._cert);
			if (null == d) throw TCACErr.newError(536870930, "\u627e\u4e0d\u5230\u52a0\u5bc6\u8bc1\u4e66");
			var c = this.publicKeyAlg(),
			a = this.publicKeySize();
			if ("RSA" == c && b.length > a / 8 - 11) throw TCACErr.newError(536870952, "\u52a0\u5bc6\u6570\u636e\u8fc7\u957f");
			inputOPT = TCA.EX.PARAM_STRING | TCA.EX.PLAINTEXT_UTF8;
			outputOPT = TCA.EX.PARAM_STRING | TCA.EX.OUTPUT_BASE64;
			return d.encrypt(b, inputOPT, "", outputOPT)
		} catch(f) {
			throw TCACErr.newError(f.number, f.description).addError(536870929, "\u52a0\u5bc6\u6d88\u606f\u65f6\u51fa\u73b0\u5f02\u5e38");
		}
	};
	this.decryptRaw = function(b) {
		try {
			var d = CPlugin.getInstance().convertCert(this._cert);
			if (null == d) throw TCACErr.newError(536870931, "\u627e\u4e0d\u5230\u89e3\u5bc6\u8bc1\u4e66");
			return d.decrypt(b, TCA.EX.INPUT_BASE64 | TCA.EX.PARAM_STRING, "", TCA.EX.PLAINTEXT_UTF8 | TCA.EX.PARAM_STRING)
		} catch(c) {
			throw TCACErr.newError(c.number, c.description).addError(536870932, "\u89e3\u5bc6\u6d88\u606f\u65f6\u51fa\u73b0\u5f02\u5e38");
		}
	};
	this.signFile2File = function(b, d, c) {
		try {
			if (3 == arguments.length) {
				var a = this.publicKeyAlg();
				if ("SM2" === a && c !== TCA.SM3 || "RSA" === a && c !== TCA.SHA1) {
					if ("RSA" === a && c === TCA.SHA256) throw TCACErr.newError(536870944, "\u5f53\u524d\u4e0d\u652f\u6301SHA256\u7b97\u6cd5");
					throw TCACErr.newError(536870945, "\u54c8\u5e0c\u7b97\u6cd5\u8f93\u5165\u9519\u8bef");
				}
			}
			var f = CPlugin.getInstance().convertCert(this._cert);
			if (null == f) throw TCACErr.newError(536870933, "\u627e\u4e0d\u5230\u7b7e\u540d\u8bc1\u4e66");
			var e = TCA.EX.OUTPUT_BASE64 | TCA.EX.PLAINTEXT_UTF8 | TCA.EX.INNER_CONTENT,
			e = CPlugin.getInstance().getConfig("alertOnSignMessage") ? e: e | TCA.EX.FUNCOPT_NOALERT;
			return f.SignFileEx(b, d, e)
		} catch(h) {
			throw TCACErr.newError(h.number, h.description).addError(536870934, "\u52a0\u5bc6\u6d88\u606f\u65f6\u51fa\u73b0\u5f02\u5e38");
		}
	};
	this.verifyFile = function(a, d, c) {
		try {
			if (3 == arguments.length) {
				var g = this.publicKeyAlg();
				if ("SM2" === g && c !== TCA.SM3 || "RSA" === g && c !== TCA.SHA1) {
					if ("RSA" === g && c === TCA.SHA256) throw TCACErr.newError(536870946, "\u5f53\u524d\u4e0d\u652f\u6301SHA256\u7b97\u6cd5");
					throw TCACErr.newError(536870947, "\u54c8\u5e0c\u7b97\u6cd5\u8f93\u5165\u9519\u8bef");
				}
			}
			return this._pta.VerifySignatureEx(a, TCA.EX.PARAM_FILENAME, d, TCA.EX.PARAM_FILENAME | TCA.EX.INPUT_BASE64, 3)
		} catch(f) {
			throw TCACErr.newError(f.number, f.description).addError(536870935, "\u9a8c\u7b7e\u6587\u4ef6\u65f6\u51fa\u73b0\u5f02\u5e38");
		}
	};
	this.signFileRaw = function(a, d) {
		try {
			if (2 == arguments.length) {
				var c = this.publicKeyAlg();
				if ("SM2" === c && d !== TCA.SM3 || "RSA" === c && d !== TCA.SHA1) {
					if ("RSA" === c && d === TCA.SHA256) throw TCACErr.newError(536870948, "\u5f53\u524d\u4e0d\u652f\u6301SHA256\u7b97\u6cd5");
					throw TCACErr.newError(536870949, "\u54c8\u5e0c\u7b97\u6cd5\u8f93\u5165\u9519\u8bef");
				}
			}
			var g = CPlugin.getInstance().convertCert(this._cert);
			if (null == g) throw TCACErr.newError(536870936, "\u627e\u4e0d\u5230\u7b7e\u540d\u8bc1\u4e66");
			var f = TCA.EX.OUTPUT_BASE64 | TCA.EX.ONLY_SIGNATURE | TCA.EX.INNER_CONTENT | TCA.EX.PARAM_FILENAME,
			f = CPlugin.getInstance().getConfig("alertOnSignMessage") ? f: f | TCA.EX.FUNCOPT_NOALERT;
			return g.SignFile(a, f)
		} catch(e) {
			throw TCACErr.newError(e.number, e.description).addError(536870937, "\u7b7e\u540d\u6587\u4ef6\u65f6\u51fa\u73b0\u5f02\u5e38");
		}
	};
	this.verifyFileRaw = function(a, d, c) {
		try {
			if (3 == arguments.length) {
				var g = this.publicKeyAlg();
				if ("SM2" === g && c !== TCA.SM3 || "RSA" === g && c !== TCA.SHA1) {
					if ("RSA" === g && c === TCA.SHA256) throw TCACErr.newError(536870950, "\u5f53\u524d\u4e0d\u652f\u6301SHA256\u7b97\u6cd5");
					throw TCACErr.newError(536870951, "\u54c8\u5e0c\u7b97\u6cd5\u8f93\u5165\u9519\u8bef");
				}
			}
			var f = CPlugin.getInstance().convertCert(this._cert);
			if (null == f) throw TCACErr.newError(536870938, "\u627e\u4e0d\u5230\u9a8c\u7b7e\u8bc1\u4e66");
			return f.VerifySignature(a, TCA.EX.PARAM_STRING | TCA.EX.INPUT_BASE64, d, TCA.EX.PARAM_FILENAME)
		} catch(e) {
			throw TCACErr.newError(e.number, e.description).addError(536870939, "\u9a8c\u7b7e\u65f6\u51fa\u73b0\u5f02\u5e38");
		}
	};
	this.exportPFX = function(a) {
		var d = null,
		c = CPlugin.getInstance().convertCert(this._cert);
		if (null == c) throw TCACErr.newError(536870919, "\u627e\u4e0d\u5230\u8bc1\u4e66");
		var g = c.CSP,
		f = this.publicKeyAlg();
		if (null === a || "" === a) throw TCACErr.newError(536870924, "\u9519\u8bef\u7684\u8f93\u5165\u53c2\u6570");
		if (0 > f.indexOf("RSA")) throw TCACErr.newError(536870920, "\u4e0d\u652f\u6301\u5bfc\u51faRSA\u7b97\u6cd5\u4ee5\u5916\u7684\u8bc1\u4e66");
		if (0 != g.indexOf("Microsoft")) throw TCACErr.newError(536870921, "\u4ec5\u652f\u6301\u5bfc\u51fa\u8f6f\u8bc1\u4e66");
		try {
			d = c.ExportPKCS12(a, TCA.EX.PFX_BASE64, "123");
			if (null === d || "" === d) throw TCACErr.newError(536870922, "\u5bfc\u51fa\u5931\u8d25");
			return d
		} catch(e) {
			throw TCACErr.newError(e.number, e.description).addError(536870923, "\u5bfc\u51fa\u5931\u8d25");
		}
	}
}
function Csr(a) {
	this._data = Base64.unarmor(a);
	this._asn1 = new ASN1.decode(this._data);
	this._subject = "";
	this._b64str = a;
	a = this._asn1.sub[0].sub[1];
	for (var b = {
		"2.5.4.3": "CN",
		"2.5.4.11": "OU",
		"2.5.4.10": "O",
		"2.5.4.6": "C"
	},
	d = 0; d < a.sub.length; d++) {
		var c = a.sub[d].sub[0].sub[0].content(),
		g = a.sub[d].sub[0].sub[1].content();
		this._subject += b[c] + "=" + g + ", "
	}
	this._subject = this._subject.substr(0, this._subject.length - 2);
	this.subject = function() {
		return this._subject
	};
	this.toBase64 = function() {
		return this._b64str
	};
	this.toPEM = function() {
		for (var c = "-----BEGIN CERTIFICATE REQUEST-----\n",
		a = this._b64str.length / 64,
		d = 0; d < a; d++) c += this._b64str.substr(64 * d, 64) + "\n";
		0 != this._b64str.length % 64 && (c += this._b64str.substr(64 * a, this._b64str.length - 64 * a));
		return c + "\n-----END  CERTIFICATE REQUEST-----"
	}
}
function Pkcs7(a) {
	if ("" === a || null == a || !_isStringTCACertKit(a)) throw TCACErr.newError(805306378, "\u9519\u8bef\u7684\u8f93\u5165\u6570\u636e");
	this._pta = CPlugin.getInstance().getPTA();
	this._b64str = a;
	this._asn1 = new ASN1.decode(Base64.unarmor(a));
	this._status = null;
	if ("1.2.840.113549.1.7.2" == this._asn1.sub[0].content()) this._status = 2;
	else if ("1.2.840.113549.1.7.3" == this._asn1.sub[0].content()) this._status = 1;
	else throw TCACErr.newError(805306369, "\u9519\u8bef\u7684\u8f93\u5165\u6570\u636e");
	this.contentMessage = function() {
		if (2 != this._status) throw TCACErr.newError(805306374, "\u9519\u8bef\u7684P7\u7c7b\u578b");
		try {
			return this._pta.GetContentFromSignStr(this._b64str, TCA.EX.INPUT_BASE64)
		} catch(a) {
			throw TCACErr.newError(a.number, a.description).addError(805306375, "\u83b7\u53d6\u7b7e\u540d\u539f\u6587\u65f6\u51fa\u73b0\u9519\u8bef");
		}
	};
	this.verify = function(a) {
		if (2 != this._status) throw TCACErr.newError(805306372, "\u9519\u8bef\u7684P7\u7c7b\u578b");
		try {
			var d = void 0 === a ? "": a,
			c = void 0 === a ? TCA.EX.INNER_CONTENT: 0,
			c = c | TCA.EX.INPUT_BASE64 | TCA.EX.PLAINTEXT_UTF8,
			g = this._pta.VerifySignature(d, this._b64str, c);
			if (null === g || "" === g) throw TCACErr.newError(805306376, "\u9a8c\u7b7e\u65b9\u6cd5\u5185\u90e8\u9519\u8bef");
			return new Certificate(g.GetEncodedCert(2))
		} catch(f) {
			throw TCACErr.newError(f.number, f.description).addError(805306373, "\u9a8c\u8bc1\u7b7e\u540d\u65f6\u51fa\u73b0\u9519\u8bef");
		}
	};
	this.decryptMessage = function() {
		if (1 != this._status) throw TCACErr.newError(805306371, "\u9519\u8bef\u7684P7\u7c7b\u578b");
		try {
			var a = this._pta.DecryptMessage(this._b64str, TCA.EX.INPUT_BASE64 | TCA.EX.PLAINTEXT_UTF8);
			if (null === a || "" === a) throw TCACErr.newError(805306377, "\u89e3\u5bc6\u65b9\u6cd5\u5185\u90e8\u9519\u8bef");
			return a
		} catch(d) {
			throw TCACErr.newError(d.number, d.description).addError(805306370, "\u89e3\u5bc6\u65f6\u51fa\u73b0\u9519\u8bef");
		}
	};
	this.toBase64 = function() {
		return this._b64str.replace(/(^\s+)|(\s+$)/g, "").replace(/-----BEGIN CERTIFICATE REQUEST-----/, "").replace(/-----END  CERTIFICATE REQUEST-----/, "")
	}
}
function CertSet(a) {
	this._pta = CPlugin.getInstance().getPTA();
	this._certs = this._pta.GetEmptyCertificates();
	if (a instanceof Array) {
		if (0 != a.length) {
			var b = a[0];
			if (b instanceof Certificate) for (b = 0; b < a.length; b++) this._certs.Add(a[0]._cert);
			else if ("string" == typeof b) for (b = 0; b < a.length; b++) this._certs.Add(this._pta.ParseCertFromB64(a[b]));
			else throw TCACErr.newError(1073741825, "\u9519\u8bef\u7684\u8f93\u5165\u6570\u636e");
		}
	} else if ("string" == typeof a) this._certs.Add(this._pta.ParseCertFromB64(a));
	else if (a instanceof Pkcs7) {
		b = this._pta.GetCertsFromSignStr(a.toBase64(), TCA.EX.INPUT_BASE64);
		if (null === b || "" === b) throw TCACErr.newError(1073741830, "\u9519\u8bef\u7684\u8f93\u5165\u6570\u636e");
		this._certs = b
	} else if (0 != arguments.length) throw TCACErr.newError(1073741826, "\u9519\u8bef\u7684\u8f93\u5165\u6570\u636e");
	this.size = function() {
		return this._certs.Count
	};
	this.get = function(a) {
		return new Certificate(this._certs.Item(parseInt(a) + 1).GetEncodedCert(2))
	};
	this.uiSelect = function(a) {
		try {
			var c = function() {
				var a = document.getElementById("msgDiv");
				b--;
				a.style.display = "none"; (a = document.getElementById("bgDiv")) && 0 >= b && (document.body.removeChild(a), b = 0)
			},
			b = 0,
			f = "";
			if (null == this._pta.Version || "" == this._pta.Version) return null;
			for (var e = 1; e <= this._certs.Count; e++) this._certs.Item(e),
			f = f + "<table style='table-layout:fixed;'><tr style='line-height:32px;'><td style='white-space:nowrap;padding-left:10px;'><input type='radio' name='VoteOption1' value=" + (e - 1) + ">\u4e3b\u9898\uff1a" + this._certs.Item(e).Subject + "</td></tr><tr><td style='line-height:18px;padding-left:30px;white-space:nowrap;'><li>\u9881\u53d1\u8005\uff1a" + this._certs.Item(e).Issuer + "</li></td></tr><tr><td style='line-height:18px;padding-left:30px;white-space:nowrap;'><li>\u5e8f\u5217\u53f7\uff1a" + this._certs.Item(e).SerialNumber + "</li></td></tr></table>";
			var f = '<div id="msgDiv" style="position:absolute;display:none;top:20%;left:35%;width:500px;height:320px;background-color:#ECECEC;z-index:2;border:6px solid #99CCFF;"><div style="height:30px;background-color:#99CCFF;line-height:30px;text-align:center;font-size:16;font-weight:bold">\u9009\u62e9\u8bc1\u4e66</div><div style="height:77%; OVERFLOW-Y: auto;background-color:#FFFFFF;border:1px solid #000000"><form name=\'form1\'>' + f + '</form></div><div style=\'text-align:center;padding-top:10;\'><input id="submit" type="button" value="\u786e\u8ba4" style=\'width:100;\'>&nbsp;&nbsp;&nbsp;&nbsp;<input id="close" type="button" value="\u53d6\u6d88"  style=\'width:100px;\'></div></div>',
			h = document.getElementById("Div1");
			if (null === h || "" === h) h = document.createElement("div1"),
			h.setAttribute("id", "Div1"),
			document.body.appendChild(h),
			h.innerHTML = f;
			document.getElementById("msgDiv");
			document.getElementById("inpDiv");
			var k = document.getElementById("msgDiv"),
			h = document.getElementById("bgDiv"); ! h && 0 >= b && (h = document.createElement("div"), h.setAttribute("id", "bgDiv"), h.style.cssText = "position:absolute;left:0px;top:0px;width:" + screen.availWidth + "px;height:" + screen.availHeight + "px;filter:Alpha(Opacity=30);opacity:0.6;background-color:#000000;z-index:1;", document.body.appendChild(h));
			b++;
			k.style.display = "block";
			k.style.zIndex = 101;
			$("#close").bind("click",
			function() {
				c();
				a( - 1);
				$("#Div1").remove();
				$("#close").unbind()
			});
			$("#submit").bind("click",
			function() {
				var b = document.form1.VoteOption1,
				e = b.length,
				l = null;
				void 0 == e && (void 0 == b && alert(null), e = 1, c(), a(1), $("#submit").unbind());
				for (theRadioI = 0; theRadioI < e; theRadioI++) if (b[theRadioI].checked) {
					l = b[theRadioI].value;
					break
				}
				null != l && (c(), a(l), $("#Div1").remove(), $("#submit").unbind())
			});
			return ! 0
		} catch(l) {
			throw TCACErr.newError(l.number, l.description).addError(1073741829, "\u63d0\u4ea4\u7ed3\u679c\u65f6\u51fa\u73b0\u9519\u8bef");
		}
	};
	this.encryptMessage = function(a) {
		try {
			return certs.EncryptMessage(a, TCA.EX.OUTPUT_BASE64 | TCA.EX.PLAINTEXT_UTF8)
		} catch(c) {
			throw TCACErr.newError(c.number, c.description).addError(1073741827, "\u52a0\u5bc6\u65f6\u51fa\u73b0\u9519\u8bef");
		}
	};
	this.forSign = function() {
		return this.byKeyUsage(128)
	};
	this.forEncrypt = function() {
		return this.byKeyUsage(32)
	};
	this.byKeyUsage = function(a) {
		var c = 0;
		if (a instanceof Array) for (var b = 0; b < a.length; b++)"digitalSignature" == a[b] ? c |= 128 : "nonRepudiation" == a[b] ? c |= 64 : "keyEncipherment" == a[b] ? c |= 32 : "dataEncipherment" == a[b] ? c |= 16 : "keyAgreement" == a[b] ? c |= 8 : "keyCertSign" == a[b] ? c |= 4 : "cRLSign" == a[b] ? c |= 2 : "encipherOnly" == a[b] ? c |= 1 : "decipherOnly" == a[b] ? c |= 32768 : "contentCommitment" == a[b] && (c |= 64);
		else if ("number" == typeof a) c = a;
		else throw TCACErr.newError(1073741828, "\u9519\u8bef\u7684\u8f93\u5165\u6570\u636e");
		a = [];
		for (b = 1; b <= this._certs.Count; b++) if ((this._certs.Item(b).KeyUsage & c) == c) {
			var f = this._certs.Item(b);
			CPlugin.getInstance().Checlic(f) && a.push(this._certs.Item(b).GetEncodedCert(2))
		}
		return 0 == a.length ? new CertSet: new CertSet(a)
	};
	this.byValidity = function(a) {
		var c;
		c = 0 == arguments.length ? new Date: new Date(a);
		var b = [];
		if (null != c) for (var f = 1; f <= this._certs.Count; f++) {
			var e = eval(this._certs.Item(f).ValidTo),
			h = eval(this._certs.Item(f).ValidFrom);
			e >= c && c >= h && (e = this._certs.Item(f), CPlugin.getInstance().Checlic(e) && b.push(this._certs.Item(f).GetEncodedCert(2)))
		}
		return 0 == b.length ? new CertSet: new CertSet(b)
	};
	this.byIssuer = function(a) {
		for (var c = [], b = 1; b <= this._certs.Count; b++) if (0 <= this._certs.Item(b).Issuer.search(a)) {
			var f = this._certs.Item(b);
			CPlugin.getInstance().Checlic(f) && c.push(this._certs.Item(b).GetEncodedCert(2))
		}
		return 0 == c.length ? new CertSet: new CertSet(c)
	};
	this.bySubjcet = function(a) {
		for (var b = [], g = 1; g <= this._certs.Count; g++) if (0 <= this._certs.Item(g).Subject.search(a)) {
			var f = this._certs.Item(g);
			CPlugin.getInstance().Checlic(f) && b.push(this._certs.Item(g).GetEncodedCert(2))
		}
		return 0 == b.length ? new CertSet: new CertSet(b)
	};
	this.bySerialnumber = function(a) {
		for (var b = 1; b <= this._certs.Count; b++) if (this._certs.Item(b).SerialNumber === a.toLowerCase()) return new CertSet(this._certs.Item(b).GetEncodedCert(2));
		return new CertSet
	}
}
var CPlugin = function() {
	function a(a) {
		e._config = {};
		e._config.certkitClsID = void 0 !== a.certkitClsID ? a.certkitClsID: "AC6C7891-96FC-4d2b-9A16-6C51EDD9F109";
		e._config.certkitPrgID = void 0 !== a.certkitPrgID ? a.certkitPrgID: "TopCertKit.CertKit.Version.1";
		e._config.certkitVer = void 0 !== a.certkitVer ? a.certKitVer: "0,0,0,10";
		e._config.ptaVer = void 0 !== a.ptaVer ? a.ptaVer: "0,0,0,15";
		e._config.xenrollVer = void 0 !== a.xenrollVer ? a.xenrollVer: "0,0,0,5";
		e._config.useAlias = void 0 !== a.useAlias ? a.useAlias: !0;
		e._config.disableExeUrl = void 0 !== a.disableExeUrl ? a.disableExeUrl: !1;
		e._config.cspAlias = void 0 !== a.cspAlias ? a.cspAlias: {
			"RSA\u8f6f\u8bc1\u4e66": "Microsoft Enhanced Cryptographic Provider v1.0",
			"\u98de\u5929 ePass 3000 GM": "EnterSafe ePass3000GM CSP v1.0",
			"\u534e\u5927\u667a\u5b9d SJK102": "CIDC Cryptographic Service Provider v3.0.0",
			"SM2\u8f6f\u8bc1\u4e66": "iTrusChina Cryptographic Service Provider v1.0.0",
			"\u795e\u5dde\u9f99\u82af": "ChinaCpu USB Key CSP v1.0"
		};
		e._config.disableWhiteList = void 0 !== a.disableWhiteList ? a.disableWhiteList: !1;
		e._config.whiteList = void 0 !== a.whiteList ? a.whiteList: ["Microsoft Enhanced Cryptographic Provider v1.0", "iTrusChina Cryptographic Service Provider v1.0.0"];
		e._config.lic = void 0 !== a.license ? a.license: null;
		e._config.licinfo = null;
		e._config.exeVer = "0.0.0.13";
		e._config.cabVer = "0.0.0.13";
		e._config.autoExePath = void 0 !== a.autoExePath ? a.autoExePath: !1;
		e._config.autoCabPath = void 0 !== a.autoCabPath ? a.autoCabPath: !1;
		e._config.autoAuth = void 0 !== a.autoAuth ? a.autoAuth: !1;
		e._config.authStatus = !1;
		e._config.SSLPath = void 0 !== a.SSLPath ? a.SSLPath: null;
		e._config.installMode = void 0 !== a.installMode ? a.installMode: !0;
		if (void 0 != a.alertOnSignMessage) throw TCACErr.newError(4278231041, "\u4f7f\u7528\u4e86\u4e0d\u518d\u652f\u6301\u7684\u914d\u7f6e\u9879 \uff1aalertOnSignMessage");
		e._config.alertOnSignMessage = !0;
		for (var b, c = document.getElementsByTagName("script"), d = 0; d < c.length; d++) if (b = c[d].getAttribute("src"), null != b && !(0 > b.search("TopCertKit-\\d{5}.js"))) {
			b = b.match("(.*/)+")[0];
			break
		}
		e._config.exepath = void 0 === a.exepath ? b + "TopCertKit-" + e._config.exeVer + ".exe": a.exepath;
		e._config.cabpath = void 0 === a.cabpath ? b + "TopCertKit-" + e._config.exeVer + ".cab": a.cabpath;
		null != e._config.SSLPath && (e._config.alertOnSignMessage = !(0 <= window.location.protocol.indexOf("https") && 0 <= window.location.host.indexOf(e._config.SSLPath)));
		e._config.listStoreMode = void 0 !== a.listStoreMode ? a.listStoreMode: 1;
		e._config.listStoreMax = void 0 !== a.listStoreMax ? a.listStoreMax: 48;
		0 != e._config.listStoreMode && 1 != e._config.listStoreMode && (e._config.listStoreMode = 1);
		if (48 > e._config.listStoreMax || 255 < e._config.listStoreMax) e._config.listStoreMax = 48;
		e._config.listOtherCert = !0;
		e._config.licOnListOtherCert = !0;
		e._config.licver = "1.0.0.0";
		e._config.licsoftver = "3.1.0.0";
		e._config.addCspAlias = void 0 !== a.addCspAlias ? a.addCspAlias: {};
		for (var f in e._config.addCspAlias) e._config.cspAlias[f] = e._config.addCspAlias[f];
		e._config.addWhiteList = void 0 !== a.addWhiteList ? a.addWhiteList: [];
		for (d = 0; d < e._config.addWhiteList.length; d++) e._config.whiteList.push(e._config.addWhiteList[d]);
		e._config.autoAuthIsRunning = !1;
		e._config.autoAuthInterval = void 0 !== a.autoAuthInterval ? a.autoAuthInterval: 3E5;
		e._config.certDateFmtMode = void 0 !== a.certDateFmtMode ? a.certDateFmtMode: !1;
		e._config.exportKeyAble = void 0 !== a.exportKeyAble ? a.exportKeyAble: !0
	}
	function b() {
		if (null == e._config.lic) throw TCACErr.newError(4278190335, "\u672a\u53d1\u73b0\u6709\u6548License!");
		var a = e._pta.checkLic(e._config.lic, "", 0);
		if (null === a || "" === a) throw TCACErr.newError(4278190591, "\u9a8c\u8bc1License\u5931\u8d25");
		e._config.licinfo = eval("(" + a + ")");
		if (0 != e._config.licver.substr(0, 3).indexOf(e._config.licinfo.version.substr(0, 3))) throw TCACErr.newError(4278191103, "\u672a\u4f7f\u7528\u6709\u6548License");
		if (0 != e._config.licsoftver.substr(0, 3).indexOf(e._config.licinfo.softVersion.substr(0, 3))) throw TCACErr.newError(4278191871, "\u672a\u4f7f\u7528\u6709\u6548License");
		var a = new Date,
		b = e._config.licinfo.notbefore.split("-"),
		c = e._config.licinfo.notafter.split("-");
		if (new Date(c[0], c[1] - 1, c[2]) < a || new Date(b[0], b[1] - 1, b[2]) > a) throw TCACErr.newError(4278191615, "\u672a\u4f7f\u7528\u6709\u6548License");
	}
	function d() {
		e._config.disableExeUrl || (window.location.href = e._config.exepath)
	}
	function c(a, b, c) {
		var d = null,
		d = c.split(",");
		c = (parseInt(d[0]) << 24) + (parseInt(d[1]) << 16) + (parseInt(d[2]) << 8) + parseInt(d[3]);
		d = b ? a.Version() : a.Version;
		if (d == c) return 0;
		if (d < c) return - 1;
		if (d > c) return 1
	}
	function g() {
		var a = e._pta,
		b = a.gen();
		e._config.authStatus = function(b) {
			for (var c, d = "d={'winterIsComing': \"" + b + '", \'v\' : "1"}',
			e, f = document.getElementsByTagName("script"), g = 0; g < f.length; g++) if (e = f[g].getAttribute("src"), null != e && !(0 > e.search("TopCertKit-\\d{5}.js"))) {
				e = e.match("(.*/)+")[0] + "../../certKit/certVerify";
				break
			}
			e = window.location.toString().split("/")[0] + "//" + window.location.host + e;
			$.ajax({
				type: "post",
				async: !1,
				url: e,
				dataType: "json",
				data: d,
				success: function(d) {
					c = a.checkToken(b, d.t)
				},
				error: function(a, b, d) {
					c = !1
				}
			});
			return c
		} (b)
	}
	var f = null,
	e = {
		_pta: null,
		_certkit: null,
		_xenroll: null,
		_config: null
	};
	a({});
	var h = function() {
		this.getPTA = function() {
			if (null === e._pta || void 0 === e._pta) throw TCACErr.newError(4278192383, "\u672a\u80fd\u52a0\u8f7d\u5ba2\u6237\u7aef\u7ec4\u4ef6");
			return e._pta
		};
		this.getXEnroll = function() {
			if (null === e._xenroll || void 0 === e._xenroll) throw TCACErr.newError(4278192639, "\u672a\u80fd\u52a0\u8f7d\u5ba2\u6237\u7aef\u7ec4\u4ef6");
			return e._xenroll
		};
		this.getCertKit = function() {
			if (null === e._certkit || void 0 === e._certkit) throw TCACErr.newError(4278192895, "\u672a\u80fd\u52a0\u8f7d\u5ba2\u6237\u7aef\u7ec4\u4ef6");
			return e._certkit
		};
		this.full2Alias = function(a) {
			for (var b in e._config.cspAlias) if (e._config.cspAlias[b] == a) return b;
			return a
		};
		this.alias2Full = function(a) {
			var b = e._config.cspAlias[a];
			return void 0 === b ? a: b
		};
		this.convertCert = function(a) {
			var b = k().getPTA().Filter;
			if (a instanceof Certificate) b.SerialNumber = a.serialNumber();
			else try {
				b.SerialNumber = a.SerialNumber
			} catch(c) {
				return null
			}
			a = k().getPTA().MyCertificates;
			b = k().getPTA().OtherCertificates;
			return 0 != a.Count ? a.Item(1) : 0 != b.Count ? b.Item(1) : null
		};
		this.getConfig = function(a) {
			return e._config[a]
		};
		this.getLicInfo = function(a) {
			if (null == e._config.licinfo) throw TCACErr.newError(4278190847, "\u672a\u8bbe\u7f6e\u6709\u6548License!");
			return e._config.licinfo[a]
		};
		this.Checlic = function(a) {
			if (1 == CPlugin.getInstance().getConfig("authStatus")) return ! 0;
			a = a.Issuer;
			var b = CPlugin.getInstance().getLicInfo("Issuer");
			return (new RegExp(b)).test(a) ? !0 : !1
		}
	},
	k = function(l) {
		void 0 !== l && a(l);
		if (!f) {
			var k, m, q;
			l = navigator.userAgent;
			if (0 < l.indexOf("MSIE") || -1 < l.toLocaleLowerCase().indexOf("trident")) try {
				var p = "<object id='CertKit' classid='clsid:" + e._config.certkitClsID + "' ",
				p = p + "></object>",
				n = document.getElementById("CertKitDiv");
				if (null === n || "" === n) n = document.createElement("div"),
				n.setAttribute("id", "CertKitDiv"),
				document.body.appendChild(n),
				n.innerHTML = p;
				k = document.getElementById("CertKit")
			} catch(s) {
				k = null
			} else try {
				m = "<embed id='CertKit' type='application/" + e._config.certkitPrgID + "' width='0' height='0'></embed>";
				q = navigator.plugins.length;
				p = null;
				for (n = 0; n < q; n++) if ( - 1 < navigator.plugins[n].name.indexOf("TopCertKit")) {
					p = $(m).appendTo(document.body)[0];
					break
				}
				k = p
			} catch(t) {
				k = null
			}
			if (null == k || void 0 == c(k, !1, e._config.certkitVer)) throw d(),
			TCACErr.newError(4278192127, "\u672a\u80fd\u52a0\u8f7d\u5ba2\u6237\u7aef\u7ec4\u4ef6");
			m = k.GetPTA();
			q = k.GetXEnroll();
			0 == c(m, !1, e._config.ptaVer) && 0 == c(q, !0, e._config.xenrollVer) || d();
			e._certkit = k;
			e._pta = m;
			e._xenroll = q;
			e._config.autoAuth ? e._config.autoAuthIsRunning || (g(), setInterval(g, e._config.autoAuthInterval) && (e._config.autoAuthIsRunning = !0)) : b();
			f = new h
		}
		return f
	};
	return {
		getInstance: k
	}
} ();
function TCACErr() {
	this._errarr = [];
	this.addError = function(a, b) {
		this.number = a;
		this.description = b;
		this._errarr.push({
			code: a.toString(16),
			msg: b
		});
		return this
	};
	this.toStr = function() {
		for (var a = "",
		b = 0; b < this._errarr.length; b++) a += this._errarr[b].msg + "   \u9519\u8bef\u7801\uff1a0x" + this._errarr[b].code + ", ";
		return a.substr(0, a.length - 2)
	}
}
TCACErr.prototype = Error();
TCACErr.newError = function(a, b) {
	return (new TCACErr).addError(a, b)
};
var Base64 = {
	decode: function(a) {
		try {
			var b;
			if (void 0 === Base64.decoder) {
				var d = [];
				for (b = 0; 64 > b; ++b) d["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(b)] = b;
				for (b = 0; 9 > b; ++b) d["= \f\n\r\t\u00a0\u2028\u2029".charAt(b)] = -1;
				Base64.decoder = d
			}
			var d = [],
			c = 0,
			g = 0;
			for (b = 0; b < a.length; ++b) {
				var f = a.charAt(b);
				if ("=" == f) break;
				f = Base64.decoder[f];
				if ( - 1 != f) {
					if (void 0 === f) throw "Illegal character at offset " + b;
					c |= f;
					4 <= ++g ? (d[d.length] = c >> 16, d[d.length] = c >> 8 & 255, d[d.length] = c & 255, g = c = 0) : c <<= 6
				}
			}
			switch (g) {
			case 1:
				throw "Base64 encoding incomplete: at least 2 bits missing";
			case 2:
				d[d.length] = c >> 10;
				break;
			case 3:
				d[d.length] = c >> 16,
				d[d.length] = c >> 8 & 255
			}
			return d
		} catch(e) {
			alert(e)
		}
	},
	re: /-----BEGIN [^-]+-----([A-Za-z0-9+\/=\s]+)-----END [^-]+-----|begin-base64[^\n]+\n([A-Za-z0-9+\/=\s]+)====/,
	unarmor: function(a) {
		try {
			var b = Base64.re.exec(a);
			if (b) if (b[1]) a = b[1];
			else if (b[2]) a = b[2];
			else throw "RegExp out of sync";
			return Base64.decode(a)
		} catch(d) {
			alert(d)
		}
	}
};
function Stream(a, b) {
	try {
		a instanceof Stream ? (this.enc = a.enc, this.pos = a.pos) : (this.enc = a, this.pos = b)
	} catch(d) {}
}
Stream.prototype.ellipsis = "\u2026";
Stream.prototype.get = function(a) {
	try {
		return void 0 === a && (a = this.pos++),
		this.enc[a]
	} catch(b) {
		alert(b)
	}
};
Stream.prototype.hexDigits = "0123456789ABCDEF";
Stream.prototype.hexByte = function(a) {
	return this.hexDigits.charAt(a >> 4 & 15) + this.hexDigits.charAt(a & 15)
};
Stream.prototype.hexDump = function(a, b, d) {
	try {
		for (var c = ""; a < b; ++a) if (c += this.hexByte(this.get(a)), !0 !== d) switch (a & 15) {
		case 7:
			c += "  ";
			break;
		case 15:
			c += "\n";
			break;
		default:
			c += " "
		}
		return c
	} catch(g) {}
};
Stream.prototype.parseStringISO = function(a, b) {
	try {
		for (var d = "",
		c = a; c < b; ++c) d += String.fromCharCode(this.get(c));
		return d
	} catch(g) {}
};
Stream.prototype.parseStringUTF = function(a, b) {
	try {
		for (var d = "",
		c = 0,
		g = a; g < b;) c = this.get(g++),
		d = 128 > c ? d + String.fromCharCode(c) : 191 < c && 224 > c ? d + String.fromCharCode((c & 31) << 6 | this.get(g++) & 63) : d + String.fromCharCode((c & 15) << 12 | (this.get(g++) & 63) << 6 | this.get(g++) & 63);
		return d
	} catch(f) {}
};
Stream.prototype.reTime = /^((?:1[89]|2\d)?\d\d)(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([01]\d|2[0-3])(?:([0-5]\d)(?:([0-5]\d)(?:[.,](\d{1,3}))?)?)?(Z|[-+](?:[0]\d|1[0-2])([0-5]\d)?)?$/;
Stream.prototype.parseTime = function(a, b) {
	try {
		return this.parseStringISO(a, b)
	} catch(d) {}
};
Stream.prototype.parseInteger = function(a, b) {
	try {
		for (var d = 0,
		c = a; c < b; ++c) d = d << 8 | this.get(c);
		return d
	} catch(g) {}
};
Stream.prototype.parseBitString = function(a, b) {
	try {
		var d = this.get(a),
		c = "";
		if (20 >= (b - a - 1 << 3) - d) for (var g = b - 1; g > a; --g) {
			for (var f = this.get(g), e = d; 8 > e; ++e) c += f >> e & 1 ? "1": "0";
			d = 0
		}
		return c
	} catch(h) {}
};
Stream.prototype.parseOctetString = function(a, b) {
	try {
		for (var d = "",
		c = a; c < b; ++c) d += this.hexByte(this.get(c));
		return d
	} catch(g) {}
};
Stream.prototype.parseOID = function(a, b) {
	try {
		for (var d = "",
		c = 0,
		g = 0,
		f = a; f < b; ++f) {
			var e = this.get(f),
			c = c << 7 | e & 127,
			g = g + 7;
			if (! (e & 128)) {
				if ("" === d) var h = 80 > c ? 40 > c ? 0 : 1 : 2,
				d = h + "." + (c - 40 * h);
				else d += "." + (31 <= g ? "bigint": c);
				c = g = 0
			}
		}
		return d
	} catch(k) {}
};
function ASN1(a, b, d, c, g) {
	try {
		this.stream = a,
		this.header = b,
		this.length = d,
		this.tag = c,
		this.sub = g
	} catch(f) {}
}
ASN1.prototype.typeName = function() {
	try {
		if (void 0 === this.tag) return "unknown";
		var a = this.tag & 31;
		switch (this.tag >> 6) {
		case 0:
			switch (a) {
			case 0:
				return "EOC";
			case 1:
				return "BOOLEAN";
			case 2:
				return "INTEGER";
			case 3:
				return "BIT_STRING";
			case 4:
				return "OCTET_STRING";
			case 5:
				return "NULL";
			case 6:
				return "OBJECT_IDENTIFIER";
			case 7:
				return "ObjectDescriptor";
			case 8:
				return "EXTERNAL";
			case 9:
				return "REAL";
			case 10:
				return "ENUMERATED";
			case 11:
				return "EMBEDDED_PDV";
			case 12:
				return "UTF8String";
			case 16:
				return "SEQUENCE";
			case 17:
				return "SET";
			case 18:
				return "NumericString";
			case 19:
				return "PrintableString";
			case 20:
				return "TeletexString";
			case 21:
				return "VideotexString";
			case 22:
				return "IA5String";
			case 23:
				return "UTCTime";
			case 24:
				return "GeneralizedTime";
			case 25:
				return "GraphicString";
			case 26:
				return "VisibleString";
			case 27:
				return "GeneralString";
			case 28:
				return "UniversalString";
			case 30:
				return "BMPString";
			default:
				return "Universal_" + a.toString(16)
			}
		case 1:
			return "Application_" + a.toString(16);
		case 2:
			return "[" + a + "]";
		case 3:
			return "Private_" + a.toString(16)
		}
	} catch(b) {}
};
ASN1.prototype.reSeemsASCII = /^[ -~]+$/;
ASN1.prototype.content = function() {
	try {
		if (void 0 === this.tag) return null;
		var a = this.tag >> 6,
		b = this.tag & 31,
		d = this.posContent(),
		c = Math.abs(this.length);
		if (0 !== a) {
			if (null !== this.sub) return "(" + this.sub.length + " elem)";
			var g = this.stream.parseStringISO(d, d + c);
			return this.reSeemsASCII.test(g) ? g.substring(0, c) : this.stream.parseOctetString(d, d + c)
		}
		switch (b) {
		case 1:
			return 0 === this.stream.get(d) ? "false": "true";
		case 2:
			return this.stream.parseInteger(d, d + c);
		case 3:
			return this.sub ? "(" + this.sub.length + " elem)": this.stream.parseBitString(d, d + c);
		case 4:
			return this.sub ? "(" + this.sub.length + " elem)": this.stream.parseOctetString(d, d + c);
		case 6:
			return this.stream.parseOID(d, d + c);
		case 16:
		case 17:
			return "(" + this.sub.length + " elem)";
		case 12:
			return this.stream.parseStringUTF(d, d + c);
		case 18:
		case 19:
		case 20:
		case 21:
		case 22:
		case 26:
			return this.stream.parseStringISO(d, d + c);
		case 23:
		case 24:
			return this.stream.parseTime(d, d + c)
		}
		return null
	} catch(f) {}
};
ASN1.prototype.toString = function() {
	return this.typeName() + "@" + this.stream.pos + "[header:" + this.header + ",length:" + this.length + ",sub:" + (null === this.sub ? "null": this.sub.length) + "]"
};
ASN1.prototype.print = function(a) {
	try {
		if (void 0 === a && (a = ""), document.writeln(a + this), null !== this.sub) {
			a += "  ";
			for (var b = 0,
			d = this.sub.length; b < d; ++b) this.sub[b].print(a)
		}
	} catch(c) {}
};
ASN1.prototype.toPrettyString = function(a) {
	try {
		void 0 === a && (a = "");
		var b = a + this.typeName() + " @" + this.stream.pos;
		0 <= this.length && (b += "+");
		b += this.length;
		this.tag & 32 ? b += " (constructed)": 3 != this.tag && 4 != this.tag || null === this.sub || (b += " (encapsulates)");
		b += "\n";
		if (null !== this.sub) {
			a += "  ";
			for (var d = 0,
			c = this.sub.length; d < c; ++d) b += this.sub[d].toPrettyString(a)
		}
		return b
	} catch(g) {}
};
ASN1.prototype.posStart = function() {
	return this.stream.pos
};
ASN1.prototype.posContent = function() {
	return this.stream.pos + this.header
};
ASN1.prototype.posEnd = function() {
	return this.stream.pos + this.header + Math.abs(this.length)
};
ASN1.prototype.toHexString = function(a) {
	return this.stream.hexDump(this.posStart(), this.posEnd(), !0)
};
ASN1.decodeLength = function(a) {
	try {
		var b = a.get(),
		d = b & 127;
		if (d == b) return d;
		if (0 === d) return null;
		for (var c = b = 0; c < d; ++c) b = 256 * b + a.get();
		return b
	} catch(g) {
		alert(g)
	}
};
ASN1.hasContent = function(a, b, d) {
	if (a & 32) return ! 0;
	if (3 > a || 4 < a) return ! 1;
	var c = new Stream(d);
	3 == a && c.get();
	if (c.get() >> 6 & 1) return ! 1;
	try {
		var g = ASN1.decodeLength(c);
		return c.pos - d.pos + g == b
	} catch(f) {
		return ! 1
	}
};
ASN1.decode = function(a) {
	try {
		a instanceof Stream || (a = new Stream(a, 0));
		var b = new Stream(a),
		d = a.get(),
		c = ASN1.decodeLength(a),
		g = a.pos - b.pos,
		f = null;
		if (ASN1.hasContent(d, c, a)) {
			var e = a.pos;
			3 == d && a.get();
			f = [];
			if (0 <= c) for (e += c; a.pos < e;) f[f.length] = ASN1.decode(a);
			else try {
				for (;;) {
					var h = ASN1.decode(a);
					if (0 === h.tag) break;
					f[f.length] = h
				}
				c = e - a.pos
			} catch(k) {
				throw "Exception while decoding undefined length content: " + k;
			}
		} else a.pos += c;
		return new ASN1(b, g, c, d, f)
	} catch(l) {
		alert(l)
	}
};