/********************************************************************************
*  Copyright notice
*
*  (c) 2014 Christoph Taubmann (info@cms-kit.org)
*  All rights reserved
*
*  This script is part of cms-kit Framework. 
*  This is free software; you can redistribute it and/or modify
*  it under the terms of the GNU General Public License Version 3 as published by
*  the Free Software Foundation, or (at your option) any later version.
*
*  The GNU General Public License can be found at
*  http://www.gnu.org/licenses/gpl.html
*
*  This script is distributed in the hope that it will be useful,
*  but WITHOUT ANY WARRANTY; without even the implied warranty of
*  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*  GNU General Public License for more details.
*
*  This copyright notice MUST APPEAR in all copies of the script!
* 
* 
*********************************************************************************/




var ch, g = [], objectId = '', objectHType = false, hasCanged=false, activeItem=false;

var myLayout = false;






/**
 * fn.realPrev
 * http://stackoverflow.com/questions/7771119/jquery-prev-of-a-type-regardless-of-its-parent-etc
 * example $("#text3").realPrev("input", -2)
 */
(function($)
{
	$.fn.realPrev = function(selector, no)
	{
		var all = $("*");
		if(!no) no = -1;
		return all.slice(0,all.index(this)).filter(selector).slice(no).first();
	}
})(jQuery);


$(document).ready(function()
{
	// supress href-call on blind Links
	$('body').on('click', 'a[href="#"]',function(e){e.preventDefault()});
	
	$.ajaxSetup({ cache:false });
	
	// show a waiter if something loading via Ajax-Call
	$(document).ajaxStart(function(){$('body').addClass('loading')});
	$(document).ajaxStop(function(){$('body').removeClass('loading')});
	
});




/**
 * require_once - alternative to $.getScript. use: $.loadScript('myscript.js', function() {...});
 * @param url
 * @param callback
 */
jQuery.loadScript = function (url, callback)
{
	if(!window.loadedScripts) window.loadedScripts = [];

    if ($.inArray(url, loadedScripts) < 0)
	{
		jQuery.ajax({
			type: 'GET',
			url: url+'?project='+projectName+'&object='+objectName+'&lang='+lang+'&theme='+settings.interface.theme,
			dataType: 'script',
			cache: true,
			success: function() {
                window.loadedScripts.push(url);
				callback.call(this);
			}
		});
	}
	else
	{
		callback.call(this);
	}
};




/**
 *
 * name: init
 * @param name
 * @param id
 */
function init(name, id)
{
    // Rules for Masked Input
    //$.mask.definitions['~'] = '[+-]';//plus-minus
    //$.mask.definitions['h'] = '[A-Fa-f0-9]';//color-hash (= #hhhhhh )
    //alert(JSON.stringify(store));

    // columns = [north, west, east, south, is_internal_flag]
    myLayout = $('body').layout({
        north__size: (columns[0]>0?columns[0]:55)
        , west__size:  (columns[1]>0?columns[1]:200)
        , east__size:  (columns[2]>0?columns[2]:200)
        , south__size:  200
        , stateManagement__enabled:	false//(columns[4]?true:false) // enable stateManagement if "is_internal_flag" exists - automatic cookie load & save enabled by default
        , north__initClosed: ((columns[0]<=0||client['touch'])?true:false)
        , west__initClosed:  ((columns[1]<=0||client['touch'])?true:false)
        , east__initClosed:  ((columns[2]<=0||client['touch'])?true:false)
        , south__initClosed:  true
        , onresize_end: checkCenterWidth
    });


    /**
     * style Buttons
     */
    $('button').each(function() { $(this).button( {icons:{ primary: 'ui-icon-'+$(this).attr('rel')}}); });

    limitNumber = 25;

    /* style SELECTs
     * ATTENTION! fix z-index-Isuue in selectmenu.js like this
     * .zIndex( this.element.zIndex() + 1001 )

     $('body select').each(function(){
     alert($(this).attr('onchange'))
     });
     */
    $('#globalWizard').selectmenu({
        change: function(e, object){
            //object.item.value
            var url = object.item.value;
            if(url!=''){
                getFrame(url);
                //$(this).selectmenu('index',0);
                $(this).val('').selectmenu('refresh');
            }
        }
    });

    //objectSelect
    $('#objectSelect').selectmenu({
        change: function(e, object){
            window.location.href = 'backend.php?project='+projectName+'&object=' + object.item.value;
        }
    }).selectmenu('menuWidget').addClass('objectSelectMenu');

    $('#templateSelect').selectmenu({
        change: function(e, object){
            //object.item.value
            window.location.href = 'backend.php?project='+projectName+'&object=' + objectName + '&template=' + object.item.value;
            //$(this).selectmenu('value','');
        }
    });


    // get/set Font-Size
    originalFontSize = $('html').css('font-size');
    if(store['fnts']) {
        $('html').css('font-size', store['fnts']);
    }
    //////////////////////////////////////////////////
    if(!objectName) {
        $('#searchbox').hide();
        return;
    }

    var toggleButtons = '';
    if(client.touch) {
        toggleButtons = '<div id="toggleBarButtons"><button rel="arrowthick-2-e-w" id="toggleBarRight">.</button><button rel="arrowthick-2-e-w" id="toggleBarLeft">.</button><button rel="arrowthick-2-n-s" id="toggleBarTop">.</button></div>';
    }


    $('#colMidb').before(toggleButtons).html('');
    $('#colRightb').html('');
    $('#colBottomb').html('');
    if(client.touch) {
        styleButtons('toggleBarButtons');
        $('#toggleBarRight').on('click',function(){
            myLayout.toggle('east')
        });
        $('#toggleBarLeft').on('click',function(){
            myLayout.toggle('west')
        });
        $('#toggleBarTop').on('click',function(){
            myLayout.toggle('north')
        });
    }

    //$('#objectSelect').selectmenu("value", name);
    $('#objectSelect').val(name);
    if(!settings['objects'][objectName])
    {
        var d = {
            offset:0,
            srt:[],
            lbls:[]
        };
        settings['objects'][objectName] = d;
        setThings('objects.'+objectName, d);
    }

    //$("#iHeadWrapper select").selectmenu();

    getList(id);
};




$(document).ready(function()
{
    init(objectName);
    window.setTimeout(checkHash, 500);

});// document.ready END /////////////////////////////////////////////////////



// keycode plugin see: http://www.gmarwaha.com/blog/2009/06/16/ctrl-key-combination-simple-jquery-plugin
$.ctrl = function(key, callback, args)
{
    $(document).keydown(function(e)
    {
        if (!args) args=[]; // IE barks when args is null
        if (e.keyCode == key.charCodeAt(0) && (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey))
        {
            callback.apply(this, args);
            e.preventDefault();
            return false;
        }
    })
};

$.ctrl('A', function(s) {tryTo('createButton', 'click')}, []);
$.ctrl('S', function(s) {tryTo('saveButton', 'click')}, []);
$.ctrl('D', function(s) {tryTo('deleteButton', 'click')}, []);

function callUnload(){
    if(!checkForChanges() && !confirm(_('skip_saving?'))){
        return
    }
}

// do some actions before webpage is unloaded
window.onbeforeunload = function(){
    if(!checkForChanges()){
        return _('skip_saving?')
    }
};



$(window).on('unload', function()
{
    // send the sore to a session-variable
	setStore();
	leaveContent();
});


