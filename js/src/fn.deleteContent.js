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
 * deletes an entry
 *
 * name: deleteContent
 * @param id
 * @param obj
 * @param q
 */
function deleteContent (id, obj, q)
{
    var q = confirm(_('delete_entry')+' (ID:'+id+')?');
    if(q)
    {
        $.get('crud.php',
            {
                action: 'deleteContent',
                project: projectName,
                object: (obj?obj:objectName),
                actTemplate: 'default',
                objectId: id
            },
            function(data)
            {
                message(data,false,10000);
                if(!obj) window.location.hash = '';
                location.reload();
            });
    }
};
