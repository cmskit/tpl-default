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
 ************************************************************************************/

/**
 * this extends inc/php/class.crud.php
 *
 *
 * @package crud
 */
class default_crud extends crud
{
    /**
     * create LI-Tags for Reference-Lists objectname, id|label, no dragging
     *
     * @return
     * $referenceName, $referenceId, $label
     * $n, $id, $lbl
     */
    public function strLi($referenceName, $referenceId, $label, $nodrag = false, $link = true, $connected = false)
    {
        $label = trim(strip_tags($label));
        return //open the LI
            '<li id="l_' . $referenceId . '" class="ui-state-default ui-selectee">'

            // drag-handler
            . (
            $nodrag
                ? ''
                // we need a simpler, non-drag connecting-method on touchscreen-devices
                : ((!$_SESSION[$this->projectName]['client']['touch'])
                ? '<span class="rel-left-bubble ui-state-default ui-corner-all" title="drag here"><em class="ui-icon ui-icon-arrow-2-n-s"></em></span>'
                : '<input type="checkbox" class="rel-left-bubble connect_check" value="' . $referenceId . '" ' . ($connected ? 'checked="checked"' : '') . ' /> '
            )
            )
            // link to object
            . (
            $link
                ? '<a title="id: ' . $referenceId . '" class="lnk" data-object="' . $referenceName . '" data-id="' . $referenceId . '" href="#">'
                : '<em class="ui-state-disabled" title="' . $this->L('not_accessible') . '">'
            )

            // ensure some alternative Text if the Label is empty
            . ((strlen($label) > 0) ? substr($label, 0, 100) : '[...]')

            . ($link ? '</a>' : '</em>') // see link

            . '</li>';
    }


    /**
     *
     *
     * @return
     */
    public function exportList()
    {
        $this->offset = 0;
        $this->limit = -1;
        $list = $this->getList(true);
        $line = array();
        $type = $_GET['type'];
        $doc = array();
        $doc['xml'] = "<?xml version=\"1.0\" encoding=\"utf-8\" ?>\n<list>\n";
        $doc['csv'] = '';

        foreach ($list as $i) {
            $xml = "\t<row>\n";
            $csv = array();
            foreach ($this->objects[$this->objectName]['col'] as $k => $v) {
                $value = str_replace(array('"', "\t", "\r", "\n"), array('""', ' ', '', ' '), $i->$k);
                $value = '"' . trim($value) . '"';
                $csv[] = $value;
                $xml .= '		<field name="' . $k . '">' . htmlentities($i->$k) . "</field>\n";
            }
            $doc['xml'] .= $xml . "\t</row>\n";
            $doc['csv'] .= implode("\t", $csv) . "\n";
        }
        $doc['xml'] .= "</list>\n";

        // Set headers
        header("Content-type: application/octet-stream");
        header("Content-Disposition: attachment; filename=\"my-data.$type\"");
        echo $doc[$type];
    }


    /**
     *
     *
     * @return
     */
    public function getPagination()
    {
        $name = $this->projectName . '\\DB';
        $obj = new $name();
        $cnt = intval($obj->instance($this->dbi)->query('SELECT COUNT(*) AS c FROM `'.$this->objectName.'`')->fetch()->c);

        //$html =  $c .'/'. $this->limit .'/'. $this->offset;
        $p = ceil($cnt / $this->limit);
        $html = '<br />';
        for ($i=0; $i<$p; $i++)
        {
            //  onclick="setPagination('.$i.')"
            $min = $i*$this->limit;
            $html .= '<span title="'.$min.'-'.($min+$this->limit).' ['.$cnt.']" '.(($min===$this->offset) ? ' style="text-decoration:underline"' : '').' data-page="'.$i.'">['.($i+1).']</span> ';
        }
        return $html . '<br />';
        //return '<br />' . $cnt . $this->projectName . 'xxx<br />';
    }

    /**
     * @param int $c
     * @return string
     */
    public function getListHead($c = 0)
    {
        $lbl = ($this->mobile === 1)
            ? array($this->L('prev'), $this->L('go'), $this->L('next'))
            : array('.', '.', '.');

        $str = '<span id="objectWizardHtml">';

        // fill Object-Wizards
        if (is_array($this->objects[$this->objectName]['url'])) {
            $ua = $this->objects[$this->objectName]['url'];
            foreach ($ua as $label => $link) {

                $link = str_replace('///', '://', $link);
                $str .= ($this->mobile === 1) ?
                    '<li><a href="javascript:getFrame(template(\'' . $link . '\',window))"><span class="ui-icon ui-icon-gear"></span> ' . $label . '</a></li>' :
                    '<option value="' . $link . '">' . $label . '</option>';
            }
        }
        $str .= '</span>';

        $page = $this->offset / $this->limit;

        // Button-Bar
        $str .= '<div id="mainlistHead"><!--lb1-->';

        // container for the filter-select
        $str .= '<div id="filterSelectBox">' . $this->buildFilterSelect($this->objectName) . '</div>';

        // pagination prev-Button
        $str .= $this->createButtonHtml('arrowthick-1-w', false, 'setPagination(' . ($page - 1) . ')', ($this->offset > 0));

        // pagination-Button
        $str .= $this->createButtonHtml('arrowthick-2-e-w', false, 'showPagination()', ($this->offset > 0 || $c > $this->limit));

        // pagination next-Button
        $str .= $this->createButtonHtml('arrowthick-1-e', false, 'setPagination(' . ($page + 1) . ')', ($c > $this->limit));

        // spacer
        $str .= '&nbsp;|&nbsp;';

        // new-Button
        if (!isset($this->disallow['newbutton'])) $str .= '<button rel="plus" id="createButton" onclick="createContent()" title="' . $this->L('new_entry') . '">.</button>';

        // sort-Button
        if (!isset($this->disallow['sortbutton'])) $str .= '<button rel="shuffle" onclick="getFrame(\'templates/default/editList.php?project=' . $this->projectName . '&object=' . $this->objectName . '\')" title="' . $this->L('sort') . '">.</button>';

        $str .= '<!--lb2--><div id="pagination"></div></div>';

        return $str;
    }

    /**
     * @param bool $returnLi
     * @param bool $returnRaw
     * @return string
     */
    public function getListString($returnLi = true, $returnRaw = false)
    {
        $o = $this->projectName . '\\' . $this->objectName;
        $obj = new $o();
        $list = $obj->GetList($this->getListFilter, $this->sortBy, $this->limit + 1, $this->offset);

        if ($returnRaw) return $list;

        // array to jump to a pagination containing an ID
        $this->idsInList = array();


        $c = 0;
        $str1 = $str2 = '';

        foreach ($list as $i) {

            if ($c < $this->limit) {
                $this->idsInList[] = $i->id;
                $str1 .= '<li title="id: ' . $i->id . '" class="ui-state-default ui-selectee" rel="' . $i->id . '">';
                // List-Label
                $l = '';
                foreach ($this->objectFields as $v) {
                    $l .= $i->$v . ' ';
                }
                $str1 .= substr(trim(strip_tags($l)), 0, 100) . '</li>';
            }
            $c++;
        }

        if ($returnLi) return $str1;

        $str0 = '<ul id="mainlist" data-role="listview" class="ilist rlist">';
        $str2 .= '</ul>';


        return $this->getListHead($c) . $str0 . $str1 . $str2;
    }

    /**
     *
     *
     * @return
     */
    public function getTreeHead()
    {
        // Buttons
        $str = '<div id="mainlistHead"><!--lb1-->';
        $str .= '<div id="filterSelectBox">' . $this->buildFilterSelect($this->objectName) . '</div>';
        // New-Button
        if (!isset($this->disallow['newbutton'])) $str .= $this->createButtonHtml('plus', 'new_entry', 'createContent()');
        // Sort-Button
        $str .= $this->createButtonHtml('shuffle', 'sort', 'getFrame(\'templates/default/editList.php?project=' . $this->projectName . '&object=' . $this->objectName . '\')');
        // Order-Button
        if (!isset($this->disallow['orderbutton'])) $str .= $this->createButtonHtml('link', 'order', 'getFrame(\'templates/default/manageTree.php?project=' . $this->projectName . '&object=' . $this->objectName . '\')'); //'<button rel="link" onclick="getFrame(\'inc/php/manageTree.php?project='.$this->projectName.'&object='.$this->objectName.'\')" title="'.$this->L('arrange').'">'.$this->L('arrange').'</button>';
        $str .= '<!--lb2--></div>';
        $str .= '<div id="mainlist2"></div>';

        return $str;
    }


    /**
     *
     *
     * @return
     */
    public function getTreeList()
    {
        $o = $this->projectName . '\\' . $this->objectName;
        $obj = new $o();
        $pid = preg_replace('/\W/', '', $_POST['id']);
        $ttype = $_GET['tType'];
        $this->limit -= 2; // we have at least two additional List-Elements

        // if we have a filter-key we overwrite all rules
        if (!empty($_GET['filterKey']) && isset($_SESSION[$this->projectName]['filter'][$this->objectName][$_GET['filterKey']])) {
            $f = $_SESSION[$this->projectName]['filter'][$this->objectName][$_GET['filterKey']];

            if (!empty($f['select'])) $this->getListFilter = $this->prepareFilterArray($f['select']);
            //if (!empty($f['sort'])) $this->sortBy = $f['sort'];
            if (!empty($f['show'])) $this->objectFields = $f['show'];

        }
        // filter END


        // 						fcv, sort, limit, offset, parentId, depth
        $tree = $obj->GetTreeList($this->getListFilter, $this->sortBy, $this->limit + 1, $this->offset, $pid, 1);

        $c = 0;
        $str = '<ul class="jqueryFolderTree" style="display:none">';

        // draw back-button
        if ($this->offset > 0) {
            $n = $this->offset - $this->limit;
            $str .= '<li class="foldoffset' . (($this->objectId != 0) ? '' : ' master') . '" data-pid="' . $pid . '" data-offset="' . $n . '"><label class="foldico ui-icon ui-icon-arrowthick-1-w"></label><span>' . $this->L('prev') . ' ( ' . $this->L('page') . ' ' . (($n / $this->limit) + 1) . ' )</span></li>';
        }

        foreach ($tree as $t) {
            // get the List-Entries
            if ($c < $this->limit) {
                $str .= '<li' . (($this->objectId != 0) ? '' : ' class="master"') . ' data-id="' . $t->id . '">' .
                    '<label class="foldico ' . (($t->treechilds > 0) ? 'ui-icon ui-icon-circle-plus' : '') . '" data-id="' . $t->id . '"></label>' .
                    '<span title="id: ' . $t->id . '" data-id="' . $t->id . '" class="folder">';

                $lbl = '';
                foreach ($this->objectFields as $v) {
                    $lbl .= ' ' . $t->$v;
                }
                if (strlen(trim($lbl)) == 0) {
                    $lbl = '[...]';
                }
                $str .= $lbl . '</span></li>';
            } else {
                // draw next-button
                $str .= '<li class="foldoffset' . (($this->objectId != 0) ? '' : ' master') . '" data-pid="' . $pid . '" data-offset="' . ($this->offset + $this->limit) . '"><label class="foldico ui-icon ui-icon-arrowthick-1-e"></label><span>' . $this->L('next') . ' ( ' . $this->L('page') . ' ' . (($this->offset / $this->limit) + 2) . ' )</span></li>';
                break;
            }
            $c++;
        }

        $str .= '</ul>';

        return $str;

    }

    /**
     *
     *
     * @return
     */
    private function processLabel($a, &$cnt, &$tabHeads)
    {
        if (!is_array($a)) return '';

        $arr = $a; //clone $a;
        $str1 = $strp1 = '';


        if (isset($arr['accordionhead'])) {
            $str1 = (
                ($cnt > 0)
                    ? '</div>'
                    : '<div id="accordion">'
                )

                . '<h3><a href="#">'
                . $arr['accordionhead']
                . '</a></h3><div>';

            $strp1 = '</div>';
            $cnt++;
        }

        if (isset($arr['tabhead'])) {
            if ($cnt == 0) {
                $tabHeads = array();
            }
            $str1 = (($cnt > 0)
                    ? '</div>'
                    : '<div id="tabs">###TABSHEAD###') . '<div id="tabs-' . $cnt . '">';
            $strp1 = '</div>';
            $tabHeads[] = '<li><a href="#tabs-' . $cnt . '">' . $arr['tabhead'] . '</a></li>';
            $cnt++;
        }

        //crappy
        if (isset($arr['angle'])) {
            $arr['label'] = '<u onclick="openDoc(\'' . str_replace(array('LANG', 'PROJECT'), array($this->lang, $this->projectName), $arr['angle']) . '\')">' . $arr['label'] . '</u>';
        }

        if (isset($arr['round'])) {
            $arr['label'] = '<a href="#">' . $arr['label'] . '<span>' . $arr['round'] . '</span></a>';
        }

        return array(
            'lbl' => $arr,
            'str1' => $str1,
            'strp1' => $strp1,
        );
    }

    /**
     *
     *
     * @return
     */
    public function getContent()
    {

        $field = '';

        // Content-Variables
        $strp0 = $strp = $strp1 = $str0 = $str1 = $str2 = $js = '';

        // if the object is empty (to be created)
        if ($this->objectId == 0) {
            $o = $this->projectName . '\\' . $this->objectName;
            $obj = new $o();
            $item = $obj->Get(0);
        } else {
            $item = $this->getElementBy($this->objectId, $this->getContentFilter);
            //print_r($item);
            if (empty($_GET['relObject'])) {
                // collect Relations
                if (isset($this->objects[$this->objectName]['rel'])) {
                    $js .= '$.ctrl("0",function(s){getReferences(objectId,0,0,\'\')});';
                    $c = 1;
                    foreach ($this->objects[$this->objectName]['rel'] as $rk => $rt) {
                        $str0 .= '<option title="ctrl+' . $c . '" class="relType' . $rt . '" value="' . $rk . '">' . (isset($this->objects[$rk]['lang'][$this->lang]) ? trim($this->objects[$rk]['lang'][$this->lang], '.') : $rk) . '</option>';
                        $js .= '$.ctrl("' . $c . '",function(s){getReferences(objectId,0,0,\'' . $rk . '\')});';
                        $c++;
                    }
                }

                if (strlen($str0) > 0) {
                    // hide this select if users shouldn't select ANY References
                    $hide = (isset($this->disallow['referenceselect']) ? ' style="display:none"' : '');
                    $str0 = '<select' . $hide . ' id="referenceSelect" onchange="getReferences(\'' . $this->objectId . '\',0)"><option title="ctrl+0" value="" class="relType">' . $this->L('relations_to_this_entry') . '</option>' . $str0 . '</select>';
                }
            } else {
                // show a close detail view
                $str0 .= '<button style="float:right" type="button" rel="close" onclick="location.reload()">.</button> ';
            }

            // create a Selectbox to open "virtual urls" (Previews, Wizards etc.)
            if (!empty($this->objects[$this->objectName]['vurl']) && !isset($this->disallow['previewbutton'])) {
                $str0 .= '<select id="previewSelect" onchange="if(this.value.length>0){getFrame(this.value)};this.selectedIndex=0"><option value="">' . L('wizard') . '</option>';
                $c = 1;
                foreach ($this->objects[$this->objectName]['vurl'] as $path => $label) {
                    //$h = explode(' ', $v);
                    $str0 .= '<option value="'
                        . str_replace(
                            array('|', 'PPATH', 'OBJECT', 'ID'),
                            array(':', '../projects/' . $this->projectName, $this->objectName, $this->objectId),
                            $path
                        )
                        . '">'
                        . (!empty($label) ? $label : L('preview') . ' ' . $c)
                        . '</option>';
                    $c++;
                }
                $str0 .= '</select>';
            }

        }

        $str0 .= '<!--cb1-->';

        $str0 .= '<div id="innerForm">';

        $cnt = 0;
        $tabHeads = null;
        $col = $this->objects[$this->objectName]['col'];

        // loop the Fields
        foreach ($col as $fk => $fv) {
            // dont show xxid & xxsort - Fields
            if (substr($fk, -2) == 'id' || substr($fk, -4) == 'sort') {
                continue;
            }

            // load the Field-Template
            if ($fv['tpl']) {
                require_once(__DIR__ . '/fields/' . $fv['tpl'] . '.php');
            }


            $lbl = $fk;
            $placeholder = '';

            // translated Labels
            if (isset($fv['lang'][$this->lang]['label'])) {
                $a = $this->processLabel($fv['lang'][$this->lang], $cnt, $tabHeads);

                $str1 .= $a['str1'];
                $strp0 .= $a['strp'];

                $lbl = $a['lbl']['label'];
                if (isset($a['lbl']['square'])) {
                    $placeholder = $a['lbl']['square'];
                }

            }
            //if lang END

            $fks = substr($fk, 0, 2);

            // simple base64-decoding
            if ($fks == 'e_') {
                $item->$fk = base64_decode($item->$fk);
            }

            // decryption
            if ($fks == 'c_') {
                if (isset($_SESSION[$this->projectName]['config']['crypt'][$this->objectName][$fk])) {
                    require_once('crypt.php');
                    // objectname, fieldname, entry_id, password
                    $key = md5($this->objectName . $fk . $_SESSION[$this->projectName]['config']['crypt'][$this->objectName][$fk]);
                    $key2 .= md5($key2 . $key);
                    $type = substr($fv['type'], -4);
                    //$item->$fk =	($type=='CHAR') ?
                    //				X_OR::decrypt($item->$fk, $key2) :
                    $configObject = $this->projectName . '\\Configuration';
                    $item->$fk = Blowfish::decrypt($item->$fk, $key2, md5($configObject::$DB_PASSWORD[0]));
                } else {
                    $item->$fk = $this->L('not_decryptable');
                }
            }

            // Replacement-Start
            $str1 .= '<!--s_' . $fk . '-->';


            $data = '';
            if ($fv['add']) {
                foreach ($fv['add'] as $dk => $dv) {
                    if (is_array($dv)) $dv = json_encode($dv);
                    $data .= 'data-' . $dk . "='" . $dv . "' ";
                }
            }
            // example: draw_xyz ($name, $id, $label, $val, $data)
            if (function_exists('draw_' . $fv['tpl'])) {
                $str1 .= call_user_func('draw_' . $fv['tpl'], $fk, 'input_' . $fk, $lbl, $placeholder, $item->$fk, $data);
            }

            // end of field
            $str1 .= '<!--e_' . $fk . '-->';

            // if a generic structure is detected
            // the structure is {"name" : "MODELNAME", "fields" : {"xxx":{"value":"abc"},"yyy":{"value":"def"}} }
            if ($fv['type'] == 'MODEL') {

                $json = $item->$fk;

                if (is_string($json) && $json = json_decode($json, true)) {

                }

                @$extModel = $this->ppath . '/objects/generic/' . $json['__TEMPLATE__']['value'] . '.php';
                if (file_exists($extModel)) {
                    // load the external model
                    include_once $extModel;
                    // merge the two models
                    $json = array_replace_recursive($genericModel[$json['__TEMPLATE__']['value']], $json);
                }
                //print_r($json);
                foreach ($json as $jk => $jv) {
                    // skip if props are not available (== fields are not correct)
                    if (!isset($jv['tpl']) || !isset($jv['type']) || !isset($jv['value'])) {
                        continue;
                    }

                    //
                    require_once(__DIR__ . '/fields/' . $jv['tpl'] . '.php');
                    if (function_exists('draw_' . $jv['tpl'])) {
                        $jlbl = trim($jk, '_');
                        $placeholder = '';
                        if (isset($jv['lang'][$this->lang])) {
                            $a = $this->processLabel($jv['lang'][$this->lang], $cnt, $tabHeads);

                            $str1 .= $a['str1'];
                            $strp .= $a['strp'];
                            $jlbl = $a['lbl']['label'];
                            if (isset($a['lbl']['square'])) {
                                $placeholder = $a['lbl']['square'];
                            }
                        }

                        $data = '';
                        if (is_array($jv['add'])) {
                            foreach ($jv['add'] as $dk => $dv) {
                                if (is_array($dv)) $dv = json_encode($dv);
                                $data .= 'data-' . $dk . "='" . $dv . "' ";
                            }
                        }
                        // example: draw_xyz ($name, $id, $label, $val, $data)
                        $id = 'input_' . $fk . '_' . $jk;
                        $str1 .= call_user_func('draw_' . $jv['tpl'], $fk . '[' . $jk . '][value]', $id, $jlbl, $placeholder, $jv['value'], $data);
                    } else {
                        $str1 .= '<p>content-type "' . $jv['type'] . '" does not exist!</p>';
                    }
                }

            }
            // generic model END


        }
        // foreach END

        $str1 .= '</div>';

        if (isset($tabHeads)) {
            $str1 = str_replace('###TABSHEAD###', '<ul>' . implode('', $tabHeads) . '</ul>', $str1);
        }

        // close a possible Tab-/Accordion-Container
        if ($cnt > 0) {
            $str1 .= '</div>';
        }

        // Content-Buttons (created here because they need IDs and Style-Attributes)
        $str2 .= '<div style="clear:both"><span style="float:right"><!--cb3-->';
        if (!isset($this->disallow['deletebutton'])) {
            $str2 .= '<button id="deleteButton" type="button" rel="trash" onclick="deleteContent(\'' . $this->objectId . '\'' . (!empty($_GET['relObject']) ? ",'" . $this->objectName . "'" : '') . ')">' . $this->L('delete_entry') . '</button> ';
        }
        $str2 .= '</span><!--cb2-->';
        if (!isset($this->disallow['savebutton'])) {
            $str2 .= '<button id="saveButton" data-id="' . $this->objectId . '" type="button" rel="disk" onclick="saveContent(\'' . $this->objectId . '\'' . (!empty($_GET['relObject']) ? ",'" . $this->objectName . "'" : '') . ')">' . $this->L('save') . '</button> ';
            $str2 .= '<button id="saveNewButton" data-id="' . $this->objectId . '" type="button" rel="newwin" onclick="saveContent(\'0\'' . (!empty($_GET['relObject']) ? ",'" . $this->objectName . "'" : '') . ')">' . $this->L('duplicate') . '</button> ';
        }

        if (!empty($_GET['relObject'])) {
            $str2 .= '<button type="button" rel="close" onclick="location.reload()">.</button> ';
        }

        // Javascript-Slot (insert a Newline at first)
        $str2 .= '</div>
<script>
' . $js . '
// <!--js-->
</script>';

        return $str0 . $strp0 . $str1 . $strp1 . $str2;
    }

    /**
     * create a special UI for grouped actions if multiple Items (ctrl+click) selected
     *
     * @return
     */
    public function getMultiReferenceList($returnRaw = false)
    {
        if (empty($_GET['referenceName'])) return '';
        $ids = explode(',', $this->objectId);
        $cnt = count($ids);

        $aa = array($this->objectName, $this->referenceName);
        natcasesort($aa);

        //require_once($this->ppath.'/objects/__database.php');
        //require_once($this->ppath.'/objects/class.'.$this->referenceName.'.php');
        $dbo = $this->projectName . '\\DB';
        $rn = $this->projectName . '\\' . $this->referenceName;
        $obj = new $rn();

        $query = 'SELECT `' . $this->referenceName . 'id` AS id FROM `' . implode('', $aa) . 'map` WHERE `' . $this->objectName . 'id` IN (' . $this->objectId . ') ORDER BY id;';

        // fetch ids from the map-table
        $dbobj = new $dbo();
        $list = $dbobj->instance(0)->query($query)->fetchAll();

        $out = '';
        $hold = array();
        $i = 0;

        $labels = $_SESSION[$this->projectName]['settings']['labels'][$this->referenceName];

        // now create the list
        $out = '<ul class="ilist rlist">';
        $rawOut = array();
        foreach ($list as $rel) {
            $hold[] = $rel->id;

            // this is the intersect-check (AND)
            if ($_GET['ctype'] == 'AND' && $hold[count($hold) - $cnt] != $rel->id) continue;
            // this is the unique-check (OR)
            if ($_GET['ctype'] == 'OR' && $hold[count($hold) - 2] == $rel->id) continue;

            $item = $obj->Get($rel->id);
            $rawOut[] = $item;

            $out .= '<li onclick="getContent(\'' . $rel->id . '\', \'' . $this->referenceName . '\')" class="ui-state-default ui-selectee">';
            foreach ($labels as $l) {
                $out .= $item->$l . ' ';
            }
            $out .= '</li>';
        }
        $out .= '</ul>';


        return ($returnRaw ? $rawOut : $out);
    }

    /**
     * create a special UI for grouped actions if multiple Items (ctrl+click) selected
     *
     * @return
     */
    public function multiSelect()
    {
        $ids = explode(',', $this->objectId);
        $cnt = count($ids);

        // "template" for the action (replace AAAAction, TTTTarget, PPPPostdata)
        $click = 'specialAction(\'crud.php?action=AAAA&project=' . $this->projectName . '&object=' . $this->objectName . '&objectId=' . str_replace("'", "\\'", $this->objectId) . '\', TTTT, PPPP)';


        $str = '<h2 title="IDs: ' . $this->objectId . '">' . $cnt . ' ' . $this->L('entries_selected') . '</h2>';


        // collect Relations
        $str0 = '';
        if (isset($this->objects[$this->objectName]['rel'])) {
            foreach ($this->objects[$this->objectName]['rel'] as $rk => $rt) {
                $str0 .= '<option class="relType' . $rt . '" value="' . $rk . '">' . (isset($this->objects[$rk]['lang'][$this->lang]) ? trim($this->objects[$rk]['lang'][$this->lang], '.') : $rk) . '</option>';
            }
        }
        if (strlen($str0) > 0) {
            // hide this select if users shouldn't select ANY References
            $hide = (isset($this->disallow['referenceselect']) ? ' style="display:none"' : '');
            $str0 = '<select' . $hide . ' id="referenceSelect" onchange="' . $click . ';this.selectedIndex=0"><option value="" class="relType">' . $this->L('relations_to_this_entry') . '</option>' . $str0 . '</select>';

            // select for AND
            $str .= '<div><label>' . $this->L('references_connected_to_all_entries') . '</label>' . str_replace(array('AAAA', 'TTTT', 'PPPP'), array('getMultiReferenceList&ctype=AND&referenceName=\'+this.value+\'', "'colRightb'", 'false'), $str0) . '</div>';

            // select for OR
            $str .= '<div><label>' . $this->L('references_connected_to_one_of_the_entries') . '</label>' . str_replace(array('AAAA', 'TTTT', 'PPPP'), array('getMultiReferenceList&ctype=OR&referenceName=\'+this.value+\'', "'colRightb'", 'false'), $str0) . '</div>';

        }

        $str .= '<hr />';


        $str .= '<strong>' . $this->L('change_values_for') . ':</strong>
				<select class="selectbox" id="multiFieldSelect" onchange="$(\'#multiField\').html(this.value);prettify(\'multiField\');">
				<option title="" value="">' . $this->L('select_field') . '</option>';


        // generate some actions for one of the columns
        foreach ($this->objects[$this->objectName]['col'] as $fk => $fv) {
            // dont show xxid & xxsort
            if (substr($fk, -4) == 'sort' || substr($fk, -2) == 'id') {
                continue;
            }

            if ($type = $fv['tpl']) {
                require_once(__DIR__ . '/fields/' . $type . '.php');

                $lbl = ((isset($fv['lang'][$this->lang]['label'])) ? $fv['lang'][$this->lang]['label'] : $fk);
                // func($name, $id, $label, $placeholder, $value, $data_attributes)
                $htm = call_user_func('draw_' . $type, $fk, 'input_' . $fk, $lbl, '', '', '');
                //str_replace(' name="',' id="input_', $htm)
                $str .= '<option title="' . $fk . '" value="' . htmlentities($htm) . '">' . $lbl . '</option>';
            }
        }
        $str .= '</select><br /><br /><div id="multiField"> </div>';


        $str .= '<hr />';

        // show delete-button
        if (!isset($this->disallow['deletebutton'])) {
            //$str .= '<button type="button" style="float:right" onclick="var q=confirm(\''.str_replace('%s', $cnt, $this->L('really_delete_these_entries')).'?\');if(q){' . str_replace(array('AAAA','TTTT','PPPP'), array('multiDelete','false','false'), $click) . '}" rel="trash">'.$this->L('delete_entries').'</button>';
            $str .= '<button type="button" style="float:right" onclick="var q=confirm(\'' . str_replace('%s', $cnt, $this->L('really_delete_these_entries')) . '?\');if(q){multiDelete([' . $this->objectId . '])}" rel="trash">' . $this->L('delete_entries') . '</button>';
        }

        // show save-button
        if (!isset($this->disallow['savebutton'])) {
            //$str .= '<button type="button" onclick="var mn=$(\'#multiFieldSelect\').find(\'option:selected\').attr(\'title\');if(mn.length>0){var q=confirm(\''.str_replace('%s', $cnt, $this->L('really_change_these_entries')).'?\');if(q){' . str_replace(array('AAAA','TTTT','PPPP'), array('multiSave&fieldName=\'+mn+\'','false','$(\'#input_\'+mn).val()'), $click) . '}}else{message(\''.$this->L('choose_field').'\')}" rel="disk">'.$this->L('save').'</button>';
            $str .= '<button type="button" onclick="var mn=$(\'#multiFieldSelect\').find(\'option:selected\').attr(\'title\');if(mn.length>0){var q=confirm(\'' . str_replace('%s', $cnt, $this->L('really_change_these_entries')) . '?\');if(q){multiSave([' . $this->objectId . '])}}else{message(\'' . $this->L('choose_field') . '\')}" rel="disk">' . $this->L('save') . '</button>';
        }


        return $str;
    }


    /**
     *
     *
     */
    public function getConnectedReferenceList($item, $referenceName, $noconnectors = true, $connected = false, $counter)
    {
        $projectName = $this->projectName;
        $rt = $this->objects[$this->objectName]['rel'][$referenceName];

        $lok = strtolower($referenceName);
        $lokId = $lok . 'id';
        $str = '';
        $pId = false;
        $out = '';
        $this->foundReferences = array();

        //require_once($this->ppath.'/objects/class.'.$lok.'.php');

        switch ($this->objects[$referenceName]['rel'][$this->objectName]) {
            // Sibling List
            case 's':

                $c = 'Get' . $referenceName . 'List';
                $sort = (
                isset($_SESSION[$this->projectName]['sort'][$referenceName])
                    ? $_SESSION[$this->projectName]['sort'][$referenceName]
                    : array()
                );
                $relList = $item->$c($this->getAssocListFilter, $sort, $this->limit + 1, $this->offset);

                break;

            // Child List
            case 'p':
                $c = 'Get' . $referenceName . 'List';
                $sort = array();
                if (isset($this->objects[$referenceName]['rel'][$this->objectName . 'sort'])) {
                    $sort = array($this->objectName . 'sort' => 'asc');
                }
                if (isset($_SESSION[$projectName]['sort'][$referenceName])) {
                    $sort = $_SESSION[$projectName]['sort'][$referenceName];
                }
                $relList = $item->$c($this->getAssocListFilter, $sort, $this->limit + 1, $this->offset);
                break;

            // Parent Element
            case 'c':
                $c = 'Get' . $referenceName;
                $myItem = $item->$c();
                $relList = (
                isset($myItem->id)
                    ? array($myItem)
                    : array()
                );
                break;
        }


        $head = '<div>'
            . '<div title="' . (!empty($counter) ? 'ctrl+' . $counter : '') . '" onclick="getReferences(objectId,0,0,\'' . $referenceName . '\')" class="ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all">'
            . '<span style="font-weight:bold;padding:15px">'
            //. (!empty($counter)?'('.$counter.') ':'')
            . (
            isset($this->objects[$referenceName]['lang'][$this->lang])
                ? trim($this->objects[$referenceName]['lang'][$this->lang], '.')
                : $referenceName
            )
            . '</span>';

        // if needed, add prev-button
        if ($this->offset > 0) {
            $head .= '<button rel="arrowthick-1-w" title="' . $this->L('prev') . '" onclick="getConnectedReferences(\'' . $this->objectId . '\',' . ($this->offset - $this->limit) . ')">.</button>';
        }


        $str .= '<ul class="ilist rlist">';
        $labels = $_SESSION[$this->projectName]['settings']['labels'][$referenceName] ? : array('id');

        $fields = array();
        $c = 0;
        if (is_array($relList)) {
            foreach ($relList as $relEl) {
                $nn = '';
                foreach ($labels as $l) {
                    $nn .= $relEl->$l . ' ';
                }

                // if needed add next-button
                if ($c >= $this->limit) {
                    $head .= '<button rel="arrowthick-1-e" title="' . $this->L('next') . '" onclick="getConnectedReferences(\'' . $this->objectId . '\',' . ($this->offset + $this->limit) . ')">.</button>';
                }

                $c++;


                $noAccess = (
                    count($this->disableConnectingFor) > 0
                    && !in_array($relEl->id, $this->disableConnectingFor)
                );
                if (!empty($relEl->id) && $c < $this->limit) {
                    //echo $relEl->id;
                    $str .= $this->strLi(
                        $referenceName,
                        $relEl->id,
                        $nn,
                        $noconnectors,
                        !$noAccess,
                        $connected
                    );

                    //
                    $this->foundReferences[] = array('id', '!=', $relEl->id);

                    // store all IDs *currently shown* into the SESSION
                    if ($connected) $_SESSION[$this->projectName]['_'][0][] = $relEl->id;

                    unset($relEl->id);
                }
            }
        }
        $str .= '</ul>';
        $head .= '</div>';
        $out .= $head . $str;
        return $out;
    }


    /**
     * Get all connected References and return a List
     *
     * @return
     */
    public function getConnectedReferences()
    {
        $o = $this->projectName . '\\' . $this->objectName;
        $obj = new $o();

        $item = $obj->Get($this->objectId);
        $pId = false;
        $out = '';


        // loop all Relations
        if (isset($this->objects[$this->objectName]['rel'])) {
            $c = 1;
            foreach ($this->objects[$this->objectName]['rel'] as $rk => $rt) {
                $out .= $this->getConnectedReferenceList($item, $rk, true, false, $c);
                $c++;
            }
        } else {
            $out = '';
        }

        return $out;

    }


    public function setReference()
    {
        //return 'huhu';
        //require_once($this->ppath . '/objects/class.' . $this->objectName . '.php');
        //require_once($this->ppath . '/objects/class.' . $this->referenceName . '.php');

        $o = $this->projectName . '\\' . $this->objectName;
        $obj = new $o();
        $item = $obj->Get($this->objectId);
        //print_r($item);

        $r = $this->projectName . '\\' . $this->referenceName;
        $robj = new $r();
        $ritem = $robj->Get($this->referenceId);


        if ($_GET['connect'] == 'true') {
            $action = (($this->objects[$this->objectName]['rel'][$this->referenceName] == 'p') ? 'Set' : 'Add') . strtolower($this->referenceName);

            $item->$action($ritem);
            $item->Save();
            //print_r($item);
            return 'connected';
        } else {
            if ($this->objects[$this->objectName]['rel'][$this->referenceName] == 'p') {
                $item->{$this->referenceName . 'id'} = 0; // remove parent-element
                $item->Save();
            } else {
                $action = 'Remove' . $this->referenceName;

                $item->$action($ritem); // remove sibling/child
            }
            return 'connection removed';
        }

    }

    /**
     *
     *
     * @return
     */
    public function getReferences()
    {
        //return $this->objectName;

        //require_once($this->ppath . '/objects/class.' . $this->objectName . '.php');
        //require_once($this->ppath . '/objects/class.' . $this->referenceName . '.php');

        $str0 = '<input class="sbox ui-corner-all" id="referenceSearchbox" placeholder="' . $this->L('search') . '" type="text" /><div>';
        $str1 = '';

        $o = $this->projectName . '\\' . $this->objectName;
        $obj = new $o();
        $item = $obj->Get($this->objectId);


        $r = $this->projectName . '\\' . $this->referenceName;
        $robj = new $r();

        $offset1 = $this->offset;
        $offset2 = ($_GET['offset2']) ? intval($_GET['offset2']) : 0;

        // prev-Button
        $str0 .= $this->createButtonHtml('arrowthick-1-w', false, 'getReferences(\'' . $this->objectId . '\',' . ($offset1 - $this->limit) . ',' . $offset2 . ')', ($offset1 > 0));

        $allFilter = $this->getListFilter;
        $rel_ids = array();
        $c = 0;
        $ol = $offset1 + $this->limit;
        $_SESSION[$this->projectName]['_'] = array(array(), array(), $offset1);

        $str1 .= $this->getConnectedReferenceList($item, $this->referenceName, false, true, null);


        // next-Button
        $str0 .= $this->createButtonHtml('arrowthick-1-e', false, 'getReferences(\'' . $this->objectId . '\',' . ($offset1 + $this->limit) . ',' . $offset2 . ')', ($c >= $ol));

        // new-relation - Button
        $str0 .= $this->createButtonHtml('plus', '', 'objectId=0;window.location=\'backend.php?ttemplate=default&project=' . $this->projectName . '&object=' . $this->referenceName . '#id=0&connect_to_object=' . $this->objectName . '&connect_to_id=' . $this->objectId . '\'', !isset($this->disallow['newconnectbutton']));
        $str0 .= $this->createButtonHtml('close', '', 'getReferences(objectId,0,0,\' \')', 1);

        $str0 .= '<!--rb1-->';
        $str0 .= '</div>'
            . '<ul id="sublist" class="ilist rlist' . $pClass . '">'
            . '<li class="ui-state-disabled">' . $this->L('connected') . '</li>' .
            $str1
            . '</ul>';


        ////////////////////////////////////////////// get the unconnected Entries ////////////////////////////////////////////////////////////////
        // define Tree-sorting along "treeleft"
        $sort = ($this->objects[$this->referenceName]['ttype'] == 'Tree') ?
            array('treeleft' => 'asc') :
            array();
        //

        // if we have a filter-key we overwrite all rules
        if (!empty($_GET['filterKey']) && isset($_SESSION[$this->projectName]['filter'][$this->referenceName][$_GET['filterKey']])) {
            $f = $_SESSION[$this->projectName]['filter'][$this->referenceName][$_GET['filterKey']];
            if (!empty($f['select'])) $this->getAssocListFilter = $this->prepareFilterArray($f['select']);
            if (!empty($f['sort'])) $sort = $f['sort'];
            if (!empty($f['show'])) $this->referenceFields = $f['show'];
        }
        // filter END


        $filter = array_merge($this->getAssocListFilter, $this->foundReferences);
        $allList = $robj->GetList($filter, $sort, $this->limit + 2, $offset2);

        $str2 = '<ul id="sublist2" class="ilist rlist"><li class="ui-state-disabled">' . $this->L('available') . '</li>';

        $str2 .= '<li id="referenceFilterBox">' . $this->buildFilterSelect($this->referenceName) . '</li>';

        $all_cnt = 0;
        if ($allList) {
            foreach ($allList as $i) {
                // if there are more Results, draw "next" (see limit+1)
                if ($all_cnt < $this->limit) {
                    $nn = '';

                    foreach ($this->referenceFields as $n) {
                        $nn .= $i->$n . ' ';
                    }

                    if (strlen(trim($nn)) == 0) {
                        $nn = '[...]';
                    }

                    $noAccess = (
                        count($this->disableConnectingFor) > 0
                        && !in_array($i->id, $this->disableConnectingFor)
                    );
                    // id | name [if child, parent id]
                    $str2 .= $this->strLi(
                        $this->referenceName,
                        $i->id,
                        $nn . ((isset($i->$pId) && strlen($i->$pId) > 0) ? '(!)' : ''),
                        false,
                        !$noAccess
                    );
                }
                $all_cnt++;
            }
        }
        $str2 .= '</ul>';


        $str1 = '<div class="listDivider">';
        // Buttons between both Lists
        // back-Button
        $str1 .= $this->createButtonHtml('arrowthick-1-w', false, 'getReferences(\'' . $this->objectId . '\',' . $offset1 . ',' . ($offset2 - $this->limit) . ')', ($offset2 > 0));
        // pagination-Button
        //$str1 .= $this->strButton('arrowthick-2-e-w',false,'$(\'#r_pagination\').toggle()', ($offset2>0 || $all_cnt>$this->limit));

        // next-Button
        $str1 .= $this->createButtonHtml('arrowthick-1-e', false, 'getReferences(\'' . $this->objectId . '\',' . $offset1 . ',' . ($offset2 + $this->limit) . ')', ($all_cnt > $this->limit));

        $str1 .= '<!--rb2-->';

        // Container for Pagination-Links
        //$str1 .= '<div id="r_pagination" style="display:none"><br />'.$strp.'</div>';
        $str1 .= '</div>';

        return $str0 . $str1 . $str2;
    }


}

// init the extended class
$c = new default_crud();
