document.addEventListener('DOMContentLoaded', () => {
    const quotes = [
      { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" },
      { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Motivation" },
      { text: "You miss 100% of the shots you don't take.", category: "Opportunity" },
      { text: "In the end, it's not the years in your life that count. It's the life in your years.", category: "Life" },
    ];
  
    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteButton = document.getElementById('newQuote');
  
    newQuoteButton.addEventListener('click', showRandomQuote);
  
    function showRandomQuote() {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      const randomQuote = quotes[randomIndex];
      quoteDisplay.textContent = `"${randomQuote.text}" - ${randomQuote.category}`;
    }
  
    window.addQuote = function() {
      const newQuoteText = document.getElementById('newQuoteText').value;
      const newQuoteCategory = document.getElementById('newQuoteCategory').value;
  
      if (newQuoteText && newQuoteCategory) {
        quotes.push({ text: newQuoteText, category: newQuoteCategory });
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        alert('New quote added!');
      } else {
        alert('Please enter both quote text and category.');
      }
    }
  });
  