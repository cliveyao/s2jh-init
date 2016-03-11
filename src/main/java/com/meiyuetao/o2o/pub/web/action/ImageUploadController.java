package com.meiyuetao.o2o.pub.web.action;

import java.io.File;
import java.io.IOException;
import java.io.PrintStream;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import lab.s2jh.core.annotation.MetaData;
import lab.s2jh.core.web.json.HibernateAwareObjectMapper;
import lab.s2jh.ctx.DynamicConfigService;

import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpEntity;
import org.apache.http.HttpStatus;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.entity.mime.content.FileBody;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.apache.struts2.ServletActionContext;
import org.apache.struts2.dispatcher.multipart.MultiPartRequestWrapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.google.common.collect.Maps;
import com.opensymphony.xwork2.ActionSupport;
import com.opensymphony.xwork2.inject.Inject;

@MetaData("ImageUploadController")
public class ImageUploadController extends ActionSupport {

    private static final long serialVersionUID = 1L;

    private final Logger logger = LoggerFactory.getLogger(ImageUploadController.class);

    protected long imageUploadMaxSize;

    @Autowired
    private DynamicConfigService dynamicConfigService;

    @Inject("struts.image.upload.maxSize")
    public void setImageUploadMaxSize(String imageUploadMaxSize) {
        this.imageUploadMaxSize = Long.parseLong(imageUploadMaxSize);
    }

    public String create() throws Exception {
        return execute();
    }

    @Override
    public String execute() throws Exception {
        Map<String, Object> retMap = Maps.newHashMap();
        CloseableHttpClient httpclient = HttpClients.createDefault();
        try {
            HttpServletRequest request = ServletActionContext.getRequest();
            MultiPartRequestWrapper wrapper = (MultiPartRequestWrapper) request;
            File file = wrapper.getFiles("imgFile")[0];
            if (file.length() > imageUploadMaxSize) {
                retMap.put("error", 1);
                retMap.put("message", "文件大小超过限制:" + imageUploadMaxSize);
            } else {
                String showWater = request.getParameter("showWater");
                String targetURL = dynamicConfigService.getString("cfg.image.upload.url", "http://img5.iyoubox.com/PutLocalFile.aspx");
                if (StringUtils.isNotBlank(showWater)) {
                    targetURL = targetURL + "?showWater=" + showWater;
                }
                HttpPost post = new HttpPost(targetURL);
                FileBody fileBody = new FileBody(file);
                HttpEntity httpEntity = MultipartEntityBuilder.create().addPart("file", fileBody).build();
                post.setEntity(httpEntity);
                CloseableHttpResponse httpResponse = httpclient.execute(post);
                int status = httpResponse.getStatusLine().getStatusCode();
                String responseBody = EntityUtils.toString(httpResponse.getEntity());
                if (HttpStatus.SC_OK == status) {
                    logger.debug("Upload complete, response={}", responseBody);
                    String message = responseBody.substring(2);
                    if (responseBody.startsWith("1+")) {
                        retMap.put("error", 0);
                        retMap.put("url", "http://img.meiyuetao.com/" + message);
                        retMap.put("md5", message);
                    } else {
                        retMap.put("error", 1);
                        retMap.put("message", message);
                    }
                } else {
                    logger.error("Upload failed, status={}, response={}", status, responseBody);
                    retMap.put("error", 1);
                    retMap.put("message", "Error Status:" + status);
                }
                httpResponse.close();
            }
        } catch (Exception ex) {
            retMap.put("error", 1);
            retMap.put("message", "System Errror");
            logger.error("error.file.upload", ex);
        } finally {
            httpclient.close();
        }
        try {
            HttpServletResponse response = ServletActionContext.getResponse();
            response.setContentType("text/html;charset=UTF-8");
            PrintStream out = new PrintStream(response.getOutputStream());
            String ret = HibernateAwareObjectMapper.getInstance().writeValueAsString(retMap);
            out.println(ret);
            out.close();
        } catch (IOException e) {
            logger.error("error.servlet.output", e);
        }
        return null;
    }
}