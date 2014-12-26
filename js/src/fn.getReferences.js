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
 * load references
 *
 * name: getReferences
 * @param id
 * @param offs1
 * @param offs2
 */
function getReferences (id, offs1, offs2, rn)
{

    var referenceName = rn ? $.trim(rn) : $('#referenceSelect>option:selected').val();

    // set the dropdown
    $('#referenceSelect').val(referenceName).selectmenu('refresh');

    if(referenceName)
    {


        $.get('crud.php',
            {
                action: 'getReferences',
                actTemplate: 'default',
                project: projectName,
                object: objectName,
                actTemplate: 'default',
                objectId: id,
                referenceName: referenceName,
                filterKey: $('#referenceFilterBox>select').val(),
                limit: limitNumber,
                offset: offs1,
                offset2: offs2
            },
            function(data)
            {

                $('#colRightb').html(data);

                styleButtons('colRightb');

                $('#referenceFilterBox>select').on('change', function(){
                    getReferences (id, offs1, offs2)
                });

                // make Lists sortable
                if (!client.touch) // drag&drop-mode
                {
                    $('#sublist, #sublist2').sortable({
                        items: 'li:not(.ui-state-disabled)',
                        connectWith: '.rlist',
                        placeholder: 'ui-state-highlight',
                        handle: 'span'
                    });

                    // only accept 1 Element if Parent-List (with Heading == 2)
                    $('.sublistParent').on('sortreceive', function(event, ui) {
                        if ($(this).children().length > 2)
                        {
                            $(ui.sender).sortable('cancel');
                            message(_('only_one_connection_allowed'), true, 5000);
                            return;
                        };
                    });

                    // save List-Sort after Update of DragDrop-Event, #sublist2
                    $("#sublist").on("sortupdate", function(event, ui)
                    {
                        saveReference();
                    });

                }
                else // checkbox-mode (no sorting possible atm)
                {

                    $('#colRightb .connect_check').on('click', function()
                    {

                        $.get('crud.php?action=setReference&actTemplate=default&project='+projectName+'&object='+objectName+'&objectId='+id+'&referenceName='+referenceName,
                            {
                                referenceId: $(this).val(),
                                connect: ($(this).prop('checked')?'true':'false')
                            },
                            function(data)
                            {
                                message(data);
                            });

                    });
                }



                function saveReference()
                {

                    $.post('crud.php?action=saveReferences&actTemplate=default&project='+projectName+'&object='+objectName+'&objectId='+id+'&referenceName='+referenceName,
                        {
                            order: $('#sublist').sortable('serialize', 'id')
                        },
                        function(data)
                        {
                            message(data);
                        });
                };



                // init Searchbox with Dialog
                $('#referenceSearchbox').autocomplete(
                    {
                        source: 'templates/default/search.php?project='+projectName+'&object='+referenceName,
                        select: function(event, ui)
                        {
                            //
                            var lnk = 'location=\'backend.php?ttemplate=default&project='+projectName+'&object='+referenceName+'#id='+ui.item.id+'\'';
                            var htm = '<h4>'+_('what_to_do')+'</h4>';
                            htm += '<button type="button" onclick="'+lnk+'">'+_('show_entry')+'</button> ';

                            // if the Entry is connectable (not conneted AND no Parent-Relation available)
                            if($('#sublist').find('#l_'+ui.item.id).length==0 && $('.sublistParent').children().length<2)
                            {
                                htm += '<button type="button" id="insertListItem">'+_('connect_entry')+'</button>';
                            };

                            $('#dialogb1').html(htm);

                            $('#dialogb1 button').button();
                            $('#dialog1').dialog();

                            // add Entry + save Relations
                            $('#insertListItem').on('click',function()
                            {
                                $('#sublist').html( $('#sublist').html() + '<li id="l_'+ui.item.id+'" class="ui-state-default ui-selectee"><div onclick="'+lnk+'">'+ui.item.label+'</div></li>');
                                $(this).hide();
                                saveReference();
                            });

                            return false;
                        },
                        minLength: 3
                    });

                //
                $('#colRightb .lnk')
                    .on('click',function(e)
                    {
                        showReference($(this));
                        e.preventDefault();
                    })
                    .on('contextmenu', function(e)
                    {
                        e.preventDefault();
                    });

                // show the east pane
                if(myLayout) myLayout.open('east');
            });

        //if(myLayout) myLayout.initContent('east');

    } else{
        getConnectedReferences(id);
    }
};
