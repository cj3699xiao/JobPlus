package com.laioffer.job.servlet;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.laioffer.job.entity.ResultResponse;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;

@WebServlet(name = "LogoutServlet", urlPatterns = {"/logout"})
public class LogoutServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        // if find this will return the session, if not will not create new one
        if (session != null) {
            session.invalidate(); // delete session
        }

        ObjectMapper mapper = new ObjectMapper();
        response.setContentType("application/json");
        ResultResponse resultResponse = new ResultResponse("OK");
        mapper.writeValue(response.getWriter(), resultResponse);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // normally  we do post, but here we use get for convenience
        HttpSession session = request.getSession(false);
        // if find this will return the session, if not will not create new one
        if (session != null) {
            session.invalidate(); // delete session
        }

        ObjectMapper mapper = new ObjectMapper();
        response.setContentType("application/json");
        ResultResponse resultResponse = new ResultResponse("OK");
        mapper.writeValue(response.getWriter(), resultResponse);
    }
}
