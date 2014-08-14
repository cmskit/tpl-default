<?php
//auto generated file (compiled at 2014-07-29 16:50:47)

class defaultTpl
{
    public $arr = array();
    public function render_page ($_V)
    {
        if(is_array($_V) && (array_keys($_V) !== range(0, count($_V) - 1))) {
            foreach($_V as $k=>$v){$$k = $v;}
        }

        $_P='<head><title>' ;   $_P.= $projectName;   $_P.='-backend</title><meta charset="utf-8"><!-- prevent Browser-Caching --><meta http-equiv="Cache-Control" content="max-age=0"><meta http-equiv="cache-control" content="no-cache"><meta http-equiv="expires" content="0"><meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT"><meta http-equiv="pragma" content="no-cache"><!-- tell the Browser what we mean with script-/style-Tags --><meta http-equiv="content-script-type" content="text/javascript"><meta http-equiv="content-style-type" content="text/css"><!-- prevent zoom-out --><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="icon" type="image/png" href="inc/img/icon.png"><link rel="stylesheet" type="text/css" id="mainTheme" href="' ;   $_P.= $jquerypath;   $_P.='/themes/' ;   $_P.= $theme;   $_P.='/jquery-ui.css"><link rel="stylesheet" type="text/css" id="baseTheme" href="templates/default/css/packed_' ;   $_P.= $theme;   $_P.='.css"><link rel="stylesheet" href="' ;   $_P.= $jquerypath;   $_P.='/plugins/fontello/css/fontello.css"><link rel="stylesheet" href="' ;   $_P.= $jquerypath;   $_P.='/plugins/fontello/css/animation.css"><script src="' ;   $_P.= $jquerypath;   $_P.='/jquery.min.js"></script><script src="' ;   $_P.= $jquerypath;   $_P.='/jquery-ui.min.js"></script><script src="' ;   $_P.= $jquerypath;   $_P.='/plugins/jquery.ui.touch-punch.min.js"></script><script src="' ;   $_P.= $jquerypath;   $_P.='/plugins/jquery.layout-latest.min.js"></script><script src="templates/default/js/packed_' ;   $_P.= $lang;   $_P.='.js"></script><script>

        var projectName = "' ;   $_P.= $projectName;   $_P.='",
                objectName = ' ;   $_P.= $objectName;   $_P.=',
                settings = ' ;   $_P.= $settings;   $_P.=',
                store = {},
                columns = settings.templates.default.columns, // (default) width/height of columns [north, west, east, south, is_internal_flag]
                lang = "' ;   $_P.= $lang;   $_P.='",
                userId = "' ;   $_P.= $userId;   $_P.='",
                userName = "' ;   $_P.= $userName;   $_P.='",
                userProfiles = ' ;   $_P.= $userProfiles;   $_P.=',
                langLabels = ' ;   $_P.= $langLabels;   $_P.=',
                client = ' ;   $_P.= $client;   $_P.=';
    </script></head><body>

    <!-- mini-overlay -->
<div id="dialog1">
        <div id="dialogb1"></div>
</div>

    <!-- maxi-overlay -->
<div id="dialog2">
        <iframe id="dialogb2" style="border:0px none"></iframe>
</div>

    <!-- status-messagebox -->
<div id="messagebox"></div>

<div id="iHead" class="ui-layout-north">
        <div id="iHeadWrapper" class="ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix">
        <div id="iHeadRight" style="float:right">

            <button style="float:right" type="button" id="logoutButton" rel="power" onclick="logout()">' ;   $_P.= $L["logout"];   $_P.='</button>

            ' ;   $_P.= $dropdowns["uwizSelect"];   $_P.='




</div>

<div id="iHeadLeft">

';  if( $logo ){   $_P.='
    <img id="logo" style="height:27px;float:left;margin:0 10px 0 0;" src="../projects/' ;   $_P.= $projectName;   $_P.='/objects/logo.png">
'; }   $_P.='

' ;   $_P.= $dropdowns["objectSelect"];   $_P.='

' ;   $_P.= $dropdowns["tplSelect"];   $_P.='

</div>
</div>
</div>
<!--iHead END-->

<div id="colLeft" class="ui-layout-west ui-widget-content">
        <input type="text" class="sbox ui-corner-all" id="searchbox" placeholder="' ;   $_P.= $L["search"];   $_P.='"><div id="colLeftb" class="ui-layout-wrapper"></div>
</div>

<div id="colMid" class="ui-layout-center">
        <form id="colMidb" onsubmit="return false"></form>
</div>

<div id="colRight" class="ui-layout-east">
        <div id="colRightb" class="ui-layout-wrapper"></div>
</div>

<div id="colBottom" class="ui-layout-south">
        <div id="colBottomb" class="ui-layout-wrapper"></div>
</div>

<div class="wait"></div>

</body>';

        return  $_P;
    }
}