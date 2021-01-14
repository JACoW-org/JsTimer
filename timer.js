/*  JsTimer, version 1.0, 2008.06.25
 *  (c) 2008 Stefano Deiuri
 *
 *  JsTimer is freely distributable under the terms of an MIT-style license.
 *  For details, see the JsTimer web site: http://www.deiuri.it/stefano/software
 *
 *--------------------------------------------------------------------------*/

var bw =832;
var tt =false; // TotalTime in seconds
var wt =60; // WarningTime in seconds
var lt =false; //LeftTime in seconds
var st =false; // StartTime
var control =false;
var warning =false;

setInterval( update_clock, 1000 );


//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function update_clock() {
 now =(new Date()) +'';
 document.getElementById('clock').innerHTML =now.substr(0,24);
}


//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function set_time( _text ) {
 t =window.prompt( _text );
 
 if (t.indexOf('m') != -1) {
	m =t.replace( 'min', '' );
	m =m.replace( 'm', '' );
	t =m*60;
 }
 
 t =parseInt(t);
 
 if (Math.floor(t) <= 0 || isNaN(t)) return false;
 
 return t;
}


//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function set_wt() {
 t =set_time( "Warning time?\n(es. 120 =120sec =2min | 2m =2min)" );
 if (!t) return;
 
 wt =t;
 update_info();
}


//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function set_tt() {
 t =set_time( "Total time?\n(es. 120 =120sec =2min | 2m =2min)" );

 if (!t) return;
 
 lt =tt =t;
 
 if (!control) document.getElementById('bar_area').innerHTML =''; 
 
 draw_time( tt );
 update_info();
}


//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function timer_pause() {
 clearInterval(control);
 control =false;
 warning =false;
 
 draw_pp( 'play', 'Continue' );
 document.getElementById('bar_area').innerHTML ="<center><blink>pause</blink></center>";
}


//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function timer_continue() {
 now =new Date();
 st =now.getTime() -((tt -lt) *1000);
  
 init_bar();
 control =setInterval( redraw, 300 );
 draw_pp( 'pause', 'Pause' );
}


//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function timer_play() {
 if (control) return timer_pause();

 if (st) return timer_continue();
 
 if (!tt) set_tt();

 document.getElementById('timer').style.color ='black'; 
 
 warning =false;
 now =new Date();
 st =now.getTime();
 
 init_bar();
 control =setInterval( redraw, 300 );
 draw_pp( 'pause', 'Pause' );
}


//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function timer_reset() {
 if (!tt) set_tt();

 if (control) clearInterval(control);
 
 st =false;
 control =false;
 document.getElementById('timer').style.color ='black'; 
 document.getElementById('bar_area').innerHTML =''; 
 document.getElementById('lt').innerHTML =''; 
 draw_time( tt );
 draw_pp( 'play', 'Start' );
}


//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function init_bar() {
 obj =document.getElementById('bar_area');
 obj.style.visibility ='hidden';
 document.getElementById('bar_area').innerHTML ="<img id='bar_begin' src='images/bar_begin.png' /><img id='bar' src='images/bar.png' width='0' /><img id='bar_end' src='images/bar_end.png' />";
 redraw();
 obj.style.visibility ='visible';
}


//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function redraw() {
 now =new Date();
 lt =tt -Math.ceil((now.getTime() -st) /1000);
 
 if (lt <= 0) {
	timer_reset();
	document.getElementById('timer').innerHTML ='<blink>Time<br />over</blink>'; 
	document.getElementById('bar_area').innerHTML =''; 
	return;
 }
 
 if (lt < wt && warning == false) {
	warning =true;
	document.getElementById('timer').style.color ='#a82720'; 
	document.getElementById('bar_begin').src='images/barw_begin.png';
	document.getElementById('bar').src='images/barw.png';
	document.getElementById('bar_end').src='images/barw_end.png';
 }

 draw_time( lt );
 update_info();

 bar_width =Math.floor( bw * lt / tt );
 document.getElementById('bar').style.width =bar_width;
 document.getElementById('bar').style.height =250;
}
 
 
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function draw_pp( _img, _text ) {
 document.getElementById('ppimg').src ='images/player_' +_img +'.png';
 document.getElementById('pp').innerHTML =_text;
}


//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function draw_time( _time ) {
 if (_time < 10) t =_time +"<small> sec</small>";
 else if (_time <=30) t ="&frac12;<small> min</small>";
 else t =Math.ceil( _time /60 ) +"<small> min</small>";

 document.getElementById('timer').innerHTML =t; 
} 


//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function update_info() {
 document.getElementById('tt').innerHTML ='(' +sec2min(tt) +')';
 document.getElementById('wt').innerHTML ='(' +sec2min(wt) +')';
 document.getElementById('lt').innerHTML ='(' +sec2min(lt) +')';
}


//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function sec2min( _sec ) {
 min =Math.floor( _sec /60 );
 sec =_sec -min*60;
 
 return (min > 0 ? min : '0') +':' +(sec > 9 ? '' : '0') +sec;
}
