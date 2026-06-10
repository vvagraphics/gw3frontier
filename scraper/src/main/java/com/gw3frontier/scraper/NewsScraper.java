package com.gw3frontier.scraper;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class NewsScraper {

    // Placeholder URL until the official GW3 hub goes live later this week
    private static final String TARGET_URL = "https://www.guildwars2.com/en/news/";
    
    // The path where Next.js will look for the data
    private static final String OUTPUT_PATH = "../src/lib/api/news.json";

    public static void main(String[] args) {
        System.out.println("Initiating GW3FRONTIER Data Scraper...");

        try {
            // 1. Connect to the website and grab the HTML
            Document doc = Jsoup.connect(TARGET_URL).get();
            List<Map<String, String>> newsList = new ArrayList<>();

            // 2. Select the article blocks (This CSS selector will update based on the GW3 site)
            Elements articles = doc.select(".blog-post"); 

            for (Element article : articles) {
                Map<String, String> newsData = new HashMap<>();
                
                // Inside the for loop, update these lines:
String title = article.select(".blog-title a").text();
String link = article.select(".blog-title a").attr("href");
String date = article.select(".blog-attribution").text();

                newsData.put("title", title);
                newsData.put("link", link);
                newsData.put("date", date);
                newsData.put("source", "Official");

                newsList.add(newsData);
            }

            // 3. Format as beautiful JSON
            Gson gson = new GsonBuilder().setPrettyPrinting().create();
            String jsonOutput = gson.toJson(newsList);

            // 4. Save directly into the Next.js frontend folder
            try (FileWriter file = new FileWriter(OUTPUT_PATH)) {
                file.write(jsonOutput);
                System.out.println("Success! News data written to: " + OUTPUT_PATH);
            }

        } catch (IOException e) {
            System.err.println("Scraping Protocol Failed: " + e.getMessage());
        }
    }
}