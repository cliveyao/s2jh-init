package com.meiyuetao.o2o.core.web;

import java.io.Serializable;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import lab.s2jh.auth.entity.Department;
import lab.s2jh.auth.entity.User;
import lab.s2jh.auth.security.AuthUserHolder;
import lab.s2jh.auth.service.DepartmentService;
import lab.s2jh.auth.service.UserService;
import lab.s2jh.core.entity.BaseEntity;
import lab.s2jh.core.pagination.GroupPropertyFilter;
import lab.s2jh.core.pagination.PropertyFilter;
import lab.s2jh.core.pagination.PropertyFilter.MatchType;
import lab.s2jh.sys.service.DataDictService;
import lab.s2jh.web.action.BaseController;

import org.apache.commons.lang3.StringUtils;
import org.apache.struts2.ServletActionContext;
import org.springframework.beans.factory.annotation.Autowired;

public abstract class MytBaseController<T extends BaseEntity<ID>, ID extends Serializable> extends BaseController<T, ID> {

    @Autowired
    private DataDictService dataDictService;
    @Autowired
    private DepartmentService departmentService;
    @Autowired
    private UserService userService;

    public String getImgUrlPrefix() {
        return "http://img.iyoubox.com/GetFileByCode.aspx?code=";
    }

    public String getKindEditorImageUploadUrl() {
        HttpServletRequest request = ServletActionContext.getRequest();
        return request.getContextPath() + "/pub/image-upload!execute;JSESSIONID=" + request.getSession().getId();
    }

    /**
     * 帮助类方法，方便获取HttpServletRequest
     * 
     * @return
     */
    public HttpServletRequest getRequest() {
        HttpServletRequest request = ServletActionContext.getRequest();
        return request;
    }

    public Map<String, String> getPayModeMap() {
        return dataDictService.findMapDataByPrimaryKey("IYOUBOX_FINANCE_PAY_MODE");
    }

    public Map<String, String> findMapDataByDataDictPrimaryKey(String primaryKey) {
        return dataDictService.findMapDataByPrimaryKey(primaryKey);
    }

    public Map<String, String> getDepartmentsMap() {
        Map<String, String> departmentsMap = new LinkedHashMap<String, String>();
        GroupPropertyFilter groupPropertyFilter = GroupPropertyFilter.buildDefaultAndGroupFilter();
        Iterable<Department> departments = departmentService.findByFilters(groupPropertyFilter);
        Iterator<Department> it = departments.iterator();
        while (it.hasNext()) {
            Department department = it.next();
            departmentsMap.put(department.getId(), department.getDisplay());
        }
        return departmentsMap;
    }

    public Map<Long, String> getUsersMap() {
        Map<Long, String> usersMap = new LinkedHashMap<Long, String>();
        GroupPropertyFilter groupPropertyFilter = GroupPropertyFilter.buildDefaultAndGroupFilter();
        groupPropertyFilter.append(new PropertyFilter(MatchType.EQ, "enabled", Boolean.TRUE));
        Iterable<User> users = userService.findByFilters(groupPropertyFilter);
        Iterator<User> it = users.iterator();
        while (it.hasNext()) {
            User user = it.next();
            usersMap.put(user.getId(), user.getDisplay());
        }
        return usersMap;
    }

    public User getLogonUser() {
        return AuthUserHolder.getLogonUser();
    }

    /**
     * 获取必须请求参数sids，并以逗号","切分转换为Long型数组
     * 
     * @return 主键数组
     */
    public Long[] getSelectSids() {
        String sids = this.getRequest().getParameter("ids");
        if (StringUtils.isBlank(sids)) {
            return new Long[0];
        }
        String[] idArray = sids.split(",");
        Long[] ids = new Long[idArray.length];
        for (int i = 0; i < idArray.length; i++) {
            ids[i] = Long.valueOf(idArray[i]);
        }
        return ids;
    }

}
