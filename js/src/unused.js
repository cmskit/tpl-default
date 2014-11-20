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

// functions probably not used anymore....

/**
 *
 * @param el
 */
function showTT(el)
{
    alert($(el).next('span').html())
};

/**
 * Extra-function for file-manager
 * @param p
 */
function transmitFilePath(p)
{
    $('#'+targetFieldId).val(p);
    message(p+' '+langLabels.saved);
};
/**
 *
 */
function getColWidth()
{
    //setColWidth([ parseInt($('#colLeft').css('width')), parseInt($('#colMid').css('width')), parseInt($('#colRight').css('width')) ]);
};

/**
 *
 * @param cw
 * @param save
 */
function setColWidth(cw, save)
{
    /*
     $('#colMid').css('left', (cw[0]+20)+'px');
     $('#colRight').css('left', (cw[0]+cw[1]+30)+'px');
     if(save) store['cw'] = cw;
     // border:1px solid #f00;
     $('<style>#colMid .input{width:'+(cw[1]-220)+'px}#colRight a{width:'+(cw[2]-60)+'px}</style>').appendTo('head')
     */
};

// unused????
function setStore ()
{
    $.post('extensions/user/settings/ajax_set_store.php?project='+projectName,{json:JSON.stringify(settings)});
};


/**
 * add Fullscreen-Toggle for Dialogs
 *
 * @url http://mabp.kiev.ua/2010/12/15/jquery-ui-fullscreen-button-for-dialog
 *
 */
(function() {
    var old = $.ui.dialog.prototype._create;
    $.ui.dialog.prototype._create = function(d)
    {
        old.call(this, d);
        var self = this,
            options = self.options,
            oldHeight = options.height,
            oldWidth = options.width,
            uiDialogTitlebarFull = $('<a class="ui-dialog-titlebar-full ui-corner-all" href="#"><span class="ui-icon ui-icon-newwin"></span></a>')
                .attr('role', 'button')
                .hover(
                function() {
                    uiDialogTitlebarFull.addClass('ui-state-hover');
                },
                function() {
                    uiDialogTitlebarFull.removeClass('ui-state-hover');
                }
            )
                .toggle(
                function() {
                    self._setOptions({
                        height : window.innerHeight - 10,
                        width : window.innerWidth - 30
                    });

                    $("#dialogb2").css({'width':window.innerWidth-50,'height':window.innerHeight-80});
                    self._position('center');
                    return false;
                },
                function() {
                    self._setOptions({
                        height : oldHeight,
                        width : oldWidth
                    });

                    $("#dialogb2").css({'width':oldWidth-20,'height':oldHeight-70});

                    self._position('center');
                    return false;
                }
            )
                .focus(function() {
                    uiDialogTitlebarFull.addClass('ui-state-focus');
                })
                .blur(function() {
                    uiDialogTitlebarFull.removeClass('ui-state-focus');
                })
                .appendTo(self.uiDialogTitlebar)
    };
})();

// http://tdanemar.wordpress.com/2010/08/24/jquery-serialize-method-and-checkboxes
(function ($) {

    $.fn.serialize = function (options) {
        return $.param(this.serializeArray(options));
    };

    $.fn.serializeArray = function (options) {
        var o = $.extend({
            checkboxesAsBools: false
        }, options || {});

        var rselectTextarea = /select|textarea/i;
        var rinput = /text|hidden|password|search/i;

        return this.map(function () {
            return this.elements ? $.makeArray(this.elements) : this;
        })
            .filter(function () {
                return this.name && !this.disabled &&
                (this.checked
                || (o.checkboxesAsBools && this.type === 'checkbox')
                || rselectTextarea.test(this.nodeName)
                || rinput.test(this.type));
            })
            .map(function (i, elem) {
                var val = $(this).val();
                return val == null ?
                    null :
                    $.isArray(val) ?
                        $.map(val, function (val, i) {
                            return { name: elem.name, value: val };
                        }) :
                    {
                        name: elem.name,
                        value: (o.checkboxesAsBools && this.type === 'checkbox') ? //moar ternaries!
                            (this.checked ? 'true' : 'false') :
                            val
                    };
            }).get();
    };

})(jQuery);