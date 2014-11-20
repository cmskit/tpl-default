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
 * name: getTreeList
 * @param id
 * @param treeType
 */

function getTreeList(id, treeType)
{
    // define JS-Store-Object if not available
    if(!settings['objects'][objectName]) settings['objects'][objectName] = {};
    if(!settings['objects'][objectName]['stat']) settings['objects'][objectName]['stat'] = [];
    setThings('objects.'+objectName+'.stat', []);

    // define the GET-Parameter-String for this Object /
    var params = '&actTemplate=default&project='+projectName+'&object='+objectName+'&objectId='+id+'&tType='+treeType+'&filterKey='+$('#filterSelectBox>select').val()+'&limit='+limitNumber+'&offset=';

    // get the actual Path from the Root-Level down to the actual Element (id)
    if (id)
    {
        $.get('crud.php?action=getTreePath'+params,
            function(data)
            {
                var d = data.split(',');
                settings['objects'][objectName]['stat'] = d;
                setThings('objects.'+objectName+'.stat', d);
                //$.merge( store[objectName]['stat'], data.split(',') );
                //settings['objects'][objectName]['stat'] = $.unique(store[objectName]['stat']);
            })
    }
    else
    {
        settings['objects'][objectName]['stat'] = [];
        setThings('objects.'+objectName+'.stat', []);
    };

    // get the Tree itself
    $.get('crud.php?action=getTreeHead'+params,
        function(data)
        {
            $('#colLeftb').html(data);

            styleButtons('mainlistHead');

            $("#filterSelectBox>select").on('change', function() {
                getTreeList(id, treeType)
            });

            $("#mainlist2").folderTree(
                {
                    script: 'crud.php?action=getTreeList'+params,
                    loadMessage: _('load_Data') + '...',

                    // open all active Nodes defined in the Path above
                    statCheck: function(target)
                    {
                        target.find('li>span').each(function(i)
                        {
                            // bind the "getContent"-Event
                            $(this).on('click', function(e)
                            {
                                if($(e.target).data('id')) getContent($(e.target).data('id'));
                            });

                            if ($(this).data('id'))
                            {
                                var myd = $(this).data('id').toString();
                                // if the Entry is in the Tree-Path (= Parent-Element), (try to) open the Branch
                                if( $.inArray(myd, settings['objects'][objectName]['stat']) > -1 )
                                {
                                    $(this).parent().find(".ui-icon-circle-plus").trigger('click');
                                }
                                // highlight the actual Entry
                                if( myd == id )
                                {
                                    $(this).addClass('sel');
                                }
                            }
                        })
                    }
                })
        })

};
