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
 * saves the content via AJAX
 *
 * name: saveContent
 * @param id
 * @param obj
 */
function saveContent (id, obj)
{


    // serialize the Form
    var s = $('#colMidb').serialize();


    // fix ignoring unchecked Checkboxes
    $('#colMidb .checkbox').each(function(){if(!$(this).prop('checked')) s += '&' + $(this).attr('name') + '=0';});

    $.post(
        'crud.php?action=saveContent&actTemplate=default&project='+projectName+'&object='+(obj?obj:objectName)+'&actTemplate=default&objectId='+id,
        s,
        function (data)
        {
            // we have to check for a new ID
            if (isNaN(data))// we have a ordinary message
            {
                message(data);
            }
            else
            {
                if (data != id)// we have a new ID
                {
                    // set the new id in hash and as global variable
                    location.hash = 'id='+data;
                    id = data;
                    message(langLabels.entry_created);
                    // if the created entry should be connected to another entry
                    if (window.g['connect_to_object'] && window.g['connect_to_id'])
                    {
                        $.get('crud.php?action=setReference&actTemplate=default&project='+projectName+'&object='+objectName+'&objectId='+data,
                            {
                                referenceName: g['connect_to_object'],
                                referenceId: g['connect_to_id'],
                                connect: true
                            },
                            function(data)
                            {
                                //message(data);
                                delete(g['connect_to_object']);
                                delete(g['connect_to_id']);
                                message(langLabels.connections_saved);
                            });
                    };

                    // call the dummy-function
                    afterCreateContent(id, obj);
                }
                else
                {
                    message(langLabels.saved);
                }
            }

            if(!obj) getList(id);
            hasCanged = false;
            window.serializedInputs = s;
            // call the dummy-function
            afterSaveContent(id, obj);
        }
    );
};

/**
 * dummy function called after a content element is saved
 * @param id
 * @param obj
 */
function afterSaveContent(id, obj){};

