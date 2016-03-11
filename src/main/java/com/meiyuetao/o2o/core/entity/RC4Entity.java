package com.meiyuetao.o2o.core.entity;

import com.thoughtworks.xstream.core.util.Base64Encoder;

public class RC4Entity {

    public static String decry_RC4_byte(byte[] data, String key) {
        if (data == null || key == null) {
            return null;
        }
        return asString(RC4Base(data, key));
    }

    public static String decry_RC4_string(String data, String key) {
        if (data == null || key == null) {
            return null;
        }
        return new String(RC4Base(new Base64Encoder().decode(data), key));
    }

    public static byte[] encry_RC4_byte(String data, String key) {
        if (data == null || key == null) {
            return null;
        }
        byte b_data[] = data.getBytes();
        return RC4Base(b_data, key);
    }

    public static String encry_RC4_string(String data, String key) {
        if (data == null || key == null) {
            return null;
        }
        return new Base64Encoder().encode(encry_RC4_byte(data, key));
    }

    private static String asString(byte[] buf) {
        StringBuffer strbuf = new StringBuffer(buf.length);
        for (int i = 0; i < buf.length; i++) {
            strbuf.append((char) buf[i]);
        }
        return strbuf.toString();
    }

    private static byte[] initKey(String aKey) {
        byte[] b_key = aKey.getBytes();
        byte state[] = new byte[256];

        for (int i = 0; i < 256; i++) {
            state[i] = (byte) i;
        }
        int index1 = 0;
        int index2 = 0;
        if (b_key == null || b_key.length == 0) {
            return null;
        }
        for (int i = 0; i < 256; i++) {
            index2 = ((b_key[index1] & 0xff) + (state[i] & 0xff) + index2) & 0xff;
            byte tmp = state[i];
            state[i] = state[index2];
            state[index2] = tmp;
            index1 = (index1 + 1) % b_key.length;
        }
        return state;
    }

    private static byte[] RC4Base(byte[] input, String mKkey) {
        int x = 0;
        int y = 0;
        byte key[] = initKey(mKkey);
        int xorIndex;
        byte[] result = new byte[input.length];

        for (int i = 0; i < input.length; i++) {
            x = (x + 1) & 0xff;
            y = ((key[x] & 0xff) + y) & 0xff;
            byte tmp = key[x];
            key[x] = key[y];
            key[y] = tmp;
            xorIndex = ((key[x] & 0xff) + (key[y] & 0xff)) & 0xff;
            result[i] = (byte) (input[i] ^ key[xorIndex]);
        }
        return result;
    }

    public static void main(String[] args) {
        String keyString = "dY6IoAHSC8qYuEgLO5hZVCTj4y3fuPf5SNwQZ5JKxH4SJcUgIYc8Mm1Zo57QsvRBwLDFzhukxrYrqsWncGaKqvmH10o5OkQTHYzwH06fSclghAm7W10jQ4WS";
        String rc4 = RC4Entity.encry_RC4_string("17090109981", keyString);
        System.out.println(rc4);
        System.out.println(RC4Entity.decry_RC4_string(rc4, keyString));

    }
}