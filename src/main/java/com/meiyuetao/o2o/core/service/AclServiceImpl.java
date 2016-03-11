package com.meiyuetao.o2o.core.service;

import java.util.Collection;
import java.util.Map;

import lab.s2jh.auth.security.AuthUserHolder;
import lab.s2jh.core.security.AclService;
import lab.s2jh.core.security.AuthContextHolder;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;

@Service("aclService")
public class AclServiceImpl implements AclService {
    
    private static final Logger logger = LoggerFactory.getLogger(AclServiceImpl.class);

    public final static String SUPER_USER_ACL_CODE = "0000000000"; //超级用户标识ACL CODE

    private static Map<String, String> aclTypeMap = Maps.newLinkedHashMap();

    @Override
    public String aclCodeToType(String aclCode) {
        return null;
    }

    @Override
    public Map<String, String> getAclTypeMap() {
        return aclTypeMap;
    }

    @Override
    public Map<String, String> findAclCodesMap() {
        return Maps.newLinkedHashMap();
    }

    public String getAclCodePrefix(String aclCode) {
        if (StringUtils.isBlank(aclCode) || aclCode.equals(SUPER_USER_ACL_CODE)) {
            return "";
        }
        char[] codes = aclCode.toCharArray();
        int endIdx = aclCode.length();
        for (int i = endIdx - 1; i >= 0; i--) {
            endIdx = i;
            if (codes[i] == '0') {
                continue;
            }
            break;
        }
        if (endIdx == 0) {
            return "";
        }
        if (endIdx % 2 == 0) {
            endIdx += 1;
        }
        return StringUtils.substring(aclCode, 0, endIdx + 1);
    }

    public Collection<String> getStatAclCodePrefixs(String aclCode) {
        Collection<String> prefixs = Lists.newArrayList();
        if (StringUtils.isBlank(aclCode) || aclCode.equals(SUPER_USER_ACL_CODE)) {
            return prefixs;
        }
        prefixs.add(getAclCodePrefix(aclCode));
        return prefixs;
    }

    @Override
    public void validateAuthUserAclCodePermission(String... dataAclCodes) {
        for (String dataAclCode : dataAclCodes) {
            if (StringUtils.isBlank(dataAclCode)) {
                return;
            }
        }
        Collection<String> userAclCodePrefixs = AuthContextHolder.getAuthUserDetails().getAclCodePrefixs();
        if (CollectionUtils.isEmpty(userAclCodePrefixs)) {
            return;
        }
        for (String userAclCodePrefix : userAclCodePrefixs) {
            if (StringUtils.isBlank(userAclCodePrefix)) {
                return;
            }
        }
        for (String dataAclCode : dataAclCodes) {
            for (String userAclCodePrefix : userAclCodePrefixs) {
                if (dataAclCode.startsWith(userAclCodePrefix)) {
                    return;
                }
            }
        }
        if (logger.isWarnEnabled()) {
            logger.warn("No acl match for user acl code prefix: {}, data acl code: {}",
                    StringUtils.join(userAclCodePrefixs, ","), StringUtils.join(dataAclCodes, ","));
        }
        throw new AccessDeniedException("数据访问权限不足");
    }

    @Override
    public String getLogonUserAclCodePrefix() {
        return getAclCodePrefix(AuthUserHolder.getLogonUser().getAclCode());
    }
}