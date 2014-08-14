<?php
//auto generated file (compiled at 2014-07-23 16:01:33)

class editListTpl
{
    public $arr = array();
    public function render_page ($_V)
    {
        if(is_array($_V) && (array_keys($_V) !== range(0, count($_V) - 1))) {
            foreach($_V as $k=>$v){$$k = $v;}
        }

        $_P='<head><title>edit List</title><meta charset="utf-8"><script type="text/javascript" src="' ;   $_P.= $jquerypath;   $_P.='/jquery.min.js"></script><script type="text/javascript" src="' ;   $_P.= $jquerypath;   $_P.='/jquery-ui.js"></script><script type="text/javascript" src="' ;   $_P.= $jquerypath;   $_P.='/jquery.ui.touch-punch.js"></script><link rel="stylesheet" type="text/css" id="mainTheme" href="' ;   $_P.= $jquerypath;   $_P.='/themes/' ;   $_P.= $theme;   $_P.='/jquery-ui.css"><link rel="stylesheet" href="' ;   $_P.= $jquerypath;   $_P.='/plugins/fontello/css/fontello.css"><style type="text/css">
        body{font: .8em sans;}
        #avlist, #sortlist {border:1px solid #ccc; padding:15px 15px 15px 35px;}
        #avlist li, #sortlist li{clear:both;padding:10px;}
        #avlist span, #sortlist span{cursor:pointer;}
        .checks{float:right;margin-top:-8px;}
        .drag {float:left;margin-right:10px;}

        /* export-select */
        select{
            background:#fff;
            border:1px solid #ccc;
            font-size: 1.2em;
            -webkit-border-radius:5px;
            -moz-border-radius: 5px;
            border-radius: 5px;
            padding: 7px;
        }
    </style><script>

        listItems = [];
        ';  $counter1=-1;  if( isset($cols) && is_array($cols) && sizeof($cols) ) foreach( $cols as $key1 => $value1 ){  $counter1++;   $_P.='
            listItems["' ;   $_P.= $key1;   $_P.='"] = "' ;   $_P.= $value1["lang"]["$lang"] ? $value1["lang"]["$lang"] : $key1;   $_P.='";
        '; }  $_P.='

        sortBy = [];
        ';  if( sort ){   $_P.='
            ';  $counter1=-1;  if( isset($sort) && is_array($sort) && sizeof($sort) ) foreach( $sort as $key1 => $value1 ){  $counter1++;   $_P.='
                sortBy["' ;   $_P.= $key1;   $_P.='"] = "' ;   $_P.= $value1;   $_P.='";
            '; }  $_P.='
         '; }  else{   $_P.='
            sortBy["id"]="asc";
         '; }   $_P.='

    </script></head><body>

<button rel="disk" style="float:right" onclick="save()" title="' ;   $_P.= $L["save"];   $_P.='">' ;   $_P.= $L["save"];   $_P.='</button>
<button rel="tag" onclick="window.location=\'editLabels.php?project=' ;   $_P.= $projectName;   $_P.='&amp;object=' ;   $_P.= $objectName;   $_P.='\'">' ;   $_P.= $L["Labels_in_list"];   $_P.='</button>
<hr style="clear:both"><div id="filterselect"></div>

<form id="mySortForm">
    <h2>' ;   $_P.= $L["sort"];   $_P.='</h2>
    <div>' ;   $_P.= $L["used"];   $_P.='</div>
    <ol id="sortlist" class="connectedSortable"></ol></form>
<div>' ;   $_P.= $L["available"];   $_P.='</div>
<ol id="avlist" class="connectedSortable"></ol><script>

    var srtstr = \'\';

    function exportAs(type)
    {
        if(type.length > 0) {
            window.location = \'../../crud.php?action=exportList&project=' ;   $_P.= $projectName;   $_P.='&object=' ;   $_P.= $objectName;   $_P.='&type=\'+type+\'&sortby=\'+srtstr;
        }
    }

    $(document).ready(function() {

        // name, label,
        function liCode(nm, lbl, d) {

            return \'<li id="xx_\'+nm+\'" class="ui-state-default ui-selectee">\'
                   + \'<span class="drag ui-icon ui-icon-arrow-2-n-s"><\'+\'/span> \'
                   + \'<div class="checks">\'
                   + \'<label for="a\'+nm+\'">' ;   $_P.= $L["ascending"];   $_P.='</\'+\'label>\'
                   + \'<input id="a\'+nm+\'" name="\'+nm+\'" type="radio" value="asc" \'
                   + (!d ? \'checked="checked" \':\'\')+\'/> \'
                   + \'<label for="d\'+nm+\'">' ;   $_P.= $L["descending"];   $_P.='</\'+\'label>\'
                   + \'<input id="d\'+nm+\'" name="\'+nm+\'" type="radio" value="desc" \'
                   + (d ? \'checked="checked" \':\'\')+\' /> \'
                   + \'</\'+\'div>\'
                   + lbl
                   + \'<\'+\'/li>\';
        }

        // active Fields
        var str = \'\';
        for(e in sortBy) {
            str += liCode( e, listItems[e], (sortBy[e]==\'desc\' ? true : false) );
        }

        $(\'#sortlist\').html(str);


        // available Fields
        str = \'\';
        for(e in listItems) {
            if(!sortBy[e]) {
                str += liCode(e, listItems[e], false)
            }
        }
        $(\'#avlist\').html(str);


        // style Radio-Buttons
        $(\'.checks\').buttonset();


        $(\'button\').each(function() {
            $(this).button({
                icons: { primary: \'ui-icon-\'+$(this).attr(\'rel\') },
                text: (($(this).text()==\'.\')?false:true)
            });
        });


        $( "#sortlist, #avlist" ).sortable({
            connectWith: \'.connectedSortable\',
            placeholder: \'ui-state-highlight\',
            handle: \'span\'
        })
        .disableSelection();

    });

    // save new sorting
    function save()
    {
        var s = $(\'#mySortForm\').serializeArray();
        if(s.length > 0) {
            $.post(
                \'editList.php?action=saveOrder&project=' ;   $_P.= $projectName;   $_P.='&object=' ;   $_P.= $objectName;   $_P.='\',
                {
                    order: s
                },
                function(data)
                {
                    parent.message(data);
                    hasChanged = true;
                }
            );
        } else {
            alert("' ;   $_P.= $L["One_sort_field_is_needed"];   $_P.='");
        }
    }

    var hasChanged = false;

    $(window).unload(function() {
        if(hasChanged) {
            parent.getList();
        }
    });

</script></body>';

        return  $_P;
    }
}