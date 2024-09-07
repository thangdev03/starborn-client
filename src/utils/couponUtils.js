import moment from 'moment'
import { colors } from '../services/const';

export const checkCouponStatus = (coupon = {
    code: '',
    description: '',
    amount: 0,
    type: '',
    active_date: '',
    expiration_date: '',
    total_limit: 0,
    total_uses: 0,
    min_order_value: 0,
    can_reuse: true,
    limit_reuse: 0,
    is_enable: true
}) => {
    const now = moment();
    const isOutdated = moment(coupon.expiration_date).isBefore(now);
    const isBeforeActive = moment(coupon.active_date).isAfter(now);
    if (isBeforeActive) {
        return (
            <span style={{ color: '#4A69E2' }}>
                Chưa tới ngày
            </span>
        );
    }
    if (isOutdated) {
        return (
            <span style={{ color: colors.red }}>
                Hết hạn
            </span>
        );
    }
    if (coupon.total_uses === coupon.total_limit) {
        return (
            <span style={{ color: colors.red }}>
                Hết lượt
            </span>
        );
    }

    return (
        <span style={{ color: '#45C266' }}>
            Sẵn sàng
        </span>
    );
}