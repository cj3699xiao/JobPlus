package com.laioffer.job.external;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.laioffer.job.entity.Item;
import org.apache.http.HttpEntity;
//import org.apache.http.HttpResponse;
//import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;


import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.*;

public class GitHubClient { // open api from github   -> to find job
    private static final String URL_TEMPLATE = "https://jobs.github.com/positions.json?description=%s&lat=%s&long=%s";
    private static final String DEFAULT_KEYWORD = "developer";

    public List<Item> search(double lat, double lon, String keyword) {
        if (keyword == null) {
            keyword = DEFAULT_KEYWORD;
        }

        try {
            keyword = URLEncoder.encode(keyword, "UTF-8");
            // "hello world" => "hello%20world" , ensure keyword is qualified

        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }

        String url = String.format(URL_TEMPLATE, keyword, lat, lon);

        CloseableHttpClient httpClient = HttpClients.createDefault();
        // create a client to contact with GitHub, and this client will get information from Github server
        // then we use the data from github. to generate our data!
        // anonymous class, like comparator
        ResponseHandler<List<Item>> responseHandler = response -> {
            // create a handler that could handle our corner case
            // if return not 200, means not success, return emptyList
            if (response.getStatusLine().getStatusCode() != 200) {
                return Collections.emptyList();
            }
            HttpEntity entity = response.getEntity();
            // this is content getter! if use just google what should be user/ read source code

            // if get null, return emptyList
            if (entity == null) {
                return Collections.emptyList();
            }
            // else is correct, return a List<item>
            ObjectMapper mapper = new ObjectMapper();
//            Item[] array = mapper.readValue(entity.getContent(), Item[].class);
//            return Arrays.asList(array);

            List<Item> items = Arrays.asList(mapper.readValue(entity.getContent(), Item[].class));
            extractKeywords(items); // use MonkeyLearn to extract keywords
            return items;
        };

        try {
            return httpClient.execute(new HttpGet(url), responseHandler);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return Collections.emptyList();

    }

    private void extractKeywords(List<Item> items) {
//        MonkeyLearnClient monkeyLearnClient = new MonkeyLearnClient();
//
//        if(items.isEmpty()) return;
//
//        List<String> descriptions = new ArrayList<>();
//        for (Item item : items) {
//            descriptions.add(item.getDescription());
//        }
//
//        List<Set<String>> keywordList = monkeyLearnClient.extract(descriptions);
//
//        for (int i = 0; i < items.size(); i++) {
//            items.get(i).setKeywords(keywordList.get(i));
//        }
        MonkeyLearnClient monkeyLearnClient = new MonkeyLearnClient();
        List<String> descriptions = new ArrayList<>();
        for(Item item : items) {
            descriptions.add(item.getDescription()); // if there is no descriptions match with favors , size == 0
        }

        List<String> titles = new ArrayList<>();
        for(Item item : items) { // if description doesn't work , we use title as description instead
            titles.add(item.getTitle());
        }

        List<Set<String>> keywordList = monkeyLearnClient.extract(descriptions);

        if (keywordList.isEmpty()) {
            keywordList = monkeyLearnClient.extract(titles);
        }

        for(int i = 0; i < keywordList.size(); i++){
            items.get(i).setKeywords(keywordList.get(i));
        }




    }
}
