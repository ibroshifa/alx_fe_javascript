
    document.addEventListener('DOMContentLoaded', () => {
      let quotes = JSON.parse(localStorage.getItem('idquotes')) || [
        
        ];
       
      const API_URL = 'https://run.mocky.io/v3/2b053ab6-b751-482c-8b24-cc012b09b7fc';
       // api with id 1-13   https://run.mocky.io/v3/53dbd273-da11-42ef-9988-5c57d2bd39d9
      // api with id 14-18    https://run.mocky.io/v3/2b053ab6-b751-482c-8b24-cc012b09b7fc
     //api with id 19-13 https://run.mocky.io/v3/2dbc6781-15b3-4732-a499-98ea54b4bdc3
     //api with id 22-24  https://run.mocky.io/v3/9e4a0e9c-87b1-43f0-8e5b-47c1c0e62745
     const quoteDisplay = document.getElementById('quoteDisplay');
      const newQuoteButton = document.getElementById('newQuote');
      const exportQuotesButton = document.getElementById('exportQuotes');
      const fetchQuotesFromServerButton = document.getElementById('syncQuotes');
      const categoryFilter = document.getElementById('categoryFilter');
      const notification = document.getElementById('notification');
      const conflictNotification = document.getElementById('conflictNotification');
      
      newQuoteButton.addEventListener('click', showRandomQuote);
      exportQuotesButton.addEventListener('click', exportToJsonFile);
      fetchQuotesFromServerButton.addEventListener('click', fetchQuotesFromServer);


      window.filterQuotes = function() {
        const selectedCategory = categoryFilter.value;
        localStorage.setItem('selectedCategory', selectedCategory);
    
        const filteredQuotes = quotes.filter(quote => selectedCategory === 'all' || quote.category === selectedCategory);
        if (filteredQuotes.length) {
          const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
          const randomQuote = filteredQuotes[randomIndex];
          quoteDisplay.innerHTML = `"${randomQuote.text}" - ${randomQuote.category}`;
        } else {
          quoteDisplay.innerHTML = 'No quotes available for this category.';
        }
      } 
    
    populateCategories();
    periodicSync();
    function populateCategories() {
    const categories = Array.from(new Set(quotes.map(quote => quote.category)));
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.innerHTML = category;
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
        quoteDisplay.innerHTML = `"${randomQuote.text}" - ${randomQuote.category}`;
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
            option.innerHTML = newQuoteCategory;
            categoryFilter.appendChild(option);
          }
        } else {
          alert('Please enter both quote text and category.');
        }
      }
    
      function saveQuotes() {
        localStorage.setItem('idquotes', JSON.stringify(quotes));
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
    
    
      async function fetchQuotesFromServer() {
        try {//https://jsonplaceholder.typicode.com/posts"
          const response = await fetch('https://run.mocky.io/v3/2b053ab6-b751-482c-8b24-cc012b09b7fc');
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const serverQuotes = await response.json();
          quotes = mergeQuotes(quotes, serverQuotes);
          localStorage.setItem('idquotes', JSON.stringify(quotes));
          saveQuotes();
          notification.innerHTML = 'Quotes synced with server!';
          notification.style.display = 'block';
          setTimeout(() => notification.style.display = 'none', 3000);
        } catch (error) {
          console.error('There was a problem fetching quotes:', error);
          notification.innerHTML = 'Failed to sync quotes with server.';
          notification.style.display = 'block';
          setTimeout(() => notification.style.display = 'none', 3000);
        }
      }
    
      function mergeQuotes(localQuotes, serverQuotes) {
        const serverQuotesMap = new Map(serverQuotes.map(q => [q.id, q]));

        let newAdded = localQuotes.length;
        let updated = 0;
        // serverQuotesMap.forEach(e=>{
        //   updated +=updated;
        // });
        localQuotes.forEach(localQuote => {
          if (!(serverQuotesMap.has(localQuote.id))) {
            serverQuotesMap.set(localQuote.id, localQuote);
            
          }else{
            updated = updated+1;
          }
        }); 
        newAdded = serverQuotes.length- updated;
       // updated = serverQuotesMap.length - newAdded;
        conflictNotification.innerHTML = `${newAdded} newly added and ${updated} Updated!`;
        conflictNotification.style.display = 'block';
            setTimeout(() => conflictNotification.style.display = 'none', 3000);
        return Array.from(serverQuotesMap.values());
      }
    
      function periodicSync() {
        setInterval(fetchQuotesFromServer, 30000);  // Sync every 30 seconds
      }
      // Load last viewed quote from session storage
      const lastQuote = JSON.parse(sessionStorage.getItem('lastQuote'));
      if (lastQuote) {
        quoteDisplay.innerHTML = `"${lastQuote.text}" - ${lastQuote.category}`;
      }
    });
    