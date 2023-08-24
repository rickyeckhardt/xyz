#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const parser = require('./parser/xyz');
const { generateHTML, wrapWithHTMLPage } = require('./generator/htmlGenerator');

const inputPath = process.argv[2] || path.join(__dirname, '..', 'test', 'test.xyz');
const outputPath = process.argv[3] || path.join(__dirname, '..', 'build', 'index.html');

async function fetchData(url, take) {
  const response = await axios.get(url);
  if (take && response.data) {
    return response.data[take];
  }
  return response.data;
}

async function processData(component) {
  let data = {};

  if (component.args?.dataUrl) {
    const [url, takeString] = component.args.dataUrl.split(',');
    const take = takeString?.split(':')[1]?.trim();
    data[take] = await fetchData(url, take);
  }

  if (!component.body) {
    return generateHTML(component, data);
  }

  // Map through the body and recursively process each component
  const childrenHtmlPromises = component.body.map(childComponent => processData(childComponent));
  const childrenHtmlContents = await Promise.all(childrenHtmlPromises);

  return generateHTML({
    ...component,
    body: childrenHtmlContents.join('')
  }, data);
}

async function build() {
  // Check if the input and output paths have been provided
  if (!process.argv[2] || !process.argv[3]) {
    console.error('Please provide the input and output paths.');
    return;
  }

  // Read the XYZ content
  const content = fs.readFileSync(inputPath, 'utf-8');

  // Parse the content
  const parsed = parser.parse(content);

  const htmlContent = await processData(parsed);

  // Wrap the generated HTML with the complete page structure
  const fullPageContent = wrapWithHTMLPage(htmlContent);

  // Write the full HTML to the build output path
  fs.writeFileSync(outputPath, fullPageContent, 'utf-8');

  console.log('Build completed successfully!');
}

build();
