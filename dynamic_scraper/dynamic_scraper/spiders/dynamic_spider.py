import scrapy


class DynamicSpider(scrapy.Spider):
    name = "dynamic_spider"
    start_urls = ["https://example.com/dynamic-page"]  # Replace with your target URL

    def start_requests(self):
        for url in self.start_urls:
            yield scrapy.Request(url, callback=self.parse, meta={"playwright": True})

    async def parse(self, response):
        # Extract the text content or other data you need from the page
        page_title = response.xpath("//title/text()").get()
        print(page_title)

        # You can extract more data from the page as needed
        # For example, to extract all paragraph text:
        paragraphs = response.xpath("//p/text()").getall()
        print(paragraphs)

        # To further follow links dynamically, you can do:
        next_page = response.xpath("//a/@href").get()
        if next_page:
            yield response.follow(next_page, self.parse)
