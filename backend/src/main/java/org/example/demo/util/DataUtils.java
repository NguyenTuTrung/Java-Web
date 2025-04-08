package org.example.demo.util;


import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.lang.reflect.Field;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.sql.Timestamp;
import java.text.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.regex.Pattern;

public class DataUtils {

    private static final Logger log = LoggerFactory.getLogger(DataUtils.class);

    public static final char DEFAULT_ESCAPE_CHAR_QUERY = '\\';

    public static boolean isNullOrEmpty(Collection<?> collection) {
        return collection == null || collection.isEmpty();
    }

    public static boolean isNull(Object o) {
        return o == null;
    }

    public static boolean isNullOrZero(Object o) {
        return o == null || safeToLong(o) == 0L;
    }

    public static boolean isNullOrEmpty(String string) {
        return string == null || string.trim().isEmpty();
    }

    public static BigDecimal safeToBigDecimal(Object obj) {
        if (obj instanceof BigDecimal) {
            return (BigDecimal) obj;
        } else if (!isNull(obj)) {
            try {
                return new BigDecimal(obj.toString().trim());
            } catch (Exception e) {
                //                log.error(e.getMessage(), e);
                return BigDecimal.ZERO;
            }
        }
        return BigDecimal.ZERO;
    }

    public static BigDecimal safeToBigDecimal(Object obj, BigDecimal defaultValue) {
        if (obj instanceof BigDecimal) {
            return (BigDecimal) obj;
        } else if (!isNull(obj) && !isNullOrEmpty(obj.toString())) {
            try {
                return new BigDecimal(obj.toString().trim());
            } catch (Exception e) {
                return defaultValue;
            }
        }
        return defaultValue;
    }

    public static String safeToString(Object obj) {
        return Optional.ofNullable(obj).map(Object::toString).orElse("");
    }

    public static String safeToString(Object obj, String defaultValue) {
        return Optional.ofNullable(obj).map(Object::toString).orElse(safeToString(defaultValue));
    }

    public static String setNullIfEmptyString(Object obj) {
        if (DataUtils.isNull(obj) || DataUtils.isNullOrEmpty(obj.toString())) {
            return null;
        }
        return obj.toString();
    }

    public static Object setNullIfEmptyObject(Object obj) {
        if (DataUtils.isNull(obj) || DataUtils.isNullOrEmpty(obj.toString())) {
            return null;
        }
        return obj;
    }

    public static Timestamp safeToTimestamp(Object obj) {
        return Optional.ofNullable(obj).map(o -> (Timestamp) o).orElse(null);
    }

    public static Integer safeToInteger(Object obj) {
        if (obj == null) {
            return 0;
        } else {
            try {
                return Integer.parseInt(obj.toString());
            } catch (Exception e) {
                log.error(e.getMessage(), e);
                return 0;
            }
        }
    }

    public static Long safeToLong(Object obj1) {
        long result = 0L;
        if (obj1 != null) {
            if (obj1 instanceof BigDecimal) {
                return ((BigDecimal) obj1).longValue();
            }
            if (obj1 instanceof BigInteger) {
                return ((BigInteger) obj1).longValue();
            }
            try {
                result = Long.parseLong(obj1.toString());
            } catch (Exception ignored) {
            }
        }

        return result;
    }

    public static BigInteger safeToBigInteger(Object obj) {
        if (obj instanceof BigInteger) {
            return (BigInteger) obj;
        } else if (!isNull(obj)) {
            try {
                return new BigInteger(obj.toString());
            } catch (Exception e) {
                //                log.error(e.getMessage(), e);
                return BigInteger.ZERO;
            }
        }
        return BigInteger.ZERO;
    }

    public static String makeLikeQuery(String s) {
        if (isNullOrEmpty(s))
            return null;
        s = s.trim().toLowerCase().replace("!", DEFAULT_ESCAPE_CHAR_QUERY + "!")
                .replace("%", DEFAULT_ESCAPE_CHAR_QUERY + "%")
                .replace("_", DEFAULT_ESCAPE_CHAR_QUERY + "_");
        return "%" + s + "%";
    }

    public static String timestampToString(Timestamp fromDate, String pattern) {
        return Optional.ofNullable(fromDate).map(tmp -> {
            SimpleDateFormat sdf = new SimpleDateFormat(pattern);
            return sdf.format(tmp);
        }).orElse("");
    }

    public static String formatNumberWithComma(Double number, String pattern) {
        return Optional.ofNullable(number).map(tmp -> {
            DecimalFormat df = new DecimalFormat(pattern);
            return df.format(tmp);
        }).orElse("");

    }

    public static String dateToString(Date fromDate, String pattern) {
        return Optional.ofNullable(fromDate).map(tmp -> {
            SimpleDateFormat sdf = new SimpleDateFormat(pattern);
            return sdf.format(tmp);
        }).orElse("");
    }

    public static Double safeToDouble(Object obj, Double defaultValue) {
        return Optional.ofNullable(obj).map(o -> {
            try {
                return Double.parseDouble(o.toString());
            } catch (Exception e) {
                //                log.error(e.getMessage(), e);
                return defaultValue;
            }
        }).orElse(defaultValue);
    }

    public static Double safeToDouble(Object obj1) {
        return safeToDouble(obj1, 0.0);
    }

    public static Date safeToDate(Object obj) {
        if (obj instanceof Date) {
            return (Date) obj;
        } else if (obj instanceof LocalDateTime lt) {
            return Date.from(lt.atZone(ZoneId.systemDefault()).toInstant());
        }
        return null;
    }

    public static LocalDate safeToLocalDate(Object obj) {
        if (obj instanceof LocalDate) {
            return (LocalDate) obj;
        }
        return null;
    }

    public static LocalDateTime safeToLocalDateTime(Object obj) {
        if (obj instanceof LocalDateTime) {
            return (LocalDateTime) obj;
        }
        return null;
    }

    public static String date2StringByPattern(Date date, String pattern) {
        if (date == null || DataUtils.isNullOrEmpty(pattern)) {
            return null;
        }

        DateFormat df = new SimpleDateFormat(pattern);
        return df.format(date);
    }

    public static Date stringToDate(String dateStr, String pattern) throws ParseException {
        if (dateStr == null || dateStr.isEmpty())
            return new Date();
        DateFormat sourceFormat = new SimpleDateFormat(pattern);
        return sourceFormat.parse(dateStr);
    }

    public static boolean isNotEquals(Object a, Object b) {
        if (a == null && b == null) {
            return false;
        }
        if (a != null && b != null) {
            Class cA = a.getClass();
            Class cB = b.getClass();
            if (cA == cB) {
                if (a.equals(b)) {
                    return false;
                }
                if (cA.equals(String.class)) {
                    String strA = String.valueOf(a);
                    String strB = String.valueOf(b);
                    if (strA.trim().equals(strB.trim())) {
                        return false;
                    }
                }
            }
            if ((cA.equals(Timestamp.class) && cB.equals(Date.class) && ((Timestamp) a).getTime() == ((Date) b).getTime())
                    || (cA.equals(Date.class) && cB.equals(Timestamp.class) && ((Date) a).getTime() == ((Timestamp) b).getTime())) {
                return false;
            }
        }
        return (a == null || b != null || !a.getClass().equals(String.class) || !String.valueOf(a).trim().isEmpty()) &&
                (b == null || a != null || !b.getClass().equals(String.class) || !String.valueOf(b).trim().isEmpty());
    }

    public static String StringValueOf(Object a) {
        if (a == null) {
            return null;
        }
        Class c = a.getClass();
        if (c.equals(Date.class) || c.equals(Timestamp.class)) {
            return DataUtils.date2StringByPattern((Date) a, "dd/MM/yyyy HH:mm:ss");
        }
        return String.valueOf(a).trim();
    }

    private static String getValueField(Object a, String name) {
        if (a == null || DataUtils.isNullOrEmpty(name)) {
            return null;
        }
        try {
            Field field = a.getClass().getDeclaredField(name);
            field.setAccessible(true);
            Class<?> c = field.getType();
            if (c.equals(Date.class) || c.equals(Timestamp.class)) {
                return DataUtils.date2StringByPattern((Date) field.get(a), "dd/MM/yyyy HH:mm:ss");
            }
            return DataUtils.safeToString(field.get(a));
        } catch (Exception e) {
            log.error("====NoSuchMethodException do not get value=====");
            return null;
        }

    }

    public static String getStrFirstDayOfPreviousMonth() {
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.MONTH, -1);
        return new SimpleDateFormat("yyyy-MM").format(cal.getTime()) + "-01";
    }


    public static Date getDayOf(Date date, int minusMonth, int dayOfMonth) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.add(Calendar.MONTH, minusMonth);
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND, 0);
        cal.set(Calendar.DAY_OF_MONTH, dayOfMonth);
        return cal.getTime();
    }

    private static final ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
    private static final Validator validator = factory.getValidator();

    public static boolean isValidDateTimeFormat(String dateStr) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        try {
            LocalDateTime.parse(dateStr, formatter);
            return true;
        } catch (DateTimeParseException e) {
            return false;
        }
    }

    public static boolean isValidDate(String dateStr) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        sdf.setLenient(false);

        try {
            Date date = sdf.parse(dateStr);
            return true;
        } catch (ParseException e) {
            return false;
        }
    }

    public static boolean isInteger(String str) {
        try {
            Integer.parseInt(str);
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }

    public static boolean isLong(String str) {
        try {
            Long.parseLong(str);
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }

    public static String removeLastComma(String value) {
        if (!isNullOrEmpty(value) && value.endsWith(",")) {
            value = value.substring(0, value.length() - 1);
        }
        return value;
    }

    private static int compareTo(Object a, Object b) throws Exception {
        if (a == null || b == null) {
            return -1;
        }
        Class c = a.getClass();
        if (c.equals(Date.class) || c.equals(Timestamp.class)) {
            return ((Date) a).compareTo((Date) b);
        }
        return safeToString(a).compareTo(safeToString(b));
    }

    public static boolean isLongNumberic(String str) {
        if (str == null || str.isEmpty()) {
            return false;
        }
        try {
            Long.parseLong(str);
        } catch (NumberFormatException e) {
            return false;
        }
        return true;
    }

    public static String normalizeName(String input) {
        // Remove accents (diacritics)
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        String noAccents = pattern.matcher(normalized).replaceAll("");

        // Remove special characters and extra spaces
        String noSpecialChars = noAccents.replaceAll("[^a-zA-Z\\s]", "").replaceAll("\\s+", " ").trim();

        // Convert to uppercase and return
        return noSpecialChars.toUpperCase();
    }

    public static String fullNameVn(String lastName, String middleName, String firstName) {
        return String.format("%s %s %s",
                lastName.trim(),
                Optional.ofNullable(middleName).orElse("").replaceAll("\\s+", " ").trim(),
                firstName.trim());
    }


    public static String fullName(String lastName, String middleName, String firstName) {
        return normalizeName(
                lastName.trim()
                        + Optional.ofNullable(middleName).orElse("").replaceAll("\\s+", "").trim()
                        + firstName.trim());
    }

    public static String removeExtraSpaces(String str) {
        return Optional.ofNullable(str).orElse("").replaceAll("\\s+", " ").trim();
    }

    public static String removeAllSpaces(String str) {
        return Optional.ofNullable(str).orElse("").replaceAll("\\s+", "").trim();
    }
}
