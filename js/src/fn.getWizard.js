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
 * name: getWizard
 * @see getFrame
 * @param id
 * @param type
 * @param add
 *
 */
function getWizard (id, type, add)
{
    // if we get a Type pointing to an id we grab the real type from this Element
    // > open different wizards depending on a Selectbox-Selection
    if(type.substr(0,1)=='#') type=$(type).val();

    targetFieldId = id;
    getFrame( 'wizards/' + type + '/index.php?project='+projectName+'&object='+objectName+'&objectId='+objectId+((add)?'&'+add:'') );
};
