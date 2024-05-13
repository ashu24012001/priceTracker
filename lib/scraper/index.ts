import axios from "axios";
import * as cheerio from "cheerio";
import { extractCurrency, extractPrice, extractDescription } from "../utils";

export async function scrapedAmazonProduct(url: string) {
    if(!url) return;

    //BrightData proxy configuration
    const username = String(process.env.BRIGHT_DATA_USERNAME);
    const password = String(process.env.BRIGHT_DATA_PASSWORD);
    const port = 22225;
    const session_id = (1000000 * Math.random()) | 0;

    const options = {
        auth: {
            username: `${username}-session-${session_id}`,
            password
        },
        host: "brd.superproxy.io",
        port,
        rejectUnauthorized: false
    }

    try {
        const response = await axios.get(url, options);
        const $ = cheerio.load(response.data);

        const title = $("#productTitle").text().trim();
        const currentPrice = extractPrice(
            $(".priceToPay span.a-price-whole"),
            $("a.size.base.a-color-price"),
            $(".a-button-selected .a-color-base")
        );

        const originalPrice = extractPrice(
            $("#priceblock_ourprice"),
            $(".a-price.a-text-price span.a-offscreen"),
            $("#listPrice"),
            $("#priceblock_dealprice"),
            $(".a-size-base.a-color-price")
        );

        const images = 
            $("#imgBlkFront").attr("data-a-dynamic-image") ||
            $("#landingImage").attr("data-a-dynamic-image") || '{}';

        const imageUrls = Object.keys(JSON.parse(images));

        const currency = extractCurrency($(".a-price-symbol"));

        const discountRate = $(".savingsPercentage").text().replace(/[-%]/g, "");

        const description = extractDescription($);

        const outOfStock = $("#availibility span").text().trim().toLowerCase() === "currently unavailable";

        //Construct data object with scraped data
        const data = {
            url,
            currency: currency || "Rs. ",
            image: imageUrls[0],
            title,
            description,
            currentPrice: Number(currentPrice) || Number(originalPrice),
            originalPrice: Number(originalPrice) || Number(currentPrice),
            priceHistory: [],
            discountRate: Number(discountRate),
            category: "category",
            reviewsCount: 100,
            stars: 4.5,
            isOutOfStock: outOfStock,
            lowestPrice: Number(currentPrice) || Number(originalPrice),
            highestPrice: Number(originalPrice) || Number(currentPrice),
            averagePrice: Number(currentPrice) || Number(originalPrice)
        }
        return data;
    } catch(error: any) {
        throw new Error(error.message);
    }
}