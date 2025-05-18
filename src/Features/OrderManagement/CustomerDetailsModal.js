import React from 'react';
import { Box, Typography, Button, Modal } from '@mui/material';
import moment from 'moment';

const OrderDetailsModal = ({ visible, orderDetails, onCancel }) => {
  return (
    <Modal
      open={visible}
      onClose={onCancel}
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Box sx={{ bgcolor: 'background.paper', p: 3, borderRadius: 3, width: 800, maxHeight: '80vh', overflowY: 'auto' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Chi Tiết Đơn Hàng
        </Typography>
        {orderDetails ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Thông Tin Đơn Hàng
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mt: 1 }}>
                <Typography variant="body2">
                  <b>Mã Đơn Hàng:</b> {orderDetails.order?.id || orderDetails._id || 'N/A'}
                </Typography>
                <Typography variant="body2">
                  <b>Mã Khách Hàng:</b> {orderDetails.order?.customer_id || orderDetails.customer_id || 'N/A'}
                </Typography>
                <Typography variant="body2">
                  <b>Ngày:</b>{' '}
                  {orderDetails.order?.time || orderDetails.time
                    ? moment.utc(orderDetails.order?.time || orderDetails.time).local().format('DD/MM/YYYY')
                    : 'N/A'}
                </Typography>
                <Typography variant="body2">
                  <b>Thời gian bắt đầu:</b>{' '}
                  {orderDetails.reservedTables?.[0]?.start_time
                    ? moment.utc(orderDetails.reservedTables[0].start_time).local().format('HH:mm')
                    : 'N/A'}
                </Typography>
                <Typography variant="body2">
                  <b>Thời gian kết thúc:</b>{' '}
                  {orderDetails.reservedTables?.[0]?.end_time
                    ? moment.utc(orderDetails.reservedTables[0].end_time).local().format('HH:mm')
                    : 'N/A'}
                </Typography>
                <Typography variant="body2">
                  <b>Loại:</b> {orderDetails.order?.type || orderDetails.type || 'N/A'}
                </Typography>
                <Typography variant="body2">
                  <b>Trạng Thái:</b> {orderDetails.order?.status || orderDetails.status || 'N/A'}
                </Typography>
              </Box>
            </Box>

            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Danh Sách Bàn Đặt
              </Typography>
              {orderDetails.reservedTables?.length > 0 ? (
                <ul style={{ paddingLeft: 20, marginTop: 8 }}>
                  {orderDetails.reservedTables.map((table) => (
                    <li key={table._id}>
                      <Typography variant="body2">
                        <b>Bàn:</b> {table.table_id || 'N/A'}, <b>Thời gian:</b>{' '}
                        {table.start_time && table.end_time
                          ? `${moment.utc(table.start_time).local().format('HH:mm, DD/MM/YYYY')} - ${moment
                              .utc(table.end_time)
                              .local()
                              .format('HH:mm, DD/MM/YYYY')}`
                          : 'N/A'}
                      </Typography>
                    </li>
                  ))}
                </ul>
              ) : (
                <Typography variant="body2">Không có bàn đặt nào.</Typography>
              )}
            </Box>

            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Danh Sách Mặt Hàng
              </Typography>
              {orderDetails.itemOrders?.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                  {orderDetails.itemOrders.map((item) => (
                    <Box
                      key={item._id}
                      sx={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider', pb: 2 }}
                    >
                      <img
                        src={item.itemImage || 'https://via.placeholder.com/80'}
                        alt={item.itemName || 'Item'}
                        style={{ width: 64, height: 64, borderRadius: 8, objectFit: 'cover', marginRight: 16 }}
                      />
                      <Box>
                        <Typography variant="body2">
                          <b>Tên:</b> {item.itemName || 'N/A'}
                        </Typography>
                        <Typography variant="body2">
                          <b>Kích thước:</b> {item.size || 'Mặc định'}
                        </Typography>
                        <Typography variant="body2">
                          <b>Ghi chú:</b> {item.note || 'Không có'}
                        </Typography>
                        <Typography variant="body2">
                          <b>Giá:</b> {item.itemPrice ? item.itemPrice.toLocaleString() : 'N/A'} VND
                        </Typography>
                        <Typography variant="body2">
                          <b>Số Lượng:</b> {item.quantity || 'N/A'}
                        </Typography>
                        <Typography variant="body2">
                          <b>Tổng Tiền:</b>{' '}
                          {item.itemPrice && item.quantity
                            ? (item.itemPrice * item.quantity).toLocaleString()
                            : 'N/A'}{' '}
                          VND
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2">Không có mặt hàng nào được đặt.</Typography>
              )}
            </Box>

            <Box sx={{ borderTop: '1px solid', borderColor: 'divider', pt: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Tính Tổng Hóa Đơn
              </Typography>
              <Box sx={{ mt: 1 }}>
                {(() => {
                  const totalAmount =
                    orderDetails.itemOrders?.reduce(
                      (acc, item) => acc + (item.itemPrice || 0) * (item.quantity || 0),
                      0
                    ) || 0;
                  const vat = totalAmount * 0.1;
                  const grandTotal = totalAmount + vat;
                  return (
                    <>
                      <Typography variant="body2">
                        <b>Tổng Tiền:</b> {totalAmount.toLocaleString()} VND
                      </Typography>
                      <Typography variant="body2">
                        <b>VAT (10%):</b> {vat.toLocaleString()} VND
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        <b>Tổng Cộng:</b> {grandTotal.toLocaleString()} VND
                      </Typography>
                    </>
                  );
                })()}
              </Box>
            </Box>
          </Box>
        ) : (
          <Typography variant="body2">Đang tải thông tin chi tiết...</Typography>
        )}
        <Button
          variant="outlined"
          color="secondary"
          onClick={onCancel}
          sx={{ mt: 2 }}
        >
          Đóng
        </Button>
      </Box>
    </Modal>
  );
};

export default OrderDetailsModal;