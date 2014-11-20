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
 * load Content into main Area
 * @name getContent
 * @param id
 * @return
 *
 */
function getContent(id, obj) {
    //setThings('bla.blubb.tralala', 'asdasd');

    if (id == 'undefined') {
        return false
    }
    ;


    checkCenterWidth();

    if (hasCanged) {
        //if(!confirm(_('skip_saving'))) return;
    }
    ;
    hasCanged = false;

// check if there is a active item to call leaveContent
    leaveContent();

    activeItem = {obj: (obj ? obj : objectName), id: id};

    if (!obj) {
        window.location.hash = 'id=' + id;// store the ID in URL
        objectId = id;
    }
    ;


    $('#colMidb').empty();
    $('#colRightb').empty();
//$('#colMidb').children().remove();

    $.get('crud.php',
        {
            action: 'getContent',
            project: projectName,
            object: (obj ? obj : objectName),
            relObject: (obj ? objectName : 0),
            objectId: id,
            actTemplate: 'default'
        },
        function (data) {
            $('#colMidb').html(data);
            /**/
            $('#referenceSelect').selectmenu({
                change: function (e, object) {
                    //object.item.value
                    getReferences(objectId, 0);
                    //$(this).val('').selectmenu('refresh');
                }
            });


            $('#previewSelect').selectmenu({
                change: function (e, object) {
                    //object.item.value
                    if (object.item.value.length > 0) {
                        getFrame(object.item.value);
                        $(this).val('').selectmenu('refresh');
                    }
                }
            });


            // content-processing
            $('#colMidb #accordion').accordion({collapsible: true});
            $('#colMidb #tabs').tabs();


            // loop throught all Input-Elements
            $('#colMidb .input').each(function () {

                // get all data-... attributes of element e
                var e = $(this);
                var d = e.data();

                if (e.attr('type') && e.attr('type') == 'text') {
                    //e.css('width','95%');
                }

                // apply grid-[1-12] - Class to the Container-DIV
                if (d.grid) {
                    e.parent().attr('class', 'grid-' + d.grid);
                }

                // apply styles to the input-element, the parent-div, the label-element
                if (d.style) {
                    e.attr('style', d.style.replace('|', ':'));
                }
                if (d.parentstyle) {
                    e.parent().attr('style', d.parentstyle.replace('|', ':'));
                }
                if (d.labelstyle) {
                    e.parent().find('label').attr('style', d.labelstyle.replace('|', ':'));
                }

                // Wizard detected, (try to) prepare
                if (d.wizard) {

                    if (d.external) // external Wizard (open Dialog)
                    {
                        var bt = $('<button type="button" title="' + (d.title ? d.title : '') + '" rel="' + (d.icon || 'gear') + '">' + (d.label || 'Wizard') + '</button>');
                        e.after(bt);// place the button

                        bt.on('click', function () {
                            targetFieldId = e.attr('id');
                            getFrame((d.path ? d.path.replace(/###PROJECT###/, projectName) : 'wizards/' + d.wizard) + '/index.php?project=' + projectName + '&object=' + objectName + '&lang=' + lang + '&theme=' + settings.interface.theme + '&objectId=' + objectId + ((d.params) ? '&' + d.params : ''));
                        });
                    }
                    else // embedded Wizard (load Script)
                    {
                        $.loadScript((d.path ? d.path : 'wizards/' + d.wizard) + '/include.php',
                            function () {
                                e[d.wizard]()
                            });
                    }
                }
                ;

                // change some basic stylings
                if (d.readonly) {
                    $(this).attr('readonly', 'readonly');// make the Field readonly
                }

                // hide the input
                if (d.hide_input) {
                    $(this).addClass('hide_input');//.css({'position':'absolute','left':'-5000px','width':'2px','height':'2px'});// "hide" the Field by setting a negative offset
                    $(this).prev('label').on('click', function () {
                        $(this).next().toggleClass('hide_input')
                    });
                }
                ;

                // hide the label
                if (d.hide_label) {
                    $(this).prev('label').css('display', 'none');// hide the Label
                }

                // exclude the input completely (no saving)
                if (d.exclude_input) {
                    $(this).parent().remove();// delete the Field
                }

                // set a variable, defining that current entry was changed
                var ev = (e.prop('type') == 'text' || e.prop('nodeName') == 'TEXTAREA') ? 'keyup' : 'change';

                // activate the change-listener
                e[ev](function () {
                    hasCanged = true;
                });


            });// $('#colMidb .inp') END
            window.setTimeout(function () {
                $('#innerForm select').selectmenu();
                $('#colMidb textarea:not(".nosize")').autosize();
            }, 1000);

            styleButtons('colMidb');
            //myLayout.initContent('east');

            afterGetContent(id);
        });

    if (!obj) getConnectedReferences(id);
};

// empty Function to use as a hook for further content-processing
function afterGetContent(id) {
}

