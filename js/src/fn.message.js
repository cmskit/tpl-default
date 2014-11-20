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

/**
 * show a Message instead of alert (string, style, fadeout)
 * @param str
 * @param style
 * @param fadeout
 */
function message(str, style, fadeout)
{
    //alert(str);
    var id = 'x'+Math.random().toString().substring(2);
    if(str.substr(0,2)=='[['){style='alert',str=str.substring(2,str.length-2)}
    var h = '<div id="'+id+'" class="ui-widget"><div class="ui-state-'+(style?style:'highlight')+' ui-corner-all" style="padding:0 .7em"><p><span class="ui-icon ui-icon-'+(style?style:'info')+'" style="float:left;margin-right:.3em;"></span>'+str+'</p></div></div>';
    $('#messagebox').append(h);
    window.setTimeout(function(){$('#'+id).slideUp()}, (fadeout?fadeout:3000));
};