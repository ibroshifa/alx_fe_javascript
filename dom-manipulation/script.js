
    document.addEventListener('DOMContentLoaded', () => {
      const quotes = JSON.parse(localStorage.getItem('quotes')) || [
        ];
    
      const quoteDisplay = document.getElementById('quoteDisplay');
      const newQuoteButton = document.getElementById('newQuote');
      const exportQuotesButton = document.getElementById('exportQuotes');
    
      newQuoteButton.addEventListener('click', showRandomQuote);
      exportQuotesButton.addEventListener('click', exportToJsonFile);
    
      function showRandomQuote() {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];
        quoteDisplay.textContent = `"${randomQuote.text}" - ${randomQuote.category}`;
        sessionStorage.setItem('lastQuote', JSON.stringify(randomQuote));
      }
    
      window.addQuote = function() {
        const newQuoteText = document.getElementById('newQuoteText').value;
        const newQuoteCategory = document.getElementById('newQuoteCategory').value;
    
        if (newQuoteText && newQuoteCategory) {
          quotes.push({ text: newQuoteText, category: newQuoteCategory });
          saveQuotes();
          document.getElementById('newQuoteText').value = '';
          document.getElementById('newQuoteCategory').value = '';
          alert('New quote added!');
        } else {
          alert('Please enter both quote text and category.');
        }
      }
    
      function saveQuotes() {
        localStorage.setItem('quotes', JSON.stringify(quotes));
      }
    
      function exportToJsonFile() {
        const dataStr = JSON.stringify(quotes, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'quotes.json';
        a.click();
        URL.revokeObjectURL(url);
      }
    
      window.importFromJsonFile = function(event) {
        const fileReader = new FileReader();
        fileReader.onload = function(event) {
          const importedQuotes = JSON.parse(event.target.result);
          quotes.push(...importedQuotes);
          saveQuotes();
          alert('Quotes imported successfully!');
        };
        fileReader.readAsText(event.target.files[0]);
      }
    
      // Load last viewed quote from session storage
      const lastQuote = JSON.parse(sessionStorage.getItem('lastQuote'));
      if (lastQuote) {
        quoteDisplay.textContent = `"${lastQuote.text}" - ${lastQuote.category}`;
      }
    });
    