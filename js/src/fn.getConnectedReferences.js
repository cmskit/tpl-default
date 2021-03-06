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
 * loads all references asocciated to the entry
 *
 * name: getConnectedReferences
 * @param id
 * @param off
 * @param obj
 */
function getConnectedReferences(id, off, refName)
{
    if(!off) off=0;

    // get the References
    $.get('crud.php',
        {
            action: 'getConnectedReferences',
            project: projectName,
            object: objectName,
            referenceName: (refName||null),
            objectId: id,
            limit: limitNumber,
            offset: off,
            actTemplate: 'default'
        },
        function(data)
        {

            $('#colRightb').html(data);
            styleButtons('colRightb');

            $('#colRightb .lnk')
                .on('click',function(e)
                {
                    showReference($(this));
                    e.preventDefault();
                })
                .on('contextmenu', function(e)
                {
                    getContent($(this).data('id'), $(this).data('object'));
                    e.preventDefault();
                });
            //if(myLayout) myLayout.initContent('east');
            $('#colRightb').css('height','100%');
        });
};
