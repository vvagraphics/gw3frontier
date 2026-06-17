package com.gw3frontier.scraper;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

public class NewsScraper {

    // Simple inner data model class to represent a news article
    public static class Article {
        public String id;
        public String title;
        public String url;
        public String imageUrl;
        public String game;

        public Article(String id, String title, String url, String imageUrl, String game) {
            this.id = id;
            this.title = title.replace("\"", "\\\""); // Escape quotes for clean JSON
            this.url = url;
            this.imageUrl = imageUrl;
            this.game = game;
        }

        // Formats the object into a simple JSON block manually to avoid heavy library dependencies
        public String toJsonString() {
            return String.format(
                "  {\n    \"id\": \"%s\",\n    \"title\": \"%s\",\n    \"url\": \"%s\",\n    \"imageUrl\": \"%s\",\n    \"game\": \"%s\"\n  }",
                id, title, url, imageUrl, game
            );
        }
    }

    public static void main(String[] args) {
        System.out.println("Starting automated global news crawl...");
        List<Article> combinedNews = new ArrayList<>();

        // 1. Scrape Guild Wars 3 Carousel
        try {
            System.out.println("Connecting to Guild Wars 3 platform...");
            scrapeGuildWars3(combinedNews);
        } catch (Exception e) {
            System.err.println("Failed to fetch Guild Wars 3 news: " + e.getMessage());
        }

        // 2. Scrape Guild Wars 2 News
        try {
            System.out.println("Connecting to Guild Wars 2 news feed...");
            scrapeGuildWars2(combinedNews);
        } catch (Exception e) {
            System.err.println("Failed to fetch Guild Wars 2 news: " + e.getMessage());
        }

        // 3. Write aggregated array out to your API directory
        writeJsonOutput(combinedNews);
    }

    private static void scrapeGuildWars3(List<Article> list) throws IOException {
        // Fetch and parse the static DOM shell from the landing section
        Document doc = Jsoup.connect("https://www.guildwars3.com/en/#news")
                            .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
                            .timeout(10000)
                            .get();

        // Query the DOM for all carousel slide nodes loaded into the Embla container
        Elements slides = doc.select("div.embla__slide");

        for (Element slide : slides) {
            Element linkElement = slide.selectFirst("a.link");
            Element articleElement = slide.selectFirst("article.news-article");
            Element titleElement = slide.selectFirst("h2.title");
            Element imgElement = slide.selectFirst("img.news-article-image");

            if (linkElement != null && articleElement != null && titleElement != null) {
                String id = articleElement.attr("id");
                String title = titleElement.text();
                String rawHref = linkElement.attr("href");
                String imageUrl = imgElement != null ? imgElement.attr("src") : "";

                // Convert relative links to absolute URLs
                String absoluteUrl = rawHref.startsWith("/") ? "https://www.guildwars3.com" + rawHref : rawHref;

                list.add(new Article(id, title, absoluteUrl, imageUrl, "Guild Wars 3"));
            }
        }
        System.out.println("Successfully indexed GW3 carousel cards.");
    }

    private static void scrapeGuildWars2(List<Article> list) throws IOException {
        // Scrapes the main active tracking index for active GW2 events and logs
        Document doc = Jsoup.connect("https://www.guildwars2.com/en/news/")
                            .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
                            .timeout(10000)
                            .get();

        // Adjust selectors here to match the current target structure of guildwars2.com/news
        Elements articles = doc.select(".blog-post, article"); 

        int count = 0;
        for (Element article : articles) {
            if (count >= 5) break; // Limit legacy items to keep the homepage viewport tidy

            Element titleLink = article.selectFirst("h3 a, h2 a, .entry-title a");
            Element imgElement = article.selectFirst("img");

            if (titleLink != null) {
                String title = titleLink.text();
                String url = titleLink.attr("href");
                String id = "gw2-" + url.hashCode();
                String imageUrl = imgElement != null ? imgElement.attr("src") : "";

                list.add(new Article(id, title, url, imageUrl, "Guild Wars 2"));
                count++;
            }
        }
        System.out.println("Successfully indexed legacy GW2 updates.");
    }

    private static void writeJsonOutput(List<Article> articles) {
        // Safely resolve the relative path out to the shared front-end API layer
        String targetPath = Paths.get("..", "src", "lib", "api", "news.json").toAbsolutePath().normalize().toString();
        File file = new File(targetPath);

        // Ensure parent directories exist
        if (file.getParentFile() != null) {
            file.getParentFile().mkdirs();
        }

        System.out.println("Saving file to destination: " + targetPath);

        try (FileWriter writer = new FileWriter(file)) {
            writer.write("[\n");
            for (int i = 0; i < articles.size(); i++) {
                writer.write(articles.get(i).toJsonString());
                if (i < articles.size() - 1) {
                    writer.write(",\n");
                }
            }
            writer.write("\n]");
            System.out.println("Update complete! Total processed articles: " + articles.size());
        } catch (IOException e) {
            System.err.println("Fatal error writing to destination payload file: " + e.getMessage());
        }
    }
}