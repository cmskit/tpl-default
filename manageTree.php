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
************************************************************************************/

require '../../inc/php/header.php';
lookForLocales(__DIR__);

require_once $projectPath . '/objects/class.'.$objectName.'.php';

$treeType = $objects[$objectName]['ttype'];

// Reset Sort-Order to default
$_SESSION[$projectName]['objects'][$objectName]['sort'] = ($treeType == 'Tree') ? array('treeleft'=>'asc') : array();



$message = false;

if ( isset($_POST['pid']) && !empty($_POST['cid']) ) {
	$action = 'Add' . $objectName;
	//$_POST['pid'] = intval($_POST['pid']);
	
	// first we must check if the connection already exists
	$query = 	($treeType == 'Tree') ?
				'SELECT `treeparentid` AS i FROM `'.$objectName.'` WHERE `id` = ?' :
				'SELECT `pid` AS i FROM `'.$objectName.'matrix` WHERE `id` = ?';
	
	$dbn = $projectName.'\\DB';
	$prepare = $dbn::instance($db)->prepare($query);
	$prepare->execute(array($_POST['cid']));
	while ($row = $prepare->fetch())
	{
		if ($row->i == $_POST['pid']) {
			$action = 'Remove' . $objectName;
		}
	}
	
	// create the Objects
	$o = $projectName.'\\'.$objectName;
	
	$o1 = new $o();
	$parent = $o1->Get($_POST['pid']);
	
	$o2 = new $o();
	$child  = $o2->Get($_POST['cid']);
	
	
	if (!empty($_POST['bid'])) {
		$o3 = new $o();
		$beneath  = $o3->Get($_POST['bid']);
	} else {
		$beneath = false;
	}

	// no recursion detected
	if ( $parent->$action($child, $beneath) ) {
		$message = ($action == 'Remove'.$objectName)
                    ? L('connection_removed')
                    : L('connection_saved');
		// reload the Tree in Backend
		//$message .= '<script>parent.getList()</script>';
	}
	else
	{
		$message = L('recursion_detected');
	}
}

$data = array(
    'jquerypath' => '../../../vendor/cmskit/jquery-ui',
    'theme' => end($_SESSION[$projectName]['settings']['interface']['theme']),
    'url_params' => '?project='.$projectName.'&object='.$objectName,
    'js_params' => '../../crud.php?action=getTreeList&project='.$projectName.'&object='.$objectName.'&objectId=0&tType='.$treeType.'&limit=20&offset=',
    'objectName' => $objectName,
    'projectName' => $projectName,
    'message' => $message,
    'L' => L(array(
        'connect',
        'List_labels',
        'List_sort',
        'Connect_parent_child',
        'Beneath_ID',
        'Child_ID',
        'Parent_ID',
        'Help',
    )),
);

include 'tpl/manageTreeTpl/tpl.php';

$tpl = new manageTreeTpl();

?>
<!DOCTYPE html>
<html lang="<?php echo $lang; ?>">
<?php
echo $tpl->render_page($data);
?>
</html>