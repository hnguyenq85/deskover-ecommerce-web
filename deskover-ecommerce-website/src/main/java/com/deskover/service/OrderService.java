package com.deskover.service;

import com.deskover.dto.app.order.OrderDto;
import com.deskover.dto.app.order.resquest.DataOrderResquest;
import com.deskover.dto.app.total7dayago.DataTotaPrice7DaysAgo;
import com.deskover.entity.Order;
import com.deskover.entity.OrderStatus;
import com.deskover.entity.PaymentMethods;
import com.deskover.entity.ShippingMethods;
import org.springframework.data.jpa.datatables.mapping.DataTablesInput;
import org.springframework.data.jpa.datatables.mapping.DataTablesOutput;

import java.util.List;

public interface OrderService {

	List<Order> getAll();

	DataTablesOutput<Order> getAllForDatatables(DataTablesInput input, String statusCode);

	List<Order> getAllOrderByStatus(String statusCode);

	OrderDto getByOrderCode(String orderCode, String status);
	
	OrderDto findByCode(String orderCode);
	
	Order addOrder(Order orderResponse);
	
	DataOrderResquest getListOrder(String status);
	
	DataOrderResquest getListOrderByUser();

	String getToTalPricePerMonth();
	
	String getCountOrderPerMonth();

	DataTotaPrice7DaysAgo doGetTotalPrice7DaysAgo();

	void pickupOrder(String orderCode,String code,String note);

	Order changeOrderStatusCode(String orderCode);

	Boolean isUniqueOrderNumber(String orderNumber);

	List<OrderStatus> getAllOrderStatus();

	List<PaymentMethods> getAllPayment();

	List<ShippingMethods> getAllShippingUnit();
	
	void cancelOrder(Order orderResponse);
	
	void refundMoney(Order order);
}
