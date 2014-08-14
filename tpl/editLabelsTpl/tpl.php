<?php
//auto generated file (compiled at 2014-07-23 16:17:10)

class editLabelsTpl
{
    public $arr = array();
    public function render_page ($_V)
    {
        if(is_array($_V) && (array_keys($_V) !== range(0, count($_V) - 1))) {
            foreach($_V as $k=>$v){$$k = $v;}
        }

        $_P='
<head>
<title>edit Labels</title>
<meta charset="utf-8">
<script type="text/javascript" src="' ;  
         $_P.= $jquerypath;  
         $_P.='/jquery.min.js"></script><script type="text/javascript" src="' ;  
         $_P.= $jquerypath;  
         $_P.='/jquery-ui.js"></script><script type="text/javascript" src="' ;  
         $_P.= $jquerypath;  
         $_P.='/plugins/jquery.ui.touch-punch.min.js"></script><link rel="stylesheet" type="text/css" id="mainTheme" href="' ;  
         $_P.= $jquerypath;  
         $_P.='/themes/' ;  
         $_P.= $theme;  
         $_P.='/jquery-ui.css">
<link rel="stylesheet" href="' ;  
         $_P.= $jquerypath;  
         $_P.='/plugins/fontello/css/fontello.css">
<style type="text/css">
        body{font: .8em sans;}
        #avlist, #sortlist {border:1px solid #ccc; padding:15px 15px 15px 35px;}
        #avlist li, #sortlist li{clear:both;padding:10px;}
        #avlist span, #sortlist span{cursor:pointer;}
        .drag {float:left;margin-right:10px;}
    </style>
<script>
        listItems=[];
        '; 
         $counter1=-1; 
         if( isset($cols) && is_array($cols) && sizeof($cols) ) foreach( $cols as $key1 => $value1 ){ 
         $counter1++;  
         $_P.='
        listItems["' ;  
         $_P.= $key1;  
         $_P.='"] = "' ;  
         $_P.= $value1["lang"]["$lang"] ? $value1["lang"]["$lang"] : $key1;  
         $_P.='";
        '; } 
         $_P.='

        usedItems = [\'' ;  
         $_P.= $lbls;  
         $_P.='\'];

    </script>
</head>
<body>
<button style="float:right" onclick="save()" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary" title="' ;  
         $_P.= $L["save"];  
         $_P.='"><span class="ui-button-icon-primary ui-icon ui-icon-disk"></span><span class="ui-button-text">' ;  
         $_P.= $L["save"];  
         $_P.='</span></button>
<hr style="clear:both">
<form id="mySortForm">
    <div>' ;  
         $_P.= $L["used"];  
         $_P.='</div>
    <ol id="sortlist" class="connectedSortable"></ol>
</form>
<div>' ;  
         $_P.= $L["available"];  
         $_P.='</div>
<ol id="avlist" class="connectedSortable"></ol>
<script>
    var hasChanged = false;

    $(document).ready(function() {

        function liCode(nm, lbl) {
            if(!nm) return \'\';
            return \'<li id="xx\'+nm+\'" class="ui-state-default ui-selectee"><span class="drag ui-icon ui-icon-arrow-2-n-s"></\'+\'span><input type="hidden" name="\'+nm+\'" />\'+lbl+\'</\'+\'li>\';
        }

        var str = \'\';


        // choose Columns
        for(var i=0,j=usedItems.length; i<j; ++i)
        {
            str += liCode(usedItems[i], listItems[ usedItems[i] ]);
        }

        $(\'#sortlist\').html(str);

        // the Rest
        str = \'\';
        for(e in listItems) {
            if($.inArray(e, usedItems) == -1) {
                str += liCode(e, listItems[e]);
            }
        }
        $(\'#avlist\').html(str);

        $( "#sortlist, #avlist" ).sortable({
            connectWith: \'.connectedSortable\',
            placeholder: \'ui-state-highlight\',
            handle: \'span\'
        }).disableSelection();

    });

    // Zust&auml;nde serialisieren und sichern
    function save() {
        var arr = $(\'#mySortForm\').serializeArray(), toSave = [];

        if(arr.length > 0)
        {
            for(var i=0,j=arr.length; i<j; ++i){
                toSave.push(arr[i].name);
            }

            $.post(
                    "editLabels.php?action=saveOrder&project=' ;  
         $_P.= $projectName;  
         $_P.='&object=' ;  
         $_P.= $objectName;  
         $_P.='",
                    {lbls: toSave},
                    function(data) {
                        parent.message(data);
                        hasChanged = true;
                    }
            );
        }
        else
        {
            alert(\'' ;  
         $_P.= $L["One_label_field_is_needed"];  
         $_P.='\');
        }
    }


    $(window).unload(function()
    {
        if(hasChanged)
        {
            //parent.location.reload()
            parent.getList();
        }
    });



</script>
</body>
';

        return  $_P;
    }
}