package com.meiyuetao.o2o.common;

import java.text.NumberFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public class DateUtil {
    private static NumberFormat nf = NumberFormat.getInstance();

    /**
     * 格式化接收时间供页面显示(如8:00) 周订单所保存的接收时间为当日0点到接收时间的分钟数
     *
     * @param receiveTime 接收时间
     * @return 小时
     */
    public static String formatHour(int receiveTime) {
        nf.setGroupingUsed(false);
        nf.setMaximumIntegerDigits(2);
        nf.setMinimumIntegerDigits(2);
        int hour = receiveTime / 60;
        return hour + ":" + nf.format(receiveTime - hour * 60);
    }

    /**
     * 获取本周一的日期
     *
     * @return 本周一的日期
     */
    public static Date getMondayThisWeek() {
        Calendar calendar = Calendar.getInstance();
        while (calendar.get(Calendar.DAY_OF_WEEK) != Calendar.MONDAY) {
            calendar.add(Calendar.DATE, -1);
        }
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MINUTE, 0);
        return calendar.getTime();
    }

    /**
     * 计算两个日期之间相差的天数
     *
     * @param smdate 较小的时间
     * @param bdate  较大的时间
     * @return 相差天数
     * @throws ParseException
     */
    public static int daysBetween(Date smdate, Date bdate) throws ParseException {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        smdate = sdf.parse(sdf.format(smdate));
        bdate = sdf.parse(sdf.format(bdate));
        Calendar cal = Calendar.getInstance();
        cal.setTime(smdate);
        long time1 = cal.getTimeInMillis();
        cal.setTime(bdate);
        long time2 = cal.getTimeInMillis();
        long between_days = (time2 - time1) / (1000 * 3600 * 24);
        return Integer.parseInt(String.valueOf(between_days));
    }
}
