/**
 * Copyright 2014 SCN Community Contributors
 * 
 * Original Source Code Location:
 *  https://github.com/sap-design-studio-free-addons/sdk-package
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"); 
 * you may not use this file except in compliance with the License. 
 * You may obtain a copy of the License at 
 *  
 *  http://www.apache.org/licenses/LICENSE-2.0
 *  
 * Unless required by applicable law or agreed to in writing, software 
 * distributed under the License is distributed on an "AS IS" BASIS, 
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
 * See the License for the specific language governing permissions and 
 * limitations under the License. 
 * 
 */

/**
 * World time display designed by Martin Pankraz 
 * 
 */
sap.designstudio.sdk.Component.subclass("org.scn.community.basics.WorldTime", /** @memberOf org.scn.community.basics.WorldTime*/ function() {
	var offset 					= null;
	var SaveLocale 				= null;
	var saveDateFormat 			= null;
	var saveTimeFormat			= null;
	var saveShowTimeZoneName 	= null;
	var saveDaylightSaving		= null;
	var update_interval 		= null;
	var $div 					= null;
	var interval_id				= null;
	var identifier				= null;
	
	/**
	 * @desc First function called during SAP Design Studio Plugin Lifecycle
	 */
	this.init = function(){
		
	}
	/**
	 * @function beforeUpdate
	 */
	this.beforeUpdate = function(){};
	
	/**
	 * @function afterUpdate
	 */
	this.afterUpdate = function(){
		//separate multiple world time instances from each other
		identifier = "convista_time_container_"+makeid();
		//add DIV
		this.$().html('<div id="'+identifier+'">'+calcTime(offset)+'</div>');
		//remember element
		$div = document.getElementById(identifier);
		//setup interval call only once in case of multiple update calls!
		if(interval_id === null){
			interval_id = setInterval(function(){
				$div.innerHTML = calcTime(offset);
			}
			, update_interval);
		}
	}
	
	/**
	 * @function componentDeleted
	 */
	this.componentDeleted = function(){
		$div = null;
		clearInterval(interval_id);
		this.$().remove('#'+identifier);
	};
	

	/**
	 * @function to calculate local time given the UTC offset
	 * @memberOf org.scn.community.basics.WorldTime
	 */
	function calcTime(offset) {	
		
		var result = null;

	    // create Date object for current location
	    d = new Date();
	    
	    // convert to msec
	    // add local time zone offset 
	    // get UTC time in msec
	    utc = d.getTime() + (d.getTimezoneOffset() * 60000);
	    
	    //handle daylight saving
	    if (d.dst() && saveDaylightSaving){
	    	offset = parseInt(offset)+1;
	    }
	    
	    // create new Date object for different city
	    // using supplied offset
	    nd = new Date(utc + (3600000*offset));
	    
	    var options = getOptionsByParameters();
	    
	    // return time as a string
	    if(options.defTime === true){
	    	result = nd.toLocaleTimeString();
	    }else if(options.defDate === true){
	    	result = nd.toLocaleString();
	    }else{
	    	if(SaveLocale === 'en-US'){
	    		if(options.hideTime === true){
			    	result = nd.toLocaleString('en-US', options);
	    		}else{
			    	result = nd.toLocaleTimeString('en-US', options);	
	    		}
		    }else if(SaveLocale === 'de-DE'){
		    	if(options.hideTime === true){
			    	result = nd.toLocalString('de-DE', options);
		    	}else{
			    	result = nd.toLocaleTimeString('de-DE', options);	
		    	}
		    }else{
		    	if(options.hideTime === true){
		    		result = nd.toLocaleString(navigator.language, options);
		    	}else{
		    		result = nd.toLocaleTimeString(navigator.language, options);
		    	}
		    }
	    }
	    
	    return result;

	}
	/**
	 * Code extracted from http://javascript.about.com/library/bldst.htm
	 */
    Date.prototype.stdTimezoneOffset = function() {
        var jan = new Date(this.getFullYear(), 0, 1);
        var jul = new Date(this.getFullYear(), 6, 1);
        return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
    }
    /**
	 * Code extracted from http://javascript.about.com/library/bldst.htm
	 */
    Date.prototype.dst = function() {
        return this.getTimezoneOffset() < this.stdTimezoneOffset();
    }
    
	/**
	 * @function generate a random id to distinguish several instances of this component in the same dashboard
	 * @memberOf org.scn.community.basics.WorldTime
	 */
	function makeid()
	{
	    var text = "";
	    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	    for( var i=0; i < 5; i++ )
	        text += possible.charAt(Math.floor(Math.random() * possible.length));

	    return text;
	}
	/**
	 * @function setup date display options
	 * @memberOf org.scn.community.basics.WorldTime
	 */
	function getOptionsByParameters(){
		var options = {};
		
		if(saveDateFormat === 'dd.mm.yy'){
	    	options.day = '2-digit';
	    	options.month = '2-digit';
	    	options.year = '2-digit';
	    }else if(saveDateFormat === 'dd.mm'){
	    	options.day = '2-digit';
	    	options.month = '2-digit';
	    }else if(saveDateFormat === 'mm.yy'){
	    	options.month = '2-digit';
	    	options.year = '2-digit';
	    }else if(saveDateFormat === 'hide'){
	    	options.hideDate = true;
	    }else if(saveDateFormat === 'default'){
	    	options.defDate = true;
	    }else{
	    	if(window.console){
		    	console.log('date format string not supported: '+saveDateFormat);
	    	}
	    }
	    
	    if(saveTimeFormat === 'hh:mm:ss'){
	    	options.hour = '2-digit';
	    	options.minute = '2-digit';
	    	options.second = '2-digit';
	    }else if(saveTimeFormat === 'hh:mm'){
	    	options.hour = '2-digit';
	    	options.minute = '2-digit';
	    }else if(saveTimeFormat === 'hide'){
	    	options.hideTime = true;
	    }else if(saveTimeFormat === 'default'){
	    	options.defTime = true;
	    }else{
	    	if(window.console){
		    	console.log('time format string not supported: '+saveTimeFormat);
	    	}
	    }
	    
	    if(saveShowTimeZoneName === true){
	    	options.timeZone = 'UTC';
	    	options.timeZoneName = 'short';
	    }
		
		return options;
	}
	
	this.utcoffset = function(value) {
		if (value === undefined) {
			return offset;
		} else {
			offset = value;
			return this;
		}
	};
	
	this.locale = function(value) {
		if (value === undefined) {
			return SaveLocale;
		} else {
			SaveLocale = value;
			return this;
		}
	};
	
	this.dateformat = function(value) {
		if (value === undefined) {
			return saveDateFormat;
		} else {
			saveDateFormat = value;
			return this;
		}
	};
	
	this.timeformat = function(value) {
		if (value === undefined) {
			return saveTimeFormat;
		} else {
			saveTimeFormat = value;
			return this;
		}
	};
	
	this.showtimezonename = function(value) {
		if (value === undefined) {
			return saveShowTimeZoneName;
		} else {
			saveShowTimeZoneName = value;
			return this;
		}
	};
	
	this.daylightsaving = function(value) {
		if (value === undefined) {
			return saveDaylightSaving;
		} else {
			saveDaylightSaving = value;
			return this;
		}
	};
	
	this.interval = function(value) {
		if (value === undefined) {
			return update_interval;
		} else {
			update_interval = value;
			return this;
		}
	};
	
});