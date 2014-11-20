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
 * name: getList
 * @param id
 *
 */
function getList(id)
{

    // Searchbox + Autocomplete
    $('#searchbox').autocomplete({
        source: 'templates/default/search.php?actTemplate=default&project='+projectName+'&object='+objectName,
        minLength: 3,
        response: function(){
            $('body').removeClass('loading');
        },
        select: function(event,ui)
        {
            getContent(ui.item.id);
            return false;
        }
    });


    var ic = (objectId.length>0);
    var objectHType = $('#objectSelect option[value="'+objectName+'"]').data('htype');

    if (objectHType && objectHType!='List')
    {
        getTreeList(id, objectHType);
        if(id)
        {
            setTimeout(function(){
                $('#mainlist2 .folder[rel="'+id+'"]').addClass('sel')
            }, 2000)
        }
    }
    else
    {
        getPlainList(id);

        if (id)
        {
            setTimeout(function(){
                $('#mainlist li[rel="'+id+'"]').addClass('ui-selected')
            },1000)
        }
    }

    // fill object-wizard-links
    setTimeout(function()
    {
        $('#objectWizards').html( $('#objectWizardHtml').html() );
        //$('#globalWizard').selectmenu();
    }, 1000);
};
