import { createClient } from "@supabase/supabase-js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv'

dotenv.config();

// Initialize the Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey)

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


async function fetchData() {
    const { data, error } = await supabase
        .from('quotes')
        .select('*');

    if (error) {
        console.error('Error fetching quotes:', error);
        return null;
    }

    if (data.length === 0) {
        console.warn('No quotes found.');
        return null;
    }

    // Select a random quote
    const randomQuote = data[Math.floor(Math.random() * data.length)];
    // console.log('Fetched random quote:', randomQuote);
    // console.log('Fetched fake quote:', randomQuote.fake_quote);
    // console.log('Fetched real quote:', randomQuote.real_quote);
    return randomQuote;
}

async function fetchRandomQuotes(count) {
    const quotes = new Set();

    console.log('Fetching quotes with count:', count); // Debug log

    while (quotes.size < count) {
        const quote = await fetchData();
        if (quote) {
            quotes.add(JSON.stringify(quote));
        }
    }

    console.log('Fetched unique quotes:', Array.from(quotes).length); // Debug log
    return Array.from(quotes).map(quote => JSON.parse(quote));
}


async function saveQuotesToFile(fetchQuotesFunction, count) {
    try {
        console.log('Starting to save quotes with count:', count); // Debug log

        if (!count || count <= 0) {
            throw new Error('Invalid count. Count must be a positive integer.');
        }

        // Fetch quotes
        const quotes = await fetchQuotesFunction(count);
        console.log('Number of fetched quotes:', quotes.length); // Debug log

        if (quotes.length === 0) {
            throw new Error('No quotes were fetched. Aborting save operation.');
        }

        // Define the output file path
        const outputPath = path.join(__dirname, '../../local_project', 'src/scripts/quotes.js');
        const outputDir = path.dirname(outputPath);

        // Ensure the output directory exists
        if (!fs.existsSync(outputDir)) {
            console.log(`Output directory does not exist. Creating: ${outputDir}`);
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Prepare the content to write
        const fileContent = `const quotes = ${JSON.stringify(quotes, null, 2)};\nexport default quotes;`;

        // Write to the file
        fs.writeFileSync(outputPath, fileContent, 'utf8');
        console.log(`Quotes successfully written to ${outputPath}`);
    } catch (error) {
        console.error('Error saving quotes to file:', error.message);
        throw error; // Re-throw the error so it can be handled by the caller
    }
}

    // for (const quote of quotes) {
    //     // console.log('Fetched real quote:', quote.real_quote);
    //     // console.log('Fetched fake quote:', quote.fake_quote);
    //     console.log(quote);
    // }

    
saveQuotesToFile(fetchRandomQuotes, 3)


export { fetchRandomQuotes, fetchData, saveQuotesToFile };