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

    public static class Article {
        public String id;
        public String title;
        public String url;
        public String imageUrl;
        public String game;
        public String date;
        public int sortOrder;

        public Article(String id, String title, String url, String imageUrl, String game, String date, int sortOrder) {
            this.id = id;
            this.title = title.replace("\"", "\\\""); 
            this.url = url;
            this.imageUrl = imageUrl;
            this.game = game;
            this.date = date;
            this.sortOrder = sortOrder;
        }

        public String toJsonString() {
            return String.format(
                "  {\n    \"id\": \"%s\",\n    \"title\": \"%s\",\n    \"url\": \"%s\",\n    \"imageUrl\": \"%s\",\n    \"game\": \"%s\",\n    \"date\": \"%s\",\n    \"sortOrder\": %d\n  }",
                id, title, url, imageUrl, game, date, sortOrder
            );
        }
    }

    public static void main(String[] args) {
        System.out.println("Initiating GW3FRONTIER Data Scraper...");
        List<Article> combinedNews = new ArrayList<>();

        // 1. Scrape Guild Wars 3 Carousel (Numbered cleanly based on position)
        try {
            System.out.println("Connecting to Guild Wars 3 platform...");
            scrapeGuildWars3(combinedNews);
        } catch (Exception e) {
            System.err.println("Failed to fetch Guild Wars 3 news: " + e.getMessage());
        }

        // 2. Scrape Guild Wars 2 News (Restoring your exact original date selectors)
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
        Document doc = Jsoup.connect("https://www.guildwars3.com/en/#news")
                            .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
                            .timeout(10000)
                            .get();

        Elements slides = doc.select("div.embla__slide");
        int totalSlides = slides.size();

        // Loop backwards starting from the bottom of the file (the most recent article)
        int currentDisplayOrder = 1;
        for (int i = totalSlides - 1; i >= 0; i--) {
            Element slide = slides.get(i);
            Element linkElement = slide.selectFirst("a.link");
            Element articleElement = slide.selectFirst("article.news-article");
            Element titleElement = slide.selectFirst("h2.title");
            Element imgElement = slide.selectFirst("img.news-article-image");

            if (linkElement != null && articleElement != null && titleElement != null) {
                String id = articleElement.attr("id");
                String title = titleElement.text();
                String rawHref = linkElement.attr("href");
                String imageUrl = imgElement != null ? imgElement.attr("src") : "";
                
                // Creates a clean readable sequence counter for items without dates
                String dateLabel = "by Guild Wars 3 Team Article " + currentDisplayOrder; 

                String absoluteUrl = rawHref.startsWith("/") ? "https://www.guildwars3.com" + rawHref : rawHref;

                list.add(new Article(id, title, absoluteUrl, imageUrl, "Guild Wars 3", dateLabel, currentDisplayOrder));
                currentDisplayOrder++;
            }
        }
        System.out.println("Successfully indexed GW3 carousel cards.");
    }

    private static void scrapeGuildWars2(List<Article> list) throws IOException {
        Document doc = Jsoup.connect("https://www.guildwars2.com/en/news/")
                            .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
                            .timeout(10000)
                            .get();

        Elements articles = doc.select(".blog-post"); 

        int count = 0;
        int order = 1;
        for (Element article : articles) {
            if (count >= 5) break; 

            // Restored your exact original inner CSS element targeting path configurations
            Element titleLink = article.selectFirst(".blog-title a");
            Element dateElement = article.selectFirst(".blog-attribution");
            Element imgElement = article.selectFirst("img");

            if (titleLink != null) {
                String title = titleLink.text();
                String url = titleLink.attr("href");
                String id = "gw2-" + url.hashCode();
                String imageUrl = imgElement != null ? imgElement.attr("src") : "";
                
                // Pulls the full metadata string safely out of the original attribution block
                String date = dateElement != null ? dateElement.text().trim() : "Recent";

                list.add(new Article(id, title, url, imageUrl, "Guild Wars 2", date, order));
                order++;
                count++;
            }
        }
        System.out.println("Successfully indexed legacy GW2 updates.");
    }

    private static void writeJsonOutput(List<Article> articles) {
        String targetPath = Paths.get("..", "src", "lib", "api", "news.json").toAbsolutePath().normalize().toString();
        File file = new File(targetPath);

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