package com.laioffer.job.entity;

public class ExampleBook {
    public String title;
    public String author;
    public String date;
    public float price;
    public String currency;
    public int pages;
    public String series;
    public String language;
    public String isbn;
    public ExampleBook(String title, String author, String date, float price, String currency, int pages, String series, String language, String isbn) {
        this.title = title;
        this.author = author;
        this.date = date;
        this.price = price;
        this.currency = currency;
        this.pages = pages;
        this.series = series;
        this.language = language;
        this.isbn = isbn;
    }

//     json.put("title", "Harry Potter and the Sorcerer's Stone");
//        json.put("author", "JK Rowling");
//        json.put("date", "October 1, 1998");
//        json.put("price", 11.99);
//        json.put("currency", "USD");
//        json.put("pages", 309);
//        json.put("series", "Harry Potter");
//        json.put("language", "en_US");
//        json.put("isbn", "0590353403");
}
