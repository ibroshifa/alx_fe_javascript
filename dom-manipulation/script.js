
    document.addEventListener('DOMContentLoaded', () => {
      const quotes = JSON.parse(localStorage.getItem('quotes')) || [
        { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" },
        { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Inspiration" },
        { text: "Your time is limited, don't waste it living someone else's life.", category: "Life" },
        { text: "You miss 100% of the shots you don't take.", category: "Opportunity" },
        ];
    
      const quoteDisplay = document.getElementById('quoteDisplay');
      const newQuoteButton = document.getElementById('newQuote');
      const exportQuotesButton = document.getElementById('exportQuotes');
      const categoryFilter = document.getElementById('categoryFilter');
    
      newQuoteButton.addEventListener('click', showRandomQuote);
      exportQuotesButton.addEventListener('click', exportToJsonFile);
      window.filterQuotes = function() {
        const selectedCategory = categoryFilter.value;
        localStorage.setItem('selectedCategory', selectedCategory);
    
        const filteredQuotes = quotes.filter(quote => selectedCategory === 'all' || quote.category === selectedCategory);
        if (filteredQuotes.length) {
          const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
          const randomQuote = filteredQuotes[randomIndex];
          quoteDisplay.textContent = `"${randomQuote.text}" - ${randomQuote.category}`;
        } else {
          quoteDisplay.textContent = 'No quotes available for this category.';
        }
      } 
    populateCategories();

    function populateCategories() {
    const categories = Array.from(new Set(quotes.map(quote => quote.category)));
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });

    const savedCategory = localStorage.getItem('selectedCategory');
    if (savedCategory) {
      categoryFilter.value = savedCategory;
      filterQuotes();
    }
  }



      function showRandomQuote() {
        const filteredQuotes = quotes.filter(quote => categoryFilter.value === 'all' || quote.category === categoryFilter.value);
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];
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

          if (!Array.from(categoryFilter.options).some(option => option.value === newQuoteCategory)) {
            const option = document.createElement('option');
            option.value = newQuoteCategory;
            option.textContent = newQuoteCategory;
            categoryFilter.appendChild(option);
          }
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
    