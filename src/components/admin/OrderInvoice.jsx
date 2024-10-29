import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import dayjs from "dayjs";
import { PAYMENT_METHOD } from "../../services/const";
import { formatVNDCurrency } from "../../utils/currencyUtils";

Font.register({
  family: "Roboto",
  src: "https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Me5Q.ttf", // Đảm bảo font này hỗ trợ tiếng Việt
});

const OrderInvoice = ({ orderData }) => {
  const styles = StyleSheet.create({
    page: {
      flexDirection: "column",
      backgroundColor: "#ffffff",
      padding: 10,
    },
    tableHeader: {
      fontSize: 10,
      fontFamily: "Roboto",
      padding: 4,
      backgroundColor: "#EEEEEE",
      borderBottom: "1px solid #000",
      flexDirection: "row",
    },
    tableRow: {
      fontSize: 10,
      fontFamily: "Roboto",
      padding: 4,
      flexDirection: "row",
      borderBottom: "1px solid #000",
    },
    tableCol: {
      width: "20%",
      textAlign: "center",
    },
  });

  const now = dayjs();

  return (
    <Document>
      <Page size="A5" style={styles.page}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              wordSpacing: "3%",
              fontSize: 20,
            }}
          >
            Starborn
          </Text>
          <Text
            style={{
              fontSize: 20,
              fontFamily: "Roboto",
            }}
          >
            HÓA ĐƠN
          </Text>
        </View>
        <View
          style={{
            marginTop: 10,
            border: "1px solid #000",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Roboto",
              padding: 4,
              borderBottom: "1px solid #000",
            }}
          >
            Thông tin đơn hàng
          </Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontSize: 10,
                fontFamily: "Roboto",
                padding: 4,
              }}
            >
              Ngày đặt:
            </Text>
            <Text
              style={{
                fontSize: 10,
                fontFamily: "Roboto",
                padding: 4,
              }}
            >
              {dayjs(orderData?.created_at).format("HH:mm:ss, DD/MM/YYYY")}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontSize: 10,
                fontFamily: "Roboto",
                padding: 4,
              }}
            >
              Mã đơn hàng:
            </Text>
            <Text
              style={{
                fontSize: 10,
                fontFamily: "Roboto",
                padding: 4,
              }}
            >
              {orderData?.id}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontSize: 10,
                fontFamily: "Roboto",
                padding: 4,
              }}
            >
              Phương thức thanh toán:
            </Text>
            <Text
              style={{
                fontSize: 10,
                fontFamily: "Roboto",
                padding: 4,
              }}
            >
              {PAYMENT_METHOD[orderData?.payment_method]} ({orderData?.payment_status === 0 ? "Đã TT" : "Chưa TT"})
            </Text>
          </View>
        </View>
        <View
          style={{
            marginTop: 10,
            border: "1px solid #000",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Roboto",
              padding: 4,
              borderBottom: "1px solid #000",
            }}
          >
            Chi tiết Người bán
          </Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontSize: 10,
                fontFamily: "Roboto",
                padding: 4,
              }}
            >
              Tên doanh nghiệp:
            </Text>
            <Text
              style={{
                fontSize: 10,
                fontFamily: "Roboto",
                padding: 4,
              }}
            >
              Công ty TNHH Starborn
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontSize: 10,
                fontFamily: "Roboto",
                padding: 4,
              }}
            >
              Địa chỉ:
            </Text>
            <Text
              style={{
                fontSize: 10,
                fontFamily: "Roboto",
                padding: 4,
              }}
            >
              465 đường Giải Phóng, Phương Liệt, Thanh Xuân, HN
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontSize: 10,
                fontFamily: "Roboto",
                padding: 4,
              }}
            >
              Số điện thoại:
            </Text>
            <Text
              style={{
                fontSize: 10,
                fontFamily: "Roboto",
                padding: 4,
              }}
            >
              085.6918.666
            </Text>
          </View>
        </View>
        <View
          style={{
            marginTop: 10,
            border: "1px solid #000",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Roboto",
              padding: 4,
              borderBottom: "1px solid #000",
            }}
          >
            Chi tiết Người nhận
          </Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontSize: 10,
                fontFamily: "Roboto",
                padding: 4,
              }}
            >
              Tên người nhận:
            </Text>
            <Text
              style={{
                fontSize: 10,
                fontFamily: "Roboto",
                padding: 4,
              }}
            >
              {orderData?.receiver_name}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%"
            }}
          >
            <Text
              style={{
                fontSize: 10,
                fontFamily: "Roboto",
                padding: 4,
                width: "30%",
              }}
            >
              Địa chỉ nhận hàng:
            </Text>
            <Text
              wrap
              style={{
                fontSize: 10,
                fontFamily: "Roboto",
                padding: 4,
                width: "60%",
                textAlign: "right"
              }}
            >
              {orderData?.shipping_address}, {orderData?.shipping_ward ? orderData?.shipping_ward + ", " : ""}{orderData?.shipping_district}, {orderData?.shipping_province}
            </Text>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontSize: 10,
                fontFamily: "Roboto",
                padding: 4,
              }}
            >
              Số điện thoại:
            </Text>
            <Text
              style={{
                fontSize: 10,
                fontFamily: "Roboto",
                padding: 4,
              }}
            >
              {orderData?.receiver_phone}
            </Text>
          </View>
        </View>
        <View
          style={{
            marginTop: 10,
            border: "1px solid #000",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Roboto",
              padding: 4,
              borderBottom: "1px solid #000",
            }}
          >
            Danh sách sản phẩm
          </Text>
          {/* Header cho bảng sản phẩm */}
          <View style={styles.tableHeader}>
            <Text style={styles.tableCol}>STT</Text>
            <Text style={styles.tableCol}>Tên sản phẩm</Text>
            <Text style={styles.tableCol}>Màu sắc</Text>
            <Text style={styles.tableCol}>Size</Text>
            <Text style={styles.tableCol}>Số lượng</Text>
          </View>

          {/* Hiển thị từng sản phẩm */}
          {orderData?.orderItems.map((item, index) => (
            <View key={item.variant_option_id} style={styles.tableRow}>
              <Text style={styles.tableCol}>{index + 1}</Text>
              <Text style={styles.tableCol}>{item.name}</Text>
              <Text style={styles.tableCol}>{item.color}</Text>
              <Text style={styles.tableCol}>{item.size}</Text>
              <Text style={styles.tableCol}>{item.quantity}</Text>
            </View>
          ))}
        </View>

        <View
          style={{
            marginTop: 8,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              display: "flex",
              gap: 4,
              width: "50%",
            }}
          >
            <Text
              style={{
                fontSize: 10,
                fontFamily: "Roboto",
                textAlign: "center",
              }}
            >
              Hà Nội,{" "}
              {`ngày ${now.date()} tháng ${now.month() + 1} năm ${now.year()}`}
            </Text>
            <Text
              style={{
                fontSize: 10,
                fontFamily: "Roboto",
                textAlign: "center",
              }}
            >
              Xác nhận của người bán
            </Text>
          </View>
          <View
            style={{
              width: "40%",
              display: "flex",
              gap: 4,
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: "Roboto",
                }}
              >
                Giá trị đơn hàng
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: "Roboto",
                }}
              >
                {formatVNDCurrency(orderData?.total)}
              </Text>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: "Roboto",
                }}
              >
                Phí vận chuyển
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  fontFamily: "Roboto",
                }}
              >
                {formatVNDCurrency(30000)}
              </Text>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Roboto",
                }}
              >
                Tổng
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Roboto",
                }}
              >
                {formatVNDCurrency(2030000)}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default OrderInvoice;
