package com.laioffer.job.servlet;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.laioffer.job.entity.ExampleBook;
import org.json.JSONObject;
import org.apache.commons.io.IOUtils;


import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet(name = "ExampleBookServlet", urlPatterns = {"/example_book"})
public class ExampleBookServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        JSONObject jsonRequest = new JSONObject(IOUtils.toString(request.getReader()));
        String title = jsonRequest.getString("title");
        String author = jsonRequest.getString("author");
        String date = jsonRequest.getString("date");
        float price = jsonRequest.getFloat("price");
        String currency = jsonRequest.getString("currency");
        int pages = jsonRequest.getInt("pages");
        String series = jsonRequest.getString("series");
        String language = jsonRequest.getString("language");
        String isbn = jsonRequest.getString("isbn");

        System.out.println("Title is: " + title);
        System.out.println("Author is: " + author);
        System.out.println("Date is: " + date);
        System.out.println("Price is: " + price);
        System.out.println("Currency is: " + currency);
        System.out.println("Pages is: " + pages);
        System.out.println("Series is: " + series);
        System.out.println("Language is: " + language);
        System.out.println("ISBN is: " + isbn);

        response.setContentType("application/json");
        JSONObject jsonResponse = new JSONObject();
        jsonResponse.put("status", "ok");
        response.getWriter().print(jsonResponse); // give back client the jason response
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
//        response.getWriter().print("This is the example book servlet");
        String keyword = request.getParameter("keyword");
        String category = request.getParameter("category");
        String year = request.getParameter("year");

        System.out.println("Keyword is: " + keyword);
        System.out.println("Category is: " + category);
        System.out.println("Year is: " + year);

        response.setContentType("application/json"); // inform client, what type content it is

//        JSONObject json = new JSONObject();
//        json.put("title", "Harry Potter and the Sorcerer's Stone");
//        json.put("author", "JK Rowling");
//        json.put("date", "October 1, 1998");
//        json.put("price", 11.99);
//        json.put("currency", "USD");
//        json.put("pages", 309);
//        json.put("series", "Harry Potter");
//        json.put("language", "en_US");
//        json.put("isbn", "0590353403");
//
//        response.getWriter().print(json);
        ObjectMapper mapper = new ObjectMapper(); // use jackson to convert to json
        ExampleBook input = new ExampleBook("Harry Potter and the Sorcerer's Stone","JK Rowling","October 1, 1998",
                (float) 11.99, "USD",309, "Harry Potter", "en_US", "0590353403");
        String toReturn = mapper.writeValueAsString(input);
        response.getWriter().print(toReturn);
    }
}
