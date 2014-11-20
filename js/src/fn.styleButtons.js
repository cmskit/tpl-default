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
 * transform all button-elements to jQuery-UI elements within an container-element
 *
 * name: styleButtons
 * @param id
 * @return
 *
 */
function styleButtons(id)
{
    $('#'+id+' button').each(function()
    {
        if($(this).attr('rel'))
        {
            if(!$(this).attr('title'))$(this).attr('title','');
            $(this).button({
                icons:{primary:'ui-icon-'+$(this).attr('rel')},
                text:(($(this).text()=='.')?false:true),
                title:''
            })
        }
    }
)};
