/* 	
	http://ogulcanorhan.com
  	CountUp for jQuery v1.4+
  	Licensed under the GPL (http://www.gnu.org/copyleft/gpl.html)
  	Developed by Ogulcan Orhan (mail@ogulcan.org) October 2011
 
	Please do not remove these copyright.
  
	This program is free software; you can redistribute it and/or modify
	it under the terms of the GNU General Public License, version 2, as
	published by the Free Software Foundation.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with this program; if not, write to the Free Software
	Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/

(function ( $ ) {

	if (typeof Object.create !== 'function') {
		Object.create = function (o) {
			function F() {} 
			F.prototype = o;
			return new F();
		};
	}
	
	//example: $.countUp({ 'sinceDate':'01/01/2011', 'lang':'en', 'format':'day' });
	//date format: dd/mm/yyyy-hh:mm:ss
	//available langs: english (en), turkish (tr), deutsch (de), spanish (es)
	//format options: full, day, seconds
	
	var _defaults = { 'sinceDate' : '17/10/2007-19:37:25', 'expiryDate' : 'now', 'lang': 'tr', 'format': 'seconds' , 'div_id' : '#jq_count_up', 'class_prefix' : '', 'seperator': ',', 'write_zero':'false'};

	var _timeStructure = { 'year': '', 'month': '', 'day': '', 'hour': '', 'minute': '', 'seconds': '' };
	var _monthDayStructure = { 1: 31, 2:28, 3:31, 4:30, 5:31, 6:31, 7:30, 8:31, 9:30, 10:31, 11:30, 12:31 };	
	var _lang = { 
		'en' : { 'year': 'years', 'month': 'months', 'day': 'days', 'hour': 'hours', 'minute': 'minutes', 'seconds': 'seconds',  },
		'tr' : { 'year': 'yıl', 'month': 'ay', 'day': 'gün', 'hour': 'saat', 'minute': 'dakika', 'seconds': 'saniye' },
		'es' : { 'year': 'año' ,'month': 'mes', 'day': 'día' ,'hour': 'horas' ,'minute': 'minuto','seconds': 'segundo'	},
		'de' : { 'year': 'jahr' ,'month': 'monat' ,'day': 'tag' ,'hour': 'stunde' ,'minute': 'minute','seconds': 'sekunden' },
		'ja' : { 'year': '年' ,'month': 'ヶ月' ,'day': '日' ,'hour': '時間' ,'minute': '分','seconds': '秒' }
    };
		    
	var methods = {
		
		init : function (options) {
			if(options) { var newOptions = $.extend({}, _defaults, options ); } 
			if(newOptions['expiryDate'] == 'now') newOptions.expiryDate = new Date();

			var _startDate = methods.getStartDateWithFormat(newOptions.sinceDate);
			var _endDate = methods.getExpiryDate(newOptions.expiryDate);
			var _timeDifference = methods.difference(_startDate, _endDate);
			
			_timeDifference = methods.formatted(_timeDifference, newOptions);
			setInterval(function() { methods.update(_timeDifference, newOptions); }, 999);	
		},
		
		difference : function(start, end) {

			var timeDiff = $.extend([], _timeStructure);
			//year difference
			timeDiff.year = end.year - start.year;
			var eYearString = parseInt(String(end.month)+String(end.day)+String(end.hour)+String(end.minute), 10);
			var sYearString = parseInt(String(start.month)+String(start.day)+String(start.hour)+String(start.minute), 10);			
			if( eYearString < sYearString ) { timeDiff.year--; }

			//month difference
			var eMonthString = parseInt(String(end.day)+String(end.hour)+String(end.minute));
			var sMonthString = parseInt(String(start.day)+String(start.hour)+String(start.minute));	
			
			if(end.month < start.month) {
				timeDiff.month = 12 - Math.abs(end.month - start.month);
				if(eMonthString < sMonthString) timeDiff.month--;
			} else if((end.month == start.month)) {
				if(eMonthString < sMonthString) timeDiff.month = 11;
				else timeDiff.month = 0;
			} else if( end.month > start.month) {
				timeDiff.month = end.month - start.month;
				if(eMonthString < sMonthString) timeDiff.month--;
			}
			
			//day difference
			var eDayString = parseInt(String(end.hour)+String(end.minute)+String(end.seconds), 10);
			var sDayString = parseInt(String(start.hour)+String(start.minute)+String(start.seconds), 10);
			
			if(end.day < start.day) {
				timeDiff.day = _monthDayStructure[parseInt(start.month, 10)] - Math.abs(end.day - start.day);
				if(eDayString < sDayString ) timeDiff.day--;
			} else if (end.day == start.day) {
				if(eDayString < sDayString) timeDiff.day = _monthDayStructure[start.month] - 1;
				else timeDiff.day = 0;
			} else if (end.day > start.day) {
				timeDiff.day = end.day - start.day;
				if(eDayString < sDayString ) timeDiff.day--;
			}

			//hour difference
			var eHourString = parseInt(String(end.minute)+String(end.seconds) ,10);
			var sHourString = parseInt(String(start.minute)+String(start.seconds),10);
			
			if(end.hour < start.hour) {
				timeDiff.hour = 24 - Math.abs(end.hour - start.hour);
				if(eHourString < sDayString) timeDiff.hour--;
			} else if (end.hour == start.hour) {
				if(eHourString < sHourString) timeDiff.hour = 23;
				else timeDiff.hour = 0;
			} else if (end.hour > start.hour) {
				timeDiff.hour = end.hour - start.hour;
				if(eHourString < sDayString) timeDiff.hour--;
			}
			
			//minute difference
			if(end.minute < start.minute) {
				timeDiff.minute = 60 - Math.abs(end.minute - start.minute);
				if(end.seconds < start.seconds) timeDiff.minute--;
			} else if(end.minute == start.minute) {
				if(end.seconds < start.seconds) timeDiff.minute = 59;
				else timeDiff.minute = 0;
			} else if(end.minute > start.minute) {
				timeDiff.minute = end.minute - start.minute;
				if(end.seconds < start.seconds) timeDiff.minute--;
			}
			
			
			//seconds difference
			if(end.seconds < start.seconds) {
				timeDiff.seconds = 60 - Math.abs(end.seconds - start.seconds);
			} else if (end.seconds == start.seconds) {
				timeDiff.seconds = 0;
			} else if (end.seconds > start.seconds) {
				timeDiff.seconds = end.seconds - start.seconds;
			}
			
			return timeDiff;		
		},
		
		formatted : function (timeDiff, options) {
			//format control
			if(options['format'] != 'full') {
				timeDiff.day = (timeDiff.year * 365) + (timeDiff.month * 30) + timeDiff.day;
				timeDiff.year = 0; 
				timeDiff.month = 0;
				if(options['format'] == 'seconds') {
					timeDiff.seconds = (timeDiff.day*86400) + (timeDiff.hour*3600) + (timeDiff.minute*60) + timeDiff.seconds;
					timeDiff.day = 0;
					timeDiff.hour = 0;
					timeDiff.minute = 0;
				}
			}
			
			return timeDiff;			
		},
		
		update : function (time, newOptions) {
			if ( time.seconds < 59 || newOptions['format'] == 'seconds' ) time.seconds++;
			else { 
				time.seconds = 0;
				if ( time.minute < 59 ) time.minute++;
				else {
					time.minute = 0;
					if ( time.hour < 23 ) time.hour++;
					else {
						time.hour = 0;
						if ( time.day < _monthDayStructure[newOptions.expiryDate.getMonth()] || newOptions['format'] == 'day' ) time.day++;
						else {
							time.day = 0;
							if ( time.month < 12 ) time.month++;
							else {
								time.month = 0;
								time.year++;
							} 
						}
					}
				}
			}	
			methods.print(time, newOptions);	
		},
		
		print : function(time, newOptions) {
			
			var year   = '<span id='+newOptions["class_prefix"]+'_year">'+time.year+' '+_lang[newOptions['lang']].year+newOptions['seperator']+' </span>';
			var month  = '<span id='+newOptions["class_prefix"]+'_month">'+time.month+' '+_lang[newOptions['lang']].month+newOptions['seperator']+' </span>';
			var day    = '<span id='+newOptions["class_prefix"]+'_day">'+time.day+' '+_lang[newOptions['lang']].day+newOptions['seperator']+' </span>';
			var hour   = '<span id='+newOptions["class_prefix"]+'_hour">'+time.hour+' '+_lang[newOptions['lang']].hour+newOptions['seperator']+' </span>';
			var day    = '<span id='+newOptions["class_prefix"]+'_day">'+time.day+' '+_lang[newOptions['lang']].day+newOptions['seperator']+' </span>';
			var hour   = '<span id='+newOptions["class_prefix"]+'_hour">'+time.hour+' '+_lang[newOptions['lang']].hour+newOptions['seperator']+' </span>';
			var minute = '<span id='+newOptions["class_prefix"]+'_minute">'+time.minute+' '+_lang[newOptions['lang']].minute+newOptions['seperator']+' </span>';
			var seconds = '<span id='+newOptions["class_prefix"]+'_seconds">'+time.seconds+' '+_lang[newOptions['lang']].seconds+' </span>';
			
			if(newOptions['write_zero'] == 'true') {
				$(newOptions['div_id']).html(year+month+day+hour+minute+seconds);
			} else {
				$(newOptions['div_id']).html(null);
				var zero = false;
				if((time.year > 0) ||  zero) {
					$(newOptions['div_id']).append(year);
					zero = true;
				}
				if((time.month > 0) || zero) {
					$(newOptions['div_id']).append(month);
				}
				if((time.day > 0) ||  zero) { 
					$(newOptions['div_id']).append(day);
					zero = true;
				}
				if((time.hour > 0) ||  zero) {
					$(newOptions['div_id']).append(hour);
					zero = true;
				}
				if((time.minute > 0) ||  zero) {
					$(newOptions['div_id']).append(minute);
					zero = true;
				}
				if((time.seconds > 0) ||  zero)
					$(newOptions['div_id']).append(seconds);				
			}
		},
		
		getStartDateWithFormat : function(sinceDate) {
			//split hour and date			
			var splittedExpiryDate = sinceDate.split("-");
			
			//use date
			var split_expiry_date = splittedExpiryDate[0].split("/");

			//use hour
			var split_expiry_time = splittedExpiryDate[1].split(":");

			//set time structure variables
			var startDate = $.extend([], _timeStructure);
		
			startDate.year   = split_expiry_date[2];
			startDate.month  = split_expiry_date[1];
			startDate.day    = split_expiry_date[0];
			
			startDate.hour   = split_expiry_time[0];
			startDate.minute = split_expiry_time[1];
			
			//if seconds
			(split_expiry_time[2]) ? startDate.seconds = split_expiry_time[2] : startDate.seconds = 0;			

			return startDate;
		},
		
		getExpiryDate : function(expiryDate) {

			var endDate = $.extend([], _timeStructure);

			endDate.year   = expiryDate.getFullYear();

			(expiryDate.getMonth()<9)    ? endDate.month   = "0" + expiryDate.getMonth()+1 : endDate.month   = expiryDate.getMonth()+1;
			(expiryDate.getDate()<10)    ? endDate.day     = "0" + expiryDate.getDate()    : endDate.day     = expiryDate.getDate();
			(expiryDate.getHours()<10)   ? endDate.hour    = "0" + expiryDate.getHours()   : endDate.hour    = expiryDate.getHours();
			(expiryDate.getMinutes()<10) ? endDate.minute  = "0" + expiryDate.getMinutes() : endDate.minute  = expiryDate.getMinutes();
			(expiryDate.getSeconds()<10) ? endDate.seconds = "0" + expiryDate.getSeconds() : endDate.seconds = expiryDate.getSeconds();	

			return endDate;
		},
	};
	
	$.fn.countUp = function (method) {	
		_defaults['div_id'] = "#"+$(this).attr('id');
		_defaults['class_prefix'] = $(this).attr('id');
		var myMethods = Object.create(methods);
		myMethods.init(method);
	}
	
})( jQuery );
