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
 * name: showPagination
 *
 */
function showPagination()
{
    if($('#pagination').html() != '')
    {
        $('#pagination').toggle();
        return;
    }

    $.get('crud.php',
        {
            action: 'getPagination',
            project: projectName,
            object: objectName,
            actTemplate: 'default',
            limit: limitNumber,
            offset: parseInt(settings['objects'][objectName]['offset'])
            //sortby: srtarr.join(',')
        },
        function(data) {
            $('#pagination').html(data);


            $('#pagination span')
                .on('mousedown', function(e)// activate listener for pagination-links
                {
                    var no = $(this).data('page');
                    switch (e.which)
                    {
                        case 1://Left Mouse button pressed
                            setPagination(no);
                            break;
                        case 2://Middle Mouse button pressed
                        case 3://Right Mouse button pressed
                            setPagination(no, true);
                            $(this).css('text-decoration','underline');
                            break;
                    }
                })
                .on('contextmenu', function(e)//suppress context-menu
                {
                    e.preventDefault();
                });
        });
};
