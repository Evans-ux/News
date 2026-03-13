const title = "Study that shows evolution is not random and can be predicted called 'nothing short of revolutionary' - Earth.com";
const apiKey = "3f71a8eea3ae4686a86dfba0aba7cab5";

async function testFetch() {
  console.log("Testing with quotes:");
  const url1 = `https://newsapi.org/v2/everything?q="${encodeURIComponent(title)}"&apiKey=${apiKey}`;
  const res1 = await fetch(url1);
  const data1 = await res1.json();
  console.log(`Results with quotes:`, data1.totalResults);

  console.log("\nTesting without quotes:");
  const url2 = `https://newsapi.org/v2/everything?q=${encodeURIComponent(title)}&apiKey=${apiKey}`;
  const res2 = await fetch(url2);
  const data2 = await res2.json();
  console.log(`Results without quotes:`, data2.totalResults);
  
  // Try short title
  const shortTitle = title.split(' ').slice(0, 5).join(' ');
  console.log(`\nTesting short title: ${shortTitle}`);
  const url3 = `https://newsapi.org/v2/everything?q="${encodeURIComponent(shortTitle)}"&apiKey=${apiKey}`;
  const res3 = await fetch(url3);
  const data3 = await res3.json();
  console.log(`Results with short title quotes:`, data3.totalResults);
  
  if (data3.articles && data3.articles.length > 0) {
    console.log("First match title:", data3.articles[0].title);
  }
}

testFetch();
