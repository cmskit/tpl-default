<?php
//auto generated file (compiled at 2014-07-23 17:02:25)

class manageTreeTpl
{
    public $arr = array();
    public function render_page ($_V)
    {
        if(is_array($_V) && (array_keys($_V) !== range(0, count($_V) - 1))) {
            foreach($_V as $k=>$v){$$k = $v;}
        }

        $_P='<head><title>manage Tree</title><meta charset="utf-8"><script type="text/javascript" src="' ;   $_P.= $jquerypath;   $_P.='/jquery.min.js"></script><script type="text/javascript" src="' ;   $_P.= $jquerypath;   $_P.='/jquery-ui.js"></script><script type="text/javascript" src="' ;   $_P.= $jquerypath;   $_P.='/plugins/jquery.foldertree.js"></script><link rel="stylesheet" type="text/css" href="' ;   $_P.= $jquerypath;   $_P.='/themes/' ;   $_P.= $theme;   $_P.='/jquery-ui.css"><link rel="stylesheet" type="text/css" href="css/packed_' ;   $_P.= $theme;   $_P.='.css"><style>
        body{font-family:sans-serif;}

        #savestat{color:green;}

        .treewrap {
            width: 330px;
            float: left;
            margin-left: 10px;
            overflow-x: hidden;
        }
        #formwrap {
            width: 200px;
        }
        #frm input {
            width: 80px;
            float:right;
        }
        #frm p {
            clear:both;
        }


    </style></head><body>
<div id="controls" class="ui-widget-header ui-corner-all">
    <button onclick="" style="float:right" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary" role="button" aria-disabled="false">
        <span class="ui-button-icon-primary ui-icon ui-icon-help"></span>
        <span class="ui-button-text">' ;   $_P.= $L["Help"];   $_P.='</span>
    </button>
    <button onclick="window.location=\'editLabels.php' ;   $_P.= $url_params;   $_P.='\'" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary" role="button" aria-disabled="false">
        <span class="ui-button-icon-primary ui-icon ui-icon-tag"></span>
        <span class="ui-button-text">' ;   $_P.= $L["List_labels"];   $_P.='</span>
    </button>
    <button onclick="window.location=\'editList.php' ;   $_P.= $url_params;   $_P.='\'" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary" role="button" aria-disabled="false">
        <span class="ui-button-icon-primary ui-icon ui-icon-shuffle"></span>
        <span class="ui-button-text">' ;   $_P.= $L["List_sort"];   $_P.='</span>
    </button>
</div>

<div class="treewrap">
    <h3>' ;   $_P.= $L["Parent_Tree"];   $_P.='</h3>
    <div class="tree" id="pid"></div>
</div>

<div id="formwrap" class="treewrap">
    <h3>' ;   $_P.= $L["Connect_parent_child"];   $_P.='</h3>
    <form id="frm" method="post" action="manageTree.php' ;   $_P.= $url_params;   $_P.='" onsubmit="$(\'#waiter\').show()">
        <p><input type="radio" onclick="toid=\'#i_pid\'" name="s" checked><input id="i_pid" type="text" name="pid"><label>' ;   $_P.= $L["Parent_ID"];   $_P.=' *</label> </p>
        <p><input type="radio" onclick="toid=\'#i_bid\'" name="s"><input id="i_bid" type="text" name="bid"><label>' ;   $_P.= $L["Beneath_ID"];   $_P.='</label>  </p>
        <p><input type="radio" onclick="toid=\'#i_cid\'" name="s"><input id="i_cid" type="text" name="cid"><label>' ;   $_P.= $L["Child_ID"];   $_P.=' *</label>  </p>
        <p>
            <button type="submit" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary" role="button" aria-disabled="false">
                <span class="ui-button-icon-primary ui-icon ui-icon-link"></span>
                <span class="ui-button-text">' ;   $_P.= $L["connect"];   $_P.='</span>
            </button>
        </p>
        <p id="savestat"><?php echo $message?></p>
    </form>
</div>

<script>

    // draw the Trees
    var params = \'' ;   $_P.= $js_params;   $_P.='\';
    var toid = "#i_pid"
    $(document).ready(function()
    {
        $(\'.tree\').folderTree({
            script: params,
            statCheck: function(target)
            {
                target.find(\'li>span\').each(function(i)
                {
                    // add the ID to the Label
                    var i = $(this).data(\'id\')
                    if(i) {$(this).append(\' - [ ID: \'+i+\' ]\')}
                    // set Click-Handler
                    $(this).on(\'click\', function(e) {
                        $(this).css(\'background\',\'#fff\');
                        //$(\'#input_\'+$(this).parents(\'.tree\').attr(\'id\'))
                        $(toid).val( $(e.target).data(\'id\') );
                    })
                })
            }
        });
        $(\'body\').on(
                {
                    ajaxStart: function() {
                        $(this).addClass(\'loading\');
                    },
                    ajaxStop: function() {
                        $(this).removeClass(\'loading\');
                    }
                });
    });

    ';  if( message ){   $_P.='
        parent.message("' ;   $_P.= $message;   $_P.='")
    '; }   $_P.='
</script><div class="wait"></div>
</body>';

        return  $_P;
    }
}