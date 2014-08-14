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
/**
 * 
 * 
*/

require '../../inc/php/header.php';
lookForLocales(__DIR__);

// use + sanitize $_REQUEST (instead of $_GET)
$ids = explode(',', preg_replace('/[^a-z0-9,]/si', '', $_REQUEST['objectIds']));

$action = $_GET['action'];

if(count($ids)<2) exit(L('less_than_2_IDs_given'));

//$projectPath = '../../../projects/' . strtolower($projectName);
require $projectPath . '/objects/class.' . $objectName . '.php';

$o = $projectName.'\\'.$objectName;
$obj = new $o();
$cnt = 0;

// Template for str_replace('#####','delete', $click)
$click = 'specialAction(\'inc/php/multiList.php?action=#####&project='.$projectName.'&object='.$objectName.'&objectIds='.$_GET['objectIds'].'\', \'colMidb\')';


// Action-Menu
if($action == 'showActions')
{
	
	echo '<h2>IDs: '.$_GET['objectIds'].'</h2>
		<button type="button" onclick="var q=confirm(\''.L('really_delete_entries').'\');if(q){' . 
		str_replace('#####','delete', $click) . 
		'}" rel="trash">'.L('delete_entries').'</button>';
	
	echo '<hr /> 
		<button type="button" onclick="' . 
		str_replace('#####','export&type=xml', $click) . 
		'" rel="trash">'.L('export_entries').'</button>';
	
}

// delete Entries
if($action == 'delete')
{
	
	foreach($ids as $id)
	{
		if($el = $obj->Get($id))
		{
			//$el->Delete();
			$cnt++;
		}
	}
	echo '<h2>'.$cnt.' '.L('deleted').'</h2>';
}

// Export Entries as XML (not functional atm!!!!!!)
if($action == 'export')
{
	echo '<h2>IDs: '.$_GET['objectIds'].' '.L('exported').' ('.$_GET['type'].')</h2>';
}

?>
