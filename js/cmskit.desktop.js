
/**
* Desktop-Functions
*/

var ch, g = [], objectId = '', objectHType = false, hasCanged=false, activeItem=false;


/**
* simple function to check Changes of the Hash (=Browser-History-)
* name: checkHash
* 
*/
function checkHash()
{
	var h = window.location.hash.substr(1);
	
	if (h.length > 0)
	{
		//store['lastPage']=h;
		var p = h.split('&');
		
		for(var i=0,j=p.length;i<j;++i)
		{
			var a = p[i].split('=');
			if(a[1])
			{
				g[a[0]] = a[1];
			}
		}
	};
	
	if (!g['id'])
	{
		$('#colMidb').empty();
		$('#colRightb').empty();
	};
	
	if (g['id'] && g['id']!=objectId)
	{
		getContent(g['id'])
	};
	
	window.setTimeout(checkHash, 3000);
};

// add Breakpoint-Classes to the central Container-Form
function checkCenterWidth()
{
	var cw = myLayout.state.center.innerWidth, cls = '';
	if(cw < 730) cls = 'w730';
	if(cw < 480) cls = 'w730 w480';
	//message('actual width is: '+cw);// test-output
	$('#colMidb').attr('class', cls);
	
	// hide handle-bars if needed
	if(columns[0]<0) $('.ui-layout-resizer-north').hide();
	if(columns[1]<0) $('.ui-layout-resizer-west').hide();
	if(columns[2]<0) $('.ui-layout-resizer-east').hide();
	var s = myLayout.state;
	if(columns[4])
	{
		var d = [
				s.north.isClosed?0:s.north.outerHeight, 
				s.west.isClosed?0:s.west.outerWidth, 
				s.east.isClosed?0:s.east.outerWidth, 
				20, 
				columns[4]
				];
		columns = d;
		setThings('templates.default.columns', d);
	}
	
};

var myLayout = false;
/**
* 
* name: init
* @param name
* @param id
*/
function init(name, id)
{
	// Rules for Masked Input
	//$.mask.definitions['~'] = '[+-]';//plus-minus
	//$.mask.definitions['h'] = '[A-Fa-f0-9]';//color-hash (= #hhhhhh )
	//alert(JSON.stringify(store));
	
	// columns = [north, west, east, south, is_internal_flag]
	myLayout = $('body').layout({
		  north__size: (columns[0]>0?columns[0]:55)
		, west__size:  (columns[1]>0?columns[1]:200)
		, east__size:  (columns[2]>0?columns[2]:200)
		, south__size:  200
		, stateManagement__enabled:	false//(columns[4]?true:false) // enable stateManagement if "is_internal_flag" exists - automatic cookie load & save enabled by default
		, north__initClosed: ((columns[0]<=0||client['touch'])?true:false)
		, west__initClosed:  ((columns[1]<=0||client['touch'])?true:false)
		, east__initClosed:  ((columns[2]<=0||client['touch'])?true:false)
		, south__initClosed:  true
		, onresize_end: checkCenterWidth
	});



	/**
	//xss
	
	$('body').bind('ajaxSend', function(elm, xhr, s)
	{
		if (s.type == "POST"||s.type == "GET") {
		xhr.setRequestHeader('X-CSRF-Token', '3')}
	});


	
	$('#objectSelect').on('change', function() {
		window.location.href = 'backend.php?project='+projectName+'&object=' + $(this).val()
	});
	
	$('#templateSelect').on('change', function() {
		window.location.href = 'backend.php?project='+projectName+'&object=' + objectName + '&template=' + $(this).val()
	});*/
	
	//$(this).bind("contextmenu", function(e) {e.preventDefault();});
	
	/** 
	* style Buttons
	*/
	$('button').each(function() { $(this).button( {icons:{ primary: 'ui-icon-'+$(this).attr('rel')}}); });
	
	limitNumber = 25;

	/* style SELECTs
	* ATTENTION! fix z-index-Isuue in selectmenu.js like this
	* .zIndex( this.element.zIndex() + 1001 )

	$('body select').each(function(){
        alert($(this).attr('onchange'))
    });

     */
    $('#globalWizard').selectmenu({
        change: function(e, object){
            //object.item.value
            var url = object.item.value;
            if(url!=''){
                getFrame(url);
                //$(this).selectmenu('index',0);
                $(this).val('').selectmenu('refresh');
            }
        }
    });

	//objectSelect
    $('#objectSelect').selectmenu({
        change: function(e, object){
            window.location.href = 'backend.php?project='+projectName+'&object=' + object.item.value;
        }
    }).selectmenu('menuWidget').addClass('objectSelectMenu');
    
    $('#templateSelect').selectmenu({
        change: function(e, object){
            //object.item.value
            window.location.href = 'backend.php?project='+projectName+'&object=' + objectName + '&template=' + object.item.value;
            //$(this).selectmenu('value','');
        }
    });

    /*
    // Resizable Columns
    var dw = $(document).width(),
        w  = Math.floor((dw-50)/4),// we assume a 4-columns-grid 1/2/1
        ch = $(document).height()-70;
    limitNumber = Math.floor((ch-50)/32);// how many Elements go into the window?

    // enforce the height of the content-wrapper (overflow)
    $("#colLeftb").height(ch-50);
    $("#colMidb").height(ch);
    $("#colRightb").height(ch-10);

    if (columns[0]==1 && columns[1]==2 && columns[2]==1)
    {
        var cw = (store['cw']) ? store['cw'] : [w, w*2, w];
        $("#colLeft").resizable({stop:getColWidth});
        $("#colMid").resizable({stop:getColWidth});
        $("#colRight").resizable({stop:getColWidth});
        setColWidth(cw, true);
    }
    else//we want to enforce the width of the columns (no resizing etc.)
    {
        var cw = [w*columns[0], w*columns[1], w*columns[2]];
        if (cw[0] == 0) $("#colLeft").css('display','none');
        if (cw[1] == 0) $("#colMid").css('display','none');
        if (cw[2] == 0) $("#colRight").css('display','none');
        setColWidth(cw, false);
    };

    $("#colLeft").css({'width':cw[0],'height':ch});
    $("#colMid").css({'width':cw[1],'height':ch});
    $("#colRight").css({'width':cw[2],'height':ch});



    // hide Logo on small screens
    if(dw<850) $("#logo").hide();
    */
	
	// get/set Font-Size
	originalFontSize = $('html').css('font-size');
	if(store['fnts']) {
		$('html').css('font-size', store['fnts']);
	}
	//////////////////////////////////////////////////
	if(!objectName) {
		$('#searchbox').hide();
		return;
	}

    var toggleButtons = '';
    if(client.touch) {
        toggleButtons = '<div id="toggleBarButtons"><button rel="arrowthick-2-e-w" id="toggleBarRight">.</button><button rel="arrowthick-2-e-w" id="toggleBarLeft">.</button><button rel="arrowthick-2-n-s" id="toggleBarTop">.</button></div>';
    }


	$('#colMidb').before(toggleButtons).html('');
	$('#colRightb').html('');
	$('#colBottomb').html('');
    if(client.touch) {
        styleButtons('toggleBarButtons');
        $('#toggleBarRight').on('click',function(){
            myLayout.toggle('east')
        });
        $('#toggleBarLeft').on('click',function(){
            myLayout.toggle('west')
        });
        $('#toggleBarTop').on('click',function(){
            myLayout.toggle('north')
        });
    }
	
	//$('#objectSelect').selectmenu("value", name);
	$('#objectSelect').val(name);
	if(!settings['objects'][objectName])
	{
		var d = {
				offset:0,
				srt:[],
				lbls:[]
			};
		settings['objects'][objectName] = d;
		setThings('objects.'+objectName, d);
	}

    //$("#iHeadWrapper select").selectmenu();
	
	getList(id);
};



function getColWidth()
{
	//setColWidth([ parseInt($('#colLeft').css('width')), parseInt($('#colMid').css('width')), parseInt($('#colRight').css('width')) ]);
};

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

$(document).ready(function()
{
	init(objectName);
	window.setTimeout(checkHash, 500);
	
});// document.ready END /////////////////////////////////////////////////////



/**
* 
* name: offSet
* @param name
* @param no
* 
*/
function offSet(name, no) {
	settings['objects'][name]['offset'] += no;
};



/**
* 
* name: getPlainList
* @param id
* @return
* 
*/
function getPlainList(id) 
{
	
	$.get('crud.php', 
		{
			action: 'getList', 
			project: projectName,
			actTemplate: 'default',
			object: objectName,
			objectId: id, 
			filterKey: $('#filterSelectBox>select').val(),
			limit: limitNumber, 
			offset: (settings['objects'][objectName] ? parseInt(settings['objects'][objectName]['offset']) : 0)
		}, 
		function(data)
		{
			// re-call+abort drawing of the List if the Entry is out of Range
			if (id && !isNaN(data))
			{
				var d = parseInt(data);
				settings['objects'][objectName]['offset'] = d;
				setThings('objects.'+objectName+'.offset', d);
				getPlainList();
				return;
			};
			
			$('#colLeftb').html(data);
			styleButtons('mainlistHead');
			
			//.attr('title',function(){return $(this).filter(":selected").html()})
			/*$("#filterSelectBox>select").on('change', function()
			{
				getPlainList();
			});*/


            $('#filterSelectBox select').selectmenu({
                change: function(e, object){
                    getPlainList();
                    //$(this).selectmenu('value','');
                }
            });
			
			$("#mainlist").selectable(
			{
				stop: function()
				{
					var a = [];
					$('.ui-selected', this).each(function()
					{
						a.push(this.getAttribute('rel'))
					});
					
					if (a.length>1)// multi-selection
					{
						$('#colRightb').empty();
						specialAction('crud.php?action=multiSelect&actTemplate=default&project='+projectName+'&object='+objectName+"&objectId='"+a.join("','")+"'", 'colMidb');
					}
					else// single selection
					{
						if(typeof a[0] != 'undefined')
						{
							getContent(a[0]);
						};
					}
				}
			});
		}
	);
};

/**
* 
* name: specialAction
* @param url
* @param target
* @param post
* 
*/
function specialAction(url, target, post)
{
	$.post(url, {val: post}, function(data)
	{
		if (target)
		{
			$('#'+target).html(data);
			$('#'+target+' #accordion').accordion({collapsible:true});
			$('#'+target+' #tabs').tabs();
			prettify(target);
		}
		else
		{
			message(data);
		}
	});
};

/**
* 
* name: getTreeList
* @param id
* @param treeType
*/

function getTreeList(id, treeType)
{
	// define JS-Store-Object if not available
	if(!settings['objects'][objectName]) settings['objects'][objectName] = {};
	if(!settings['objects'][objectName]['stat']) settings['objects'][objectName]['stat'] = [];
	setThings('objects.'+objectName+'.stat', []);
	
	// define the GET-Parameter-String for this Object / 
	var params = '&actTemplate=default&project='+projectName+'&object='+objectName+'&objectId='+id+'&tType='+treeType+'&filterKey='+$('#filterSelectBox>select').val()+'&limit='+limitNumber+'&offset=';
	
	// get the actual Path from the Root-Level down to the actual Element (id)
	if (id)
	{
		$.get('crud.php?action=getTreePath'+params,
		function(data)
		{
			var d = data.split(',');
			settings['objects'][objectName]['stat'] = d;
			setThings('objects.'+objectName+'.stat', d);
			//$.merge( store[objectName]['stat'], data.split(',') );
			//settings['objects'][objectName]['stat'] = $.unique(store[objectName]['stat']);
		})
	}
	else
	{
		settings['objects'][objectName]['stat'] = [];
		setThings('objects.'+objectName+'.stat', []);
	};
	
	// get the Tree itself
	$.get('crud.php?action=getTreeHead'+params,
	function(data)
	{
		$('#colLeftb').html(data);
		
		styleButtons('mainlistHead');
		
		$("#filterSelectBox>select").on('change', function() {
			getTreeList(id, treeType)
		});
		
		$("#mainlist2").folderTree(
		{
			script: 'crud.php?action=getTreeList'+params,
			loadMessage: _('load_Data') + '...',
			
			// open all active Nodes defined in the Path above
			statCheck: function(target)
			{
				target.find('li>span').each(function(i)
				{
					// bind the "getContent"-Event
					$(this).on('click', function(e)
					{
						if($(e.target).data('id')) getContent($(e.target).data('id'));
					});
					
					if ($(this).data('id'))
					{
						var myd = $(this).data('id').toString();
						// if the Entry is in the Tree-Path (= Parent-Element), (try to) open the Branch
						if( $.inArray(myd, settings['objects'][objectName]['stat']) > -1 )
						{
							$(this).parent().find(".ui-icon-circle-plus").trigger('click');
						}
						// highlight the actual Entry
						if( myd == id )
						{
							$(this).addClass('sel');
						}
					}
				})
			}
		})
	})
	
};

/**
* name: showPagination
* 
*/
function showPagination()
{
	if($('#pagination').html() != '')
	{
		$('#pagination').toggle();
		return;
	}
	
	$.get('crud.php', 
	{
		action: 'getPagination', 
		project: projectName,
		object: objectName,
		actTemplate: 'default',
		limit: limitNumber, 
		offset: parseInt(settings['objects'][objectName]['offset'])
		//sortby: srtarr.join(',') 
	},
	function(data) {
		$('#pagination').html(data);
		
		
		$('#pagination span')
		.on('mousedown', function(e)// activate listener for pagination-links
		{
			var no = $(this).data('page');
			switch (e.which)
			{
				case 1://Left Mouse button pressed
					setPagination(no);
				break;
				case 2://Middle Mouse button pressed
				case 3://Right Mouse button pressed
					setPagination(no, true);
					$(this).css('text-decoration','underline');
				break;
			}
		})
		.on('contextmenu', function(e)//suppress context-menu
		{
			e.preventDefault();
		});
	});
}

/**
* name: setPagination
* @param n
* @return
* 
*/
function setPagination(n, add)
{
	var d = limitNumber * n;
	
	if (add) // "appended" pagination (right/middle-click)
	{
		$.get('crud.php', 
		{
			action: 'getListString', 
			project: projectName,
			actTemplate: 'default',
			object: objectName,
			objectId: 0, 
			filterKey: $('#filterSelectBox>select').val(),
			limit: limitNumber, 
			offset: n
		}, 
		function(data)
		{
			$('#mainlist').append(data).selectable('refresh');
			message(langLabels.list_appended);
		});
	}
	else // normal pagination (left-click)
	{
		settings['objects'][objectName]['offset'] = d;
		setThings('objects.'+objectName+'.offset', d);
		getList();
	}
}

/**
* name: getList
* @param id
* 
*/
function getList(id)
{
	
	// Searchbox + Autocomplete
	$('#searchbox').autocomplete({
		source: 'templates/default/search.php?actTemplate=default&project='+projectName+'&object='+objectName,
		minLength: 3,
		response: function(){
			$('body').removeClass('loading');
		},
		select: function(event,ui)
		{
			getContent(ui.item.id);
			return false;
		}
	});

	
	var ic = (objectId.length>0);
	var objectHType = $('#objectSelect option[value="'+objectName+'"]').data('htype');
	
	if (objectHType && objectHType!='List')
	{
		getTreeList(id, objectHType);
		if(id)
		{
			setTimeout(function(){
				$('#mainlist2 .folder[rel="'+id+'"]').addClass('sel')
			}, 2000)
		}
	}
	else
	{
		getPlainList(id);
		
		if (id)
		{
			setTimeout(function(){
				$('#mainlist li[rel="'+id+'"]').addClass('ui-selected')
			},1000)
		}
	}
	
	// fill object-wizard-links 
	setTimeout(function()
	{
		$('#objectWizards').html( $('#objectWizardHtml').html() );
		//$('#globalWizard').selectmenu();
	}, 1000);
};



/**
* load Content into main Area
* @name getContent
* @param id 
* @return
* 
*/
function getContent(id, obj)
{
	//setThings('bla.blubb.tralala', 'asdasd');
	
	if (id == 'undefined')
	{
		return false
	};
	
	
	
	checkCenterWidth();
	
	if (hasCanged)
	{
		//if(!confirm(_('skip_saving'))) return;
	};
	hasCanged = false;
	
	// check if there is a active item to call leaveContent
	leaveContent();
	
	activeItem = {obj:(obj?obj:objectName), id: id};
	
	if (!obj)
	{
		window.location.hash = 'id='+id;// store the ID in URL
		objectId = id;
	};
	
	
	$('#colMidb').empty();
	$('#colRightb').empty();
	//$('#colMidb').children().remove();
	
	$.get('crud.php', 
	{
		action: 'getContent', 
		project: projectName,
		object: (obj?obj:objectName),
		relObject: (obj?objectName:0),
		objectId: id,
		actTemplate: 'default'
	}, 
	function(data)
	{
		$('#colMidb').html(data);
           /**/
        $('#referenceSelect').selectmenu({
            change: function(e, object){
                //object.item.value
                getReferences(objectId,0);
                //$(this).val('').selectmenu('refresh');
            }
        });



        $('#previewSelect').selectmenu({
            change: function(e, object){
                //object.item.value
                if(object.item.value.length > 0) {
                    getFrame(object.item.value);
                    $(this).val('').selectmenu('refresh');
                }
            }
        });



		// content-processing
		$('#colMidb #accordion').accordion({collapsible:true});
		$('#colMidb #tabs').tabs();
		

		
		// loop throught all Input-Elements
		$('#colMidb .input').each(function()
		{
			
			// get all data-... attributes of element e
			var e = $(this);
			var d = e.data();
			
			if (e.attr('type') && e.attr('type')=='text')
			{
				//e.css('width','95%');
			}
			
			// apply grid-[1-12] - Class to the Container-DIV
			if (d.grid)
			{
				e.parent().attr('class', 'grid-'+d.grid);
			}
			
			// apply styles to the input-element, the parent-div, the label-element
			if (d.style)
			{
				e.attr('style', d.style.replace('|',':'));
			}
			if (d.parentstyle)
			{
				e.parent().attr('style', d.parentstyle.replace('|',':'));
			}
			if (d.labelstyle)
			{
				e.parent().find('label').attr('style', d.labelstyle.replace('|',':'));
			}
			
			// Wizard detected, (try to) prepare
			if (d.wizard)
			{
				
				if (d.external) // external Wizard (open Dialog)
				{
					var bt = $('<button type="button" title="'+(d.title?d.title:'')+'" rel="'+(d.icon||'gear')+'">'+(d.label||'Wizard')+'</button>');
					e.after(bt);// place the button
					
					bt.on('click', function()
					{
						targetFieldId = e.attr('id');
						getFrame( (d.path?d.path.replace(/###PROJECT###/,projectName):'wizards/'+d.wizard) + '/index.php?project='+projectName+'&object='+objectName+'&lang='+lang+'&theme='+settings.interface.theme+'&objectId='+objectId+((d.params)?'&'+d.params:'') );
					});
				}
				else // embedded Wizard (load Script)
				{
					$.loadScript((d.path? d.path : 'wizards/'+d.wizard)+'/include.php', 
					function()
					{
						e[d.wizard]()
					});
				}
			};
			
			// change some basic stylings
			if (d.readonly)
			{
				$(this).attr('readonly','readonly');// make the Field readonly
			}
			
			// hide the input
			if (d.hide_input)
			{
				$(this).addClass('hide_input');//.css({'position':'absolute','left':'-5000px','width':'2px','height':'2px'});// "hide" the Field by setting a negative offset
				$(this).prev('label').on('click',function(){$(this).next().toggleClass('hide_input')});
			};
			
			// hide the label
			if (d.hide_label)
			{
				$(this).prev('label').css('display','none');// hide the Label
			}
			
			// exclude the input completely (no saving)
			if (d.exclude_input)
			{
				$(this).parent().remove();// delete the Field
			}
			
			// set a variable, defining that current entry was changed
			var ev = (e.prop('type')=='text' || e.prop('nodeName')=='TEXTAREA') ? 'keyup' : 'change';
			
			// activate the change-listener
			e[ev](function() { hasCanged = true; });
			
			
		});// $('#colMidb .inp') END
        window.setTimeout(function(){
            $('#innerForm select').selectmenu();
            $('#colMidb textarea:not(".nosize")').autosize();
        },1000);

		styleButtons('colMidb');
		//myLayout.initContent('east');
		
		afterGetContent(id);
	});
	
	if(!obj) getConnectedReferences(id);
};

// empty Function to use as a Hook for further Content-Processing
function afterGetContent(id){}



/**
* loads all References asocciated to the Entry
* 
* name: getConnectedReferences
* @param id
* @param off
* 
*/
function getConnectedReferences(id, off, obj)
{
	if(!off) off=0;
	// get the References
	$.get('crud.php',
		{ 
			action: 'getConnectedReferences',
			project: projectName,
			object: (obj?obj:objectName),
			objectId: id,
			limit: limitNumber,
			actTemplate: 'default',
			offset: off
		},
		function(data) 
		{
			
			$('#colRightb').html(data);
			styleButtons('colRightb');
			
			$('#colRightb .lnk')
			.on('click',function(e)
			{
				showReference($(this));
				e.preventDefault();
			})
			.on('contextmenu', function(e)
			{
				getContent($(this).data('id'), $(this).data('object'));
				e.preventDefault();
			});
			//if(myLayout) myLayout.initContent('east');
			$('#colRightb').css('height','100%');
		});
};


/**
* saves the Content
* 
* name: saveContent
* @param id
* 
 */
function saveContent (id, obj)
{
	
	
	// serialize the Form
	var s = $('#colMidb').serialize();
	
	// fix ignoring unchecked Checkboxes
	$('#colMidb .checkbox').each(function(){if(!$(this).prop('checked')) s += '&' + $(this).attr('name') + '=0';});
	
	$.post(
		'crud.php?action=saveContent&actTemplate=default&project='+projectName+'&object='+(obj?obj:objectName)+'&actTemplate=default&objectId='+id,
		s, 
		function (data)
		{
			// we have to check for a new ID
			if (isNaN(data))// we have a ordinary message
			{
				message(data);
			}
			else 
			{
				if (data != id)// we have a new ID
				{
					// set the new id in hash and as global variable
					location.hash = 'id='+data;
					id = data;
					message(langLabels.entry_created);
					// if the created entry should be connected to another entry
					if (window.g['connect_to_object'] && window.g['connect_to_id'])
					{
						$.get('crud.php?action=setReference&actTemplate=default&project='+projectName+'&object='+objectName+'&objectId='+data,
						{
							referenceName: g['connect_to_object'],
							referenceId: g['connect_to_id'],
							connect: true
						}, 
						function(data)
						{
							//message(data);
							delete(g['connect_to_object']);
							delete(g['connect_to_id']);
							message(langLabels.connections_saved);
						});
					};
					// call the dummy-function
					afterCreateContent(id, obj);
				}
				else
				{
					message(langLabels.saved);
				}
			}
			
			if(!obj) getList(id);
			hasCanged = false;
			
			// call the dummy-function
			afterSaveContent(id, obj);
		}
	);
};

function afterSaveContent(id, obj){};
function afterCreateContent(id, obj){};

function multiSave (arr)
{
	for (var i=0,j=arr.length; i<j; ++i)
	{
		saveContent (arr[i])
	}
}

/**
* creates a new Entry and opens it in the main Slot
* 
* name: createContent
* 
*/
function createContent ()
{
	location.hash = 'id=0';
	getContent(0);
};

/**
* deletes an Entry
* 
* name: deleteContent
* @param id 
* @param obj 
* @param q 
*/
function deleteContent (id, obj, q)
{
	var q = confirm(_('delete_entry')+' (ID:'+id+')?');
	if(q)
	{
		$.get('crud.php', 
		{
			action: 'deleteContent', 
			project: projectName,
			object: (obj?obj:objectName),
			actTemplate: 'default',
			objectId: id
		}, 
		function(data)
		{
			message(data,false,10000);
			if(!obj) window.location.hash = '';
			location.reload();
		});
	}
};

function multiDelete (arr)
{
	for (var i=0,j=arr.length; i<j; ++i)
	{
		deleteContent(arr[i], false, true)
	}
}

function showReference (obj)
{
	if(hasCanged) {	if(!confirm(_('skip_saving'))) return; }
	window.location = 'backend.php?ttemplate=default&project=' + projectName + '&object=' + obj.data('object') + '#id=' + obj.data('id');
}


/**
* loads References 
* 
* name: getReferences
* @param id 
* @param offs1 
* @param offs2 
*/
function getReferences (id, offs1, offs2, rn)
{
	
	var referenceName = rn ? $.trim(rn) : $('#referenceSelect>option:selected').val();

    // set the dropdown
    $('#referenceSelect').val(referenceName).selectmenu('refresh');

    if(referenceName)
	{


		$.get('crud.php', 
		{
			action: 'getReferences',
			actTemplate: 'default',
			project: projectName,
			object: objectName,
			actTemplate: 'default',
			objectId: id,
			referenceName: referenceName,
			filterKey: $('#referenceFilterBox>select').val(),
			limit: limitNumber,
			offset: offs1,
			offset2: offs2
		},
		function(data) 
		{
			
			$('#colRightb').html(data);
			
			styleButtons('colRightb');
			
			$('#referenceFilterBox>select').on('change', function(){
				getReferences (id, offs1, offs2)
			});
			
			// make Lists sortable
			if (!client.touch) // drag&drop-mode
			{
				$('#sublist, #sublist2').sortable({
					items: 'li:not(.ui-state-disabled)',
					connectWith: '.rlist',
					placeholder: 'ui-state-highlight',
					handle: 'span'
				});
				
				// only accept 1 Element if Parent-List (with Heading == 2)
				$('.sublistParent').on('sortreceive', function(event, ui) {
					if ($(this).children().length > 2)
					{
						$(ui.sender).sortable('cancel');
						message(_('only_one_connection_allowed'), true, 5000);
						return;
					};
				});
				
				// save List-Sort after Update of DragDrop-Event, #sublist2
				$("#sublist").on("sortupdate", function(event, ui)
				{
					saveReference();
				});
				
			}
			else // checkbox-mode (no sorting possible atm)
			{
				
				$('#colRightb .connect_check').on('click', function()
				{
					
					$.get('crud.php?action=setReference&actTemplate=default&project='+projectName+'&object='+objectName+'&objectId='+id+'&referenceName='+referenceName,
					{
						referenceId: $(this).val(),
						connect: ($(this).prop('checked')?'true':'false')
					}, 
					function(data)
					{
						message(data);
					});
					
				});
			}
			
			
			
			function saveReference()
			{
				
				$.post('crud.php?action=saveReferences&actTemplate=default&project='+projectName+'&object='+objectName+'&objectId='+id+'&referenceName='+referenceName,
				{
					order: $('#sublist').sortable('serialize', 'id')
				}, 
				function(data)
				{
					message(data);
				});
			};
			
			
			
			// init Searchbox with Dialog
			$('#referenceSearchbox').autocomplete(
			{
				source: 'templates/default/search.php?project='+projectName+'&object='+referenceName,
				select: function(event, ui)
				{ 
					// 
					var lnk = 'location=\'backend.php?ttemplate=default&project='+projectName+'&object='+referenceName+'#id='+ui.item.id+'\'';
					var htm = '<h4>'+_('what_to_do')+'</h4>';
						htm += '<button type="button" onclick="'+lnk+'">'+_('show_entry')+'</button> ';
					
					// if the Entry is connectable (not conneted AND no Parent-Relation available)
					if($('#sublist').find('#l_'+ui.item.id).length==0 && $('.sublistParent').children().length<2)
					{
						htm += '<button type="button" id="insertListItem">'+_('connect_entry')+'</button>';
					};
					
					$('#dialogb1').html(htm);
					
					$('#dialogb1 button').button();
					$('#dialog1').dialog();
					
					// add Entry + save Relations
					$('#insertListItem').on('click',function()
					{
						$('#sublist').html( $('#sublist').html() + '<li id="l_'+ui.item.id+'" class="ui-state-default ui-selectee"><div onclick="'+lnk+'">'+ui.item.label+'</div></li>');
						$(this).hide();
						saveReference();
					});
					
					return false;
				},
				minLength: 3
			});
			
			// 
			$('#colRightb .lnk')
				.on('click',function(e)
				{
					showReference($(this));
					e.preventDefault();
				})
				.on('contextmenu', function(e)
				{
					e.preventDefault();
				});
			
			// show the east pane
			if(myLayout) myLayout.open('east');
		});
		
		//if(myLayout) myLayout.initContent('east');
		
	} else{
		getConnectedReferences(id);
	}
};


/**
* transform some Form-Elements into UI-Elements (within Element with container-id)
* 
* @name prettify
* @param id ID of HTML-Container
*/
function prettify (id)
{
	styleButtons(id);

};

/**
* optional save Settings via crud/hook and redirect to index.php?project=xyz
* name: logout
*/
function logout ()
{
	$.get('crud.php', 
	{
		action: 'logout', 
		project: projectName
	})
	.always(function() {
		window.location = 'index.php?project='+projectName;
	})
};


/**
* opens a URL in the main Dialog
* name: getFrame
* @param url
* 
*/
function getFrame (url)
{
	
	var wh = (store['dwh']) ? store['dwh'] : [($(document).width()*0.9), ($(document).height()*0.9)];
	$('#dialogb2').css({'width':wh[0]-20, 'height':wh[1]-70});
	$('#dialogb2').attr('src', url);
	$('#dialog2').dialog({
		width:  wh[0],
		height: wh[1], 
		modal: true,
		show: 'scale',
		hide: 'scale',
		close: function(event, ui)
		{ 
			$('#dialogb2').attr('src','about:blank');
		},
		resizeStop: function(event, ui)
		{
			store['dwh'] = [$(this).dialog('option','width'), $(this).dialog('option','height')];
		}
	})
};

/**
* 
* name: getWizard
* @see getFrame
* @param id
* @param type
* @param add
* 
*/
function getWizard (id, type, add)
{
	// if we get a Type pointing to an id we grab the real type from this Element
	// > open different wizards depending on a Selectbox-Selection
	if(type.substr(0,1)=='#') type=$(type).val();
	
	targetFieldId = id;
	getFrame( 'wizards/' + type + '/index.php?project='+projectName+'&object='+objectName+'&objectId='+objectId+((add)?'&'+add:'') );
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

// unused????
function setStore ()
{
	$.post('extensions/user/settings/ajax_set_store.php?project='+projectName,{json:JSON.stringify(settings)});
};

// keycode plugin see: http://www.gmarwaha.com/blog/2009/06/16/ctrl-key-combination-simple-jquery-plugin
$.ctrl = function(key, callback, args)
{
	$(document).keydown(function(e)
	{
		if (!args) args=[]; // IE barks when args is null 
		if (e.keyCode == key.charCodeAt(0) && (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey))
		{
			callback.apply(this, args);
			e.preventDefault();
			return false;
		}
	})
};

$.ctrl('A', function(s) {tryTo('createButton', 'click')}, []);
$.ctrl('S', function(s) {tryTo('saveButton', 'click')}, []);
$.ctrl('D', function(s) {tryTo('deleteButton', 'click')}, []);

//$.ctrl('C', function(s) {$('#referenceSelect').show().focus().click()}, []);

/*
$(document).bind('keydown', function(e)
{
	//ctrl+s
	if ((e.keyCode == 83 && (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)) || (e.which == 115 && e.ctrlKey) || (e.which == 19))
	{
		tryTo('saveButton', 'click');
		e.preventDefault();
	}
});*/
