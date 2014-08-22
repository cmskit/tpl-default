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
*  A copy is found in the textfile GPL.txt and important notices to other licenses
*  can be found found in LICENSES.txt distributed with these scripts.
*
*  This script is distributed in the hope that it will be useful,
*  but WITHOUT ANY WARRANTY; without even the implied warranty of
*  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*  GNU General Public License for more details.
*
*  This copyright notice MUST APPEAR in all copies of the script!
*********************************************************************************/
// comments partly in german - sorry!
require '../../inc/php/header.php';
lookForLocales(__DIR__);

/**
 * @param $projectName
 * @param $objectName
 */
function saveToSession($projectName, $objectName)
{
    $sort = array();
    foreach ($_POST['order'] as $item) {
        $sort[$item['name']] = $item['value'];
    }

    //$_SESSION[$projectName]['objects'][$objectName]['sort'] = $sort;
    $_SESSION[$projectName]['settings']['sort'][$objectName] = $sort;

    exit(L('sort_saved'));
}

if (isset($_GET['action']) && $_GET['action']=='saveOrder' && isset($_POST['order']))
{
    saveToSession($projectName, $objectName);
}



$data = array(
    'jquerypath' => '../../../vendor/cmskit/jquery-ui',
    'theme' => end($_SESSION[$projectName]['settings']['interface']['theme']),
    'objectName' => $objectName,
    'projectName' => $projectName,
    'cols' => $objects[$objectName]['col'],
    'sort' => is_array($_SESSION[$projectName]['settings']['sort'][$objectName])
            ? $_SESSION[$projectName]['settings']['sort'][$objectName]
            : false,
    '' => '',
    'L' => L(array(
        'save',
        'sort',
        'Labels_in_list',
        'used',
        'available',
        'ascending',
        'descending',
        'One_sort_field_is_needed',
    )),
);

include 'tpl/editListTpl/tpl.php';

$tpl = new editListTpl();

?>
<!DOCTYPE html>
<html lang="<?php echo $lang; ?>">
<?php
echo $tpl->render_page($data);
?>
</html>
