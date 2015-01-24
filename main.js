$(function(){

	var $orders = $('#orders');
	var $name = $('#name');
	var $drink = $('#drink');
	
	var orderTemplate = $('#order-template').html();
	
	function addOrder(order){
		orders.append( Mustache.render(orderTemplate, order));
	}
	
	$.ajax({
		type: 'GET',
		url: '/api/orders',
		success: function(orders){
			$.each(orders, function(i, order){
				addOrder(order);
			});
		},
		error: function(){
			alert('Error loading orders');
		}
	});
	
	$('#add-order').on('click', function(){
		
		var order = {
			name: $name.val(),
			drink: $drink.val()
		};
		
		$.ajax({
			type: 'POST',
			url: '/orders',
			data: order,
			success: function(newOrder){
				addOrder(newOrder);
			},
			error: function(){
				alert("Error saving order");
			}
		});
	});
	
	$orders.delegate('.remove', 'click', function(){
	
		var $li = $(this).closest('li');
		var self = this;
		
		$.ajax({
			type: 'DELETE',
			url: '/orders/' + $(this).attr('data-id'),
			success: function(){
				$li.fadeout(300, function(){
					$(this).remove();
				});
			}
		});
	});
	
	$orders.delegate('.editOrder', 'click', function(){
		var $li = $(this).closest('li');
		$li.find('input.name').val( $li.find('span.name').html() );
		$li.find('input.drink').val( $li.find('span.drink').html() );
		$li.addClass('edit');
	});
	
	$orders.delegate('.cancellEdit', 'click', function(){
		$(this).closest('li').removeClass('edit');
	});
	
	$orders.delegate('saveEdit', 'click', function(){
		var $li = $(this).closest('li');
		var order = {
			name: $li.find('input.name').val(),
			drink: $li.find('input.drink').val()
		};
		
		$.ajax({
			type: 'PUT',
			url: '/orders/' + $li.attr('data-id'),
			data: order,
			success: function( newOrder ){
				$li.find('span.name').html(order.name);
				$li.find('span.drink').html(order.drink);
				$li.removeClass('edit');
			},
			error: function(){
				alert('Error updating order');
			}
		});
	});
}