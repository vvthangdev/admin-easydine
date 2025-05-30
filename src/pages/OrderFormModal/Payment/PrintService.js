import { toast } from "react-toastify";

class PrintService {
  // Generate print-ready HTML content
  static generatePrintHTML(orderDetails, staffInfo) {
    if (!orderDetails) return '';
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>In Hóa Đơn</title>
          <meta charset="utf-8">
          <style>
            @page { 
              margin: 15mm; 
              size: A4;
            }
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body { 
              font-family: 'Courier New', monospace;
              font-size: 12px;
              line-height: 1.4;
              color: black;
              width: 100%;
            }
            .receipt-container {
              width: 100%;
              max-width: 400px;
              margin: 0 auto;
            }
            .header {
              text-align: center;
              margin-bottom: 15px;
              padding-bottom: 10px;
              border-bottom: 1px solid black;
            }
            .company-name {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .info-section {
              margin-bottom: 15px;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 3px;
            }
            .info-row span:first-child {
              flex: 1;
            }
            .info-row span:last-child {
              font-weight: bold;
            }
            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 15px;
            }
            .table-header {
              border-top: 1px solid black;
              border-bottom: 1px solid black;
              font-weight: bold;
              font-size: 11px;
            }
            .table-header td {
              padding: 5px 2px;
            }
            .table-subheader {
              border-bottom: 1px solid black;
              font-style: italic;
              font-size: 10px;
            }
            .table-subheader td {
              padding: 3px 2px;
            }
            .item-row {
              border-bottom: 1px dotted #ccc;
            }
            .item-name {
              font-weight: bold;
              padding: 5px 0 2px 0;
              font-size: 11px;
            }
            .item-details td {
              padding: 2px;
              font-size: 11px;
            }
            .item-note {
              font-size: 10px;
              color: #666;
              font-style: italic;
            }
            .total-section {
              border-top: 2px solid black;
              padding-top: 10px;
              margin-top: 10px;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 5px;
              font-size: 12px;
            }
            .final-total {
              border-top: 1px solid black;
              padding-top: 5px;
              font-size: 14px;
              font-weight: bold;
            }
            .payment-section {
              border-top: 1px solid black;
              margin-top: 15px;
              padding-top: 10px;
            }
            .footer {
              text-align: center;
              font-weight: bold;
              margin-top: 20px;
              font-size: 12px;
            }
            .separator {
              border: 1px solid black;
              margin: 10px 0;
            }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .font-bold { font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            <!-- Header -->
            <div class="header">
              <div class="company-name">EasyDine vvthang.dev@gmail.com</div>
            </div>

            <!-- Order Info -->
            <div class="info-section">
              <div class="info-row">
                <span>Bàn Table:</span>
                <span>${orderDetails.reservedTables?.[0]?.table_number || "N/A"}</span>
              </div>
              <div class="info-row">
                <span>Số Khách:</span>
                <span>${orderDetails.reservedTables?.[0]?.capacity || "1"}</span>
              </div>
              <div class="info-row">
                <span>Giờ vào Time in:</span>
                <span>${orderDetails.reservedTables?.[0]?.start_time 
                  ? new Date(orderDetails.reservedTables[0].start_time).toLocaleString('vi-VN', {
                      day: '2-digit', month: '2-digit', year: 'numeric',
                      hour: '2-digit', minute: '2-digit', second: '2-digit'
                    }).replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$1.$2.$3') + ' AM'
                  : "N/A"}</span>
              </div>
              <div class="info-row">
                <span>Giờ in Printed time:</span>
                <span>${new Date().toLocaleString('vi-VN', {
                  day: '2-digit', month: '2-digit', year: 'numeric',
                  hour: '2-digit', minute: '2-digit', second: '2-digit'
                }).replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$1.$2.$3')} AM</span>
              </div>
              <div class="info-row">
                <span>In lần Printed:</span>
                <span>1</span>
              </div>
              <div class="info-row">
                <span>Thu ngân Cashier:</span>
                <span>${staffInfo.name}</span>
              </div>
            </div>

            <!-- Items Table -->
            <table class="items-table">
              <tr class="table-header">
                <td style="width: 40%;">Tên hàng</td>
                <td style="width: 12%; text-align: center;">ĐVT</td>
                <td style="width: 12%; text-align: center;">SL</td>
                <td style="width: 16%; text-align: center;">ĐG</td>
                <td style="width: 20%; text-align: right;">THÀNH TIỀN</td>
              </tr>
              <tr class="table-subheader">
                <td>Items</td>
                <td style="text-align: center;">Unit</td>
                <td style="text-align: center;">Qty</td>
                <td style="text-align: center;">Price</td>
                <td style="text-align: right;">Amount</td>
              </tr>
              ${orderDetails.itemOrders?.map(item => `
                <tr class="item-row">
                  <td colspan="5">
                    <div class="item-name">
                      ${item.itemName || "N/A"}${item.size && item.size !== "Mặc định" ? ` / ${item.size}` : ""}
                    </div>
                    ${item.note && item.note !== "Không có" ? `<div class="item-note">${item.note}</div>` : ""}
                  </td>
                </tr>
                <tr class="item-details">
                  <td></td>
                  <td style="text-align: center;">Phần</td>
                  <td style="text-align: center;">${item.quantity || 0}</td>
                  <td style="text-align: center;">${(item.itemPrice || 0).toLocaleString()}</td>
                  <td style="text-align: right;">${((item.itemPrice || 0) * (item.quantity || 0)).toLocaleString()}</td>
                </tr>
              `).join('') || '<tr><td colspan="5">Không có món ăn nào</td></tr>'}
            </table>

            <div style="text-align: right; font-size: 14px; font-weight: bold; margin-bottom: 15px;">
              ${(orderDetails.order?.total_amount || 0).toLocaleString()}
            </div>

            ${orderDetails.order?.voucher_code && orderDetails.order.voucher_code !== "Không có" ? `
            <div style="margin-bottom: 15px; font-size: 11px;">
              <div style="display: flex; justify-content: space-between;">
                <span>CSGG</span>
                <span>Dis Name</span>
                <span>${orderDetails.order.voucher_code}</span>
              </div>
            </div>
            ` : ''}

            <!-- Totals -->
            <div class="total-section">
              <div class="total-row">
                <span class="font-bold">Tạm tính</span>
                <span class="font-bold">${(orderDetails.order?.total_amount || 0).toLocaleString()}</span>
              </div>
              ${orderDetails.order?.discount_amount > 0 ? `
              <div class="total-row">
                <span>Giảm giá Discount</span>
                <span>${(orderDetails.order.discount_amount || 0).toLocaleString()}</span>
              </div>
              <div class="total-row">
                <span>Sau Giảm Giá</span>
                <span class="font-bold">${(orderDetails.order?.final_amount || 0).toLocaleString()}</span>
              </div>
              ` : ''}
              <div class="total-row final-total">
                <span>Thành tiền Total VND</span>
                <span>${(orderDetails.order?.final_amount || 0).toLocaleString()}</span>
              </div>
            </div>

            <div class="separator"></div>

            <!-- Payment Info -->
            <div class="payment-section">
              <div class="total-row">
                <span class="font-bold">Hình thức thanh toán</span>
                <span></span>
              </div>
              <div class="total-row">
                <span>${orderDetails.order?.payment_method || "VND"}</span>
                <span class="font-bold">${(orderDetails.order?.final_amount || 0).toLocaleString()}</span>
              </div>
              <div class="total-row">
                <span>Thanh toán còn lại</span>
                <span class="font-bold">0</span>
              </div>
            </div>

            <!-- Footer -->
            <div class="footer">
              <div>PHIẾU CÓ GIÁ TRỊ</div>
              <div>XUẤT HÓa ĐƠN TRONG NGÀY</div>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  // Handle print invoice
  static printInvoice(orderDetails, staffInfo) {
    if (!orderDetails) {
      toast.error("Không có dữ liệu để in!");
      return;
    }

    const printContent = this.generatePrintHTML(orderDetails, staffInfo);
    const printWindow = window.open('', '', 'width=800,height=600');
    
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      
      // Wait for content to load then print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 100);
      };
    } else {
      toast.error("Không thể mở cửa sổ in. Vui lòng kiểm tra popup blocker!");
    }
  }
}

export default PrintService;