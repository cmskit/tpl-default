<?php
$config = <<<EOD
{
  "css": {
    "lessify": true,
    "src": [
      {
        "path": "VENDOR/cmskit/jquery-ui/plugins/css/jquery.foldertree.css",
        "compress": true
      },
      {
        "path": "TEMPLATE/css/styles.css",
        "compress": true
      }
    ],
    "out": "TEMPLATE/css/packed_UI.css"
  },
  "js": {
    "src": [
      {
        "path": "TEMPLATE/js/cmskit.core.js",
        "compress": true,
        "translate": true,
        "no_commenthead": true
      },
      {
        "path": "TEMPLATE/js/cmskit.desktop.js",
        "compress": true,
        "translate": true,
        "no_commenthead": false
      },
      {
        "path": "VENDOR/cmskit/jquery-ui/plugins/jquery.autosize.min.js",
        "compress": true,
        "translate": false,
        "no_commenthead": false
      },
      {
        "path": "VENDOR/cmskit/jquery-ui/plugins/jquery.foldertree.js",
        "compress": true,
        "translate": false,
        "no_commenthead": true
      }
    ],
    "out": "TEMPLATE/js/packed_LANG.js"
  }
}
EOD;
;?>