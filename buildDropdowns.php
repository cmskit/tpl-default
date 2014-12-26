<?php
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
 * build HTML for the dropdowns located in the header
 *
 * @param $projectName string the project name
 * @param $objectName string the object name
 * @param $user_wizards array
 * @return array
 */
function buildDropdowns($projectName, $objectName, $user_wizards)
{
    $d = array('objectSelect' => '', 'tplSelect' => '', 'uwizSelect' => '');
    // build Object-Selector
    $d['objectSelect'] = '<select id="objectSelect">' .
        '<option value="" data-htype=""> ' . L('availabe_Sections') . " </option>\n";

    foreach ($_SESSION[$projectName]['objectOptions'] as $group => $arr) {
        $d['objectSelect'] .= '<optgroup label="' . (($group != '0') ? ' ' . $group . '' : '') . '">';
        foreach ($arr as $option) {
            $opt_state = ($option['name'] == $objectName) ? ' selected="selected"' : '';
            if (substr($option['label'], 0, 1) !== '.') {
                $d['objectSelect'] .= '	<option' . $opt_state . ' value="' . $option['name'] . '" data-htype="' . $option['htype'] . '"> ' . $option['label'] . '</option>';
            }
        }
        $d['objectSelect'] .= '</optgroup>';
    }
    $d['objectSelect'] .= '</select>';

    // build Template-Selector if needed
    $d['tplSelect'] = '';
    if ($objectName && count($_SESSION[$projectName]['templates'][$objectName]) > 1) {
        $d['tplSelect'] .= '<select id="templateSelect">' .
            '<option value="">' . L('availabe_Templates') . "</option>\n";
        foreach ($_SESSION[$projectName]['templates'][$objectName] as $templatename) {
            $d['tplSelect'] .= '<option value="' . $templatename . '">' . L($templatename) . '</option>';
        }
        $d['tplSelect'] .= '</select>';
    }

    // build user wizard selector

    if (isset($user_wizards)) {
        $d['uwizSelect'] = '
    <span>
    <select id="globalWizard" onchange="openGlobalWizard(this)">
        <option value=""> ' . L('Wizards') . ' </option>
        <optgroup label="' . L('global_wizards') . '">
        ';
        foreach ($user_wizards as $wizards) {
            if (isset($wizards['url']) && isset($wizards['name'])) {
                $d['uwizSelect'] .= '		<option value="' . $wizards['url'] . '"> ' . L($wizards['name']) . ' </option>';
            }
        }
        $d['uwizSelect'] .= '</optgroup>
        <optgroup id="objectWizards" label="' . L('object_wizards') . '">
        </optgroup>
    </select>
    </span>';
    }
    return $d;
}