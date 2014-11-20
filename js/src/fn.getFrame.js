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
 * opens a URL in the main Dialog
 * name: getFrame
 * @param url
 *
 */
function getFrame (url)
{

    var wh = (store['dwh']) ? store['dwh'] : [($(document).width()*0.9), ($(document).height()*0.9)];
    $('#dialogb2').css({'width':wh[0]-20, 'height':wh[1]-70});
    $('#dialogb2').attr('src', url);
    $('#dialog2').dialog({
        width:  wh[0],
        height: wh[1],
        modal: true,
        show: 'scale',
        hide: 'scale',
        close: function(event, ui)
        {
            $('#dialogb2').attr('src','about:blank');
        },
        resizeStop: function(event, ui)
        {
            store['dwh'] = [$(this).dialog('option','width'), $(this).dialog('option','height')];
        }
    })
};
