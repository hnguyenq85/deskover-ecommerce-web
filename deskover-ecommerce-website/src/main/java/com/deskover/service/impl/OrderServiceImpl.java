package com.deskover.service.impl;

import com.deskover.dto.app.order.OrderDto;
import com.deskover.dto.app.order.OrderItemDto;
import com.deskover.dto.app.order.resquest.DataOrderResquest;
import com.deskover.dto.app.total7dayago.DataTotaPrice7DaysAgo;
import com.deskover.dto.app.total7dayago.Total7DaysAgo;
import com.deskover.entity.*;
import com.deskover.repository.*;
import com.deskover.repository.datatables.OrderRepoForDatatables;
import com.deskover.service.*;
import com.deskover.util.DecimalFormatUtil;
import com.deskover.util.MapperUtil;
import com.deskover.util.OrderNumberUtil;
import com.deskover.util.QrCodeUtil;

import org.hibernate.cache.spi.support.AbstractReadWriteAccess.Item;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.datatables.mapping.DataTablesInput;
import org.springframework.data.jpa.datatables.mapping.DataTablesOutput;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.criteria.Predicate;
import javax.validation.Valid;
import java.sql.Timestamp;
import java.text.DecimalFormat;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository repo;

    @Autowired
    private OrderRepoForDatatables repoForDatatables;

    @Autowired
    private OrderDetailRepository orderDetailRepo;

    @Autowired
    private OrderItemRepository orderItemRepo;

    @Autowired
    private OrderStatusRepository orderStatusRepo;

    @Autowired
    private ProductRepository productRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private ShippingService shippingService;

    @Autowired
    private CartService cartService;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserAddressService addressService;

    @Autowired
    private ModelMapper mapper;

    @Autowired 
    private ProductService productService;
    
    @Autowired 
    private StatusPaymentService statusPaymentService;
    
    @Override
    public List<Order> getAll() {
        return repo.findAll();
    }

    @Override
    public DataTablesOutput<Order> getAllForDatatables(@Valid DataTablesInput input, String statusCode) {
        DataTablesOutput<Order> orders = repoForDatatables.findAll(input, (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (statusCode != null && !statusCode.isBlank()) {
                predicates.add(criteriaBuilder.equal(root.get("orderStatus").get("code"), statusCode));
            }
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        });
        if (orders.getError() != null) {
            throw new IllegalArgumentException(orders.getError());
        }
        return orders;
    }

    @Override
    public List<Order> getAllOrderByStatus(String status) {
        return repo.findByOrderStatusCode(status);
    }

    @Override
    public DataTotaPrice7DaysAgo doGetTotalPrice7DaysAgo() {
        DateTimeFormatter format = DateTimeFormatter.ofPattern("dd-MM-yyyy");
        LocalDateTime now = LocalDateTime.now();
        List<Total7DaysAgo> total7DaysAgos = new ArrayList<>();
        for (int i = 0; i < 7; i++) {
            LocalDateTime then = now.minusDays(i);
            Total7DaysAgo day = new Total7DaysAgo();
            day.setDate(then.format(format));
            String total = repo.getTotalPrice_Shipping_PerDay(then.getDayOfMonth() + "",
                    then.getMonth().getValue() + "",
                    then.getYear() + "",
                    SecurityContextHolder.getContext().getAuthentication().getName(), "GH-TC");
            if (total != null) {
                day.setTotalPrice(Double.parseDouble(total));
                day.setPriceFormat(DecimalFormatUtil.FormatDecical(total) + "??");
                System.out.println(day.getTotalPrice());
            } else {
                day.setTotalPrice(0.0);
                day.setPriceFormat("0.0??");
            }

            total7DaysAgos.add(day);

        }
        DataTotaPrice7DaysAgo totals = new DataTotaPrice7DaysAgo();
        totals.setData(total7DaysAgos);
        return totals;
    }

    @Override
    public OrderDto getByOrderCode(String orderCode, String status) {

        DecimalFormat formatter = new DecimalFormat("###,###,###");

        Order order = repo.findByOrderCodeAndOrderStatusCode(orderCode, status);
        if (order == null) {
            throw new IllegalArgumentException("Kh??ng t??m th???y s???n ph???m");

        }
        OrderDto orderDto = mapper.map(order, OrderDto.class);
        OrderDetail orderDetail = orderDetailRepo.findByOrder(order);

        orderDto.setAddress(orderDetail.getAddress());
        orderDto.setProvince(orderDetail.getProvince());
        orderDto.setDistrict(orderDetail.getDistrict());
        orderDto.setWard(orderDetail.getWard());
        orderDto.setTel(orderDetail.getTel());

        orderDto.setCode(order.getOrderStatus().getCode());
        orderDto.setStatus(order.getOrderStatus().getStatus());

        List<OrderItem> orderItems = orderItemRepo.findByOrderId(order.getId());
        List<OrderItemDto> itemDtos = new ArrayList<>();

        for (OrderItem item : orderItems) {
            OrderItemDto itemDto = new OrderItemDto();
            itemDto.setName(item.getProduct().getName());
            itemDto.setPrice(formatter.format(item.getPrice()));
            itemDto.setQuantity(item.getQuantity());
            itemDto.setImg(item.getProduct().getImg());
            itemDtos.add(itemDto);
        }
        orderDto.setOrderItem(itemDtos);
        orderDto.setTotalPrice(formatter.format(repo.getTotalOrder(order.getId())));


        return orderDto;
    }

    @Override
    public DataOrderResquest getListOrder(String status) {

        DecimalFormat formatter = new DecimalFormat("###,###,###");

        List<Order> orders = repo.findByModifiedByAndOrderStatusCode(SecurityContextHolder.getContext().getAuthentication().getName(), status);
        if (orders == null) {
            throw new IllegalArgumentException("Kh??ng t??m th???y s???n ph???m");

        }
        List<OrderDto> orderDtos = new ArrayList<>();

        orders.forEach(order -> {
            OrderDto orderDto = mapper.map(order, OrderDto.class);
            OrderDetail orderDetail = orderDetailRepo.findByOrder(order);

            orderDto.setAddress(orderDetail.getAddress());
            orderDto.setProvince(orderDetail.getProvince());
            orderDto.setDistrict(orderDetail.getDistrict());
            orderDto.setWard(orderDetail.getWard());
            orderDto.setTel(orderDetail.getTel());

            orderDto.setCode(order.getOrderStatus().getCode());
            orderDto.setStatus(order.getOrderStatus().getStatus());

            List<OrderItem> orderItems = orderItemRepo.findByOrderId(order.getId());
            List<OrderItemDto> itemDtos = new ArrayList<>();

            for (OrderItem item : orderItems) {
                OrderItemDto itemDto = new OrderItemDto();
                itemDto.setName(item.getProduct().getName());
                itemDto.setPrice(formatter.format(item.getPrice()));
                itemDto.setQuantity(item.getQuantity());
                itemDto.setImg(item.getProduct().getImg());
                itemDtos.add(itemDto);
            }
            orderDto.setOrderItem(itemDtos);
            orderDto.setTotalPrice(formatter.format(repo.getTotalOrder(order.getId())));
            orderDtos.add(orderDto);
        });
        DataOrderResquest data = new DataOrderResquest();
        data.setData(orderDtos);

        return data;
    }

    @Override
    public DataOrderResquest getListOrderByUser() {

        DecimalFormat formatter = new DecimalFormat("###,###,###");

        List<Order> orders = repo.findByModifiedBy(SecurityContextHolder.getContext().getAuthentication().getName());
        if (orders == null) {
            throw new IllegalArgumentException("Kh??ng t??m th???y s???n ph???m");

        }
        List<OrderDto> orderDtos = new ArrayList<>();

        orders.forEach(order -> {
            OrderDto orderDto = mapper.map(order, OrderDto.class);
            OrderDetail orderDetail = orderDetailRepo.findByOrder(order);

            orderDto.setAddress(orderDetail.getAddress());
            orderDto.setProvince(orderDetail.getProvince());
            orderDto.setDistrict(orderDetail.getDistrict());
            orderDto.setWard(orderDetail.getWard());
            orderDto.setTel(orderDetail.getTel());

            orderDto.setCode(order.getOrderStatus().getCode());
            orderDto.setStatus(order.getOrderStatus().getStatus());

            List<OrderItem> orderItems = orderItemRepo.findByOrderId(order.getId());
            List<OrderItemDto> itemDtos = new ArrayList<>();

            for (OrderItem item : orderItems) {
                OrderItemDto itemDto = new OrderItemDto();
                itemDto.setName(item.getProduct().getName());
                itemDto.setPrice(formatter.format(item.getPrice()));
                itemDto.setQuantity(item.getQuantity());
                itemDto.setImg(item.getProduct().getImg());
                itemDtos.add(itemDto);
            }
            orderDto.setOrderItem(itemDtos);
            orderDto.setTotalPrice(formatter.format(repo.getTotalOrder(order.getId())));
            orderDtos.add(orderDto);
        });
        DataOrderResquest data = new DataOrderResquest();
        data.setData(orderDtos);

        return data;
    }

    @Override
    public String getToTalPricePerMonth() {
        YearMonth currentTimes = YearMonth.now();
        return repo.getToTalPricePerMonth(currentTimes.getMonthValue() + "",
                currentTimes.getYear() + "", SecurityContextHolder.getContext().getAuthentication().getName());


    }

    @Override
    public String getCountOrderPerMonth() {
        YearMonth currentTimes = YearMonth.now();
        return repo.getCountOrder(currentTimes.getMonthValue() + "",
                currentTimes.getYear() + "", SecurityContextHolder.getContext().getAuthentication().getName());
    }

    @Override
    @Transactional
    public void pickupOrder(String orderCode, String code, String note) {
        try {
            Order order = repo.findByOrderCode(orderCode);
            if (order == null) {
                throw new IllegalArgumentException("Kh??ng t??m th???y s???n ph???m");

            }
            OrderStatus status = orderStatusRepo.findByCode(code);
            if (status == null) {
                throw new IllegalArgumentException("C???p nh???p th???t b???i");

            }
            order.setShipping_note(note);
            order.setOrderStatus(status);
            order.setModifiedBy(SecurityContextHolder.getContext().getAuthentication().getName());
            repo.saveAndFlush(order);
        } catch (Exception e) {
            throw new IllegalArgumentException("C???p nh???p ????n h??ng th???y b???i");
        }

    }

    @Override
    public OrderDto findByCode(String orderCode) {
        DecimalFormat formatter = new DecimalFormat("###,###,###");

        Order order = repo.findByOrderCode(orderCode);
        if (order == null) {
            throw new IllegalArgumentException("Kh??ng t??m th???y s???n ph???m");

        }
        OrderDto orderDto = mapper.map(order, OrderDto.class);
        OrderDetail orderDetail = orderDetailRepo.findByOrder(order);

        orderDto.setAddress(orderDetail.getAddress());
        orderDto.setProvince(orderDetail.getProvince());
        orderDto.setDistrict(orderDetail.getDistrict());
        orderDto.setWard(orderDetail.getWard());
        orderDto.setTel(orderDetail.getTel());

        orderDto.setCode(order.getOrderStatus().getCode());
        orderDto.setStatus(order.getOrderStatus().getStatus());

        List<OrderItem> orderItems = orderItemRepo.findByOrderId(order.getId());
        List<OrderItemDto> itemDtos = new ArrayList<>();

        for (OrderItem item : orderItems) {
            OrderItemDto itemDto = new OrderItemDto();
            itemDto.setName(item.getProduct().getName());
            itemDto.setPrice(formatter.format(item.getPrice()));
            itemDto.setQuantity(item.getQuantity());
            itemDto.setImg(item.getProduct().getImg());
            itemDtos.add(itemDto);
        }
        orderDto.setOrderItem(itemDtos);
        orderDto.setTotalPrice(formatter.format(repo.getTotalOrder(order.getId())));
        return orderDto;
    }

    @Override
    public Order changeOrderStatusCode(String orderCode) {
        Order order = repo.findByOrderCode(orderCode);
        if (order == null) {
            throw new IllegalArgumentException("Kh??ng t??m th???y ????n h??ng");
        }
        if (order.getOrderStatus().getCode().equals("C-XN")) {
            order.setQrCode(QrCodeUtil.QrCode(order.getOrderCode(), order.getOrderCode()));
            order.setModifiedBy(SecurityContextHolder.getContext().getAuthentication().getName());
            order.setOrderStatus(orderStatusRepo.findByCode("C-LH"));
            return repo.saveAndFlush(order);
        } else if (order.getOrderStatus().getCode().equals("C-HUY")) {
            order.setModifiedBy(SecurityContextHolder.getContext().getAuthentication().getName());
            order.setOrderStatus(orderStatusRepo.findByCode("HUY"));
            return repo.saveAndFlush(order);
        }
        throw new IllegalArgumentException("????n h??ng code_status = 'C-XN' ho???c 'C-HUY'!!");
    }

    @Override
    @Transactional
    public Order addOrder(Order orderResponse) {
        List<Cart> cartItem = cartService.doGetAllCartOrder();
        if (cartItem.isEmpty()) {
            throw new IllegalArgumentException("Gi??? h??ng tr???ng");
        }

        String orderCode = "";
        while (true) {
            String orderRamdom = OrderNumberUtil.get();
            if (this.isUniqueOrderNumber(orderRamdom)) {
                orderCode = orderRamdom;
                break;
            }

        }
        Users user = userRepo.findByUsername(SecurityContextHolder.getContext().getAuthentication().getName());
        Order order = mapper.map(orderResponse, Order.class);
        order.setOrderCode(orderCode);
        order.setUser(user);
        order.setFullName(user.getUsername());
        order.setOrderStatus(orderStatusRepo.findByCode("C-XN"));
        order.setCreatedAt(new Timestamp(System.currentTimeMillis()));
        for (Cart cart : cartItem) {
            order.setUnitPrice(order.getUnitPrice() + (cart.getProduct().getPrice() * cart.getQuantity()));
            order.setOrderQuantity(order.getOrderQuantity() + cart.getQuantity());
        }
        Order orderNew = repo.saveAndFlush(order);

        cartRepository.deleteAll(cartItem);
        List<OrderItem> orderItems = MapperUtil.mapAll(cartItem, OrderItem.class);
        orderItems.forEach((item) -> {
            Product product = item.getProduct();
            if (product.getQuantity() <= 0) {
                throw new IllegalArgumentException("S???n ph???m t???m h???t h??ng");
            }
            product.setQuantity(product.getQuantity() - item.getQuantity());
            item.setId(null);
            item.setPrice(item.getProduct().getPrice());
            item.setOrder(orderNew);
            productRepo.save(product);
            orderItemRepo.saveAndFlush(item);
        });
        UserAddress address = addressService.findByUsernameAndChoose(Boolean.TRUE);
        OrderDetail orderDetail = mapper.map(address, OrderDetail.class);
        orderDetail.setId(null);
        orderDetail.setOrder(orderNew);
        orderDetailRepo.saveAndFlush(orderDetail);
        return order;
    }

    @Override
    public Boolean isUniqueOrderNumber(String orderNumber) {
        return Objects.isNull(repo.findByOrderCode(orderNumber));
    }

    @Override
    public List<OrderStatus> getAllOrderStatus() {
        return orderStatusRepo.findAll();
    }

    @Override
    public List<PaymentMethods> getAllPayment() {
        return paymentService.getAll();
    }

    @Override
    public List<ShippingMethods> getAllShippingUnit() {
        return shippingService.getAll();
    }

	@Override
	public void cancelOrder(Order orderResponse) {
		Order order = repo.findById(orderResponse.getId()).orElse(null);
		List<OrderItem> productsItems = orderItemRepo.findByOrderId(order.getId());
		if(order.getStatusPayment().getCode().equals("C-TT")) {
			productsItems.forEach((item) -> {
				Product product = productService.findById(item.getId());
				if(product == null) {
					throw new IllegalArgumentException("s???n ph???m n??y kh??ng t???n t???i");
				}
				product.setQuantity(product.getQuantity() + item.getQuantity());
				productRepo.saveAndFlush(product);
				
				OrderStatus status = orderStatusRepo.findByCode("HUY");
				order.setOrderStatus(status);
				repo.saveAndFlush(order);
				
			});
		}else if(order.getStatusPayment().getCode().equals("D-TT")){
			productsItems.forEach((item) -> {
				Product product = productService.findById(item.getId());
				if(product == null) {
					throw new IllegalArgumentException("s???n ph???m n??y kh??ng t???n t???i");
				}
				product.setQuantity(product.getQuantity() + item.getQuantity());
				productRepo.saveAndFlush(product);
				
				OrderStatus status = orderStatusRepo.findByCode("HUY");
				order.setOrderStatus(status);
				StatusPayment statusPayment = statusPaymentService.findByCode("C-HT");
				order.setStatusPayment(statusPayment);
				repo.saveAndFlush(order);
			});
		}
	}

	@Override
	public void refundMoney(Order order) {
		if(order.getStatusPayment().getCode().equals("C-HT")) {
			StatusPayment statusPayment = statusPaymentService.findByCode("D-HT");
			order.setStatusPayment(statusPayment);
			repo.saveAndFlush(order);
		}
	}

}
