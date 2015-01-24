// ITEM GROUP
$(document).on("pagecreate","#ItemGroup",function(){

	var selectedItemGroupId = 0,
		$itemgroupLists = $( "#itemgroupLists" ),
		$itemgroupName = $( "#itemgroupName" ),
		
		$itemgroupAdd = $( "#itemgroupAdd" ),
		$itemgroupEdit = $( "#itemgroupEdit" ),
		$itemgroupDelete = $( "#itemgroupDelete" ),
		$itemgroupCancel = $( "#itemgroupCancel" ),
		
		$daysInterval = $( "#daysInterval" ),
		$itemDetail1 = $( "#itemDetail1" ),
		$itemDetail2 = $( "#itemDetail2" ),
		$itemDetail3 = $( "#itemDetail3" ),
		$itemDetail4 = $( "#itemDetail4" ),
		$itemDetail5 = $( "#itemDetail5" ),
		$itemDetail6 = $( "#itemDetail6" ),
		$itemDetail7 = $( "#itemDetail7" ),
		$itemDetail8 = $( "#itemDetail8" );
	
	// Load ITEM GROUPS
	getItemGroups().then( function ( ItemGroups ){
	
		var itemgroupList = "",
			ItemGroupsLen = ItemGroups.length;
		
		for ( var i = 0; i < ItemGroupsLen; i++ ){

			itemgroupList += "<li id='" + ItemGroups[i].ItemGroupId + "' class='clsItemgroup'>" + ItemGroups[i].ItemGroupDesc + '</li>';
		}

			$itemgroupLists.prepend( itemgroupList ).listview( "refresh" );
	},

		function(){ alert( "Error Loading Item group" ); }
	);
	
	$itemgroupLists.on( "click", "li", function(){

		selectedItemGroupId = this.id;
		$itemgroupAdd.attr( "disabled", false );
		$itemgroupEdit.attr( "disabled", false );
		$itemgroupDelete.attr( "disabled", false );
		$itemgroupCancel.attr( "disabled", true );
		
		$itemgroupAdd.html( "Add" );
		$itemgroupEdit.html( "Edit" );
		
		InputsEnableDisable( "disable" );

		// LOAD Item Group Field Mapping and Details   // TEMP. ONLY: MUST BE A MODULE
		getItemGroupFieldMapping({
			what: "FieldMapping",
			value: selectedItemGroupId
		}).then( function ( Fieldmapping ){
		
			if ( Fieldmapping.length ){
				$itemgroupName.val( Fieldmapping[ 0 ].ItemGroupDesc );
				$daysInterval.val( Fieldmapping[ 0 ].pmsDays );
				$itemDetail1.val( Fieldmapping[ 0 ].D1 );
				$itemDetail2.val( Fieldmapping[ 0 ].D2 );
				$itemDetail3.val( Fieldmapping[ 0 ].D3 );
				$itemDetail4.val( Fieldmapping[ 0 ].D4 );
				$itemDetail5.val( Fieldmapping[ 0 ].D5 );
				$itemDetail6.val( Fieldmapping[ 0 ].D6 );
				$itemDetail7.val( Fieldmapping[ 0 ].D7 );
				$itemDetail8.val( Fieldmapping[ 0 ].D8 );
			} else {
				
				alert( "Failed to Load Item group field mapping!" );
			}
		},

			function(){ alert( "Failed to Load Item group field mapping!" ); }
		);

	});
	
	$itemgroupAdd.on( "click", function(){

		var	addText = $( this ).html();

		if ( addText === "Add" ){

			ClearInputs();
			InputsEnableDisable( "enable" );

			$itemgroupAdd.html( "Save" );
			
			$itemgroupAdd.attr( "disabled", false );
			$itemgroupCancel.attr( "disabled", false );
			
			$itemgroupEdit.attr( "disabled", true );
			$itemgroupDelete.attr( "disabled", true );			

		} else if ( addText === "Save" ){

			var itemgroupName = $itemgroupName.val(),
				daysInterval = $daysInterval.val(),
				itemDetail1 = $itemDetail1.val(),
				itemDetail2 = $itemDetail2.val(),
				itemDetail3 = $itemDetail3.val(),
				itemDetail4 = $itemDetail4.val(),
				itemDetail5 = $itemDetail5.val(),
				itemDetail6 = $itemDetail6.val(),
				itemDetail7 = $itemDetail7.val(),
				itemDetail8 = $itemDetail8.val();
				
				if ( !itemDetail1 ){ itemDetail1 = "Detail1"; } 
				if ( !itemDetail2 ){ itemDetail2 = "Detail2"; } 
				if ( !itemDetail3 ){ itemDetail3 = "Detail3"; } 
				if ( !itemDetail4 ){ itemDetail4 = "Detail4"; } 
				if ( !itemDetail5 ){ itemDetail5 = "Detail5"; } 
				if ( !itemDetail6 ){ itemDetail6 = "Detail6"; } 
				if ( !itemDetail7 ){ itemDetail7 = "Detail7"; } 
				if ( !itemDetail8 ){ itemDetail8 = "Detail8"; } 

			if ( ( itemgroupName.trim() ).length > 2 ){

				// SAVE NEW ITEM GROUP
				$.ajax({
				
					type: "POST",
					url: "itemgroup.php",
					data: { 
						itemgroupId : 0,
						itemgroupName : itemgroupName,
						daysInterval : daysInterval,
						itemDetail1 : itemDetail1,
						itemDetail2 : itemDetail2,
						itemDetail3 : itemDetail3,
						itemDetail4 : itemDetail4,
						itemDetail5 : itemDetail5,
						itemDetail6 : itemDetail6,
						itemDetail7 : itemDetail7,
						itemDetail8 : itemDetail8,
						what : "ItemGroupCreate" 
					}
					
				}).done( function( ItemGroupCreateId ){ 
				
					var returnItemGroupId = parseInt( ItemGroupCreateId );
					
					if ( returnItemGroupId ){
						
						$itemgroupLists.append( "<li id='" + returnItemGroupId + "' class='clsItemgroup'>" + itemgroupName + "</li>" ).listview( "refresh" );
						
						$itemgroupAdd.html( "Add" );
						$itemgroupEdit.html( "Edit" );
						EnableAddOnly();
						
					} else {
					
						alert( "Failed, adding new Item group." );
					}

				}).fail( function( ItemGroupCreateStat ){ 
				
					alert( "Failed, adding new Item group." );
					
				}).always( function( ItemGroupCreateStat ){ 
				
					console.log( "Status : " + ItemGroupCreateStat );
				});
				
			} else {
			
				alert( "Invalid item group name, length must be greater than 2 characters." );
				$itemgroupName.focus();
			}
		}
	});
	
	$itemgroupEdit.on( "click", function(){
		
		var editText = $( this ).html(); // Current Button text ( Save or Edit )

		if ( editText != "Save" ){ // Edit
		
			$itemgroupEdit.html( "Save" );
			$itemgroupAdd.attr( "disabled", true );
			$itemgroupDelete.attr( "disabled", true );
			$itemgroupCancel.attr( "disabled", false );
			
			InputsEnableDisable( "enable" );

		} else { // Save
		
			var newitemgroupName = $itemgroupName.val();
			
			// IMPORTANT:
			// CHECK IF THE NEW NAME DOES NOT EXIST
			// CHECK IF PMS Days greater than zero(0) in case of previous pms days greater 0
			// BEFORE UPDATING
			
			if ( ( newitemgroupName.trim() ).length > 2 ){
			
				var itemgroupName = $itemgroupName.val(),
					daysInterval = $daysInterval.val(),
					itemDetail1 = $itemDetail1.val(),
					itemDetail2 = $itemDetail2.val(),
					itemDetail3 = $itemDetail3.val(),
					itemDetail4 = $itemDetail4.val(),
					itemDetail5 = $itemDetail5.val(),
					itemDetail6 = $itemDetail6.val(),
					itemDetail7 = $itemDetail7.val(),
					itemDetail8 = $itemDetail8.val();

				if ( ( itemgroupName.trim() ).length > 2 ){

					$.ajax({
					
						type: "POST",
						url: "itemgroup.php",
						data: {
							itemgroupId : selectedItemGroupId,
							itemgroupName : itemgroupName,
							daysInterval : daysInterval,
							itemDetail1 : itemDetail1,
							itemDetail2 : itemDetail2,
							itemDetail3 : itemDetail3,
							itemDetail4 : itemDetail4,
							itemDetail5 : itemDetail5,
							itemDetail6 : itemDetail6,
							itemDetail7 : itemDetail7,
							itemDetail8 : itemDetail8,
							what : "ItemGroupUpdate" 
						}
						
					}).done( function( ItemGroupUpdateStat ){ 
						
						if ( ItemGroupUpdateStat == "success" ){
							
							alert( "Update successful!" );
						} else {
						
							alert( "Update failed!" );
						}

					}).fail( function( ItemGroupUpdateStat ){ 
					
						alert( "Update failed!" );
						
					}).always( function( ItemGroupUpdateStat ){ 
					
						console.log( "Status : " + ItemGroupUpdateStat );
					});
					
				} else {
				
					alert( "Invalid item group name, length must be greater than 2 characters." );
					$itemgroupName.focus();
				}				
				
			} else { 
			
				alert( "Invalid Item group name, length must be greater than 2 characters." );
				$itemgroupName.focus();
			}
		}
	});
	
	$itemgroupDelete.on( "click", function(){
	
		alert( "Delete, temporarily not allowed!" );
	});
	
	$itemgroupCancel.on( "click", function(){
	
		ClearInputs();
		InputsEnableDisable( "disable" );
		
		$itemgroupAdd.html( "Add" );
		$itemgroupEdit.html( "Edit" );

		$itemgroupAdd.attr( "disabled", false );
		$itemgroupEdit.attr( "disabled", true );
		$itemgroupDelete.attr( "disabled", true );
		$itemgroupCancel.attr( "disabled", true );
		
	});
	
	function EnableAddOnly(){
				
		$itemgroupName.textinput( "disable" );		
		$itemgroupAdd.attr( "disabled", false );
		
		$itemgroupEdit.attr( "disabled", true );
		$itemgroupDelete.attr( "disabled", true );
		$itemgroupCancel.attr( "disabled", true );
	}
	
	function InputsEnableDisable( pDisableEnable ){
		
		$itemgroupName.textinput( pDisableEnable );
		$daysInterval.textinput( pDisableEnable );
		$itemDetail1.textinput( pDisableEnable );
		$itemDetail2.textinput( pDisableEnable );
		$itemDetail3.textinput( pDisableEnable );
		$itemDetail4.textinput( pDisableEnable );
		$itemDetail5.textinput( pDisableEnable );
		$itemDetail6.textinput( pDisableEnable );
		$itemDetail7.textinput( pDisableEnable );
		$itemDetail8.textinput( pDisableEnable );
	}
	
	function ClearInputs(){
	
		$itemgroupName.val("");
		$daysInterval.val("");
		$itemDetail1.val("");
		$itemDetail2.val("");
		$itemDetail3.val("");
		$itemDetail4.val("");
		$itemDetail5.val("");
		$itemDetail6.val("");
		$itemDetail7.val("");
		$itemDetail8.val("");
	}
});


// DEPARTMENT
$( document ).on( "pagecreate", "#ItemDepartment", function(){

	var $deptLists = $( "#DeptLists" ),
		$deptName = $( "#deptName" ),
		
		$deptAdd = $( "#deptAdd" ),
		$deptEdit = $( "#deptEdit" ),
		$deptDelete = $( "#deptDelete" ),
		$deptCancel = $( "#deptCancel" );
		
	// Load Departments
	getDepartments().then( function ( Departments ){

		var deptList = "";

		for ( var i = 0; i < Departments.length; i++ ){
			// Temp. planning to use handlebars or mustache :):):) soon.
			deptList += "<li id='" + Departments[i].ItemDeptId + "' class='clsDepts'>" + Departments[i].ItemDeptDesc + '</li>';
		}
		
		$deptLists.prepend( deptList ).listview( "refresh" );
		
		},

		function(){ alert( "Error Loading department" ); }
	);

	$deptLists.on( "click", "li", function(){

		$( "#deptInfoHead" ).html( $( this ).html() );
		$deptName.val( $( this ).html() );
		
		$deptName.textinput( "disable" );
		
		$deptAdd.attr( "disabled", false );
		$deptEdit.attr( "disabled", false );
		$deptDelete.attr( "disabled", false );
		$deptCancel.attr( "disabled", true );

		$deptAdd.html( "Add" );
		$deptEdit.html( "Edit" );		
	});
	
	function EnableAddOnly(){
				
		$deptName.textinput( "disable" );
		
		$deptAdd.attr( "disabled", false );
		$deptEdit.attr( "disabled", true );
		$deptDelete.attr( "disabled", true );
		$deptCancel.attr( "disabled", true );

	}
	
	$deptAdd.on( "click", function(){
		
		var	addText = $( this ).html();
		
		if ( addText === "Add" ){
		
			$deptName.val("");
			$deptAdd.html( "Save" );
			
			$deptName.textinput( "enable" );
			
			$deptAdd.attr( "disabled", false );
			$deptEdit.attr( "disabled", true );
			$deptDelete.attr( "disabled", true );
			$deptCancel.attr( "disabled", false );
			
		} else if ( addText === "Save" ){
		
			var newdeptName = $deptName.val();

			if ( ( newdeptName.trim() ).length > 2 ){
				
				$deptAdd.html( "Add" );
				$deptEdit.html( "Edit" );
				
				EnableAddOnly();				

				$.ajax({
					type: "POST",
					url: "paramAdd.php",
					data: { 
						value : newdeptName, 
						what : "deptAdd"
					}
				}).done( function( deptAddStat ){ 
					
					if ( deptAddStat == "success" ){
						
						$deptLists.append( '<li>' + newdeptName + '</li>' ).listview( "refresh" );
					} else {
					
						alert( "Failed, adding new department." );
					}
					
				}).fail( function( deptAddStat ){ 
				
					alert( "Failed, adding new department." );
				}).always( function( deptAddStat ){ 
				
					console.log( "Complete : " + deptAddStat );
				});

			} else {
			
				alert( "Invalid dept name, length must be greater than 2 characters." );
				$deptName.focus();
			}
		}	
	});
	
	$deptEdit.on( "click", function(){
		
		var editText = $( this ).html();
		
		if ( editText != "Save" ){ // Edit
		
			$deptEdit.html( "Save" );
		
			$deptAdd.attr( "disabled", true );
			$deptDelete.attr( "disabled", true );
			$deptCancel.attr( "disabled", false );
			
			$deptName.textinput( "enable" );

		} else { // Save
		
			var newdeptName = $deptName.val();
			
			if ( ( newdeptName.trim() ).length > 2 ){
			
				alert( "Editing, temporarily not allowed!" );
				
				$deptAdd.html( "Add" );
				$deptEdit.html( "Edit" );
				
				EnableAddOnly();
				
			} else { 
			
				alert( "Invalid Department name, length must be greater than 2 characters." ); 
				$deptName.focus();
			}
			// Code to update here
		}
	});
	
	$deptDelete.on( "click", function(){
	
		alert( "Delete, temporarily not allowed!" );
	});
	
	$deptCancel.on( "click", function(){
	
		$deptName.val("");
		
		$deptAdd.html( "Add" );
		$deptEdit.html( "Edit" );
		
		$deptName.textinput( "disable" );
		
		$deptAdd.attr( "disabled", false );
		$deptEdit.attr( "disabled", true );
		$deptDelete.attr( "disabled", true );
		$deptCancel.attr( "disabled", true );
		
	});	
});

// LOCATION OVER GROUP

$( document ).on( "pagecreate", "#LocationOverGroup", function(){

	var $locationovergroupLists = $( "#locationovergroupLists" ),
		$locationovergroupName = $( "#locationovergroupName" ),
		
		$locationovergroupAdd = $( "#locationovergroupAdd" ),
		$locationovergroupEdit = $( "#locationovergroupEdit" ),
		$locationovergroupDelete = $( "#locationovergroupDelete" ),
		$locationovergroupCancel = $( "#locationovergroupCancel" );

	// load Location Over group
	getLocationOvergroup().then( function( LocationOverGroups ){
	
		var locationovergroupList = "",
			LocationOverGroupsLen = LocationOverGroups.length;
		
		for ( var i = 0; i < LocationOverGroupsLen; i++ ){
		
			locationovergroupList += "<li id='" + LocationOverGroups[i].LOverGroupId + "' class='clslocationovergroup'>" + LocationOverGroups[i].LOverGroupDesc + '</li>';
		}
		
			$locationovergroupLists.prepend( locationovergroupList ).listview( "refresh" );		
		},

		function(){ alert( "Error Loading location Over group" ); }
	);
	
	$locationovergroupLists.on( "click", "li", function(){ // On item group name click

		$locationovergroupName.val( $( this ).html() );
		$locationovergroupName.textinput( "disable" );
		
		$locationovergroupAdd.attr( "disabled", false );
		$locationovergroupEdit.attr( "disabled", false );
		$locationovergroupDelete.attr( "disabled", false );
		$locationovergroupCancel.attr( "disabled", true );

		$locationovergroupAdd.html( "Add" );
		$locationovergroupEdit.html( "Edit" );

	});

	function EnableAddOnly(){
				
		$locationovergroupName.textinput( "disable" );
		
		$locationovergroupAdd.attr( "disabled", false );
		$locationovergroupEdit.attr( "disabled", true );
		$locationovergroupDelete.attr( "disabled", true );
		$locationovergroupCancel.attr( "disabled", true );
	}
	
				
	$( "#locationovergroupAdd" ).on( "click", function(){
		
		var	addText = $( this ).html();
		
		if ( addText === "Add" ){
		
			$locationovergroupName.val("");
			$locationovergroupAdd.html( "Save" );
			
			$locationovergroupName.textinput( "enable" );
			
			$locationovergroupAdd.attr( "disabled", false );
			$locationovergroupEdit.attr( "disabled", true );
			$locationovergroupDelete.attr( "disabled", true );
			$locationovergroupCancel.attr( "disabled", false );
			
		} else if ( addText === "Save" ){
		
			var newlocationovergroupName = $locationovergroupName.val();

			if ( ( newlocationovergroupName.trim() ).length > 2 ){
							
				$locationovergroupAdd.html( "Add" );
				$locationovergroupEdit.html( "Edit" );
				
				EnableAddOnly();		
				
				$.ajax({
				
					type: "POST",
					url: "paramAdd.php",
					data: {
						value : newlocationovergroupName,
						what : "locationoverAdd"
					}
				}).done( function( locationovergroupAddStat ){ 
					
					if ( locationovergroupAddStat == "success" ){
						
						$locationovergroupLists.append( '<li>' + newlocationovergroupName + '</li>' ).listview( "refresh" );
						
					} else {
					
						alert( "Failed, adding new Locatioi over group." );
					}

				}).fail( function( locationovergroupAddStat ){
					alert( "Failed, adding new Locatioi over group." );

				}).always( function( locationovergroupAddStat ){ 
				
					console.log( "Complete : " + locationovergroupAddStat );
				});

			} else {
			
				alert( "Invalid location over group name, length must be greater than 2 characters." );
				$locationovergroupName.focus();

			}
		}	
	});
	
	$locationovergroupEdit.on( "click", function(){
		
		var editText = $( this ).html();
		
		if ( editText != "Save" ){ // Edit
		
			$locationovergroupEdit.html( "Save" );
		
			$locationovergroupAdd.attr( "disabled", true );
			$locationovergroupDelete.attr( "disabled", true );
			$locationovergroupCancel.attr( "disabled", false );
			
			$locationovergroupName.textinput( "enable" );

		} else { // Save
		
			var newlocationovergroupName = $locationovergroupName.val();
			
			if ( ( newlocationovergroupName.trim() ).length > 2 ){
			
				alert( "Editing, temporarily not allowed!" );
				
				$locationovergroupAdd.html( "Add" );
				$locationovergroupEdit.html( "Edit" );
				
				EnableAddOnly();
				
			} else { 
			
				alert( "Invalid location group name, length must be greater than 2 characters." ); 
				$locationovergroupName.focus();
			}
			// Code to update here
		}
	});
	
	$locationovergroupDelete.on( "click", function(){
	
		alert( "Delete, temporarily not allowed!" );
	});
	
	$locationovergroupCancel.on( "click", function(){
		
		$locationovergroupName.val("");
		
		$locationovergroupAdd.html( "Add" );
		$locationovergroupEdit.html( "Edit" );
		
		$locationovergroupName.textinput( "disable" );
		
		$locationovergroupAdd.attr( "disabled", false );
		$locationovergroupEdit.attr( "disabled", true );
		$locationovergroupDelete.attr( "disabled", true );
		$locationovergroupCancel.attr( "disabled", true );
			
	});	
});

// LOCATION MAJOR GROUP

$( document ).on( "pagecreate", "#LocationMajorGroup", function(){

	var $locationmajorgroupLists = $( "#locationmajorgroupLists" ),
	
		$locationOverLocation = $( "#locationOverLocation" ),
		$locationmajorgroupName = $( "#locationmajorgroupName" ),
		
		$locationmajorgroupAdd = $( "#locationmajorgroupAdd" ),
		$locationmajorgroupEdit = $( "#locationmajorgroupEdit" ),
		$locationmajorgroupDelete = $( "#locationmajorgroupDelete" ),
		$locationmajorgroupCancel = $( "#locationmajorgroupCancel" );
		
	// LOAD LOCATION OVER GROUP	
	getLocationOvergroup().then( function ( LocationOverGroups ){
	
		var locationovergroupList = "";
		
		for ( var i = 0; i < LocationOverGroups.length; i++ ){

			locationovergroupList += "<option value='" + LocationOverGroups[i].LOverGroupId + "'>" + LocationOverGroups[i].LOverGroupDesc + '</option>';
		}
		
			$locationOverLocation.prepend( locationovergroupList );
	},

		function(){ alert( "Error Loading location Over group" ); }
	);

	// LOAD LOCATION MAJOR GROUPS
	getLocationMajorGroups().then( function ( LocationMajorGroups ){
		
		var locationmajorgroupList = "",
			LocationMajorGroupsLen = LocationMajorGroups.length;
		
		for ( var i = 0; i < LocationMajorGroupsLen; i++ ){

			locationmajorgroupList += "<li id='" + LocationMajorGroups[i].LMajorGroupId + "' OverGroupId='" + LocationMajorGroups[i].LOverGroup + "' class='clslocationovergroup'>" + LocationMajorGroups[i].LMajorGroupDesc + '</li>';
		}
		
			$locationmajorgroupLists.prepend( locationmajorgroupList ).listview( "refresh" );
	},

		function(){ alert( "Error Loading location Major group" ); }
	);
	
	$locationmajorgroupLists.on( "click", "li", function(){
	
		var OverGroupId = $( this ).attr( "OverGroupId" );
		
		$locationmajorgroupName.val( $( this ).html() );		
		$locationOverLocation.val( OverGroupId ).selectmenu( "refresh" );
		
		$locationOverLocation.selectmenu( "disable" );
		$locationmajorgroupName.textinput( "disable" );
		
		$locationmajorgroupAdd.attr( "disabled", false );
		$locationmajorgroupEdit.attr( "disabled", false );
		$locationmajorgroupDelete.attr( "disabled", false );
		$locationmajorgroupCancel.attr( "disabled", true );
		
		$locationmajorgroupAdd.html( "Add" );
		$locationmajorgroupEdit.html( "Edit" );
	});
	
	function EnableAddOnly(){
				
		$locationOverLocation.selectmenu( "disable" );
		$locationmajorgroupName.textinput( "disable" );
		
		$locationmajorgroupAdd.attr( "disabled", false );
		$locationmajorgroupEdit.attr( "disabled", true );
		$locationmajorgroupDelete.attr( "disabled", true );
		$locationmajorgroupCancel.attr( "disabled", true );

	}
	
	$locationmajorgroupAdd.on( "click", function(){
		
		//var locationmajorgroupName = $( "#locationmajorgroupName" ).val(),
		var	addText = $( this ).html();
		
		if ( addText === "Add" ){
		
			$locationmajorgroupName.val("");
			$locationmajorgroupAdd.html( "Save" );
			
			$locationOverLocation.selectmenu( "enable" );
			$locationmajorgroupName.textinput( "enable" );
			
			$locationmajorgroupAdd.attr( "disabled", false );
			$locationmajorgroupEdit.attr( "disabled", true );
			$locationmajorgroupDelete.attr( "disabled", true );
			$locationmajorgroupCancel.attr( "disabled", false );
			
		} else if ( addText === "Save" ){
		
			var newlocationmajorgroupName = $locationmajorgroupName.val(),
				newlocationOverLocation = $locationOverLocation.val();

			if ( ( newlocationmajorgroupName.trim() ).length > 2 ){
			
				var majorGroupInfo = newlocationmajorgroupName + "," + newlocationOverLocation;
				
				$locationmajorgroupAdd.html( "Add" );
				$locationmajorgroupEdit.html( "Edit" );
				EnableAddOnly();		
				
				console.log( majorGroupInfo );
			
			$.ajax({
				cache: false,
				type: "POST",
				url: "paramAdd.php",
				data: {
					value : majorGroupInfo,
					what : "locationmajorAdd"
				}
			}).done( function( locationmajorgroupAddStat ){ 
				
				if ( locationmajorgroupAddStat == "success" ){
					
					$locationmajorgroupLists.append( '<li>' + newlocationmajorgroupName + '</li>' ).listview( "refresh" );
				} else {
					
					alert( "Failed, adding new Location major group." );
				}

			}).fail( function( locationmajorgroupAddStat ){ 
			
				alert( "Failed, adding new Location major group." );
			}).always( function( locationmajorgroupAddStat ){ 
			
				console.log( "Complete : " + locationmajorgroupAddStat );
			});
			
			} else {
		
				alert( "Invalid location major group name, length must be greater than 2 characters." );
				$locationmajorgroupName.focus();
			}
		}	
	});
	
	$locationmajorgroupEdit.on( "click", function(){
		
		var editText = $( this ).html();
		
		if ( editText != "Save" ){ // Edit
		
			$locationmajorgroupEdit.html( "Save" );
		
			$locationmajorgroupAdd.attr( "disabled", true );
			$locationmajorgroupDelete.attr( "disabled", true );
			$locationmajorgroupCancel.attr( "disabled", false );
			
			$locationOverLocation.selectmenu( "enable" );
			$locationmajorgroupName.textinput( "enable" );

		} else { // Save
		
			var newlocationmajorgroupName = $locationmajorgroupName.val();
			
			if ( ( newlocationmajorgroupName.trim() ).length > 2 ){
			
				alert( "Editing, temporarily not allowed!" );
				
				$locationmajorgroupAdd.html( "Add" );
				$locationmajorgroupEdit.html( "Edit" );
				
				EnableAddOnly();
				
			} else { 
			
				alert( "Invalid location group name, length must be greater than 2 characters." ); 
				$locationmajorgroupName.focus();
			}
			// Code to update here
		}
	});
	
	$locationmajorgroupDelete.on( "click", function(){
	
		alert( "Delete, temporarily not allowed!" );
	});
	
	$locationmajorgroupCancel.on( "click", function(){
	
		$locationOverLocation.val( 0 );
		$locationmajorgroupName.val("");
		
		$locationmajorgroupAdd.html( "Add" );
		$locationmajorgroupEdit.html( "Edit" );
		
		$locationOverLocation.selectmenu( "disable" );
		$locationmajorgroupName.textinput( "disable" );
		
		$locationmajorgroupAdd.attr( "disabled", false );
		$locationmajorgroupEdit.attr( "disabled", true );
		$locationmajorgroupDelete.attr( "disabled", true );
		$locationmajorgroupCancel.attr( "disabled", true );
		
	});	

});


// LOCATION GROUP

$( document ).on( "pagecreate", "#LocationGroup", function(){
	
	var $locationgroupLists = $( "#locationgroupLists" ),
	
		$locationOverLocation = $( "#locationOverLocation" ),
		$locationMajorLocation = $( "#locationMajorLocation" ),
		$locationgroupName = $( "#locationgroupName" ),
		
		$locationgroupAdd = $( "#locationgroupAdd" ),
		$locationgroupEdit = $( "#locationgroupEdit" ),
		$locationgroupDelete = $( "#locationgroupDelete" ),
		$locationgroupCancel = $( "#locationgroupCancel" );
	
	// LOAD LOCATIONS
	getLocations({
		value : 0,
		what : "locationList"
	}).then( function ( LocationGroups ){
	
		var locationgroupList = "",
			LocationGroupsLen = LocationGroups.length;
		
		for ( var i = 0; i < LocationGroupsLen; i++ ){
		
			locationgroupList += "<li id='" + LocationGroups[i].LGroupId + "' MajorGroupId='" + LocationGroups[i].LMajorGroup + "' OverGroupId='" + LocationGroups[i].LOverGroup + "' class='clslocationovergroup'>" + LocationGroups[i].LGroupDesc + '</li>';
		}
		
		$locationgroupLists.prepend( locationgroupList ).listview( "refresh" );
		
		// LOAD LOCATION OVER GROUP
		getLocationOvergroup().then( function ( LocationOverGroups ){
		
			var locationovergroupList = "",
				LocationOverGroupsLen = LocationOverGroups.length;
			
			for ( var i = 0; i < LocationOverGroupsLen; i++ ){

				locationovergroupList += "<option value='" + LocationOverGroups[i].LOverGroupId + "'>" + LocationOverGroups[i].LOverGroupDesc + '</option>';
			}
			
				$locationOverLocation.prepend( locationovergroupList );
		},

			function(){ alert( "Error Loading location Over group" ); }
		);
		
		//LOAD LOCATION MAJOR GROUPS
		getLocationMajorGroups().then( function ( OverGroupMajorList ){
		
			var locationmajorgroupList = "",
				OverGroupMajorListLen = OverGroupMajorList.length;
			
			for ( var i = 0; i < OverGroupMajorListLen; i++ ){

				locationmajorgroupList += "<option value='" + OverGroupMajorList[i].LMajorGroupId + "'>" + OverGroupMajorList[i].LMajorGroupDesc + '</option>';
			}
			
				$locationMajorLocation.prepend( locationmajorgroupList ).selectmenu( "refresh" );
		},

			function(){ alert( "Error Loading location Major group" ); }
		);
	},

		function(){ alert( "Error Loading location group" ); }
	);

	$locationgroupLists.on( "click", "li", function(){
		
		var locationgroupId = this.id,
			MajorGroupId = $( this ).attr( "MajorGroupId" ),
			OverGroupId = $( this ).attr( "OverGroupId" );

		$locationgroupName.val( $( this ).html() );		
		$locationOverLocation.val( OverGroupId ).selectmenu( "refresh" );
		$locationMajorLocation.val( MajorGroupId ).selectmenu( "refresh" );
		
		/*
		var startGetMajorLocation, promiseOne, promiseTwo;
		
		startGetMajorLocation = $.Deferred();
		
		// LOAD MAJOR GROUP Location of selected Over group location
		promiseOne = startGetMajorLocation.then(function () {
		
			return LoadOverGroup_MajorGroup( OverGroupId );
		});
		
		promiseTwo = promiseOne.then(function () {
			
			$locationMajorLocation.val( MajorGroupId ).selectmenu( "refresh" );
			
			$locationgroupAdd.html( "Add" );
			$locationgroupEdit.html( "Edit" );
			
			$locationOverLocation.selectmenu( "disable" );
			$locationMajorLocation.selectmenu( "disable" );
			$locationgroupName.textinput( "disable" );
			
			$locationgroupAdd.attr( "disabled", false );
			$locationgroupEdit.attr( "disabled", false );
			$locationgroupDelete.attr( "disabled", false );
			$locationgroupCancel.attr( "disabled", true );
		});

		startGetMajorLocation.resolve();
		*/
	});

	function EnableAddOnly(){
				
		$locationOverLocation.selectmenu( "disable" );
		$locationMajorLocation.selectmenu( "disable" );
		$locationgroupName.textinput( "disable" );
		
		$locationgroupAdd.attr( "disabled", false );
		$locationgroupEdit.attr( "disabled", true );
		$locationgroupDelete.attr( "disabled", true );
		$locationgroupCancel.attr( "disabled", true );
	}
	
	$locationgroupAdd.on( "click", function(){
		
		var addText = $( this ).html();
		
		if ( addText === "Add" ){
		
			$locationgroupName.val("");
			$locationgroupAdd.html( "Save" );
			
			$locationOverLocation.selectmenu( "enable" );
			$locationMajorLocation.selectmenu( "enable" );
			$locationgroupName.textinput( "enable" );
			
			$locationgroupAdd.attr( "disabled", false );
			$locationgroupEdit.attr( "disabled", true );
			$locationgroupDelete.attr( "disabled", true );
			$locationgroupCancel.attr( "disabled", false );
			
		} else if ( addText === "Save" ){
		
			var newlocationgroupName = $locationgroupName.val(),
				newlocationOverLocation = $locationOverLocation.val(),
				newlocationMajorLocation = $locationMajorLocation.val();
			
			if ( ( newlocationgroupName.trim() ).length > 2 ){
			
				$locationgroupAdd.html( "Add" );
				$locationgroupEdit.html( "Edit" );
				
				EnableAddOnly();
				
				var locGroupInfo = newlocationgroupName + "," + newlocationMajorLocation + "," + newlocationOverLocation;

				$.ajax({
					cache: false,
					type: "POST",
					url: "paramAdd.php",
					data: {
						value : locGroupInfo,
						what : "locationAdd"
					}
				}).done( function( locationgroupAddStat ){ 
					
					if ( locationgroupAddStat == "success" ){
						
						$locationgroupLists.append( '<li>' + newlocationgroupName + '</li>' ).listview( "refresh" );
					} else {
					
						alert( "Failed, adding new Location group." );
					}

				}).fail( function( locationgroupAddStat ){ 
				
					alert( "Failed, adding new Location group." );
				}).always( function( locationgroupAddStat ){ 
				
					console.log( "Complete : " + locationgroupAddStat );
				});

			} else { 
			
				alert( "Invalid location group name, length must be greater than 2 characters." ); 
				$locationgroupName.focus();
			}
			
		}
	});
	
	$locationgroupEdit.on( "click", function(){
		
		var editText = $( this ).html();
		
		if ( editText != "Save" ){ // Edit
		
			$locationgroupAdd.attr( "disabled", true );
			$locationgroupDelete.attr( "disabled", true );
			$locationgroupCancel.attr( "disabled", false );
			
			$locationOverLocation.selectmenu( "enable" );
			$locationMajorLocation.selectmenu( "enable" );
			$locationgroupName.textinput( "enable" );
			
			$locationgroupEdit.html( "Save" );
		} else { // Save
		
			var newlocationgroupName = $locationgroupName.val();
			
			if ( ( newlocationgroupName.trim() ).length > 2 ){
			
				alert( "Editing, temporarily not allowed!" );
				
				$locationgroupAdd.html( "Add" );
				$locationgroupEdit.html( "Edit" );
				
				EnableAddOnly();
				
			} else { 
			
				alert( "Invalid location group name, length must be greater than 2 characters." ); 
				$locationgroupName.focus();
			}
			// Code to update here
		}
	});
	
	$locationgroupDelete.on( "click", function(){
	
		alert( "Delete, temporarily not allowed!" );
	});
	
	$locationgroupCancel.on( "click", function(){
	
		$locationOverLocation.val( 0 );
		$locationMajorLocation.val( 0 );
		$locationgroupName.val("");
		$locationgroupAdd.html( "Add" );
		$locationgroupEdit.html( "Edit" );
		
		$locationOverLocation.selectmenu( "disable" );
		$locationMajorLocation.selectmenu( "disable" );
		$locationgroupName.textinput( "disable" );
		
		$locationgroupAdd.attr( "disabled", false );
		$locationgroupEdit.attr( "disabled", true );
		$locationgroupDelete.attr( "disabled", true );
		$locationgroupCancel.attr( "disabled", true );
		
	});
});


// ITEM SET NAME

$( document ).on( "pagecreate", "#ItemSet", function(){
	/*
	var $ItemSetNameLists = $( "#ItemSetNameLists" ),
	
		$ItemSetNameMajorLocation = $( "#ItemSetNameMajorLocation" ),
		$ItemSetName = $( "#locationgroupName" ),
		
		$ItemSetNameAdd = $( "#ItemSetNameAdd" ),
		$ItemSetNameEdit = $( "#ItemSetNameEdit" ),
		$ItemSetNameDelete = $( "#ItemSetNameDelete" ),
		$ItemSetNameCancel = $( "#ItemSetNameCancel" );
	
	// LOAD ITEM SETS
	$.ajax({ // promise A+ compliant :)
	
		global: true,
		dataType: "JSON",
		type: "GET",
		url: "parameters.php",
		data: { value : 0, what : "itemsetsList" }
		
    }).then( function ( ItemsetsRec ){
	
		var ItemsetsRecList = "",
			ItemsetsRecLen = ItemsetsRec.length;
		
		for ( var i = 0; i < ItemsetsRecLen; i++ ){
		
			ItemsetsRecList += "<li id='" + ItemsetsRec[i].setId + "' MajorGroupId='" + ItemsetsRec[i].majorGroup + "' LocationId='" + ItemsetsRec[i].Location + "' class='clsItemSets'>" + ItemsetsRec[i].ItemSetName + '</li>';
		}
		
			$ItemSetNameLists.prepend( ItemsetsRecList ).listview( "refresh" );
			
			// LOAD LOCATION OVER GROUP
			$.ajax({
			
				global: true,
				dataType: "JSON",
				type: "GET",
				url: "parameters.php",
				data: { value : 0, what : "locationoverList" }
				
			}).then( function ( LocationOverGroups ){
			
				var locationovergroupList = "",
					LocationOverGroupsLen = LocationOverGroups.length;
				
				for ( var i = 0; i < LocationOverGroupsLen; i++ ){

					locationovergroupList += "<option value='" + LocationOverGroups[i].LOverGroupId + "'>" + LocationOverGroups[i].LOverGroupDesc + '</option>';
				}
				
					$locationOverLocation.prepend( locationovergroupList );
			},

				function(){ alert( "Error Loading location Over group" ); }
			);
		},

		function(){ alert( "Error Loading location group" ); }
	);

	$locationgroupLists.on( "click", "li", function(){
		
		var locationgroupId = this.id,
			MajorGroupId = $( this ).attr( "MajorGroupId" ),
			OverGroupId = $( this ).attr( "OverGroupId" );

		$locationgroupName.val( $( this ).html() );		
		$locationOverLocation.val( OverGroupId ).selectmenu( "refresh" );
		
		
		var startGetMajorLocation, promiseOne, promiseTwo;
		
		startGetMajorLocation = $.Deferred();
		
		// LOAD MAJOR GROUP Location of selected Over group location
		promiseOne = startGetMajorLocation.then(function () {
		
			return LoadOverGroup_MajorGroup( OverGroupId );
		});
		
		promiseTwo = promiseOne.then(function () {
			
			$locationMajorLocation.val( MajorGroupId ).selectmenu( "refresh" );
			
			$locationgroupAdd.html( "Add" );
			$locationgroupEdit.html( "Edit" );
			
			$locationOverLocation.selectmenu( "disable" );
			$locationMajorLocation.selectmenu( "disable" );
			$locationgroupName.textinput( "disable" );
			
			$locationgroupAdd.attr( "disabled", false );
			$locationgroupEdit.attr( "disabled", false );
			$locationgroupDelete.attr( "disabled", false );
			$locationgroupCancel.attr( "disabled", true );
		});

		startGetMajorLocation.resolve();

	});
	
	$locationOverLocation.on( "change", function(){
	
		$( "#locationMajorLocation option[ value != '0']").remove(); // Clear location list, except value=0
		
		var selectedOverLocation =  $( this ).find( ":selected").val();
		
		// LOAD MAJOR GROUP Location of selected Over group location
		LoadOverGroup_MajorGroup( selectedOverLocation );
	});
	
	function LoadOverGroup_MajorGroup( overgroupId ){
	
		return $.ajax({
		
			global: true,
			dataType: "JSON",
			type: "GET",
			url: "parameters.php",
			data: { value : overgroupId, what : "OverGroupMajorList" }
			
		}).then( function ( OverGroupMajorList ){
		
			var locationmajorgroupList = "";
			
			for ( var i = 0; i < OverGroupMajorList.length; i++ ){

				locationmajorgroupList += "<option value='" + OverGroupMajorList[i].LMajorGroupId + "'>" + OverGroupMajorList[i].LMajorGroupDesc + '</option>';
			}
			
				$locationMajorLocation.prepend( locationmajorgroupList ).selectmenu( "refresh" );
		},

			function(){ alert( "Error Loading location Major group" ); }
		);
	}
	
	function EnableAddOnly(){
				
		$locationOverLocation.selectmenu( "disable" );
		$locationMajorLocation.selectmenu( "disable" );
		$locationgroupName.textinput( "disable" );
		
		$locationgroupAdd.attr( "disabled", false );
		$locationgroupEdit.attr( "disabled", true );
		$locationgroupDelete.attr( "disabled", true );
		$locationgroupCancel.attr( "disabled", true );
	}
	
	$locationgroupAdd.on( "click", function(){
		
		var addText = $( this ).html();
		
		if ( addText === "Add" ){
		
			$locationgroupName.val("");
			$locationgroupAdd.html( "Save" );
			
			$locationOverLocation.selectmenu( "enable" );
			$locationMajorLocation.selectmenu( "enable" );
			$locationgroupName.textinput( "enable" );
			
			$locationgroupAdd.attr( "disabled", false );
			$locationgroupEdit.attr( "disabled", true );
			$locationgroupDelete.attr( "disabled", true );
			$locationgroupCancel.attr( "disabled", false );
			
		} else if ( addText === "Save" ){
		
			var newlocationgroupName = $locationgroupName.val(),
				newlocationOverLocation = $locationOverLocation.val(),
				newlocationMajorLocation = $locationMajorLocation.val();
			
			if ( ( newlocationgroupName.trim() ).length > 2 ){
			
				//alert( "Saving,temporarily not allowed!" );
				
				$locationgroupAdd.html( "Add" );
				$locationgroupEdit.html( "Edit" );
				EnableAddOnly();
				
				var locGroupInfo = newlocationgroupName + "," + newlocationMajorLocation + "," + newlocationOverLocation;
				console.log( locGroupInfo );
				$.ajax({
				
					type: "POST",
					url: "paramAdd.php",
					data: { value : locGroupInfo, what : "locationAdd" }
					
				}).done( function( locationgroupAddStat ){ 
					
					if ( locationgroupAddStat == "success" ){
						
						$locationgroupLists.append( '<li>' + newlocationgroupName + '</li>' ).listview( "refresh" );
					} else {
					
						alert( "Failed, adding new Location group." );
					}

				}).fail( function( locationgroupAddStat ){ 
				
					alert( "Failed, adding new Location group." );
				}).always( function( locationgroupAddStat ){ 
				
					console.log( "Complete : " + locationgroupAddStat );
				});

			} else { 
			
				alert( "Invalid location group name, length must be greater than 2 characters." ); 
				$locationgroupName.focus();
			}
			
		}
	});
	
	$locationgroupEdit.on( "click", function(){
		
		var editText = $( this ).html();
		
		if ( editText != "Save" ){ // Edit
		
			$locationgroupAdd.attr( "disabled", true );
			$locationgroupDelete.attr( "disabled", true );
			$locationgroupCancel.attr( "disabled", false );
			
			$locationOverLocation.selectmenu( "enable" );
			$locationMajorLocation.selectmenu( "enable" );
			$locationgroupName.textinput( "enable" );
			
			$locationgroupEdit.html( "Save" );
		} else { // Save
		
			var newlocationgroupName = $locationgroupName.val();
			
			if ( ( newlocationgroupName.trim() ).length > 2 ){
			
				alert( "Editing, temporarily not allowed!" );
				
				$locationgroupAdd.html( "Add" );
				$locationgroupEdit.html( "Edit" );
				
				EnableAddOnly();
				
			} else { 
			
				alert( "Invalid location group name, length must be greater than 2 characters." ); 
				$locationgroupName.focus();
			}
			// Code to update here
		}
	});
	
	$locationgroupDelete.on( "click", function(){
	
		alert( "Delete, temporarily not allowed!" );
	});
	
	$locationgroupCancel.on( "click", function(){
	
		$locationOverLocation.val( 0 );
		$locationMajorLocation.val( 0 );
		$locationgroupName.val("");
		$locationgroupAdd.html( "Add" );
		$locationgroupEdit.html( "Edit" );
		
		$locationOverLocation.selectmenu( "disable" );
		$locationMajorLocation.selectmenu( "disable" );
		$locationgroupName.textinput( "disable" );
		
		$locationgroupAdd.attr( "disabled", false )
		$locationgroupEdit.attr( "disabled", true )
		$locationgroupDelete.attr( "disabled", true )
		$locationgroupCancel.attr( "disabled", true )
		
	});
	*/
});



// ITEM ENTRY
$( document ).on( "pagecreate", "#Item", function(){

	var $itemOverLocation = $( "#itemOverLocation"),
		$itemMajorLocation = $( "#itemMajorLocation"),
		$itemLocation = $( "#itemLocation"),
		$itemLabel = $( "#itemLabel"),
		$itemDepartment = $( "#itemDept"),
		$itemGroup = $( "#itemGroup" ),
		$itemBrand = $( "#itemBrand"),
		$itemModel = $( "#itemModel"),
		$itemSerial = $( "#itemSerial"),
		$itemPurchaseDate = $( "#itemPurchaseDate"),
		$itemSupplier = $( "#itemSupplier"),
		$itemAssetId = $( "#itemAssetId"),
		$itemDetail1 = $( "#itemDetail1"),
		$itemDetail2 = $( "#itemDetail2"),
		$itemDetail3 = $( "#itemDetail3"),
		$itemDetail4 = $( "#itemDetail4"),
		$itemDetail5 = $( "#itemDetail5"),
		$itemDetail6 = $( "#itemDetail6"),
		$itemDetail7 = $( "#itemDetail7"),
		$itemDetail8 = $( "#itemDetail8"),
		$itemDeptLists = $( "#itemDept" ),
		$D1 = $( "#D1" ),
		$D2 = $( "#D2" ),
		$D3 = $( "#D3" ),
		$D4 = $( "#D4" ),
		$D5 = $( "#D5" ),
		$D6 = $( "#D6" ),
		$D7 = $( "#D7" ),
		$D8 = $( "#D8" );

	// LOAD LOCATION OVER GROUP
	getLocationOvergroup().then( function ( LocationOverGroups ){
	
		var locationovergroupList = "";
		
		for ( var i = 0; i < LocationOverGroups.length; i++ ){

			locationovergroupList += "<option value='" + LocationOverGroups[i].LOverGroupId + "'>" + LocationOverGroups[i].LOverGroupDesc + '</option>';
		}

			$itemOverLocation.prepend( locationovergroupList );
		},

		function(){ alert( "Error Loading location Over group" ); }
	);

	// LOAD MAJOR GROUPS 
	getLocationMajorGroups().then( function ( OverGroupMajorList ){
	
		var locationmajorgroupList = "";
		
		for ( var i = 0; i < OverGroupMajorList.length; i++ ){

			locationmajorgroupList += "<option value='" + OverGroupMajorList[i].LMajorGroupId + "'>" + OverGroupMajorList[i].LMajorGroupDesc + '</option>';
		}
		
		$itemMajorLocation.append( locationmajorgroupList ).val( "" ).selectmenu( "refresh" );
	},

		function(){ alert( "Error Loading location Major group" ); }
	);
		
	// on Location Major group change
	$itemMajorLocation.on( "change", function(){
		
		$itemLocation.find( "option[ value != '0' ]" ).remove(); // Clear location list, except value=0
		
		// LOAD LOCATIONS OF SELECTED LOCATION MAJOR GROUP
		var	locGroup = this.value;
		
		getMajorGroup_Locations({
			value : locGroup,
			what : "MajorGroupLocationList"
		}).then( function ( MajorGroupLocationList ){

			var locationgroupList = "",
				MajorGroupLocationListLen = MajorGroupLocationList.length;
			
			for ( var i = 0; i < MajorGroupLocationListLen; i++ ){

				locationgroupList += "<option value='" + MajorGroupLocationList[i].LGroupId + "'>" + MajorGroupLocationList[i].LGroupDesc + '</option>';
			}
			
				$itemLocation.append( locationgroupList ).val( "" ).selectmenu( "refresh" );
			},

			function(){ alert( "Error Loading location group" ); }
		);
	});

	// LOAD DEPARTMENTS
	getDepartments().then( function ( Departments ){

		var deptList = "",
			DepartmentsLen = Departments.length;

		for ( var i = 0; i < DepartmentsLen; i++ ){

			deptList += "<option value='" + Departments[i].ItemDeptId + "'>" + Departments[i].ItemDeptDesc + '</option>';
		}
		
			$itemDeptLists.append( deptList );
		},

		function(){ alert( "Error Loading Department" ); }
	);
	
	// LOAD ITEM GROUPS
	getItemGroups().then( function ( ItemGroups ){
	
		var itemgroupList = "",
			ItemGroupsLen = ItemGroups.length;
		
		for ( var i = 0; i < ItemGroupsLen; i++ ){

			itemgroupList += "<option value='" + ItemGroups[i].ItemGroupId + "'>" + ItemGroups[i].ItemGroupDesc + '</option>';
		}

			$itemGroup.append( itemgroupList );
		},

		function(){ alert( "Error Loading Item group" ); }
	);

	$itemGroup.on( "change", function(){
	
		var ItemGroupId = $itemGroup.find( ":selected" ).val();

		// GET Item Group Field Mapping and Details   // TEMP. ONLY: MUST BE A MODULE
		getItemGroupFieldMapping({
			what: "FieldMapping",
			value: ItemGroupId 
		}).then( function ( Fieldmapping ){
	
			if ( Fieldmapping.length ){
				
				$D1.html( Fieldmapping[0].D1 );
				$D2.html( Fieldmapping[0].D2 );
				$D3.html( Fieldmapping[0].D3 );
				$D4.html( Fieldmapping[0].D4 );
				$D5.html( Fieldmapping[0].D5 );
				$D6.html( Fieldmapping[0].D6 );
				$D7.html( Fieldmapping[0].D7 );
				$D8.html( Fieldmapping[0].D8 );
			}
		},
	
			function(){ alert( "Failed to get Item group field mapping!" ); }
		);				
		
	});
	
	$( "#ItemAdd" ).on( "click", function(){
	
		var itemOver = $itemOverLocation.find(":selected").val(),
			itemMajor = $itemMajorLocation.find(":selected").val(),
			itemLocation = $itemLocation.find(":selected").val(),
			itemDepartment = $itemDepartment.find(":selected").val(),
			itemGroup = $itemGroup.find(":selected").val(),
			itemBrand = $itemBrand.val(),
			itemLabel = $itemLabel.val(),
			itemModel = $itemModel.val(),
			itemSerial = $itemSerial.val(),
			itemPurchaseDate = $itemPurchaseDate.val(),
			itemSupplier = $itemSupplier.val(),
			itemAssetId = $itemAssetId.val(),
			itemDetail1 = $itemDetail1.val(),
			itemDetail2 = $itemDetail2.val(),
			itemDetail3 = $itemDetail3.val(),
			itemDetail4 = $itemDetail4.val(),
			itemDetail5 = $itemDetail5.val(),
			itemDetail6 = $itemDetail6.val(),
			itemDetail7 = $itemDetail7.val(),
			itemDetail8 = $itemDetail8.val();
			
			
		// get a collection of all empty fields that is required.
		var reqInputFields = $( ":input.kinahanglan" ).filter( function(){
			
			return !$.trim( this.value ).length;
		});
		
		if ( reqInputFields.length ) {	// if there are one or more empty required fields
			
			alert( "Please fill-up all required Fields" );
		} else {
			
			// SAVE NEW ITEM
			$.ajax({
			
				type: "POST",
				url: "itemCRUD.php",
				data: {
					what: "ItemInsert",
					itemId: 0,
					itemOver: itemOver,
					itemMajor: itemMajor,
					itemLocation: itemLocation,
					itemDepartment: itemDepartment,
					itemGroup: itemGroup,
					itemLabel: itemLabel,
					itemBrand: itemBrand,
					itemModel: itemModel,
					itemSerial: itemSerial,
					itemPurchaseDate: itemPurchaseDate,
					itemSupplier: itemSupplier,
					itemAssetId: itemAssetId,
					itemDetail1: itemDetail1,
					itemDetail2: itemDetail2,
					itemDetail3: itemDetail3,
					itemDetail4: itemDetail4,
					itemDetail5: itemDetail5,
					itemDetail6: itemDetail6,
					itemDetail7: itemDetail7,
					itemDetail8: itemDetail8
				}
				
			}).then( function ( saveStat ){
	
				if ( saveStat === "success" ){
				
					alert( "Item Successfully Added! " );
					ClearItemEntry();
					$itemBrand.focus();
				} else {
				
					alert( "Saving Failed! " );
				}
			},
	
				function(){ alert( "Saving Failed! " ); }
			);
		}	
	});
	
	function ClearItemEntry(){
	
		$itemBrand.val("");
		$itemModel.val("");
		$itemSerial.val("");
		$itemPurchaseDate.val("");
		$itemSupplier.val("");
		$itemAssetId.val("");
		$itemDetail1.val("");
		$itemDetail2.val("");
		$itemDetail3.val("");
		$itemDetail4.val("");
		$itemDetail5.val("");
		$itemDetail6.val("");
	}
});	


// =============  ITEM LOOKUP  ============================

$( document ).on( "pagecreate", "#itemlookup", function(){
	
	$.mobile.page.prototype.options.domCache = false;
	
	var itemId, itemGroup, pmsInterval, purchaseDate, itemSupplier, itemLocation, itemBrand, itemModel, itemSerial,
		Detail1, Detail2, Detail3, Detail4, Detail5, Detail6, Detail7, Detail8,
		ItemGroupId, ItemDeptId, LocGroupId, LocMajorGroupId, LocOverGroupId;

	var $itemlookupItemOverLocation = $( "#itemlookupOverLocation" ),
		$itemlookupItemMajorLocation = $( "#itemlookupMajorLocation" ),
		$itemlookupItemLocation = $( "#itemlookupLocation" ),
		$itemlookupItemDepartment = $( "#itemlookupDept" ),
		$itemlookupItemGroup = $( "#itemlookupItemGroup" ),
		$itemlookupItemBrand = $( "#itemlookupItemBrand" ),
		$itemlookupItemModel = $( "#itemlookupItemModel" ),
		$itemlookupItemSerial = $( "#itemlookupItemSerial" ),

		$ItemsLists = $( "#ItemsLists" ),		
		$itemActionTable = $( ".itemActionTable"),
		$ActionDetails1 = $( ".ActionDetails1"),
		$ActionDetails2 = $( ".ActionDetails2"),

		$lblDetail1 = $( "#lblDetail1"),
		$lblDetail2 = $( "#lblDetail2"),
		$lblDetail3 = $( "#lblDetail3"),
		$lblDetail4 = $( "#lblDetail4"),
		$lblDetail5 = $( "#lblDetail5"),
		$lblDetail6 = $( "#lblDetail6"),
		$lblDetail7 = $( "#lblDetail7"),
		$lblDetail8 = $( "#lblDetail8"),
		$valLocation = $( "#valLocation"),
		$valLabel = $( "#valLabel"),
		$valBrand = $( "#valBrand"),
		$valInterval = $( "#valInterval"),
		$valModel = $( "#valModel"),
		$valSerial = $( "#valSerial"),
		$valPurchasedate = $( "#valPurchasedate"),
		$valSupplier = $( "#valSupplier"),
		$valDetail1 = $( "#valDetail1"),
		$valDetail2 = $( "#valDetail2"),
		$valDetail3 = $( "#valDetail3"),
		$valDetail4 = $( "#valDetail4"),
		$valDetail5 = $( "#valDetail5"),
		$valDetail6 = $( "#valDetail6"),
		$valDetail7 = $( "#valDetail7"),
		$valDetail8 = $( "#valDetail8"),
		
		$EditlblDetail1 = $( "#EditlblDetail1"),
		$EditlblDetail2 = $( "#EditlblDetail2"),
		$EditlblDetail3 = $( "#EditlblDetail3"),
		$EditlblDetail4 = $( "#EditlblDetail4"),
		$EditlblDetail5 = $( "#EditlblDetail5"),
		$EditlblDetail6 = $( "#EditlblDetail6"),
		$EditlblDetail7 = $( "#EditlblDetail7"),
		$EditlblDetail8 = $( "#EditlblDetail8"),		
		$EditvalLocation = $( "#EditvalLocation"),
		$EditvalLabel = $( "#EditvalLabel"),
		$EditvalBrand = $( "#EditvalBrand"),
		$EditvalInterval = $( "#EditvalInterval"),
		$EditvalModel = $( "#EditvalModel"),
		$EditvalSerial = $( "#EditvalSerial"),
		$EditvalPurchasedate = $( "#EditvalPurchasedate"),
		$EditvalSupplier = $( "#EditvalSupplier"),
		$EditvalDetail1 = $( "#EditvalDetail1"),
		$EditvalDetail2 = $( "#EditvalDetail2"),
		$EditvalDetail3 = $( "#EditvalDetail3"),
		$EditvalDetail4 = $( "#EditvalDetail4"),
		$EditvalDetail5 = $( "#EditvalDetail5"),
		$EditvalDetail6 = $( "#EditvalDetail6"),
		$EditvalDetail7 = $( "#EditvalDetail7"),
		$EditvalDetail8 = $( "#EditvalDetail8"),
		
		$itemMoveSave = $( "#itemMoveSave" ),
		$itemEditSave = $( "#itemEditSave" ),
		$ActionEditPop = $( "#ActionEditPop" ),
		$ActionMovePop = $( "#ActionMovePop" );

	// LOAD LOCATION OVER GROUP
	getLocationOvergroup().then( function ( LocOverGroups ){
		
		var optLocationOverGroups = "",
			LocOverGroupsLen = LocOverGroups.length;
		
		for ( var i = 0; i < LocOverGroupsLen; i++ ){

			optLocationOverGroups += "<option value='" + LocOverGroups[i].LOverGroupId + "'>" + LocOverGroups[i].LOverGroupDesc + '</option>';
		}
		
			$itemlookupItemOverLocation.prepend( optLocationOverGroups );
		},

		function(){ alert( "Error Loading location Over group" ); }
	);

	// LOAD DEPARTMENTS
	getDepartments().then( function ( Departments ){
	
		var optDepartments = "",
		DepartmentsLen = Departments.length;
		
		for ( var i = 0; i < DepartmentsLen; i++ ){

			optDepartments += "<option value='" + Departments[i].ItemDeptId + "'>" + Departments[i].ItemDeptDesc + '</option>';
		}
		
			$itemlookupItemDepartment.append( optDepartments );
		},

		function(){ alert( "Error Loading Department" ); }
	);
	
	// LOAD ITEM GROUPS
	getItemGroups().then( function ( ItemGroups ){

		var optItemGroups = "",
			ItemGroupsLen = ItemGroups.length;
		
		for ( var i = 0; i < ItemGroupsLen; i++ ){

			optItemGroups += "<option value='" + ItemGroups[i].ItemGroupId + "'>" + ItemGroups[i].ItemGroupDesc + '</option>';
		}

			$itemlookupItemGroup.append( optItemGroups );
		},

		function(){ alert( "Error Loading Item group" ); }
	);

	// LOAD MAJOR GROUP
	getLocationMajorGroups().then( function ( LocOverGroupMajor ){
	
		var optLocationMajorGroups = "",
			LocOverGroupMajorLen = LocOverGroupMajor.length;
	
		for ( var i = 0; i < LocOverGroupMajorLen; i++ ){

			optLocationMajorGroups += "<option value='" + LocOverGroupMajor[i].LMajorGroupId + "'>" + LocOverGroupMajor[i].LMajorGroupDesc + '</option>';
		}
		
		$itemlookupItemMajorLocation.append( optLocationMajorGroups ).selectmenu( "refresh" ); 
		
		if ( $itemlookupItemMajorLocation.find( "option" ).length > 1 ){

			$itemlookupItemMajorLocation.selectmenu( "enable" );
			$itemlookupItemLocation.selectmenu( "enable" );
		} else {
		
			$itemlookupItemMajorLocation.selectmenu( "disable" );
			$itemlookupItemLocation.selectmenu( "disable" );
		}
	},

		function(){ alert( "Error Loading location Major group" ); }
	);
	
	// on Location Major group change: load location 
	$itemlookupItemMajorLocation.on( "change", function(){
		
		$itemlookupItemLocation.find( "option[ value != '1' ]" ).remove(); // Clear location list, except value=0
		$itemlookupItemLocation.selectmenu( "refresh" );
		
		// LOAD LOCATION GROUP		
		var	locGroup = this.value;
		
		getMajorGroup_Locations({
			value : locGroup,
			what : "MajorGroupLocationList"
		}).then( function ( LocMajorGroupLocation ){
		
			var optLocationGroups = "",
				LocMajorGroupLocationLen = LocMajorGroupLocation.length;
		
			for ( var i = 0; i < LocMajorGroupLocationLen; i++ ){

				optLocationGroups += "<option value='" + LocMajorGroupLocation[i].LGroupId + "'>" + LocMajorGroupLocation[i].LGroupDesc + '</option>';
			}
			
			$itemlookupItemLocation.append( optLocationGroups ).val( "1" ).selectmenu( "refresh" );

			if ( $itemlookupItemLocation.find( "option" ).length > 1 ){
			
				$itemlookupItemLocation.selectmenu( "enable" );
			} else {
			
				$itemlookupItemLocation.selectmenu( "disable" );
			}
		},

			function(){ alert( "Error Loading location group" ); }
		);
	});		
	
	// @ITEM LOOKUP: "Search" button click
	$( "#itemSearch" ).on( "click", function(){
	
		var itemlookupOver = $itemlookupItemOverLocation.find( ":selected" ).val(),
			itemlookupMajor = $itemlookupItemMajorLocation.find( ":selected" ).val(),
			itemlookupLocation = $itemlookupItemLocation.find( ":selected" ).val(),
			itemlookupDepartment = $itemlookupItemDepartment.find( ":selected" ).val(),
			itemlookupGroup = $itemlookupItemGroup.find( ":selected" ).val(),
			itemlookupBrand = $itemlookupItemBrand.val(),
			itemlookupModel = $itemlookupItemModel.val(),
			itemlookupSerial = $itemlookupItemSerial.val();
		
		// LOAD ItemLists Data
		$.ajax({
			cache: false,
			global: true,
			dataType: "JSON",
			type: "GET",
			url: "itemlookup.php",
			data: { 
				what: "lookupLists",
				itemlookupOver: itemlookupOver,
				itemlookupMajor: itemlookupMajor,
				itemlookupLocation: itemlookupLocation,
				itemlookupDepartment: itemlookupDepartment,
				itemlookupGroup: itemlookupGroup,
				itemlookupBrand: itemlookupBrand,
				itemlookupModel: itemlookupModel,
				itemlookupSerial: itemlookupSerial
			}
		}).then( function ( itemLists ){

			var itempmslistAll = "",
				itemListCnt = itemLists.length,
				Cnt = 0,
				ilookupLabel = "";
			
			if ( $ItemsLists.find( "tr" ) ){ $ItemsLists.find( "tr" ).remove(); }
			
			for ( var i = 0; i < itemListCnt; i++ ){
				
				Cnt += 1;
				itemId = itemLists[ i ].ItemId;	
				itemGroup = itemLists[ i ].ItemGroup;
				ilookupLabel = itemLists[ i ].Label;
				
				if ( ilookupLabel === null || !ilookupLabel ){ ilookupLabel = " "; }

				itempmslistAll += "<tr><td>" + Cnt + "</td>";
				itempmslistAll += "<td><a href='#' id='" + itemId + "' name='moveItem' class='Itembtns' data-role='button' data-icon='navigation' data-iconpos='notext' data-inline='true'>Move</a><a href='#lookupActionPop' data-rel='popup' id='" + itemId + "' class='itemActionDetailsPop'>" + itemLists[ i ].LGroupDesc + "</a></td>";
				itempmslistAll += "<td>" + ilookupLabel + "</td>";
				itempmslistAll += "<td><a href='#' id='" + itemId + "' name='decommissionItem' class='Itembtns' data-role='button' data-icon='forbidden' data-iconpos='notext' data-inline='true'>Decommission</a><a href='#' id='" + itemId + "' name='editItem' class='Itembtns' data-role='button' data-icon='edit' data-iconpos='notext' data-inline='true'>Edit</a><a href='#lookupActionPop' data-rel='popup' id='" + itemId + "' class='itemActionDetailsPop'>" + itemLists[ i ].Brand + "</a></td></tr>";

			}

			$ItemsLists.append( itempmslistAll );
			
			$( ".Itembtns" ).button().button( "refresh" ); //Enhance dynamically created buttons :) :) :)
		},

			function(){ alert( "Item lookup: Error Loading Items" ); }
		);
	});
	
	// Item action, Item name click.
	$ItemsLists.on( "click", ".itemActionDetailsPop", function(){
		
		ItemLookupLoadItemDetails( this.id, "itemDetails" );
		$( "#itemDetailsEdit" ).attr( "itemId", this.id );
		$( "#itemDetailsMove" ).attr( "itemId", this.id );
	});
	
	// The action buttons click: ( Move, Decommission and Edit ) :) :) :)
	$ItemsLists.on( "click", "div.ui-btn", function(){
		
		var $actionBtn = $( this ).find( "a" ).first();
		
		itemId = $actionBtn.attr( "id" );

		var	actionBtnName = $actionBtn.attr( "name" );
		
		if ( actionBtnName === "editItem" ){

			ItemLookupLoadItemDetails( itemId, "editDetails" );
			$itemEditSave.attr( "itemId", itemId );
			$ActionEditPop.popup( "open");
			
		} else if ( actionBtnName === "moveItem" ){
		
			ItemLookupLoadLocationDetails( itemId );
			$itemMoveSave.attr( "itemId", itemId );
			$ActionMovePop.popup( "open");
		}
	});
	
	
	$( "#itemDetailsEdit" ).on( "click", function(){
		
		itemId = $( this ).attr( "itemId" );

		$( this ).attr( "isEditFromDetails", "Yes" );
		
		ItemLookupLoadItemDetails( itemId, "editDetails" );
		$itemEditSave.attr( "itemId", itemId );
		
		$( "#lookupActionPop" ).popup( "close");
	});
	
	$( "#itemDetailsMove" ).on( "click", function(){
		
		itemId = $( this ).attr( "itemId" );

		$( this ).attr( "isMoveFromDetails", "Yes" );
		
		ItemLookupLoadLocationDetails( itemId );
		$itemMoveSave.attr( "itemId", itemId );
		
		$( "#lookupActionPop" ).popup( "close" );
	});
	
	$ActionEditPop.on( "popupafterclose", function(){
	
		$( "#itemDetailsEdit" ).attr( "isEditFromDetails", "No" );
	});
	
	$ActionMovePop.on( "popupafterclose", function(){
	
		$( "#itemDetailsMove" ).attr( "isMoveFromDetails", "No" );
	});
	
	$( "#lookupActionPop" ).on( "popupafterclose", function(){
		
		var isEditFromDetails = $( "#itemDetailsEdit" ).attr( "isEditFromDetails" );
		var isMoveFromDetails = $( "#itemDetailsMove" ).attr( "isMoveFromDetails" );
		
		if ( isEditFromDetails == "Yes" ){
		
			$ActionEditPop.popup( "open" );
		}
		
		if ( isMoveFromDetails == "Yes" ){
		
			$ActionMovePop.popup( "open" );
		}
	});
	
	$itemEditSave.on( "click", function(){
		
		itemId = $( this ).attr( "itemId" );
		
		var	newvalModel = $EditvalModel.val(),
			newvalSerial = $EditvalSerial.val(),
			newvalLabel = $EditvalLabel.val(),
			newvalPurchasedate = $EditvalPurchasedate.val(),
			newvalSupplier = $EditvalSupplier.val(),
			newEditvalDetail1 = $EditvalDetail1.val(),
			newEditvalDetail2 = $EditvalDetail2.val(),
			newEditvalDetail3 = $EditvalDetail3.val(),
			newEditvalDetail4 = $EditvalDetail4.val(),
			newEditvalDetail5 = $EditvalDetail5.val(),
			newEditvalDetail6 = $EditvalDetail6.val(),
			newEditvalDetail7 = $EditvalDetail7.val(),
			newEditvalDetail8 = $EditvalDetail8.val(),
			newEditvalBrand = $EditvalBrand.val(); // temp. for ediing brand name

		// UDATE ITEM
		$.ajax({
			cache: false,
			type: "POST",
			url: "itemCRUD.php",
			data: {
				what: "ItemUpdate",
				itemId: itemId,
				itemBrand: newEditvalBrand,
				itemModel: newvalModel,
				itemSerial: newvalSerial,
				itemPurchaseDate: newvalPurchasedate,
				itemSupplier: newvalSupplier,
				itemLabel: newvalLabel,
				itemDetail1: newEditvalDetail1,
				itemDetail2: newEditvalDetail2,
				itemDetail3: newEditvalDetail3,
				itemDetail4: newEditvalDetail4,
				itemDetail5: newEditvalDetail5,
				itemDetail6: newEditvalDetail6,
				itemDetail7: newEditvalDetail7,
				itemDetail8: newEditvalDetail8
			}
		}).then( function ( updateStat ){
	
			if ( updateStat === "success" ){
			
				alert( "Item details successfully updated! " );
			} else {
			
				alert( "Item lookup: Item details update Failed!" );
			}
		},
	
			function(){ alert( "Item lookup: Item details update Failed!" ); }
		);
	});
	
	function ItemLookupLoadItemDetails( pItemId, pFrom ){
	
		// Item lookup: LOAD ITEM Details
		$.ajax({
			cache: false,
			dataType: "JSON",
			type: "GET",
			url: "parameters.php",
			data: {
				what: "itemDetails",
				value: pItemId
			}
		}).then( function ( itemdetails ){

			var	itemDetailspopTr = "";
				
			if ( itemdetails.length ){

				itemGroup =	itemdetails[ 0 ].ItemGroup;
				purchaseDate = itemdetails[ 0 ].PurchaseDate;
				itemSupplier = itemdetails[ 0 ].Supplier;				
				itemLocation = itemdetails[ 0 ].LGroupDesc;
				itemLabel = itemdetails[ 0 ].Label;
				itemBrand = itemdetails[ 0 ].Brand;
				itemModel = itemdetails[ 0 ].Model;
				itemSerial = itemdetails[ 0 ].Serial;
				Detail1 = itemdetails[ 0 ].D1;
				Detail2 = itemdetails[ 0 ].D2;
				Detail3 = itemdetails[ 0 ].D3;
				Detail4 = itemdetails[ 0 ].D4;
				Detail5 = itemdetails[ 0 ].D5;
				Detail6 = itemdetails[ 0 ].D6;
				Detail7 = itemdetails[ 0 ].D7;
				Detail8 = itemdetails[ 0 ].D8;

				if ( purchaseDate === null ){ purchaseDate = ""; }
				if ( itemSupplier === null ){ itemSupplier = ""; }
				if ( Detail1 === null ){ Detail1 = ""; }
				if ( Detail2 === null ){ Detail2 = ""; }
				if ( Detail3 === null ){ Detail3 = ""; }
				if ( Detail4 === null ){ Detail4 = ""; }
				if ( Detail5 === null ){ Detail5 = ""; }
				if ( Detail6 === null ){ Detail6 = ""; }
				if ( Detail7 === null ){ Detail7 = ""; }
				if ( Detail8 === null ){ Detail8 = ""; }
				if ( itemLabel === null ){ itemLabel = ""; }
				
				// GET Item Group Field Mapping and Details   // TEMP. ONLY: MUST BE A MODULE
				getItemGroupFieldMapping({
					what: "FieldMapping",
					value: itemGroup
				}).then( function ( Fieldmapping ){

					if ( Fieldmapping.length ){
					
						pmsInterval = Fieldmapping[ 0 ].pmsDays;
						D1 = Fieldmapping[ 0 ].D1;
						D2 = Fieldmapping[ 0 ].D2;
						D3 = Fieldmapping[ 0 ].D3;
						D4 = Fieldmapping[ 0 ].D4;
						D5 = Fieldmapping[ 0 ].D5;
						D6 = Fieldmapping[ 0 ].D6;
						D7 = Fieldmapping[ 0 ].D7;
						D8 = Fieldmapping[ 0 ].D8;
						
						if ( pFrom === "itemDetails" ){
							
							$lblDetail1.html( D1 );
							$lblDetail2.html( D2 );
							$lblDetail3.html( D3 );
							$lblDetail4.html( D4 );
							$lblDetail5.html( D5 );
							$lblDetail6.html( D6 );
							$lblDetail7.html( D7 );
							$lblDetail8.html( D8 );
							
							$valLocation.html( itemLocation );
							$valLabel.html( itemLabel );
							$valBrand.html( itemBrand );
							$valInterval.html( pmsInterval );
							$valModel.html( itemModel );
							$valSerial.html( itemSerial );
							
							// format date mm/dd/yyy for display;
							purchaseDateSplit =  purchaseDate.split("-");
							if ( parseInt( purchaseDateSplit[1] ) ){
							
								purchaseDate = purchaseDateSplit[1] + "-" + purchaseDateSplit[2] + "-" + purchaseDateSplit[0];
							} else {
							
								purchaseDate = "";
							}
							
							$valPurchasedate.html( purchaseDate );
							$valSupplier.html( itemSupplier );
							$valDetail1.html( Detail1 );
							$valDetail2.html( Detail2 );
							$valDetail3.html( Detail3 );
							$valDetail4.html( Detail4 );
							$valDetail5.html( Detail5 );
							$valDetail6.html( Detail6 );
							$valDetail7.html( Detail7 );
							$valDetail8.html( Detail8 );
							
						} else if ( pFrom === "editDetails" ){
							
							$EditlblDetail1.html( D1 );
							$EditlblDetail2.html( D2 );
							$EditlblDetail3.html( D3 );
							$EditlblDetail4.html( D4 );
							$EditlblDetail5.html( D5 );
							$EditlblDetail6.html( D6 );
							$EditlblDetail7.html( D7 );
							$EditlblDetail8.html( D8 );
							
							$EditvalLocation.html( itemLocation );
							$EditvalLabel.val( itemLabel );
							$EditvalBrand.val( itemBrand ); // temp. for editing brand name
							$EditvalInterval.html( pmsInterval );
							$EditvalModel.val( itemModel );
							$EditvalSerial.val( itemSerial );
							$EditvalPurchasedate.val( purchaseDate );
							$EditvalSupplier.val( itemSupplier );
							$EditvalDetail1.val( Detail1 );
							$EditvalDetail2.val( Detail2 );
							$EditvalDetail3.val( Detail3 );
							$EditvalDetail4.val( Detail4 );
							$EditvalDetail5.val( Detail5 );
							$EditvalDetail6.val( Detail6 );
							$EditvalDetail7.val( Detail7 );
							$EditvalDetail8.val( Detail8 );
						}
					} else {
					
						$( "#lookupActionPop" ).popup( "close" );
						alert( "Failed to get Item group field mapping!" );
					}
				},
					function(){
						$( "#lookupActionPop" ).popup( "close" );
						alert( "Failed to get Item group field mapping!" ); 
					}
				);
				
			} else {
			
				$( "#lookupActionPop" ).popup( "close" );
				alert( "Error Loading Item Details!" );
			}
		},
			
			function(){ 
				$( "#lookupActionPop" ).popup( "close" );
				alert( "Error Loading Item Details!" ); 
			}
		);	
	}	

	function ItemLookupLoadLocationDetails( pItemId ){
	
		// Item lookup: LOAD ITEM Details
		$.ajax({
			cache: false,
			dataType: "JSON",
			type: "GET",
			url: "parameters.php",
			data: {
				what: "itemDetailsLoc",
				value: pItemId
			}
		}).then( function ( itemLocationdetails ){
				
			if ( itemLocationdetails.length ){

				ItemGroupId = itemLocationdetails[ 0 ].ItemGroup;
				ItemDeptId = itemLocationdetails[ 0 ].ItemDept;
				LocGroupId = itemLocationdetails[ 0 ].LocGroup;
				LocMajorGroupId = itemLocationdetails[ 0 ].LocMajorGroup;
				LocOverGroupId = itemLocationdetails[ 0 ].LocOverGroup;
				
				itemBrand = itemLocationdetails[ 0 ].Brand;
				itemModel = itemLocationdetails[ 0 ].Model;
				itemSerial = itemLocationdetails[ 0 ].Serial;
				
				$( "#itemMoveBrand" ).val( itemBrand );
				$( "#itemMoveModel" ).val( itemModel );
				$( "#itemMoveSerial" ).val( itemSerial );
				
				// LOAD DEPARTMENTS
				getDepartments().then( function ( Departments ){
				
					$( "#itemMoveDept" ).find( "option[ value != '1' ]" ).remove(); // Clear location list, except value=0
					$( "#itemMoveDept" ).selectmenu( "refresh" );
					
					var optDepartments = "",
						DepartmentsLen = Departments.length;
					
					for ( var i = 0; i < DepartmentsLen; i++ ){

						optDepartments += "<option value='" + Departments[i].ItemDeptId + "'>" + Departments[i].ItemDeptDesc + '</option>';
					}
					
					$( "#itemMoveDept" ).append( optDepartments ).val( ItemDeptId ).selectmenu( "refresh" );
				},

					function(){ alert( "Error Loading Department" ); }
				);
				
				// LOAD ITEM GROUPS
				getItemGroups().then( function ( ItemGroups ){
				
					$( "#itemMoveItemGroup" ).find( "option[ value != '1' ]" ).remove(); // Clear location list, except value=0
					$( "#itemMoveItemGroup" ).selectmenu( "refresh" );
					
					var optItemGroups = "",
						ItemGroupsLen = ItemGroups.length;
					
					for ( var i = 0; i < ItemGroupsLen; i++ ){

						optItemGroups += "<option value='" + ItemGroups[i].ItemGroupId + "'>" + ItemGroups[i].ItemGroupDesc + '</option>';
					}

					$( "#itemMoveItemGroup" ).append( optItemGroups ).val( ItemGroupId ).selectmenu( "refresh" );
				},

					function(){ alert( "Error Loading Item group" ); }
				);
				
				// LOAD LOCATION OVER GROUP
				getLocationOvergroup().then( function ( LocOverGroups ){
				
					$( "#itemMoveOverLocation" ).find( "option[ value != '1' ]" ).remove(); // Clear location list, except value=0
					$( "#itemMoveOverLocation" ).selectmenu( "refresh" );
					
					var optLocationOverGroups = "",
						LocOverGroupsLen = LocOverGroups.length;
					
					for ( var i = 0; i < LocOverGroupsLen; i++ ){

						optLocationOverGroups += "<option value='" + LocOverGroups[i].LOverGroupId + "'>" + LocOverGroups[i].LOverGroupDesc + '</option>';
					}
					
					$( "#itemMoveOverLocation" ).prepend( optLocationOverGroups ).val( LocOverGroupId ).selectmenu( "refresh" );

					// LOAD MAJOR GROUP
					getLocationMajorGroups().then( function ( LocOverGroupMajor ){
					
						$( "#itemMoveMajorLocation" ).find( "option[ value != '1' ]" ).remove(); // Clear location list, except value=0
						$( "#itemMoveMajorLocation" ).selectmenu( "refresh" );
						
						var optLocationMajorGroups = "",
							LocOverGroupMajorLen = LocOverGroupMajor.length;
					
						for ( var i = 0; i < LocOverGroupMajorLen; i++ ){

							optLocationMajorGroups += "<option value='" + LocOverGroupMajor[i].LMajorGroupId + "'>" + LocOverGroupMajor[i].LMajorGroupDesc + '</option>';
						}
						
						$( "#itemMoveMajorLocation" ).append( optLocationMajorGroups ).val( LocMajorGroupId ).selectmenu( "refresh" ); 
							
							if ( $( "#itemMoveMajorLocation" ).find( "option" ).length > 1 ){

								$( "#itemMoveMajorLocation" ).selectmenu( "enable" );
							} else {
							
								$( "#itemMoveMajorLocation" ).selectmenu( "disable" );
								$( "#itemMoveLocation" ).selectmenu( "disable" );
							}
							
						// LOAD MAJOR GROUP LOCATIONS
						getMajorGroup_Locations({
							value : LocMajorGroupId,
							what : "MajorGroupLocationList"
						}).then( function ( LocMajorGroupLocation ){
						
							$( "#itemMoveLocation" ).find( "option[ value != '1' ]" ).remove(); // Clear location list, except value=0
							$( "#itemMoveLocation" ).selectmenu( "refresh" );
							
							var optLocationGroups = "",
								LocMajorGroupLocationLen = LocMajorGroupLocation.length;
						
							for ( var i = 0; i < LocMajorGroupLocationLen; i++ ){

								optLocationGroups += "<option value='" + LocMajorGroupLocation[i].LGroupId + "'>" + LocMajorGroupLocation[i].LGroupDesc + '</option>';
							}
							
							$( "#itemMoveLocation" ).append( optLocationGroups ).val( LocGroupId ).selectmenu( "refresh" );
								
								if ( $( "#itemMoveLocation" ).find( "option" ).length > 1 ){
								
									$( "#itemMoveLocation" ).selectmenu( "enable" );
								} else {
								
									$( "#itemMoveLocation" ).selectmenu( "disable" );
								}
							},

							function(){ alert( "Error Loading location group" ); }
						);						
					},

						function(){ alert( "Error Loading location Major group" ); }
					);		
				},

					function(){ alert( "Error Loading location Over group" ); }
				);
				
			} else {
			
				alert( "Error Loading Item Location Details!" );
			}
		},
			
			function(){ 
				$( "#lookupActionPop" ).popup( "close" );
				alert( "Error Loading Item Location Details!" ); 
			}
		);	
	}

	// @Move location popup: On Location over group change : load major group
	$( "#itemMoveOverLocation" ).on( "change", function(){
		// CODE removed
	});			
	
	// @Move location popup:  on Location Major group change: load location 
	$( "#itemMoveMajorLocation" ).on( "change", function(){
		
		$( "#itemMoveLocation" ).find( "option[ value != '1' ]" ).remove(); // Clear location list, except value=0
		$( "#itemMoveLocation" ).selectmenu( "refresh" );
		
		// LOAD LOCATIONS OF MAJOR GROUP
		var	locGroup = this.value;

		getMajorGroup_Locations({
			value : locGroup,
			what : "MajorGroupLocationList"
		}).then( function ( LocMajorGroupLocation ){
		
			var optLocationGroups = "",
				LocMajorGroupLocationLen = LocMajorGroupLocation.length;
		
			for ( var i = 0; i < LocMajorGroupLocationLen; i++ ){

				optLocationGroups += "<option value='" + LocMajorGroupLocation[i].LGroupId + "'>" + LocMajorGroupLocation[i].LGroupDesc + '</option>';
			}
			
			$( "#itemMoveLocation" ).append( optLocationGroups ).val( "1" ).selectmenu( "refresh" );

			if ( $( "#itemMoveLocation" ).find( "option" ).length > 1 ){
			
				$( "#itemMoveLocation" ).selectmenu( "enable" );
			} else {
			
				$( "#itemMoveLocation" ).selectmenu( "disable" );
			}
		},

			function(){ alert( "Error Loading location group" ); }
		);
	});			
	//itemMoveSave
});


// ==============  PMS ==============================

$( document ).on( "pagecreate", "#pms", function(){

	$.mobile.page.prototype.options.domCache = false;
	
	var $pmsItemOverLocation = $( "#pmsOverLocation" ),
		$pmsItemMajorLocation = $( "#pmsMajorLocation" ),
		$pmsItemLocation = $( "#pmsLocation" ),
		$pmsItemGroup = $( "#pmsItemGroup" ),

		$pmslist = $( "#pmslist" ),		
		$clstablePop = $( ".clstablePop" ),
		$availTech = $( "#availTech" ),
		$popMoreDetails = $( "#popMoreDetails" ),
		
		$itemStatpop = $( "#itemStatpop" ),
		$pmsRemarks = $( "#pmsRemarks" ),
		$savePMSstat = $( "#savePMSstat" ),
		$pmsAddTech = $( "#pmsAddTech" ),
		$assignTechDiv = $( "#assignTechDiv" ),
		$aircontechLists = $( "#aircontechLists" ),
		$aircontechAssign = $( "#aircontechAssign" ),
		$currentItemPMSDate = $( "#currentItemPMSDate"),
		$itemDetailsPop = $( "#itemDetailsPop"),
		$itemPMSDate = $( "#itemPMSDate" ),
		
		$currentItemFCSDate = $( "#currentItemFCSDate"),
		$itemFCSDate = $( "#itemFCSDate" ),
		
		$valpmsDetailLocation = $( "#valpmsDetailLocation" ),
		$valpmsDetailLabel = $( "#valpmsDetailLabel" ),
		$valpmsDetailBrand = $( "#valpmsDetailBrand" ),
		$valpmsDetailInterval = $( "#valpmsDetailInterval" ),
		$valpmsDetailModel = $( "#valpmsDetailModel" ),
		$valpmsDetailSerial = $( "#valpmsDetailSerial" ),
		$valpmsDetailPurchasedate = $( "#valpmsDetailPurchasedate" ),
		$valpmsDetailSupplier = $( "#valpmsDetailSupplier" ),
		
		$lblpmsDetail1 = $( "#lblpmsDetail1" ),
		$lblpmsDetail2 = $( "#lblpmsDetail2" ),
		$lblpmsDetail3 = $( "#lblpmsDetail3" ),
		$lblpmsDetail4 = $( "#lblpmsDetail4" ),
		$lblpmsDetail5 = $( "#lblpmsDetail5" ),
		$lblpmsDetail6 = $( "#lblpmsDetail6" ),
		$lblpmsDetail7 = $( "#lblpmsDetail7" ),
		$lblpmsDetail8 = $( "#lblpmsDetail8" ),
		
		$valpmsDetail1 = $( "#valpmsDetail1" ),
		$valpmsDetail2 = $( "#valpmsDetail2" ),
		$valpmsDetail3 = $( "#valpmsDetail3" ),
		$valpmsDetail4 = $( "#valpmsDetail4" ),
		$valpmsDetail5 = $( "#valpmsDetail5" ),
		$valpmsDetail6 = $( "#valpmsDetail6" ),
		$valpmsDetail7 = $( "#valpmsDetail7" ),
		$valpmsDetail8 = $( "#valpmsDetail8" );
		
		$fcsDateHeader = $( "#fcsDateHeader" );
		$pmsDateLink = $( "#pmsDateLink" );
		$fcsDateLink = $( "#fcsDateLink" );

	// LOAD LOCATION OVER GROUP
	getLocationOvergroup().then( function ( LocOverGroups ){
		
		var optLocationOverGroups = "",
			LocOverGroupsLen = LocOverGroups.length;
		
		for ( var i = 0; i < LocOverGroupsLen; i++ ){

			optLocationOverGroups += "<option value='" + LocOverGroups[i].LOverGroupId + "'>" + LocOverGroups[i].LOverGroupDesc + '</option>';
		}
		
			$pmsItemOverLocation.prepend( optLocationOverGroups );
		},

		function(){ alert( "Error Loading location Over group" ); }
	);

	// LOAD ITEM GROUPS
	getItemGroups().then( function ( ItemGroups ){

		var optItemGroups = "",
			ItemGroupsLen = ItemGroups.length;
		
		for ( var i = 0; i < ItemGroupsLen; i++ ){

			optItemGroups += "<option value='" + ItemGroups[i].ItemGroupId + "'>" + ItemGroups[i].ItemGroupDesc + '</option>';
		}

			$pmsItemGroup.append( optItemGroups );

		},

		function(){ alert( "Error Loading Item group" ); }
	);

	// LOAD MAJOR GROUP
	getLocationMajorGroups().then( function ( LocOverGroupMajor ){
	
		var optLocationMajorGroups = "",
			LocOverGroupMajorLen = LocOverGroupMajor.length;
	
		for ( var i = 0; i < LocOverGroupMajorLen; i++ ){

			optLocationMajorGroups += "<option value='" + LocOverGroupMajor[i].LMajorGroupId + "'>" + LocOverGroupMajor[i].LMajorGroupDesc + '</option>';
		}
		
		$pmsItemMajorLocation.append( optLocationMajorGroups ).selectmenu( "refresh" ); 
		
		if ( $pmsItemMajorLocation.find( "option" ).length > 1 ){

			$pmsItemMajorLocation.selectmenu( "enable" );
			$pmsItemLocation.selectmenu( "enable" );
		} else {
		
			$pmsItemMajorLocation.selectmenu( "disable" );
			$pmsItemLocation.selectmenu( "disable" );
		}
	},

		function(){ alert( "Error Loading location Major group" ); }
	);
	
	// on Location Major group change: load location 
	$pmsItemMajorLocation.on( "change", function(){
		
		$pmsItemLocation.find( "option[ value != '1' ]" ).remove(); // Clear location list, except value=0
		$pmsItemLocation.selectmenu( "refresh" );
		
		//LOAD MAJOR GROUP - LOCATIONS
		var	locGroup = this.value;
		
		getMajorGroup_Locations({
			value : locGroup,
			what : "MajorGroupLocationList"
		}).then( function ( LocMajorGroupLocation ){
		
			var optLocationGroups = "",
				LocMajorGroupLocationLen = LocMajorGroupLocation.length;
		
			for ( var i = 0; i < LocMajorGroupLocationLen; i++ ){

				optLocationGroups += "<option value='" + LocMajorGroupLocation[i].LGroupId + "'>" + LocMajorGroupLocation[i].LGroupDesc + '</option>';
			}
			
			$pmsItemLocation.append( optLocationGroups ).val( "1" ).selectmenu( "refresh" );

			if ( $pmsItemLocation.find( "option" ).length > 1 ){
			
				$pmsItemLocation.selectmenu( "enable" );
			} else {
			
				$pmsItemLocation.selectmenu( "disable" );
			}
		},

			function(){ alert( "Error Loading location group" ); }
		);
	});		
	
	var pmsQueryParam = {
		pmsOver: 1,
		pmsMajor: 1,
		pmsLocation: 1,
		pmsGroup: 1,
		isAircon: false
	};
	
	// @PMS LOOKUP: "Search" button click
	$( "#pmsSearch" ).on( "click", function(){
		
		var pmsOver = $pmsItemOverLocation.find( ":selected" ).val(),
			pmsMajor = $pmsItemMajorLocation.find( ":selected" ).val(),
			pmsLocation = $pmsItemLocation.find( ":selected" ).val(),
			pmsGroup = $pmsItemGroup.find( ":selected" ).val(),
			isAircon = false;
		
		if ( pmsGroup == 1 ){
		
			alert( "Please select an Item group!" );
			return;
		} else {
			
			pmsQueryParam.pmsOver = pmsOver;
			pmsQueryParam.pmsMajor = pmsMajor;
			pmsQueryParam.pmsLocation = pmsLocation;
			pmsQueryParam.pmsGroup = pmsGroup;
			
			if ( pmsGroup == 100 ){ //Aircon
			
				pmsQueryParam.isAircon = true;
				// Show Filter Change Table header
				if ( $fcsDateHeader.is(":visible") === false ){ 

					$fcsDateHeader.show();
				}
				
			} else {
			
				pmsQueryParam.isAircon = false;
				//hide Filter Change Table header
				if ( $fcsDateHeader.is(":visible") ){
				
					$fcsDateHeader.hide();
				}
			}
		}

		loadItemPMS( "pms" );

	});
	
	//LOAD PMS Data function
	function loadItemPMS( pSorting ){
	
		$.ajax({
			global: true,
			dataType: "JSON",
			type: "GET",
			url: "pms.php",
			data: { 
				what: "itempms",
				pmsOver: pmsQueryParam.pmsOver,
				pmsMajor: pmsQueryParam.pmsMajor,
				pmsLocation: pmsQueryParam.pmsLocation,
				pmsGroup: pmsQueryParam.pmsGroup,
				pmsSorting: pSorting }
		}).then( function ( itempms ){

			var itempmslist = "",
				itempmsCnt = itempms.length,
				Cnt = 0,
				pmsDate = null,
				fcsDate = null,
				pmsDateToday = new Date(),
				isWarranty = 0;
			
			if ( $pmslist.find( "tr" ) ){ $pmslist.find( "tr" ).remove(); }
			
			for ( var i = 0; i < itempmsCnt; i++ ){
				
				isWarranty = 0;
				Cnt += 1;
				
					pmsDate = itempms[ i ].pmsDate;
					
				var	pmsId = itempms[ i ].pmsId,
					fcsId = itempms[ i ].fcsId,
					ItemId = itempms[ i ].ItemId,
					ItemGroup = itempms[ i ].ItemGroup,
					ItemPurchaseDate = itempms[ i ].PurchaseDate,
					ItemLabel = itempms[ i ].Label;
				
				if ( ItemLabel === null || !ItemLabel ){ ItemLabel = " "; }
				
				if ( pmsDate === null ){
			
					pmsDate = "Undefined";
					// pmsDateVal : id=itemIdLeo, name=itemId, used in link clicking of pms date.
					pmsDateVal = "<a href='#itemPMSDateUpdate' data-rel='popup' data-transition='pop' id='" + ItemId + "Leo' name='" + ItemId + "' class='itemPMSDateUpdatePop'>" + pmsDate + "</a>";
				} else {
					
					//pmsDateVal = pmsDate;
					//Temp. only - editable pms date.
					pmsDateVal = "<a href='#itemPMSDateUpdate' data-rel='popup' data-transition='pop' id='" + ItemId + "Leo' name='" + ItemId + "' class='itemPMSDateUpdatePop'>" + pmsDate + "</a>";
				}

				if ( parseInt( ItemPurchaseDate ) ){

					ItemPurchaseDate = new Date( ItemPurchaseDate );
					ItemPurchaseDate.setDate( ItemPurchaseDate.getDate() + 365 ); // 365 = 1 year
					if ( ItemPurchaseDate > pmsDateToday ){ isWarranty = 1; }
				}

				itempmslist += "<tr><td>" + Cnt + "</td>";
				itempmslist += "<td><a href='#itemDetailsPop' data-rel='popup' data-transition='pop' id='" + ItemId + "' name='" + pmsId + "' class='pmsItemDetailsPop'>" + itempms[ i ].LGroupDesc + "</a></td>";
				itempmslist += "<td>" + ItemLabel + "</td>";
				
				if ( isWarranty == 1 ){
				
					itempmslist += "<td><a href='#itemInfoPop' data-rel='popup' data-transition='pop' id='" + ItemId + "' name='" + pmsId + "' class='pmsItemInfoPop' style='color:#FFA500;'>" + itempms[ i ].Brand + "</a></td>";
				} else {
				
					itempmslist += "<td><a href='#itemInfoPop' data-rel='popup' data-transition='pop' id='" + ItemId + "' name='" + pmsId + "' class='pmsItemInfoPop'>" + itempms[ i ].Brand + "</a></td>";
				}				

				itempmslist += "<td>" + pmsDateVal + "</td>";
				
				// For Aircon - With Filter Change Scheduling
				if ( pmsQueryParam.isAircon ){ // 100 = Aircon ItemGroup Id
				
					fcsDate = itempms[ i ].fcsDate;

					if ( fcsDate === null ){
				
						fcsDate = "Undefined";
						//pmsDateVal : id=itemIdLeo, name=itemId, used in link clicking of pms date.
						fcsDateVal = "<a href='#itemFCSDateUpdate' data-rel='popup' data-transition='pop' id='" + ItemId + "Leox' name='" + ItemId + "' class='itemFCSDateUpdatePop'>" + fcsDate + "</a>";
					} else {
						
						//fcsDateVal = fcsDate;
						//Temp. only - editable fcs date.
						fcsDateVal = "<a href='#itemFCSDateUpdate' data-rel='popup' data-transition='pop' id='" + ItemId + "Leox' name='" + ItemId + "' class='itemFCSDateUpdatePop'>" + fcsDate + "</a>";
					}
					
					itempmslist += "<td>" + fcsDateVal + "</td></tr>";

				}
			}

			$pmslist.append( itempmslist );
			
			$(".pmsBtnInfo").button().button("refresh");
		},

			function(){ alert( "Error Loading Item PMS" ); }
		);
	}
	
	// PMS Schedule table: PMS Date Header name click
	$pmsDateLink.on( "click", function(){
	
		loadItemPMS( "pms" );
	});
	
	// PMS Schedule table: FCS Date Header name click
	$fcsDateLink.on( "click", function(){
	
		loadItemPMS( "fcs" );
	});
	
	// PMS Schedule table: Location name click
	$pmslist.on( "click", ".pmsItemDetailsPop", function(){
		
		var itemId = this.id,
			pmsId = this.name,
			currentDate = new Date(),
			pmsDate;
		
		//Set PMS STATUS of an Item
		pmsDate = $( "#" + itemId + "Leo" ).html(); // the Item date in PMS Schedule table.
		
		if ( pmsDate != "Undefined" ){

			var pmsDateSplit = pmsDate.split("-");
			
			// Set the two dates time to be the same, to get the difference in days only. :)
			var thepmsDate = new Date( pmsDateSplit[2] + "/" + pmsDateSplit[0] + "/" + pmsDateSplit[1] ),
				dateToday = new Date( currentDate.getFullYear() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getDate() );
			
			// Get the difference between item pms date and todays date;
			var pmsDateStat = parseInt( ( thepmsDate.getTime() - dateToday.getTime() ) / ( 1000*60*60*24 ) );
			
			// Set the status
			if ( pmsDateStat > 0 ) {
			
				$itemStatpop.val( "Pending" ).selectmenu( "refresh" );
			} else {
				
				$itemStatpop.val( "overdue" ).selectmenu( "refresh" );
			}
			
		} else {
		
			$itemStatpop.val( "Pending" ).selectmenu( "refresh" ); // Reset pms status to On-Schedule/Pending
		}
		
		// RESET Technicians list. Show all
		$aircontechLists.find( "li:hidden" ).show();
		//$assignTechDiv.hide();		
		//$availTech.hide();
		$pmsRemarks.val(""); // Clear Remarks
		
		$pmsAddTech.attr( "name", pmsId ); // pmsId = jobId, used to get pms job assigned technician(s). refer: $aircontechLists.on( "click",".techlists", function(){});
		$savePMSstat.attr( "name", itemId ); // set the "Save Status/Remarks" button name to the Item Id, use in updating pms status.
		
		if ( $aircontechAssign.find( "li" ) ){ $aircontechAssign.find( "li" ).remove(); } // Remove existing assign technician from Lists
		
		if ( parseInt( pmsId ) ){
		
			// Get assigned technicians, if there is any for an Item.
			$.ajax({
				cache: false,
				dataType: "JSON",
				type: "GET",
				url: "parameters.php",
				data: {
					what: "assignedTech",
					value: pmsId
				}
			}).then( function ( assignedTech ){
				
				var assignedTechLi = "",
					assignedTechLen = assignedTech.length;
				
				if ( assignedTechLen ){

					//$assignTechDiv.show();
					
					for ( var i = 0; i < assignedTechLen; i = i + 1 ){
						var techId = assignedTech[i].TechId,
							techName = assignedTech[i].Name;
					
						assignedTechLi = "<li style='padding-left: 0;padding-top: 0;padding-bottom:0;'><button id='" + techId + "' name='" + techName + "' data-mini='true' data-inline='true' class='techassign' style='padding-top: 0;'>-</button> " + techName + "</li>";
						$aircontechAssign.append( assignedTechLi ).listview().listview( "refresh" ); // Add tech name to assigned technicians list
					}
					
					hideAssignedTech();
				}
				/*
				// Get Technicians
				$.ajax({
					cache: false,
					dataType: "JSON",
					type: "GET",
					url: "parameters.php",
					data: {
						what: "airconTech",
						value: 0
					}
				}).then( function ( aircontechs ){
					
					if ( $aircontechLists.find( "li" ) ){ $aircontechLists.find( "li" ).remove(); }
					
					var airconTech = "",
						aircontechsLen = aircontechs.length;
					
					if ( aircontechsLen ){

						for ( var i = 0; i < aircontechsLen; i = i + 1 ){
						
							airconTech += "<li style='padding-left: 0;padding-top: 0;padding-bottom:0;'><button id='" + aircontechs[ i ].TechId + "' name='" + aircontechs[ i ].Name + "' data-mini='true' data-inline='true' class='techlists' style='padding-top: 0;'>+</button> " + aircontechs[ i ].Name + "</li>";
						}
						
						if ( airconTech ){
							
							$aircontechLists.append( airconTech ).listview().listview( "refresh" ); 
							hideAssignedTech();
						}
						
					} else {
					
						alert( "Error Loading Technicians!" );
					}
				},
					function(){ alert( "Error Loading Technicians!" ); }
				);				
				*/
			},

				function(){ alert( "Error Loading PMS Assigned Technician(s)!" ); }
			);		
			
			// Get PMS Remarks, if there is any for an Item.
			$.ajax({
				cache: false,
				dataType: "text", 
				type: "GET", 
				url: "parameters.php", 
				data: {
					what: "getPMSRemarks",
					value: pmsId
				}
			}).then( function ( theRemarks ){

				if ( theRemarks !== null ){ $pmsRemarks.val( theRemarks ); }
			},

				function(){ alert( "Error Loading PMS Remarks!" ); }
			);
		}
	});
		//SAVE PMS STATUS / REMARKS
		$savePMSstat.on( "click", function(){
		
			var pmsId = $pmsAddTech.attr( "name" );
				
			if ( pmsId !== "null" && pmsId !== null ){
				
				var pmsRems = $pmsRemarks.val();
				var remvalue = pmsId + "," + pmsRems,
					LineAmpCompressor = $("#LineAmpCompressor").val(),
					LineAmpAHU = $("#LineAmpAHU").val(),
					LineAmpACCU = $("#LineAmpACCU").val(),
					TempAmbiant = $("#TempAmbiant").val(),
					TempRoom = $("#TempRoom").val(),
					TempSupplyAir = $("#TempSupplyAir").val(),
					TempReturnAir = $("#TempReturnAir").val(),
					MotorAmpCompressor = $("#MotorAmpCompressor").val(),
					MotorAmpAHU = $("#MotorAmpAHU").val(),
					MotorAmpACCU = $("#MotorAmpACCU").val(),
					BeltCondition = $("#BeltCondition").val(),
					BeltAlignment = $("#BeltAlignment").val(),
					BeltTightness = $("#BeltTightness").val(),
					DischargePressure = $("#DischargePressure").val(),
					SuctionPressure = $("#SuctionPressure").val(),
					LineVoltage = $("#LineVoltage").val(),
					ReturnAir = $("#ReturnAir").val(),
					NoiseVibration = $("#NoiseVibration").val(),
					CompressorOil = $("#CompressorOil").val(),
					RefrigMoisture = $("#RefrigMoisture").val(),
					EvapCoil = $("#EvapCoil").val(),
					CondenserCoil = $("#CondenserCoil").val(),
					CondenseMotorMount = $("#CondenseMotorMount").val(),
					EvapMotorMount = $("#EvapMotorMount").val(),
					AirFilter = $("#AirFilter").val(),
					CondensateDrainPipe = $("#CondensateDrainPipe").val();
				
				// Save Remarks
				$.ajax({
					cache: false,
					dataType: "text",
					type: "POST",
					url: "paramAdd.php",
					data: {
						what : "pmsRemarks",
						value : remvalue,
						LineAmpCompressor : LineAmpCompressor,
						LineAmpAHU : LineAmpAHU,
						LineAmpACCU : LineAmpACCU,
						TempAmbiant : TempAmbiant,
						TempRoom : TempRoom,
						TempSupplyAir : TempSupplyAir,
						TempReturnAir : TempReturnAir,
						MotorAmpCompressor : MotorAmpCompressor,
						MotorAmpAHU : MotorAmpAHU,
						MotorAmpACCU : MotorAmpACCU,
						BeltCondition : BeltCondition,
						BeltAlignment : BeltAlignment,
						BeltTightness : BeltTightness,
						DischargePressure : DischargePressure,
						SuctionPressure : SuctionPressure,
						LineVoltage : LineVoltage,
						ReturnAir : ReturnAir,
						NoiseVibration : NoiseVibration,
						CompressorOil : CompressorOil,
						RefrigMoisture : RefrigMoisture,
						EvapCoil : EvapCoil,
						CondenserCoil : CondenserCoil,
						CondenseMotorMount : CondenseMotorMount,
						EvapMotorMount : EvapMotorMount,
						AirFilter : AirFilter,
						CondensateDrainPipe : CondensateDrainPipe
					}
				}).done( function( pmsRemarksStat ){ 
					
					if ( pmsRemarksStat == "success" ){
						
						$itemDetailsPop.popup( "close" );
					} else {
						
						alert( "Failed, Saving PMS Remarks." );
					}

				}).fail( function( pmsRemarksStat ){ 
				
					alert( "Failed, Saving PMS Remarks." );
				});
				
				// Check if Status was change to "Completed"
				var	theStat = $itemStatpop.find( ":selected" ).val();
				
				if ( theStat == "done" ){
				
					var itemId = this.name,
						itemPMSDays = 0;

					// Get Item default PMS Days
					$.ajax({
						cache: false,
						dataType: "text",
						type: "GET", 
						url: "parameters.php", 
						data: {
							what: "itemPMSDays",
							value: itemId
						}
					}).then( function ( itemPMSDaysValue ){
						
						if ( itemPMSDaysValue ){
							
							var dateToday = new Date(), newPMSDate;
							
							itemPMSDays = parseInt( itemPMSDaysValue );
							dateToday.setDate( dateToday.getDate() + itemPMSDays );
							Newdd = dateToday.getDate(),
							Newmm = dateToday.getMonth() + 1, // javascript date ranges from 0 - 11
							Newyy = dateToday.getFullYear();
							newPMSDate = Newyy + "-" + ( Newmm <= 9 ? '0' + Newmm : Newmm ) + "-" + ( Newdd <= 9 ? '0' + Newdd : Newdd ); // yyyy-mm-dd
							pmsData = pmsId + "," + newPMSDate + itemId;
							
							// UPDATE PMS status( completed ) and create new one.
							$.ajax({
								cache: false,
								dataType: "text",
								type: "POST", 
								url: "paramAdd.php", 
								data: {
									what: "updatePMSStat",
									value: pmsData
								}
							}).then( function ( updateStat ){
							
								var newPMSDate1,
									$thiItemRow = $( "#" + itemId + "Leo" ).parent().parent();
								
								newPMSDate1 = ( Newmm <= 9 ? '0' + Newmm : Newmm ) + "-" + ( Newdd <= 9 ? '0' + Newdd : Newdd ) + "-" + Newyy; // mm-dd-yyyy
								
								$thiItemRow.find( "td a" ).eq( 0 ).attr( "name", updateStat );
								$thiItemRow.find( "td a" ).eq( 1 ).attr( "name", updateStat );
								$thiItemRow.find( "td a" ).eq( 2 ).html( newPMSDate1 );
								$itemStatpop.val( "Pending" ).selectmenu( "refresh" );
								
								alert( "PMS Status updated successfully!" );
							},

								function(){ alert( "Error Updating PMS Status!" ); }
							);
							
						} else {
						
							alert( "Failed to get Item default PMS Days!" );
						}
					},

						function(){ alert( "Failed to get Item default PMS Days!" ); }
					);
				}
				
			} else {
			
				alert( "Failed, Saving PMS Status/Remarks." );
			}
		});	
				
		// CODES BELOW ARE ARE WORKING: NAMED FUNCTIONS BELOW VS. CALLBACK HELL ABOVE :) :) :). JUST TRIED BOTH for curiosity, WORKS FINE.

		// PMS: Load Technicians list once.
		$pmsAddTech.one( "click", function(){
			
			if ( $aircontechLists.find( "li" ) ){ $aircontechLists.find( "li" ).remove(); }
			
			$.ajax({
				cache: false,
				dataType: "JSON",
				type: "GET",
				url: "parameters.php",
				data: {
					what: "airconTech",
					value: 0
				}
			}).then( function ( aircontechs ){
				
				var airconTech = "",
					aircontechsLen = aircontechs.length;
				
				if ( aircontechsLen ){

					for ( var i = 0; i < aircontechsLen; i = i + 1 ){
					
						airconTech += "<li style='padding-left: 0;padding-top: 0;padding-bottom:0;'><button id='" + aircontechs[ i ].TechId + "' name='" + aircontechs[ i ].Name + "' data-mini='true' data-inline='true' class='techlists' style='padding-top: 0;'>+</button> " + aircontechs[ i ].Name + "</li>";
					}
					
					if ( airconTech ){
						
						$aircontechLists.append( airconTech ).listview().listview( "refresh" ); 
						hideAssignedTech();
					}
					
				} else {
				
					alert( "Error Loading Technicians!" );
				}
			},
				function(){ alert( "Error Loading Technicians!" ); }
			);
		
		});
		
		function hideAssignedTech(){
		
			var assignedTech = $aircontechAssign.find( "button" );
			
			$.each( assignedTech, function( i, tech ){
			
				$( "#" + tech.id + ".techlists").parent().hide();
			});
		}
		
		$pmsAddTech.on( "click", function(){
			
			if ( $aircontechLists.is( ":visible" ) ){
			
				$aircontechLists.hide(); // Hide Available Technicians
			} else {
			
				$aircontechLists.show(); // Show Available technicians
			}

		});
		
		// @Technicians: on Add ( + click ), lists of technician
		$aircontechLists.on( "click",".techlists", function(){
		
			var techId = this.id,
				techName = this.name,
				$selectedTech = $( this ).closest( "li" ),
				jobId = parseInt( $pmsAddTech.attr( "name" ) );				
			
			if ( jobId ){	
			
				// Save Technician
				$.ajax({
					cache: false,
					type: "POST",
					url: "jobpms.php",
					data: {
						what: 1,
						jobType: 0, 
						jobId: jobId, 
						techId: techId
					}
				}).done( function( assignTechStat ){ 
					
					if ( assignTechStat == "success" ){
					
						$selectedTech.hide();	// hide Tech name from list
						
						var airconTechAdd = "";
						airconTechAdd = "<li style='padding-left: 0;padding-top: 0;padding-bottom:0;'><button id='" + techId + "' name='" + techName + "' data-mini='true' data-inline='true' class='techassign' style='padding-top: 0;'>-</button> " + techName + "</li>";
						$aircontechAssign.prepend( airconTechAdd ).listview().listview( "refresh" ); // Add tech name to assigned technicians list
						
						if ( $assignTechDiv.is( ":hidden" ) ){ $assignTechDiv.show(); }
					} else {
						
						alert( "Failed to assign." );
					}

				}).fail( function( assignTechStat ){ 
				
					alert( "Failed to assign." );
				});
				
			} else { // jobid = null, No pms entry from pmsCurrent table in DB
			
				alert( "Please set PMS date before assigning technician(s)!" );
				$itemDetailsPop.popup( "close" );
			}
		});
		
		// @Assigned Technicians: on Remove ( - click ), assigned technician list
		$aircontechAssign.on( "click", ".techassign", function(){
			
			var techId = this.id,
				techName = this.name,
				$selectedTech = $( this ).closest( "li" ),
				jobId = parseInt( $pmsAddTech.attr( "name" ) );				
			
			if ( jobId ){	
				
				// Remove Technician
				$.ajax({
					cache: false,
					type: "POST",
					url: "jobpms.php",
					data: { 
						what: 0,
						jobType: 0, 
						jobId: jobId, 
						techId: techId
					}
				}).done( function( removeTechStat ){ 
					
					if ( removeTechStat == "success" ){
						
						$selectedTech.remove(); // Remove technician from assigned tech list
						$( "#" + techId ).closest( "li" ).show(); // show the technician from the list
						
						//if ( $aircontechAssign.find( "li" ).length === 0 ){ $assignTechDiv.hide(); }
						
					} else {
						
						alert( "Failed to Remove." );
					}

				}).fail( function( removeTechStat ){ 
				
					alert( "Failed to Remove." );
				});				
			}
		});
	
	// PMS Schedule table, Item name click.	
	$pmslist.on( "click", ".pmsItemInfoPop", function(){

		// PMS: LOAD ITEM Details
		$.ajax({
			cache: false,
			dataType: "JSON",
			type: "GET",
			url: "parameters.php",
			data: {
				what: "itemDetails",
				value: this.id
			}
		}).then( function ( itemdetails ){
				
			if ( itemdetails.length ){

				var itemItemGroup =	itemdetails[ 0 ].ItemGroup,
					pmsitemLocation = itemdetails[ 0 ].LGroupDesc,
					pmsitemBrand = itemdetails[ 0 ].Brand,
					pmsitemModel = itemdetails[ 0 ].Model,
					pmsitemSerial = itemdetails[ 0 ].Serial,
					purchaseDate = itemdetails[ 0 ].PurchaseDate,
					itemSupplier = itemdetails[ 0 ].Supplier,
					itemLabel = itemdetails[ 0 ].Label,
					
					D1 = itemdetails[ 0 ].D1,
					D2 = itemdetails[ 0 ].D2,
					D3 = itemdetails[ 0 ].D3,
					D4 = itemdetails[ 0 ].D4,
					D5 = itemdetails[ 0 ].D5,
					D6 = itemdetails[ 0 ].D6;
					D7 = itemdetails[ 0 ].D7,
					D8 = itemdetails[ 0 ].D8,
					
					pmsInterval = 0;
				
				//format date mm/dd/yyy
				if ( purchaseDate !== null ){
					
					purchaseDateSplit = purchaseDate.split("-");
					
					if ( parseInt( purchaseDateSplit[1] ) ){
						purchaseDate = purchaseDateSplit[1] + "-" + purchaseDateSplit[2] + "-" + purchaseDateSplit[0];
					} else {
					
						purchaseDate = "";
					}
				} else {
				
					purchaseDate = "";
				}
				
				if ( itemSupplier === null ){ itemSupplier = ""; }
				if ( itemLabel === null ){ itemLabel = ""; }
				
				if ( D1 === null ){ D1 = ""; }
				if ( D2 === null ){ D2 = ""; }
				if ( D3 === null ){ D3 = ""; }
				if ( D4 === null ){ D4 = ""; }
				if ( D5 === null ){ D5 = ""; }
				if ( D6 === null ){ D6 = ""; }
				if ( D7 === null ){ D7 = ""; }
				if ( D8 === null ){ D8 = ""; }
				
				// GET Item Group Field Mapping and Details   // TEMP. ONLY: MUST BE A MODULE
				getItemGroupFieldMapping({
					what: "FieldMapping",
					value: itemItemGroup
				}).then( function ( Fieldmapping ){
		
					if ( Fieldmapping.length ){
						
						pmsInterval = Fieldmapping[ 0 ].pmsDays + " days";
						Detail1 = Fieldmapping[ 0 ].D1;
						Detail2 = Fieldmapping[ 0 ].D2;
						Detail3 = Fieldmapping[ 0 ].D3;
						Detail4 = Fieldmapping[ 0 ].D4;
						Detail5 = Fieldmapping[ 0 ].D5;
						Detail6 = Fieldmapping[ 0 ].D6;
						Detail7 = Fieldmapping[ 0 ].D7;
						Detail8 = Fieldmapping[ 0 ].D8;
						
						if ( Detail1 === null ){ Detail1 = "Detail 1"; }
						if ( Detail2 === null ){ Detail2 = "Detail 2"; }
						if ( Detail3 === null ){ Detail3 = "Detail 3"; }
						if ( Detail4 === null ){ Detail4 = "Detail 4"; }
						if ( Detail5 === null ){ Detail5 = "Detail 5"; }
						if ( Detail6 === null ){ Detail6 = "Detail 6"; }
						if ( Detail7 === null ){ Detail7 = "Detail 7"; }
						if ( Detail8 === null ){ Detail8 = "Detail 8"; }
						
						$valpmsDetailLocation.html( pmsitemLocation );
						$valpmsDetailLabel.html( itemLabel );
						$valpmsDetailBrand.html( pmsitemBrand );
						$valpmsDetailInterval.html( pmsInterval );
						$valpmsDetailModel.html( pmsitemModel );
						$valpmsDetailSerial.html( pmsitemSerial );
						$valpmsDetailPurchasedate.html( purchaseDate );
						$valpmsDetailSupplier.html( itemSupplier );
						
						$lblpmsDetail1.html( Detail1 );
						$lblpmsDetail2.html( Detail2 );
						$lblpmsDetail3.html( Detail3 );
						$lblpmsDetail4.html( Detail4 );
						$lblpmsDetail5.html( Detail5 );
						$lblpmsDetail6.html( Detail6 );
						$lblpmsDetail7.html( Detail7 );
						$lblpmsDetail8.html( Detail8 );

						$valpmsDetail1.html( D1 );
						$valpmsDetail2.html( D2 );
						$valpmsDetail3.html( D3 );
						$valpmsDetail4.html( D4 );
						$valpmsDetail5.html( D5 );
						$valpmsDetail6.html( D6 );
						$valpmsDetail7.html( D7 );
						$valpmsDetail8.html( D8 );
						
					} else {

						alert( "Failed to get Item group field mapping!" );
					}
				},

					function(){ alert( "Failed to get Item group field mapping!" ); }
				);
				
			} else {
			
				alert( "Error Loading Item Details!" );
			}
		},

			function(){ alert( "Error Loading Item Details!" ); }
		);
	});
	
	//PMS Schedule table, PMS DATE/Undefined click.
	$pmslist.on( "click", ".itemPMSDateUpdatePop", function(){
		
		var itemId = this.name,
			itemCurrentPMSDate = $( this ).html();
		
		$currentItemPMSDate.html( itemCurrentPMSDate );
		
		// disable: Saving Last PMS date if current pmsDAte value is not "Undefined".. maybe temp. only 
		if ( itemCurrentPMSDate == "Undefined" ){
		
			$( "#savePMSDate" ).attr( "disabled", false );
		} else {
		
			$( "#savePMSDate" ).attr( "disabled", true );
		}	

		// LOAD Item Details for PMS Date update
		$.ajax({
			cache: false,
			dataType: "JSON",
			type: "GET",
			url: "parameters.php",
			data: {
				what: "itemDetailsPMSDate",
				value: itemId
			}
		}).then( function ( itemdetails ){
			
			if ( itemdetails.length ){

				var	pmsDays = parseInt( itemdetails[0].pmsDays );
				
				if ( pmsDays ){ // Item group has setting for number of days for PMS
					
					// Set the "Save" button name=ItemId, use for saving :) 
					$( "#savePMSDate" ).attr( "name", itemdetails[0].ItemId );

					$itemPMSDate.val( "leox-07-05" );

				} else { // Item group has no default PMS days interval

					$itemPMSDate.val( "leox-07-05" );
				}
				
				$( "#itemGroupNamePMS" ).html( itemdetails[0].ItemGroupDesc );
				$( "#itemLocationPMS" ).html( itemdetails[0].LGroupDesc );
				$( "#itemNamePMS" ).html( itemdetails[0].Brand + " ( " + itemdetails[0].Model + " )");
				$( "#itemGroupDays" ).html( pmsDays + " days" );
				
				
				// LOAD Item PMS History: Date Only
				$.ajax({
					cache: false,
					dataType: "JSON",
					type: "GET",
					url: "parameters.php",
					data: {
						what: "itemPMSHistoryDate",
						value: itemId
					}
				}).then( function ( pmsHistoryDates ){
				
					var HistoryLen = pmsHistoryDates.length,
						Hists = "";

					if ( HistoryLen ){
					
						for ( var i = 0; i< HistoryLen; i = i + 1 ){
						
							Hists += pmsHistoryDates[i].pmsDate + " <br />";
						}
						
						$( "#pmsDateHistory" ).html( Hists );
						
					} else {
						
						$( "#pmsDateHistory" ).html( "No Entry found" );
					}
				},

					function(){ alert( "PMS Date click: Error Loading Item PMS history dates." ); }
				);
				
				
			} else {
				
				alert( "PMS Date click: Error Loading Item Details. Possible cause: Invalid Item group PMS days Interval" );
			}
		},

			function(){ alert( "PMS Date click: Error Loading Item Details!" ); }
		);
	});
		
		// Set Item Starting PMS Date: Save click
		$( "#savePMSDate" ).on( "click", function(){
			
			var itemId = this.name;
			
			//check new pms date if valid
			
			var lastPMSDate = $itemPMSDate.val(), // new PMS Date
				$oldPMSDate = $( "#" + itemId + "Leo" ), // OLD PMS Date
				itemPMSStat = 0,
				nextPMSDate,
				dateToday = new Date();
				
			if ( !lastPMSDate ){ //Check if valid date

				alert( "Invalid last PMS date value" );
				return;
			} else {
				
				nextPMSDate = new Date( lastPMSDate );
				lastPMSDate = new Date( lastPMSDate );			
				
				if ( lastPMSDate > dateToday ){ // check if date is not future date.
				
					alert( "Invalid last PMS date value" );
					return;
				}
			}
			
			//GET ITEM DEFAULT PMS Days value
			$.ajax({
				cache: false,
				dataType: "text",
				type: "GET", 
				url: "parameters.php", 
				data: {
					what: "itemPMSDays",
					value: itemId
				}
			}).then( function ( itemPMSDaysValue ){
				
				var itemPMSDaysVal = parseInt( itemPMSDaysValue );
				
				if ( itemPMSDaysVal ){
					
					// last pms date plus item PMS Days Interval
					nextPMSDate.setDate( nextPMSDate.getDate() + itemPMSDaysVal );
					
					// CHECK IF NEXT PMS DATE IS NOT PAST DATE. If past date, set today as next PMS date.
					if ( nextPMSDate < dateToday ){ nextPMSDate = dateToday; }
					
					lastdd = lastPMSDate.getDate(),
					lastmm = lastPMSDate.getMonth() + 1, // javascript date ranges from 0 - 11
					lastyy = lastPMSDate.getFullYear();
					
					// yyyy-mm-dd : for saving
					lastPMSDate = lastyy + "-" + ( lastmm <= 9 ? '0' + lastmm : lastmm ) + "-" + ( lastdd <= 9 ? '0' + lastdd : lastdd );
					
					Newdd = nextPMSDate.getDate(),
					Newmm = nextPMSDate.getMonth() + 1, // javascript date ranges from 0 - 11
					Newyy = nextPMSDate.getFullYear();

					// yyyy-mm-dd : for saving
					nextPMSDate = Newyy + "-" + ( Newmm <= 9 ? '0' + Newmm : Newmm ) + "-" + ( Newdd <= 9 ? '0' + Newdd : Newdd );

					// mm-dd-yyyy : for display
					nextPMSDate1 = ( Newmm <= 9 ? '0' + Newmm : Newmm ) + "-" + ( Newdd <= 9 ? '0' + Newdd : Newdd ) + "-" + Newyy;
					
					// check if Undefined date: 1 = means Insert row to "pmsCurrent", 0 = (default), update only.
					if ( $currentItemPMSDate.html() == "Undefined" ){ itemPMSStat = 1; }
					
					// Default date and ItemId: separated by comma
					var paramSetDate = itemPMSStat + "," + nextPMSDate + "," + lastPMSDate + "," + itemId;
					
					// SAVE / SET item PMS date	
					$.ajax({
						cache: false,
						type: "POST",
						url: "paramAdd.php",
						data: {
							value : paramSetDate,
							what : "startingPMSDate"
						}
					}).done( function( PMSDatesaveStat ){ 
						
						if ( PMSDatesaveStat == "success" ){
							
							$oldPMSDate.html( nextPMSDate1 ); // update date on PMS Schedule Table
							$( "#itemPMSDateUpdate" ).popup( "close" );
						} else {
							
							alert( "Failed, Saving Item PMS  Date." );
						}

					}).fail( function(){ 
					
						alert( "Failed, Saving Item PMS  Date." );
					});				
				} else {
				
					alert( "Failed to get Item default PMS Days!" );
				}
			},

				function(){ alert( "Failed to get Item default PMS Days!" ); }
			);

		});

	//PMS Schedule table, FCS DATE/Undefined click.
	$pmslist.on( "click", ".itemFCSDateUpdatePop", function(){
		
		var itemId = this.name,
			itemCurrentFCSDate = $( this ).html();
		
		$currentItemFCSDate.html( itemCurrentFCSDate );

		// LOAD Item Details for FCS Date update
		$.ajax({
			cache: false,
			dataType: "JSON",
			type: "GET",
			url: "parameters.php",
			data: {
				what: "itemDetailsPMSDate",
				value: itemId
			}
		}).then( function ( itemdetails ){

			if ( itemdetails.length ){

				var	fcsDays = parseInt( itemdetails[0].fcsDays );
				
				if ( fcsDays ){ // Item group has setting for number of days for FCS

					// Set the "Save" button name=ItemId, use for saving :) 
					$( "#saveFCSDate" ).attr( "name", itemdetails[0].ItemId );

					$itemFCSDate.val( "leox-07-05" );

				} else { // Item group has no default PMS days interval

					$itemFCSDate.val( "leox-07-05" );
				}
				
				$( "#itemGroupNameFCS" ).html( itemdetails[0].ItemGroupDesc );
				$( "#itemLocationFCS" ).html( itemdetails[0].LGroupDesc );
				$( "#itemNameFCS" ).html( itemdetails[0].Brand + " ( " + itemdetails[0].Model + " )");
				$( "#filterChangeDays" ).html( fcsDays + " days" );

				// LOAD Item FCS History: Date Only
				$.ajax({
					cache: false,
					dataType: "JSON",
					type: "GET",
					url: "parameters.php",
					data: {
						what: "itemFCSHistoryDate",
						value: itemId
					}
				}).then( function ( fcsHistoryDates ){

					var Hists = "";
					
					if ( fcsHistoryDates ){

						var HistoryLen = fcsHistoryDates.length;
						
						if ( HistoryLen ){
						
							for ( var i = 0; i< HistoryLen; i = i + 1 ){
								Hists += fcsHistoryDates[i].fcsDate + " <br />";
							}
							
							$( "#fcsDateHistory" ).html( Hists );
							
						} else {
							
							$( "#fcsDateHistory" ).html( "No Entry found" );
						}
					} else {
					
						$( "#fcsDateHistory" ).html( "No Entry found" );
					}
				},

					function(){ alert( "FCS Date click: Error Loading Item FCS history dates." ); }
				);
			} else {
				
				alert( "FCS Date click: Error Loading Item Details. Possible cause: Invalid Item group FCS days Interval" );
			}
		},

			function(){ alert( "FCS Date click: Error Loading Item Details!" ); }
		);
	});
		
		// Set Item Starting FCS Date: Save click
		$( "#saveFCSDate" ).on( "click", function(){

			var itemId = this.name;

			//check new pms date if valid
			var lastFCSDate = $itemFCSDate.val(), // Last PMS Date
				$oldFCSDate = $( "#" + itemId + "Leox" ), // OLD PMS Date
				itemFCSStat = 0,
				nextFCSDate,
				dateToday = new Date();

			if ( !lastFCSDate ){ //Check if valid date

				alert( "Invalid last FCS date value" );
				return;
			} else {

				nextFCSDate = new Date( lastFCSDate );
				lastFCSDate = new Date( lastFCSDate );
				
				if ( lastFCSDate > dateToday ){ // check if date is not future date.
					alert( "Invalid last FCS date value" );
					return;
				}
			}
			
			// GET ITEM DEFAULT FCS Days Interval value
			$.ajax({
				cache: false,
				dataType: "text",
				type: "GET", 
				url: "parameters.php", 
				data: {
					what: "itemFCSDays",
					value: itemId
				}
			}).then( function ( itemFCSDaysValue ){

				var itemFCSDaysVal = parseInt( itemFCSDaysValue );
				
				if ( itemFCSDaysVal ){

					// last fcs date plus item FCS Days Interval
					nextFCSDate.setDate( nextFCSDate.getDate() + itemFCSDaysVal );
					
					// CHECK IF NEXT FCS DATE IS NOT PAST DATE. If past date, set today as next FCS date.
					if ( nextFCSDate < dateToday ){ nextFCSDate = dateToday; }
					
					lastdd = lastFCSDate.getDate(),
					lastmm = lastFCSDate.getMonth() + 1, // javascript date ranges from 0 - 11
					lastyy = lastFCSDate.getFullYear();
					
					// yyyy-mm-dd : for saving
					lastFCSDate = lastyy + "-" + ( lastmm <= 9 ? '0' + lastmm : lastmm ) + "-" + ( lastdd <= 9 ? '0' + lastdd : lastdd );
					
					Newdd = nextFCSDate.getDate(),
					Newmm = nextFCSDate.getMonth() + 1, // javascript date ranges from 0 - 11
					Newyy = nextFCSDate.getFullYear();

					// yyyy-mm-dd : for saving
					nextFCSDate = Newyy + "-" + ( Newmm <= 9 ? '0' + Newmm : Newmm ) + "-" + ( Newdd <= 9 ? '0' + Newdd : Newdd );

					// mm-dd-yyyy : for display
					nextFCSDate1 = ( Newmm <= 9 ? '0' + Newmm : Newmm ) + "-" + ( Newdd <= 9 ? '0' + Newdd : Newdd ) + "-" + Newyy;
					
					// check if Undefined date: 1 = means Insert row to "fcsCurrent", 0 = (default), update only.
					if ( $currentItemFCSDate.html() == "Undefined" ){ itemFCSStat = 1; }
					
					// Default date and ItemId: separated by comma
					var paramSetDate = itemFCSStat + "," + nextFCSDate + "," + lastFCSDate + "," + itemId;

					// SAVE / SET item PMS date	
					$.ajax({
						cache: false,
						type: "POST",
						url: "paramAdd.php",
						data: {
							value : paramSetDate,
							what : "startingFCSDate"
						}
					}).done( function( FCSDatesaveStat ){
						
						if ( FCSDatesaveStat == "success" ){
							
							$oldFCSDate.html( nextFCSDate1 ); // update date on FCS Schedule Table
							$( "#itemFCSDateUpdate" ).popup( "close" );
						} else {
							
							alert( "Failed, Saving Item FCS  Date." );
						}

					}).fail( function(){
					
						alert( "Failed, Saving Item FCS  Date." );
					});
				} else {
				
					alert( "Failed to get Item default FCS Days!" );
				}
			},

				function(){ alert( "Failed to get Item default FCS Days!" ); }
			);

		});
});

function getItemGroups(){
	
	var data = { value : 0, what : "itemgroupList" },
		igURL = "parameters.php";
	
	return $.ajax({
		cache: false,
		dataType: "JSON",
		type: "GET",
		url: igURL,
		data: data
	});
}
		
function getItemGroupFieldMapping( data ){

	var igFieldmapURL = "parameters.php";
	
	return $.ajax({
		cache: false,
		dataType: "JSON",
		type: "GET",
		url: igFieldmapURL,
		data: data
	});
}

function getDepartments(){

	var data = { value : 0, what : "deptList" },
		deptURL = "parameters.php";
		
	return $.ajax({
		cache: false,
		dataType: "JSON",
		type: "GET",
		url: deptURL,
		data: data
	});
}

function getLocationOvergroup(){

	var data = { value : 0, what : "locationoverList" },
		loc_OverURL = "parameters.php";
		
	return $.ajax({
		cache: false,
		dataType: "JSON",
		type: "GET",
		url: loc_OverURL,
		data: data
	});
}

function getLocationMajorGroups(){

	var data = { value : 0, what : "locationmajorList" },
		loc_majorURL = "parameters.php";
		
	return $.ajax({
		cache: false,
		dataType: "JSON",
		type: "GET",
		url: loc_majorURL,
		data: data
	});
}

function getMajorGroup_Locations( data ){

	var mg_locURL = "parameters.php";
	
	return $.ajax({
		cache: false,
		dataType: "JSON",
		type: "GET",
		url: mg_locURL,
		data: data
	});
}

function getLocations( data ){

	var locURL = "parameters.php";
	
	return $.ajax({
		cache: false,
		dataType: "JSON",
		type: "GET",
		url: locURL,
		data: data
	});
}

$(document).ready( function(){
	$( "#inOrout" ).on("click", function(){
		localStorage.removeItem("emsleo");
		window.location.href = "index.html";
	});
});
