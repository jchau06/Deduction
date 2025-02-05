import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import dotenv from 'dotenv'

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_KEY,
});

// Supabase client setup
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey)

async function fakeQuote(author) {
  const responseGenerated = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: `Create a fake quote that ${author} might have said. Add a quote ending tag depicting who said the quote. Ensure that the characters generated are less than or equal to 135.`
      }
    ]
  });

  return responseGenerated.choices[0].message.content;
}

async function realQuote(author) {
  const responseTrue = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: `Create a quote that ${author} said in reality. Add a quote ending tag depicting who said the quote. Ensure that the characters generated are less than or equal to 135.`
      }
    ]
  });

  return responseTrue.choices[0].message.content;
}

// Store authors we've already processed
const usedAuthors = new Set();

async function generatePersonsSet() {
  try {
    // Query the 'author' column from the 'quotes' table
    const { data, error } = await supabase
      .from('quotes')
      .select('author');

    if (error) {
      console.error("Error fetching authors from database:", error.message);
      return;
    }

    if (!data || data.length === 0) {
      console.warn("No authors found in the database.");
      return;
    }

    // Add each unique author to the Set
    data.forEach(entry => {
      if (entry.author) { // Ensure 'author' is not null or undefined
        usedAuthors.add(entry.author);
      }
    });

    console.log("Authors successfully loaded into the Set:", Array.from(usedAuthors));
  } catch (err) {
    console.error("Unexpected error while fetching authors:", err.message);
  }
}

async function generatePerson(authorsSet) {
  let author;

  while (true) {
    const responseGenerated = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `Name a famous, quotable person from history. Only write their name. Ensure that they have real quotes. Avoid figures in this list: ${Array.from(authorsSet).join(", ")}.`
        }
      ]
    });

    author = responseGenerated.choices[0].message.content.trim();

    // Check if the author has already been used
    if (!usedAuthors.has(author)) {
      usedAuthors.add(author); // Mark this author as used
      break;
    }

    console.log(`Duplicate author found: ${author}. Retrying...`);
  }

  console.log(`Generated author: ${author}`);
  return author;
}

async function saveQuotesToDatabase(author) {
  try {
    const fake = await fakeQuote(author);
    const real = await realQuote(author);

    const newEntry = {
      author: author,
      fake_quote: fake,
      real_quote: real,
    };

    // Insert data into Supabase
    const { data, error } = await supabase
      .from("quotes")
      .insert([newEntry])
      .select();

    if (error) {
      console.error("Error inserting data:", error.message);
    } else {
      console.log("Data successfully inserted:", data);
    }
  } catch (error) {
    console.error("Error generating or saving quotes:", error);
  }
}

// Usage


(async () => {
  await generatePersonsSet()
  const authorName = await generatePerson(usedAuthors);
  await saveQuotesToDatabase(authorName);
})();
