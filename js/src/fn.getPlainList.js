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
 *
 * name: getPlainList
 * @param id
 * @return
 */
function getPlainList(id)
{

    $.get('crud.php',
        {
            action: 'getList',
            project: projectName,
            actTemplate: 'default',
            object: objectName,
            objectId: id,
            filterKey: $('#filterSelectBox>select').val(),
            limit: limitNumber,
            offset: (settings['objects'][objectName] ? parseInt(settings['objects'][objectName]['offset']) : 0)
        },
        function(data)
        {
            // re-call+abort drawing of the List if the Entry is out of Range
            if (id && !isNaN(data))
            {
                var d = parseInt(data);
                settings['objects'][objectName]['offset'] = d;
                setThings('objects.'+objectName+'.offset', d);
                getPlainList();
                return;
            };

            $('#colLeftb').html(data);
            styleButtons('mainlistHead');




            $('#filterSelectBox select').selectmenu({
                change: function(e, object){
                    getPlainList();
                    //$(this).selectmenu('value','');
                }
            });

            $("#mainlist").selectable(
                {
                    stop: function()
                    {
                        var a = [];
                        $('.ui-selected', this).each(function()
                        {
                            a.push(this.getAttribute('rel'))
                        });

                        if (a.length>1)// multi-selection
                        {
                            $('#colRightb').empty();
                            specialAction('crud.php?action=multiSelect&actTemplate=default&project='+projectName+'&object='+objectName+"&objectId='"+a.join("','")+"'", 'colMidb');
                        }
                        else// single selection
                        {
                            if(typeof a[0] != 'undefined')
                            {
                                getContent(a[0]);
                            };
                        }
                    }
                });
        }
    );
};
